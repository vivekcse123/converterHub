import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PLAN_PRICES, PRO_HIGHLIGHTS, PaidPlan } from '../../data/plan-features';
import { PREMIUM_TEMPLATE_IDS } from '../../data/resume-templates.data';

@Component({
  selector: 'app-upgrade-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-16 pb-4 bg-black/60 backdrop-blur-sm" (click)="close.emit()">
      <div class="relative w-full max-w-lg max-h-[88vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl" (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 px-6 py-6 text-white rounded-t-2xl shrink-0">
          <button class="absolute top-4 right-4 text-white/60 hover:text-white transition p-1" (click)="close.emit()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <div class="text-center mb-4">
            <div class="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-xl flex items-center justify-center" aria-hidden="true">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h2 class="text-xl font-extrabold leading-tight">Unlock Your Complete Career Toolkit</h2>
            <p class="text-white/70 text-xs mt-1.5">₹99/month · Cheaper than every international competitor</p>
          </div>
          <!-- 8 feature highlights grid -->
          <div class="grid grid-cols-2 gap-1.5">
            @for (f of proHighlights; track f.label) {
              <div class="flex items-center gap-2 bg-white/10 rounded-lg px-2.5 py-1.5">
                <svg class="w-4 h-4 shrink-0 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" [attr.d]="f.svgPath"/>
                </svg>
                <span class="text-xs font-medium leading-tight">{{ f.label }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Scrollable body -->
        <div class="overflow-y-auto flex-1 min-h-0">

          <!-- Plans -->
          <div class="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">

            <!-- Monthly -->
            <div class="border-2 rounded-xl p-4 transition cursor-pointer"
                 [class]="(auth.currentPlan() === 'yearly' || auth.currentPlan() === 'lifetime') ? 'border-slate-200 dark:border-slate-700 opacity-50' :
                          (hoveredPlan() === 'monthly' ? 'border-primary-400 ring-2 ring-primary-100 dark:ring-primary-900' : 'border-slate-200 dark:border-slate-700 hover:border-primary-300')"
                 (mouseenter)="hoveredPlan.set('monthly')" (mouseleave)="hoveredPlan.set(null)">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Monthly</p>
                  <p class="text-2xl font-extrabold text-slate-800 dark:text-white mt-0.5">
                    {{ prices.monthly.display }} <span class="text-sm font-normal text-slate-400">{{ prices.monthly.period }}</span>
                  </p>
                  <p class="text-[11px] text-slate-400 mt-0.5">{{ prices.monthly.tagline }}</p>
                </div>
                <svg class="w-5 h-5 shrink-0 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              @if (auth.currentPlan() === 'monthly') {
                <div class="text-center text-xs py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">Current Plan ✓</div>
              } @else if (auth.currentPlan() === 'yearly' || auth.currentPlan() === 'lifetime') {
                <div class="text-center text-xs py-2 text-slate-400 flex items-center justify-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  Higher plan active
                </div>
              } @else {
                <button class="w-full py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition text-sm mt-1"
                        [disabled]="loading()"
                        (click)="subscribe('monthly')">
                  {{ loading() === 'monthly' ? 'Opening...' : 'Start Monthly' }}
                </button>
              }
            </div>

            <!-- Yearly (highlighted) -->
            <div class="border-2 border-amber-400 rounded-xl p-4 bg-gradient-to-b from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-800/50 relative cursor-pointer shadow-md shadow-amber-100 dark:shadow-amber-900/10">
              <div class="absolute -top-3 left-1/2 -translate-x-1/2">
                <span class="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow whitespace-nowrap tracking-wide">
                  <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  BEST VALUE
                </span>
              </div>
              <div class="flex items-start justify-between mb-3 mt-1">
                <div>
                  <p class="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Yearly</p>
                  <div class="flex items-baseline gap-1.5 mt-0.5">
                    <p class="text-2xl font-extrabold text-slate-800 dark:text-white">
                      {{ prices.yearly.display }} <span class="text-sm font-normal text-slate-400">{{ prices.yearly.period }}</span>
                    </p>
                    <span class="text-xs line-through text-slate-400">{{ prices.yearly.regularPrice }}</span>
                  </div>
                  <p class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">{{ prices.yearly.tagline }}</p>
                </div>
                <svg class="w-5 h-5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
              </div>
              @if (auth.currentPlan() === 'lifetime') {
                <div class="text-center text-xs py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold">Lifetime Plan Active</div>
              } @else if (auth.currentPlan() === 'yearly') {
                <div class="text-center text-xs py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold">Current Plan ✓</div>
              } @else if (auth.currentPlan() === 'monthly') {
                <button class="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold transition text-sm shadow mt-1"
                        [disabled]="loading()"
                        (click)="subscribe('yearly')">
                  {{ loading() === 'yearly' ? 'Opening...' : 'Upgrade to Yearly' }}
                </button>
              } @else {
                <button class="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold transition text-sm shadow mt-1"
                        [disabled]="loading()"
                        (click)="subscribe('yearly')">
                  {{ loading() === 'yearly' ? 'Opening...' : 'Get Yearly ₹699/yr' }}
                </button>
              }
            </div>

            <!-- Lifetime (one-time) -->
            <div class="border-2 rounded-xl p-4 transition cursor-pointer relative"
                 [class]="auth.currentPlan() === 'lifetime' ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' :
                          (hoveredPlan() === 'lifetime' ? 'border-slate-800 dark:border-slate-300 ring-2 ring-slate-100 dark:ring-slate-800' : 'border-slate-300 dark:border-slate-600 hover:border-slate-500')"
                 (mouseenter)="hoveredPlan.set('lifetime')" (mouseleave)="hoveredPlan.set(null)">
              <div class="absolute -top-3 left-1/2 -translate-x-1/2">
                <span class="bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-[10px] font-extrabold px-3 py-1 rounded-full shadow whitespace-nowrap tracking-wide">ONE-TIME</span>
              </div>
              <div class="flex items-start justify-between mb-3 mt-1">
                <div>
                  <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Lifetime</p>
                  <p class="text-2xl font-extrabold text-slate-800 dark:text-white mt-0.5">
                    {{ prices.lifetime.display }} <span class="text-sm font-normal text-slate-400">{{ prices.lifetime.period }}</span>
                  </p>
                  <p class="text-[11px] text-slate-400 mt-0.5">{{ prices.lifetime.tagline }}</p>
                </div>
                <svg class="w-5 h-5 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              </div>
              @if (auth.currentPlan() === 'lifetime') {
                <div class="text-center text-xs py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold">You own it!</div>
              } @else {
                <button class="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:hover:bg-white text-white dark:text-slate-900 font-bold transition text-sm mt-1"
                        [disabled]="loading()"
                        (click)="subscribe('lifetime')">
                  {{ loading() === 'lifetime' ? 'Opening...' : 'Buy Lifetime ₹1,499' }}
                </button>
              }
            </div>

          </div>

          <!-- ₹29 per-template option — shown only when triggered by a premium download -->
          @if (isPremiumTemplateContext) {
            <div class="mx-5 mb-4 border border-amber-200 dark:border-amber-800 rounded-xl overflow-hidden">
              <div class="bg-amber-50 dark:bg-amber-900/20 px-4 py-3">
                <div class="flex items-center gap-2 mb-1">
                  <svg class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                  <p class="text-xs font-bold text-amber-800 dark:text-amber-300">Just want THIS template?</p>
                </div>
                <p class="text-[11px] text-amber-700 dark:text-amber-400 mb-3">
                  Buy only this template once for ₹29 — no subscription needed. Download it anytime.
                </p>
                @if (auth.hasPurchasedTemplate(triggeredBy!)) {
                  <div class="text-center text-xs py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold">
                    You already own this template ✓
                  </div>
                } @else {
                  <button
                    class="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold transition text-sm"
                    [disabled]="loadingTemplate()"
                    (click)="purchaseTemplate()">
                    {{ loadingTemplate() ? 'Opening payment...' : 'Buy This Template — ₹29 One-Time' }}
                  </button>
                }
              </div>
            </div>

            <div class="flex items-center gap-3 px-5 mb-3">
              <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              <span class="text-[11px] text-slate-400 font-medium">or get all templates with Pro</span>
              <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
            </div>
          }

          <!-- Pricing note + link -->
          <div class="text-center pb-2 px-5">
            <p class="text-[11px] text-slate-400 mb-1.5">
              International resume platforms charge ₹500–₹1,333/mo for the same features
            </p>
            <a routerLink="/resume-builder/pricing" (click)="close.emit()"
               class="text-xs text-primary-500 dark:text-primary-400 hover:underline">
              View full pricing including Lifetime plan →
            </a>
          </div>

          <!-- Switch to free template option — only when triggered from a download gate -->
          @if (isPremiumTemplateContext) {
            <div class="px-5 pb-3 text-center">
              <button class="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline-offset-2 hover:underline transition"
                      (click)="useFreeTemplate.emit(); close.emit()">
                Use a Free Template Instead — Keep All My Data
              </button>
            </div>
          }

          <!-- Mini comparison table -->
          <div class="px-5 pb-5 mt-3">
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center">Free vs Pro</p>
            <div class="grid grid-cols-3 text-xs text-center rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <div class="bg-slate-50 dark:bg-slate-800 p-2 font-semibold text-slate-500">Feature</div>
              <div class="bg-slate-50 dark:bg-slate-800 p-2 font-semibold text-slate-500">Free</div>
              <div class="bg-gradient-to-b from-violet-600 to-indigo-700 p-2 font-semibold text-white">Pro</div>
              @for (row of comparisonRows; track row.label) {
                <div class="border-t border-slate-200 dark:border-slate-700 p-2 text-left text-slate-600 dark:text-slate-300">{{ row.label }}</div>
                <div class="border-t border-slate-200 dark:border-slate-700 p-2 text-slate-400">{{ row.free }}</div>
                <div class="border-t border-primary-100 dark:border-primary-900/50 bg-primary-50/30 dark:bg-primary-900/10 p-2 text-primary-700 dark:text-primary-300 font-semibold">{{ row.pro }}</div>
              }
            </div>
          </div>

        </div><!-- end scrollable body -->
      </div>
    </div>
  `,
})
export class UpgradeModalComponent implements OnInit {
  @Input() triggeredBy?: string;
  @Output() close             = new EventEmitter<void>();
  @Output() upgraded          = new EventEmitter<void>();
  @Output() useFreeTemplate   = new EventEmitter<void>();

  private readonly subs   = inject(SubscriptionService);
  readonly auth           = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading        = signal<PaidPlan | null>(null);
  readonly hoveredPlan    = signal<PaidPlan | null>(null);
  readonly loadingTemplate = signal(false);

  get isPremiumTemplateContext(): boolean {
    return !!(this.triggeredBy && PREMIUM_TEMPLATE_IDS.includes(this.triggeredBy as any));
  }

  readonly prices       = PLAN_PRICES;
  readonly proHighlights = PRO_HIGHLIGHTS;

  readonly comparisonRows = [
    { label: 'Templates',       free: '16 free',    pro: 'All 30 ✓'        },
    { label: 'Premium templates', free: '✗',        pro: '14 unlocked ✓'   },
    { label: 'PDF watermark',   free: 'None',        pro: 'None ✓'          },
    { label: 'Resumes',         free: 'Up to 2',     pro: 'Unlimited ✓'     },
    { label: 'AI credits',      free: 'Limited',     pro: 'Unlimited ✓'     },
    { label: 'ATS analysis',    free: 'Basic',       pro: 'Full + sub-scores ✓' },
    { label: 'Cover Letter',    free: '✗',           pro: '✓ Full'          },
    { label: 'Portfolio',       free: '✗',           pro: '✓ Public URL'    },
    { label: 'Job Tracker',     free: '✗',           pro: '✓ Included'      },
  ];

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) this.subs.getStatus();
  }

  async purchaseTemplate(): Promise<void> {
    if (!this.triggeredBy) return;
    this.loadingTemplate.set(true);
    const ok = await this.subs.buyTemplate(this.triggeredBy);
    this.loadingTemplate.set(false);
    if (ok) { this.upgraded.emit(); this.close.emit(); }
  }

  async subscribe(plan: PaidPlan): Promise<void> {
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
