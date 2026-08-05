import { Component, ChangeDetectionStrategy, inject, input, output, signal } from '@angular/core';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-share-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="w-full max-w-sm rounded-[24px] bg-white dark:bg-slate-900 shadow-popover p-6 animate-slide-up" (click)="$event.stopPropagation()">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><circle cx="18" cy="5" r="2.7"/><circle cx="6" cy="12" r="2.7"/><circle cx="18" cy="19" r="2.7"/><path d="M8.3 10.6l7.4-4.2M8.3 13.4l7.4 4.2"/></svg>
        </div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Share your portfolio</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Anyone with this link can view your live portfolio.</p>

        <div class="flex items-center gap-2 mt-5 p-1 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <span class="flex-1 min-w-0 text-xs text-slate-600 dark:text-slate-300 truncate">{{ url() }}</span>
          <button type="button" (click)="copy()" class="px-3 py-2 rounded-lg text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 transition-colors shrink-0">
            {{ copied() ? 'Copied!' : 'Copy' }}
          </button>
        </div>

        <a [href]="url()" target="_blank" rel="noopener"
           class="mt-3 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          Open live page ↗
        </a>

        <button type="button" (click)="close.emit()" class="mt-3 w-full text-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">Close</button>
      </div>
    </div>
  `,
})
export class ShareModalComponent {
  username = input.required<string>();
  close = output<void>();

  private notify = inject(NotificationService);
  readonly copied = signal(false);

  url(): string {
    return `${location.origin}/p/${this.username()}`;
  }

  async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.url());
    this.copied.set(true);
    this.notify.success('Link copied');
    setTimeout(() => this.copied.set(false), 2000);
  }
}
