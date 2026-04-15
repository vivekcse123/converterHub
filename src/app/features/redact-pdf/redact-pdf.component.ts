import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConverterService } from '../../core/services/converter.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConversionResult } from '../../core/models/conversion.model';

@Component({
  selector: 'app-redact-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-10">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-1">Redact PDF</h1>
      <p class="text-slate-500 text-sm mb-6">Permanently black-out regions on specified pages.</p>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <div (click)="fileInput.click()" (dragover)="$event.preventDefault()" (drop)="onDrop($event)"
             class="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors">
          <div class="text-3xl mb-2">🖊️</div>
          <p class="text-slate-500 text-sm">{{ file() ? file()!.name : 'Drop PDF here or click to browse' }}</p>
          <input #fileInput type="file" accept=".pdf" class="hidden" (change)="onFileChange($event)" />
        </div>

        <!-- Regions -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs text-slate-500">Redaction Regions</label>
            <button (click)="addRegion()" class="text-xs text-indigo-500 hover:text-indigo-700">+ Add Region</button>
          </div>
          <div *ngFor="let r of regions; let i = index" class="grid grid-cols-6 gap-2 mb-2 items-center">
            <input type="number" [(ngModel)]="r.page" placeholder="Page" min="1"
                   class="col-span-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-xs" />
            <input type="number" [(ngModel)]="r.x" placeholder="X"
                   class="col-span-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-xs" />
            <input type="number" [(ngModel)]="r.y" placeholder="Y"
                   class="col-span-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-xs" />
            <input type="number" [(ngModel)]="r.width" placeholder="W"
                   class="col-span-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-xs" />
            <input type="number" [(ngModel)]="r.height" placeholder="H"
                   class="col-span-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-xs" />
            <button (click)="removeRegion(i)" class="text-xs text-red-400 hover:text-red-600">✕</button>
          </div>
          <p *ngIf="!regions.length" class="text-xs text-slate-400">Add at least one region to redact.</p>
        </div>

        <div *ngIf="converter.isConverting()">
          <div class="flex justify-between text-xs text-slate-500 mb-1"><span>Redacting...</span><span>{{ converter.uploadProgress() }}%</span></div>
          <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2"><div class="bg-indigo-500 h-2 rounded-full transition-all" [style.width.%]="converter.uploadProgress()"></div></div>
        </div>

        <button (click)="convert()" [disabled]="!file() || !regions.length || converter.isConverting()"
                class="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Redact PDF
        </button>

        <div *ngIf="result()" class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
          <p class="text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-2">Redacted!</p>
          <a [href]="result()!.downloadUrl" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">⬇ Download</a>
        </div>
      </div>
    </div>
  `,
})
export class RedactPdfComponent {
  readonly file   = signal<File | null>(null);
  readonly result = signal<ConversionResult | null>(null);
  regions: { page: number; x: number; y: number; width: number; height: number }[] = [{ page: 1, x: 50, y: 50, width: 200, height: 30 }];

  constructor(public converter: ConverterService, private notify: NotificationService) {}

  onFileChange(e: Event): void { const f = (e.target as HTMLInputElement).files?.[0]; if (f) this.file.set(f); }
  onDrop(e: DragEvent): void { e.preventDefault(); const f = e.dataTransfer?.files?.[0]; if (f) this.file.set(f); }
  addRegion(): void { this.regions.push({ page: 1, x: 50, y: 50, width: 200, height: 30 }); }
  removeRegion(i: number): void { this.regions.splice(i, 1); }

  convert(): void {
    if (!this.file() || !this.regions.length) return;
    this.result.set(null);
    const opts = { regions: JSON.stringify(this.regions) };
    this.converter.redactPdf(this.file()!, opts).subscribe({
      next: (r) => this.result.set(r),
      error: (err) => this.notify.error(err?.error?.message || 'Redaction failed'),
    });
  }
}
