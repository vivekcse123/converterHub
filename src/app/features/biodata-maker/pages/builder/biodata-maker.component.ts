import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BiodataStoreService } from '../../services/biodata-store.service';
import { BiodataPdfService } from '../../services/biodata-pdf.service';
import { BiodataTemplatePickerComponent } from '../../components/template-picker/biodata-template-picker.component';
import { BiodataToolbarComponent } from '../../components/toolbar/biodata-toolbar.component';
import { BiodataSectionEditorComponent } from '../../components/editor/section-editor/biodata-section-editor.component';
import { BiodataPreviewComponent } from '../../components/preview/biodata-preview.component';
import { AdBannerComponent } from '../../../../shared/components/ad-banner/ad-banner.component';
import { ToolInfoSectionComponent } from '../../../../shared/components/tool-info-section/tool-info-section.component';

const MOBILE_STEPS = ['Fill Details', 'Preview', 'Download'];

@Component({
  selector: 'app-biodata-maker',
  standalone: true,
  imports: [
    CommonModule,
    BiodataTemplatePickerComponent,
    BiodataToolbarComponent,
    BiodataSectionEditorComponent,
    BiodataPreviewComponent,
    AdBannerComponent,
    ToolInfoSectionComponent,
  ],
  templateUrl: './biodata-maker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BiodataMakerComponent {
  readonly store = inject(BiodataStoreService);
  private readonly pdfService = inject(BiodataPdfService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly biodata = computed(() => this.store.activeBiodata());
  readonly isMobile = signal(false);
  readonly mobileStep = signal(1);
  readonly downloading = signal(false);
  readonly stepLabels = MOBILE_STEPS;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const update = () => this.isMobile.set(window.innerWidth < 1024);
      update();
      window.addEventListener('resize', update);
      this.destroyRef.onDestroy(() => window.removeEventListener('resize', update));
    }
  }

  async download(): Promise<void> {
    const b = this.biodata();
    if (!b || this.downloading()) return;
    this.downloading.set(true);
    try {
      await this.pdfService.download(b);
    } finally {
      this.downloading.set(false);
    }
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
