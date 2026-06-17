import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BiodataStoreService } from '../../services/biodata-store.service';
import { BiodataAuthGateService } from '../../services/biodata-auth-gate.service';
import { BiodataTemplatePickerComponent } from '../../components/template-picker/biodata-template-picker.component';
import { BiodataToolbarComponent } from '../../components/toolbar/biodata-toolbar.component';
import { BiodataSectionEditorComponent } from '../../components/editor/section-editor/biodata-section-editor.component';
import { BiodataPreviewComponent } from '../../components/preview/biodata-preview.component';
import { BiodataAuthPromptComponent } from '../../components/auth-prompt/biodata-auth-prompt.component';
import { AdBannerComponent } from '../../../../shared/components/ad-banner/ad-banner.component';
import { ToolInfoSectionComponent } from '../../../../shared/components/tool-info-section/tool-info-section.component';
import { JsonLdService } from '../../../../core/services/json-ld.service';

const MOBILE_STEPS = ['Fill Details', 'Preview', 'Download'];
const PAGE_URL = 'https://www.apnaconverter.com/biodata-maker';

@Component({
  selector: 'app-biodata-maker',
  standalone: true,
  imports: [
    CommonModule,
    BiodataTemplatePickerComponent,
    BiodataToolbarComponent,
    BiodataSectionEditorComponent,
    BiodataPreviewComponent,
    BiodataAuthPromptComponent,
    AdBannerComponent,
    ToolInfoSectionComponent,
  ],
  templateUrl: './biodata-maker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BiodataMakerComponent implements OnInit, OnDestroy {
  readonly store = inject(BiodataStoreService);
  private readonly authGate = inject(BiodataAuthGateService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly jsonLd = inject(JsonLdService);

  readonly biodata = computed(() => this.store.activeBiodata());
  readonly isMobile = signal(false);
  readonly mobileStep = signal(1);
  readonly stepLabels = MOBILE_STEPS;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const update = () => this.isMobile.set(window.innerWidth < 1024);
      update();
      window.addEventListener('resize', update);
      this.destroyRef.onDestroy(() => window.removeEventListener('resize', update));
    }
    this.injectJsonLd();
  }

  ngOnDestroy(): void {
    this.jsonLd.removeJsonLd('biodata-maker-app');
    this.jsonLd.removeJsonLd('biodata-maker-faq');
    this.jsonLd.removeJsonLd('biodata-maker-howto');
  }

  private injectJsonLd(): void {
    this.jsonLd.setJsonLd('biodata-maker-app', {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Free Biodata Maker',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      url: PAGE_URL,
      description: 'Create professional marriage or job biodata online for free. Multiple templates, photo upload, and instant PDF download.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      featureList: [
        'Marriage biodata with family details and partner preferences',
        'Professional biodata format',
        'Photo upload with PDF embedding',
        'Three templates: Classic Marriage, Professional, Modern Card',
        'Instant A4 PDF download',
        'Data stored locally — 100% private',
      ],
    });

    this.jsonLd.setJsonLd('biodata-maker-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Is the biodata maker free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, 100% free with no sign-up, no watermarks, and no hidden charges. Download as many PDFs as you like.' } },
        { '@type': 'Question', name: 'What is the difference between marriage biodata and professional biodata?', acceptedAnswer: { '@type': 'Answer', text: 'Marriage biodata includes personal details like religion, caste, height, complexion, family information, and partner expectations. Professional biodata focuses on work experience, education, and skills — suitable for job applications or general introductions.' } },
        { '@type': 'Question', name: 'Is my photo and personal data safe?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Your entire biodata, including your photo, is saved only in your browser\'s local storage. Nothing is ever sent to our servers. Your data is completely private.' } },
        { '@type': 'Question', name: 'Can I create multiple biodatas?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, you can create, duplicate, rename, and switch between multiple biodatas using the toolbar.' } },
        { '@type': 'Question', name: 'What format is the downloaded biodata?', acceptedAnswer: { '@type': 'Answer', text: 'A print-ready A4 PDF. You can print it directly or share it digitally via email or WhatsApp.' } },
      ],
    });

    this.jsonLd.setJsonLd('biodata-maker-howto', {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Create a Biodata Online',
      description: 'Create a professional marriage or job biodata PDF in 3 simple steps using ApnaConverter\'s free Biodata Maker.',
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Choose a Template', text: 'Pick from Classic Marriage, Professional, or Modern Card templates.' },
        { '@type': 'HowToStep', position: 2, name: 'Fill in Your Details', text: 'Enter personal info, education, professional details, family info, and upload your photo.' },
        { '@type': 'HowToStep', position: 3, name: 'Download Your PDF', text: 'Click Download PDF to get a print-ready A4 biodata PDF instantly — completely free.' },
      ],
    });
  }

  nextStep(): void {
    if (this.mobileStep() < this.stepLabels.length) this.mobileStep.update(s => s + 1);
  }

  prevStep(): void {
    if (this.mobileStep() > 1) this.mobileStep.update(s => s - 1);
  }

  goToStep(n: number): void {
    this.mobileStep.set(n);
  }
}
