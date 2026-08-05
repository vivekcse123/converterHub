import { Component, OnInit, computed, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TOOLS, ToolCategory } from '../../core/models/tool.model';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card.component';
import { AdBannerComponent } from '../../shared/components/ad-banner/ad-banner.component';

const CATEGORIES: { id: ToolCategory | 'all'; label: string }[] = [
  { id: 'all',      label: 'All Tools' },
  { id: 'pdf',      label: 'PDF' },
  { id: 'image',    label: 'Image' },
  { id: 'document', label: 'Document' },
  { id: 'archive',  label: 'Archive' },
  { id: 'resume',   label: 'Resume & Career' },
  { id: 'biodata',  label: 'Biodata' },
];

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [RouterLink, ToolCardComponent, AdBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container-app py-8 sm:py-12 space-y-8">

      <!-- Header -->
      <div class="text-center space-y-3 max-w-2xl mx-auto">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          All Tools
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-base">
          Free online converters, editors, and career tools - no sign-up required for most.
        </p>
      </div>

      <!-- Search -->
      <div class="max-w-lg mx-auto">
        <div class="relative">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Search tools..."
            class="input pl-10 w-full"
            [value]="query()"
            (input)="query.set($any($event.target).value)"
          >
        </div>
      </div>

      <!-- Category filter -->
      <div class="flex flex-wrap gap-2 justify-center">
        @for (cat of categories; track cat.id) {
          <button
            type="button"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors border"
            [class]="activeCategory() === cat.id
              ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-400 hover:text-primary-600'"
            (click)="activeCategory.set(cat.id)">
            {{ cat.label }}
          </button>
        }
      </div>

      <app-ad-banner slot="horizontal" />

      <!-- Tool grid -->
      @if (filteredTools().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          @for (tool of filteredTools(); track tool.id) {
            <app-tool-card [tool]="tool" />
          }
        </div>
      } @else {
        <div class="text-center py-16 text-slate-400 dark:text-slate-500">
          <p class="text-4xl mb-3">🔍</p>
          <p class="font-medium">No tools found for "{{ query() }}"</p>
          <button type="button" class="mt-3 text-sm text-primary-600 hover:underline" (click)="query.set(''); activeCategory.set('all')">
            Clear search
          </button>
        </div>
      }

    </div>
  `,
})
export class ToolsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  readonly categories = CATEGORIES;
  readonly query = signal('');
  readonly activeCategory = signal<ToolCategory | 'all'>('all');

  ngOnInit(): void {
    // Deep-link support for homepage cards like "PDF Tools" (?category=pdf)
    // so they land pre-filtered instead of on the unfiltered "All Tools" view.
    const category = this.route.snapshot.queryParamMap.get('category') as ToolCategory | null;
    if (category && CATEGORIES.some(c => c.id === category)) this.activeCategory.set(category);
  }

  readonly filteredTools = computed(() => {
    const q = this.query().toLowerCase().trim();
    const cat = this.activeCategory();
    return TOOLS.filter(t =>
      (cat === 'all' || t.category === cat) &&
      (!q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    );
  });
}
