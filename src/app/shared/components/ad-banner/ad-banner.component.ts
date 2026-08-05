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
type AdStatus = 'pending' | 'filled' | 'unfilled';

/** How long we show the loading skeleton before treating a still-pending slot as unfilled (avoids an indefinite reserved gap if AdSense never responds). */
const PENDING_TIMEOUT_MS = 4000;

@Component({
  selector: 'app-ad-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Skip Angular hydration - AdSense manipulates the <ins> DOM directly after
  // load, which conflicts with hydration's DOM reuse. Re-rendering from scratch
  // on the client lets AdSense take full ownership of the element.
  host: { ngSkipHydration: 'true' },
  template: `
    <div
      class="ad-wrapper overflow-hidden text-center"
      [class]="wrapperClass"
      [class.ad-hidden]="status() !== 'filled'"
    >
      <ins #insEl class="adsbygoogle"
           style="display:block"
           [attr.data-ad-client]="adClient"
           [attr.data-ad-slot]="slotId"
           [attr.data-ad-format]="adFormat"
           data-full-width-responsive="true">
      </ins>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 0; }
    .ad-wrapper {
      min-height: 0;
      max-height: 500px;
      opacity: 1;
      transition: opacity 250ms ease;
    }
    /* Nothing is reserved or shown until AdSense confirms a real creative filled
       this slot - no loading skeleton, no placeholder box, so there is never a
       "blank box that then disappears". It only ever goes from nothing to ad. */
    .ad-hidden {
      max-height: 0 !important;
      min-height: 0 !important;
      opacity: 0;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
    }
    @media (prefers-reduced-motion: reduce) {
      .ad-wrapper { transition: none; }
    }
  `],
})
export class AdBannerComponent implements AfterViewInit, OnDestroy {
  /** Which ad unit to show: 'horizontal' | 'rectangle' | 'infeed' */
  @Input() slot: AdSlot = 'horizontal';

  readonly adClient = 'ca-pub-6477809641944524';
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly host = inject(ElementRef<HTMLElement>);

  /** Loading -> filled (AdSense rendered a creative) or unfilled (collapse, no gap). */
  readonly status = signal<AdStatus>('pending');
  private observer?: MutationObserver;
  private pendingTimer?: ReturnType<typeof setTimeout>;

  get slotId()      { return AD_SLOTS[this.slot]; }
  get adFormat()    { return this.slot === 'rectangle' ? 'rectangle' : 'auto'; }
  get wrapperClass(){ return this.slot === 'rectangle' ? 'rect py-2' : 'py-3'; }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const ins = this.host.nativeElement.querySelector('ins.adsbygoogle');
    if (ins) {
      const readStatus = () => {
        const attr = ins.getAttribute('data-ad-status');
        if (attr === 'filled' || attr === 'unfilled') {
          this.status.set(attr);
          this.clearPendingTimer();
        }
      };
      this.observer = new MutationObserver(readStatus);
      this.observer.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });
      readStatus();
    }
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch { /* AdSense not loaded yet - safe to ignore */ }

    // If AdSense never resolves data-ad-status (blocked script, ad blocker, slow network),
    // don't leave the skeleton reserved forever - collapse it like an unfilled slot.
    this.pendingTimer = setTimeout(() => {
      if (this.status() === 'pending') this.status.set('unfilled');
    }, PENDING_TIMEOUT_MS);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.clearPendingTimer();
  }

  private clearPendingTimer(): void {
    if (this.pendingTimer) { clearTimeout(this.pendingTimer); this.pendingTimer = undefined; }
  }
}
