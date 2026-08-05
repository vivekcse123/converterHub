import { Component, ChangeDetectionStrategy, computed, input, signal } from '@angular/core';

export interface LineSeries { label: string; color: string; points: { x: string; y: number }[]; }

/** Multi-series time trend — 2px lines, legend always shown for ≥2 series
 *  (identity via color + legend swatch, never color-alone), crosshair +
 *  tooltip on hover showing every series' value at the nearest x. */
@Component({
  selector: 'app-line-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div>
      @if (series().length > 1) {
        <div class="flex items-center gap-4 mb-3">
          @for (s of series(); track s.label) {
            <span class="flex items-center gap-1.5 text-xs text-content-secondary">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" [style.background]="s.color"></span>
              {{ s.label }}
            </span>
          }
        </div>
      }
      <div class="relative" (mousemove)="onMove($event)" (mouseleave)="hoverIndex.set(null)">
        <svg [attr.viewBox]="'0 0 ' + width + ' ' + height" class="w-full h-auto overflow-visible" role="img" [attr.aria-label]="ariaLabel()">
          @for (s of paths(); track s.label) {
            <path [attr.d]="s.d" fill="none" [style.stroke]="s.color" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
          }
          @if (hoverIndex() !== null) {
            <line [attr.x1]="crosshairX()" [attr.x2]="crosshairX()" y1="0" [attr.y2]="height" class="stroke-current text-border" stroke-width="1" stroke-dasharray="3,3" />
            @for (s of paths(); track s.label) {
              <circle [attr.cx]="crosshairX()" [attr.cy]="pointYAt(s, hoverIndex())" r="3.5" [style.fill]="s.color" stroke="white" stroke-width="1.5" />
            }
          }
        </svg>
        @if (hoverIndex() !== null) {
          <div class="absolute top-0 px-2.5 py-1.5 rounded-md bg-slate-900 dark:bg-slate-700 text-white text-xs shadow-lg pointer-events-none z-10 -translate-x-1/2"
               [style.left.%]="tooltipXPct()">
            <p class="font-semibold mb-0.5">{{ hoverX() }}</p>
            @for (s of series(); track s.label) {
              <p class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full shrink-0" [style.background]="s.color"></span>
                {{ s.label }}: {{ valueAt(s, hoverIndex()) }}
              </p>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class LineChartComponent {
  series = input.required<LineSeries[]>();
  height = 180;
  width = 600;

  readonly hoverIndex = signal<number | null>(null);

  private readonly pointCount = computed(() => this.series()[0]?.points.length ?? 0);
  private readonly maxValue = computed(() =>
    Math.max(1, ...this.series().flatMap(s => s.points.map(p => p.y)))
  );

  private xFor(i: number): number {
    const n = Math.max(1, this.pointCount() - 1);
    return (i / n) * this.width;
  }
  private yFor(v: number): number {
    return this.height - (v / this.maxValue()) * (this.height - 8) - 4;
  }

  readonly paths = computed(() =>
    this.series().map(s => {
      const pointsY = s.points.map(p => this.yFor(p.y));
      const d = s.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${this.xFor(i)} ${pointsY[i]}`).join(' ');
      return { label: s.label, color: s.color, d, pointsY };
    })
  );

  readonly crosshairX = computed(() => {
    const i = this.hoverIndex();
    return i === null ? 0 : this.xFor(i);
  });
  readonly tooltipXPct = computed(() => (this.crosshairX() / this.width) * 100);

  onMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const n = this.pointCount();
    if (n === 0) return;
    const idx = Math.round(ratio * (n - 1));
    this.hoverIndex.set(Math.min(n - 1, Math.max(0, idx)));
  }

  ariaLabel(): string {
    return `Line chart with ${this.series().length} series over ${this.pointCount()} points`;
  }

  hoverX(): string {
    const i = this.hoverIndex();
    if (i === null) return '';
    return this.series()[0]?.points[i]?.x ?? '';
  }

  valueAt(s: LineSeries, i: number | null): number | string {
    if (i === null) return '—';
    return s.points[i]?.y ?? '—';
  }

  pointYAt(s: { pointsY: number[] }, i: number | null): number {
    if (i === null) return 0;
    return s.pointsY[i] ?? 0;
  }
}
