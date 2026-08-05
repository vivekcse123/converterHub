import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { EducationConfig, EducationItem, PortfolioSection, PortfolioTheme } from '../../../models/portfolio.model';
import { InlineTextFieldComponent } from '../inline-text-field.component';
import { getThemePreset } from '../../../themes/shared/theme-presets';

@Component({
  selector: 'app-education-block',
  standalone: true,
  imports: [InlineTextFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="max-w-2xl mx-auto px-4" [class]="preset().fontClass">
      <h3 [class]="preset().heading + ' mb-4'">Education</h3>

      <div class="space-y-4">
        @for (item of config().items; track item; let i = $index) {
          <div [class]="preset().card + ' p-4'">
            <div class="flex items-start justify-between gap-2">
              <app-inline-text-field [value]="item.institution" placeholder="Institution name" [textClass]="'text-sm ' + preset().title"
                ariaLabel="Institution" (valueChange)="patchItem(i, { institution: $event })" />
              <button type="button" (click)="removeItem(i)" class="text-[11px] text-slate-400 hover:text-red-500 shrink-0">Remove</button>
            </div>
            <div class="flex items-center gap-2 mt-1">
              <app-inline-text-field [value]="item.degree" placeholder="Degree" textClass="text-xs text-slate-600 dark:text-slate-300"
                ariaLabel="Degree" (valueChange)="patchItem(i, { degree: $event })" />
              <span class="text-xs text-slate-300">·</span>
              <app-inline-text-field [value]="item.field" placeholder="Field of study" textClass="text-xs text-slate-600 dark:text-slate-300"
                ariaLabel="Field" (valueChange)="patchItem(i, { field: $event })" />
            </div>
            <div class="flex items-center gap-2 mt-1.5">
              <app-inline-text-field [value]="item.startDate" placeholder="Start year" textClass="text-[11px] text-slate-400 w-16"
                ariaLabel="Start" (valueChange)="patchItem(i, { startDate: $event })" />
              <span class="text-[11px] text-slate-400">–</span>
              <app-inline-text-field [value]="item.endDate" placeholder="End year" textClass="text-[11px] text-slate-400 w-16"
                ariaLabel="End" (valueChange)="patchItem(i, { endDate: $event })" />
            </div>
          </div>
        }
      </div>

      <button type="button" (click)="addItem()"
        class="mt-5 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors">
        + Add education
      </button>
    </div>
  `,
})
export class EducationBlockComponent {
  section = input.required<PortfolioSection<EducationConfig>>();
  theme = input<PortfolioTheme | null>(null);

  private store = inject(PortfolioStoreService);

  preset() { return getThemePreset(this.theme()?.templateId); }

  config(): EducationConfig { return this.section().config; }

  private patch(patch: Partial<EducationConfig>): void {
    this.store.updateSectionConfig(this.section().id, patch);
  }

  private updateItems(fn: (items: EducationItem[]) => EducationItem[]): void {
    this.patch({ items: fn(this.config().items) });
  }

  addItem(): void {
    this.updateItems(items => [...items, { institution: '', degree: '', field: '', startDate: '', endDate: '' }]);
  }

  removeItem(index: number): void {
    this.updateItems(items => items.filter((_, i) => i !== index));
  }

  patchItem(index: number, patch: Partial<EducationItem>): void {
    this.updateItems(items => items.map((it, i) => i === index ? { ...it, ...patch } : it));
  }
}
