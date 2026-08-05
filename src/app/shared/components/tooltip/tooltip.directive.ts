import { Directive, ElementRef, HostListener, OnDestroy, Renderer2, inject, input } from '@angular/core';

/**
 * Minimal hover/focus tooltip — used mainly for icon-only controls (the
 * collapsed sidebar rail) where a visible text label isn't shown. Renders
 * into <body> via Renderer2 and positions with getBoundingClientRect;
 * no CDK Overlay dependency, matching this codebase's existing hand-rolled
 * positioning approach (see ModalComponent).
 */
@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  appTooltip = input<string>('', { alias: 'appTooltip' });

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private tooltipEl: HTMLElement | null = null;

  @HostListener('mouseenter')
  @HostListener('focus')
  show(): void {
    const text = this.appTooltip();
    if (!text || this.tooltipEl) return;

    const tip = this.renderer.createElement('span') as HTMLElement;
    this.renderer.appendChild(tip, this.renderer.createText(text));
    this.renderer.setAttribute(tip, 'role', 'tooltip');
    this.renderer.setStyle(tip, 'position', 'fixed');
    this.renderer.setStyle(tip, 'z-index', '9999');
    this.renderer.setStyle(tip, 'pointer-events', 'none');
    tip.className =
      'px-2 py-1 rounded-md text-xs font-medium text-white bg-slate-900 dark:bg-slate-700 shadow-popover animate-fade-in whitespace-nowrap';
    this.renderer.appendChild(document.body, tip);

    const rect = this.el.nativeElement.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    this.renderer.setStyle(tip, 'top', `${rect.top + rect.height / 2 - tipRect.height / 2}px`);
    this.renderer.setStyle(tip, 'left', `${rect.right + 8}px`);

    this.tooltipEl = tip;
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  hide(): void {
    if (this.tooltipEl) {
      this.renderer.removeChild(document.body, this.tooltipEl);
      this.tooltipEl = null;
    }
  }

  ngOnDestroy(): void {
    this.hide();
  }
}
