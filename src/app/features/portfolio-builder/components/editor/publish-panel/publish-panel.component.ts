import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { PortfolioShareCardComponent } from '../../share-card/portfolio-share-card.component';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-publish-panel',
  standalone: true,
  imports: [CommonModule, PortfolioShareCardComponent],
  template: `
    @if (store.portfolio(); as p) {
      @if (showShare()) {
        <app-portfolio-share-card [username]="p.username" [displayName]="p.displayName ?? ''" (close)="showShare.set(false)" />
      }

      <div class="space-y-4">
        <div class="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2 h-2 rounded-full shrink-0" [class]="p.status === 'published' && p.isPublic ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'"></span>
            <p class="text-[13px] font-bold text-slate-800 dark:text-slate-100">
              {{ p.status === 'published' && p.isPublic ? 'Live' : p.status === 'published' ? 'Published (unlisted)' : 'Draft — not published yet' }}
            </p>
          </div>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 pl-4">
            {{ p.status === 'published' && p.isPublic ? 'Anyone with the link can view this portfolio.' : 'Publish to make this portfolio visible at your public URL.' }}
          </p>
        </div>

        @if (p.username) {
          <div class="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span class="text-xs text-slate-500 dark:text-slate-400 truncate flex-1">apnaconverter.com/p/{{ p.username }}</span>
            <button type="button" class="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline shrink-0" (click)="copyLink(p.username)">Copy</button>
          </div>
        } @else {
          <p class="text-xs text-amber-600 dark:text-amber-400 px-0.5">Set a username in the Content tab before publishing.</p>
        }

        <div class="flex items-center gap-2">
          <button type="button"
                  class="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm transition-colors shadow-card disabled:opacity-50"
                  [disabled]="!p.username || publishing()"
                  (click)="publish()">
            {{ publishing() ? 'Publishing…' : 'Publish changes' }}
          </button>
          @if (p.status === 'published' && p.isPublic) {
            <a [href]="'/p/' + p.username" target="_blank" rel="noopener noreferrer"
               class="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0">
              View
            </a>
          }
        </div>

        @if (p.status === 'published' && p.isPublic) {
          <button type="button"
                  class="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  (click)="showShare.set(true)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="w-4 h-4"><circle cx="18" cy="5" r="2.7"/><circle cx="6" cy="12" r="2.7"/><circle cx="18" cy="19" r="2.7"/><path d="M8.3 10.6l7.4-4.2M8.3 13.4l7.4 4.2"/></svg>
            Share &amp; QR code
          </button>
        }

        @if (p.isPublic) {
          <button type="button" class="text-xs text-slate-400 hover:text-red-500 transition-colors" (click)="unpublish()">Take portfolio offline</button>
        }
      </div>
    }
  `,
})
export class PublishPanelComponent {
  readonly store = inject(PortfolioStoreService);
  private notify = inject(NotificationService);
  readonly publishing = signal(false);
  readonly showShare = signal(false);

  async publish(): Promise<void> {
    this.publishing.set(true);
    const ok = await this.store.publish();
    this.publishing.set(false);
    if (ok) this.notify.success('Portfolio published', 'Your changes are now live.');
    else this.notify.error('Publish failed', 'Could not publish your portfolio. Please try again.');
  }

  async unpublish(): Promise<void> {
    const ok = await this.store.unpublish();
    if (ok) this.notify.success('Portfolio taken offline', 'Your public page is no longer visible.');
  }

  copyLink(username: string): void {
    navigator.clipboard?.writeText(`https://www.apnaconverter.com/p/${username}`);
    this.notify.success('Link copied');
  }
}
