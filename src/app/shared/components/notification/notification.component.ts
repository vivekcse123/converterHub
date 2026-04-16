import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NotificationService, Notification } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-80 pointer-events-none">
      @for (n of ns.notifications(); track n.id) {
      <div [attr.data-id]="n.id"
        class="pointer-events-auto card flex items-start gap-3 p-4 shadow-lg animate-slide-down">

        <!-- Icon -->
        <div [class]="iconClass(n.type)" class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm">
          <span>{{ icon(n.type) }}</span>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-sm text-slate-800 dark:text-slate-100">{{ n.title }}</p>
          @if (n.message) {
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ n.message }}</p>
          }
        </div>

        <!-- Close -->
        <button (click)="ns.dismiss(n.id)"
          class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex-shrink-0">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      }
    </div>
  `,
})
export class NotificationComponent {
  constructor(public ns: NotificationService) {}

  icon(type: string): string {
    const map: Record<string, string> = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    return map[type] ?? 'ℹ️';
  }

  iconClass(type: string): string {
    const map: Record<string, string> = {
      success: 'bg-emerald-100 dark:bg-emerald-900/40',
      error:   'bg-red-100 dark:bg-red-900/40',
      warning: 'bg-amber-100 dark:bg-amber-900/40',
      info:    'bg-blue-100 dark:bg-blue-900/40',
    };
    return map[type] ?? 'bg-slate-100 dark:bg-slate-800';
  }
}
