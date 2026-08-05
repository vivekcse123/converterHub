import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ConfirmDialogService } from './confirm-dialog.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal [open]="svc.visible()" [closeOnBackdrop]="true" (closed)="svc.cancel()">
      <div role="alertdialog" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-message">
        <!-- Icon -->
        @if (svc.options().icon) {
          <div class="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl" aria-hidden="true"
               [class]="svc.options().danger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-primary-100 dark:bg-primary-900/30'">
            {{ svc.options().icon }}
          </div>
        }
        <!-- Text -->
        <h3 id="confirm-dialog-title" class="text-base font-bold text-slate-800 dark:text-white text-center mb-2">
          {{ svc.options().title }}
        </h3>
        <p id="confirm-dialog-message" class="text-sm text-slate-500 dark:text-slate-400 text-center mb-6 leading-relaxed">
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
                    : 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:opacity-90'"
                  (click)="svc.confirm()">
            {{ svc.options().confirmLabel ?? 'Confirm' }}
          </button>
        </div>
      </div>
    </app-modal>
  `,
})
export class ConfirmDialogComponent {
  readonly svc = inject(ConfirmDialogService);
}
