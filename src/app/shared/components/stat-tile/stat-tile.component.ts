import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../../data/icon-paths.data';

export type StatTrendDirection = 'up' | 'down';

@Component({
  selector: 'app-stat-tile',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card-elevated p-5 flex items-start justify-between gap-4">
      <div class="min-w-0">
        <p class="text-xs font-medium text-content-secondary">{{ label() }}</p>
        <p class="text-2xl font-bold text-content-primary mt-1 truncate">{{ value() }}</p>
        @if (trendLabel()) {
          <p
            class="text-xs font-medium mt-1.5 inline-flex items-center gap-1"
            [class]="trendDirection() === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'"
          >
            <app-icon [name]="trendDirection() === 'up' ? 'trending-up' : 'activity'" [size]="13" />
            {{ trendLabel() }}
          </p>
        }
      </div>
      <div
        class="w-10 h-10 shrink-0 rounded-[var(--radius-md)] flex items-center justify-center bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
        aria-hidden="true"
      >
        <app-icon [name]="icon()" [size]="18" />
      </div>
    </div>
  `,
})
export class StatTileComponent {
  label = input.required<string>();
  value = input.required<string>();
  icon = input.required<IconName>();
  trendLabel = input<string>('');
  trendDirection = input<StatTrendDirection>('up');
}
