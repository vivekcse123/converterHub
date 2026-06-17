import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

export type SubscriptionPlan = 'monthly' | 'yearly';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly auth       = inject(AuthService);
  private readonly api        = inject(ApiService);
  private readonly notify     = inject(NotificationService);
  private readonly platformId = inject(PLATFORM_ID);

  isPro(): boolean {
    return this.auth.isPro();
  }

  canUseTemplate(isPremiumTemplate: boolean): boolean {
    if (!isPremiumTemplate) return true;
    return this.isPro();
  }

  /** Opens Razorpay subscription checkout. Returns true if activated. */
  async subscribe(plan: SubscriptionPlan): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) return false;

    if (!this.auth.isLoggedIn()) {
      this.notify.warning('Sign in required', 'Please sign in to subscribe.');
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

  async cancelSubscription(): Promise<boolean> {
    try {
      await firstValueFrom(this.api.post('subscriptions/cancel', {}));
      // Refresh user data
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
      const planLabel = opts.plan === 'monthly' ? 'Pro Monthly — ₹9/month' : 'Pro Yearly — ₹99/year';
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
            // Refresh user from server to get updated subscription
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
