import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../../data/icon-paths.data';

/**
 * Shared "nothing here yet" state — used instead of a blank widget or a fake
 * placeholder whenever a section genuinely has no data (e.g. a fresh
 * account with no conversions yet).
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center text-center py-6 px-4">
      <div
        class="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center mb-3 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
        aria-hidden="true"
      >
        <app-icon [name]="icon()" [size]="18" />
      </div>
      <p class="text-sm font-semibold text-content-primary">{{ title() }}</p>
      @if (description()) {
        <p class="text-xs text-content-secondary mt-1 max-w-xs">{{ description() }}</p>
      }
      <div class="mt-3">
        <ng-content />
      </div>
    </div>
  `,
})
export class EmptyStateComponent {
  icon = input.required<IconName>();
  title = input.required<string>();
  description = input<string>('');
}
