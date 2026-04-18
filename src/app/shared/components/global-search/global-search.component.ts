import { Component, ElementRef, HostListener, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../../core/services/search.service';

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
          type="search"
          [ngModel]="search.query()"
          (ngModelChange)="search.setQuery($event)"
          (focus)="search.open()"
          placeholder="Search tools…"
          autocomplete="off"
          class="w-full pl-9 pr-8 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700
                 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white
                 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500
                 transition-all duration-200"
        />
        @if (search.query()) {
          <button (click)="search.clear(); searchInput.focus()"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        }
      </div>

      <!-- Results Dropdown -->
      @if (search.isOpen() && search.results().length > 0) {
        <div class="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 rounded-xl
                    shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden
                    animate-slide-down">
          @for (tool of search.results(); track tool.id) {
            <a [routerLink]="tool.route" (click)="search.close()"
               class="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800
                      transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
              <div [class]="'w-8 h-8 rounded-lg bg-gradient-to-br ' + tool.color +
                            ' flex items-center justify-center text-sm flex-shrink-0'">
                {{ tool.icon }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-slate-800 dark:text-white truncate">{{ tool.title }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ tool.description }}</p>
              </div>
              <span class="text-xs text-slate-400 flex-shrink-0">{{ tool.outputFormat }}</span>
            </a>
          }
        </div>
      }

      @if (search.isOpen() && search.query() && search.results().length === 0) {
        <div class="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 rounded-xl
                    shadow-xl border border-slate-200 dark:border-slate-700 z-50 p-4 text-center
                    animate-slide-down">
          <p class="text-sm text-slate-500 dark:text-slate-400">No tools found for "<strong>{{ search.query() }}</strong>"</p>
        </div>
      }
    </div>
  `,
})
export class GlobalSearchComponent {
  @ViewChild('container') container!: ElementRef;

  constructor(public search: SearchService) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    if (this.container && !this.container.nativeElement.contains(e.target)) {
      this.search.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.search.close(); }
}
