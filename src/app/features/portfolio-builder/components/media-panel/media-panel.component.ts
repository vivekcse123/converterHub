import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { MediaItem, PortfolioMediaService } from '../../services/portfolio-media.service';
import { resolveMediaUrl } from '../../models/portfolio.model';

@Component({
  selector: 'app-media-panel',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="p-4">
      <div class="rounded-2xl border-2 border-dashed transition-colors flex flex-col items-center justify-center gap-1.5 py-8 px-4 cursor-pointer text-center"
           [class]="dragOver() ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-300 dark:border-slate-700 hover:border-primary-400'"
           (click)="fileInput.click()"
           (dragover)="onDragOver($event)" (dragleave)="dragOver.set(false)" (drop)="onDrop($event)">
        @if (uploading()) {
          <app-icon name="spinner" [size]="22" class="text-primary-500" />
          <p class="text-xs text-slate-400 mt-1">Uploading…</p>
        } @else {
          <app-icon name="image" [size]="22" class="text-slate-300" />
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Drop an image or click to upload</p>
          <p class="text-[10px] text-slate-400">JPG, PNG, WEBP — up to 8MB</p>
        }
      </div>
      <input #fileInput type="file" accept="image/jpeg,image/png,image/webp" class="hidden" (change)="onFileSelected($event)" />

      <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-5 mb-2.5">Your uploads</p>

      @if (loading()) {
        <div class="grid grid-cols-3 gap-2">
          @for (i of [1,2,3,4,5,6]; track i) { <div class="aspect-square rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse"></div> }
        </div>
      } @else if (media().length === 0) {
        <p class="text-xs text-slate-400 text-center py-6">No uploads yet — images you upload anywhere in the builder will show up here.</p>
      } @else {
        <div class="grid grid-cols-3 gap-2">
          @for (m of media(); track m.filename) {
            <div class="group relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <img [src]="resolveMediaUrl(m.url)" alt="" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                <button type="button" (click)="copyUrl(m.url)" title="Copy URL" class="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-slate-700 hover:bg-white">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg>
                </button>
                <button type="button" (click)="remove(m.filename)" title="Delete" class="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-red-600 hover:bg-white">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6"/></svg>
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class MediaPanelComponent implements OnInit {
  private mediaService = inject(PortfolioMediaService);
  private notify = inject(NotificationService);

  readonly media = signal<MediaItem[]>([]);
  readonly loading = signal(true);
  readonly uploading = signal(false);
  readonly dragOver = signal(false);
  readonly resolveMediaUrl = resolveMediaUrl;

  async ngOnInit(): Promise<void> {
    await this.refresh();
  }

  private async refresh(): Promise<void> {
    this.loading.set(true);
    try {
      this.media.set(await this.mediaService.list());
    } catch {
      this.notify.error('Could not load media', 'Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  onDragOver(e: DragEvent): void { e.preventDefault(); this.dragOver.set(true); }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragOver.set(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) this.upload(file);
  }

  onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.upload(file);
    input.value = '';
  }

  private async upload(file: File): Promise<void> {
    this.uploading.set(true);
    try {
      await this.mediaService.upload(file, 'cover');
      await this.refresh();
      this.notify.success('Image uploaded');
    } catch {
      this.notify.error('Upload failed', 'Please try again.');
    } finally {
      this.uploading.set(false);
    }
  }

  async copyUrl(url: string): Promise<void> {
    await navigator.clipboard.writeText(url);
    this.notify.success('URL copied', 'Paste it into any image field.');
  }

  async remove(filename: string): Promise<void> {
    try {
      await this.mediaService.remove(filename);
      this.media.update(items => items.filter(m => m.filename !== filename));
    } catch {
      this.notify.error('Delete failed', 'Please try again.');
    }
  }
}
