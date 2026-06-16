import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule, NgComponentOutlet, isPlatformBrowser } from '@angular/common';
import { ResumeData } from '../../models/resume.model';
import { getTemplateMeta } from '../../data/resume-templates.data';

const A4_HEIGHT_MM = 297;
const A4_WIDTH_MM = 210;

@Component({
  selector: 'app-resume-preview',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  templateUrl: './resume-preview.component.html',
  styleUrl: './resume-preview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumePreviewComponent implements AfterViewInit, OnDestroy {
  readonly resume = input.required<ResumeData>();
  /** When true, shows zoom controls + page count + page-break guides. Set to false for compact thumbnails. */
  readonly showControls = input(true);

  @ViewChild('pageHost') pageHost?: ElementRef<HTMLElement>;
  @ViewChild('scrollHost') scrollHost?: ElementRef<HTMLElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private resizeObserver?: ResizeObserver;

  readonly zoom = signal(1);
  /** When true, zoom auto-adjusts to fit the available width (no horizontal scrolling). */
  readonly autoFit = signal(true);
  readonly pageBreaks = signal<number[]>([]);
  readonly pageCount = computed(() => this.pageBreaks().length + 1);

  readonly templateComponent = computed(() => getTemplateMeta(this.resume().templateId).component);
  readonly templateInputs = computed(() => ({ resume: this.resume() }));

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.pageHost || !this.scrollHost) return;

    this.resizeObserver = new ResizeObserver(() => {
      this.recalculateFit();
      this.recalculatePages();
    });
    this.resizeObserver.observe(this.pageHost.nativeElement);
    this.resizeObserver.observe(this.scrollHost.nativeElement);
    // Defer first measurement until child template content has rendered.
    setTimeout(() => {
      this.recalculateFit();
      this.recalculatePages();
    }, 50);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  zoomIn(): void {
    this.autoFit.set(false);
    this.zoom.update(z => Math.min(1.5, Math.round((z + 0.1) * 10) / 10));
  }

  zoomOut(): void {
    this.autoFit.set(false);
    this.zoom.update(z => Math.max(0.3, Math.round((z - 0.1) * 10) / 10));
  }

  /** Re-enables auto-fit so the page scales to exactly fill the available width. */
  resetZoom(): void {
    this.autoFit.set(true);
    this.recalculateFit();
  }

  /** Scales the page down (never up) to fit the preview pane width, avoiding horizontal scroll. */
  private recalculateFit(): void {
    if (!this.autoFit()) return;
    const page = this.pageHost?.nativeElement;
    const scroll = this.scrollHost?.nativeElement;
    if (!page || !scroll || !page.offsetWidth) return;
    const available = scroll.clientWidth - 32; // account for p-4 padding
    if (available <= 0) return;
    const fit = Math.min(1, available / page.offsetWidth);
    this.zoom.set(Math.round(fit * 100) / 100);
  }

  private recalculatePages(): void {
    const el = this.pageHost?.nativeElement;
    if (!el || !el.offsetWidth) return;
    const pxPerMm = el.offsetWidth / A4_WIDTH_MM;
    const pageHeightPx = A4_HEIGHT_MM * pxPerMm;
    const contentHeightPx = el.scrollHeight;
    const breaks: number[] = [];
    for (let y = pageHeightPx; y < contentHeightPx - 1; y += pageHeightPx) {
      breaks.push(y);
    }
    this.pageBreaks.set(breaks);
  }
}
