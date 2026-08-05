import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { HOME_PRODUCT_CARDS } from '../../../../shared/data/home-products.data';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [RouterLink, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div class="container-app">
        <div class="text-center mb-12">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Everything You Need to Land Your Next Job</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
            One platform for resumes, biodata, cover letters, portfolios, AI writing help, and file tools.
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          @for (p of products; track p.title) {
            <a
              [routerLink]="p.route"
              [queryParams]="p.queryParams ?? null"
              class="group flex items-start gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all"
            >
              <div class="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" [class]="p.iconBg" aria-hidden="true">{{ p.icon }}</div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1.5">
                  <p class="font-bold text-slate-800 dark:text-white text-sm">{{ p.title }}</p>
                  @if (p.badge) {
                    <app-badge [variant]="p.badgeVariant" size="sm">{{ p.badge }}</app-badge>
                  }
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ p.nextStep }}</p>
              </div>
            </a>
          }
        </div>
      </div>
    </section>
  `,
})
export class ProductGridComponent {
  readonly products = HOME_PRODUCT_CARDS;
}
