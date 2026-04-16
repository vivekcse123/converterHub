import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { ConverterService } from '../../core/services/converter.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConversionResult } from '../../core/models/conversion.model';

type ImageAction = 'resize' | 'compress' | 'convert';

@Component({
  selector: 'app-image-editor',
  standalone: true,
  imports: [FormsModule, FileUploadComponent, ProgressBarComponent],
  templateUrl: './image-editor.component.html',
})
export class ImageEditorComponent {
  readonly action = signal<ImageAction>('resize');
  readonly file   = signal<File | null>(null);
  readonly result = signal<ConversionResult | null>(null);

  // Resize options
  width  = '';
  height = '';
  fit    = 'inside';

  // Compress options
  quality = 75;
  format  = 'jpeg';

  // Convert options
  targetFormat = 'jpeg';

  readonly actions = [
    { id: 'resize'   as ImageAction, label: 'Resize',   icon: '↔️' },
    { id: 'compress' as ImageAction, label: 'Compress', icon: '🗜️' },
    { id: 'convert'  as ImageAction, label: 'Convert',  icon: '🔄' },
  ];

  readonly formats = ['jpeg', 'png', 'webp', 'bmp'];

  constructor(public converter: ConverterService, private notify: NotificationService) {}

  setAction(a: ImageAction): void { this.action.set(a); this.file.set(null); this.result.set(null); }
  onFile(files: File[]): void     { this.file.set(files[0] ?? null); this.result.set(null); }

  convert(): void {
    const f = this.file();
    if (!f) return;

    const a   = this.action();
    const obs =
      a === 'resize'   ? this.converter.imageResize(f,   { width: this.width, height: this.height, fit: this.fit }) :
      a === 'compress' ? this.converter.imageCompress(f, { quality: String(this.quality), format: this.format }) :
                         this.converter.imageConvert(f,  this.targetFormat);

    obs.subscribe({
      next:  (r) => { this.result.set(r); this.notify.success('Done!'); },
      error: (e) => this.notify.error('Failed', e.error?.message),
    });
  }

  reset(): void { this.file.set(null); this.result.set(null); this.converter.uploadProgress.set(0); }
}
