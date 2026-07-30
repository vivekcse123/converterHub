import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { AboutConfig, PortfolioSection } from '../../../models/portfolio.model';

@Component({
  selector: 'app-about-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-3">
      <div>
        <label class="text-xs font-semibold text-slate-500 block mb-1">About</label>
        <textarea rows="5" [ngModel]="section().config.body" (ngModelChange)="update({ body: $event })"
                  placeholder="Write a short bio about yourself..."
                  class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
      </div>
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-xs font-semibold text-slate-500">Highlights</label>
          <button type="button" class="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline" (click)="addHighlight()">+ Add</button>
        </div>
        @for (h of section().config.highlights; track $index) {
          <div class="flex items-center gap-2 mb-2">
            <input type="text" [ngModel]="h" (ngModelChange)="setHighlight($index, $event)" placeholder="e.g. 5+ years building web apps"
                   class="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none" />
            <button type="button" class="text-red-400 hover:text-red-600 text-sm px-1" (click)="removeHighlight($index)">✕</button>
          </div>
        }
      </div>
    </div>
  `,
})
export class AboutFormComponent {
  readonly section = input.required<PortfolioSection<AboutConfig>>();
  private store = inject(PortfolioStoreService);

  update(patch: Partial<AboutConfig>): void {
    this.store.updateSectionConfig<AboutConfig>(this.section().id, patch);
  }

  addHighlight(): void {
    this.update({ highlights: [...this.section().config.highlights, ''] });
  }

  setHighlight(i: number, value: string): void {
    const highlights = [...this.section().config.highlights];
    highlights[i] = value;
    this.update({ highlights });
  }

  removeHighlight(i: number): void {
    this.update({ highlights: this.section().config.highlights.filter((_, idx) => idx !== i) });
  }
}
