import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

export type SubscriptionPlan = 'monthly' | 'yearly' | 'lifetime';

export interface SubscriptionStatus {
  isPro:               boolean;
  isPremium:           boolean;
  plan:                string;
  status:              string;
  startedAt:           string | null;
  currentPeriodEnd:    string | null;
  cancelAtPeriodEnd:   boolean;
  daysRemaining:       number;   // -1 means lifetime (never expires)
  resumeCount:         number;
  totalDownloads:      number;
  canPurchaseMonthly:  boolean;
  canPurchaseYearly:   boolean;
  canPurchaseLifetime: boolean;
}

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly auth       = inject(AuthService);
  private readonly api        = inject(ApiService);
  private readonly notify     = inject(NotificationService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly subStatus = signal<SubscriptionStatus | null>(null);

  isPro(): boolean {
    return this.auth.isPro();
  }

  canUseTemplate(isPremiumTemplate: boolean): boolean {
    if (!isPremiumTemplate) return true;
    return this.isPro();
  }

  canPurchaseMonthly(): boolean {
    return this.subStatus()?.canPurchaseMonthly ?? !this.isPro();
  }

  canPurchaseYearly(): boolean {
    const current = this.auth.currentPlan();
    if (current === 'lifetime' || current === 'yearly') return false;
    return this.subStatus()?.canPurchaseYearly ?? true;
  }

  canPurchaseLifetime(): boolean {
    if (this.auth.currentPlan() === 'lifetime') return false;
    return this.subStatus()?.canPurchaseLifetime ?? true;
  }

  async getStatus(): Promise<SubscriptionStatus | null> {
    if (!this.auth.isLoggedIn()) return null;
    try {
      const res = await firstValueFrom(this.api.get<any>('subscriptions/status'));
      const status = res.data as SubscriptionStatus;
      this.subStatus.set(status);
      return status;
    } catch { return null; }
  }

  /** Opens Razorpay checkout. Returns true if plan activated. */
  async subscribe(plan: SubscriptionPlan): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) return false;

    if (!this.auth.isLoggedIn()) {
      this.notify.warning('Sign in required', 'Please sign in to subscribe.');
      return false;
    }

    await this.getStatus();

    if (plan === 'lifetime') {
      if (!this.canPurchaseLifetime()) {
        this.notify.warning('Already on Lifetime', 'You already have Lifetime access. No purchase needed.');
        return false;
      }
      return this.subscribeLifetime();
    }

    if (plan === 'monthly' && !this.canPurchaseMonthly()) {
      const currentPlan = this.auth.currentPlan();
      if (currentPlan === 'lifetime') {
        this.notify.warning('Already on Lifetime', 'Lifetime plan includes everything. No upgrade needed.');
      } else if (currentPlan === 'yearly') {
        this.notify.warning('Already on Yearly', 'Yearly plan is higher than Monthly.');
      } else {
        this.notify.warning('Already subscribed', 'You already have an active Monthly plan.');
      }
      return false;
    }

    if (plan === 'yearly' && !this.canPurchaseYearly()) {
      const currentPlan = this.auth.currentPlan();
      if (currentPlan === 'lifetime') {
        this.notify.warning('Already on Lifetime', 'Lifetime plan includes everything. No upgrade needed.');
      } else {
        this.notify.warning('Already on Yearly', 'You already have an active Yearly plan.');
      }
      return false;
    }

    try {
      const res = await firstValueFrom(
        this.api.post<any>('subscriptions/create', { plan })
      );
      const { subscriptionId, keyId } = res.data;
      await this.loadScript();
      return this.openCheckout({ subscriptionId, keyId, plan });
    } catch (err: any) {
      const msg = err?.error?.message ?? err?.message ?? 'Something went wrong.';
      this.notify.error('Subscription failed', msg);
      return false;
    }
  }

  private async subscribeLifetime(): Promise<boolean> {
    try {
      const res = await firstValueFrom(this.api.post<any>('subscriptions/create-lifetime', {}));
      const { orderId, amount, currency, keyId } = res.data;
      await this.loadScript();
      return this.openLifetimeCheckout({ orderId, amount, currency, keyId });
    } catch (err: any) {
      const msg = err?.error?.message ?? err?.message ?? 'Something went wrong.';
      this.notify.error('Lifetime purchase failed', msg);
      return false;
    }
  }

  async cancelSubscription(): Promise<boolean> {
    try {
      await firstValueFrom(this.api.post('subscriptions/cancel', {}));
      await firstValueFrom(this.auth.getMe());
      this.notify.success('Subscription cancelled', 'Access continues until end of billing period.');
      return true;
    } catch (err: any) {
      this.notify.error('Error', err?.error?.message ?? 'Could not cancel subscription.');
      return false;
    }
  }

  async getPaymentHistory(): Promise<any[]> {
    try {
      const res = await firstValueFrom(this.api.get<any>('subscriptions/payments'));
      return res.data?.payments ?? [];
    } catch { return []; }
  }

  async trackDownload(): Promise<void> {
    if (!this.auth.isLoggedIn()) return;
    try { await firstValueFrom(this.api.post('subscriptions/track-download', {})); } catch {}
  }

  syncResumeCount(count: number): void {
    if (!this.auth.isLoggedIn()) return;
    this.api.post('subscriptions/sync-resumes', { count }).subscribe({ error: () => {} });
  }

  private openCheckout(opts: { subscriptionId: string; keyId: string; plan: SubscriptionPlan }): Promise<boolean> {
    return new Promise((resolve) => {
      const planLabel = opts.plan === 'monthly' ? 'Pro Monthly - ₹99/month' : 'Pro Yearly - ₹699/year';
      const rzpOpts = {
        key:             opts.keyId,
        subscription_id: opts.subscriptionId,
        name:            'ApnaConverter',
        description:     planLabel,
        image:           'https://www.apnaconverter.com/favicon.ico',
        prefill: {
          name:  this.auth.user()?.name  ?? '',
          email: this.auth.user()?.email ?? '',
        },
        theme:  { color: '#6366f1' },
        modal:  { ondismiss: () => resolve(false) },
        handler: async (response: any) => {
          try {
            await firstValueFrom(
              this.api.post('subscriptions/verify', {
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_payment_id:      response.razorpay_payment_id,
                razorpay_signature:       response.razorpay_signature,
                plan:                     opts.plan,
              })
            );
            await firstValueFrom(this.auth.getMe());
            this.notify.success('Welcome to Pro! 🎉', `Your ${planLabel} subscription is now active.`);
            resolve(true);
          } catch {
            this.notify.error('Verification failed', 'Payment received but verification failed. Contact support.');
            resolve(false);
          }
        },
      };
      const rzp = new (window as any).Razorpay(rzpOpts);
      rzp.on('payment.failed', () => {
        this.notify.error('Payment failed', 'Your payment was not completed. Please try again.');
        resolve(false);
      });
      rzp.open();
    });
  }

  private openLifetimeCheckout(opts: { orderId: string; amount: number; currency: string; keyId: string }): Promise<boolean> {
    return new Promise((resolve) => {
      const rzpOpts = {
        key:      opts.keyId,
        order_id: opts.orderId,
        amount:   opts.amount,
        currency: opts.currency,
        name:     'ApnaConverter',
        description: 'Pro Lifetime - ₹1,499 (Pay once, use forever)',
        image:    'https://www.apnaconverter.com/favicon.ico',
        prefill: {
          name:  this.auth.user()?.name  ?? '',
          email: this.auth.user()?.email ?? '',
        },
        theme:  { color: '#6366f1' },
        modal:  { ondismiss: () => resolve(false) },
        handler: async (response: any) => {
          try {
            await firstValueFrom(
              this.api.post('subscriptions/verify-lifetime', {
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              })
            );
            await firstValueFrom(this.auth.getMe());
            this.notify.success('Lifetime Access Activated! 🎉', 'Welcome to Pro forever. No renewals ever.');
            resolve(true);
          } catch {
            this.notify.error('Verification failed', 'Payment received but verification failed. Contact support.');
            resolve(false);
          }
        },
      };
      const rzp = new (window as any).Razorpay(rzpOpts);
      rzp.on('payment.failed', () => {
        this.notify.error('Payment failed', 'Your payment was not completed. Please try again.');
        resolve(false);
      });
      rzp.open();
    });
  }

  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).Razorpay) { resolve(); return; }
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload  = () => resolve();
      s.onerror = () => reject(new Error('Failed to load Razorpay'));
      document.head.appendChild(s);
    });
  }
}
