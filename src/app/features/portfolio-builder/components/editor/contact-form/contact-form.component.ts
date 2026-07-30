import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { ContactConfig, PortfolioSection } from '../../../models/portfolio.model';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-3">
      <div>
        <label class="text-xs font-semibold text-slate-500 block mb-1">CTA Label</label>
        <input type="text" [ngModel]="section().config.ctaLabel" (ngModelChange)="update({ ctaLabel: $event })" placeholder="Get in touch"
               class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>
      <label class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <input type="checkbox" [ngModel]="section().config.showEmail" (ngModelChange)="update({ showEmail: $event })" class="rounded" />
        Show email
      </label>
      <label class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <input type="checkbox" [ngModel]="section().config.showPhone" (ngModelChange)="update({ showPhone: $event })" class="rounded" />
        Show phone
      </label>
      <label class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <input type="checkbox" [ngModel]="section().config.showSocial" (ngModelChange)="update({ showSocial: $event })" class="rounded" />
        Show social links
      </label>
      <p class="text-[11px] text-slate-400">Email, phone and social links are set on the Identity panel above and reused here.</p>
    </div>
  `,
})
export class ContactFormComponent {
  readonly section = input.required<PortfolioSection<ContactConfig>>();
  private store = inject(PortfolioStoreService);

  update(patch: Partial<ContactConfig>): void {
    this.store.updateSectionConfig<ContactConfig>(this.section().id, patch);
  }
}
