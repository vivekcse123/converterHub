import { Component, ChangeDetectionStrategy, ElementRef, HostListener, inject, output, signal } from '@angular/core';
import { ADDABLE_SECTION_TYPES, PortfolioSectionType, SECTION_ICONS, SECTION_LABELS } from '../../models/portfolio.model';

@Component({
  selector: 'app-add-block-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative block' },
  template: `
    <button type="button" (click)="toggle()"
      class="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700
             text-sm font-semibold text-slate-400 dark:text-slate-500 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>
      Add section
    </button>

    @if (open()) {
      <div class="absolute z-30 left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl border border-slate-200 dark:border-slate-700
                  bg-white dark:bg-slate-800 shadow-popover p-3 animate-fade-in">
        <div class="grid grid-cols-2 gap-1.5">
          @for (t of addableTypes; track t) {
            <button type="button" (click)="pick(t)"
              class="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/60 text-left transition-colors">
              <span class="text-base">{{ icons[t] }}</span>
              <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">{{ labels[t] }}</span>
            </button>
          }
        </div>
      </div>
    }
  `,
})
export class AddBlockMenuComponent {
  add = output<PortfolioSectionType>();

  private el = inject(ElementRef);
  readonly open = signal(false);
  readonly addableTypes = ADDABLE_SECTION_TYPES;
  readonly icons = SECTION_ICONS;
  readonly labels = SECTION_LABELS;

  toggle(): void { this.open.set(!this.open()); }

  pick(type: PortfolioSectionType): void {
    this.add.emit(type);
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (this.open() && !this.el.nativeElement.contains(e.target)) this.open.set(false);
  }
}
