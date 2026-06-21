import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createBlankBiodata } from '../data/biodata-defaults';
import {
  BiodataData,
  BiodataEducationItem,
  BiodataFamily,
  BiodataPartnerPreferences,
  BiodataPersonal,
  BiodataContact,
  BiodataProfessional,
  BiodataSectionId,
  BiodataTemplateId,
  BiodataType,
} from '../models/biodata.model';

const BIODATAS_KEY = 'bd_biodatas_v1';
const ACTIVE_ID_KEY = 'bd_active_id_v1';
const AUTOSAVE_DEBOUNCE_MS = 600;

function uid(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function cloneSafe<T>(value: T): T {
  try {
    return structuredClone(value);
  } catch {
    return JSON.parse(JSON.stringify(value));
  }
}

@Injectable({ providedIn: 'root' })
export class BiodataStoreService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  readonly biodatas = signal<BiodataData[]>([]);
  readonly activeId = signal<string | null>(null);

  readonly activeBiodata = computed<BiodataData | null>(() => {
    const id = this.activeId();
    return this.biodatas().find(b => b.id === id) ?? null;
  });

  constructor() {
    this.hydrate();
    effect(() => {
      const biodatas = this.biodatas();
      const activeId = this.activeId();
      if (!this.isBrowser) return;
      if (this.saveTimer) clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => {
        try {
          localStorage.setItem(BIODATAS_KEY, JSON.stringify(biodatas));
          if (activeId) localStorage.setItem(ACTIVE_ID_KEY, activeId);
        } catch {
          // localStorage quota exceeded or unavailable - fail silently
        }
      }, AUTOSAVE_DEBOUNCE_MS);
    });
  }

  private hydrate(): void {
    if (!this.isBrowser) {
      const blank = createBlankBiodata();
      this.biodatas.set([blank]);
      this.activeId.set(blank.id);
      return;
    }
    try {
      const raw = localStorage.getItem(BIODATAS_KEY);
      const parsed: BiodataData[] = raw ? JSON.parse(raw) : [];
      if (parsed.length > 0) {
        this.biodatas.set(parsed);
        const savedActive = localStorage.getItem(ACTIVE_ID_KEY);
        const activeExists = savedActive && parsed.some(b => b.id === savedActive);
        this.activeId.set(activeExists ? savedActive : parsed[0].id);
        return;
      }
    } catch {
      // corrupt storage - fall through
    }
    const blank = createBlankBiodata();
    this.biodatas.set([blank]);
    this.activeId.set(blank.id);
  }

  // ── Biodata-level operations ──────────────────────────────────────────────

  createBiodata(templateId: BiodataTemplateId = 'classic-marriage', type: BiodataType = 'marriage', seed?: BiodataData): BiodataData {
    const biodata = seed
      ? { ...seed, id: uid(), name: seed.name || 'My Biodata', updatedAt: Date.now() }
      : createBlankBiodata(templateId, type);
    this.biodatas.update(list => [...list, biodata]);
    this.activeId.set(biodata.id);
    return biodata;
  }

  duplicateBiodata(id: string): void {
    const source = this.biodatas().find(b => b.id === id);
    if (!source) return;
    const copy: BiodataData = { ...cloneSafe(source), id: uid(), name: `${source.name} (Copy)`, updatedAt: Date.now() };
    this.biodatas.update(list => [...list, copy]);
    this.activeId.set(copy.id);
  }

  deleteBiodata(id: string): void {
    const list = this.biodatas();
    if (list.length <= 1) return;
    const remaining = list.filter(b => b.id !== id);
    this.biodatas.set(remaining);
    if (this.activeId() === id) this.activeId.set(remaining[0].id);
  }

  setActive(id: string): void {
    if (this.biodatas().some(b => b.id === id)) this.activeId.set(id);
  }

  renameBiodata(id: string, name: string): void {
    this.biodatas.update(list =>
      list.map(b => b.id === id ? { ...b, name, updatedAt: Date.now() } : b),
    );
  }

  setTemplate(templateId: BiodataTemplateId): void {
    this.patchActive(b => ({ ...b, templateId, updatedAt: Date.now() }));
  }

  setType(type: BiodataType): void {
    this.patchActive(b => ({ ...b, type, updatedAt: Date.now() }));
  }

  // ── Field update helpers ──────────────────────────────────────────────────

  updatePersonal(patch: Partial<BiodataPersonal>): void {
    this.patchActive(b => ({ ...b, personal: { ...b.personal, ...patch }, updatedAt: Date.now() }));
  }

  updateContact(patch: Partial<BiodataContact>): void {
    this.patchActive(b => ({ ...b, contact: { ...b.contact, ...patch }, updatedAt: Date.now() }));
  }

  updateProfessional(patch: Partial<BiodataProfessional>): void {
    this.patchActive(b => ({ ...b, professional: { ...b.professional, ...patch }, updatedAt: Date.now() }));
  }

  updateFamily(patch: Partial<BiodataFamily>): void {
    this.patchActive(b => ({ ...b, family: { ...b.family, ...patch }, updatedAt: Date.now() }));
  }

  updatePartnerPreferences(patch: Partial<BiodataPartnerPreferences>): void {
    this.patchActive(b => ({ ...b, partnerPreferences: { ...b.partnerPreferences, ...patch }, updatedAt: Date.now() }));
  }

  // ── Education ─────────────────────────────────────────────────────────────

  addEducation(): void {
    const item: BiodataEducationItem = { id: uid(), degree: '', field: '', institution: '', year: '', grade: '' };
    this.patchActive(b => ({ ...b, education: [...b.education, item], updatedAt: Date.now() }));
  }

  updateEducation(id: string, patch: Partial<BiodataEducationItem>): void {
    this.patchActive(b => ({
      ...b,
      education: b.education.map(e => e.id === id ? { ...e, ...patch } : e),
      updatedAt: Date.now(),
    }));
  }

  removeEducation(id: string): void {
    this.patchActive(b => ({ ...b, education: b.education.filter(e => e.id !== id), updatedAt: Date.now() }));
  }

  // ── Skills / Hobbies / Languages / Achievements (comma-string arrays) ─────

  updateSkills(skills: string[]): void {
    this.patchActive(b => ({ ...b, skills, updatedAt: Date.now() }));
  }

  updateHobbies(hobbies: string[]): void {
    this.patchActive(b => ({ ...b, hobbies, updatedAt: Date.now() }));
  }

  updateLanguages(languages: string[]): void {
    this.patchActive(b => ({ ...b, languages, updatedAt: Date.now() }));
  }

  updateAchievements(achievements: string[]): void {
    this.patchActive(b => ({ ...b, achievements, updatedAt: Date.now() }));
  }

  toggleSectionVisibility(section: BiodataSectionId): void {
    this.patchActive(b => ({
      ...b,
      sectionVisibility: {
        ...b.sectionVisibility,
        [section]: !(b.sectionVisibility[section] ?? true),
      },
      updatedAt: Date.now(),
    }));
  }

  isSectionVisible(section: BiodataSectionId): boolean {
    return this.activeBiodata()?.sectionVisibility[section] ?? true;
  }

  // ── Internal helpers ──────────────────────────────────────────────────────

  private patchActive(fn: (b: BiodataData) => BiodataData): void {
    const id = this.activeId();
    if (!id) return;
    this.biodatas.update(list => list.map(b => b.id === id ? fn(b) : b));
  }
}
