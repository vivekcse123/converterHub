import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { PortfolioSocial } from '../../../models/portfolio.model';

type Tab = 'basic' | 'social' | 'seo';

@Component({
  selector: 'app-identity-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (store.portfolio(); as p) {
      <div class="space-y-4">

        <div class="flex gap-1 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
          @for (t of tabs; track t.id) {
            <button type="button" class="flex-1 py-1.5 rounded-lg text-[11.5px] font-bold transition-colors"
                    [class]="tab() === t.id ? 'bg-white dark:bg-slate-900 text-primary-700 dark:text-primary-300 shadow-sm' : 'text-slate-500 dark:text-slate-400'"
                    (click)="tab.set(t.id)">{{ t.label }}</button>
          }
        </div>

        @if (tab() === 'basic') {
          <div class="space-y-3.5">
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Username (your public URL) *</label>
              <div class="flex items-center gap-1.5 px-3 rounded-xl border bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-primary-500"
                   [class]="store.usernameStatus() === 'available' ? 'border-emerald-400' : (store.usernameStatus() === 'taken' || store.usernameStatus() === 'invalid') ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'">
                <span class="text-[11px] text-slate-400 shrink-0">apnaconverter.com/p/</span>
                <input type="text" [ngModel]="p.username" (ngModelChange)="onUsername($event)" placeholder="yourname" maxlength="50"
                       class="flex-1 py-2.5 text-sm bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none min-w-0" />
              </div>
              @if (store.usernameStatus() === 'available') { <p class="text-xs text-emerald-600 mt-1">Username available</p> }
              @if (store.usernameStatus() === 'taken') { <p class="text-xs text-red-500 mt-1">Username already taken</p> }
              @if (store.usernameStatus() === 'invalid') { <p class="text-xs text-red-500 mt-1">Only lowercase letters, numbers, hyphens and underscores</p> }
            </div>

            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Location</label>
              <input type="text" [ngModel]="p.location" (ngModelChange)="update({ location: $event })" placeholder="Bangalore, India"
                     class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Contact Email</label>
                <input type="email" [ngModel]="p.email" (ngModelChange)="update({ email: $event })" placeholder="hello@example.com"
                       class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Mobile Number</label>
                <input type="tel" [ngModel]="p.phone" (ngModelChange)="update({ phone: $event })" placeholder="+91 98765 43210"
                       class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            <div class="flex items-center justify-between pt-1 px-0.5">
              <div>
                <p class="text-xs font-bold text-slate-700 dark:text-slate-300">Make portfolio public</p>
                <p class="text-[11px] text-slate-400">Anyone with the link can view it once published</p>
              </div>
              <button type="button" class="relative w-10 h-6 rounded-full shrink-0 transition-colors duration-200"
                      [style.background]="p.isPublic ? '#7c3aed' : '#cbd5e1'" (click)="update({ isPublic: !p.isPublic })">
                <span class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                      [style.transform]="p.isPublic ? 'translateX(16px)' : 'translateX(0)'"></span>
              </button>
            </div>
          </div>
        }

        @if (tab() === 'social') {
          <div class="space-y-3.5">
            @for (link of socialLinks; track link.key) {
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{{ link.label }}</label>
                <input type="url" [ngModel]="p.social?.[link.key]" (ngModelChange)="updateSocial(link.key, $event)" [placeholder]="link.placeholder"
                       class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            }
          </div>
        }

        @if (tab() === 'seo') {
          <div class="space-y-3.5">
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Meta Title</label>
                <span class="text-[10.5px] tabular-nums" [class]="(p.metaTitle?.length ?? 0) > 60 ? 'text-red-500' : 'text-slate-400'">{{ p.metaTitle?.length ?? 0 }}/60</span>
              </div>
              <input type="text" [ngModel]="p.metaTitle" (ngModelChange)="update({ metaTitle: $event })" maxlength="70" placeholder="Alex Johnson — Full Stack Developer"
                     class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Meta Description</label>
                <span class="text-[10.5px] tabular-nums" [class]="(p.metaDescription?.length ?? 0) > 160 ? 'text-red-500' : 'text-slate-400'">{{ p.metaDescription?.length ?? 0 }}/160</span>
              </div>
              <textarea rows="3" [ngModel]="p.metaDescription" (ngModelChange)="update({ metaDescription: $event })" maxlength="200"
                        placeholder="A short summary shown in search results and link previews."
                        class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"></textarea>
            </div>
            @if (p.username) {
              <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3.5">
                <p class="text-[10px] text-emerald-600 dark:text-emerald-400 mb-0.5">apnaconverter.com › p › {{ p.username }}</p>
                <p class="text-[15px] text-[#1a0dab] dark:text-[#8ab4f8] leading-snug truncate">{{ p.metaTitle || p.displayName || p.username }}</p>
                <p class="text-[12px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5 line-clamp-2">{{ p.metaDescription || 'Add a meta description so this preview looks complete in search results.' }}</p>
              </div>
            }
          </div>
        }

      </div>
    }
  `,
})
export class IdentityPanelComponent {
  readonly store = inject(PortfolioStoreService);
  readonly tab = signal<Tab>('basic');

  readonly tabs: { id: Tab; label: string }[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'social', label: 'Social' },
    { id: 'seo', label: 'SEO' },
  ];

  readonly socialLinks: { key: keyof PortfolioSocial; label: string; placeholder: string }[] = [
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourname' },
    { key: 'github', label: 'GitHub', placeholder: 'https://github.com/yourname' },
    { key: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/yourname' },
    { key: 'website', label: 'Website', placeholder: 'https://yoursite.com' },
    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel' },
  ];

  update(patch: Record<string, unknown>): void {
    this.store.updateIdentity(patch);
  }

  onUsername(value: string): void {
    const normalized = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '').replace(/-+/g, '-');
    this.update({ username: normalized });
    void this.store.checkUsername(normalized);
  }

  updateSocial(key: keyof PortfolioSocial, value: string): void {
    const social = { ...(this.store.portfolio()?.social ?? {}), [key]: value };
    this.update({ social });
  }
}
