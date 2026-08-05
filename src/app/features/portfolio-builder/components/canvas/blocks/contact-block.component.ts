import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { ContactConfig, PortfolioSection, PortfolioTheme } from '../../../models/portfolio.model';
import { InlineTextFieldComponent } from '../inline-text-field.component';
import { getThemePreset } from '../../../themes/shared/theme-presets';

@Component({
  selector: 'app-contact-block',
  standalone: true,
  imports: [InlineTextFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="max-w-xl mx-auto px-4 text-center" [class]="preset().fontClass">
      <h3 [class]="preset().heading + ' mb-3'">Contact</h3>
      <p [class]="'text-lg mb-1 ' + preset().title">Let's work together</p>
      <p [class]="'text-sm mb-5 ' + preset().body">Choose what shows on your public contact section.</p>

      <div [class]="'inline-flex mb-5 px-5 py-2.5 ' + preset().chip">
        <app-inline-text-field [value]="config().ctaLabel" placeholder="Button text"
          textClass="text-sm font-semibold text-center bg-transparent min-w-[110px] px-0 py-0 border-none hover:border-none focus:border-none"
          ariaLabel="CTA label" (valueChange)="patch({ ctaLabel: $event })" />
      </div>

      <div class="flex items-center justify-center gap-5 flex-wrap">
        <label class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer select-none">
          <input type="checkbox" [checked]="config().showEmail" (change)="patch({ showEmail: !config().showEmail })" class="rounded accent-primary-600">
          Show email
        </label>
        <label class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer select-none">
          <input type="checkbox" [checked]="config().showPhone" (change)="patch({ showPhone: !config().showPhone })" class="rounded accent-primary-600">
          Show phone
        </label>
        <label class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer select-none">
          <input type="checkbox" [checked]="config().showSocial" (change)="patch({ showSocial: !config().showSocial })" class="rounded accent-primary-600">
          Show social links
        </label>
      </div>
      <p class="text-[11px] text-slate-400 mt-4">Manage your email, phone and social links in Settings.</p>
    </div>
  `,
})
export class ContactBlockComponent {
  section = input.required<PortfolioSection<ContactConfig>>();
  theme = input<PortfolioTheme | null>(null);

  private store = inject(PortfolioStoreService);

  preset() { return getThemePreset(this.theme()?.templateId); }

  config(): ContactConfig { return this.section().config; }

  patch(patch: Partial<ContactConfig>): void {
    this.store.updateSectionConfig(this.section().id, patch);
  }
}
