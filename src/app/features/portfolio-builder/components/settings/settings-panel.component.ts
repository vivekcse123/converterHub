import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PortfolioStoreService } from '../../services/portfolio-store.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PortfolioSocial } from '../../models/portfolio.model';

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    @if (store.portfolio(); as p) {
      <div class="p-4 space-y-6">

        <section>
          <h4 class="prop-label">Public URL</h4>
          <div class="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-primary-500">
            <span class="pl-3 pr-1 text-xs text-slate-400 shrink-0">apnaconverter.com/p/</span>
            <input type="text" [ngModel]="p.username" (ngModelChange)="onUsername($event)"
                   class="flex-1 min-w-0 py-2.5 pr-3 text-sm bg-transparent outline-none" placeholder="yourname">
          </div>
          @switch (store.usernameStatus()) {
            @case ('checking') { <p class="text-[11px] text-slate-400 mt-1">Checking…</p> }
            @case ('available') { <p class="text-[11px] text-emerald-500 mt-1">Available</p> }
            @case ('taken') { <p class="text-[11px] text-red-500 mt-1">Already taken</p> }
            @case ('invalid') { <p class="text-[11px] text-red-500 mt-1">3-50 chars: letters, numbers, - and _</p> }
          }
        </section>

        <section>
          <h4 class="prop-label">Contact details</h4>
          <div class="space-y-2">
            <input type="email" [ngModel]="p.email" (ngModelChange)="update({ email: $event })" placeholder="you@example.com"
                   class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-primary-500">
            <input type="tel" [ngModel]="p.phone" (ngModelChange)="update({ phone: $event })" placeholder="+91 98765 43210"
                   class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-primary-500">
          </div>
        </section>

        <section>
          <h4 class="prop-label">Social links</h4>
          <div class="space-y-2">
            @for (s of socialFields; track s.key) {
              <input type="url" [ngModel]="p.social?.[s.key]" (ngModelChange)="updateSocial(s.key, $event)" [placeholder]="s.placeholder"
                     class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-primary-500">
            }
          </div>
        </section>

        <section>
          <h4 class="prop-label">SEO</h4>
          <div class="space-y-2">
            <input type="text" [ngModel]="p.metaTitle" (ngModelChange)="update({ metaTitle: $event })" placeholder="Page title"
                   class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-primary-500">
            <textarea [ngModel]="p.metaDescription" (ngModelChange)="update({ metaDescription: $event })" placeholder="Short description for search engines" rows="2"
                      class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none"></textarea>
          </div>
        </section>

        <section>
          <h4 class="prop-label">Visibility</h4>
          <label class="flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
            <span class="text-xs font-medium text-slate-600 dark:text-slate-300">Public</span>
            <input type="checkbox" [ngModel]="p.isPublic" (ngModelChange)="update({ isPublic: $event })" class="rounded accent-primary-600">
          </label>
        </section>
      </div>
    }
  `,
  styles: [`.prop-label { @apply text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2; }`],
})
export class SettingsPanelComponent {
  readonly store = inject(PortfolioStoreService);
  private notify = inject(NotificationService);

  readonly socialFields: { key: keyof PortfolioSocial; placeholder: string }[] = [
    { key: 'github', placeholder: 'GitHub URL' },
    { key: 'linkedin', placeholder: 'LinkedIn URL' },
    { key: 'twitter', placeholder: 'Twitter / X URL' },
    { key: 'youtube', placeholder: 'YouTube URL' },
    { key: 'website', placeholder: 'Website URL' },
  ];

  update(patch: Partial<Parameters<PortfolioStoreService['updateIdentity']>[0]>): void {
    this.store.updateIdentity(patch);
  }

  updateSocial(key: keyof PortfolioSocial, value: string): void {
    const social = { ...(this.store.portfolio()?.social ?? {}), [key]: value };
    this.update({ social });
  }

  onUsername(value: string): void {
    const username = value.trim().toLowerCase();
    this.update({ username });
    this.store.checkUsername(username);
  }
}
