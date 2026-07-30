import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  ADDABLE_SECTION_TYPES,
  PortfolioData,
  PortfolioSection,
  PortfolioSectionType,
  PortfolioTheme,
  createBlankPortfolio,
  createDefaultSection,
  mapServerPortfolio,
  uid,
} from '../models/portfolio.model';

const AUTOSAVE_DEBOUNCE_MS = 1000;

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';
export type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

function structuredCloneSafe<T>(value: T): T {
  return typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

@Injectable({ providedIn: 'root' })
export class PortfolioStoreService {
  private api  = inject(ApiService);
  private auth = inject(AuthService);

  readonly portfolio       = signal<PortfolioData | null>(null);
  readonly loading         = signal(false);
  readonly saveState       = signal<SaveState>('idle');
  readonly usernameStatus  = signal<UsernameStatus>('idle');

  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  /** Loads the caller's own portfolio (draft) from the server, or starts a blank one. */
  async load(): Promise<void> {
    if (!this.auth.isLoggedIn()) return;
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.api.get<any>('portfolio'));
      const doc = res.data?.portfolio;
      this.portfolio.set(doc ? this.fromServer(doc) : createBlankPortfolio());
    } catch {
      this.portfolio.set(createBlankPortfolio());
    } finally {
      this.loading.set(false);
    }
  }

  private fromServer(doc: any): PortfolioData {
    return mapServerPortfolio(doc, 'draft');
  }

  private scheduleAutosave(): void {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveState.set('saving');
    this.saveTimer = setTimeout(() => void this.persist(), AUTOSAVE_DEBOUNCE_MS);
  }

  private async persist(): Promise<void> {
    const p = this.portfolio();
    if (!p || !p.username) { this.saveState.set('idle'); return; }
    try {
      const res = await firstValueFrom(this.api.put<any>('portfolio', p));
      const saved = res.data?.portfolio;
      if (saved) this.portfolio.set(this.fromServer(saved));
      this.saveState.set('saved');
    } catch {
      this.saveState.set('error');
    }
  }

  /** Flushes any pending debounced save immediately. Used before publish/navigation. */
  async saveNow(): Promise<boolean> {
    if (this.saveTimer) { clearTimeout(this.saveTimer); this.saveTimer = null; }
    const p = this.portfolio();
    if (!p || !p.username) return false;
    this.saveState.set('saving');
    try {
      const res = await firstValueFrom(this.api.put<any>('portfolio', p));
      const saved = res.data?.portfolio;
      if (saved) this.portfolio.set(this.fromServer(saved));
      this.saveState.set('saved');
      return true;
    } catch {
      this.saveState.set('error');
      return false;
    }
  }

  async publish(): Promise<boolean> {
    const saved = await this.saveNow();
    if (!saved) return false;
    try {
      const res = await firstValueFrom(this.api.post<any>('portfolio/publish', {}));
      const doc = res.data?.portfolio;
      if (doc) this.portfolio.set(this.fromServer(doc));
      return true;
    } catch { return false; }
  }

  async unpublish(): Promise<boolean> {
    try {
      const res = await firstValueFrom(this.api.post<any>('portfolio/unpublish', {}));
      const doc = res.data?.portfolio;
      if (doc) this.portfolio.set(this.fromServer(doc));
      return true;
    } catch { return false; }
  }

  async checkUsername(username: string): Promise<void> {
    const u = username.trim().toLowerCase();
    if (!u || u.length < 3) { this.usernameStatus.set('idle'); return; }
    if (!/^[a-z0-9_-]{3,50}$/.test(u)) { this.usernameStatus.set('invalid'); return; }
    if (u === this.portfolio()?.username) { this.usernameStatus.set('idle'); return; }
    this.usernameStatus.set('checking');
    try {
      const res = await firstValueFrom(this.api.get<any>(`portfolio/check-username/${u}`));
      this.usernameStatus.set(res.data?.available ? 'available' : 'taken');
    } catch { this.usernameStatus.set('idle'); }
  }

  /** Applies `fn` to the current portfolio (no-op if not loaded) and schedules an autosave. */
  private mutate(fn: (p: PortfolioData) => PortfolioData): void {
    let changed = false;
    this.portfolio.update(p => {
      if (!p) return p;
      changed = true;
      return fn(p);
    });
    if (changed) this.scheduleAutosave();
  }

  // ── Identity ─────────────────────────────────────────────────────────────
  updateIdentity(patch: Partial<PortfolioData>): void {
    this.mutate(p => ({ ...p, ...patch }));
  }

  // ── Theme ────────────────────────────────────────────────────────────────
  updateTheme(patch: Partial<PortfolioTheme>): void {
    this.mutate(p => ({ ...p, theme: { ...p.theme, ...patch } }));
  }

  // ── Sections ─────────────────────────────────────────────────────────────
  readonly addableSectionTypes = ADDABLE_SECTION_TYPES;

  addSection(type: PortfolioSectionType): void {
    this.mutate(p => ({ ...p, sections: [...p.sections, createDefaultSection(type)] }));
  }

  removeSection(id: string): void {
    this.mutate(p => ({ ...p, sections: p.sections.filter(s => s.id !== id) }));
  }

  duplicateSection(id: string): void {
    this.mutate(p => {
      const idx = p.sections.findIndex(s => s.id === id);
      if (idx === -1) return p;
      const source = p.sections[idx];
      const clone: PortfolioSection = { ...source, id: uid(source.type), config: structuredCloneSafe(source.config) };
      const sections = [...p.sections];
      sections.splice(idx + 1, 0, clone);
      return { ...p, sections };
    });
  }

  reorderSections(newOrder: PortfolioSection[]): void {
    this.mutate(p => ({ ...p, sections: newOrder }));
  }

  toggleSectionEnabled(id: string): void {
    this.mutate(p => ({ ...p, sections: p.sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s) }));
  }

  updateSectionConfig<T extends object>(id: string, patch: Partial<T>): void {
    this.mutate(p => ({
      ...p,
      sections: p.sections.map(s => s.id === id ? { ...s, config: { ...s.config, ...patch } } : s),
    }));
  }
}
