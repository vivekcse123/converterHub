import { Component, ChangeDetectionStrategy, ElementRef, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommandItem, CommandPaletteService } from '../../../core/services/command-palette.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (palette.isOpen()) {
      <div class="fixed inset-0 z-[9999] flex items-start justify-center pt-[12vh] px-4 bg-slate-900/40 backdrop-blur-sm" (click)="palette.close()">
        <div
          #panelEl
          class="w-full max-w-lg card-elevated overflow-hidden animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Command menu"
          (click)="$event.stopPropagation()"
          (keydown)="onKeydown($event)"
        >
          <div class="flex items-center gap-2.5 px-4 border-b border-border">
            <app-icon name="search" [size]="17" class="text-content-muted shrink-0" />
            <input
              #inputEl
              type="text"
              class="w-full bg-transparent border-0 py-3.5 text-sm text-content-primary placeholder-content-muted focus:outline-none"
              placeholder="Search or jump to..."
              [value]="palette.query()"
              (input)="onInput($event)"
              autocomplete="off"
              spellcheck="false"
            />
            <span class="dash-kbd shrink-0">Esc</span>
          </div>

          <div class="max-h-80 overflow-y-auto p-1.5">
            @if (results().length === 0) {
              <p class="text-sm text-content-muted text-center py-8">No matching commands</p>
            }
            @for (group of groups(); track group.name) {
              <p class="dash-nav-group-label !pt-2 !pb-1">{{ group.name }}</p>
              @for (item of group.items; track item.id) {
                <button
                  type="button"
                  [class]="'menu-item ' + (isActive(item) ? 'bg-elevated text-content-primary' : '')"
                  (mouseenter)="activeId.set(item.id)"
                  (click)="select(item)"
                >
                  <app-icon [name]="item.icon" [size]="16" class="shrink-0 text-content-muted" />
                  <span class="flex-1 text-left truncate">{{ item.label }}</span>
                  @if (item.description) {
                    <span class="text-xs text-content-muted truncate hidden sm:block">{{ item.description }}</span>
                  }
                </button>
              }
            }
          </div>

          <div class="flex items-center gap-4 px-4 py-2.5 border-t border-border text-xs text-content-muted">
            <span class="inline-flex items-center gap-1"><span class="dash-kbd">&#8593;</span><span class="dash-kbd">&#8595;</span> navigate</span>
            <span class="inline-flex items-center gap-1"><span class="dash-kbd">&#8629;</span> select</span>
          </div>
        </div>
      </div>
    }
  `,
})
export class CommandPaletteComponent {
  readonly palette = inject(CommandPaletteService);
  private readonly router = inject(Router);

  readonly activeId = signal<string | null>(null);

  @ViewChild('inputEl') private inputEl?: ElementRef<HTMLInputElement>;

  readonly results = computed(() => this.palette.results());

  readonly groups = computed(() => {
    const items = this.results();
    const byGroup = new Map<string, CommandItem[]>();
    for (const item of items) {
      if (!byGroup.has(item.group)) byGroup.set(item.group, []);
      byGroup.get(item.group)!.push(item);
    }
    return Array.from(byGroup, ([name, items]) => ({ name, items }));
  });

  constructor() {
    effect(() => {
      if (this.palette.isOpen()) {
        const first = this.results()[0];
        this.activeId.set(first?.id ?? null);
        queueMicrotask(() => this.inputEl?.nativeElement.focus());
      }
    }, { allowSignalWrites: true });
  }

  isActive(item: CommandItem): boolean {
    return this.activeId() === item.id;
  }

  onInput(event: Event): void {
    this.palette.setQuery((event.target as HTMLInputElement).value);
    const first = this.results()[0];
    this.activeId.set(first?.id ?? null);
  }

  select(item: CommandItem): void {
    this.router.navigateByUrl(item.route);
    this.palette.close();
  }

  onKeydown(event: KeyboardEvent): void {
    const flat = this.results();
    if (!flat.length) {
      if (event.key === 'Escape') this.palette.close();
      return;
    }
    const currentIndex = flat.findIndex((i) => i.id === this.activeId());

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeId.set(flat[(currentIndex + 1) % flat.length].id);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeId.set(flat[(currentIndex - 1 + flat.length) % flat.length].id);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const active = flat.find((i) => i.id === this.activeId());
      if (active) this.select(active);
    } else if (event.key === 'Escape') {
      this.palette.close();
    }
  }
}
