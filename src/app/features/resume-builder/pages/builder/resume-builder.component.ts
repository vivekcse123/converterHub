import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ResumeStoreService } from '../../services/resume-store.service';
import { ResumePdfService } from '../../services/resume-pdf.service';
import { ResumeAuthGateService } from '../../services/resume-auth-gate.service';
import { AtsScoreService } from '../../services/ats-score.service';
import { createSampleResume } from '../../data/resume-defaults';
import { RESUME_TEMPLATES } from '../../data/resume-templates.data';
import { TemplateId } from '../../models/resume.model';
import { SectionListComponent } from '../../components/editor/section-list/section-list.component';
import { ResumePreviewComponent } from '../../components/preview/resume-preview.component';
import { TemplatePickerComponent } from '../../components/template-picker/template-picker.component';
import { AtsScorePanelComponent } from '../../components/ats-panel/ats-score-panel.component';
import { ResumeToolbarComponent } from '../../components/resume-toolbar/resume-toolbar.component';
import { ResumeAuthPromptComponent } from '../../components/auth-prompt/resume-auth-prompt.component';
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
    ResumeToolbarComponent,
    ResumeAuthPromptComponent,
    AdBannerComponent,
    ToolInfoSectionComponent,
  ],
  templateUrl: './resume-builder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeBuilderComponent implements OnInit {
  readonly store = inject(ResumeStoreService);
  private readonly pdfService = inject(ResumePdfService);
  private readonly authGate = inject(ResumeAuthGateService);
  private readonly atsScore = inject(AtsScoreService);
  private readonly route = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly resume = computed(() => this.store.activeResume());
  readonly atsResult = computed(() => this.atsScore.compute(this.resume()));

  readonly isMobile = signal(false);
  readonly mobileStep = signal(1);
  readonly stepLabels = MOBILE_STEP_LABELS;
  readonly downloading = signal(false);

  ngOnInit(): void {
    this.applyQueryParams();
    this.setupViewportListener();
    if (this.authGate.consumePendingDownload()) {
      this.download();
    }
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
    if (!this.authGate.canDownload()) return;
    this.downloading.set(true);
    try {
      await this.pdfService.download(resume);
    } finally {
      this.downloading.set(false);
    }
  }
}
