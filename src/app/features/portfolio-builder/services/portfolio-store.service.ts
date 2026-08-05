import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  ADDABLE_SECTION_TYPES,
  PortfolioBlockStyle,
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
const MAX_HISTORY = 30;

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

  /** Currently selected block in the canvas — drives the right property panel. */
  readonly selectedSectionId = signal<string | null>(null);
  readonly selectedSection = computed(() => {
    const id = this.selectedSectionId();
    return id ? this.portfolio()?.sections.find(s => s.id === id) ?? null : null;
  });

  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  // ── Session-only undo/redo — a stack of full section-array snapshots ───────
  private undoStack: PortfolioSection[][] = [];
  private redoStack: PortfolioSection[][] = [];
  readonly canUndo = signal(false);
  readonly canRedo = signal(false);

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

  /** Applies `fn` to the current portfolio (no-op if not loaded), records undo history, and schedules an autosave. */
  private mutate(fn: (p: PortfolioData) => PortfolioData, recordHistory = true): void {
    let changed = false;
    this.portfolio.update(p => {
      if (!p) return p;
      changed = true;
      if (recordHistory) this.pushHistory(p.sections);
      return fn(p);
    });
    if (changed) this.scheduleAutosave();
  }

  private pushHistory(sections: PortfolioSection[]): void {
    this.undoStack.push(structuredCloneSafe(sections));
    if (this.undoStack.length > MAX_HISTORY) this.undoStack.shift();
    this.redoStack = [];
    this.canUndo.set(true);
    this.canRedo.set(false);
  }

  undo(): void {
    const p = this.portfolio();
    const prev = this.undoStack.pop();
    if (!p || !prev) return;
    this.redoStack.push(structuredCloneSafe(p.sections));
    this.portfolio.set({ ...p, sections: prev });
    this.canUndo.set(this.undoStack.length > 0);
    this.canRedo.set(true);
    this.scheduleAutosave();
  }

  redo(): void {
    const p = this.portfolio();
    const next = this.redoStack.pop();
    if (!p || !next) return;
    this.undoStack.push(structuredCloneSafe(p.sections));
    this.portfolio.set({ ...p, sections: next });
    this.canRedo.set(this.redoStack.length > 0);
    this.canUndo.set(true);
    this.scheduleAutosave();
  }

  // ── Selection ────────────────────────────────────────────────────────────
  selectSection(id: string | null): void {
    this.selectedSectionId.set(id);
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
    const sections = this.portfolio()?.sections ?? [];
    const target = sections.find(s => s.id === id);
    // Hero is locked/singular — but if data ever ends up with more than one
    // (e.g. from a since-fixed duplicate bug), allow removing the extras so
    // users aren't stuck; only the sole remaining hero stays undeletable.
    if (target?.type === 'hero' && sections.filter(s => s.type === 'hero').length <= 1) return;
    this.mutate(p => ({ ...p, sections: p.sections.filter(s => s.id !== id) }));
    if (this.selectedSectionId() === id) this.selectedSectionId.set(null);
  }

  duplicateSection(id: string): void {
    this.mutate(p => {
      const idx = p.sections.findIndex(s => s.id === id);
      if (idx === -1) return p;
      const source = p.sections[idx];
      if (source.type === 'hero') return p; // hero is locked/singular — never duplicable
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

  private configHistoryOpen = false;
  private configHistoryTimer: ReturnType<typeof setTimeout> | null = null;

  /** Keystroke-level edits — coalesces a whole burst of typing into a single undo step
   *  instead of recording history on every character. */
  updateSectionConfig<T extends object>(id: string, patch: Partial<T>): void {
    if (!this.configHistoryOpen) {
      const p = this.portfolio();
      if (p) this.pushHistory(p.sections);
      this.configHistoryOpen = true;
    }
    if (this.configHistoryTimer) clearTimeout(this.configHistoryTimer);
    this.configHistoryTimer = setTimeout(() => { this.configHistoryOpen = false; }, 800);

    this.mutate(p => ({
      ...p,
      sections: p.sections.map(s => s.id === id ? { ...s, config: { ...s.config, ...patch } } : s),
    }), false);
  }

  updateSectionStyle(id: string, patch: Partial<PortfolioBlockStyle>): void {
    this.mutate(p => ({
      ...p,
      sections: p.sections.map(s => s.id === id ? { ...s, style: { ...s.style, ...patch } } : s),
    }));
  }
}
