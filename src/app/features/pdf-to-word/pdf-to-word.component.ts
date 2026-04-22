import { Component, signal } from '@angular/core';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { ConverterService } from '../../core/services/converter.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConversionResult } from '../../core/models/conversion.model';
import { AdBannerComponent } from '../../shared/components/ad-banner/ad-banner.component';

@Component({
  selector: 'app-pdf-to-word',
  standalone: true,
  imports: [FileUploadComponent, ProgressBarComponent, AdBannerComponent],
  template: `
    <div class="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-14">
      <div class="container-app text-center">
        <div class="w-16 h-16 mx-auto mb-5 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">📄</div>
        <h1 class="text-3xl md:text-4xl font-extrabold mb-3">PDF to Word</h1>
        <p class="text-violet-100 text-lg max-w-md mx-auto">Extract content from a PDF into an editable .docx file.</p>
      </div>
    </div>

    <div class="container-app py-12 max-w-2xl">
      <div class="card p-6 md:p-8">
        <app-file-upload accept="application/pdf" [multiple]="false" [maxSizeMB]="50"
          label="Drop your PDF here" sublabel="PDF files only"
          (filesSelected)="onFile($event)" />

        @if (file()) {
        <div class="mt-6 flex justify-center">
          <button (click)="convert()" [disabled]="converter.isConverting()"
            class="btn btn-primary btn-lg min-w-[200px]">
            @if (!converter.isConverting()) {
            <span>⚡ Convert to Word</span>
            }
            @if (converter.isConverting()) {
            <span>Converting…</span>
            }
          </button>
        </div>
        }

        @if (converter.isConverting()) {
        <div class="mt-4">
          <app-progress-bar [value]="converter.uploadProgress()" [label]="converter.progressLabel()" [showPhase]="true" />
        </div>
        }
      </div>

      @if (result()) {
      <div class="card p-8 text-center mt-6 animate-bounce-in">
        <div class="text-5xl mb-4">✅</div>
        <h2 class="text-xl font-bold mb-4 text-slate-800 dark:text-white">Word document ready!</h2>
        <div class="flex gap-3 justify-center">
          <button type="button" (click)="converter.downloadResult(result()!)" class="btn btn-primary">⬇️ Download .docx</button>
          <button (click)="reset()" class="btn btn-secondary">🔄 Convert Another</button>
        </div>
      </div>
        <app-ad-banner slot="rectangle" />
      }
    </div>
  `,
})
export class PdfToWordComponent {
  readonly file   = signal<File | null>(null);
  readonly result = signal<ConversionResult | null>(null);

  constructor(public converter: ConverterService, private notify: NotificationService) {}

  onFile(files: File[]): void { this.file.set(files[0] ?? null); this.result.set(null); }

  convert(): void {
    const f = this.file();
    if (!f) return;
    this.converter.pdfToWord(f).subscribe({
      next: (r) => { this.result.set(r); this.notify.success('Done!', 'Word document ready.'); },
      error: (e) => this.notify.error('Failed', e.error?.message),
    });
  }

  reset(): void { this.file.set(null); this.result.set(null); this.converter.uploadProgress.set(0); }
}
