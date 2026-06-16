import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createBlankResume } from '../data/resume-defaults';
import {
  BuiltInSectionId,
  CertificationItem,
  CustomSection,
  CustomSectionEntry,
  EducationItem,
  ExperienceItem,
  LanguageItem,
  PersonalInfo,
  ProjectItem,
  ResumeData,
  SECTION_LABELS,
  SectionRef,
  SkillGroup,
  TemplateId,
} from '../models/resume.model';

const RESUMES_KEY = 'rb_resumes_v1';
const ACTIVE_ID_KEY = 'rb_active_id_v1';
const AUTOSAVE_DEBOUNCE_MS = 600;

function uid(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

@Injectable({ providedIn: 'root' })
export class ResumeStoreService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  readonly resumes = signal<ResumeData[]>([]);
  readonly activeId = signal<string | null>(null);

  readonly activeResume = computed<ResumeData | null>(() => {
    const id = this.activeId();
    return this.resumes().find(r => r.id === id) ?? null;
  });

  constructor() {
    this.hydrate();

    effect(() => {
      const resumes = this.resumes();
      const activeId = this.activeId();
      if (!this.isBrowser) return;
      if (this.saveTimer) clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => {
        try {
          localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
          if (activeId) localStorage.setItem(ACTIVE_ID_KEY, activeId);
        } catch {
          // localStorage unavailable (private mode, quota) — fail silently
        }
      }, AUTOSAVE_DEBOUNCE_MS);
    });
  }

  private hydrate(): void {
    if (!this.isBrowser) {
      const blank = createBlankResume();
      this.resumes.set([blank]);
      this.activeId.set(blank.id);
      return;
    }

    try {
      const raw = localStorage.getItem(RESUMES_KEY);
      const parsed: ResumeData[] = raw ? JSON.parse(raw) : [];
      if (parsed.length > 0) {
        this.resumes.set(parsed);
        const savedActive = localStorage.getItem(ACTIVE_ID_KEY);
        const activeExists = savedActive && parsed.some(r => r.id === savedActive);
        this.activeId.set(activeExists ? savedActive : parsed[0].id);
        return;
      }
    } catch {
      // corrupt storage — fall through to fresh resume
    }

    const blank = createBlankResume();
    this.resumes.set([blank]);
    this.activeId.set(blank.id);
  }

  // ── Resume-level operations ──────────────────────────────────────────────

  createResume(templateId: TemplateId = 'ats-professional', seed?: ResumeData): ResumeData {
    const resume = seed
      ? { ...seed, id: uid(), name: seed.name || 'Untitled Resume', updatedAt: Date.now() }
      : createBlankResume(templateId);
    this.resumes.update(list => [...list, resume]);
    this.activeId.set(resume.id);
    return resume;
  }

  duplicateResume(id: string): void {
    const source = this.resumes().find(r => r.id === id);
    if (!source) return;
    const copy: ResumeData = {
      ...structuredCloneSafe(source),
      id: uid(),
      name: `${source.name} (Copy)`,
      updatedAt: Date.now(),
    };
    this.resumes.update(list => [...list, copy]);
    this.activeId.set(copy.id);
  }

  deleteResume(id: string): void {
    const list = this.resumes();
    if (list.length <= 1) return; // always keep at least one resume
    const remaining = list.filter(r => r.id !== id);
    this.resumes.set(remaining);
    if (this.activeId() === id) {
      this.activeId.set(remaining[0].id);
    }
  }

  setActive(id: string): void {
    if (this.resumes().some(r => r.id === id)) {
      this.activeId.set(id);
    }
  }

  renameResume(id: string, name: string): void {
    this.patchActive(r => ({ ...r, name }), id);
  }

  setTemplate(templateId: TemplateId, id?: string): void {
    this.patchActive(r => ({ ...r, templateId }), id);
  }

  // ── Generic patch helper ─────────────────────────────────────────────────

  private patchActive(updater: (r: ResumeData) => ResumeData, id?: string): void {
    const targetId = id ?? this.activeId();
    if (!targetId) return;
    this.resumes.update(list =>
      list.map(r => (r.id === targetId ? { ...updater(r), updatedAt: Date.now() } : r))
    );
  }

  // ── Personal & summary ────────────────────────────────────────────────────

  updatePersonal(patch: Partial<PersonalInfo>): void {
    this.patchActive(r => ({ ...r, personal: { ...r.personal, ...patch } }));
  }

  updateSummary(summary: string): void {
    this.patchActive(r => ({ ...r, summary }));
  }

  // ── Experience ────────────────────────────────────────────────────────────

  addExperience(): void {
    const item: ExperienceItem = {
      id: uid(), company: '', role: '', location: '', startDate: '', endDate: '', current: false, bullets: [''],
    };
    this.patchActive(r => ({ ...r, experience: [...r.experience, item] }));
  }

  updateExperience(id: string, patch: Partial<ExperienceItem>): void {
    this.patchActive(r => ({
      ...r,
      experience: r.experience.map(e => (e.id === id ? { ...e, ...patch } : e)),
    }));
  }

  removeExperience(id: string): void {
    this.patchActive(r => ({ ...r, experience: r.experience.filter(e => e.id !== id) }));
  }

  addExperienceBullet(expId: string): void {
    this.patchActive(r => ({
      ...r,
      experience: r.experience.map(e => (e.id === expId ? { ...e, bullets: [...e.bullets, ''] } : e)),
    }));
  }

  updateExperienceBullet(expId: string, index: number, value: string): void {
    this.patchActive(r => ({
      ...r,
      experience: r.experience.map(e =>
        e.id === expId ? { ...e, bullets: e.bullets.map((b, i) => (i === index ? value : b)) } : e
      ),
    }));
  }

  removeExperienceBullet(expId: string, index: number): void {
    this.patchActive(r => ({
      ...r,
      experience: r.experience.map(e =>
        e.id === expId ? { ...e, bullets: e.bullets.filter((_, i) => i !== index) } : e
      ),
    }));
  }

  // ── Education ──────────────────────────────────────────────────────────────

  addEducation(): void {
    const item: EducationItem = {
      id: uid(), institution: '', degree: '', field: '', startDate: '', endDate: '', current: false, gpa: '', description: '',
    };
    this.patchActive(r => ({ ...r, education: [...r.education, item] }));
  }

  updateEducation(id: string, patch: Partial<EducationItem>): void {
    this.patchActive(r => ({
      ...r,
      education: r.education.map(e => (e.id === id ? { ...e, ...patch } : e)),
    }));
  }

  removeEducation(id: string): void {
    this.patchActive(r => ({ ...r, education: r.education.filter(e => e.id !== id) }));
  }

  // ── Projects ───────────────────────────────────────────────────────────────

  addProject(): void {
    const item: ProjectItem = { id: uid(), name: '', link: '', techStack: '', bullets: [''] };
    this.patchActive(r => ({ ...r, projects: [...r.projects, item] }));
  }

  updateProject(id: string, patch: Partial<ProjectItem>): void {
    this.patchActive(r => ({
      ...r,
      projects: r.projects.map(p => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }

  removeProject(id: string): void {
    this.patchActive(r => ({ ...r, projects: r.projects.filter(p => p.id !== id) }));
  }

  addProjectBullet(projectId: string): void {
    this.patchActive(r => ({
      ...r,
      projects: r.projects.map(p => (p.id === projectId ? { ...p, bullets: [...p.bullets, ''] } : p)),
    }));
  }

  updateProjectBullet(projectId: string, index: number, value: string): void {
    this.patchActive(r => ({
      ...r,
      projects: r.projects.map(p =>
        p.id === projectId ? { ...p, bullets: p.bullets.map((b, i) => (i === index ? value : b)) } : p
      ),
    }));
  }

  removeProjectBullet(projectId: string, index: number): void {
    this.patchActive(r => ({
      ...r,
      projects: r.projects.map(p =>
        p.id === projectId ? { ...p, bullets: p.bullets.filter((_, i) => i !== index) } : p
      ),
    }));
  }

  // ── Skills ─────────────────────────────────────────────────────────────────

  addSkillGroup(): void {
    const item: SkillGroup = { id: uid(), category: '', items: [] };
    this.patchActive(r => ({ ...r, skills: [...r.skills, item] }));
  }

  updateSkillGroup(id: string, patch: Partial<SkillGroup>): void {
    this.patchActive(r => ({ ...r, skills: r.skills.map(s => (s.id === id ? { ...s, ...patch } : s)) }));
  }

  removeSkillGroup(id: string): void {
    this.patchActive(r => ({ ...r, skills: r.skills.filter(s => s.id !== id) }));
  }

  /** Updates a skill group's items from a comma-separated string. */
  setSkillItemsFromText(id: string, text: string): void {
    const items = text.split(',').map(s => s.trim()).filter(Boolean);
    this.updateSkillGroup(id, { items });
  }

  // ── Certifications ─────────────────────────────────────────────────────────

  addCertification(): void {
    const item: CertificationItem = { id: uid(), name: '', issuer: '', date: '', link: '' };
    this.patchActive(r => ({ ...r, certifications: [...r.certifications, item] }));
  }

  updateCertification(id: string, patch: Partial<CertificationItem>): void {
    this.patchActive(r => ({
      ...r,
      certifications: r.certifications.map(c => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }

  removeCertification(id: string): void {
    this.patchActive(r => ({ ...r, certifications: r.certifications.filter(c => c.id !== id) }));
  }

  // ── Achievements (simple string list) ────────────────────────────────────────

  addAchievement(): void {
    this.patchActive(r => ({ ...r, achievements: [...r.achievements, ''] }));
  }

  updateAchievement(index: number, value: string): void {
    this.patchActive(r => ({
      ...r,
      achievements: r.achievements.map((a, i) => (i === index ? value : a)),
    }));
  }

  removeAchievement(index: number): void {
    this.patchActive(r => ({ ...r, achievements: r.achievements.filter((_, i) => i !== index) }));
  }

  // ── Languages ──────────────────────────────────────────────────────────────

  addLanguage(): void {
    const item: LanguageItem = { id: uid(), name: '', proficiency: 'Conversational' };
    this.patchActive(r => ({ ...r, languages: [...r.languages, item] }));
  }

  updateLanguage(id: string, patch: Partial<LanguageItem>): void {
    this.patchActive(r => ({ ...r, languages: r.languages.map(l => (l.id === id ? { ...l, ...patch } : l)) }));
  }

  removeLanguage(id: string): void {
    this.patchActive(r => ({ ...r, languages: r.languages.filter(l => l.id !== id) }));
  }

  // ── Interests (simple string list) ───────────────────────────────────────────

  setInterestsFromText(text: string): void {
    const interests = text.split(',').map(s => s.trim()).filter(Boolean);
    this.patchActive(r => ({ ...r, interests }));
  }

  // ── Custom sections ────────────────────────────────────────────────────────

  addCustomSection(): void {
    const section: CustomSection = { id: uid(), title: 'Custom Section', entries: [] };
    this.patchActive(r => ({
      ...r,
      customSections: [...r.customSections, section],
      sectionOrder: [...r.sectionOrder, `custom:${section.id}` as SectionRef],
      sectionVisibility: { ...r.sectionVisibility, [`custom:${section.id}`]: true },
    }));
  }

  updateCustomSectionTitle(id: string, title: string): void {
    this.patchActive(r => ({
      ...r,
      customSections: r.customSections.map(s => (s.id === id ? { ...s, title } : s)),
    }));
  }

  removeCustomSection(id: string): void {
    const ref = `custom:${id}` as SectionRef;
    this.patchActive(r => ({
      ...r,
      customSections: r.customSections.filter(s => s.id !== id),
      sectionOrder: r.sectionOrder.filter(s => s !== ref),
      sectionVisibility: Object.fromEntries(Object.entries(r.sectionVisibility).filter(([k]) => k !== ref)),
    }));
  }

  addCustomEntry(sectionId: string): void {
    const entry: CustomSectionEntry = { id: uid(), heading: '', subheading: '', date: '', description: '' };
    this.patchActive(r => ({
      ...r,
      customSections: r.customSections.map(s =>
        s.id === sectionId ? { ...s, entries: [...s.entries, entry] } : s
      ),
    }));
  }

  updateCustomEntry(sectionId: string, entryId: string, patch: Partial<CustomSectionEntry>): void {
    this.patchActive(r => ({
      ...r,
      customSections: r.customSections.map(s =>
        s.id === sectionId
          ? { ...s, entries: s.entries.map(e => (e.id === entryId ? { ...e, ...patch } : e)) }
          : s
      ),
    }));
  }

  removeCustomEntry(sectionId: string, entryId: string): void {
    this.patchActive(r => ({
      ...r,
      customSections: r.customSections.map(s =>
        s.id === sectionId ? { ...s, entries: s.entries.filter(e => e.id !== entryId) } : s
      ),
    }));
  }

  // ── Section ordering & visibility ─────────────────────────────────────────

  reorderSections(newOrder: SectionRef[]): void {
    this.patchActive(r => ({ ...r, sectionOrder: newOrder }));
  }

  toggleSectionVisibility(section: SectionRef): void {
    this.patchActive(r => ({
      ...r,
      sectionVisibility: { ...r.sectionVisibility, [section]: !r.sectionVisibility[section] },
    }));
  }

  isSectionVisible(resume: ResumeData, section: SectionRef): boolean {
    return resume.sectionVisibility[section] !== false;
  }

  sectionLabel(resume: ResumeData, section: SectionRef): string {
    if (section.startsWith('custom:')) {
      const id = section.slice('custom:'.length);
      return resume.customSections.find(s => s.id === id)?.title ?? 'Custom Section';
    }
    return SECTION_LABELS[section as BuiltInSectionId] ?? section;
  }
}

function structuredCloneSafe<T>(value: T): T {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}
