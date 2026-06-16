import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JsonLdService } from '../../../core/services/json-ld.service';

const SITE_URL = 'https://www.apnaconverter.com';
const JSON_LD_KEY = 'breadcrumb';

export interface BreadcrumbItem {
  label: string;
  /** Route path, e.g. '/' or '/resume-builder'. */
  path: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav aria-label="Breadcrumb" class="text-sm text-slate-500 dark:text-slate-400 mb-4">
      <ol class="flex items-center gap-1.5 flex-wrap">
        @for (item of items(); track item.path; let last = $last) {
          <li class="flex items-center gap-1.5">
            @if (!last) {
              <a [routerLink]="item.path" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{{ item.label }}</a>
              <span class="text-slate-300 dark:text-slate-600" aria-hidden="true">/</span>
            } @else {
              <span class="text-slate-700 dark:text-slate-300 font-medium" aria-current="page">{{ item.label }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
})
export class BreadcrumbComponent {
  readonly items = input.required<BreadcrumbItem[]>();

  private readonly jsonLd = inject(JsonLdService);

  constructor() {
    effect(() => {
      const items = this.items();
      this.jsonLd.setJsonLd(JSON_LD_KEY, {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.label,
          item: `${SITE_URL}${item.path}`,
        })),
      });
    });

    inject(DestroyRef).onDestroy(() => this.jsonLd.removeJsonLd(JSON_LD_KEY));
  }
}
