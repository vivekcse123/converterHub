import { Component, ChangeDetectionStrategy, inject, input, output, signal } from '@angular/core';
import { PortfolioThemeMeta } from '../../data/portfolio-themes.data';
import { PortfolioTemplateFavoritesService } from '../../services/portfolio-template-favorites.service';
import { TemplateLivePreviewComponent } from './template-live-preview.component';

const MODE_LABEL: Record<PortfolioThemeMeta['modeSupport'], string> = {
  both: 'Light & Dark',
  'dark-only': 'Dark only',
  'light-only': 'Light only',
};

@Component({
  selector: 'app-template-card',
  standalone: true,
  imports: [TemplateLivePreviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block group' },
  template: `
    <div class="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-300 shadow-card"
         [class.shadow-card-hover]="hovering()" [class.-translate-y-1]="hovering()" [class.ring-2]="active()" [class.ring-primary-500]="active()"
         (mouseenter)="hovering.set(true)" (mouseleave)="hovering.set(false)">

      <div class="relative aspect-[4/3] overflow-hidden">
        <div class="w-full h-full transition-transform duration-500 ease-out" [class]="hovering() ? 'scale-[1.04]' : ''">
          <app-template-live-preview [themeId]="theme().id" [autoScroll]="hovering()" />
        </div>

        <div class="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          @if (theme().isPremium) {
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm text-white bg-gradient-to-r from-violet-600 to-fuchsia-500 flex items-center gap-1">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3L22 9l-5 5 1.2 7-6.2-3.6L5.8 21 7 14 2 9l7.1-.7z"/></svg>
              Premium
            </span>
          }
          @for (b of theme().badges; track b) {
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm"
                  [class]="b === 'popular' ? 'bg-amber-400 text-amber-950' : 'bg-emerald-400 text-emerald-950'">
              {{ b === 'popular' ? 'Popular' : 'New' }}
            </span>
          }
        </div>

        <button type="button" (click)="toggleFavorite($event)"
          class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          [attr.aria-label]="isFavorite() ? 'Remove from favorites' : 'Add to favorites'">
          <svg width="15" height="15" viewBox="0 0 24 24" [attr.fill]="isFavorite() ? '#e11d48' : 'none'" [attr.stroke]="isFavorite() ? '#e11d48' : 'currentColor'" stroke-width="2" class="text-slate-400">
            <path d="M12 21s-6.716-4.35-9.428-8.06C.86 10.42 1.2 6.9 3.9 5.2c2.2-1.38 4.86-.78 6.3 1.02.6.75 1.8.75 2.4 0 1.44-1.8 4.1-2.4 6.3-1.02 2.7 1.7 3.04 5.22 1.33 7.74C18.72 16.65 12 21 12 21z"/>
          </svg>
        </button>

        <div class="absolute inset-x-0 bottom-0 p-2.5 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button type="button" (click)="preview.emit()"
            class="px-3.5 py-2 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur text-xs font-bold text-slate-800 dark:text-slate-100 shadow-popover hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
            Live Preview
          </button>
        </div>
      </div>

      <div class="p-3.5">
        <div class="flex items-start justify-between gap-2 mb-1.5">
          <h4 class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ theme().name }}</h4>
          @if (active()) {
            <span class="shrink-0 px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 text-[10px] font-bold">Active</span>
          }
        </div>
        <p class="text-[11px] text-slate-400 leading-snug mb-2.5 line-clamp-2">{{ theme().description }}</p>

        <div class="flex flex-wrap gap-1 mb-3">
          @for (c of theme().categories.slice(0, 3); track c) {
            <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-medium">{{ c }}</span>
          }
        </div>

        <div class="flex items-center gap-1.5 mb-3 flex-wrap">
          <span class="px-1.5 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/70 text-slate-400 text-[10px] font-medium">{{ MODE_LABEL[theme().modeSupport] }}</span>
          <span class="px-1.5 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/70 text-slate-400 text-[10px] font-medium">Responsive</span>
          @if (theme().animated) {
            <span class="px-1.5 py-0.5 rounded-md bg-violet-50 dark:bg-violet-900/30 text-violet-500 dark:text-violet-300 text-[10px] font-medium flex items-center gap-1">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
              Animated
            </span>
          }
        </div>

        <button type="button" (click)="use.emit()"
          class="w-full py-2.5 rounded-xl text-xs font-bold transition-colors"
          [class]="active() ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default' : 'bg-primary-600 hover:bg-primary-700 text-white'">
          {{ active() ? 'Currently Active' : 'Use Template' }}
        </button>
      </div>
    </div>
  `,
})
export class TemplateCardComponent {
  private favoritesService = inject(PortfolioTemplateFavoritesService);

  theme = input.required<PortfolioThemeMeta>();
  active = input<boolean>(false);

  preview = output<void>();
  use = output<void>();

  readonly hovering = signal(false);
  readonly MODE_LABEL = MODE_LABEL;

  isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.theme().id);
  }

  toggleFavorite(evt: Event): void {
    evt.stopPropagation();
    this.favoritesService.toggle(this.theme().id);
  }
}
