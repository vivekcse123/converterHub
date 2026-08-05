import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ProductCategory {
  title: string;
  desc: string;
  route: string;
  queryParams?: Record<string, string>;
  iconPath: string;
  iconBg: string;
  iconColor: string;
}

@Component({
  selector: 'app-products-section',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="lp-section bg-white dark:bg-slate-950">
      <div class="container-app">
        <div class="max-w-2xl mb-10">
          <p class="lp-eyebrow mb-3">Products</p>
          <h2 class="lp-heading mb-4">Everything you need, in one place.</h2>
          <p class="section-subtitle">
            From your first resume to a live portfolio - seven focused product families,
            not forty scattered tools.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          @for (p of products; track p.title) {
            <a
              [routerLink]="p.route"
              [queryParams]="p.queryParams ?? null"
              class="lp-card-hover group flex flex-col p-6"
            >
              <div class="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-slow group-hover:-translate-y-0.5 group-hover:scale-105"
                   [class]="p.iconBg" aria-hidden="true">
                <svg class="w-5 h-5" [class]="p.iconColor" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="p.iconPath"/>
                </svg>
              </div>
              <h3 class="font-semibold text-slate-900 dark:text-white text-[15px] mb-1.5">{{ p.title }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{{ p.desc }}</p>
              <span class="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-slow">
                Explore
                <svg class="w-3.5 h-3.5 transition-transform duration-slow group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg>
              </span>
            </a>
          }
        </div>
      </div>
    </section>
  `,
})
export class ProductsSectionComponent {
  readonly products: ProductCategory[] = [
    { title: 'Resume Builder', desc: 'ATS-optimized resumes with live scoring and 30+ templates.', route: '/resume-builder', iconBg: 'bg-primary-50 dark:bg-primary-900/30', iconColor: 'text-primary-600 dark:text-primary-400', iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { title: 'Portfolio Builder', desc: 'A shareable, hosted portfolio page, live in minutes.', route: '/portfolio', iconBg: 'bg-indigo-50 dark:bg-indigo-900/30', iconColor: 'text-indigo-600 dark:text-indigo-400', iconPath: 'M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9zM3 12h18M12 3c2.2 2.6 2.2 15.4 0 18M12 3c-2.2 2.6-2.2 15.4 0 18' },
    { title: 'PDF Tools', desc: 'Merge, split, compress, sign, and edit PDFs in the browser.', route: '/tools', queryParams: { category: 'pdf' }, iconBg: 'bg-red-50 dark:bg-red-900/30', iconColor: 'text-red-600 dark:text-red-400', iconPath: 'M4 6a2 2 0 012-2h7l5 5v9a2 2 0 01-2 2H6a2 2 0 01-2-2V6z M13 4v5h5 M9 15h6' },
    { title: 'Image Tools', desc: 'Convert, resize, crop, and compress photos and graphics.', route: '/tools', queryParams: { category: 'image' }, iconBg: 'bg-cyan-50 dark:bg-cyan-900/30', iconColor: 'text-cyan-600 dark:text-cyan-400', iconPath: 'M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z M8.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M21 15l-5-5-9 9' },
    { title: 'AI Tools', desc: 'AI writing, rewriting, and scoring built into every builder.', route: '/resume-builder', queryParams: { ai: 'writer' }, iconBg: 'bg-fuchsia-50 dark:bg-fuchsia-900/30', iconColor: 'text-fuchsia-600 dark:text-fuchsia-400', iconPath: 'M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z' },
    { title: 'ATS Checker', desc: 'Instant ATS score, keyword gaps, and fixes before you apply.', route: '/ats-resume-checker', iconBg: 'bg-violet-50 dark:bg-violet-900/30', iconColor: 'text-violet-600 dark:text-violet-400', iconPath: 'M9 12.5l2 2 4-4.5M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z' },
    { title: 'File Converters', desc: '40+ converters: Word, Excel, CSV, HTML, Markdown and more.', route: '/tools', iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400', iconPath: 'M4 4v5h5 M20 20v-5h-5 M5.6 15A8 8 0 0119 9M18.4 9A8 8 0 015 15' },
    { title: 'Document Tools', desc: 'Extract, organize, and transform documents in bulk.', route: '/tools', queryParams: { category: 'document' }, iconBg: 'bg-amber-50 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400', iconPath: 'M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z' },
  ];
}
