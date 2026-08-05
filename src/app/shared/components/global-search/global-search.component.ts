import { Component, ElementRef, HostListener, ViewChild, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchService, SearchResult } from '../../../core/services/search.service';

interface ResultGroup { label: string; items: SearchResult[]; }

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative" #container>
      <!-- Search Input -->
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          #searchInput
          type="text"
          [ngModel]="search.query()"
          (ngModelChange)="onQueryChange($event)"
          (focus)="search.open()"
          (keydown)="onKeydown($event)"
          placeholder="Search tools, templates, pages…"
          aria-label="Search tools"
          autocomplete="off"
          role="combobox"
          aria-haspopup="listbox"
          [attr.aria-expanded]="search.isOpen()"
          aria-controls="global-search-results"
          class="w-full pl-9 pr-14 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700
                 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white
                 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500
                 transition-all duration-200"
        />
        @if (search.query()) {
          <button (click)="search.clear(); searchInput.focus()" aria-label="Clear search"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        } @else {
          <span class="hidden sm:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center justify-center h-5 min-w-[1.25rem] px-1 rounded border border-slate-300 dark:border-slate-600 text-[10px] font-medium text-slate-400 pointer-events-none">/</span>
        }
      </div>

      <!-- Results Dropdown -->
      @if (search.isOpen()) {
        <div id="global-search-results" role="listbox" aria-label="Search results"
             class="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 rounded-xl
                    shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden
                    animate-slide-down max-h-[26rem] overflow-y-auto">

          @if (groups().length === 0) {
            <div role="status" aria-live="polite" class="p-5 text-center">
              <p class="text-sm text-slate-500 dark:text-slate-400">No results for "<strong>{{ search.query() }}</strong>"</p>
              <a routerLink="/tools" (click)="search.close()"
                 class="inline-block mt-2 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                Browse all tools →
              </a>
            </div>
          }

          @for (group of groups(); track group.label) {
            <p class="px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">{{ group.label }}</p>
            @for (item of group.items; track item.id) {
              <a [routerLink]="item.route" (click)="select(item)" role="option" [attr.aria-selected]="indexOf(item) === activeIndex()"
                 [attr.aria-label]="item.title"
                 [class]="'flex items-center gap-3 px-4 py-3 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 ' +
                          (indexOf(item) === activeIndex() ? 'bg-slate-50 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800')"
                 (mouseenter)="activeIndex.set(indexOf(item))">
                <div [class]="'w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ' + (item.color ? 'bg-gradient-to-br ' + item.color : 'bg-slate-100 dark:bg-slate-800')" aria-hidden="true">
                  {{ item.icon }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-800 dark:text-white truncate" [innerHTML]="highlight(item.title)"></p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ item.description }}</p>
                </div>
                @if (item.badge) {
                  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex-shrink-0">{{ item.badge }}</span>
                }
                @if (item.outputFormat) {
                  <span class="text-xs text-slate-400 flex-shrink-0">{{ item.outputFormat }}</span>
                }
              </a>
            }
          }

          @if (displayList().length) {
            <div class="hidden sm:flex items-center gap-4 px-4 py-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
              <span class="inline-flex items-center gap-1"><kbd class="px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600">&#8593;</kbd><kbd class="px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600">&#8595;</kbd> navigate</span>
              <span class="inline-flex items-center gap-1"><kbd class="px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600">&#8629;</kbd> open</span>
              <span class="inline-flex items-center gap-1"><kbd class="px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600">Esc</kbd> close</span>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class GlobalSearchComponent {
  @ViewChild('container') container!: ElementRef;
  @ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;

  readonly activeIndex = signal(0);

  constructor(public search: SearchService, private router: Router) {}

  /** Grouped for display — "Recent"/"Popular" pre-query, "Tools"/"Pages" once typing. */
  readonly groups = computed<ResultGroup[]>(() => {
    if (!this.search.query()) {
      const recent = this.search.recentResults();
      const recentIds = new Set(recent.map(r => r.id));
      const popular = this.search.popularResults().filter(r => !recentIds.has(r.id));
      const out: ResultGroup[] = [];
      if (recent.length) out.push({ label: 'Recent', items: recent });
      if (popular.length) out.push({ label: 'Popular', items: popular });
      return out;
    }
    const out: ResultGroup[] = [];
    if (this.search.toolResults().length) out.push({ label: 'Tools', items: this.search.toolResults() });
    if (this.search.pageResults().length) out.push({ label: 'Pages', items: this.search.pageResults() });
    return out;
  });

  /** Flat order matching the grouped render above — the single source of
   *  truth for keyboard-index navigation. */
  readonly displayList = computed<SearchResult[]>(() => this.groups().flatMap(g => g.items));

  indexOf(item: SearchResult): number {
    return this.displayList().findIndex(r => r.id === item.id);
  }

  onQueryChange(value: string): void {
    this.search.setQuery(value);
    this.activeIndex.set(0);
  }

  select(item: SearchResult): void {
    this.search.recordSelection(item.id);
    this.search.close();
  }

  onKeydown(event: KeyboardEvent): void {
    const list = this.displayList();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (list.length) this.activeIndex.set((this.activeIndex() + 1) % list.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (list.length) this.activeIndex.set((this.activeIndex() - 1 + list.length) % list.length);
    } else if (event.key === 'Enter') {
      const active = list[this.activeIndex()];
      if (active) {
        event.preventDefault();
        this.select(active);
        this.router.navigateByUrl(active.route);
      }
    } else if (event.key === 'Escape') {
      this.search.close();
    }
  }

  highlight(title: string): string {
    const q = this.search.query().trim();
    if (!q) return this.escape(title);
    const idx = title.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return this.escape(title);
    const pre = this.escape(title.slice(0, idx));
    const match = this.escape(title.slice(idx, idx + q.length));
    const post = this.escape(title.slice(idx + q.length));
    return `${pre}<mark class="bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-sm">${match}</mark>${post}`;
  }

  private escape(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    if (this.container && !this.container.nativeElement.contains(e.target)) {
      this.search.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.search.close(); }

  focusInput(): void {
    this.searchInputRef?.nativeElement.focus();
  }
}
