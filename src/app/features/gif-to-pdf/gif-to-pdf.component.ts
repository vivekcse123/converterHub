import { Component, signal } from '@angular/core';
import { ConverterService } from '../../core/services/converter.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConversionResult } from '../../core/models/conversion.model';
import { AdBannerComponent } from '../../shared/components/ad-banner/ad-banner.component';

@Component({
  selector: 'app-gif-to-pdf',
  standalone: true,
  imports: [],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-10">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-1">GIF to PDF</h1>
      <p class="text-slate-500 text-sm mb-6">Convert animated or static GIF frames into a multi-page PDF.</p>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <div (click)="fi.click()" class="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors">
          <div class="text-3xl mb-2">🎞️</div>
          <p class="text-slate-500 text-sm">{{ files().length ? files().length + ' file(s) selected' : 'Drop GIF file(s) or click to browse' }}</p>
          <input #fi type="file" accept=".gif" multiple class="hidden" (change)="onFiles($event)" />
        </div>
        @if (files().length) {
        <div class="space-y-1">
          @for (f of files(); track $index) {
          <div class="text-xs text-slate-500 px-2 py-1 bg-slate-50 dark:bg-slate-700 rounded">{{ f.name }}</div>
          }
        </div>
        }
        @if (c.isConverting()) {
        <div>
          <div class="flex justify-between text-xs text-slate-500 mb-1"><span>Converting...</span><span>{{ c.uploadProgress() }}%</span></div>
          <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2"><div class="bg-indigo-500 h-2 rounded-full" [style.width.%]="c.uploadProgress()"></div></div>
        </div>
        }
        <button (click)="go()" [disabled]="!files().length || c.isConverting()" class="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Convert to PDF</button>
        @if (result()) {
        <div class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
          <p class="text-emerald-700 dark:text-emerald-400 text-sm mb-2">Done!</p>
          <button type="button" (click)="c.downloadResult(result()!)" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">Download PDF</button>
        </div>
        }
      </div>
    </div>`,
})
export class GifToPdfComponent {
  readonly files  = signal<File[]>([]);
  readonly result = signal<ConversionResult | null>(null);
  constructor(public c: ConverterService, private n: NotificationService) {}
  onFiles(e: Event): void { const fl = (e.target as HTMLInputElement).files; if (fl) this.files.set(Array.from(fl)); }
  go(): void { if (!this.files().length) return; this.result.set(null); this.c.gifToPdf(this.files()).subscribe({ next: r => this.result.set(r), error: err => this.n.error(err?.error?.message || 'Failed') }); }
}
