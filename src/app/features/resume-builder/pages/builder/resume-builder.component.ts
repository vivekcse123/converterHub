import { ChangeDetectionStrategy, Component, DestroyRef, OnDestroy, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { JsonLdService } from '../../../../core/services/json-ld.service';
import { ResumeStoreService } from '../../services/resume-store.service';
import { ResumePdfService } from '../../services/resume-pdf.service';
import { ResumeAuthGateService } from '../../services/resume-auth-gate.service';
import { AtsScoreService } from '../../services/ats-score.service';
import { AuthService } from '../../../../core/services/auth.service';
import { createSampleResume } from '../../data/resume-defaults';
import { RESUME_TEMPLATES, PREMIUM_TEMPLATE_IDS } from '../../data/resume-templates.data';
import { TemplateId } from '../../models/resume.model';
import { SectionListComponent } from '../../components/editor/section-list/section-list.component';
import { ResumePreviewComponent } from '../../components/preview/resume-preview.component';
import { TemplatePickerComponent } from '../../components/template-picker/template-picker.component';
import { AtsScorePanelComponent } from '../../components/ats-panel/ats-score-panel.component';
import { AiAssistantPanelComponent } from '../../components/ai-assistant/ai-assistant-panel.component';
import { ResumeToolbarComponent } from '../../components/resume-toolbar/resume-toolbar.component';
import { ResumeAuthPromptComponent } from '../../components/auth-prompt/resume-auth-prompt.component';
import { UpgradeModalComponent } from '../../components/upgrade-modal/upgrade-modal.component';
import { AdBannerComponent } from '../../../../shared/components/ad-banner/ad-banner.component';
import { ToolInfoSectionComponent } from '../../../../shared/components/tool-info-section/tool-info-section.component';

/** Maps role-landing-page slugs to a job title used to seed a resume from a CTA. */
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

const MOBILE_STEP_LABELS = ['Enter Details', 'Customize', 'Download'];

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [
    CommonModule,
    SectionListComponent,
    ResumePreviewComponent,
    TemplatePickerComponent,
    AtsScorePanelComponent,
    AiAssistantPanelComponent,
    ResumeToolbarComponent,
    ResumeAuthPromptComponent,
    UpgradeModalComponent,
    AdBannerComponent,
    ToolInfoSectionComponent,
  ],
  templateUrl: './resume-builder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeBuilderComponent implements OnInit, OnDestroy {
  readonly store = inject(ResumeStoreService);
  private readonly pdfService = inject(ResumePdfService);
  private readonly authGate = inject(ResumeAuthGateService);
  private readonly atsScore = inject(AtsScoreService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly jsonLd = inject(JsonLdService);

  readonly resume = computed(() => this.store.activeResume());
  readonly atsResult = computed(() => this.atsScore.compute(this.resume()));

  readonly isMobile = signal(false);
  readonly mobileStep = signal(1);
  readonly stepLabels = MOBILE_STEP_LABELS;
  readonly downloading = signal(false);
  readonly showUpgrade = signal(false);

  ngOnInit(): void {
    this.applyQueryParams();
    this.setupViewportListener();
    if (this.authGate.consumePendingDownload()) {
      this.download();
    }
    this.jsonLd.setJsonLd('resume-builder-app', {
      '@context': 'https://schema.org', '@type': 'SoftwareApplication',
      name: 'ApnaConverter Resume Builder',
      url: 'https://www.apnaconverter.com/resume-builder',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Any',
      description: 'Free ATS-friendly resume builder with live ATS score, 10 professional templates, job description matching, AI writing assistant, and one-click PDF download.',
      featureList: ['Live ATS score', '10 resume templates', 'AI writing assistant', 'Job description keyword match', 'One-click PDF download', 'Cover letter generator', 'Portfolio builder'],
      offers: [{ '@type': 'Offer', price: '0', priceCurrency: 'INR', description: 'Free — 8 templates, basic ATS score' }, { '@type': 'Offer', price: '9', priceCurrency: 'INR', description: 'Pro — all templates, no watermark' }],
    });
    this.jsonLd.setJsonLd('resume-builder-howto', {
      '@context': 'https://schema.org', '@type': 'HowTo',
      name: 'How to Build an ATS-Friendly Resume',
      description: 'Step-by-step guide to creating a professional, ATS-optimized resume using ApnaConverter.',
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Choose a Template', text: 'Pick from 10 ATS-friendly resume templates. Free users get 8 templates; Pro users unlock all 10 including premium designs.' },
        { '@type': 'HowToStep', position: 2, name: 'Fill in Your Details', text: 'Enter your personal info, work experience, education, skills, and projects. Use the AI writing assistant to generate a professional summary.' },
        { '@type': 'HowToStep', position: 3, name: 'Check Your ATS Score', text: 'See your live ATS score on the right panel. Paste a job description to get a keyword match score and see missing keywords.' },
        { '@type': 'HowToStep', position: 4, name: 'Download Your Resume', text: 'Click Download to get a polished, ATS-readable PDF. Free resumes include a light watermark; upgrade to Pro to remove it.' },
      ],
    });
  }

  ngOnDestroy(): void {
    this.jsonLd.removeJsonLd('resume-builder-app');
    this.jsonLd.removeJsonLd('resume-builder-howto');
  }

  private applyQueryParams(): void {
    const params = this.route.snapshot.queryParamMap;
    const role = params.get('role');
    const templateParam = params.get('template') as TemplateId | null;
    const validTemplate = templateParam && RESUME_TEMPLATES.some(t => t.id === templateParam) ? templateParam : undefined;

    if (role && ROLE_TITLES[role]) {
      const seed = createSampleResume(validTemplate ?? 'ats-professional');
      seed.name = `${ROLE_TITLES[role]} Resume`;
      seed.personal.jobTitle = ROLE_TITLES[role];
      this.store.createResume(seed.templateId, seed);
    } else if (validTemplate) {
      this.store.setTemplate(validTemplate);
    }
  }

  private setupViewportListener(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const update = () => this.isMobile.set(window.innerWidth < 1024);
    update();
    window.addEventListener('resize', update);
    this.destroyRef.onDestroy(() => window.removeEventListener('resize', update));
  }

  nextStep(): void {
    this.mobileStep.update(step => Math.min(this.stepLabels.length, step + 1));
  }

  prevStep(): void {
    this.mobileStep.update(step => Math.max(1, step - 1));
  }

  goToStep(step: number): void {
    this.mobileStep.set(step);
  }

  async download(): Promise<void> {
    const resume = this.resume();
    if (!resume || this.downloading()) return;
    // Gate 1: must be logged in
    if (!this.authGate.canDownload()) return;
    // Gate 2: premium template requires Pro subscription (UX fast-fail; backend also enforces)
    if (PREMIUM_TEMPLATE_IDS.includes(resume.templateId as TemplateId) && !this.auth.isPro()) {
      this.showUpgrade.set(true);
      return;
    }
    this.downloading.set(true);
    try {
      await this.pdfService.download(resume);
    } finally {
      this.downloading.set(false);
    }
  }
}
