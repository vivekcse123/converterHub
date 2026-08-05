import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { ExperienceConfig, ExperienceItem, PortfolioSection, PortfolioTheme, uid } from '../../../models/portfolio.model';
import { InlineTextFieldComponent } from '../inline-text-field.component';
import { getThemePreset } from '../../../themes/shared/theme-presets';

@Component({
  selector: 'app-experience-block',
  standalone: true,
  imports: [InlineTextFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="max-w-2xl mx-auto px-4" [class]="preset().fontClass">
      <h3 [class]="preset().heading + ' mb-4'">Experience</h3>

      <div class="space-y-5">
        @for (item of config().items; track item.id) {
          <div class="relative pl-5 border-l-2 border-slate-200 dark:border-slate-700">
            <span class="absolute -left-[7px] top-1 w-3 h-3 rounded-full" [style.background]="accent()"></span>
            <button type="button" (click)="removeItem(item.id)" class="absolute right-0 top-0 text-[11px] text-slate-400 hover:text-red-500">Remove</button>

            <app-inline-text-field [value]="item.role" placeholder="Job title" [textClass]="'text-base ' + preset().title"
              ariaLabel="Role" (valueChange)="patchItem(item.id, { role: $event })" />
            <app-inline-text-field [value]="item.company" placeholder="Company" textClass="text-sm font-medium" [style.color]="accent()"
              ariaLabel="Company" (valueChange)="patchItem(item.id, { company: $event })" />

            <div class="flex items-center gap-2 mt-1 mb-3">
              <app-inline-text-field [value]="item.startDate" placeholder="Start (e.g. Jan 2022)" textClass="text-xs text-slate-400 w-28"
                ariaLabel="Start date" (valueChange)="patchItem(item.id, { startDate: $event })" />
              <span class="text-xs text-slate-400">–</span>
              @if (!item.current) {
                <app-inline-text-field [value]="item.endDate" placeholder="End" textClass="text-xs text-slate-400 w-24"
                  ariaLabel="End date" (valueChange)="patchItem(item.id, { endDate: $event })" />
              } @else {
                <span class="text-xs font-semibold text-emerald-500">Present</span>
              }
              <label class="flex items-center gap-1.5 text-[11px] text-slate-400 ml-2 cursor-pointer select-none">
                <input type="checkbox" [checked]="item.current" (change)="patchItem(item.id, { current: !item.current })" class="rounded accent-primary-600">
                Current
              </label>
            </div>

            <ul class="space-y-1.5">
              @for (b of item.bullets; track $index) {
                <li class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span class="mt-2 w-1 h-1 rounded-full bg-slate-400 shrink-0"></span>
                  <app-inline-text-field [value]="b" [multiline]="true" [rows]="1" textClass="text-sm text-slate-600 dark:text-slate-300 flex-1"
                    ariaLabel="Bullet" (valueChange)="patchBullet(item.id, $index, $event)" />
                  <button type="button" (click)="removeBullet(item.id, $index)" class="text-slate-300 hover:text-red-500 mt-1.5 shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </li>
              }
            </ul>
            <button type="button" (click)="addBullet(item.id)" class="mt-2 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
              + Add bullet
            </button>
          </div>
        }
      </div>

      <button type="button" (click)="addItem()"
        class="mt-5 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors">
        + Add experience
      </button>
    </div>
  `,
})
export class ExperienceBlockComponent {
  section = input.required<PortfolioSection<ExperienceConfig>>();
  theme = input<PortfolioTheme | null>(null);

  private store = inject(PortfolioStoreService);

  preset() { return getThemePreset(this.theme()?.templateId); }
  accent(): string { return this.theme()?.accentColor || '#4f46e5'; }

  config(): ExperienceConfig { return this.section().config; }

  private patch(patch: Partial<ExperienceConfig>): void {
    this.store.updateSectionConfig(this.section().id, patch);
  }

  private updateItems(fn: (items: ExperienceItem[]) => ExperienceItem[]): void {
    this.patch({ items: fn(this.config().items) });
  }

  addItem(): void {
    this.updateItems(items => [...items, { id: uid('exp'), role: '', company: '', startDate: '', endDate: '', current: false, bullets: [] }]);
  }

  removeItem(id: string): void {
    this.updateItems(items => items.filter(i => i.id !== id));
  }

  patchItem(id: string, patch: Partial<ExperienceItem>): void {
    this.updateItems(items => items.map(i => i.id === id ? { ...i, ...patch } : i));
  }

  addBullet(id: string): void {
    this.updateItems(items => items.map(i => i.id === id ? { ...i, bullets: [...i.bullets, ''] } : i));
  }

  patchBullet(id: string, index: number, value: string): void {
    this.updateItems(items => items.map(i =>
      i.id === id ? { ...i, bullets: i.bullets.map((b, bi) => bi === index ? value : b) } : i));
  }

  removeBullet(id: string, index: number): void {
    this.updateItems(items => items.map(i =>
      i.id === id ? { ...i, bullets: i.bullets.filter((_, bi) => bi !== index) } : i));
  }
}
