import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStoreService } from '../../services/resume-store.service';

@Component({
  selector: 'app-photo-upload',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './photo-upload.component.html',
  styles: [`
    .crop-viewport { touch-action: none; user-select: none; }
  `],
})
export class PhotoUploadComponent {
  private readonly store = inject(ResumeStoreService);

  readonly photo = computed(() => this.store.activeResume()?.personal.photoUrl ?? '');

  protected rawSrc = signal<string>('');
  protected editMode = signal(false);
  protected zoom = signal(1.5);
  protected offsetX = signal(0);
  protected offsetY = signal(0);
  protected naturalW = 0;
  protected naturalH = 0;
  protected zoomPct = computed(() => Math.round(this.zoom() * 100));
  protected imgTransform = computed(
    () => `translate(${this.offsetX()}px,${this.offsetY()}px) scale(${this.zoom()})`
  );

  private dragging = false;
  private lastX = 0;
  private lastY = 0;

  @ViewChild('fileInput') private fileInput!: ElementRef<HTMLInputElement>;

  triggerUpload(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const valid = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!valid.includes(file.type)) { alert('Please upload a JPG, PNG or WEBP image.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5 MB.'); return; }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.rawSrc.set(e.target!.result as string);
      this.editMode.set(true);
    };
    reader.readAsDataURL(file);
  }

  onImgLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    this.naturalW = img.naturalWidth;
    this.naturalH = img.naturalHeight;
    const vp = 200;
    const fit = Math.max(vp / this.naturalW, vp / this.naturalH) * 1.05;
    this.zoom.set(fit);
    this.offsetX.set((vp - this.naturalW * fit) / 2);
    this.offsetY.set((vp - this.naturalH * fit) / 2);
  }

  startDrag(event: PointerEvent): void {
    this.dragging = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  onDrag(event: PointerEvent): void {
    if (!this.dragging) return;
    this.offsetX.update(v => v + event.clientX - this.lastX);
    this.offsetY.update(v => v + event.clientY - this.lastY);
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  endDrag(): void { this.dragging = false; }

  zoomIn(): void { this.applyZoom(this.zoom() * 1.12); }
  zoomOut(): void { this.applyZoom(this.zoom() * 0.9); }

  private applyZoom(next: number): void {
    const ratio = next / this.zoom();
    this.offsetX.update(v => 100 - (100 - v) * ratio);
    this.offsetY.update(v => 100 - (100 - v) * ratio);
    this.zoom.set(next);
  }

  applyCrop(): void {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 200, 200);

    const img = new Image();
    img.onload = () => {
      const sx = -this.offsetX() / this.zoom();
      const sy = -this.offsetY() / this.zoom();
      const sw = 200 / this.zoom();
      const sh = 200 / this.zoom();
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 200, 200);
      const result = canvas.toDataURL('image/jpeg', 0.88);
      this.store.updatePersonal({ photoUrl: result });
      this.editMode.set(false);
    };
    img.src = this.rawSrc();
  }

  cancelEdit(): void {
    this.editMode.set(false);
    this.rawSrc.set('');
    if (this.fileInput?.nativeElement) this.fileInput.nativeElement.value = '';
  }

  editPhoto(): void {
    const p = this.photo();
    if (p) { this.rawSrc.set(p); this.editMode.set(true); }
  }

  removePhoto(): void {
    this.editMode.set(false);
    this.rawSrc.set('');
    if (this.fileInput?.nativeElement) this.fileInput.nativeElement.value = '';
    this.store.updatePersonal({ photoUrl: '' });
  }
}
