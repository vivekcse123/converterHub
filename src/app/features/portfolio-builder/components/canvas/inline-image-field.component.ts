import { Component, ChangeDetectionStrategy, ElementRef, ViewChild, inject, input, output, signal } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { resolveMediaUrl } from '../../models/portfolio.model';

const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 8 * 1024 * 1024;

@Component({
  selector: 'app-inline-image-field',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="group/img relative shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600
                hover:border-primary-400 transition-colors cursor-pointer"
         [class]="shapeClass() + ' ' + sizeClass()"
         [class.border-solid]="url()"
         [class.dragging]="dragOver()"
         (click)="fileInput.click()"
         (dragover)="onDragOver($event)" (dragleave)="dragOver.set(false)" (drop)="onDrop($event)">

      @if (url()) {
        <img [src]="resolveMediaUrl(url())" alt="" class="w-full h-full object-cover" />
      } @else {
        <div class="w-full h-full flex flex-col items-center justify-center gap-1 text-slate-400">
          <app-icon [name]="shape() === 'circle' ? 'user' : 'image'" [size]="iconSize()" />
        </div>
      }

      @if (uploading()) {
        <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
          <app-icon name="spinner" [size]="20" class="text-white" />
        </div>
      } @else {
        <div class="absolute inset-0 bg-black/0 group-hover/img:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
          <span class="text-white text-[11px] font-semibold">{{ url() ? 'Change' : 'Upload' }}</span>
        </div>
      }

      @if (url() && !uploading()) {
        <button type="button" (click)="clear($event)"
                class="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 hover:bg-red-600 transition-all">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      }
    </div>
    <input #fileInput type="file" accept="image/jpeg,image/png,image/webp" class="hidden" (change)="onFileSelected($event)" (click)="stopClick($event)" />
    @if (errorMsg()) { <p class="text-[11px] text-red-500 mt-1">{{ errorMsg() }}</p> }
  `,
})
export class InlineImageFieldComponent {
  url = input<string | undefined>('');
  kind = input<'avatar' | 'cover'>('cover');
  shape = input<'circle' | 'square' | 'wide'>('square');
  size = input<'sm' | 'md' | 'lg' | 'full'>('md');
  urlChange = output<string>();

  private api = inject(ApiService);
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  readonly uploading = signal(false);
  readonly dragOver = signal(false);
  readonly errorMsg = signal('');
  readonly resolveMediaUrl = resolveMediaUrl;

  shapeClass(): string {
    return this.shape() === 'circle' ? 'rounded-full' : this.shape() === 'wide' ? 'rounded-xl' : 'rounded-xl';
  }
  sizeClass(): string {
    if (this.shape() === 'wide') return 'w-full aspect-[16/9]';
    return { sm: 'w-12 h-12', md: 'w-20 h-20', lg: 'w-28 h-28', full: 'w-full aspect-square' }[this.size()];
  }
  iconSize(): number {
    return { sm: 16, md: 22, lg: 28, full: 32 }[this.size()];
  }

  stopClick(e: Event): void { e.stopPropagation(); }

  onDragOver(e: DragEvent): void { e.preventDefault(); this.dragOver.set(true); }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragOver.set(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) this.upload(file);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.upload(file);
    input.value = '';
  }

  private upload(file: File): void {
    this.errorMsg.set('');
    if (!VALID_TYPES.includes(file.type)) { this.errorMsg.set('Use JPG, PNG or WEBP.'); return; }
    if (file.size > MAX_SIZE) { this.errorMsg.set('Max 8 MB.'); return; }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('kind', this.kind());

    this.uploading.set(true);
    this.api.uploadWithProgress<{ data: { url: string } }>('portfolio/upload-image', formData).subscribe({
      next: (evt) => {
        if (evt.result) {
          this.urlChange.emit(evt.result.data.url);
          this.uploading.set(false);
        }
      },
      error: () => {
        this.errorMsg.set('Upload failed.');
        this.uploading.set(false);
      },
    });
  }

  clear(e: Event): void {
    e.stopPropagation();
    this.urlChange.emit('');
  }
}
