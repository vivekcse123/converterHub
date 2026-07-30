import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { HeroConfig, PortfolioSection } from '../../../models/portfolio.model';
import { ImageUploadFieldComponent } from '../image-upload-field/image-upload-field.component';

const FIELD = 'w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500';
const LABEL = 'text-xs font-semibold text-slate-500 block mb-1';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUploadFieldComponent],
  template: `
    <div class="space-y-3">
      <div>
        <label [class]="labelCls">Headline</label>
        <input type="text" [ngModel]="section().config.headline" (ngModelChange)="update({ headline: $event })"
               placeholder="Priya Sharma" [class]="fieldCls" />
      </div>
      <div>
        <label [class]="labelCls">Subheadline</label>
        <input type="text" [ngModel]="section().config.subheadline" (ngModelChange)="update({ subheadline: $event })"
               placeholder="Full-Stack Developer" [class]="fieldCls" />
      </div>
      <app-image-upload-field label="Photo" kind="avatar" [url]="section().config.photoUrl" (urlChange)="update({ photoUrl: $event })" />
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label [class]="labelCls">CTA Label</label>
          <input type="text" [ngModel]="section().config.ctaLabel" (ngModelChange)="update({ ctaLabel: $event })"
                 placeholder="Hire Me" [class]="fieldCls" />
        </div>
        <div>
          <label [class]="labelCls">CTA URL</label>
          <input type="url" [ngModel]="section().config.ctaUrl" (ngModelChange)="update({ ctaUrl: $event })"
                 placeholder="mailto:you@example.com" [class]="fieldCls" />
        </div>
      </div>
      <label class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <input type="checkbox" [ngModel]="section().config.resumeCtaEnabled" (ngModelChange)="update({ resumeCtaEnabled: $event })" class="rounded" />
        Show "Download Resume" button
      </label>
    </div>
  `,
})
export class HeroFormComponent {
  readonly section = input.required<PortfolioSection<HeroConfig>>();
  private store = inject(PortfolioStoreService);
  readonly fieldCls = FIELD;
  readonly labelCls = LABEL;

  update(patch: Partial<HeroConfig>): void {
    this.store.updateSectionConfig<HeroConfig>(this.section().id, patch);
  }
}
