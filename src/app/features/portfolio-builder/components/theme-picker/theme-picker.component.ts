import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { PortfolioStoreService } from '../../services/portfolio-store.service';
import { PORTFOLIO_THEMES } from '../../data/portfolio-themes.data';
import { TemplateCardComponent } from '../template-gallery/template-card.component';
import { TemplateGalleryModalComponent } from '../template-gallery/template-gallery-modal.component';
import { TemplatePreviewModalComponent } from '../template-gallery/template-preview-modal.component';
import type { PortfolioThemeMeta } from '../../data/portfolio-themes.data';

@Component({
  selector: 'app-theme-picker',
  standalone: true,
  imports: [TemplateCardComponent, TemplateGalleryModalComponent, TemplatePreviewModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="p-4">
      <button type="button" (click)="showGallery.set(true)"
        class="w-full mb-4 py-2.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center justify-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
        Browse full gallery
      </button>

      <div class="space-y-4">
        @for (t of themes; track t.id) {
          <app-template-card [theme]="t" [active]="active(t.id)"
            (preview)="previewing.set(t)" (use)="select(t)" />
        }
      </div>
    </div>

    @if (showGallery()) {
      <app-template-gallery-modal (close)="showGallery.set(false)" />
    }
    @if (previewing(); as t) {
      <app-template-preview-modal [theme]="t" (close)="previewing.set(null)" (use)="select(t); previewing.set(null)" />
    }
  `,
})
export class ThemePickerComponent {
  readonly store = inject(PortfolioStoreService);
  readonly themes = PORTFOLIO_THEMES;

  readonly showGallery = signal(false);
  readonly previewing = signal<PortfolioThemeMeta | null>(null);

  active(id: string): boolean {
    return this.store.portfolio()?.theme.templateId === id;
  }

  select(theme: PortfolioThemeMeta): void {
    this.store.updateTheme({ templateId: theme.id, accentColor: theme.defaultAccent, mode: theme.defaultMode });
  }
}
