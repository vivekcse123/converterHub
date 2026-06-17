import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
      <div class="container-app pt-16 pb-8 text-center">
        <span class="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/40 px-4 py-1.5 rounded-full mb-4">Pricing</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
          Build Resumes That <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Get You Hired</span>
        </h1>
        <p class="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-base">
          Start free. Upgrade when you're ready. No hidden fees — cancel anytime.
        </p>
      </div>

      <!-- Plans -->
      <div class="container-app pb-16">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">

          <!-- Free -->
          <div class="card p-6 flex flex-col">
            <div class="mb-5">
              <p class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Free</p>
              <p class="text-4xl font-extrabold text-slate-800 dark:text-white">₹0</p>
              <p class="text-xs text-slate-400 mt-1">Forever free</p>
            </div>
            <ul class="space-y-2.5 text-sm text-slate-600 dark:text-slate-300 flex-1 mb-6">
              @for (f of freeFeatures; track f.text) {
                <li class="flex items-start gap-2">
                  <span [class]="f.included ? 'text-emerald-500 mt-0.5' : 'text-slate-300 mt-0.5'">
                    {{ f.included ? '✓' : '✗' }}
                  </span>
                  <span [class]="f.included ? '' : 'text-slate-400'">{{ f.text }}</span>
                </li>
              }
            </ul>
            <a routerLink="/resume-builder" class="btn btn-secondary text-center text-sm w-full py-2.5">
              Start Free
            </a>
          </div>

          <!-- Monthly -->
          <div class="card p-6 flex flex-col border-violet-200 dark:border-violet-700">
            <div class="mb-5">
              <p class="text-sm font-semibold text-violet-600 dark:text-violet-400 mb-1">Pro Monthly</p>
              <p class="text-4xl font-extrabold text-slate-800 dark:text-white">₹9 <span class="text-lg font-normal text-slate-400">/mo</span></p>
              <p class="text-xs text-slate-400 mt-1">Billed monthly · cancel anytime</p>
            </div>
            <ul class="space-y-2.5 text-sm text-slate-600 dark:text-slate-300 flex-1 mb-6">
              @for (f of monthlyFeatures; track f) {
                <li class="flex items-start gap-2">
                  <span class="text-emerald-500 mt-0.5">✓</span> {{ f }}
                </li>
              }
            </ul>
            @if (auth.isPro() && auth.currentPlan() === 'monthly') {
              <div class="btn btn-secondary text-center text-sm w-full py-2.5 opacity-60 cursor-default">Current Plan</div>
            } @else {
              <button class="btn btn-primary text-sm w-full py-2.5"
                      [disabled]="loading() === 'monthly'"
                      (click)="subscribe('monthly')">
                {{ loading() === 'monthly' ? 'Opening...' : 'Upgrade Now' }}
              </button>
            }
          </div>

          <!-- Yearly (highlighted) -->
          <div class="relative card p-6 flex flex-col border-2 border-violet-500 bg-gradient-to-b from-violet-50/50 to-white dark:from-violet-900/20 dark:to-slate-900 shadow-xl shadow-violet-100 dark:shadow-violet-900/20">
            <div class="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span class="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-md whitespace-nowrap">🏆 MOST POPULAR</span>
            </div>
            <div class="mb-5 mt-2">
              <p class="text-sm font-semibold text-violet-600 dark:text-violet-400 mb-1">Pro Yearly</p>
              <p class="text-4xl font-extrabold text-slate-800 dark:text-white">₹99 <span class="text-lg font-normal text-slate-400">/yr</span></p>
              <p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Save ₹9 vs monthly billing</p>
            </div>
            <ul class="space-y-2.5 text-sm text-slate-600 dark:text-slate-300 flex-1 mb-6">
              @for (f of yearlyFeatures; track f) {
                <li class="flex items-start gap-2">
                  <span class="text-emerald-500 mt-0.5">✓</span> {{ f }}
                </li>
              }
            </ul>
            @if (auth.isPro() && auth.currentPlan() === 'yearly') {
              <div class="text-center text-sm w-full py-2.5 rounded-lg bg-emerald-100 text-emerald-700 font-semibold">Current Plan ✓</div>
            } @else {
              <button class="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold transition text-sm shadow-md"
                      [disabled]="loading() === 'yearly'"
                      (click)="subscribe('yearly')">
                {{ loading() === 'yearly' ? 'Opening...' : 'Get Yearly Plan' }}
              </button>
            }
          </div>

        </div>

        <!-- FAQ -->
        <div class="max-w-2xl mx-auto mt-16">
          <h2 class="text-xl font-bold text-center text-slate-800 dark:text-white mb-8">Frequently Asked Questions</h2>
          <div class="space-y-4">
            @for (faq of faqs; track faq.q) {
              <div class="card p-4">
                <p class="font-semibold text-slate-800 dark:text-white text-sm mb-1">{{ faq.q }}</p>
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ faq.a }}</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ResumePricingComponent {
  readonly auth    = inject(AuthService);
  readonly subs    = inject(SubscriptionService);
  readonly router  = inject(Router);
  readonly loading = signal<'monthly' | 'yearly' | null>(null);

  async subscribe(plan: 'monthly' | 'yearly') {
    if (!this.auth.isLoggedIn()) {
      sessionStorage.setItem('pendingUpgrade', plan);
      this.router.navigate(['/auth/login']);
      return;
    }
    this.loading.set(plan);
    const ok = await this.subs.subscribe(plan);
    this.loading.set(null);
    if (ok) this.router.navigate(['/resume-builder']);
  }

  readonly freeFeatures = [
    { text: 'Up to 2 resumes', included: true },
    { text: '8 free templates', included: true },
    { text: 'Basic ATS score', included: true },
    { text: 'PDF download with watermark', included: true },
    { text: 'Premium templates', included: false },
    { text: 'No watermark', included: false },
    { text: 'Unlimited resumes', included: false },
    { text: 'AI suggestions', included: false },
  ];

  readonly monthlyFeatures = [
    'All 10 premium templates',
    'No watermark on PDFs',
    'Unlimited resumes',
    'Unlimited PDF downloads',
    'Full ATS score checker',
    'Resume analytics',
    'Priority support',
    'AI suggestions (coming soon)',
  ];

  readonly yearlyFeatures = [
    'Everything in Monthly',
    'Early access to new templates',
    'Exclusive premium designs',
    'Cover letter generator (soon)',
    'Resume performance insights',
    'Premium email support',
  ];

  readonly faqs = [
    { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your dashboard. You keep access until the end of your billing period.' },
    { q: 'Is my data safe?', a: 'Absolutely. Resumes are stored locally on your device. We never share your data.' },
    { q: 'What payment methods are accepted?', a: 'UPI, credit/debit cards, net banking, and all major wallets via Razorpay.' },
    { q: 'Will my subscription auto-renew?', a: 'Yes, subscriptions auto-renew. You\'ll get an email reminder before each renewal.' },
    { q: 'Do I need to pay again for new templates?', a: 'No. Pro subscribers get instant access to all current and future templates.' },
  ];
}
