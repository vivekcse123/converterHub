import { Component, ChangeDetectionStrategy, computed, input, signal } from '@angular/core';

export interface BarDatum { label: string; value: number; }

/** Single-series magnitude chart — one sequential hue, thin rounded-top bars,
 *  hover tooltip. No axis lines (recessive grid per dataviz guidance), value
 *  shown on hover rather than on every bar to avoid label clutter. */
@Component({
  selector: 'app-bar-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="relative">
      <svg [attr.viewBox]="'0 0 ' + width + ' ' + height" class="w-full h-auto overflow-visible" role="img" [attr.aria-label]="ariaLabel()">
        @for (bar of bars(); track bar.label; let i = $index) {
          <rect
            [attr.x]="bar.x" [attr.y]="bar.y" [attr.width]="barWidth()" [attr.height]="bar.h"
            [attr.rx]="3" [style.fill]="color()"
            [attr.opacity]="hoverIndex() === null || hoverIndex() === i ? 1 : 0.35"
            class="transition-opacity duration-150 cursor-pointer"
            (mouseenter)="hoverIndex.set(i)" (mouseleave)="hoverIndex.set(null)"
          />
          <text [attr.x]="bar.x + barWidth() / 2" [attr.y]="height - 6" text-anchor="middle"
                class="fill-current text-content-muted" style="font-size: 9px">{{ truncate(bar.label) }}</text>
        }
      </svg>
      @if (hoverIndex() !== null) {
        <div class="absolute top-0 px-2 py-1 rounded-md bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium pointer-events-none shadow-lg z-10 -translate-x-1/2"
             [style.left.%]="tooltipX()">
          {{ bars()[hoverIndex()!].label }}: {{ bars()[hoverIndex()!].value }}
        </div>
      }
    </div>
  `,
})
export class BarChartComponent {
  data = input.required<BarDatum[]>();
  color = input('rgb(var(--color-primary-600))');
  height = 160;
  width = 400;

  readonly hoverIndex = signal<number | null>(null);

  private readonly maxValue = computed(() => Math.max(1, ...this.data().map(d => d.value)));
  readonly barWidth = computed(() => {
    const n = this.data().length || 1;
    return Math.max(4, (this.width / n) * 0.6);
  });

  readonly bars = computed(() => {
    const n = this.data().length || 1;
    const slot = this.width / n;
    const chartH = this.height - 20; // reserve space for labels
    return this.data().map((d, i) => {
      const h = (d.value / this.maxValue()) * chartH;
      return { label: d.label, value: d.value, x: i * slot + (slot - this.barWidth()) / 2, y: chartH - h, h: Math.max(1, h) };
    });
  });

  readonly tooltipX = computed(() => {
    const i = this.hoverIndex();
    if (i === null) return 0;
    const b = this.bars()[i];
    return ((b.x + this.barWidth() / 2) / this.width) * 100;
  });

  ariaLabel(): string {
    return `Bar chart: ${this.data().map(d => `${d.label} ${d.value}`).join(', ')}`;
  }

  truncate(label: string): string {
    return label.length > 8 ? label.slice(0, 7) + '…' : label;
  }
}
