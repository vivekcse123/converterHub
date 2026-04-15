import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { ConverterService } from '../../core/services/converter.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConversionResult } from '../../core/models/conversion.model';

@Component({
  selector: 'app-compress',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadComponent, ProgressBarComponent],
  template: `
    <div class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-14">
      <div class="container-app text-center">
        <div class="w-16 h-16 mx-auto mb-5 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">🗜️</div>
        <h1 class="text-3xl md:text-4xl font-extrabold mb-3">File Compressor</h1>
        <p class="text-emerald-100 text-lg max-w-md mx-auto">Bundle files into a ZIP archive.</p>
      </div>
    </div>

    <div class="container-app py-12 max-w-2xl">
      <div class="card p-6 md:p-8">
        <app-file-upload accept="image/*,application/pdf,.txt"
          [multiple]="true" [maxSizeMB]="50" label="Drop files to compress / bundle"
          (filesSelected)="onFiles($event)" />

        <div *ngIf="files().length" class="mt-6 flex justify-center">
          <button (click)="convert()" [disabled]="converter.isConverting()" class="btn btn-primary btn-lg min-w-[200px]">
            <span *ngIf="!converter.isConverting()">⚡ Create ZIP</span>
            <span *ngIf="converter.isConverting()">Packing…</span>
          </button>
        </div>
        <app-progress-bar *ngIf="converter.isConverting()" class="mt-4" [value]="converter.uploadProgress()" />
      </div>

      <div *ngIf="result()" class="card p-8 text-center mt-6 animate-bounce-in">
        <div class="text-5xl mb-4">✅</div>
        <h2 class="text-xl font-bold mb-4 text-slate-800 dark:text-white">ZIP created!</h2>
        <div class="flex gap-3 justify-center">
          <a [href]="result()!.downloadUrl" [download]="result()!.fileName" class="btn btn-primary">⬇️ Download ZIP</a>
          <button (click)="reset()" class="btn btn-secondary">🔄 Create Another</button>
        </div>
      </div>
    </div>
  `,
})
export class CompressComponent {
  readonly files  = signal<File[]>([]);
  readonly result = signal<ConversionResult | null>(null);

  constructor(public converter: ConverterService, private notify: NotificationService) {}

  onFiles(f: File[]): void { this.files.set(f); this.result.set(null); }

  convert(): void {
    this.converter.createZip(this.files()).subscribe({
      next:  (r) => { this.result.set(r); this.notify.success('ZIP ready!'); },
      error: (e) => this.notify.error('Failed', e.error?.message),
    });
  }

  reset(): void { this.files.set([]); this.result.set(null); this.converter.uploadProgress.set(0); }
}
