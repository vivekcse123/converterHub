import { Component, ElementRef, ViewChild, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../../core/services/api.service';

const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 8 * 1024 * 1024;

@Component({
  selector: 'app-image-upload-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <label class="text-xs font-semibold text-slate-500 block mb-1">{{ label() }}</label>
      <div class="flex items-center gap-3">
        @if (url()) {
          <img [src]="url()" alt="" class="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
        } @else {
          <div class="w-14 h-14 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-300 text-xl shrink-0">🖼️</div>
        }
        <div class="flex-1 space-y-1.5 min-w-0">
          <div class="flex items-center gap-3">
            <button type="button" class="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline disabled:opacity-50" [disabled]="uploading()" (click)="fileInput.click()">
              {{ uploading() ? 'Uploading… ' + progress() + '%' : '⬆ Upload image' }}
            </button>
            @if (url()) {
              <button type="button" class="text-xs text-red-400 hover:text-red-600" (click)="clear()">Remove</button>
            }
          </div>
          <input type="url" [ngModel]="url()" (ngModelChange)="urlChange.emit($event)" placeholder="or paste an image URL"
                 class="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none" />
        </div>
      </div>
      <input #fileInput type="file" accept="image/jpeg,image/png,image/webp" class="hidden" (change)="onFileSelected($event)" />
      @if (errorMsg()) { <p class="text-[11px] text-red-500 mt-1">{{ errorMsg() }}</p> }
    </div>
  `,
})
export class ImageUploadFieldComponent {
  readonly label = input<string>('Image');
  readonly url = input<string | undefined>('');
  readonly kind = input<'avatar' | 'cover'>('cover');
  readonly urlChange = output<string>();

  private api = inject(ApiService);
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  readonly uploading = signal(false);
  readonly progress = signal(0);
  readonly errorMsg = signal('');

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.errorMsg.set('');

    if (!VALID_TYPES.includes(file.type)) { this.errorMsg.set('Please upload a JPG, PNG or WEBP image.'); return; }
    if (file.size > MAX_SIZE) { this.errorMsg.set('Image must be under 8 MB.'); return; }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('kind', this.kind());

    this.uploading.set(true);
    this.progress.set(0);
    this.api.uploadWithProgress<{ data: { url: string } }>('portfolio/upload-image', formData).subscribe({
      next: (evt) => {
        this.progress.set(evt.progress);
        if (evt.result) {
          this.urlChange.emit(evt.result.data.url);
          this.uploading.set(false);
          input.value = '';
        }
      },
      error: () => {
        this.errorMsg.set('Upload failed. Please try again.');
        this.uploading.set(false);
        input.value = '';
      },
    });
  }

  clear(): void { this.urlChange.emit(''); }
}
