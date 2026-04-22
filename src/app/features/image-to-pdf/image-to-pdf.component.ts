import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { ConverterService } from '../../core/services/converter.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConversionResult } from '../../core/models/conversion.model';
import { AdBannerComponent } from '../../shared/components/ad-banner/ad-banner.component';

@Component({
  selector: 'app-image-to-pdf',
  standalone: true,
  imports: [FormsModule, FileUploadComponent, ProgressBarComponent, AdBannerComponent],
  templateUrl: './image-to-pdf.component.html',
  styleUrls: ['./image-to-pdf.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageToPdfComponent {
  // ─── State ───────────────────────────────────────────────
  readonly files       = signal<File[]>([]);
  readonly result      = signal<ConversionResult | null>(null);
  readonly step        = signal<'upload' | 'options' | 'done'>('upload');

  // ─── Options ─────────────────────────────────────────────
  pageSize    = 'A4';
  orientation = 'portrait';
  margin      = 20;

  readonly pageSizes   = ['A4', 'LETTER', 'LEGAL', 'A3'];
  readonly orientations = [
    { value: 'portrait',  label: 'Portrait' },
    { value: 'landscape', label: 'Landscape' },
  ];

  private readonly doc = inject(DOCUMENT);

  constructor(
    public converter: ConverterService,
    private notify: NotificationService,
  ) {}

  onFilesSelected(selected: File[]): void {
    this.files.set(selected);
    this.result.set(null);
    if (selected.length) {
      this.step.set('options');
    } else {
      this.step.set('upload');
    }
  }

  onFileRemoved(): void {
    // files signal is already updated via filesSelected emit from FileUploadComponent
    if (!this.files().length) this.step.set('upload');
  }

  convert(): void {
    const currentFiles = this.files();
    if (!currentFiles.length) {
      this.notify.warning('No files selected', 'Please add at least one image.');
      return;
    }

    this.converter
      .imageToPdf(currentFiles, {
        pageSize:    this.pageSize,
        orientation: this.orientation,
        margin:      String(this.margin),
      })
      .subscribe({
        next: (res) => {
          this.result.set(res);
          this.step.set('done');
          this.notify.success('Conversion complete!', 'Your PDF is ready to download.');
        },
        error: (err) => {
          this.notify.error('Conversion failed', err.error?.message ?? 'Please try again.');
          this.converter.isConverting.set(false);
        },
      });
  }

  downloadFile(): void {
    const res = this.result();
    if (res) this.converter.downloadResult(res);
  }

  reset(): void {
    this.files.set([]);
    this.result.set(null);
    this.step.set('upload');
    this.converter.uploadProgress.set(0);
    this.converter.isConverting.set(false);
  }

  formatSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
