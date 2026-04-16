import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConverterService } from '../../core/services/converter.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConversionResult } from '../../core/models/conversion.model';

@Component({
  selector: 'app-sign-pdf',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-10">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-1">Sign PDF</h1>
      <p class="text-slate-500 text-sm mb-6">Place a signature image onto your PDF document.</p>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <!-- PDF Upload -->
        <div>
          <label class="text-xs text-slate-500 block mb-1">PDF Document</label>
          <div (click)="pdfInput.click()" (dragover)="$event.preventDefault()" (drop)="onDrop($event, 'pdf')"
               class="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 transition-colors">
            <p class="text-slate-500 text-sm">{{ pdfFile() ? pdfFile()!.name : 'Drop PDF or click to browse' }}</p>
            <input #pdfInput type="file" accept=".pdf" class="hidden" (change)="onFileChange($event, 'pdf')" />
          </div>
        </div>

        <!-- Signature Image -->
        <div>
          <label class="text-xs text-slate-500 block mb-1">Signature Image (PNG/JPG)</label>
          <div (click)="sigInput.click()" (dragover)="$event.preventDefault()" (drop)="onDrop($event, 'sig')"
               class="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-400 transition-colors">
            <p class="text-slate-500 text-sm">{{ sigFile() ? sigFile()!.name : 'Drop signature image or click to browse' }}</p>
            <input #sigInput type="file" accept="image/*" class="hidden" (change)="onFileChange($event, 'sig')" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-slate-500 block mb-1">Signer Name</label>
            <input type="text" [(ngModel)]="signerName" placeholder="John Doe"
                   class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm" />
          </div>
          <div>
            <label class="text-xs text-slate-500 block mb-1">Page Number</label>
            <input type="number" [(ngModel)]="pageNumber" min="1"
                   class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm" />
          </div>
          <div>
            <label class="text-xs text-slate-500 block mb-1">X Position (pt)</label>
            <input type="number" [(ngModel)]="x"
                   class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm" />
          </div>
          <div>
            <label class="text-xs text-slate-500 block mb-1">Y Position (pt)</label>
            <input type="number" [(ngModel)]="y"
                   class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm" />
          </div>
        </div>

        @if (converter.isConverting()) {
        <div>
          <div class="flex justify-between text-xs text-slate-500 mb-1"><span>Signing...</span><span>{{ converter.uploadProgress() }}%</span></div>
          <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2"><div class="bg-indigo-500 h-2 rounded-full transition-all" [style.width.%]="converter.uploadProgress()"></div></div>
        </div>
        }

        <button (click)="convert()" [disabled]="!pdfFile() || converter.isConverting()"
                class="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Sign PDF
        </button>

        @if (result()) {
        <div class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
          <p class="text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-2">Signed successfully!</p>
          <a [href]="result()!.downloadUrl" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">⬇ Download</a>
        </div>
        }
      </div>
    </div>
  `,
})
export class SignPdfComponent {
  readonly pdfFile = signal<File | null>(null);
  readonly sigFile = signal<File | null>(null);
  readonly result  = signal<ConversionResult | null>(null);
  signerName = ''; pageNumber = 1; x = 50; y = 50;

  constructor(public converter: ConverterService, private notify: NotificationService) {}

  onFileChange(e: Event, type: 'pdf' | 'sig'): void {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    type === 'pdf' ? this.pdfFile.set(f) : this.sigFile.set(f);
  }
  onDrop(e: DragEvent, type: 'pdf' | 'sig'): void {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0];
    if (!f) return;
    type === 'pdf' ? this.pdfFile.set(f) : this.sigFile.set(f);
  }

  convert(): void {
    if (!this.pdfFile()) return;
    this.result.set(null);
    const opts = { signerName: this.signerName, pageNumber: String(this.pageNumber), x: String(this.x), y: String(this.y) };
    this.converter.signPdf(this.pdfFile()!, this.sigFile(), opts).subscribe({
      next: (r) => this.result.set(r),
      error: (err) => this.notify.error(err?.error?.message || 'Signing failed'),
    });
  }
}
