import {
  ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit,
  ViewChild, computed, effect, inject, signal,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JsonLdService } from '../../../../core/services/json-ld.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ResumeStoreService } from '../../services/resume-store.service';
import { ResumePdfService } from '../../services/resume-pdf.service';
import { ResumeAuthGateService } from '../../services/resume-auth-gate.service';
import { AtsScoreService } from '../../services/ats-score.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { createSampleResume } from '../../data/resume-defaults';
import { RESUME_TEMPLATES, PREMIUM_TEMPLATE_IDS, TemplateCategory, TEMPLATE_CATEGORIES } from '../../data/resume-templates.data';
import { DEFAULT_DESIGN, DesignSettings, SectionRef, TemplateId } from '../../models/resume.model';

// Section editors
import { PersonalInfoFormComponent } from '../../components/editor/personal-info-form/personal-info-form.component';
import { SummaryFormComponent } from '../../components/editor/summary-form/summary-form.component';
import { ExperienceFormComponent } from '../../components/editor/experience-form/experience-form.component';
import { EducationFormComponent } from '../../components/editor/education-form/education-form.component';
import { ProjectsFormComponent } from '../../components/editor/projects-form/projects-form.component';
import { SkillsFormComponent } from '../../components/editor/skills-form/skills-form.component';
import { CertificationsFormComponent } from '../../components/editor/certifications-form/certifications-form.component';
import { AchievementsFormComponent } from '../../components/editor/achievements-form/achievements-form.component';
import { LanguagesFormComponent } from '../../components/editor/languages-form/languages-form.component';
import { InterestsFormComponent } from '../../components/editor/interests-form/interests-form.component';
import { CustomSectionFormComponent } from '../../components/editor/custom-section-form/custom-section-form.component';
import { getCustomSection } from '../../templates/shared/template-helpers';

// Layout / shared components
import { ResumePreviewComponent } from '../../components/preview/resume-preview.component';
import { TemplatePickerComponent } from '../../components/template-picker/template-picker.component';
import { AtsScorePanelComponent } from '../../components/ats-panel/ats-score-panel.component';
import { AiAssistantPanelComponent } from '../../components/ai-assistant/ai-assistant-panel.component';
import { ResumeAuthPromptComponent } from '../../components/auth-prompt/resume-auth-prompt.component';
import { UpgradeModalComponent } from '../../components/upgrade-modal/upgrade-modal.component';
import { SectionListComponent } from '../../components/editor/section-list/section-list.component';

const ROLE_TITLES: Record<string, string> = {
  'software-engineer': 'Software Engineer',
  'frontend-developer': 'Frontend Developer',
  'angular-developer': 'Angular Developer',
  'react-developer': 'React Developer',
  'java-developer': 'Java Developer',
  'data-analyst': 'Data Analyst',
  accountant: 'Accountant',
  teacher: 'Teacher',
};

export interface BuilderStep {
  id: number;
  emoji: string;
  label: string;
  subtitle: string;
  optional?: boolean;
}

export const BUILDER_STEPS: BuilderStep[] = [
  { id: 1, emoji: '👤', label: 'Personal Info',  subtitle: 'Name, title & contact'     },
  { id: 2, emoji: '✍️',  label: 'Summary',        subtitle: 'Your professional story'   },
  { id: 3, emoji: '💼',  label: 'Experience',     subtitle: 'Jobs & work history'        },
  { id: 4, emoji: '🎓',  label: 'Education',      subtitle: 'Degrees & institutions'     },
  { id: 5, emoji: '⚡',  label: 'Skills',         subtitle: 'Technical & soft skills'    },
  { id: 6, emoji: '🚀',  label: 'More Sections',  subtitle: 'Projects, certs & extras',  optional: true },
  { id: 7, emoji: '🔍',  label: 'Review',         subtitle: 'Final check before export'  },
  { id: 8, emoji: '⬇️',  label: 'Download',       subtitle: 'Get your PDF resume'        },
];

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    PersonalInfoFormComponent, SummaryFormComponent, ExperienceFormComponent,
    EducationFormComponent, ProjectsFormComponent, SkillsFormComponent,
    CertificationsFormComponent, AchievementsFormComponent, LanguagesFormComponent,
    InterestsFormComponent, CustomSectionFormComponent,
    ResumePreviewComponent, TemplatePickerComponent,
    AtsScorePanelComponent, AiAssistantPanelComponent,
    ResumeAuthPromptComponent, UpgradeModalComponent,
    SectionListComponent,
  ],
  templateUrl: './resume-builder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeBuilderComponent implements OnInit, OnDestroy {
  @ViewChild('desktopPreview') private readonly desktopPreview?: ResumePreviewComponent;

  readonly store             = inject(ResumeStoreService);
  private readonly pdf       = inject(ResumePdfService);
  private readonly authGate  = inject(ResumeAuthGateService);
  private readonly atsSvc    = inject(AtsScoreService);
  readonly auth              = inject(AuthService);
  private readonly _theme    = inject(ThemeService);
  private readonly route     = inject(ActivatedRoute);
  private readonly router    = inject(Router);
  private readonly jsonLd    = inject(JsonLdService);
  private readonly notify    = inject(NotificationService);

  private _wasDark = false;

  // ── Data ──────────────────────────────────────────────────────────────────
  readonly resume    = computed(() => this.store.activeResume());
  readonly atsResult = computed(() => this.atsSvc.compute(this.resume()));
  readonly design    = computed<DesignSettings>(() => ({
    ...DEFAULT_DESIGN, ...(this.resume()?.design ?? {}),
  }));
  readonly userInitial = computed(() =>
    (this.auth.user()?.name ?? this.auth.user()?.email ?? 'U').charAt(0).toUpperCase()
  );

  // ── Step navigation ───────────────────────────────────────────────────────
  readonly steps      = BUILDER_STEPS;
  readonly activeStep = signal(1);
  readonly currentStep = computed(() => this.steps[this.activeStep() - 1]);

  readonly stepDone = computed<Record<number, boolean>>(() => {
    const r = this.resume();
    if (!r) return {} as Record<number, boolean>;
    return {
      1: !!(r.personal.fullName?.trim() && r.personal.email?.trim()),
      2: !!r.summary?.trim(),
      3: r.experience.length > 0,
      4: r.education.length > 0,
      5: r.skills.some(g => g.items.length > 0),
      6: true,
      7: true,
      8: false,
    };
  });

  readonly completionPct = computed(() => {
    const done = this.stepDone();
    return Math.round([1, 2, 3, 4, 5].filter(n => done[n]).length / 5 * 100);
  });

  readonly atsScoreColor = computed(() => {
    const s = this.atsResult().score;
    if (s >= 90) return 'emerald';
    if (s >= 70) return 'amber';
    return 'red';
  });

  readonly failedChecksCount = computed(() =>
    this.atsResult().checks.filter(c => !c.passed).length
  );

  readonly wordCount = computed(() => {
    const r = this.resume();
    if (!r) return 0;
    return this.atsSvc.extractAllText(r).split(/\s+/).filter(Boolean).length;
  });

  // ── Reorder mode ─────────────────────────────────────────────────────────
  openReorderPanel(): void {
    const r = this.resume();
    if (r) this._savedReorderOrder = [...r.sectionOrder];
    this.showSectionsPanel.set(true);
  }

  saveReorder(): void {
    this._savedReorderOrder = null;
    this.showSectionsPanel.set(false);
  }

  cancelReorder(): void {
    if (this._savedReorderOrder) {
      this.store.reorderSections(this._savedReorderOrder);
      this._savedReorderOrder = null;
    }
    this.showSectionsPanel.set(false);
  }

  goToStep(n: number): void { this.activeStep.set(n); }
  nextStep(): void { if (this.activeStep() < 8) this.activeStep.update(s => s + 1); }
  prevStep(): void { if (this.activeStep() > 1) this.activeStep.update(s => s - 1); }

  // ── Panels / modals ───────────────────────────────────────────────────────
  readonly showTemplateDrawer = signal(false);
  readonly showAiPanel        = signal(false);
  readonly showAtsPanel       = signal(false);
  readonly showPreviewModal   = signal(false);
  readonly showDesignPanel    = signal(false);
  readonly showSectionsPanel  = signal(false);
  private _savedReorderOrder: SectionRef[] | null = null;
  readonly showUpgrade        = signal(false);
  readonly upgradeTemplateId  = signal<string | null>(null);
  readonly showProfileMenu    = signal(false);
  readonly showVersionHistory = signal(false);

  // ── Mobile ────────────────────────────────────────────────────────────────
  readonly mobileTab = signal<'editor' | 'preview' | 'templates' | 'ai'>('editor');

  // ── Step-6 extras tab ─────────────────────────────────────────────────────
  readonly extrasTab = signal<'projects' | 'certifications' | 'achievements' | 'languages' | 'interests' | 'custom'>('projects');

  // ── Onboarding ────────────────────────────────────────────────────────────
  readonly showOnboarding     = signal(false);
  readonly onboardingCategory = signal<TemplateCategory | 'all'>('all');
  readonly allTemplates       = RESUME_TEMPLATES;
  readonly templateCategories = TEMPLATE_CATEGORIES;
  readonly onboardingTemplates = computed(() => {
    const c = this.onboardingCategory();
    return c === 'all' ? RESUME_TEMPLATES : RESUME_TEMPLATES.filter(t => t.category === c);
  });

  selectTemplateAndStart(id: TemplateId): void {
    this.store.setTemplate(id);
    this.showOnboarding.set(false);
    try { localStorage.setItem('ch_rb_visited', '1'); } catch {}
  }
  skipOnboarding(): void {
    this.showOnboarding.set(false);
    try { localStorage.setItem('ch_rb_visited', '1'); } catch {}
  }

  // ── Version history ───────────────────────────────────────────────────────
  readonly versionList = computed(() => this.resume()?.versions ?? []);
  saveVersion(): void {
    const id = this.store.activeId();
    if (id) { this.store.saveVersion(id); this.notify.success('Version saved'); }
  }
  restoreVersion(vid: string): void {
    const id = this.store.activeId();
    if (id) { this.store.restoreVersion(id, vid); this.notify.success('Version restored'); }
  }
  deleteVersion(vid: string): void {
    const id = this.store.activeId();
    if (id) this.store.deleteVersion(id, vid);
  }

  // ── Save status ───────────────────────────────────────────────────────────
  readonly saveStatus      = signal<'saved' | 'saving'>('saved');
  readonly downloading     = signal(false);
  readonly autoSaveEnabled = signal<boolean>((() => {
    try { return localStorage.getItem('ch_auto_save') !== 'false'; } catch { return true; }
  })());

  private saveTimer?: ReturnType<typeof setTimeout>;
  private readonly _trackSave = effect(() => {
    const r = this.resume();
    if (!r) return;
    this.saveStatus.set('saving');
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.saveStatus.set('saved'), 900);
  });

  // ── Design ────────────────────────────────────────────────────────────────
  readonly DEFAULT_DESIGN = DEFAULT_DESIGN;
  readonly getCustomSection = getCustomSection;

  readonly COLOR_PRESETS = [
    { label: 'Slate',   color: '#1e293b' },
    { label: 'Blue',    color: '#1d4ed8' },
    { label: 'Indigo',  color: '#4f46e5' },
    { label: 'Violet',  color: '#7c3aed' },
    { label: 'Forest',  color: '#15803d' },
    { label: 'Crimson', color: '#dc2626' },
    { label: 'Amber',   color: '#d97706' },
    { label: 'Teal',    color: '#0d9488' },
  ] as const;

  readonly currentFontPt = computed<number>(() => {
    const d = this.design();
    if (typeof d.baseFontPt === 'number' && d.baseFontPt > 0) return d.baseFontPt;
    return ({ small: 9.5, medium: 10.5, large: 11.5 })[d.fontSize ?? 'medium'] ?? 10.5;
  });

  setAccentColor(color: string): void { this.store.updateDesign({ accentColor: color }); }
  setFontFamily(f: DesignSettings['fontFamily']): void { this.store.updateDesign({ fontFamily: f }); }
  setLineHeight(l: DesignSettings['lineHeight']): void { this.store.updateDesign({ lineHeight: l }); }
  setPaperSize(s: DesignSettings['paperSize']): void   { this.store.updateDesign({ paperSize: s }); }
  increaseFontSize(): void {
    this.store.updateDesign({ baseFontPt: Math.min(14, Math.round((this.currentFontPt() + 0.5) * 10) / 10) });
  }
  decreaseFontSize(): void {
    this.store.updateDesign({ baseFontPt: Math.max(8, Math.round((this.currentFontPt() - 0.5) * 10) / 10) });
  }

  // ── Resume actions ────────────────────────────────────────────────────────
  rename(e: Event): void {
    const id  = this.store.activeId();
    const val = (e.target as HTMLInputElement).value;
    if (id) this.store.renameResume(id, val);
  }

  duplicate(): void {
    const id = this.store.activeId();
    if (id) { this.store.duplicateResume(id); this.notify.success('Duplicated', 'Resume copy created.'); }
  }

  switchToFreeTemplateAndDownload(): void {
    this.showUpgrade.set(false);
    this.upgradeTemplateId.set(null);
    this.store.setTemplate('minimal' as TemplateId);
    // Small delay so the template switch renders before download
    setTimeout(() => this.download(), 100);
  }

  async download(): Promise<void> {
    const r = this.resume();
    if (!r || this.downloading()) return;
    if (!this.authGate.canDownload()) return;
    if (PREMIUM_TEMPLATE_IDS.includes(r.templateId as TemplateId)
        && !this.auth.isPro() && !this.auth.hasPurchasedTemplate(r.templateId)) {
      this.upgradeTemplateId.set(r.templateId);
      this.showUpgrade.set(true);
      return;
    }
    this.downloading.set(true);
    try {
      // Pass the actual rendered preview element so the PDF captures it pixel-perfect
      const pageHost = this.desktopPreview?.pageHost?.nativeElement;
      await this.pdf.download(r, pageHost);
    } finally { this.downloading.set(false); }
  }

  logout(): void   { this.showProfileMenu.set(false); this.auth.logout(); }
  private readonly location = inject(Location);

  goTo(p: string): void { this.showProfileMenu.set(false); this.router.navigate([p]); }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/resume-builder/dashboard']);
    }
  }
  printResume(): void { window.print(); }

  // ── Escape to close panels ────────────────────────────────────────────────
  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.showPreviewModal())   { this.showPreviewModal.set(false);   return; }
    if (this.showTemplateDrawer()) { this.showTemplateDrawer.set(false); return; }
    if (this.showSectionsPanel())  { this.saveReorder();                  return; }
    if (this.showAiPanel())        { this.showAiPanel.set(false);        return; }
    if (this.showAtsPanel())       { this.showAtsPanel.set(false);       return; }
    if (this.showDesignPanel())    { this.showDesignPanel.set(false);    return; }
    if (this.showProfileMenu())    { this.showProfileMenu.set(false);    return; }
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      this._wasDark = document.documentElement.classList.contains('dark');
      document.documentElement.classList.remove('dark');
    }

    this.applyQueryParams();
    if (this.authGate.consumePendingDownload()) this.download();

    try {
      const visited = localStorage.getItem('ch_rb_visited');
      const r = this.store.activeResume();
      const isBlank = !r?.personal?.fullName?.trim() && !r?.experience?.length;
      if (!visited && isBlank) this.showOnboarding.set(true);
    } catch {}

    this.jsonLd.setJsonLd('rb-app', {
      '@context': 'https://schema.org', '@type': 'SoftwareApplication',
      name: 'ApnaConverter Resume Builder', applicationCategory: 'BusinessApplication',
      url: 'https://www.apnaconverter.com/resume-builder',
      offers: [{ '@type': 'Offer', price: '0', priceCurrency: 'INR' }],
    });
  }

  ngOnDestroy(): void {
    if (this._wasDark && typeof document !== 'undefined')
      document.documentElement.classList.add('dark');
    this.jsonLd.removeJsonLd('rb-app');
  }

  private applyQueryParams(): void {
    const params        = this.route.snapshot.queryParamMap;
    const idParam       = params.get('id');
    const role          = params.get('role');
    const templateParam = params.get('template') as TemplateId | null;
    const validTpl      = templateParam && RESUME_TEMPLATES.some(t => t.id === templateParam)
      ? templateParam : undefined;

    if (idParam) { this.store.setActive(idParam); return; }

    if (role && ROLE_TITLES[role]) {
      const seed = createSampleResume(validTpl ?? 'ats-professional');
      seed.name              = `${ROLE_TITLES[role]} Resume`;
      seed.personal.jobTitle = ROLE_TITLES[role];
      this.store.createResume(seed.templateId, seed);
    } else if (validTpl) {
      this.store.setTemplate(validTpl);
    }
  }
}
