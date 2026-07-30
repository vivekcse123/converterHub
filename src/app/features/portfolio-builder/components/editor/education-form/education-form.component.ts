import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { EducationConfig, EducationItem, PortfolioSection } from '../../../models/portfolio.model';

@Component({
  selector: 'app-education-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-3">
      @for (item of section().config.items; track $index) {
        <div class="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold text-slate-600 dark:text-slate-300">Education {{ $index + 1 }}</p>
            <button type="button" class="text-red-400 hover:text-red-600 text-xs" (click)="remove($index)">Remove</button>
          </div>
          <input type="text" [ngModel]="item.institution" (ngModelChange)="set($index, { institution: $event })" placeholder="Institution"
                 class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none" />
          <div class="grid grid-cols-2 gap-2">
            <input type="text" [ngModel]="item.degree" (ngModelChange)="set($index, { degree: $event })" placeholder="Degree"
                   class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none" />
            <input type="text" [ngModel]="item.field" (ngModelChange)="set($index, { field: $event })" placeholder="Field of study"
                   class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <input type="text" [ngModel]="item.startDate" (ngModelChange)="set($index, { startDate: $event })" placeholder="Start year"
                   class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none" />
            <input type="text" [ngModel]="item.endDate" (ngModelChange)="set($index, { endDate: $event })" placeholder="End year"
                   class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none" />
          </div>
        </div>
      }
      <button type="button"
              class="w-full text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 py-2 border border-dashed border-slate-300 dark:border-slate-600 hover:border-primary-400 rounded-xl transition-colors"
              (click)="add()">+ Add education</button>
    </div>
  `,
})
export class EducationFormComponent {
  readonly section = input.required<PortfolioSection<EducationConfig>>();
  private store = inject(PortfolioStoreService);

  private update(patch: Partial<EducationConfig>): void {
    this.store.updateSectionConfig<EducationConfig>(this.section().id, patch);
  }

  add(): void {
    const blank: EducationItem = { institution: '', degree: '', field: '', startDate: '', endDate: '' };
    this.update({ items: [...this.section().config.items, blank] });
  }

  remove(i: number): void {
    this.update({ items: this.section().config.items.filter((_, idx) => idx !== i) });
  }

  set(i: number, patch: Partial<EducationItem>): void {
    const items = [...this.section().config.items];
    items[i] = { ...items[i], ...patch };
    this.update({ items });
  }
}
