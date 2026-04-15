import {
  Component, Input, Output, EventEmitter, signal,
  HostListener, ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UploadedFile {
  file:       File;
  preview?:   string;   // data-URL for images
  id:         string;
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent {
  @Input() accept        = '*/*';
  @Input() multiple      = false;
  @Input() maxSizeMB     = 50;
  @Input() label         = 'Drop files here or click to browse';
  @Input() sublabel      = '';

  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() fileRemoved   = new EventEmitter<string>();

  readonly isDragging  = signal(false);
  readonly uploadedFiles = signal<UploadedFile[]>([]);
  readonly error       = signal<string | null>(null);

  @HostListener('dragover', ['$event'])
  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragging.set(true);
  }

  @HostListener('dragleave')
  onDragLeave(): void { this.isDragging.set(false); }

  @HostListener('drop', ['$event'])
  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragging.set(false);
    const files = Array.from(e.dataTransfer?.files ?? []);
    this.processFiles(files);
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.processFiles(Array.from(input.files ?? []));
    input.value = '';
  }

  removeFile(id: string): void {
    this.uploadedFiles.update((files) => files.filter((f) => f.id !== id));
    this.fileRemoved.emit(id);
    // Notify parent of the updated complete file list after removal
    this.filesSelected.emit(this.uploadedFiles().map((uf) => uf.file));
  }

  clearAll(): void {
    this.uploadedFiles.set([]);
    this.filesSelected.emit([]);
  }

  private processFiles(files: File[]): void {
    this.error.set(null);
    const maxBytes = this.maxSizeMB * 1024 * 1024;

    const valid = files.filter((f) => {
      if (f.size > maxBytes) {
        this.error.set(`"${f.name}" exceeds ${this.maxSizeMB} MB limit.`);
        return false;
      }
      return true;
    });

    if (!valid.length) return;

    // Generate previews for images
    const toAdd: UploadedFile[] = valid.map((f) => ({
      file:    f,
      id:      `${Date.now()}-${Math.random()}`,
      preview: undefined,
    }));

    if (!this.multiple) {
      this.uploadedFiles.set(toAdd.slice(0, 1));
    } else {
      this.uploadedFiles.update((cur) => [...cur, ...toAdd]);
    }

    // Build previews async
    toAdd.forEach((uf) => {
      if (uf.file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedFiles.update((list) =>
            list.map((f) => (f.id === uf.id ? { ...f, preview: e.target?.result as string } : f))
          );
        };
        reader.readAsDataURL(uf.file);
      }
    });

    // Emit the FULL current file list (not just newly added) so parent always has accurate state
    this.filesSelected.emit(this.uploadedFiles().map((uf) => uf.file));
  }

  formatSize(bytes: number): string {
    if (bytes < 1024)       return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
