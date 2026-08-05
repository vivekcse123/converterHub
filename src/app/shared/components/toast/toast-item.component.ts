import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Notification, NotificationType } from '../../../core/services/notification.service';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../../data/icon-paths.data';

const BORDER_CLASS: Record<NotificationType, string> = {
  success: 'border-emerald-500',
  error: 'border-red-500',
  warning: 'border-amber-500',
  info: 'border-blue-500',
};

const ICON_BG_CLASS: Record<NotificationType, string> = {
  success: 'bg-emerald-100 dark:bg-emerald-900/40',
  error: 'bg-red-100 dark:bg-red-900/40',
  warning: 'bg-amber-100 dark:bg-amber-900/40',
  info: 'bg-blue-100 dark:bg-blue-900/40',
};

const ICON_COLOR_CLASS: Record<NotificationType, string> = {
  success: 'text-emerald-600 dark:text-emerald-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-amber-600 dark:text-amber-400',
  info: 'text-blue-600 dark:text-blue-400',
};

const ICON_NAME: Record<NotificationType, IconName> = {
  success: 'check',
  error: 'close',
  warning: 'warning',
  info: 'info',
};

@Component({
  selector: 'app-toast-item',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [attr.data-id]="notification().id"
      role="alert"
      class="pointer-events-auto card flex items-start gap-3 p-4 shadow-lg animate-slide-down border-l-4"
      [class]="BORDER_CLASS[notification().type]"
    >
      <div [class]="ICON_BG_CLASS[notification().type]" class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0">
        <app-icon [name]="ICON_NAME[notification().type]" [size]="16" [class]="ICON_COLOR_CLASS[notification().type]" [strokeWidth]="2.5" />
      </div>

      <div class="flex-1 min-w-0">
        <p class="font-semibold text-sm text-slate-800 dark:text-slate-100">{{ notification().title }}</p>
        @if (notification().message) {
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ notification().message }}</p>
        }
      </div>

      <button
        (click)="dismiss.emit()"
        [attr.aria-label]="'Dismiss: ' + notification().title"
        class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex-shrink-0 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none rounded"
      >
        <app-icon name="close" [size]="16" />
      </button>
    </div>
  `,
})
export class ToastItemComponent {
  notification = input.required<Notification>();
  dismiss = output<void>();

  readonly BORDER_CLASS = BORDER_CLASS;
  readonly ICON_BG_CLASS = ICON_BG_CLASS;
  readonly ICON_COLOR_CLASS = ICON_COLOR_CLASS;
  readonly ICON_NAME = ICON_NAME;
}
