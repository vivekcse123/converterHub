import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { PortfolioSection, PortfolioTheme, TestimonialItem, TestimonialsConfig } from '../../../models/portfolio.model';
import { InlineTextFieldComponent } from '../inline-text-field.component';
import { InlineImageFieldComponent } from '../inline-image-field.component';
import { getThemePreset } from '../../../themes/shared/theme-presets';

@Component({
  selector: 'app-testimonials-block',
  standalone: true,
  imports: [InlineTextFieldComponent, InlineImageFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="max-w-3xl mx-auto px-4" [class]="preset().fontClass">
      <h3 [class]="preset().heading + ' mb-4'">Testimonials</h3>

      <div class="grid sm:grid-cols-2 gap-4">
        @for (item of config().items; track item; let i = $index) {
          <div [class]="preset().card + ' p-4'">
            <button type="button" (click)="removeItem(i)" class="float-right text-[11px] text-slate-400 hover:text-red-500">Remove</button>
            <span class="text-3xl leading-none opacity-30" [style.color]="accent()">"</span>
            <app-inline-text-field [value]="item.quote" placeholder="What did they say?" [multiline]="true" [rows]="3"
              [textClass]="'text-sm italic -mt-2 ' + preset().body"
              ariaLabel="Quote" (valueChange)="patchItem(i, { quote: $event })" />

            <div class="flex items-center gap-2.5 mt-3">
              <app-inline-image-field [url]="item.avatarUrl" kind="avatar" shape="circle" size="sm"
                (urlChange)="patchItem(i, { avatarUrl: $event })" />
              <div class="flex-1 min-w-0">
                <app-inline-text-field [value]="item.author" placeholder="Name" [textClass]="'text-xs ' + preset().title"
                  ariaLabel="Author" (valueChange)="patchItem(i, { author: $event })" />
                <app-inline-text-field [value]="item.role" placeholder="Role, Company" textClass="text-[11px] text-slate-400"
                  ariaLabel="Role" (valueChange)="patchItem(i, { role: $event })" />
              </div>
            </div>
          </div>
        }
      </div>

      <button type="button" (click)="addItem()"
        class="mt-5 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors">
        + Add testimonial
      </button>
    </div>
  `,
})
export class TestimonialsBlockComponent {
  section = input.required<PortfolioSection<TestimonialsConfig>>();
  theme = input<PortfolioTheme | null>(null);

  private store = inject(PortfolioStoreService);

  preset() { return getThemePreset(this.theme()?.templateId); }
  accent(): string { return this.theme()?.accentColor || '#4f46e5'; }

  config(): TestimonialsConfig { return this.section().config; }

  private patch(patch: Partial<TestimonialsConfig>): void {
    this.store.updateSectionConfig(this.section().id, patch);
  }

  private updateItems(fn: (items: TestimonialItem[]) => TestimonialItem[]): void {
    this.patch({ items: fn(this.config().items) });
  }

  addItem(): void {
    this.updateItems(items => [...items, { quote: '', author: '', role: '' }]);
  }

  removeItem(index: number): void {
    this.updateItems(items => items.filter((_, i) => i !== index));
  }

  patchItem(index: number, patch: Partial<TestimonialItem>): void {
    this.updateItems(items => items.map((it, i) => i === index ? { ...it, ...patch } : it));
  }
}
