import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConverterService } from '../../core/services/converter.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConversionResult } from '../../core/models/conversion.model';

@Component({
  selector: 'app-ocr',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-10">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-1">OCR – Scan to Text</h1>
      <p class="text-slate-500 text-sm mb-6">Extract text from scanned PDFs or images using optical character recognition.</p>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <div (click)="fileInput.click()" (dragover)="$event.preventDefault()" (drop)="onDrop($event)"
             class="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors">
          <div class="text-3xl mb-2">🔍</div>
          <p class="text-slate-500 text-sm">{{ file() ? file()!.name : 'Drop PDF or image here' }}</p>
          <input #fileInput type="file" accept=".pdf,image/*" class="hidden" (change)="onFileChange($event)" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-slate-500 block mb-1">Language</label>
            <select [(ngModel)]="lang" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
              <option value="eng">English</option>
              <option value="fra">French</option>
              <option value="deu">German</option>
              <option value="spa">Spanish</option>
              <option value="por">Portuguese</option>
              <option value="chi_sim">Chinese (Simplified)</option>
              <option value="jpn">Japanese</option>
              <option value="kor">Korean</option>
              <option value="ara">Arabic</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-slate-500 block mb-1">Output Format</label>
            <select [(ngModel)]="outputFormat" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
              <option value="txt">Plain Text (.txt)</option>
              <option value="pdf">Searchable PDF</option>
            </select>
          </div>
        </div>

        @if (converter.isConverting()) {
        <div>
          <div class="flex justify-between text-xs text-slate-500 mb-1"><span>Running OCR...</span><span>{{ converter.uploadProgress() }}%</span></div>
          <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2"><div class="bg-indigo-500 h-2 rounded-full transition-all" [style.width.%]="converter.uploadProgress()"></div></div>
        </div>
        }

        <button (click)="convert()" [disabled]="!file() || converter.isConverting()"
                class="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Run OCR
        </button>

        @if (result()) {
        <div class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
          <p class="text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-2">OCR complete!</p>
          <button type="button" (click)="converter.downloadResult(result()!)" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">⬇ Download Result</button>
        </div>
        }
      </div>
    </div>
  `,
})
export class OcrComponent {
  readonly file   = signal<File | null>(null);
  readonly result = signal<ConversionResult | null>(null);
  lang = 'eng'; outputFormat = 'txt';

  constructor(public converter: ConverterService, private notify: NotificationService) {}

  onFileChange(e: Event): void { const f = (e.target as HTMLInputElement).files?.[0]; if (f) this.file.set(f); }
  onDrop(e: DragEvent): void { e.preventDefault(); const f = e.dataTransfer?.files?.[0]; if (f) this.file.set(f); }

  convert(): void {
    if (!this.file()) return;
    this.result.set(null);
    this.converter.performOCR(this.file()!, { lang: this.lang, outputFormat: this.outputFormat }).subscribe({
      next: (r) => this.result.set(r),
      error: (err) => this.notify.error(err?.error?.message || 'OCR failed'),
    });
  }
}
