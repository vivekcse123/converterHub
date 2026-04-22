import {
  Component,
  Input,
  AfterViewInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window { adsbygoogle: unknown[]; }
}

/**
 * Slot IDs from your AdSense dashboard (Ads → By ad unit → Create ad unit).
 * Replace each value with your real slot ID once you create the units.
 * Until then AdSense will serve house ads or nothing — this won't cause errors.
 */
const AD_SLOTS = {
  horizontal:  '1234567890',   // 728×90  leaderboard / responsive
  rectangle:   '0987654321',   // 300×250 medium rectangle
  infeed:      '1122334455',   // In-feed / native
} as const;

export type AdSlot = keyof typeof AD_SLOTS;

@Component({
  selector: 'app-ad-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ad-wrapper overflow-hidden text-center" [class]="wrapperClass">
      <ins class="adsbygoogle"
           style="display:block"
           [attr.data-ad-client]="adClient"
           [attr.data-ad-slot]="slotId"
           [attr.data-ad-format]="adFormat"
           data-full-width-responsive="true">
      </ins>
    </div>
  `,
  styles: [`
    .ad-wrapper { min-height: 90px; }
    .ad-wrapper.rect { min-height: 250px; }
  `],
})
export class AdBannerComponent implements AfterViewInit, OnDestroy {
  /** Which ad unit to show: 'horizontal' | 'rectangle' | 'infeed' */
  @Input() slot: AdSlot = 'horizontal';

  readonly adClient = 'ca-pub-6477809641944524';
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  get slotId()      { return AD_SLOTS[this.slot]; }
  get adFormat()    { return this.slot === 'rectangle' ? 'rectangle' : 'auto'; }
  get wrapperClass(){ return this.slot === 'rectangle' ? 'rect py-2' : 'py-3'; }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch { /* AdSense not loaded yet — safe to ignore */ }
  }

  ngOnDestroy(): void {}
}
