import {
  Component,
  Input,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  inject,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window { adsbygoogle: unknown[]; }
}

// ─── HOW TO GET YOUR REAL SLOT IDs ──────────────────────────────────────────
// 1. Go to Google AdSense → Ads → By ad unit → Display ads
// 2. Create a unit named "Horizontal / Leaderboard" → choose "Horizontal" size → Save
//    Copy the slot ID (a 10-digit number like 1234567890) → paste as `horizontal`
// 3. Create a unit named "Rectangle" → choose "Rectangle" size → Save
//    Copy the slot ID → paste as `rectangle`
// 4. Create a unit named "Infeed" → choose "In-article" or "In-feed" → Save
//    Copy the slot ID → paste as `infeed`
// 5. Deploy the site and wait 24-48h for Google to verify and serve real ads.
// ─────────────────────────────────────────────────────────────────────────────
const AD_SLOTS = {
  horizontal: '7965745803',   // leaderboard / responsive banner
  rectangle:  '1121655375',    // 300×250 medium rectangle
  infeed:     '3747818718',        // in-article / in-feed
} as const;

export type AdSlot = keyof typeof AD_SLOTS;

@Component({
  selector: 'app-ad-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Skip Angular hydration — AdSense manipulates the <ins> DOM directly after
  // load, which conflicts with hydration's DOM reuse. Re-rendering from scratch
  // on the client lets AdSense take full ownership of the element.
  host: { ngSkipHydration: 'true' },
  template: `
    @if (!unfilled()) {
      <div class="ad-wrapper overflow-hidden text-center" [class]="wrapperClass">
        <ins #insEl class="adsbygoogle"
             style="display:block"
             [attr.data-ad-client]="adClient"
             [attr.data-ad-slot]="slotId"
             [attr.data-ad-format]="adFormat"
             data-full-width-responsive="true">
        </ins>
      </div>
    }
  `,
  styles: [`
    :host { display: block; min-height: 0; }
    .ad-wrapper { min-height: 0; }
  `],
})
export class AdBannerComponent implements AfterViewInit, OnDestroy {
  /** Which ad unit to show: 'horizontal' | 'rectangle' | 'infeed' */
  @Input() slot: AdSlot = 'horizontal';

  readonly adClient = 'ca-pub-6477809641944524';
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly host = inject(ElementRef<HTMLElement>);

  /** Set when AdSense marks this slot as unfilled — collapses the wrapper to avoid blank gaps. */
  readonly unfilled = signal(false);
  private observer?: MutationObserver;

  get slotId()      { return AD_SLOTS[this.slot]; }
  get adFormat()    { return this.slot === 'rectangle' ? 'rectangle' : 'auto'; }
  get wrapperClass(){ return this.slot === 'rectangle' ? 'rect py-2' : 'py-3'; }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const ins = this.host.nativeElement.querySelector('ins.adsbygoogle');
    if (ins) {
      this.observer = new MutationObserver(() => {
        if (ins.getAttribute('data-ad-status') === 'unfilled') {
          this.unfilled.set(true);
        }
      });
      this.observer.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });
    }
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch { /* AdSense not loaded yet — safe to ignore */ }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
