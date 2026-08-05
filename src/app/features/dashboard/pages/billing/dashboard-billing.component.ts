import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { SubscriptionService } from '../../../resume-builder/services/subscription.service';
import { ConfirmDialogService } from '../../../../shared/components/confirm-dialog/confirm-dialog.service';
import { BadgeComponent, BadgeVariant } from '../../../../shared/components/badge/badge.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

interface PaymentRecord {
  _id: string;
  amount: number;
  currency: string;
  plan: string;
  status: 'captured' | 'failed' | 'refunded';
  invoiceNumber?: string;
  createdAt: string;
}

@Component({
  selector: 'app-dashboard-billing',
  standalone: true,
  imports: [RouterLink, DatePipe, TitleCasePipe, BadgeComponent, IconComponent, EmptyStateComponent, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-billing.component.html',
})
export class DashboardBillingComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly subscription = inject(SubscriptionService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  readonly paymentsLoading = signal(true);
  readonly payments = signal<PaymentRecord[]>([]);
  readonly cancelling = signal(false);

  ngOnInit(): void {
    this.subscription.getPaymentHistory().then((payments) => {
      this.payments.set(payments);
      this.paymentsLoading.set(false);
    });
  }

  formatAmount(paise: number, currency: string): string {
    const amount = paise / 100;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);
  }

  statusVariant(status: PaymentRecord['status']): BadgeVariant {
    if (status === 'captured') return 'success';
    if (status === 'refunded') return 'info';
    return 'danger';
  }

  async cancelSubscription(): Promise<void> {
    const ok = await this.confirmDialog.open({
      title: 'Cancel subscription?',
      message: 'You will keep Pro access until the end of your current billing period, then move to the Free plan.',
      confirmLabel: 'Cancel subscription',
      danger: true,
    });
    if (!ok) return;
    this.cancelling.set(true);
    await this.subscription.cancelSubscription();
    this.cancelling.set(false);
  }
}
