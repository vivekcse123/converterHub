import { Component, ChangeDetectionStrategy, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AdminPermissionService } from '../../../core/services/admin-permission.service';
import { NotificationService } from '../../../core/services/notification.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { AdminStatTileComponent } from '../../../shared/components/admin/admin-stat-tile.component';
import { AdminPayment } from '../../../core/models/admin.model';

@Component({
  selector: 'app-subscriptions-overview',
  standalone: true,
  imports: [FormsModule, DatePipe, TitleCasePipe, IconComponent, BadgeComponent, AdminStatTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto space-y-5">
      <h1 class="text-2xl font-bold text-content-primary">Subscriptions &amp; Payments</h1>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <app-admin-stat-tile label="Revenue today" icon="credit-card" [loading]="loading()" [value]="'₹' + (revenue()?.today ?? '0')" />
        <app-admin-stat-tile label="Revenue this month" icon="credit-card" [loading]="loading()" [value]="'₹' + (revenue()?.thisMonth ?? '0')" />
        <app-admin-stat-tile label="Revenue this year" icon="credit-card" [loading]="loading()" [value]="'₹' + (revenue()?.thisYear ?? '0')" />
        <app-admin-stat-tile label="Total revenue" icon="credit-card" [loading]="loading()" [value]="'₹' + (revenue()?.total ?? '0')" />

        <app-admin-stat-tile label="Active subscriptions" [loading]="loading()" [value]="subStats()?.totalActive ?? '—'" />
        <app-admin-stat-tile label="Monthly plan" [loading]="loading()" [value]="subStats()?.totalMonthly ?? '—'" />
        <app-admin-stat-tile label="Yearly plan" [loading]="loading()" [value]="subStats()?.totalYearly ?? '—'" />
        <app-admin-stat-tile label="Expiring within 7 days" [loading]="loading()" [value]="subStats()?.expiringSoon ?? '—'" />
      </div>

      <div class="card-elevated p-4 flex flex-wrap items-center gap-2.5">
        <select class="input w-auto" [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()">
          <option value="">All statuses</option>
          <option value="captured">Captured</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <select class="input w-auto" [(ngModel)]="planFilter" (ngModelChange)="onFilterChange()">
          <option value="">All plans</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="lifetime">Lifetime</option>
        </select>
      </div>

      <div class="card-elevated overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-elevated border-b border-border">
              <tr class="text-left text-xs font-semibold uppercase tracking-wide text-content-muted">
                <th class="px-4 py-3">Invoice</th>
                <th class="px-4 py-3">User</th>
                <th class="px-4 py-3">Plan</th>
                <th class="px-4 py-3">Amount</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">Date</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              @if (loading()) {
                @for (i of [1,2,3,4,5]; track i) {
                  <tr><td colspan="7" class="px-4 py-3"><div class="h-6 rounded bg-slate-100 dark:bg-slate-800 animate-pulse"></div></td></tr>
                }
              } @else if (payments().length === 0) {
                <tr><td colspan="7" class="px-4 py-10 text-center text-content-muted">No payments match these filters.</td></tr>
              } @else {
                @for (p of payments(); track p._id) {
                  <tr class="hover:bg-elevated transition-colors">
                    <td class="px-4 py-2.5 text-content-secondary">{{ p.invoiceNumber || '—' }}</td>
                    <td class="px-4 py-2.5 text-content-secondary">{{ ownerLabel(p) }}</td>
                    <td class="px-4 py-2.5 text-content-primary">{{ p.plan | titlecase }}</td>
                    <td class="px-4 py-2.5 font-medium text-content-primary">₹{{ (p.amount / 100).toFixed(2) }}</td>
                    <td class="px-4 py-2.5"><app-badge [variant]="p.status === 'captured' ? 'success' : p.status === 'refunded' ? 'warning' : 'danger'" size="sm">{{ p.status | titlecase }}</app-badge></td>
                    <td class="px-4 py-2.5 text-content-muted">{{ p.createdAt | date: 'mediumDate' }}</td>
                    <td class="px-4 py-2.5 text-right">
                      @if (perms.can('payments.manage') && p.status === 'captured') {
                        <button type="button" class="btn-secondary btn-xs" (click)="refund(p)">Refund</button>
                      }
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
        <div class="flex items-center justify-between px-4 py-3 border-t border-border text-sm">
          <p class="text-content-muted">Page {{ page() }} of {{ totalPages() }}</p>
          <div class="flex gap-2">
            <button type="button" class="btn-secondary btn-xs" [disabled]="page() <= 1" (click)="goPage(page() - 1)">Previous</button>
            <button type="button" class="btn-secondary btn-xs" [disabled]="page() >= totalPages()" (click)="goPage(page() + 1)">Next</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SubscriptionsOverviewComponent implements OnInit {
  private adminService = inject(AdminService);
  private notify = inject(NotificationService);
  readonly perms = inject(AdminPermissionService);

  readonly loading = signal(true);
  readonly revenue = signal<{ today: string; thisMonth: string; thisYear: string; total: string } | null>(null);
  readonly subStats = signal<{ totalActive: number; totalMonthly: number; totalYearly: number; expiringSoon: number } | null>(null);

  readonly payments = signal<AdminPayment[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly limit = 25;
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.limit)));
  statusFilter = '';
  planFilter = '';
  private filterDebounce?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.adminService.getRevenue().subscribe({ next: (res) => this.revenue.set(res.data) });
    this.adminService.getDetailedSubscriptionStats().subscribe({ next: (res) => this.subStats.set(res.data) });
    this.load();
  }

  onFilterChange(): void {
    clearTimeout(this.filterDebounce);
    this.filterDebounce = setTimeout(() => { this.page.set(1); this.load(); }, 300);
  }
  goPage(p: number): void { this.page.set(p); this.load(); }

  load(): void {
    this.loading.set(true);
    const params: Record<string, string> = { page: String(this.page()), limit: String(this.limit) };
    if (this.statusFilter) params['status'] = this.statusFilter;
    if (this.planFilter) params['plan'] = this.planFilter;
    this.adminService.getPayments(params).subscribe({
      next: (res) => { this.payments.set(res.data); this.total.set(res.pagination.total); this.loading.set(false); },
      error: () => { this.loading.set(false); this.notify.error('Failed to load payments'); },
    });
  }

  ownerLabel(p: AdminPayment): string {
    return typeof p.userId === 'string' ? p.userId : (p.userId?.name || p.userId?.email || '—');
  }

  refund(p: AdminPayment): void {
    const reason = prompt(`Refund ₹${(p.amount / 100).toFixed(2)} for invoice ${p.invoiceNumber}? Enter a reason:`);
    if (reason === null) return;
    this.adminService.refundPayment(p._id, { reason }).subscribe({
      next: () => { this.notify.success('Payment refunded'); this.load(); },
      error: (err) => this.notify.error('Refund failed', err?.error?.message),
    });
  }
}
