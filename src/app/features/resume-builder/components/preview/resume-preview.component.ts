import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule, NgComponentOutlet, isPlatformBrowser } from '@angular/common';
import { DEFAULT_DESIGN, DesignSettings, ResumeData } from '../../models/resume.model';
import { getTemplateMeta } from '../../data/resume-templates.data';

const FONT_FAMILIES: Record<DesignSettings['fontFamily'], string> = {
  inter:   "'Inter', Arial, Helvetica, sans-serif",
  roboto:  "'Roboto', Arial, Helvetica, sans-serif",
  georgia: "Georgia, 'Times New Roman', serif",
};

const LEGACY_SIZE_SCALES: Record<DesignSettings['fontSize'], number> = {
  small:  9.5,
  medium: 10.5,
  large:  11.5,
};

const BASE_PT = 10.5;

const SPACING_MAP: Record<DesignSettings['lineHeight'], string> = {
  compact:   '1.3',
  standard:  '1.5',
  spacious:  '1.75',
};

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
  private readonly cdr = inject(ChangeDetectorRef);
  private resizeObserver?: ResizeObserver;

  // Force this view and descendants to re-check whenever the resume signal changes.
  // NgComponentOutlet's setInput() can miss OnPush re-render; this guarantees it.
  private readonly _forceCheck = effect(() => {
    this.resume();
    this.cdr.markForCheck();
  });

  readonly zoom = signal(1);
  /** When true, zoom auto-adjusts to fit the available width (no horizontal scrolling). */
  readonly autoFit = signal(true);
  readonly pageBreaks = signal<number[]>([]);
  readonly pageCount = computed(() => this.pageBreaks().length + 1);

  readonly templateComponent = computed(() => getTemplateMeta(this.resume().templateId).component);
  readonly templateInputs = computed(() => ({ resume: this.resume() }));

  /** CSS custom properties passed to the template wrapper so all child CSS can use var(--r-accent) etc. */
  readonly designVars = computed<string>(() => {
    const d: DesignSettings = { ...DEFAULT_DESIGN, ...this.resume().design };
    const hex = (d.accentColor || '#1e293b').replace(/^#/, '').padEnd(6, '0');
    const r = parseInt(hex.slice(0, 2), 16) || 0;
    const g = parseInt(hex.slice(2, 4), 16) || 0;
    const b = parseInt(hex.slice(4, 6), 16) || 0;
    const basePt = typeof d.baseFontPt === 'number' && d.baseFontPt > 0
      ? d.baseFontPt
      : (LEGACY_SIZE_SCALES[d.fontSize ?? 'medium'] ?? BASE_PT);
    const sizeScale = (basePt / BASE_PT).toFixed(4);
    return [
      `--r-accent:${d.accentColor}`,
      `--r-accent-12:rgba(${r},${g},${b},0.12)`,
      `--r-accent-25:rgba(${r},${g},${b},0.25)`,
      `--r-font:${FONT_FAMILIES[d.fontFamily] ?? FONT_FAMILIES['inter']}`,
      `--r-size:${sizeScale}`,
      `--r-spacing:${SPACING_MAP[d.lineHeight ?? 'standard']}`,
    ].join(';');
  });

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
