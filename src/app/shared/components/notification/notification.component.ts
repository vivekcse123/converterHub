import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NotificationService, Notification } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-80 pointer-events-none" aria-live="polite" aria-atomic="false">
      @for (n of ns.notifications(); track n.id) {
      <div [attr.data-id]="n.id" role="alert"
        class="pointer-events-auto card flex items-start gap-3 p-4 shadow-lg animate-slide-down border-l-4"
        [class]="borderClass(n.type)">

        <!-- Icon -->
        <div [class]="iconBgClass(n.type)" class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4" [class]="iconColorClass(n.type)" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            @if (n.type === 'success') {
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            } @else if (n.type === 'error') {
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
            } @else if (n.type === 'warning') {
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            } @else {
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            }
          </svg>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-sm text-slate-800 dark:text-slate-100">{{ n.title }}</p>
          @if (n.message) {
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ n.message }}</p>
          }
        </div>

        <!-- Close -->
        <button (click)="ns.dismiss(n.id)" [attr.aria-label]="'Dismiss: ' + n.title"
          class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex-shrink-0 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none rounded">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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

  borderClass(type: string): string {
    const map: Record<string, string> = {
      success: 'border-emerald-500',
      error:   'border-red-500',
      warning: 'border-amber-500',
      info:    'border-blue-500',
    };
    return map[type] ?? 'border-slate-400';
  }

  iconBgClass(type: string): string {
    const map: Record<string, string> = {
      success: 'bg-emerald-100 dark:bg-emerald-900/40',
      error:   'bg-red-100 dark:bg-red-900/40',
      warning: 'bg-amber-100 dark:bg-amber-900/40',
      info:    'bg-blue-100 dark:bg-blue-900/40',
    };
    return map[type] ?? 'bg-slate-100 dark:bg-slate-800';
  }

  iconColorClass(type: string): string {
    const map: Record<string, string> = {
      success: 'text-emerald-600 dark:text-emerald-400',
      error:   'text-red-600 dark:text-red-400',
      warning: 'text-amber-600 dark:text-amber-400',
      info:    'text-blue-600 dark:text-blue-400',
    };
    return map[type] ?? 'text-slate-500';
  }
}
