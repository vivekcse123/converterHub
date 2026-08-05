import { Component, ElementRef, Injector, OnDestroy, PLATFORM_ID, ViewChild, afterNextRender, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { AdBannerComponent } from '../../shared/components/ad-banner/ad-banner.component';
import { ToolInfoSectionComponent } from '../../shared/components/tool-info-section/tool-info-section.component';
import { NotificationService } from '../../core/services/notification.service';

type BgMode = 'transparent' | 'color' | 'gradient' | 'image';
type DragKind = 'move' | 'nw' | 'ne' | 'sw' | 'se';
interface CropRect { x: number; y: number; w: number; h: number; }

interface GradientPreset { id: string; label: string; from: string; to: string; }
interface CropPreset { id: string; label: string; ratio: number | null; }

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

const FULL_CROP: CropRect = { x: 0, y: 0, w: 1, h: 1 };

/**
 * Background Remover / Replacer.
 *
 * Runs entirely client-side via @imgly/background-removal (WASM + ONNX,
 * in-browser matting model) — the photo never leaves the device, so there's
 * no upload step, no backend job, and no file-retention story to explain.
 * The AI model itself (~40-80 MB) is fetched from IMG.LY's CDN on first use
 * and cached by the browser for subsequent runs.
 */
@Component({
  selector: 'app-bg-remover',
  standalone: true,
  imports: [FileUploadComponent, AdBannerComponent, ToolInfoSectionComponent],
  templateUrl: './bg-remover.component.html',
  styles: [`
    .checker {
      background-image:
        conic-gradient(#e2e8f0 25%, transparent 25% 50%, #e2e8f0 50% 75%, transparent 75%);
      background-size: 20px 20px;
    }
    :host-context(.dark) .checker {
      background-image:
        conic-gradient(#334155 25%, transparent 25% 50%, #334155 50% 75%, transparent 75%);
    }
  `],
})
export class BgRemoverComponent implements OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly notify = inject(NotificationService);
  private readonly injector = inject(Injector);

  @ViewChild('canvasEl') canvasRef?: ElementRef<HTMLCanvasElement>;

  readonly originalFile  = signal<File | null>(null);
  readonly originalPreview = signal<string | null>(null);
  readonly isProcessing  = signal(false);
  readonly progress      = signal(0);
  readonly cutout        = signal<HTMLImageElement | null>(null);

  readonly mode        = signal<BgMode>('transparent');
  readonly color       = signal('#ffffff');
  readonly gradientId  = signal('sunset');
  readonly bgImage     = signal<HTMLImageElement | null>(null);

  readonly gradients: GradientPreset[] = [
    { id: 'sunset', label: 'Sunset',      from: '#ff9a8b', to: '#ff6a88' },
    { id: 'ocean',  label: 'Ocean',       from: '#2193b0', to: '#6dd5ed' },
    { id: 'violet', label: 'Violet',      from: '#7f00ff', to: '#e100ff' },
    { id: 'mint',   label: 'Mint',        from: '#00b09b', to: '#96c93d' },
    { id: 'studio', label: 'Studio Grey', from: '#485563', to: '#29323c' },
    { id: 'gold',   label: 'Gold',        from: '#f7971e', to: '#ffd200' },
  ];

  readonly colorSwatches = ['#ffffff', '#f1f5f9', '#0f172a', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#ec4899'];

  // ── Crop ────────────────────────────────────────────────────────────────
  readonly cropMode = signal(false);
  /** Crop rectangle, fractional (0–1) relative to the canvas's own box. */
  readonly crop = signal<CropRect>({ ...FULL_CROP });
  readonly cropPresets: CropPreset[] = [
    { id: 'free', label: 'Free', ratio: null },
    { id: '1:1',  label: '1:1',  ratio: 1 },
    { id: '4:3',  label: '4:3',  ratio: 4 / 3 },
    { id: '3:4',  label: '3:4',  ratio: 3 / 4 },
    { id: '16:9', label: '16:9', ratio: 16 / 9 },
    { id: '9:16', label: '9:16', ratio: 9 / 16 },
  ];

  private dragKind: DragKind | null = null;
  private dragStartPx = { x: 0, y: 0 };
  private dragStartCrop: CropRect = { ...FULL_CROP };
  private dragMove = (e: PointerEvent): void => this.onDragMove(e);
  private dragUp = (): void => {
    this.dragKind = null;
    document.removeEventListener('pointermove', this.dragMove);
    document.removeEventListener('pointerup', this.dragUp);
  };

  onFile(files: File[]): void {
    const f = files[0];
    if (!f) return;
    this.reset(false);
    this.originalFile.set(f);
    const reader = new FileReader();
    reader.onload = (e) => this.originalPreview.set(e.target?.result as string);
    reader.readAsDataURL(f);
  }

  async removeBg(): Promise<void> {
    const file = this.originalFile();
    if (!file || !this.isBrowser || this.isProcessing()) return;

    this.isProcessing.set(true);
    this.progress.set(0);
    try {
      const { removeBackground } = await import('@imgly/background-removal');
      const blob = await removeBackground(file, {
        progress: (_key: string, current: number, total: number) => {
          if (total > 0) this.progress.set(Math.round((current / total) * 100));
        },
      });
      const img = await this.blobToImage(blob);
      this.cutout.set(img);
      this.mode.set('transparent');
      // The result panel (and its #canvasEl) only enters the DOM once cutout()
      // is truthy, so the canvas ref isn't resolved yet on this same tick.
      // afterNextRender() runs once Angular has committed that DOM update.
      afterNextRender(() => this.render(), { injector: this.injector });
      this.notify.success('Background removed!', 'Pick a new background below, or download as-is.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : undefined;
      this.notify.error('Could not remove the background', message || 'Please try a different photo.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  private blobToImage(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Could not decode the processed image.'));
      img.src = url;
    });
  }

  setMode(m: BgMode): void { this.mode.set(m); this.render(); }
  setColor(c: string): void { this.color.set(c); this.mode.set('color'); this.render(); }
  setGradient(id: string): void { this.gradientId.set(id); this.mode.set('gradient'); this.render(); }

  onBgImageFile(e: Event): void {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0];
    input.value = '';
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => { this.bgImage.set(img); this.mode.set('image'); this.render(); };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(f);
  }

  private render(): void {
    const cutout = this.cutout();
    const canvas = this.canvasRef?.nativeElement;
    if (!cutout || !canvas) return;

    canvas.width = cutout.naturalWidth;
    canvas.height = cutout.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const mode = this.mode();
    if (mode === 'color') {
      ctx.fillStyle = this.color();
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (mode === 'gradient') {
      const g = this.gradients.find((x) => x.id === this.gradientId()) ?? this.gradients[0];
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, g.from);
      grad.addColorStop(1, g.to);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (mode === 'image') {
      const bg = this.bgImage();
      if (bg) {
        // Cover-fit: fill the whole canvas, cropping overflow, like CSS background-size: cover.
        const scale = Math.max(canvas.width / bg.naturalWidth, canvas.height / bg.naturalHeight);
        const w = bg.naturalWidth * scale;
        const h = bg.naturalHeight * scale;
        ctx.drawImage(bg, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
      }
    }
    // 'transparent' → canvas stays cleared; the .checker CSS pattern shows through.

    ctx.drawImage(cutout, 0, 0);
  }

  // ── Crop ────────────────────────────────────────────────────────────────
  toggleCrop(): void {
    if (!this.cropMode()) this.crop.set({ ...FULL_CROP });
    this.cropMode.set(!this.cropMode());
  }

  cancelCrop(): void {
    this.cropMode.set(false);
    this.crop.set({ ...FULL_CROP });
  }

  applyCropPreset(ratio: number | null): void {
    if (ratio === null) { this.crop.set({ ...FULL_CROP }); return; }
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !canvas.width || !canvas.height) return;
    const imgRatio = canvas.width / canvas.height;
    const w = ratio > imgRatio ? 1 : ratio / imgRatio;
    const h = ratio > imgRatio ? imgRatio / ratio : 1;
    this.crop.set({ x: (1 - w) / 2, y: (1 - h) / 2, w, h });
  }

  startDrag(kind: DragKind, e: PointerEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.dragKind = kind;
    this.dragStartPx = { x: e.clientX, y: e.clientY };
    this.dragStartCrop = { ...this.crop() };
    document.addEventListener('pointermove', this.dragMove);
    document.addEventListener('pointerup', this.dragUp);
  }

  private onDragMove(e: PointerEvent): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !this.dragKind) return;
    const rect = canvas.getBoundingClientRect();
    const dx = (e.clientX - this.dragStartPx.x) / rect.width;
    const dy = (e.clientY - this.dragStartPx.y) / rect.height;
    const c0 = this.dragStartCrop;
    const minSize = 0.08;
    let { x, y, w, h } = c0;

    if (this.dragKind === 'move') {
      x = clamp(c0.x + dx, 0, 1 - c0.w);
      y = clamp(c0.y + dy, 0, 1 - c0.h);
    } else {
      if (this.dragKind.includes('w')) {
        const newX = clamp(c0.x + dx, 0, c0.x + c0.w - minSize);
        w = c0.x + c0.w - newX;
        x = newX;
      }
      if (this.dragKind.includes('e')) {
        const newRight = clamp(c0.x + c0.w + dx, c0.x + minSize, 1);
        w = newRight - x;
      }
      if (this.dragKind.includes('n')) {
        const newY = clamp(c0.y + dy, 0, c0.y + c0.h - minSize);
        h = c0.y + c0.h - newY;
        y = newY;
      }
      if (this.dragKind.includes('s')) {
        const newBottom = clamp(c0.y + c0.h + dy, c0.y + minSize, 1);
        h = newBottom - y;
      }
    }
    this.crop.set({ x, y, w, h });
  }

  applyCrop(): void {
    const img = this.cutout();
    if (!img) return;
    const c = this.crop();
    const sx = Math.round(c.x * img.naturalWidth);
    const sy = Math.round(c.y * img.naturalHeight);
    const sw = Math.round(c.w * img.naturalWidth);
    const sh = Math.round(c.h * img.naturalHeight);
    if (sw < 1 || sh < 1) return;

    const off = document.createElement('canvas');
    off.width = sw;
    off.height = sh;
    const octx = off.getContext('2d');
    if (!octx) return;
    octx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

    off.toBlob((blob) => {
      if (!blob) return;
      this.blobToImage(blob).then((cropped) => {
        this.cutout.set(cropped);
        this.cropMode.set(false);
        this.crop.set({ ...FULL_CROP });
        this.render();
      });
    }, 'image/png', 1);
  }

  download(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const base = (this.originalFile()?.name || 'image').replace(/\.[^./\\]+$/, '');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${base}-no-bg.png`;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }, 'image/png', 1);
  }

  reset(clearFile = true): void {
    if (clearFile) {
      this.originalFile.set(null);
      this.originalPreview.set(null);
    }
    this.cutout.set(null);
    this.bgImage.set(null);
    this.mode.set('transparent');
    this.progress.set(0);
    this.cropMode.set(false);
    this.crop.set({ ...FULL_CROP });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    document.removeEventListener('pointermove', this.dragMove);
    document.removeEventListener('pointerup', this.dragUp);
  }
}
