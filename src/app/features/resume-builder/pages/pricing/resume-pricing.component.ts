import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-resume-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">

      <!-- Hero -->
      <div class="container-app pt-16 pb-10 text-center">
        <span class="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/40 px-4 py-1.5 rounded-full mb-4">Simple Pricing</span>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
          Why Upgrade to Pro?
        </h1>
        <p class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
          The free plan is great for getting started. Pro unlocks the tools professionals use to stand out — premium templates, cover letters, portfolios, job tracking, and zero watermarks.
        </p>
      </div>

      <!-- Why Upgrade — value grid -->
      <div class="container-app pb-14 max-w-4xl mx-auto">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          @for (v of whyUpgrade; track v.title) {
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-center hover:border-violet-300 hover:shadow-md transition-all">
              <div class="text-3xl mb-2">{{ v.icon }}</div>
              <p class="font-bold text-slate-800 dark:text-white text-sm mb-1">{{ v.title }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ v.desc }}</p>
            </div>
          }
        </div>

        <!-- Plans: 2-col (Monthly + Yearly) with Free as light card -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto mb-16">

          <!-- Free -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col">
            <div class="mb-5">
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Free</p>
              <p class="text-4xl font-extrabold text-slate-800 dark:text-white">₹0</p>
              <p class="text-xs text-slate-400 mt-1">Forever free</p>
            </div>
            <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-300 flex-1 mb-6">
              @for (f of freeFeatures; track f.text) {
                <li class="flex items-start gap-2">
                  <span class="shrink-0 mt-0.5" [class]="f.included ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'">
                    {{ f.included ? '✓' : '✗' }}
                  </span>
                  <span [class]="f.included ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'">{{ f.text }}</span>
                </li>
              }
            </ul>
            <a routerLink="/resume-builder" class="block text-center py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              Start Free
            </a>
          </div>

          <!-- Monthly -->
          <div class="bg-white dark:bg-slate-900 border-2 border-violet-300 dark:border-violet-700 rounded-2xl p-6 flex flex-col">
            <div class="mb-5">
              <p class="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">Pro Monthly</p>
              <p class="text-4xl font-extrabold text-slate-800 dark:text-white">₹9 <span class="text-base font-normal text-slate-400">/mo</span></p>
              <p class="text-xs text-slate-400 mt-1">Cancel anytime</p>
            </div>
            <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-300 flex-1 mb-6">
              @for (f of proFeatureList; track f) {
                <li class="flex items-start gap-2">
                  <span class="text-emerald-500 shrink-0 mt-0.5">✓</span>
                  <span class="text-slate-700 dark:text-slate-200">{{ f }}</span>
                </li>
              }
            </ul>
            @if (auth.isPro() && auth.currentPlan() === 'monthly') {
              <div class="text-center py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-sm font-semibold">Current Plan ✓</div>
            } @else if (auth.isPro() && auth.currentPlan() === 'yearly') {
              <div class="text-center text-xs text-slate-400 py-2.5 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">🔒 You're on Yearly</div>
            } @else {
              <button class="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition"
                      [disabled]="loading() === 'monthly'" (click)="subscribe('monthly')">
                {{ loading() === 'monthly' ? 'Opening...' : 'Get Monthly Plan' }}
              </button>
            }
          </div>

          <!-- Yearly — visually dominant -->
          <div class="relative bg-gradient-to-b from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-900 border-2 border-amber-400 rounded-2xl p-6 flex flex-col shadow-xl shadow-amber-100/50 dark:shadow-amber-900/10">
            <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span class="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-extrabold px-4 py-1 rounded-full shadow-md tracking-wide">⭐ MOST POPULAR · BEST VALUE</span>
            </div>
            <div class="mb-5 mt-2">
              <p class="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Pro Yearly</p>
              <div class="flex items-baseline gap-2">
                <p class="text-4xl font-extrabold text-slate-800 dark:text-white">₹99 <span class="text-base font-normal text-slate-400">/yr</span></p>
                <span class="text-xs line-through text-slate-400">₹108</span>
              </div>
              <p class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Save ₹9 — 2 months free!</p>
            </div>
            <ul class="space-y-2 text-sm flex-1 mb-6">
              @for (f of yearlyOnlyFeatures; track f) {
                <li class="flex items-start gap-2">
                  <span class="text-emerald-500 shrink-0 mt-0.5">✓</span>
                  <span class="text-slate-700 dark:text-slate-200">{{ f }}</span>
                </li>
              }
            </ul>
            @if (auth.isPro() && auth.currentPlan() === 'yearly') {
              <div class="text-center py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold">Current Plan ✓</div>
            } @else if (auth.isPro() && auth.currentPlan() === 'monthly') {
              <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm transition shadow-md"
                      [disabled]="loading() === 'yearly'" (click)="subscribe('yearly')">
                {{ loading() === 'yearly' ? 'Opening...' : '⬆ Upgrade to Yearly — Save ₹9' }}
              </button>
            } @else {
              <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm transition shadow-md"
                      [disabled]="loading() === 'yearly'" (click)="subscribe('yearly')">
                {{ loading() === 'yearly' ? 'Opening...' : 'Get Yearly Plan — Best Value' }}
              </button>
            }
          </div>
        </div>

        <!-- Feature comparison table -->
        <div class="max-w-3xl mx-auto mb-16">
          <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white text-center mb-8">Free vs Pro — Full Comparison</h2>
          <div class="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
            <!-- Header -->
            <div class="grid grid-cols-3 text-sm font-bold text-center">
              <div class="bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-500 text-left">Feature</div>
              <div class="bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-500">Free</div>
              <div class="bg-gradient-to-b from-violet-600 to-indigo-700 px-4 py-3 text-white">Pro</div>
            </div>
            @for (row of comparisonTable; track row.label) {
              @if (row.section) {
                <div class="col-span-3 grid grid-cols-3">
                  <div class="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider col-span-3">{{ row.section }}</div>
                </div>
              } @else {
                <div class="grid grid-cols-3 text-sm border-t border-slate-100 dark:border-slate-800">
                  <div class="px-4 py-3 text-slate-700 dark:text-slate-200 font-medium">{{ row.label }}</div>
                  <div class="px-4 py-3 text-center" [class]="row.freeOk ? 'text-slate-600 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600'">{{ row.free }}</div>
                  <div class="px-4 py-3 text-center bg-violet-50/40 dark:bg-violet-900/10 font-semibold" [class]="row.proOk ? 'text-violet-700 dark:text-violet-300' : 'text-slate-400'">{{ row.pro }}</div>
                </div>
              }
            }
          </div>
        </div>

        <!-- FAQ -->
        <div class="max-w-2xl mx-auto">
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
      </div>
    </div>
  `,
})
export class ResumePricingComponent implements OnInit {
  readonly auth    = inject(AuthService);
  readonly subs    = inject(SubscriptionService);
  readonly router  = inject(Router);
  readonly loading = signal<'monthly' | 'yearly' | null>(null);

  async ngOnInit() {
    if (this.auth.isLoggedIn()) {
      await this.subs.getStatus();
    }
  }

  async subscribe(plan: 'monthly' | 'yearly') {
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

  readonly whyUpgrade = [
    { icon: '📄', title: 'Premium Templates', desc: '3 exclusive designs that pass every ATS scanner and impress recruiters' },
    { icon: '🚫', title: 'No Watermark', desc: 'Download clean, professional PDFs — no ApnaConverter branding' },
    { icon: '💌', title: 'Cover Letter', desc: 'Live cover letter builder tailored to each job you apply for' },
    { icon: '📋', title: 'Job Tracker', desc: 'Track every application, interview, and offer from one dashboard' },
  ];

  readonly freeFeatures = [
    { text: 'Resume Builder',                 included: true  },
    { text: '7 free templates',               included: true  },
    { text: 'Basic ATS score',                included: true  },
    { text: 'Up to 2 resumes',                included: true  },
    { text: 'PDF download (with watermark)',   included: true  },
    { text: 'Premium templates (3)',           included: false },
    { text: 'No watermark',                   included: false },
    { text: 'Cover Letter Builder',           included: false },
    { text: 'Portfolio Builder',              included: false },
    { text: 'Job Tracker',                    included: false },
  ];

  readonly proFeatureList = [
    'All 10 templates (3 premium unlocked)',
    'No watermark on any PDF',
    'Unlimited resumes & downloads',
    'Full ATS score + 4 sub-scores',
    'Cover Letter Builder',
    'Portfolio Builder',
    'Job Application Tracker',
    'Priority support',
  ];

  readonly yearlyOnlyFeatures = [
    'Everything in Monthly',
    'Early access to new templates',
    'Exclusive premium designs',
    'Resume performance analytics',
    'Premium email support',
    'All future Pro features',
  ];

  readonly comparisonTable: Array<{ label?: string; free?: string; pro?: string; section?: string; freeOk?: boolean; proOk?: boolean }> = [
    { section: 'Resume Builder' },
    { label: 'Free templates',          free: '7',            pro: 'All 10 ✓',      freeOk: true,  proOk: true  },
    { label: 'Premium templates',       free: '✗',            pro: '3 unlocked ✓',  freeOk: false, proOk: true  },
    { label: 'Number of resumes',       free: 'Up to 2',      pro: 'Unlimited ✓',   freeOk: true,  proOk: true  },
    { label: 'PDF watermark',           free: 'Yes',          pro: 'None ✓',        freeOk: false, proOk: true  },
    { label: 'PDF downloads',           free: '3/day',        pro: 'Unlimited ✓',   freeOk: true,  proOk: true  },
    { label: 'ATS score',               free: 'Basic',        pro: '4 sub-scores ✓',freeOk: true,  proOk: true  },
    { section: 'Career Tools' },
    { label: 'Cover Letter Builder',    free: '✗',            pro: '✓',             freeOk: false, proOk: true  },
    { label: 'Portfolio Builder',       free: '✗',            pro: '✓',             freeOk: false, proOk: true  },
    { label: 'Job Application Tracker', free: '✗',            pro: '✓',             freeOk: false, proOk: true  },
    { label: 'Biodata Maker',           free: 'Basic ✓',      pro: 'Full ✓',        freeOk: true,  proOk: true  },
    { section: 'Support & Access' },
    { label: 'Future premium features', free: '✗',            pro: 'Always ✓',      freeOk: false, proOk: true  },
    { label: 'Priority support',        free: '✗',            pro: '✓',             freeOk: false, proOk: true  },
  ];

  readonly faqs = [
    { q: 'Can I preview premium templates before upgrading?', a: 'Yes! You can click any premium template and see a live preview with your own resume data — completely free. You only need to upgrade when you want to download the PDF.' },
    { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your dashboard. You keep Pro access until the end of your current billing period — no sudden cutoffs.' },
    { q: 'Is my resume data safe?', a: 'Absolutely. Resume data is stored locally on your device. We only process it server-side when you click Download PDF, and never share it with third parties.' },
    { q: 'What payment methods are accepted?', a: 'UPI, credit/debit cards, net banking, and all major wallets via Razorpay — India\'s most trusted payment gateway.' },
    { q: 'Do I need to pay again for new templates?', a: 'No. Pro subscribers get instant, permanent access to all current and future templates — no extra charges, ever.' },
    { q: 'What\'s the difference between Monthly and Yearly?', a: 'Both plans include identical Pro features. Yearly saves you ₹9 (equivalent to 2 months free). Most users pick Yearly for the savings and uninterrupted access.' },
  ];
}
