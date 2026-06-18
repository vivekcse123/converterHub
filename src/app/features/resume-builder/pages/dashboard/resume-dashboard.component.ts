import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { SubscriptionService } from '../../services/subscription.service';
import { ResumeStoreService } from '../../services/resume-store.service';
import { UpgradeModalComponent } from '../../components/upgrade-modal/upgrade-modal.component';

@Component({
  selector: 'app-resume-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, UpgradeModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (showUpgrade()) {
      <app-upgrade-modal (close)="showUpgrade.set(false)" (upgraded)="showUpgrade.set(false)" />
    }

    <div class="min-h-screen bg-slate-50 dark:bg-slate-950">

      <!-- ── Top nav bar ── -->
      <div class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-sm">
        <div class="container-app py-3 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {{ initials() }}
            </div>
            <div class="hidden sm:block">
              <p class="font-semibold text-slate-800 dark:text-white text-sm leading-tight">{{ auth.user()?.name }}</p>
              <p class="text-xs" [class]="auth.isPro() ? 'text-emerald-500 font-medium' : 'text-slate-400'">
                {{ planBadgeLabel() }}
              </p>
            </div>
          </div>
          <nav class="flex items-center gap-2">
            @if (!auth.isPro()) {
              <button
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold hover:opacity-90 transition shadow-md"
                (click)="showUpgrade.set(true)">
                ⭐ Upgrade to Pro
              </button>
            }
            <a routerLink="/resume-builder"
               class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-violet-300 transition">
              + New Resume
            </a>
            <a routerLink="/" class="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition hidden sm:block">← Home</a>
          </nav>
        </div>
      </div>

      <div class="container-app py-8 space-y-8">

        <!-- ── Welcome header ── -->
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">
              Welcome back, {{ firstName() }} 👋
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ welcomeSubtitle() }}</p>
          </div>
          @if (auth.isPro()) {
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Pro Active
            </span>
          }
        </div>

        <!-- ── Overview stats ── -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="card p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-lg">📄</div>
              <span class="text-xs font-medium text-slate-400">Total</span>
            </div>
            <p class="text-3xl font-extrabold text-slate-800 dark:text-white">{{ resumes().length }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Resumes</p>
          </div>
          <div class="card p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-lg">📋</div>
              <span class="text-xs font-medium text-slate-400">Total</span>
            </div>
            <p class="text-3xl font-extrabold text-slate-800 dark:text-white">{{ auth.user()?.subscription?.resumeCount ?? 0 }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Downloads</p>
          </div>
          <div class="card p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                   [class]="auth.isPro() ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-slate-100 dark:bg-slate-800'">
                {{ auth.isPro() ? '⭐' : '🆓' }}
              </div>
              <span class="text-xs font-medium" [class]="auth.isPro() ? 'text-emerald-500' : 'text-slate-400'">
                {{ auth.isPro() ? 'Active' : 'Free' }}
              </span>
            </div>
            <p class="text-lg font-extrabold text-slate-800 dark:text-white capitalize">{{ planName() }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Current Plan</p>
          </div>
          <div class="card p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-lg">⏰</div>
              <span class="text-xs font-medium text-slate-400">Remaining</span>
            </div>
            <p class="text-3xl font-extrabold" [class]="daysLeft() <= 7 ? 'text-red-500' : 'text-slate-800 dark:text-white'">
              {{ auth.isPro() ? daysLeft() : '∞' }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ auth.isPro() ? 'Days left' : 'Free forever' }}</p>
          </div>
        </div>

        <!-- ── Quick create ── -->
        <div>
          <h2 class="text-base font-bold text-slate-800 dark:text-white mb-4">Quick Create</h2>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <a routerLink="/resume-builder"
               class="group card p-4 flex flex-col items-center gap-2 text-center hover:border-violet-300 hover:shadow-md transition cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">🧑‍💼</div>
              <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">New Resume</p>
            </a>
            <a routerLink="/biodata-maker"
               class="group card p-4 flex flex-col items-center gap-2 text-center hover:border-rose-300 hover:shadow-md transition cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">📋</div>
              <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">New Biodata</p>
            </a>
            <a routerLink="/resume-builder/pricing"
               class="group card p-4 flex flex-col items-center gap-2 text-center hover:border-amber-300 hover:shadow-md transition cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">⭐</div>
              <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">View Plans</p>
            </a>
            <a routerLink="/resume-builder"
               class="group card p-4 flex flex-col items-center gap-2 text-center hover:border-emerald-300 hover:shadow-md transition cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">📊</div>
              <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">ATS Checker</p>
            </a>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- ── My resumes ── -->
          <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-base font-bold text-slate-800 dark:text-white">My Resumes</h2>
              <a routerLink="/resume-builder" class="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium">+ Create new</a>
            </div>

            @if (resumes().length === 0) {
              <div class="card p-10 text-center">
                <p class="text-5xl mb-4">📄</p>
                <p class="font-semibold text-slate-700 dark:text-slate-200 mb-1">No resumes yet</p>
                <p class="text-sm text-slate-400 mb-5">Build your first professional resume in minutes.</p>
                <a routerLink="/resume-builder" class="btn btn-primary text-sm px-6 py-2.5">Create Resume</a>
              </div>
            }

            @for (r of resumes(); track r.id) {
              <div class="card p-4 flex items-center gap-4 hover:border-violet-200 dark:hover:border-violet-700 hover:shadow-sm transition-all group">
                <div class="w-12 h-14 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
                  {{ r.name.substring(0, 2).toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-slate-800 dark:text-white text-sm truncate">{{ r.name || 'Untitled Resume' }}</p>
                  <p class="text-xs text-slate-400 mt-0.5">Template: {{ r.templateId }} · Updated {{ r.updatedAt | date:'dd MMM' }}</p>
                </div>
                <div class="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a [routerLink]="['/resume-builder']" [queryParams]="{id: r.id}"
                     class="text-xs px-2.5 py-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium hover:bg-violet-200 transition">
                    Edit
                  </a>
                  <button class="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-100 hover:text-red-600 transition"
                          (click)="deleteResume(r.id)">
                    Delete
                  </button>
                </div>
              </div>
            }

            @if (!auth.isPro() && resumes().length >= 2) {
              <div class="card p-4 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/10 text-center">
                <p class="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">🔒 Free plan limit reached</p>
                <p class="text-xs text-amber-600 dark:text-amber-400 mb-3">Upgrade to Pro for unlimited resumes</p>
                <button class="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline" (click)="showUpgrade.set(true)">
                  Upgrade to Pro →
                </button>
              </div>
            }
          </div>

          <!-- ── Right sidebar ── -->
          <div class="space-y-5">

            <!-- Subscription card -->
            <div class="card p-5">
              <h3 class="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                💳 Subscription
              </h3>

              @if (auth.isPro()) {
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-slate-500">Plan</span>
                    <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 capitalize">{{ planName() }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-slate-500">Status</span>
                    <span class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                    </span>
                  </div>
                  @if (auth.user()?.subscription?.currentPeriodStart) {
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-slate-500">Started</span>
                      <span class="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {{ auth.user()?.subscription?.currentPeriodStart | date:'dd MMM yyyy' }}
                      </span>
                    </div>
                  }
                  @if (auth.user()?.subscription?.currentPeriodEnd) {
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-slate-500">{{ auth.user()?.subscription?.cancelAtPeriodEnd ? 'Expires' : 'Renews' }}</span>
                      <span class="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {{ auth.user()?.subscription?.currentPeriodEnd | date:'dd MMM yyyy' }}
                      </span>
                    </div>
                  }
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-slate-500">Days left</span>
                    <span class="text-xs font-bold" [class]="daysLeft() <= 7 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'">
                      {{ daysLeft() }} days
                    </span>
                  </div>
                  @if (auth.user()?.subscription?.cancelAtPeriodEnd) {
                    <p class="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
                      ⚠ Cancels at end of period
                    </p>
                  }
                  @if (auth.currentPlan() === 'monthly') {
                    <div class="pt-1">
                      <a routerLink="/resume-builder/pricing" class="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium">
                        ⬆ Upgrade to Yearly — save ₹9
                      </a>
                    </div>
                  }
                  <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button class="text-xs text-slate-400 hover:text-red-500 transition"
                            [disabled]="cancelling()"
                            (click)="cancel()">
                      {{ cancelling() ? 'Cancelling...' : 'Cancel Subscription' }}
                    </button>
                  </div>
                </div>
              } @else {
                <div class="text-center py-3">
                  <p class="text-4xl mb-3">🚀</p>
                  <p class="text-sm font-semibold text-slate-800 dark:text-white mb-1">Go Pro for ₹9/mo</p>
                  <p class="text-xs text-slate-400 mb-4">All templates · No watermark · Unlimited</p>
                  <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold hover:opacity-90 transition shadow-md"
                          (click)="showUpgrade.set(true)">
                    ⭐ Upgrade to Pro
                  </button>
                </div>
              }
            </div>

            <!-- Payment history -->
            @if (payments().length > 0) {
              <div class="card p-5">
                <h3 class="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  🧾 Payment History
                </h3>
                <div class="space-y-2">
                  @for (p of payments(); track p._id) {
                    <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <div>
                        <p class="text-xs font-semibold text-slate-700 dark:text-slate-300 capitalize">Pro {{ p.plan }}</p>
                        <p class="text-[10px] text-slate-400">{{ p.createdAt | date:'dd MMM yyyy' }}</p>
                      </div>
                      <div class="text-right">
                        <p class="text-xs font-bold text-slate-800 dark:text-white">₹{{ p.amount / 100 }}</p>
                        <span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                              [class]="p.status === 'captured' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-100 text-red-700'">
                          {{ p.status === 'captured' ? 'Paid' : p.status }}
                        </span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Pro features locked -->
            @if (!auth.isPro()) {
              <div class="card p-5 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/10 border-violet-200 dark:border-violet-800">
                <h3 class="text-sm font-bold text-slate-800 dark:text-white mb-3">🔒 Pro Features</h3>
                <div class="space-y-2 mb-4">
                  @for (f of proFeatures; track f) {
                    <button class="w-full flex items-center gap-2 text-left p-2 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/30 transition group"
                            (click)="showUpgrade.set(true)">
                      <span class="text-slate-300 group-hover:text-violet-500 transition">🔒</span>
                      <span class="text-xs text-slate-500 dark:text-slate-400 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition">{{ f }}</span>
                    </button>
                  }
                </div>
                <button class="w-full py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 transition"
                        (click)="showUpgrade.set(true)">
                  Unlock Pro Features
                </button>
              </div>
            }

          </div>
        </div>

        <!-- ── Upgrade banner (free users) ── -->
        @if (!auth.isPro()) {
          <div class="rounded-2xl overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div class="text-4xl shrink-0">🚀</div>
            <div class="flex-1 text-center sm:text-left">
              <h3 class="text-white font-extrabold text-lg mb-1">Unlock Everything with Pro</h3>
              <p class="text-indigo-200 text-sm">All premium templates, no watermark, unlimited resumes, ATS checker, and AI-powered tools — starting at just ₹9/month.</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-2 shrink-0">
              <button class="px-5 py-2.5 rounded-xl bg-white text-violet-700 text-sm font-bold hover:bg-violet-50 transition shadow-lg"
                      (click)="subscribeTo('monthly')">
                ₹9/month
              </button>
              <button class="px-5 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white text-sm font-bold hover:bg-white/30 transition"
                      (click)="subscribeTo('yearly')">
                ₹99/year — Best Value
              </button>
            </div>
          </div>
        }

      </div>
    </div>

    <!-- ── Mobile sticky CTA ── -->
    @if (!auth.isPro()) {
      <div class="fixed bottom-0 left-0 right-0 sm:hidden z-30 p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-2xl">
        <button class="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold shadow-md"
                (click)="showUpgrade.set(true)">
          ⭐ Upgrade to Pro — ₹9/month
        </button>
      </div>
    }
  `,
})
export class ResumeDashboardComponent implements OnInit {
  readonly auth      = inject(AuthService);
  readonly subs      = inject(SubscriptionService);
  private readonly store = inject(ResumeStoreService);

  readonly showUpgrade = signal(false);
  readonly cancelling  = signal(false);
  readonly payments    = signal<any[]>([]);
  readonly resumes     = this.store.resumes;

  readonly proFeatures = [
    'Premium Resume Templates (ATS Pro, Modern Pro)',
    'No watermark on downloaded PDFs',
    'Unlimited resumes & biodata',
    'Cover Letter Builder',
    'Full ATS Score Checker',
    'AI Suggestions (coming soon)',
  ];

  initials() {
    return (this.auth.user()?.name ?? 'U').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  }

  firstName() {
    return (this.auth.user()?.name ?? 'there').split(' ')[0];
  }

  welcomeSubtitle() {
    return this.auth.isPro()
      ? 'You are on ' + this.planBadgeLabel() + ' - all features unlocked.'
      : 'You are on the Free plan. Upgrade to unlock all templates.';
  }

  planName() {
    const plan = this.auth.currentPlan();
    if (plan === 'monthly') return 'Pro Monthly';
    if (plan === 'yearly')  return 'Pro Yearly';
    return 'Free';
  }

  planBadgeLabel() {
    if (this.auth.isPro()) return this.planName() + ' ✓';
    return 'Free Plan';
  }

  daysLeft(): number {
    const end = this.auth.user()?.subscription?.currentPeriodEnd;
    if (!end) return 0;
    return Math.max(0, Math.ceil((new Date(end).getTime() - Date.now()) / 86_400_000));
  }

  async ngOnInit() {
    if (this.auth.isLoggedIn()) {
      const [history] = await Promise.all([
        this.subs.getPaymentHistory(),
        this.subs.getStatus(),
      ]);
      this.payments.set(history);
      this.subs.syncResumeCount(this.store.resumes().length);
    }
  }

  deleteResume(id: string) {
    this.store.deleteResume(id);
    this.subs.syncResumeCount(this.store.resumes().length);
  }

  async cancel() {
    this.cancelling.set(true);
    await this.subs.cancelSubscription();
    this.cancelling.set(false);
  }

  async subscribeTo(plan: 'monthly' | 'yearly') {
    this.showUpgrade.set(false);
    await this.subs.subscribe(plan);
  }
}
