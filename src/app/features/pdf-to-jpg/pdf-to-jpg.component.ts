import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConverterService } from '../../core/services/converter.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConversionResult } from '../../core/models/conversion.model';
import { AdBannerComponent } from '../../shared/components/ad-banner/ad-banner.component';

@Component({
  selector: 'app-pdf-to-jpg',
  standalone: true,
  imports: [FormsModule, AdBannerComponent],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-10">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-1">PDF to JPG</h1>
      <p class="text-slate-500 text-sm mb-6">Convert each PDF page to a high-quality JPG image.</p>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <div (click)="fileInput.click()" (dragover)="$event.preventDefault()" (drop)="onDrop($event)"
             class="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors">
          <div class="text-3xl mb-2">📄</div>
          <p class="text-slate-500 text-sm">{{ file() ? file()!.name : 'Drop PDF here or click to browse' }}</p>
          <input #fileInput type="file" accept=".pdf" class="hidden" (change)="onFileChange($event)" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-slate-500 block mb-1">DPI Quality</label>
            <select [(ngModel)]="dpi" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
              <option value="72">72 – Screen</option>
              <option value="150">150 – Standard</option>
              <option value="300" selected>300 – High Quality</option>
              <option value="600">600 – Print</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-slate-500 block mb-1">Format</label>
            <select [(ngModel)]="format" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
        </div>

        @if (converter.isConverting()) {
        <div>
          <div class="flex justify-between text-xs text-slate-500 mb-1">
            <span>Converting...</span><span>{{ converter.uploadProgress() }}%</span>
          </div>
          <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
            <div class="bg-indigo-500 h-2 rounded-full transition-all" [style.width.%]="converter.uploadProgress()"></div>
          </div>
        </div>
        }

        <button (click)="convert()" [disabled]="!file() || converter.isConverting()"
                class="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Convert to {{ format.toUpperCase() }}
        </button>

        @if (result()) {
        <div class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
          <p class="text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-2">Conversion complete!</p>
          <button type="button" (click)="converter.downloadResult(result()!)"
             class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
            ⬇ Download
          </button>
        </div>
        }
      </div>
    </div>
  `,
})
export class PdfToJpgComponent {
  readonly file   = signal<File | null>(null);
  readonly result = signal<ConversionResult | null>(null);
  dpi = '300'; format = 'jpg';

  constructor(public converter: ConverterService, private notify: NotificationService) {}

  onFileChange(e: Event): void { const f = (e.target as HTMLInputElement).files?.[0]; if (f) this.file.set(f); }
  onDrop(e: DragEvent): void { e.preventDefault(); const f = e.dataTransfer?.files?.[0]; if (f) this.file.set(f); }

  convert(): void {
    if (!this.file()) return;
    this.result.set(null);
    this.converter.pdfToJpg(this.file()!, { dpi: this.dpi, format: this.format }).subscribe({
      next: (r) => this.result.set(r),
      error: (err) => this.notify.error(err?.error?.message || 'Conversion failed'),
    });
  }
}
