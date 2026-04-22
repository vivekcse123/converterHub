import { Component, signal } from '@angular/core';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { ConverterService } from '../../core/services/converter.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConversionResult } from '../../core/models/conversion.model';
import { FormsModule } from '@angular/forms';
import { AdBannerComponent } from '../../shared/components/ad-banner/ad-banner.component';

@Component({
  selector: 'app-unlock-pdf',
  standalone: true,
  imports: [FileUploadComponent, ProgressBarComponent, FormsModule, AdBannerComponent],
  template: `
    <div class="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-14">
      <div class="container-app text-center">
        <div class="w-16 h-16 mx-auto mb-5 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">🔓</div>
        <h1 class="text-3xl md:text-4xl font-extrabold mb-3">Unlock PDF</h1>
        <p class="text-green-100 text-lg max-w-md mx-auto">Remove password protection from a PDF file.</p>
      </div>
    </div>

    <div class="container-app py-12 max-w-2xl">
      <div class="card p-6 md:p-8">
        <app-file-upload accept="application/pdf" [multiple]="false" [maxSizeMB]="100"
          label="Drop your protected PDF here" sublabel="PDF files only"
          (filesSelected)="onFile($event)" />

        @if (file()) {
          <div class="mt-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password (if applicable)
              </label>
              <input type="password" [(ngModel)]="password" placeholder="Enter PDF password"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700
                       bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <p class="text-xs text-slate-400 mt-1">Leave blank if you want to attempt unlock without a password.</p>
            </div>
            <div class="flex justify-center">
              <button (click)="convert()" [disabled]="converter.isConverting()"
                class="btn btn-primary btn-lg min-w-[200px]">
                @if (!converter.isConverting()) { <span>🔓 Unlock PDF</span> }
                @if (converter.isConverting())  { <span>Unlocking…</span> }
              </button>
            </div>
          </div>
        }

        @if (converter.isConverting()) {
          <div class="mt-4">
            <app-progress-bar [value]="converter.uploadProgress()" label="Unlocking PDF…" />
          </div>
        }
      </div>

      @if (result()) {
        <div class="card p-8 text-center mt-6 animate-bounce-in">
          <div class="text-5xl mb-4">✅</div>
          <h2 class="text-xl font-bold mb-4 text-slate-800 dark:text-white">PDF unlocked!</h2>
          <div class="flex gap-3 justify-center">
            <button type="button" (click)="converter.downloadResult(result()!)" class="btn btn-primary">⬇️ Download PDF</button>
            <button (click)="reset()" class="btn btn-secondary">🔄 Unlock Another</button>
          </div>
        </div>
        <app-ad-banner slot="rectangle" />
      }
    </div>
  `,
})
export class UnlockPdfComponent {
  readonly file   = signal<File | null>(null);
  readonly result = signal<ConversionResult | null>(null);
  password = '';

  constructor(public converter: ConverterService, private notify: NotificationService) {}

  onFile(files: File[]): void { this.file.set(files[0] ?? null); this.result.set(null); }

  convert(): void {
    const f = this.file();
    if (!f) return;
    this.converter.unlockPdf(f, this.password).subscribe({
      next: (r) => { this.result.set(r); this.notify.success('Done!', 'PDF unlocked.'); },
      error: (e) => this.notify.error('Failed', e.error?.message ?? 'Could not unlock PDF. Wrong password?'),
    });
  }

  reset(): void { this.file.set(null); this.result.set(null); this.password = ''; this.converter.uploadProgress.set(0); }
}
