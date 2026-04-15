import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { ConverterService } from '../../core/services/converter.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConversionResult } from '../../core/models/conversion.model';

@Component({
  selector: 'app-pdf-to-word',
  standalone: true,
  imports: [CommonModule, FileUploadComponent, ProgressBarComponent],
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

        <div *ngIf="file()" class="mt-6 flex justify-center">
          <button (click)="convert()" [disabled]="converter.isConverting()"
            class="btn btn-primary btn-lg min-w-[200px]">
            <span *ngIf="!converter.isConverting()">⚡ Convert to Word</span>
            <span *ngIf="converter.isConverting()">Converting…</span>
          </button>
        </div>

        <div *ngIf="converter.isConverting()" class="mt-4">
          <app-progress-bar [value]="converter.uploadProgress()" />
        </div>
      </div>

      <div *ngIf="result()" class="card p-8 text-center mt-6 animate-bounce-in">
        <div class="text-5xl mb-4">✅</div>
        <h2 class="text-xl font-bold mb-4 text-slate-800 dark:text-white">Word document ready!</h2>
        <div class="flex gap-3 justify-center">
          <a [href]="result()!.downloadUrl" [download]="result()!.fileName" class="btn btn-primary">⬇️ Download .docx</a>
          <button (click)="reset()" class="btn btn-secondary">🔄 Convert Another</button>
        </div>
      </div>
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
