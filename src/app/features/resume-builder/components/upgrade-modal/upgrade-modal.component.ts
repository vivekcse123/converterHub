import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-upgrade-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-20 pb-4 bg-black/60 backdrop-blur-sm" (click)="close.emit()">
      <div class="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl" (click)="$event.stopPropagation()">

        <!-- Sticky Header -->
        <div class="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 px-6 py-6 text-white rounded-t-2xl shrink-0">
          <button class="absolute top-4 right-4 text-white/70 hover:text-white transition" (click)="close.emit()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <div class="text-center mb-4">
            <span class="inline-block text-3xl mb-2">🚀</span>
            <h2 class="text-xl font-extrabold leading-tight">Unlock Premium Templates<br>&amp; Career Tools</h2>
            <p class="text-white/75 text-xs mt-1.5">Everything you need to land your next job — in one plan</p>
          </div>
          <!-- What you unlock -->
          <div class="grid grid-cols-2 gap-1.5">
            @for (f of proFeatures; track f.label) {
              <div class="flex items-center gap-2 bg-white/10 rounded-lg px-2.5 py-1.5">
                <span class="text-base shrink-0">{{ f.icon }}</span>
                <span class="text-xs font-medium leading-tight">{{ f.label }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Scrollable Body -->
        <div class="overflow-y-auto flex-1 min-h-0">

        <!-- Plans -->
        <div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">

          <!-- Monthly -->
          <div class="border-2 rounded-xl p-4 transition cursor-pointer"
               [class]="auth.currentPlan() === 'yearly' ? 'border-slate-200 dark:border-slate-700 opacity-60' :
                        (hoveredPlan() === 'monthly' ? 'border-violet-400 ring-2 ring-violet-200 dark:ring-violet-900' : 'border-slate-200 dark:border-slate-700 hover:border-violet-400')"
               (mouseenter)="hoveredPlan.set('monthly')" (mouseleave)="hoveredPlan.set(null)">
            <div class="flex items-start justify-between mb-2">
              <div>
                <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Monthly</p>
                <p class="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">₹9 <span class="text-sm font-normal text-slate-400">/mo</span></p>
              </div>
              <span class="text-xl">📅</span>
            </div>
            @if (auth.currentPlan() === 'monthly') {
              <div class="text-center text-sm py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 font-medium">Current Plan ✓</div>
            } @else if (auth.currentPlan() === 'yearly') {
              <div class="text-center text-xs py-2 text-slate-400">🔒 Not available on Yearly</div>
            } @else {
              <button class="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold transition text-sm mt-1"
                      [disabled]="loading()"
                      (click)="subscribe('monthly')">
                {{ loading() === 'monthly' ? 'Opening...' : 'Start Monthly Plan' }}
              </button>
            }
          </div>

          <!-- Yearly (highlighted as best value) -->
          <div class="border-2 border-amber-400 rounded-xl p-4 bg-gradient-to-b from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-800/50 relative cursor-pointer shadow-md shadow-amber-100 dark:shadow-amber-900/10">
            <div class="absolute -top-3 left-1/2 -translate-x-1/2">
              <span class="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow whitespace-nowrap tracking-wide">⭐ BEST VALUE · MOST POPULAR</span>
            </div>
            <div class="flex items-start justify-between mb-2 mt-1">
              <div>
                <p class="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Yearly</p>
                <div class="flex items-baseline gap-2 mt-0.5">
                  <p class="text-2xl font-bold text-slate-800 dark:text-white">₹99 <span class="text-sm font-normal text-slate-400">/yr</span></p>
                  <span class="text-xs line-through text-slate-400">₹108</span>
                </div>
                <p class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Save ₹9 — 2 months free!</p>
              </div>
              <span class="text-xl">🏆</span>
            </div>
            @if (auth.currentPlan() === 'yearly') {
              <div class="text-center text-sm py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold">Current Plan ✓</div>
            } @else if (auth.currentPlan() === 'monthly') {
              <button class="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold transition text-sm shadow mt-1"
                      [disabled]="loading()"
                      (click)="subscribe('yearly')">
                {{ loading() === 'yearly' ? 'Opening...' : '⬆ Upgrade to Yearly — Save ₹9' }}
              </button>
            } @else {
              <button class="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold transition text-sm shadow mt-1"
                      [disabled]="loading()"
                      (click)="subscribe('yearly')">
                {{ loading() === 'yearly' ? 'Opening...' : 'Get Yearly Plan — Best Value' }}
              </button>
            }
          </div>
        </div>

        <!-- View pricing link -->
        <div class="text-center pb-1">
          <a routerLink="/resume-builder/pricing" (click)="close.emit()"
             class="text-xs text-violet-500 dark:text-violet-400 hover:underline">
            View full pricing &amp; feature comparison →
          </a>
        </div>

        <!-- Feature comparison -->
        <div class="px-5 pb-5 mt-3">
          <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 text-center">Free vs Pro</p>
          <div class="grid grid-cols-3 text-xs text-center rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <div class="bg-slate-50 dark:bg-slate-800 p-2 font-semibold text-slate-500">Feature</div>
            <div class="bg-slate-50 dark:bg-slate-800 p-2 font-semibold text-slate-500">Free</div>
            <div class="bg-gradient-to-b from-violet-600 to-indigo-700 p-2 font-semibold text-white">Pro</div>
            @for (row of comparisonRows; track row.label) {
              <div class="border-t border-slate-200 dark:border-slate-700 p-2 text-left text-slate-600 dark:text-slate-300">{{ row.label }}</div>
              <div class="border-t border-slate-200 dark:border-slate-700 p-2 text-slate-400">{{ row.free }}</div>
              <div class="border-t border-violet-100 dark:border-violet-900/50 bg-violet-50/30 dark:bg-violet-900/10 p-2 text-violet-700 dark:text-violet-300 font-semibold">{{ row.pro }}</div>
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

  readonly proFeatures = [
    { icon: '📄', label: 'Premium Resume Templates' },
    { icon: '💌', label: 'Cover Letter Builder' },
    { icon: '🌐', label: 'Portfolio Builder' },
    { icon: '⬇️', label: 'Unlimited Downloads' },
    { icon: '🚫', label: 'No Watermark on PDFs' },
    { icon: '📊', label: 'Advanced ATS Analysis' },
    { icon: '📋', label: 'Job Tracker' },
    { icon: '✨', label: 'All Future Features' },
  ];

  readonly comparisonRows = [
    { label: 'Templates',       free: '7 free',   pro: 'All 10 ✓' },
    { label: 'PDF watermark',   free: 'Yes',       pro: 'None ✓' },
    { label: 'Resumes',         free: 'Up to 2',   pro: 'Unlimited ✓' },
    { label: 'Downloads',       free: '3/day',     pro: 'Unlimited ✓' },
    { label: 'ATS Sub-scores',  free: '✗',          pro: '✓ 4 metrics' },
    { label: 'Cover Letter',    free: '✗',          pro: '✓ Full' },
    { label: 'Portfolio',       free: '✗',          pro: '✓ Full' },
    { label: 'Job Tracker',     free: '✗',          pro: '✓ Included' },
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
