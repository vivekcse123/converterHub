import { AfterViewInit, Directive, ElementRef, HostBinding, Input, OnDestroy, inject, signal } from '@angular/core';

/**
 * Adds `.reveal-init`/`.reveal-visible` classes (see `styles.css`) driven by
 * IntersectionObserver — a real scroll-triggered reveal, not a CSS-only
 * animate-on-load fake. `appReveal` takes an optional stagger delay in ms so
 * a list of siblings can fade in one after another.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  @Input('appReveal') delayMs = 0;

  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private readonly visible = signal(false);

  @HostBinding('class.reveal-init') readonly initClass = true;
  @HostBinding('class.reveal-visible') get visibleClass(): boolean { return this.visible(); }
  @HostBinding('style.transition-delay.ms') get delay(): number { return this.delayMs; }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          this.visible.set(true);
          this.observer?.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
