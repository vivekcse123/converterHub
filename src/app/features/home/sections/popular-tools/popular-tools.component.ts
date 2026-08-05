import { Component, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface PopularTool {
  title: string;
  desc: string;
  route: string;
  gradient: string;
}

const POPULAR_TOOLS: PopularTool[] = [
  { title: 'Resume Builder',   desc: 'ATS-friendly resume, free',      route: '/resume-builder', gradient: 'from-primary-500 to-indigo-600' },
  { title: 'PDF to Word',      desc: 'PDF to editable .docx',          route: '/pdf-to-word',    gradient: 'from-primary-500 to-purple-600' },
  { title: 'Word to PDF',      desc: '.docx to polished PDF',          route: '/word-to-pdf',    gradient: 'from-indigo-500 to-blue-600' },
  { title: 'Merge & Split PDF',desc: 'Combine, split, reorder pages',  route: '/pdf-editor',     gradient: 'from-orange-500 to-red-500' },
  { title: 'Compress Files',   desc: 'Shrink images & PDFs to ZIP',    route: '/compress',       gradient: 'from-emerald-500 to-teal-500' },
  { title: 'Portfolio Builder',desc: 'Live, shareable portfolio page', route: '/portfolio',      gradient: 'from-indigo-500 to-primary-600' },
  { title: 'Image Converter',  desc: 'Resize, crop, convert images',   route: '/image-editor',   gradient: 'from-pink-500 to-rose-500' },
  { title: 'Biodata Maker',    desc: 'Marriage & professional biodata',route: '/biodata-maker',  gradient: 'from-rose-500 to-pink-600' },
];

@Component({
  selector: 'app-popular-tools',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="lp-section bg-slate-50 dark:bg-slate-900/40">
      <div class="container-app">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div class="max-w-lg">
            <p class="lp-eyebrow mb-3">Popular tools</p>
            <h2 class="lp-heading">Jump straight to what you need.</h2>
          </div>

          <div class="relative w-full sm:w-72 shrink-0">
            <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Search tools…"
              aria-label="Search popular tools"
              class="input pl-10 w-full"
              [value]="query()"
              (input)="query.set($any($event.target).value)"
            >
          </div>
        </div>

        @if (filtered().length > 0) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            @for (t of filtered(); track t.title) {
              <a [routerLink]="t.route" class="lp-card-hover flex items-center gap-3.5 p-4">
                <span class="w-10 h-10 rounded-xl bg-gradient-to-br shrink-0" [class]="t.gradient" aria-hidden="true"></span>
                <span class="min-w-0">
                  <span class="block font-semibold text-slate-900 dark:text-white text-sm truncate">{{ t.title }}</span>
                  <span class="block text-xs text-slate-500 dark:text-slate-400 truncate">{{ t.desc }}</span>
                </span>
              </a>
            }
          </div>
        } @else {
          <div class="text-center py-14 text-slate-400 dark:text-slate-500">
            <p class="font-medium">No tools match "{{ query() }}"</p>
            <button type="button" class="mt-2 text-sm text-primary-600 hover:underline" (click)="query.set('')">Clear search</button>
          </div>
        }

        <div class="text-center mt-10">
          <a routerLink="/tools" class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
            View all 40+ tools
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </div>
      </div>
    </section>
  `,
})
export class PopularToolsComponent {
  readonly query = signal('');
  private readonly tools = POPULAR_TOOLS;

  readonly filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.tools;
    return this.tools.filter(t => t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q));
  });
}
