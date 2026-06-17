import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PREMIUM_TEMPLATE_IDS, TEMPLATE_PRICE_INR } from '../data/resume-templates.data';
import { TemplateId } from '../models/resume.model';

@Injectable({ providedIn: 'root' })
export class ResumePaymentService {
  private readonly auth       = inject(AuthService);
  private readonly api        = inject(ApiService);
  private readonly notify     = inject(NotificationService);
  private readonly platformId = inject(PLATFORM_ID);

  isPremium(id: TemplateId): boolean {
    return PREMIUM_TEMPLATE_IDS.includes(id);
  }

  /** Returns true if the user can use this template right now (free, or purchased). */
  canUse(id: TemplateId): boolean {
    if (!this.isPremium(id)) return true;
    return this.auth.hasPurchasedTemplate(id);
  }

  /**
   * Opens the Razorpay checkout for a premium template.
   * Returns true if payment succeeded and template is unlocked.
   */
  async purchase(templateId: TemplateId, templateName: string): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) return false;

    if (!this.auth.isLoggedIn()) {
      this.notify.warning('Sign in required', 'Please sign in to purchase a template.');
      return false;
    }

    try {
      // 1. Create Razorpay order on the backend
      const res = await firstValueFrom(
        this.api.post<any>('payments/create-order', { templateId })
      );
      const { orderId, amount, currency, keyId } = res.data;

      // 2. Ensure Razorpay checkout.js is loaded
      await this.loadScript();

      // 3. Open checkout and await user action
      const succeeded = await this.openCheckout({ orderId, amount, currency, keyId, templateId, templateName });
      return succeeded;
    } catch (err: any) {
      const msg = err?.error?.message ?? err?.message ?? 'Something went wrong.';
      this.notify.error('Payment failed', msg);
      return false;
    }
  }

  private openCheckout(opts: {
    orderId: string; amount: number; currency: string; keyId: string;
    templateId: TemplateId; templateName: string;
  }): Promise<boolean> {
    return new Promise((resolve) => {
      const rzpOptions = {
        key:         opts.keyId,
        amount:      opts.amount,
        currency:    opts.currency,
        name:        'ApnaConverter',
        description: `Unlock "${opts.templateName}" Resume Template`,
        image:       'https://www.apnaconverter.com/favicon.ico',
        order_id:    opts.orderId,
        prefill: {
          name:  this.auth.user()?.name  ?? '',
          email: this.auth.user()?.email ?? '',
        },
        theme:  { color: '#6366f1' },
        modal:  { ondismiss: () => resolve(false) },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay via UPI',
                instruments: [{ method: 'upi', flows: ['collect'] }],
              },
            },
            sequence: ['block.upi'],
            preferences: { show_default_blocks: true },
          },
        },
        handler: async (response: any) => {
          try {
            await firstValueFrom(
              this.api.post('payments/verify', {
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                templateId:          opts.templateId,
              })
            );
            // Optimistically update local user state — no extra API call needed
            this.auth.addPurchasedTemplate(opts.templateId);
            this.notify.success('Template unlocked! 🎉', `"${opts.templateName}" is now available.`);
            resolve(true);
          } catch {
            this.notify.error('Verification failed', 'Payment received but verification failed. Contact support.');
            resolve(false);
          }
        },
      };

      const rzp = new (window as any).Razorpay(rzpOptions);
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
      s.onerror = () => reject(new Error('Failed to load Razorpay checkout'));
      document.head.appendChild(s);
    });
  }
}
