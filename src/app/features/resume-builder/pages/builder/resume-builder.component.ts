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
import { ShareService } from '../../services/share.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { createSampleResume } from '../../data/resume-defaults';
import { RESUME_TEMPLATES, PREMIUM_TEMPLATE_IDS, TemplateCategory, TEMPLATE_CATEGORIES, ResumeTemplateMeta, getTemplateMeta, getTemplatesByCategory } from '../../data/resume-templates.data';
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
import { TemplateGalleryModalComponent } from '../../components/template-gallery/template-gallery-modal.component';

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
  svgPath: string;
  label: string;
  subtitle: string;
  optional?: boolean;
}

export const BUILDER_STEPS: BuilderStep[] = [
  { id: 1, svgPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',                               label: 'Personal Info',  subtitle: 'Name, title & contact'    },
  { id: 2, svgPath: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', label: 'Summary', subtitle: 'Your professional story' },
  { id: 3, svgPath: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Experience', subtitle: 'Jobs & work history' },
  { id: 4, svgPath: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222', label: 'Education', subtitle: 'Degrees & institutions' },
  { id: 5, svgPath: 'M13 10V3L4 14h7v7l9-11h-7z',                                                                         label: 'Skills',         subtitle: 'Technical & soft skills'  },
  { id: 6, svgPath: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',                                       label: 'More Sections',  subtitle: 'Projects, certs & extras', optional: true },
  { id: 7, svgPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', label: 'Review', subtitle: 'Final check before export' },
  { id: 8, svgPath: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',                                    label: 'Download',       subtitle: 'Get your PDF resume'      },
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
    TemplateGalleryModalComponent,
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
  readonly theme             = inject(ThemeService);
  private readonly route     = inject(ActivatedRoute);
  private readonly router    = inject(Router);
  private readonly jsonLd    = inject(JsonLdService);
  private readonly notify    = inject(NotificationService);
  private readonly shareSvc  = inject(ShareService);

  // ── Sidebar section search ──────────────────────────────────────────────
  readonly sectionQuery = signal('');

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

  readonly atsLabel = computed(() => {
    const color = this.atsScoreColor();
    return color === 'emerald' ? 'Excellent' : color === 'amber' ? 'Good' : 'Needs Work';
  });

  // ── Right panel: Template tab ────────────────────────────────────────────
  readonly activeTemplateMeta = computed<ResumeTemplateMeta>(() =>
    getTemplateMeta(this.resume()?.templateId ?? 'ats-professional')
  );
  readonly rightPanelTemplates = computed<ResumeTemplateMeta[]>(() =>
    getTemplatesByCategory(this.activeTemplateMeta().category).slice(0, 6)
  );

  readonly wordCount = computed(() => {
    const r = this.resume();
    if (!r) return 0;
    return this.atsSvc.extractAllText(r).split(/\s+/).filter(Boolean).length;
  });

  // ── Reorder mode (mobile quick-access; desktop reorders inline in the
  //    always-visible section list) ────────────────────────────────────────
  readonly showSectionsPanel = signal(false);
  private _savedReorderOrder: SectionRef[] | null = null;

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
  readonly showTemplateGallery  = signal(false);
  readonly showAiPanel          = signal(false);
  readonly showPreviewModal   = signal(false);
  readonly showUpgrade        = signal(false);
  readonly upgradeTemplateId  = signal<string | null>(null);

  // ── New dashboard shell: icon rail + right-panel tabs ───────────────────
  /** Which view the 320px left panel shows. */
  readonly railView       = signal<'sections' | 'settings'>('sections');
  /** Which tab the right panel (Template / Theme / Layout / Typography / ATS / Export) shows. */
  readonly activeRightTab = signal<'template' | 'theme' | 'layout' | 'typography' | 'ats' | 'export'>('template');
  /** Which AI Assistant tab to open — set by the bottom AI dock buttons. */
  readonly aiInitialTab     = signal<'summary' | 'bullet' | 'suggest' | 'tools'>('summary');
  /** Which Tools-tab mode to preselect — set by the AI dock's per-tool buttons. */
  readonly aiInitialToolMode = signal<'grammar' | 'deepcheck' | 'professional' | 'executive' | 'shorten' | 'expand' | 'translate'>('grammar');
  /** Whether the bottom AI dock's "more tools" flyout is open. */
  readonly aiDockExpanded = signal(false);

  /** Single dispatcher for every bottom AI dock button — every tool is real: Writer/Improve
   *  open the Summary/Rewrite tabs, Keywords/ATS Match jump to the ATS tab, and everything
   *  else (grammar/tone/length/translate) opens the AI Assistant's Tools tab pre-set to the
   *  matching mode, backed by the `ai/resume/transform` endpoint. */
  runAiTool(id: string): void {
    switch (id) {
      case 'writer':  this.aiInitialTab.set('summary'); this.showAiPanel.set(true); break;
      case 'improve': this.aiInitialTab.set('bullet');  this.showAiPanel.set(true); break;
      case 'keywords':
      case 'atsmatch': this.activeRightTab.set('ats'); break;
      case 'grammar': case 'deepcheck': case 'professional':
      case 'executive': case 'shorten': case 'expand': case 'translate':
        this.aiInitialToolMode.set(id);
        this.aiInitialTab.set('tools');
        this.showAiPanel.set(true);
        break;
    }
  }

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

  openTemplateGallery(): void { this.showTemplateGallery.set(true); }
  onTemplateApplied(id: TemplateId): void { this.store.setTemplate(id); }

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
  readonly saveStatus   = signal<'saved' | 'saving'>('saved');
  readonly downloading  = signal(false);
  readonly downloadDone = signal(false);
  readonly downloadingDocx = signal(false);
  readonly downloadDocxDone = signal(false);

  private saveTimer?: ReturnType<typeof setTimeout>;
  private readonly _trackSave = effect(() => {
    const r = this.resume();
    if (!r) return;
    this.saveStatus.set('saving');
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.saveStatus.set('saved'), 900);
  }, { allowSignalWrites: true });

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

  // ── Share ─────────────────────────────────────────────────────────────────
  readonly shareUrl  = signal('');
  readonly showShare = signal(false);
  readonly sharing   = this.shareSvc.publishing;

  async share(): Promise<void> {
    const r = this.resume();
    if (!r) return;
    this.showShare.set(true);
    if (r.publicSlug) { this.shareUrl.set(this.shareSvc.publicUrl(r.publicSlug)); return; }
    const result = await this.shareSvc.publish(r);
    if (result?.slug) {
      this.shareUrl.set(this.shareSvc.publicUrl(result.slug));
      this.store.setPublicSlug(r.id, result.slug);
    } else {
      this.notify.error('Share failed', 'Could not publish resume. Please try again.');
    }
  }

  copyShareLink(): void {
    navigator.clipboard.writeText(this.shareUrl()).then(() => this.notify.success('Link copied!'));
  }

  /** Free-tier limit: 2 resumes. Shows upgrade modal if at limit, otherwise creates a new resume. */
  createResumeOrUpgrade(): void {
    const FREE_LIMIT = 2;
    if (!this.auth.isPro() && this.store.resumes().length >= FREE_LIMIT) {
      this.showUpgrade.set(true);
      return;
    }
    this.store.createResume();
  }

  async switchToFreeTemplateAndDownload(): Promise<void> {
    this.showUpgrade.set(false);
    this.upgradeTemplateId.set(null);
    this.store.setTemplate('minimal' as TemplateId);
    // Wait for the template switch to actually render before downloading —
    // two animation frames guarantee Angular has run change detection and the
    // browser has committed a real layout + paint, unlike a fixed-length
    // timeout which can fire before or long after the new template settles.
    await new Promise<void>(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    await this.download();
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
    this.downloadDone.set(false);
    try {
      const pageHost = this.desktopPreview?.pageHost?.nativeElement;
      await this.pdf.download(r, pageHost);
      this.downloadDone.set(true);
      setTimeout(() => this.downloadDone.set(false), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      this.notify.error('Download failed', msg);
    } finally { this.downloading.set(false); }
  }

  /** Downloads a plain, ATS-friendly Word (.docx) copy — a separate flow from the
   *  Puppeteer PDF path (no live DOM capture needed, just the resume's data). */
  async downloadWord(): Promise<void> {
    const r = this.resume();
    if (!r || this.downloadingDocx()) return;
    if (!this.authGate.canDownload()) return;
    if (PREMIUM_TEMPLATE_IDS.includes(r.templateId as TemplateId)
        && !this.auth.isPro() && !this.auth.hasPurchasedTemplate(r.templateId)) {
      this.upgradeTemplateId.set(r.templateId);
      this.showUpgrade.set(true);
      return;
    }
    this.downloadingDocx.set(true);
    this.downloadDocxDone.set(false);
    try {
      await this.pdf.downloadDocx(r);
      this.downloadDocxDone.set(true);
      setTimeout(() => this.downloadDocxDone.set(false), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      this.notify.error('Download failed', msg);
    } finally { this.downloadingDocx.set(false); }
  }

  logout(): void   { this.auth.logout(); }
  private readonly location = inject(Location);

  goTo(p: string): void { this.router.navigate([p]); }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/resume-builder/dashboard']);
    }
  }
  printResume(): void { window.print(); }

  /** The toolbar's B/I/U icons are decorative — editing is form-based, not contenteditable. */
  explainFormatting(): void {
    this.notify.info('Editing your text', 'Formatting applies per-section — open a section on the left to edit its content.');
  }

  // ── Escape to close panels ────────────────────────────────────────────────
  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.showShare())          { this.showShare.set(false);          return; }
    if (this.showPreviewModal())   { this.showPreviewModal.set(false);   return; }
    if (this.showTemplateGallery()){ this.showTemplateGallery.set(false); return; }
    if (this.showSectionsPanel())  { this.saveReorder();                  return; }
    if (this.showAiPanel())        { this.showAiPanel.set(false);        return; }
    if (this.showUpgrade())        { this.showUpgrade.set(false);        return; }
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.applyQueryParams();
    if (this.authGate.consumePendingDownload()) this.download();

    try {
      const visited    = localStorage.getItem('ch_rb_visited');
      const r          = this.store.activeResume();
      const isBlank    = !r?.personal?.fullName?.trim() && !r?.experience?.length;
      // Skip onboarding if the user arrived with an explicit ?template= param — they
      // already made their template choice from the gallery or detail page.
      const hasExplicitTemplate = !!this.route.snapshot.queryParamMap.get('template');
      if (!visited && isBlank && !hasExplicitTemplate) this.showOnboarding.set(true);
    } catch {}

    this.jsonLd.setJsonLd('rb-app', {
      '@context': 'https://schema.org', '@type': 'SoftwareApplication',
      name: 'ApnaConverter Resume Builder', applicationCategory: 'BusinessApplication',
      url: 'https://www.apnaconverter.com/resume-builder',
      offers: [{ '@type': 'Offer', price: '0', priceCurrency: 'INR' }],
    });
  }

  ngOnDestroy(): void {
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
