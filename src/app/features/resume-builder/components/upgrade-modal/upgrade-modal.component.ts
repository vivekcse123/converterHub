import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-upgrade-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm" (click)="close.emit()">
      <div class="flex min-h-full items-center justify-center p-4 py-6">
      <div class="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden" (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-5 text-white">
          <button class="absolute top-4 right-4 text-white/70 hover:text-white transition" (click)="close.emit()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <div class="flex items-center gap-3 mb-1">
            <span class="text-2xl">⭐</span>
            <h2 class="text-xl font-bold">Upgrade to ApnaConverter Pro</h2>
          </div>
          <p class="text-white/80 text-sm">Unlock all premium templates, cover letter builder, no watermark, unlimited downloads</p>
        </div>

        <!-- Plans -->
        <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

          <!-- Monthly -->
          <div class="border-2 rounded-xl p-5 transition cursor-pointer"
               [class]="auth.currentPlan() === 'yearly' ? 'border-slate-200 dark:border-slate-700 opacity-60' :
                        (hoveredPlan() === 'monthly' ? 'border-violet-400 ring-2 ring-violet-300' : 'border-slate-200 dark:border-slate-700 hover:border-violet-400')"
               (mouseenter)="hoveredPlan.set('monthly')" (mouseleave)="hoveredPlan.set(null)">
            <div class="flex items-start justify-between mb-3">
              <div>
                <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Monthly</p>
                <p class="text-3xl font-bold text-slate-800 dark:text-white mt-1">₹9 <span class="text-base font-normal text-slate-400">/mo</span></p>
              </div>
              <span class="text-2xl">📅</span>
            </div>
            <ul class="space-y-1.5 text-sm text-slate-600 dark:text-slate-300 mb-4">
              @for (f of monthlyFeatures; track f) {
                <li class="flex items-center gap-2"><span class="text-emerald-500">✓</span> {{ f }}</li>
              }
            </ul>
            @if (auth.currentPlan() === 'monthly') {
              <div class="text-center text-sm py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 font-medium">Current Plan ✓</div>
            } @else if (auth.currentPlan() === 'yearly') {
              <div class="text-center text-xs py-2.5 text-slate-400">🔒 Not available on Yearly</div>
            } @else {
              <button class="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold transition text-sm"
                      [disabled]="loading()"
                      (click)="subscribe('monthly')">
                {{ loading() === 'monthly' ? 'Opening...' : 'Start Monthly Plan' }}
              </button>
            }
          </div>

          <!-- Yearly (highlighted) -->
          <div class="border-2 border-violet-500 rounded-xl p-5 bg-gradient-to-b from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 relative cursor-pointer">
            <div class="absolute -top-3 left-1/2 -translate-x-1/2">
              <span class="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">🏆 BEST VALUE</span>
            </div>
            <div class="flex items-start justify-between mb-3 mt-1">
              <div>
                <p class="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">Yearly</p>
                <p class="text-3xl font-bold text-slate-800 dark:text-white mt-1">₹99 <span class="text-base font-normal text-slate-400">/yr</span></p>
                <p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Save ₹9 vs monthly</p>
              </div>
              <span class="text-2xl">🎯</span>
            </div>
            <ul class="space-y-1.5 text-sm text-slate-600 dark:text-slate-300 mb-4">
              @for (f of yearlyFeatures; track f) {
                <li class="flex items-center gap-2"><span class="text-emerald-500">✓</span> {{ f }}</li>
              }
            </ul>
            @if (auth.currentPlan() === 'yearly') {
              <div class="text-center text-sm py-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold">Current Plan ✓</div>
            } @else if (auth.currentPlan() === 'monthly') {
              <button class="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold transition text-sm shadow-md"
                      [disabled]="loading()"
                      (click)="subscribe('yearly')">
                {{ loading() === 'yearly' ? 'Opening...' : '⬆ Upgrade to Yearly' }}
              </button>
            } @else {
              <button class="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold transition text-sm shadow-md"
                      [disabled]="loading()"
                      (click)="subscribe('yearly')">
                {{ loading() === 'yearly' ? 'Opening...' : 'Get Yearly Plan' }}
              </button>
            }
          </div>
        </div>

        <!-- Feature comparison -->
        <div class="px-6 pb-5">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">What's included</p>
          <div class="grid grid-cols-3 text-xs text-center rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <div class="bg-slate-50 dark:bg-slate-800 p-2 font-semibold text-slate-500">Feature</div>
            <div class="bg-slate-50 dark:bg-slate-800 p-2 font-semibold text-slate-500">Free</div>
            <div class="bg-violet-600 p-2 font-semibold text-white">Pro</div>
            @for (row of comparisonRows; track row.label) {
              <div class="border-t border-slate-200 dark:border-slate-700 p-2 text-left text-slate-600 dark:text-slate-300">{{ row.label }}</div>
              <div class="border-t border-slate-200 dark:border-slate-700 p-2 text-slate-500">{{ row.free }}</div>
              <div class="border-t border-violet-100 dark:border-violet-900/50 bg-violet-50/50 dark:bg-violet-900/10 p-2 text-violet-700 dark:text-violet-300 font-medium">{{ row.pro }}</div>
            }
          </div>
        </div>

      </div>
      </div>
    </div>
  `,
})
export class UpgradeModalComponent implements OnInit {
  @Input() triggeredBy?: string;
  @Output() close     = new EventEmitter<void>();
  @Output() upgraded  = new EventEmitter<void>();

  private readonly subs   = inject(SubscriptionService);
  readonly auth           = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading     = signal<'monthly' | 'yearly' | null>(null);
  readonly hoveredPlan = signal<'monthly' | 'yearly' | null>(null);

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.subs.getStatus();
    }
  }

  readonly monthlyFeatures = [
    'All premium templates',
    'No watermark on PDFs',
    'Unlimited resumes',
    'Unlimited downloads',
    'Cover Letter Builder',
    'ATS score checker',
  ];

  readonly yearlyFeatures = [
    'Everything in Monthly',
    'Early access to new templates',
    'Exclusive premium designs',
    'Resume analytics',
    'Portfolio builder',
    'Premium support',
  ];

  readonly comparisonRows = [
    { label: 'Templates',    free: '7 free',     pro: 'All 10 ✓' },
    { label: 'PDF watermark',free: 'Yes',         pro: 'None ✓' },
    { label: 'Resumes',      free: 'Up to 2',     pro: 'Unlimited ✓' },
    { label: 'Downloads',    free: '3/day',       pro: 'Unlimited ✓' },
    { label: 'ATS Score',    free: 'Basic',       pro: 'Full ✓' },
    { label: 'Cover Letter', free: '✗',            pro: '✓ Live' },
  ];

  async subscribe(plan: 'monthly' | 'yearly'): Promise<void> {
    if (!this.auth.isLoggedIn()) {
      sessionStorage.setItem('pendingUpgrade', plan);
      this.close.emit();
      this.router.navigate(['/login']);
      return;
    }

    this.loading.set(plan);
    const ok = await this.subs.subscribe(plan);
    this.loading.set(null);
    if (ok) { this.upgraded.emit(); this.close.emit(); }
  }
}
