import { Component, signal, computed } from '@angular/core';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { ConverterService } from '../../core/services/converter.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConversionResult } from '../../core/models/conversion.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-organize-pdf',
  standalone: true,
  imports: [FileUploadComponent, ProgressBarComponent, FormsModule],
  template: `
    <div class="bg-gradient-to-r from-purple-600 to-violet-600 text-white py-14">
      <div class="container-app text-center">
        <div class="w-16 h-16 mx-auto mb-5 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">📑</div>
        <h1 class="text-3xl md:text-4xl font-extrabold mb-3">Organize PDF</h1>
        <p class="text-purple-100 text-lg max-w-md mx-auto">Reorder or delete specific pages from your PDF.</p>
      </div>
    </div>

    <div class="container-app py-12 max-w-2xl">
      <div class="card p-6 md:p-8">
        <app-file-upload accept="application/pdf" [multiple]="false" [maxSizeMB]="100"
          label="Drop your PDF here" sublabel="PDF files only"
          (filesSelected)="onFile($event)" />

        @if (file()) {
          <div class="mt-6 space-y-4">
            <!-- Page Order Input -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Page Order
                <span class="font-normal text-slate-400 ml-1">(comma-separated, e.g. "3,1,2" or omit pages to delete them)</span>
              </label>
              <input type="text" [(ngModel)]="pageOrderInput"
                placeholder="e.g. 1,3,5,2,4  — omit pages to delete them"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700
                       bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>

            @if (parsedPages().length) {
              <div class="flex flex-wrap gap-2">
                @for (p of parsedPages(); track p) {
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                               bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                    Page {{ p }}
                  </span>
                }
              </div>
            }

            <div class="flex justify-center pt-2">
              <button (click)="convert()" [disabled]="converter.isConverting() || !parsedPages().length"
                class="btn btn-primary btn-lg min-w-[200px] disabled:opacity-50">
                @if (!converter.isConverting()) { <span>📑 Organize PDF</span> }
                @if (converter.isConverting())  { <span>Organizing…</span> }
              </button>
            </div>
          </div>
        }

        @if (converter.isConverting()) {
          <div class="mt-4">
            <app-progress-bar [value]="converter.uploadProgress()" label="Organizing PDF…" />
          </div>
        }
      </div>

      @if (result()) {
        <div class="card p-8 text-center mt-6 animate-bounce-in">
          <div class="text-5xl mb-4">✅</div>
          <h2 class="text-xl font-bold mb-4 text-slate-800 dark:text-white">PDF organized!</h2>
          @if (result()!.pageCount) {
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Output has {{ result()!.pageCount }} pages.</p>
          }
          <div class="flex gap-3 justify-center">
            <button type="button" (click)="converter.downloadResult(result()!)" class="btn btn-primary">⬇️ Download PDF</button>
            <button (click)="reset()" class="btn btn-secondary">🔄 Organize Another</button>
          </div>
        </div>
      }
    </div>
  `,
})
export class OrganizePdfComponent {
  readonly file   = signal<File | null>(null);
  readonly result = signal<ConversionResult | null>(null);
  pageOrderInput = '';

  readonly parsedPages = computed<number[]>(() => {
    return this.pageOrderInput
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n > 0);
  });

  constructor(public converter: ConverterService, private notify: NotificationService) {}

  onFile(files: File[]): void { this.file.set(files[0] ?? null); this.result.set(null); }

  convert(): void {
    const f = this.file();
    const order = this.parsedPages();
    if (!f || !order.length) return;
    this.converter.organizePdf(f, order).subscribe({
      next: (r) => { this.result.set(r); this.notify.success('Done!', 'PDF organized.'); },
      error: (e) => this.notify.error('Failed', e.error?.message ?? 'Could not organize PDF'),
    });
  }

  reset(): void {
    this.file.set(null); this.result.set(null);
    this.pageOrderInput = '';
    this.converter.uploadProgress.set(0);
  }
}
