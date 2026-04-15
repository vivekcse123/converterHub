import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConverterService } from '../../core/services/converter.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConversionResult } from '../../core/models/conversion.model';

@Component({
  selector: 'app-watermark-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-10">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-1">Watermark PDF</h1>
      <p class="text-slate-500 text-sm mb-6">Add a diagonal text watermark to every page of your PDF.</p>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <div (click)="fileInput.click()" (dragover)="$event.preventDefault()" (drop)="onDrop($event)"
             class="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors">
          <div class="text-3xl mb-2">🔒</div>
          <p class="text-slate-500 text-sm">{{ file() ? file()!.name : 'Drop PDF here or click to browse' }}</p>
          <input #fileInput type="file" accept=".pdf" class="hidden" (change)="onFileChange($event)" />
        </div>

        <div>
          <label class="text-xs text-slate-500 block mb-1">Watermark Text</label>
          <input type="text" [(ngModel)]="text" placeholder="e.g. CONFIDENTIAL"
                 class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm" />
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="text-xs text-slate-500 block mb-1">Font Size</label>
            <input type="number" [(ngModel)]="fontSize" min="12" max="120"
                   class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm" />
          </div>
          <div>
            <label class="text-xs text-slate-500 block mb-1">Opacity (0-1)</label>
            <input type="number" [(ngModel)]="opacity" min="0.05" max="1" step="0.05"
                   class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm" />
          </div>
          <div>
            <label class="text-xs text-slate-500 block mb-1">Color (hex)</label>
            <input type="text" [(ngModel)]="color" placeholder="#FF0000"
                   class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm" />
          </div>
        </div>

        <div *ngIf="converter.isConverting()">
          <div class="flex justify-between text-xs text-slate-500 mb-1"><span>Processing...</span><span>{{ converter.uploadProgress() }}%</span></div>
          <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
            <div class="bg-indigo-500 h-2 rounded-full transition-all" [style.width.%]="converter.uploadProgress()"></div>
          </div>
        </div>

        <button (click)="convert()" [disabled]="!file() || !text || converter.isConverting()"
                class="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Add Watermark
        </button>

        <div *ngIf="result()" class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
          <p class="text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-2">Done!</p>
          <a [href]="result()!.downloadUrl" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">⬇ Download</a>
        </div>
      </div>
    </div>
  `,
})
export class WatermarkPdfComponent {
  readonly file   = signal<File | null>(null);
  readonly result = signal<ConversionResult | null>(null);
  text = 'CONFIDENTIAL'; fontSize = 60; opacity = 0.3; color = '#FF0000';

  constructor(public converter: ConverterService, private notify: NotificationService) {}

  onFileChange(e: Event): void { const f = (e.target as HTMLInputElement).files?.[0]; if (f) this.file.set(f); }
  onDrop(e: DragEvent): void { e.preventDefault(); const f = e.dataTransfer?.files?.[0]; if (f) this.file.set(f); }

  convert(): void {
    if (!this.file() || !this.text) return;
    this.result.set(null);
    this.converter.watermarkPdf(this.file()!, { text: this.text, fontSize: String(this.fontSize), opacity: String(this.opacity), color: this.color }).subscribe({
      next: (r) => this.result.set(r),
      error: (err) => this.notify.error(err?.error?.message || 'Conversion failed'),
    });
  }
}
