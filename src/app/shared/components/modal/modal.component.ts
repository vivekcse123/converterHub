import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, effect, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export type ModalSize = 'sm' | 'md' | 'lg';

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

/**
 * Generalized modal primitive — same backdrop/focus-trap/Escape behavior
 * that `ConfirmDialogComponent` already implemented correctly, lifted out
 * so any dialog can reuse it instead of hand-rolling `fixed inset-0` again.
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        (click)="onBackdropClick()"
      >
        <div
          #dialogEl
          [class]="'relative w-full ' + SIZE_CLASS[size()] + ' bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 animate-fade-in'"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="titleText() || null"
          tabindex="-1"
          (click)="$event.stopPropagation()"
          (keydown)="onKeydown($event)"
        >
          @if (titleText()) {
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-bold text-slate-800 dark:text-white">{{ titleText() }}</h3>
              <button
                type="button"
                aria-label="Close"
                class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none rounded"
                (click)="closed.emit()"
              >
                <app-icon name="close" [size]="18" />
              </button>
            </div>
          }
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  open = input(false);
  titleText = input('');
  size = input<ModalSize>('sm');
  closeOnBackdrop = input(true);
  closed = output<void>();

  readonly SIZE_CLASS = SIZE_CLASS;

  @ViewChild('dialogEl') private dialogEl?: ElementRef<HTMLElement>;
  private previouslyFocused: HTMLElement | null = null;

  constructor() {
    // Move focus into the dialog when it opens (screen-reader/keyboard users)
    // and restore it to whatever triggered it when it closes, instead of
    // leaving focus stranded or reset to <body>.
    effect(() => {
      if (this.open()) {
        this.previouslyFocused = document.activeElement as HTMLElement | null;
        queueMicrotask(() => this.dialogEl?.nativeElement.focus());
      } else if (this.previouslyFocused) {
        this.previouslyFocused.focus();
        this.previouslyFocused = null;
      }
    });
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) this.closed.emit();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.closed.emit();
      return;
    }
    if (event.key !== 'Tab') return;

    // Focus trap: keep Tab/Shift+Tab cycling within the dialog's focusable
    // elements instead of escaping to the page underneath while it's open.
    const focusable = this.dialogEl?.nativeElement.querySelectorAll<HTMLElement>(
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
