import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConverterService } from '../../core/services/converter.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConversionResult } from '../../core/models/conversion.model';

@Component({
  selector: 'app-compare-pdfs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-10">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-1">Compare PDFs</h1>
      <p class="text-slate-500 text-sm mb-6">Get a word-level diff report between two PDF documents.</p>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-slate-500 block mb-1">Original PDF</label>
            <div (click)="pdf1Input.click()" class="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 transition-colors">
              <p class="text-slate-500 text-sm">{{ file1() ? file1()!.name : 'Drop or click' }}</p>
              <input #pdf1Input type="file" accept=".pdf" class="hidden" (change)="onFile($event, 1)" />
            </div>
          </div>
          <div>
            <label class="text-xs text-slate-500 block mb-1">Modified PDF</label>
            <div (click)="pdf2Input.click()" class="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 transition-colors">
              <p class="text-slate-500 text-sm">{{ file2() ? file2()!.name : 'Drop or click' }}</p>
              <input #pdf2Input type="file" accept=".pdf" class="hidden" (change)="onFile($event, 2)" />
            </div>
          </div>
        </div>

        <div *ngIf="converter.isConverting()">
          <div class="flex justify-between text-xs text-slate-500 mb-1"><span>Comparing...</span><span>{{ converter.uploadProgress() }}%</span></div>
          <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2"><div class="bg-indigo-500 h-2 rounded-full transition-all" [style.width.%]="converter.uploadProgress()"></div></div>
        </div>

        <button (click)="convert()" [disabled]="!file1() || !file2() || converter.isConverting()"
                class="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Compare Documents
        </button>

        <div *ngIf="result()" class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
          <p class="text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-2">Diff report ready!</p>
          <a [href]="result()!.downloadUrl" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">⬇ Download HTML Report</a>
        </div>
      </div>
    </div>
  `,
})
export class ComparePdfsComponent {
  readonly file1  = signal<File | null>(null);
  readonly file2  = signal<File | null>(null);
  readonly result = signal<ConversionResult | null>(null);

  constructor(public converter: ConverterService, private notify: NotificationService) {}

  onFile(e: Event, n: 1 | 2): void {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    n === 1 ? this.file1.set(f) : this.file2.set(f);
  }

  convert(): void {
    if (!this.file1() || !this.file2()) return;
    this.result.set(null);
    this.converter.comparePdfs(this.file1()!, this.file2()!).subscribe({
      next: (r) => this.result.set(r),
      error: (err) => this.notify.error(err?.error?.message || 'Comparison failed'),
    });
  }
}
