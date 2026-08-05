import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  avatarBg: string;
}

const AUTO_ADVANCE_MS = 6000;

@Component({
  selector: 'app-testimonials',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="lp-section bg-white dark:bg-slate-950">
      <div class="container-app">
        <div class="max-w-2xl mx-auto text-center mb-12">
          <p class="lp-eyebrow mb-3 justify-center">Testimonials</p>
          <h2 class="lp-heading mb-3">Trusted by job seekers across India</h2>
          <div class="flex items-center justify-center gap-1.5 text-sm" role="img" aria-label="4.8 out of 5 stars from 320+ reviews">
            <span class="text-amber-400" aria-hidden="true">★★★★★</span>
            <span class="text-slate-500 dark:text-slate-400">4.8/5 from 320+ reviews</span>
          </div>
        </div>

        <div class="relative max-w-2xl mx-auto">
          <div class="lp-card p-8 sm:p-10 text-center min-h-[220px] flex flex-col justify-center">
            <div class="flex justify-center gap-0.5 text-amber-400 mb-5" role="img" aria-label="5 stars">★★★★★</div>
            <p class="text-lg text-slate-700 dark:text-slate-200 leading-relaxed mb-6">"{{ active().quote }}"</p>
            <div class="flex items-center justify-center gap-3">
              <span class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" [class]="active().avatarBg">{{ active().initials }}</span>
              <span class="text-left">
                <span class="block text-sm font-bold text-slate-800 dark:text-white">{{ active().name }}</span>
                <span class="block text-xs text-slate-400">{{ active().role }}</span>
              </span>
            </div>
          </div>

          <button type="button" (click)="prev()" aria-label="Previous testimonial"
            class="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md items-center justify-center text-slate-500 dark:text-slate-300 hover:text-primary-600 transition-colors">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button type="button" (click)="next()" aria-label="Next testimonial"
            class="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md items-center justify-center text-slate-500 dark:text-slate-300 hover:text-primary-600 transition-colors">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>

          <div class="flex justify-center gap-2 mt-7">
            @for (t of testimonials; track t.name; let i = $index) {
              <button type="button" (click)="goTo(i)" [attr.aria-label]="'Show testimonial ' + (i + 1)" [attr.aria-current]="i === index()"
                class="h-1.5 rounded-full transition-all duration-slow"
                [class]="i === index() ? 'w-6 bg-primary-600' : 'w-1.5 bg-slate-200 dark:bg-slate-700'"></button>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private timer?: ReturnType<typeof setInterval>;

  readonly testimonials: Testimonial[] = [
    { quote: 'Got placed at Infosys after optimizing my resume with the ATS score. The templates are clean and professional!', name: 'Priya S.', role: 'Software Engineer, Mumbai', initials: 'PS', avatarBg: 'bg-primary-500' },
    { quote: 'The marriage biodata templates are beautiful. My family loved the quality of the PDF. Highly recommended!', name: 'Rahul M.', role: 'Chartered Accountant, Delhi', initials: 'RM', avatarBg: 'bg-rose-500' },
    { quote: 'Best resume builder for freshers. Completely free, no hidden charges. Got placed in TCS in my first attempt!', name: 'Ananya K.', role: 'Fresher, Bangalore', initials: 'AK', avatarBg: 'bg-emerald-600' },
  ];

  readonly index = signal(0);
  readonly active = signal(this.testimonials[0]);

  ngOnInit(): void {
    if (this.isBrowser) {
      this.timer = setInterval(() => this.next(), AUTO_ADVANCE_MS);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  goTo(i: number): void {
    this.index.set(i);
    this.active.set(this.testimonials[i]);
  }

  next(): void { this.goTo((this.index() + 1) % this.testimonials.length); }
  prev(): void { this.goTo((this.index() - 1 + this.testimonials.length) % this.testimonials.length); }
}
