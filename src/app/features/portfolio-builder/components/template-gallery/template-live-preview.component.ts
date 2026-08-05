import {
  Component, ChangeDetectionStrategy, ElementRef, OnDestroy, AfterViewInit, AfterViewChecked,
  ViewChild, computed, input, signal,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { getPortfolioThemeMeta } from '../../data/portfolio-themes.data';
import { demoPortfolioForTheme } from '../../data/portfolio-demo-content.data';

/** Design width the real theme components are rendered at before being
 *  scaled down — this is a genuine render of the live component (same one
 *  used on the public site), not a screenshot or a fake thumbnail. */
const DESIGN_WIDTH = 1440;
/** How long a full auto-scroll pass through the page takes on hover. */
const AUTO_SCROLL_MS = 9000;

@Component({
  selector: 'app-template-live-preview',
  standalone: true,
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block relative w-full h-full overflow-hidden bg-slate-100 dark:bg-slate-800' },
  template: `
    @if (visible()) {
      <div class="absolute top-0 left-0 origin-top-left will-change-transform"
           [class.transition-transform]="autoScroll()"
           [style.transition-duration]="autoScroll() ? AUTO_SCROLL_MS + 'ms' : null"
           [style.transition-timing-function]="'ease-in-out'"
           [style.width.px]="DESIGN_WIDTH"
           [style.transform]="transform()"
           #content>
        <ng-container [ngComponentOutlet]="themeComponent()" [ngComponentOutletInputs]="inputs()" />
      </div>
    } @else {
      <div class="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900"></div>
    }
  `,
})
export class TemplateLivePreviewComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
  themeId = input.required<string>();
  /** Drives the hover auto-scroll-through-the-page animation. */
  autoScroll = input<boolean>(false);

  @ViewChild('content') contentRef?: ElementRef<HTMLDivElement>;

  readonly DESIGN_WIDTH = DESIGN_WIDTH;
  readonly AUTO_SCROLL_MS = AUTO_SCROLL_MS;

  private readonly hostWidth = signal(0);
  private readonly contentHeight = signal(0);
  private readonly hostHeight = signal(0);
  readonly visible = signal(false);

  private resizeObserver?: ResizeObserver;
  private contentResizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;

  readonly themeComponent = computed(() => getPortfolioThemeMeta(this.themeId()).component);
  readonly inputs = computed(() => {
    const meta = getPortfolioThemeMeta(this.themeId());
    return { portfolio: demoPortfolioForTheme(meta.id, meta.defaultMode, meta.defaultAccent), editable: false };
  });

  private readonly scale = computed(() => {
    const w = this.hostWidth();
    return w > 0 ? w / DESIGN_WIDTH : 0.2;
  });

  readonly transform = computed(() => {
    const scale = this.scale();
    if (!this.autoScroll()) return `scale(${scale})`;
    const scaledContentHeight = this.contentHeight() * scale;
    const maxScrollPx = Math.max(0, scaledContentHeight - this.hostHeight());
    // Translate in pre-scale units so the single `scale()` transform still applies to the shift.
    const translateY = scale > 0 ? -(maxScrollPx / scale) : 0;
    return `scale(${scale}) translateY(${translateY}px)`;
  });

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;
      this.hostWidth.set(entry.contentRect.width);
      this.hostHeight.set(entry.contentRect.height);
    });
    this.resizeObserver.observe(this.host.nativeElement);

    // Lazy-mount: only render the (relatively heavy) real theme component once
    // the card actually scrolls into view, and keep it mounted afterwards to
    // avoid re-render flicker on every scroll pass.
    this.intersectionObserver = new IntersectionObserver(
      entries => { if (entries[0]?.isIntersecting) { this.visible.set(true); this.intersectionObserver?.disconnect(); } },
      { rootMargin: '200px' }
    );
    this.intersectionObserver.observe(this.host.nativeElement);
  }

  ngAfterViewChecked(): void {
    // The content element only exists once `visible()` flips true; attach the
    // height observer the first render after that happens.
    if (this.contentResizeObserver || !this.contentRef) return;
    this.contentResizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) this.contentHeight.set(entry.contentRect.height);
    });
    this.contentResizeObserver.observe(this.contentRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.contentResizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
  }
}
