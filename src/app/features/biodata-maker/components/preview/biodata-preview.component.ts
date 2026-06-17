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
import { BiodataData } from '../../models/biodata.model';
import { getTemplateMeta } from '../../data/biodata-templates.data';

const A4_WIDTH_PX = 794; // 210mm at 96dpi

@Component({
  selector: 'app-biodata-preview',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-2">
      @if (showControls()) {
        <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span class="font-medium text-slate-700 dark:text-slate-200">Live Preview</span>
          <div class="flex items-center gap-1">
            <button type="button" (click)="zoomOut()" class="w-6 h-6 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center leading-none" title="Zoom out">−</button>
            <button type="button" (click)="resetZoom()" class="px-2 h-6 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-mono" title="Reset to fit">{{ (zoom() * 100).toFixed(0) }}%</button>
            <button type="button" (click)="zoomIn()" class="w-6 h-6 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center leading-none" title="Zoom in">+</button>
          </div>
        </div>
      }

      <div #scrollHost class="overflow-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 p-3" style="max-height: 74vh;">
        <div class="flex justify-center">
          <div
            #pageHost
            class="origin-top-left shadow-xl"
            [style.transform]="'scale(' + zoom() + ')'"
            [style.transform-origin]="'top center'"
            [style.margin-bottom.px]="scaledMarginBottom()"
            [style.width.px]="A4_WIDTH_PX"
          >
            <ng-container *ngComponentOutlet="templateComponent(); inputs: templateInputs()" />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BiodataPreviewComponent implements AfterViewInit, OnDestroy {
  readonly biodata = input.required<BiodataData>();
  readonly showControls = input(true);

  readonly A4_WIDTH_PX = A4_WIDTH_PX;

  @ViewChild('pageHost') pageHost?: ElementRef<HTMLElement>;
  @ViewChild('scrollHost') scrollHost?: ElementRef<HTMLElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private resizeObserver?: ResizeObserver;

  readonly zoom = signal(1);
  private readonly autoFit = signal(true);

  readonly templateComponent = computed(() => getTemplateMeta(this.biodata().templateId).component);
  readonly templateInputs = computed(() => ({ biodata: this.biodata() }));

  readonly scaledMarginBottom = computed(() => {
    const naturalHeight = 1123; // 297mm at 96dpi
    return Math.max(0, naturalHeight * this.zoom() - naturalHeight);
  });

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.resizeObserver = new ResizeObserver(() => this.recalculateFit());
    if (this.scrollHost) this.resizeObserver.observe(this.scrollHost.nativeElement);
    setTimeout(() => this.recalculateFit(), 60);
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

  resetZoom(): void {
    this.autoFit.set(true);
    this.recalculateFit();
  }

  private recalculateFit(): void {
    if (!this.autoFit()) return;
    const scroll = this.scrollHost?.nativeElement;
    if (!scroll) return;
    const available = scroll.clientWidth - 24;
    if (available <= 0) return;
    const fit = Math.min(1, available / A4_WIDTH_PX);
    this.zoom.set(Math.round(fit * 100) / 100);
  }
}
