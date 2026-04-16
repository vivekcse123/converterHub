import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { ConverterService } from '../../core/services/converter.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConversionResult } from '../../core/models/conversion.model';

type PdfAction = 'merge' | 'split' | 'compress';

@Component({
  selector: 'app-pdf-editor',
  standalone: true,
  imports: [FormsModule, FileUploadComponent, ProgressBarComponent],
  templateUrl: './pdf-editor.component.html',
})
export class PdfEditorComponent {
  readonly action  = signal<PdfAction>('merge');
  readonly files   = signal<File[]>([]);
  readonly result  = signal<ConversionResult | null>(null);

  readonly actions: { id: PdfAction; label: string; icon: string; desc: string }[] = [
    { id: 'merge',    label: 'Merge PDFs',    icon: '🔗', desc: 'Combine multiple PDFs into one.' },
    { id: 'split',    label: 'Split PDF',     icon: '✂️', desc: 'Split into individual pages.' },
    { id: 'compress', label: 'Compress PDF',  icon: '🗜️', desc: 'Reduce the file size.' },
  ];

  constructor(public converter: ConverterService, private notify: NotificationService) {}

  setAction(a: PdfAction): void { this.action.set(a); this.files.set([]); this.result.set(null); }

  onFiles(f: File[]): void { this.files.set(f); this.result.set(null); }

  convert(): void {
    const fs = this.files();
    if (!fs.length) return;

    const a = this.action();
    const obs =
      a === 'merge'    ? this.converter.pdfMerge(fs) :
      a === 'split'    ? this.converter.pdfSplit(fs[0]) :
                         this.converter.pdfCompress(fs[0]);

    obs.subscribe({
      next: (r) => { this.result.set(r); this.notify.success('Done!'); },
      error: (e) => this.notify.error('Failed', e.error?.message),
    });
  }

  reset(): void { this.files.set([]); this.result.set(null); this.converter.uploadProgress.set(0); }
}
