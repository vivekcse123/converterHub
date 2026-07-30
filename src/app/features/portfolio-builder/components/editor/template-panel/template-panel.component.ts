import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { PortfolioTemplateMeta, PORTFOLIO_TEMPLATES } from '../../../data/portfolio-templates.data';

@Component({
  selector: 'app-template-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (store.portfolio(); as p) {
      <div class="space-y-3">
        <p class="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
          Switching a template keeps all of your content — only the layout and styling change.
        </p>
        @for (t of templates; track t.id) {
          <div class="rounded-2xl border overflow-hidden transition-colors"
               [class]="p.theme.templateId === t.id ? 'border-primary-400 dark:border-primary-600 ring-1 ring-primary-400/40' : 'border-slate-200 dark:border-slate-800'">
            <div class="h-20 p-3 flex flex-col justify-end gap-1.5 bg-gradient-to-br {{ t.accent }}">
              <div class="w-2/5 h-2 rounded-full bg-white/70"></div>
              <div class="w-3/5 h-1.5 rounded-full bg-white/40"></div>
            </div>
            <div class="p-3.5">
              <div class="flex items-center justify-between gap-2">
                <p class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ t.name }}</p>
                @if (p.theme.templateId === t.id) {
                  <span class="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wide shrink-0">Active</span>
                }
              </div>
              <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-1 mb-3 leading-snug">{{ t.description }}</p>
              <button type="button"
                      class="w-full py-2 rounded-lg text-xs font-bold transition-colors disabled:cursor-default"
                      [disabled]="p.theme.templateId === t.id"
                      [class]="p.theme.templateId === t.id
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'"
                      (click)="apply(t)">
                {{ p.theme.templateId === t.id ? 'Currently applied' : 'Apply template' }}
              </button>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class TemplatePanelComponent {
  readonly store = inject(PortfolioStoreService);
  readonly templates = PORTFOLIO_TEMPLATES;

  apply(t: PortfolioTemplateMeta): void {
    const current = this.store.portfolio()?.theme;
    const prevMeta = this.templates.find(m => m.id === current?.templateId);
    const accentColor = (!current || current.accentColor === prevMeta?.defaultAccentHex) ? t.defaultAccentHex : current.accentColor;
    this.store.updateTheme({ templateId: t.id, accentColor });
  }
}
