import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { HeroConfig, PortfolioSection, PortfolioTheme } from '../../../models/portfolio.model';
import { InlineTextFieldComponent } from '../inline-text-field.component';
import { InlineImageFieldComponent } from '../inline-image-field.component';
import { getThemePreset } from '../../../themes/shared/theme-presets';

@Component({
  selector: 'app-hero-block',
  standalone: true,
  imports: [InlineTextFieldComponent, InlineImageFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="relative overflow-hidden px-8 py-14 sm:px-14 text-center"
         [class]="preset().fontClass + ' ' + heroRadius()"
         [style.background]="'radial-gradient(circle at 50% 0%, ' + accent() + '1a, transparent 60%)'">
      <div class="flex flex-col items-center gap-5 max-w-xl mx-auto">
        <app-inline-image-field [url]="config().photoUrl" kind="avatar" [shape]="preset().imageRadius === 'rounded-lg' || preset().imageRadius === 'rounded-md' ? 'square' : 'circle'" size="lg"
          (urlChange)="patch({ photoUrl: $event })" />

        <app-inline-text-field [value]="config().headline" placeholder="Your name or headline"
          [textClass]="'text-3xl sm:text-4xl text-center ' + preset().title"
          ariaLabel="Headline" (valueChange)="patch({ headline: $event })" />

        <app-inline-text-field [value]="config().subheadline" placeholder="A short tagline about what you do" [multiline]="true" [rows]="2"
          [textClass]="'text-base sm:text-lg text-center ' + preset().body"
          ariaLabel="Subheadline" (valueChange)="patch({ subheadline: $event })" />

        <div [class]="'inline-flex mt-2 px-5 py-2.5 ' + preset().ctaClass" [style]="ctaStyle()">
          <app-inline-text-field [value]="config().ctaLabel" placeholder="Button text"
            textClass="text-sm font-semibold text-center bg-transparent min-w-[90px] px-0 py-0 border-none hover:border-none focus:border-none"
            ariaLabel="CTA label" (valueChange)="patch({ ctaLabel: $event })" />
        </div>
        <app-inline-text-field [value]="config().ctaUrl" placeholder="https://... or mailto:you@example.com"
          textClass="text-xs text-slate-400 dark:text-slate-500 text-center"
          ariaLabel="CTA link" (valueChange)="patch({ ctaUrl: $event })" />

        <label class="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400 cursor-pointer select-none">
          <input type="checkbox" [checked]="config().resumeCtaEnabled" (change)="patch({ resumeCtaEnabled: !config().resumeCtaEnabled })" class="rounded accent-primary-600">
          Show "Download Resume" button
        </label>
      </div>
    </div>
  `,
})
export class HeroBlockComponent {
  section = input.required<PortfolioSection<HeroConfig>>();
  theme = input.required<PortfolioTheme>();

  private store = inject(PortfolioStoreService);

  config(): HeroConfig { return this.section().config; }
  accent(): string { return this.theme().accentColor || '#4f46e5'; }
  preset() { return getThemePreset(this.theme().templateId); }
  heroRadius(): string { return this.preset().imageRadius === 'rounded-lg' ? 'rounded-xl' : 'rounded-[24px]'; }

  /** Terminal's CTA is outlined rather than filled; every other theme fills with the accent color. */
  ctaStyle(): Record<string, string> {
    const outlined = this.preset().ctaClass.includes('border-2');
    return outlined
      ? { 'border-color': this.accent(), color: this.accent(), background: 'transparent' }
      : { background: this.accent(), color: 'white' };
  }

  patch(patch: Partial<HeroConfig>): void {
    this.store.updateSectionConfig(this.section().id, patch);
  }
}
