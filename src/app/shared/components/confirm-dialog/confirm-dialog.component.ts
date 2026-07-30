import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, effect, inject } from '@angular/core';
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
        <div #dialogEl
             class="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 animate-fade-in"
             role="dialog"
             aria-modal="true"
             aria-labelledby="confirm-dialog-title"
             aria-describedby="confirm-dialog-message"
             tabindex="-1"
             (click)="$event.stopPropagation()"
             (keydown)="onKeydown($event)">
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
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  readonly svc = inject(ConfirmDialogService);

  @ViewChild('dialogEl') private dialogEl?: ElementRef<HTMLElement>;
  private previouslyFocused: HTMLElement | null = null;

  constructor() {
    // Move focus into the dialog when it opens (for screen-reader/keyboard
    // users) and restore focus to whatever triggered it when it closes,
    // instead of leaving focus stranded or reset to <body>.
    effect(() => {
      if (this.svc.visible()) {
        this.previouslyFocused = document.activeElement as HTMLElement | null;
        queueMicrotask(() => this.dialogEl?.nativeElement.focus());
      } else if (this.previouslyFocused) {
        this.previouslyFocused.focus();
        this.previouslyFocused = null;
      }
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.svc.cancel();
      return;
    }
    if (event.key !== 'Tab') return;

    // Focus trap: the dialog's two buttons are its only focusable elements —
    // keep Tab/Shift+Tab cycling between them instead of escaping to the page
    // underneath while the modal is open.
    const focusable = this.dialogEl?.nativeElement.querySelectorAll<HTMLElement>('button');
    if (!focusable?.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
