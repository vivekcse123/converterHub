import { Component, ChangeDetectionStrategy, computed, input, signal } from '@angular/core';

export interface DonutDatum { label: string; value: number; color: string; }

/** Categorical share chart — fixed hue order per datum (caller assigns
 *  color, never generated/cycled here), legend always shown, 2px surface
 *  gap between segments via a stroke gap trick, center total as the
 *  "headline number" per the single-stat-tile mark spec. */
@Component({
  selector: 'app-donut-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="flex items-center gap-6 flex-wrap">
      <div class="relative w-40 h-40 shrink-0">
        <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90" role="img" [attr.aria-label]="ariaLabel()">
          <circle cx="50" cy="50" r="40" fill="none" class="stroke-current text-elevated" stroke-width="14" />
          @for (seg of segments(); track seg.label) {
            <circle cx="50" cy="50" r="40" fill="none" [style.stroke]="seg.color" stroke-width="14"
                    [attr.stroke-dasharray]="seg.dash" [attr.stroke-dashoffset]="seg.offset"
                    stroke-linecap="butt"
                    class="transition-opacity duration-150 cursor-pointer"
                    [attr.opacity]="hoverLabel() === null || hoverLabel() === seg.label ? 1 : 0.35"
                    (mouseenter)="hoverLabel.set(seg.label)" (mouseleave)="hoverLabel.set(null)" />
          }
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p class="text-xl font-bold text-content-primary tabular-nums">{{ total() }}</p>
          <p class="text-[10px] text-content-muted uppercase tracking-wide">Total</p>
        </div>
      </div>

      <div class="space-y-1.5 flex-1 min-w-[140px]">
        @for (d of data(); track d.label) {
          <div class="flex items-center gap-2 text-sm cursor-pointer" (mouseenter)="hoverLabel.set(d.label)" (mouseleave)="hoverLabel.set(null)">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" [style.background]="d.color"></span>
            <span class="text-content-secondary flex-1">{{ d.label }}</span>
            <span class="font-semibold text-content-primary tabular-nums">{{ d.value }}</span>
          </div>
        }
      </div>
    </div>
  `,
})
export class DonutChartComponent {
  data = input.required<DonutDatum[]>();

  readonly hoverLabel = signal<string | null>(null);
  readonly total = computed(() => this.data().reduce((sum, d) => sum + d.value, 0));

  readonly segments = computed(() => {
    const circumference = 2 * Math.PI * 40;
    const gap = 1.5; // visual gap between segments, in dasharray units
    let cursor = 0;
    return this.data().map(d => {
      const share = this.total() > 0 ? d.value / this.total() : 0;
      const len = Math.max(0, share * circumference - gap);
      const seg = { label: d.label, color: d.color, dash: `${len} ${circumference - len}`, offset: -cursor };
      cursor += share * circumference;
      return seg;
    });
  });

  ariaLabel(): string {
    return `Donut chart: ${this.data().map(d => `${d.label} ${d.value}`).join(', ')}, total ${this.total()}`;
  }
}
