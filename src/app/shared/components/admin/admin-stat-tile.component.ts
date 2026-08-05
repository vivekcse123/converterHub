import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../../data/icon-paths.data';

@Component({
  selector: 'app-admin-stat-tile',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card-elevated p-5">
      <div class="flex items-center justify-between mb-3">
        <p class="text-xs font-semibold uppercase tracking-wide text-content-muted">{{ label() }}</p>
        @if (icon()) {
          <span class="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
            <app-icon [name]="icon()!" [size]="16" />
          </span>
        }
      </div>
      @if (loading()) {
        <div class="h-8 w-20 rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
      } @else {
        <p class="text-2xl font-bold text-content-primary tabular-nums">{{ value() }}</p>
        @if (delta() !== null) {
          <p class="text-xs mt-1.5 font-medium" [class]="delta()! >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'">
            {{ delta()! >= 0 ? '+' : '' }}{{ delta() }}% {{ deltaLabel() }}
          </p>
        }
      }
    </div>
  `,
})
export class AdminStatTileComponent {
  label = input.required<string>();
  value = input<string | number>('—');
  icon = input<IconName | null>(null);
  loading = input(false);
  delta = input<number | null>(null);
  deltaLabel = input('vs last period');
}
