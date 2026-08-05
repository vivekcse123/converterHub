import { Component, ChangeDetectionStrategy, ElementRef, HostListener, inject, input, signal } from '@angular/core';

export type MenuAlign = 'left' | 'right';

/**
 * Lightweight dropdown shell. The trigger element is projected (with a
 * `trigger` attribute selector) and calls `toggle()` via a template
 * reference (`exportAs="appMenu"`) — the panel and trigger share one host
 * element so a single outside-click/Escape listener here handles both,
 * matching the click-outside pattern already used by the site header.
 */
@Component({
  selector: 'app-menu',
  standalone: true,
  exportAs: 'appMenu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative inline-block">
      <ng-content select="[trigger]" />
      @if (isOpen()) {
        <div
          class="absolute z-40 top-full mt-2 min-w-[14rem] card-elevated p-1.5 shadow-popover animate-fade-in"
          [class]="align() === 'right' ? 'right-0' : 'left-0'"
          role="menu"
        >
          <ng-content />
        </div>
      }
    </div>
  `,
})
export class MenuComponent {
  align = input<MenuAlign>('right');

  private readonly el = inject(ElementRef<HTMLElement>);
  readonly isOpen = signal(false);

  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  close(): void {
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && !this.el.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
