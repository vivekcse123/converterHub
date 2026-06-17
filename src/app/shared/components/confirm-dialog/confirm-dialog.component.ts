import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from './confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (svc.visible()) {
      <div class="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
           (click)="svc.cancel()">
        <div class="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 animate-fade-in"
             (click)="$event.stopPropagation()">
          <!-- Icon -->
          @if (svc.options().icon) {
            <div class="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
                 [class]="svc.options().danger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-violet-100 dark:bg-violet-900/30'">
              {{ svc.options().icon }}
            </div>
          }
          <!-- Text -->
          <h3 class="text-base font-bold text-slate-800 dark:text-white text-center mb-2">
            {{ svc.options().title }}
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 text-center mb-6 leading-relaxed">
            {{ svc.options().message }}
          </p>
          <!-- Actions -->
          <div class="flex gap-3">
            <button class="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    (click)="svc.cancel()">
              {{ svc.options().cancelLabel ?? 'Cancel' }}
            </button>
            <button class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition"
                    [class]="svc.options().danger
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90'"
                    (click)="svc.confirm()">
              {{ svc.options().confirmLabel ?? 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  readonly svc = inject(ConfirmDialogService);
}
