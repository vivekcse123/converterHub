import { Component, ChangeDetectionStrategy, HostListener, computed, inject, output, signal } from '@angular/core';
import { PORTFOLIO_THEMES, AVAILABLE_CATEGORIES, PortfolioThemeMeta } from '../../data/portfolio-themes.data';
import { PortfolioStoreService } from '../../services/portfolio-store.service';
import { PortfolioTemplateFavoritesService } from '../../services/portfolio-template-favorites.service';
import { TemplateCardComponent } from './template-card.component';
import { TemplatePreviewModalComponent } from './template-preview-modal.component';

@Component({
  selector: 'app-template-gallery-modal',
  standalone: true,
  imports: [TemplateCardComponent, TemplatePreviewModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'fixed inset-0 z-[60] flex flex-col bg-slate-50 dark:bg-slate-950' },
  template: `
    <div class="flex items-center justify-between px-4 sm:px-6 py-4 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div>
        <h2 class="text-base font-bold text-slate-800 dark:text-slate-100">Templates</h2>
        <p class="text-[11px] text-slate-400">{{ filtered().length }} template{{ filtered().length === 1 ? '' : 's' }}</p>
      </div>
      <button type="button" (click)="close.emit()"
        class="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center transition-colors">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>

    <div class="flex items-center gap-2 px-4 sm:px-6 py-3 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
      <button type="button" (click)="category.set(null)"
        class="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
        [class]="category() === null ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'">
        All
      </button>
      <button type="button" (click)="favoritesOnly.set(!favoritesOnly())"
        class="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5"
        [class]="favoritesOnly() ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'">
        <svg width="12" height="12" viewBox="0 0 24 24" [attr.fill]="favoritesOnly() ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M12 21s-6.716-4.35-9.428-8.06C.86 10.42 1.2 6.9 3.9 5.2c2.2-1.38 4.86-.78 6.3 1.02.6.75 1.8.75 2.4 0 1.44-1.8 4.1-2.4 6.3-1.02 2.7 1.7 3.04 5.22 1.33 7.74C18.72 16.65 12 21 12 21z"/></svg>
        Favorites
      </button>
      <div class="w-px h-4 bg-slate-200 dark:bg-slate-700 shrink-0"></div>
      @for (c of categories; track c) {
        <button type="button" (click)="category.set(c)"
          class="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
          [class]="category() === c ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'">
          {{ c }}
        </button>
      }
    </div>

    <div class="flex-1 overflow-y-auto p-4 sm:p-6">
      @if (filtered().length) {
        <div class="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 max-w-6xl mx-auto">
          @for (t of filtered(); track t.id) {
            <app-template-card [theme]="t" [active]="isActive(t.id)"
              (preview)="previewing.set(t)" (use)="applyTemplate(t)" />
          }
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center h-full text-center gap-2 text-slate-400">
          <p class="text-sm font-semibold">No templates match this filter</p>
          <p class="text-xs">Try a different category, or clear the favorites filter.</p>
        </div>
      }
    </div>

    @if (previewing(); as t) {
      <app-template-preview-modal [theme]="t" (close)="previewing.set(null)" (use)="applyTemplate(t); previewing.set(null)" />
    }
  `,
})
export class TemplateGalleryModalComponent {
  private store = inject(PortfolioStoreService);
  private favoritesService = inject(PortfolioTemplateFavoritesService);

  close = output<void>();

  readonly categories = AVAILABLE_CATEGORIES;
  readonly category = signal<string | null>(null);
  readonly favoritesOnly = signal(false);
  readonly previewing = signal<PortfolioThemeMeta | null>(null);

  readonly filtered = computed(() => {
    const cat = this.category();
    const favOnly = this.favoritesOnly();
    // Re-read on every favorites change so the list updates live when toggled.
    this.favoritesService.favorites();
    return PORTFOLIO_THEMES.filter(t => {
      if (cat && !t.categories.includes(cat)) return false;
      if (favOnly && !this.favoritesService.isFavorite(t.id)) return false;
      return true;
    });
  });

  isActive(id: string): boolean {
    return this.store.portfolio()?.theme.templateId === id;
  }

  applyTemplate(t: PortfolioThemeMeta): void {
    this.store.updateTheme({ templateId: t.id, accentColor: t.defaultAccent, mode: t.defaultMode });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.previewing()) { this.previewing.set(null); return; }
    this.close.emit();
  }
}
