import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PLAN_PRICES, FEATURE_TABLE, FREE_PLAN_BULLETS, PRO_FULL_LIST, YEARLY_EXTRA } from '../../data/plan-features';

@Component({
  selector: 'app-resume-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">

      <!-- Hero -->
      <div class="container-app pt-14 pb-12 text-center max-w-3xl mx-auto">
        <span class="inline-block text-[11px] font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/40 px-4 py-1.5 rounded-full mb-5">India's Complete Career Platform</span>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 leading-tight">
          More Features.<br>Cheaper Than Every Competitor.
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-base sm:text-lg leading-relaxed mb-6">
          Resume builder · Cover letters · Portfolio · Job tracker · AI assistant · Premium templates - the full platform for less than the price of a coffee.
        </p>
        <!-- Competitor comparison banner -->
        <div class="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-semibold">
          <span class="text-emerald-700 dark:text-emerald-300">ApnaConverter Pro <strong>₹99/mo</strong></span>
          <span class="text-slate-300 dark:text-slate-600">vs</span>
          <span class="text-slate-400 line-through">Other platforms: ₹500/mo</span>
          <span class="text-slate-400 line-through">to ₹1,333/mo</span>
        </div>
      </div>

      <div class="container-app pb-14 max-w-5xl mx-auto">

        <!-- Why upgrade - 4 value cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          @for (v of whyCards; track v.title) {
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-center hover:border-primary-300 hover:shadow-md transition-all">
              <div class="w-10 h-10 mx-auto mb-2.5 text-primary-500 dark:text-primary-400" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-full h-full">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" [attr.d]="v.svgPath"/>
                </svg>
              </div>
              <p class="font-bold text-slate-800 dark:text-white text-sm mb-1.5 leading-tight">{{ v.title }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ v.desc }}</p>
            </div>
          }
        </div>

        <!-- Plans grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">

          <!-- Free -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col">
            <div class="mb-5">
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Free</p>
              <p class="text-3xl font-extrabold text-slate-800 dark:text-white">₹0</p>
              <p class="text-xs text-slate-400 mt-1">Forever free · No card needed</p>
            </div>
            <ul class="space-y-1.5 text-xs flex-1 mb-5">
              @for (f of freeBullets; track f.text) {
                <li class="flex items-center gap-1.5">
                  <span [class]="f.ok ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'" aria-hidden="true">{{ f.ok ? '✓' : '✗' }}</span>
                  <span [class]="f.ok ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'">{{ f.text }}</span>
                </li>
              }
            </ul>
            <a routerLink="/resume-builder" class="block text-center py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              Start Free
            </a>
          </div>

          <!-- Monthly -->
          <div class="bg-white dark:bg-slate-900 border-2 rounded-2xl p-5 flex flex-col"
               [class]="(auth.isPro() && auth.currentPlan() === 'monthly') ? 'border-emerald-400' : 'border-primary-300 dark:border-primary-700'">
            <div class="mb-5">
              <p class="text-[11px] font-bold uppercase tracking-widest mb-1"
                 [class]="(auth.isPro() && auth.currentPlan() === 'monthly') ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary-600 dark:text-primary-400'">Monthly</p>
              <p class="text-3xl font-extrabold text-slate-800 dark:text-white">{{ prices.monthly.display }} <span class="text-sm font-normal text-slate-400">{{ prices.monthly.period }}</span></p>
              <p class="text-xs text-slate-400 mt-1">{{ prices.monthly.tagline }}</p>
            </div>
            <ul class="space-y-1.5 text-xs flex-1 mb-5">
              @for (f of proList; track f) {
                <li class="flex items-start gap-1.5">
                  <span class="text-emerald-500 shrink-0 mt-0.5" aria-hidden="true">✓</span>
                  <span class="text-slate-700 dark:text-slate-200">{{ f }}</span>
                </li>
              }
            </ul>
            @if (auth.isPro() && auth.currentPlan() === 'monthly') {
              <div class="text-center text-xs py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">Current Plan ✓</div>
            } @else if (auth.currentPlan() === 'yearly' || auth.currentPlan() === 'lifetime') {
              <div class="text-center text-xs py-2.5 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-400 flex items-center justify-center gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                Higher plan active
              </div>
            } @else {
              <button class="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs transition"
                      [disabled]="loading() === 'monthly'" (click)="subscribe('monthly')">
                {{ loading() === 'monthly' ? 'Opening...' : 'Get Monthly Plan' }}
              </button>
            }
          </div>

          <!-- Yearly (most popular) -->
          <div class="relative bg-gradient-to-b from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-900 border-2 border-amber-400 rounded-2xl p-5 flex flex-col shadow-xl shadow-amber-100/50 dark:shadow-amber-900/10">
            <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span class="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow tracking-wide">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                MOST POPULAR
              </span>
            </div>
            <div class="mb-5 mt-2">
              <p class="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">Yearly</p>
              <div class="flex items-baseline gap-2">
                <p class="text-3xl font-extrabold text-slate-800 dark:text-white">{{ prices.yearly.display }} <span class="text-sm font-normal text-slate-400">{{ prices.yearly.period }}</span></p>
                <span class="text-xs line-through text-slate-400">{{ prices.yearly.regularPrice }}</span>
              </div>
              <p class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">{{ prices.yearly.tagline }}</p>
              <p class="text-xs text-slate-400">{{ prices.yearly.monthlyEquiv }} · Save {{ prices.yearly.savingsPct }}</p>
            </div>
            <ul class="space-y-1.5 text-xs flex-1 mb-5">
              @for (f of yearlyExtra; track f) {
                <li class="flex items-start gap-1.5">
                  <span class="text-emerald-500 shrink-0 mt-0.5" aria-hidden="true">✓</span>
                  <span class="text-slate-700 dark:text-slate-200">{{ f }}</span>
                </li>
              }
            </ul>
            @if (auth.currentPlan() === 'yearly') {
              <div class="text-center text-xs py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold">Current Plan ✓</div>
            } @else if (auth.currentPlan() === 'lifetime') {
              <div class="text-center text-xs py-2.5 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-400 flex items-center justify-center gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                Lifetime plan active
              </div>
            } @else if (auth.currentPlan() === 'monthly') {
              <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs transition shadow"
                      [disabled]="loading() === 'yearly'" (click)="subscribe('yearly')">
                {{ loading() === 'yearly' ? 'Opening...' : 'Upgrade to Yearly — Save ₹489' }}
              </button>
            } @else {
              <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs transition shadow"
                      [disabled]="loading() === 'yearly'" (click)="subscribe('yearly')">
                {{ loading() === 'yearly' ? 'Opening...' : 'Get Yearly - Best Value' }}
              </button>
            }
          </div>

          <!-- Lifetime -->
          <div class="relative bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-600 rounded-2xl p-5 flex flex-col text-white shadow-xl">
            <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span class="inline-flex items-center gap-1 bg-slate-700 text-slate-200 text-[10px] font-extrabold px-3 py-1 rounded-full shadow tracking-wide">
                <svg class="w-3 h-3 text-orange-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/></svg>
                LIFETIME DEAL
              </span>
            </div>
            <div class="mb-5 mt-2">
              <p class="text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-1">Lifetime</p>
              <p class="text-3xl font-extrabold text-white">{{ prices.lifetime.display }} <span class="text-sm font-normal text-slate-400">{{ prices.lifetime.period }}</span></p>
              <p class="text-xs text-emerald-400 font-semibold mt-1">{{ prices.lifetime.tagline }}</p>
              <p class="text-xs text-slate-400">{{ prices.lifetime.equiv }}</p>
            </div>
            <ul class="space-y-1.5 text-xs flex-1 mb-5">
              <li class="flex items-start gap-1.5"><span class="text-emerald-400 shrink-0 mt-0.5" aria-hidden="true">✓</span><span class="text-slate-200">Everything in Yearly</span></li>
              <li class="flex items-start gap-1.5"><span class="text-emerald-400 shrink-0 mt-0.5" aria-hidden="true">✓</span><span class="text-slate-200">Pay once, no renewals ever</span></li>
              <li class="flex items-start gap-1.5"><span class="text-emerald-400 shrink-0 mt-0.5" aria-hidden="true">✓</span><span class="text-slate-200">All future Pro features free</span></li>
              <li class="flex items-start gap-1.5"><span class="text-emerald-400 shrink-0 mt-0.5" aria-hidden="true">✓</span><span class="text-slate-200">VIP priority support</span></li>
              <li class="flex items-start gap-1.5"><span class="text-emerald-400 shrink-0 mt-0.5" aria-hidden="true">✓</span><span class="text-slate-200">Best lifetime value in India</span></li>
            </ul>
            @if (auth.isPro() && auth.currentPlan() === 'lifetime') {
              <div class="text-center text-xs py-2.5 rounded-xl bg-emerald-900/30 text-emerald-400 font-semibold">Current Plan ✓</div>
            } @else {
              <button class="w-full py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition shadow"
                      [disabled]="loading() === 'lifetime'" (click)="subscribe('lifetime')">
                {{ loading() === 'lifetime' ? 'Opening...' : 'Get Lifetime Access' }}
              </button>
            }
          </div>

        </div>

        <!-- Competitor comparison table -->
        <div class="max-w-3xl mx-auto mb-14">
          <h2 class="text-lg font-extrabold text-slate-900 dark:text-white text-center mb-6">How We Compare to Other Resume Platforms</h2>
          <div class="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm text-xs">
            <div class="grid grid-cols-5 font-bold text-center bg-slate-50 dark:bg-slate-800">
              <div class="px-3 py-3 text-slate-500 text-left">Feature</div>
              <div class="px-2 py-3 bg-gradient-to-b from-violet-600 to-indigo-700 text-white">ApnaConverter <br><span class="font-normal text-violet-200">₹99/mo</span></div>
              <div class="px-2 py-3 text-slate-400">Platform A<br><span class="font-normal text-slate-300">₹500/mo</span></div>
              <div class="px-2 py-3 text-slate-400">Platform B<br><span class="font-normal text-slate-300">₹660/mo</span></div>
              <div class="px-2 py-3 text-slate-400">Platform C<br><span class="font-normal text-slate-300">₹1,333/mo</span></div>
            </div>
            @for (row of competitorTable; track row.feature) {
              <div class="grid grid-cols-5 border-t border-slate-100 dark:border-slate-800 text-center">
                <div class="px-3 py-2.5 text-left text-slate-700 dark:text-slate-200 font-medium">{{ row.feature }}</div>
                <div class="px-2 py-2.5 bg-primary-50/40 dark:bg-primary-900/10 font-semibold text-primary-700 dark:text-primary-300">{{ row.us }}</div>
                <div class="px-2 py-2.5 text-slate-400">{{ row.a }}</div>
                <div class="px-2 py-2.5 text-slate-400">{{ row.b }}</div>
                <div class="px-2 py-2.5 text-slate-400">{{ row.c }}</div>
              </div>
            }
          </div>
          <p class="text-xs text-slate-400 text-center mt-3">* Competitor prices are approximate, converted at ₹83/USD. Data based on publicly listed plans.</p>
        </div>

        <!-- Full feature comparison -->
        <div class="max-w-3xl mx-auto mb-14">
          <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white text-center mb-2">Free vs Pro - Full Comparison</h2>
          <p class="text-center text-sm text-slate-400 mb-8">Every listed feature is live and fully implemented - no fake checkmarks.</p>
          <div class="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="grid grid-cols-3 text-xs font-bold text-center">
              <div class="bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-500 text-left">Feature</div>
              <div class="bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-500">Free</div>
              <div class="bg-gradient-to-b from-violet-600 to-indigo-700 px-4 py-3 text-white">Pro</div>
            </div>
            @for (row of featureTable; track $index) {
              @if (row.section) {
                <div class="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider col-span-3 border-t border-slate-200 dark:border-slate-700">{{ row.section }}</div>
              } @else {
                <div class="grid grid-cols-3 text-xs border-t border-slate-100 dark:border-slate-800">
                  <div class="px-4 py-3 text-slate-700 dark:text-slate-200 font-medium">{{ row.label }}</div>
                  <div class="px-4 py-3 text-center" [class]="row.freeOk ? 'text-slate-600 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600'">{{ row.freeVal }}</div>
                  <div class="px-4 py-3 text-center bg-primary-50/40 dark:bg-primary-900/10 font-semibold" [class]="row.proOk ? 'text-primary-700 dark:text-primary-300' : 'text-slate-400'">{{ row.proVal }}</div>
                </div>
              }
            }
          </div>
        </div>

        <!-- FAQ -->
        <div class="max-w-2xl mx-auto mb-14">
          <h2 class="text-xl font-bold text-center text-slate-800 dark:text-white mb-8">Frequently Asked Questions</h2>
          <div class="space-y-3">
            @for (faq of faqs; track faq.q) {
              <details class="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <summary class="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-slate-800 dark:text-white text-sm list-none select-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  {{ faq.q }}
                  <span class="text-slate-400 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-3 text-xs">▼</span>
                </summary>
                <div class="px-5 pb-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">{{ faq.a }}</div>
              </details>
            }
          </div>
        </div>

        <!-- Final CTA -->
        <div class="max-w-2xl mx-auto text-center bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-10 text-white">
          <div class="w-14 h-14 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center" aria-hidden="true">
            <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h2 class="text-2xl font-extrabold mb-3">Start Your Career Journey Today</h2>
          <p class="text-violet-200 mb-2 text-sm">Complete career platform · ₹99/month · Cheaper than every competitor</p>
          <p class="text-violet-300 mb-8 text-xs">10,000+ students & professionals already using ApnaConverter</p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button class="px-7 py-3 rounded-xl bg-white text-primary-700 font-bold text-sm hover:bg-primary-50 transition shadow-lg"
                    (click)="subscribe('yearly')">
              Get Pro Yearly — ₹699/yr
            </button>
            <a routerLink="/resume-builder" class="px-7 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition">
              Start Free →
            </a>
          </div>
        </div>

      </div>
    </div>
  `,
})
export class ResumePricingComponent implements OnInit {
  readonly auth    = inject(AuthService);
  readonly subs    = inject(SubscriptionService);
  readonly router  = inject(Router);
  readonly loading = signal<'monthly' | 'yearly' | 'lifetime' | null>(null);

  readonly prices       = PLAN_PRICES;
  readonly freeBullets  = FREE_PLAN_BULLETS;
  readonly proList      = PRO_FULL_LIST;
  readonly yearlyExtra  = YEARLY_EXTRA;
  readonly featureTable = FEATURE_TABLE;

  async ngOnInit() {
    if (this.auth.isLoggedIn()) await this.subs.getStatus();
  }

  async subscribe(plan: 'monthly' | 'yearly' | 'lifetime') {
    if (!this.auth.isLoggedIn()) {
      sessionStorage.setItem('pendingUpgrade', plan);
      this.router.navigate(['/login']);
      return;
    }
    this.loading.set(plan);
    const ok = await this.subs.subscribe(plan);
    this.loading.set(null);
    if (ok) this.router.navigate(['/resume-builder']);
  }

  readonly whyCards = [
    { svgPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Cheapest in India',    desc: '₹99/mo vs ₹500–₹1,333 charged by international platforms. Same or better features.' },
    { svgPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2', title: 'AI Writing Assistant', desc: 'Rewrite bullets, generate summaries, surface recruiter keywords - built right in.' },
    { svgPath: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636', title: 'Zero Watermark',        desc: 'Download clean PDFs every time. No ApnaConverter branding. Professional output.' },
    { svgPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', title: '6 Career Tools',        desc: 'Resume · Cover Letter · Portfolio · Job Tracker · Biodata · File Converter in one plan.' },
  ];

  readonly competitorTable = [
    { feature: 'Monthly price',         us: '₹99',    a: '₹500',  b: '₹660', c: '₹1,333' },
    { feature: 'Resume Builder',        us: '✓',       a: '✓',     b: '✓',    c: '✓'      },
    { feature: 'Cover Letter Builder',  us: '✓',       a: '✓',     b: '✓',    c: '✓'      },
    { feature: 'Portfolio Builder',     us: '✓',       a: '✗',     b: '✗',    c: '✗'      },
    { feature: 'Job Tracker',           us: '✓',       a: '✗',     b: '✗',    c: '✗'      },
    { feature: 'AI Writing Assistant',  us: '✓',       a: '✓',     b: '✓',    c: '✓'      },
    { feature: 'ATS Score Checker',     us: '✓',       a: '✗',     b: '✗',    c: '✓'      },
    { feature: 'Lifetime Plan',         us: '✓',       a: '✗',     b: '✗',    c: '✗'      },
    { feature: 'Biodata Maker',         us: '✓',       a: '✗',     b: '✗',    c: '✗'      },
    { feature: 'File Converters',       us: '✓ 40+',   a: '✗',     b: '✗',    c: '✗'      },
    { feature: 'No watermark (free)',   us: '✗',       a: '✗',     b: '✗',    c: '✗'      },
    { feature: 'No watermark (Pro)',    us: '✓',       a: '✓',     b: '✓',    c: '✓'      },
  ];

  readonly faqs = [
    { q: 'How is ₹99/mo possible when competitors charge ₹500-1,333/mo?', a: 'ApnaConverter is built in India, for India. We keep infrastructure lean and pass the savings directly to users. Our goal is to make premium career tools accessible to every student and professional - not just those who can afford international prices.' },
    { q: 'Can I preview premium templates before upgrading?', a: 'Yes - click any template and see a live preview with your own resume data. You only need to upgrade to download the watermark-free PDF.' },
    { q: 'What is the Lifetime plan?', a: 'Pay ₹1,499 once and get Pro access forever - no renewals, no annual charges. Break-even at just 15 months of Monthly. Ideal for long-term career management.' },
    { q: "Monthly vs Yearly - what's different?", a: "Identical Pro features. Yearly costs ₹58/mo vs ₹99/mo - saving ₹489 (41%). Most users pick Yearly for the savings." },
    { q: 'Can I cancel anytime?', a: 'Yes - cancel from your dashboard at any time. You keep Pro access until your billing period ends. No questions asked.' },
    { q: 'What payment methods are accepted?', a: 'UPI, credit/debit cards, net banking, and all major wallets via Razorpay - India\'s most trusted payment gateway.' },
    { q: 'Do I get new templates automatically?', a: 'Yes. Pro subscribers instantly get every new template we release - no extra charges, ever.' },
    { q: 'Is there a student discount?', a: 'The pricing is already student-friendly at ₹99/mo. If you need a further discount, contact us at support@apnaconverter.com.' },
  ];
}
