import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { AdminService } from '../../../core/services/admin.service';
import { AdminPermissionService } from '../../../core/services/admin-permission.service';
import { AdminStatTileComponent } from '../../../shared/components/admin/admin-stat-tile.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AdminStats, QueueStats, TrendingTool, ActivityLogEntry } from '../../../core/models/admin.model';

interface RevenueSummary {
  today: string; thisMonth: string; thisYear: string; total: string; totalPayments: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, AdminStatTileComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-content-primary">Dashboard</h1>
        <p class="text-sm text-content-muted mt-1">Real-time platform overview.</p>
      </div>

      @if (loadError()) {
        <div class="card-elevated p-6 flex items-center gap-3 border-red-200 dark:border-red-900">
          <app-icon name="close" [size]="18" class="text-red-500 shrink-0" />
          <div>
            <p class="text-sm font-semibold text-content-primary">Couldn't load dashboard data</p>
            <p class="text-xs text-content-muted">{{ loadError() }}</p>
          </div>
          <button type="button" class="btn-secondary btn-sm ml-auto" (click)="load()">Retry</button>
        </div>
      } @else {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <app-admin-stat-tile label="Total Users" icon="users" [loading]="loading()" [value]="stats()?.users?.total ?? '—'" />
          <app-admin-stat-tile label="New Users Today" icon="trending-up" [loading]="loading()" [value]="stats()?.users?.today ?? '—'" />
          <app-admin-stat-tile label="Active Users (7d)" icon="activity" [loading]="loading()" [value]="stats()?.users?.active ?? '—'" />
          <app-admin-stat-tile label="Active Subscriptions" icon="credit-card" [loading]="loading()" [value]="subStats()?.totalActive ?? '—'" />

          <app-admin-stat-tile label="Portfolios Created" icon="globe" [loading]="loading()" [value]="portfoliosTotal() ?? '—'" />
          <app-admin-stat-tile label="Published Websites" icon="globe" [loading]="loading()" [value]="publishedTotal() ?? '—'" />
          <app-admin-stat-tile label="File Conversions" icon="file-text" [loading]="loading()" [value]="stats()?.conversions?.total ?? '—'" />
          <app-admin-stat-tile label="Failed Conversions" icon="file-text" [loading]="loading()" [value]="stats()?.conversions?.failed ?? '—'" />

          <app-admin-stat-tile label="Revenue Today" icon="credit-card" [loading]="loading()" [value]="'₹' + (revenue()?.today ?? '0')" />
          <app-admin-stat-tile label="Revenue This Month" icon="credit-card" [loading]="loading()" [value]="'₹' + (revenue()?.thisMonth ?? '0')" />
          <app-admin-stat-tile label="Queue: Waiting" icon="database" [loading]="loading()" [value]="queue()?.waiting ?? '—'" />
          <app-admin-stat-tile label="Queue: Failed" icon="database" [loading]="loading()" [value]="queue()?.failed ?? '—'" />
        </div>

        <div class="grid lg:grid-cols-2 gap-4">
          <div class="card-elevated p-5">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-sm font-bold text-content-primary">Top tools (7 days)</h2>
              <a routerLink="/admin/analytics" class="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">View analytics →</a>
            </div>
            @if (loading()) {
              <div class="space-y-2">
                @for (i of [1,2,3,4]; track i) { <div class="h-8 rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse"></div> }
              </div>
            } @else if (trending().length === 0) {
              <p class="text-sm text-content-muted py-4">No tool usage recorded yet.</p>
            } @else {
              <div class="space-y-1">
                @for (t of trending(); track t.tool) {
                  <div class="flex items-center justify-between py-1.5 text-sm">
                    <span class="text-content-secondary">{{ t.tool }}</span>
                    <span class="font-semibold text-content-primary tabular-nums">{{ t.count }}</span>
                  </div>
                }
              </div>
            }
          </div>

          <div class="card-elevated p-5">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-sm font-bold text-content-primary">Recent activity</h2>
              @if (perms.can('activity.view')) {
                <a routerLink="/admin/activity" class="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">View all →</a>
              }
            </div>
            @if (!perms.can('activity.view')) {
              <p class="text-sm text-content-muted py-4">You don't have permission to view activity logs.</p>
            } @else if (loading()) {
              <div class="space-y-2">
                @for (i of [1,2,3]; track i) { <div class="h-10 rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse"></div> }
              </div>
            } @else if (recentActivity().length === 0) {
              <p class="text-sm text-content-muted py-4">No activity recorded yet — this log starts tracking from today.</p>
            } @else {
              <div class="divide-y divide-border">
                @for (entry of recentActivity(); track entry._id) {
                  <div class="py-2 text-sm">
                    <p class="text-content-primary"><span class="font-medium">{{ entry.actorEmail }}</span> — {{ entry.action }}</p>
                    <p class="text-xs text-content-muted">{{ entry.createdAt | date: 'short' }}</p>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  readonly perms = inject(AdminPermissionService);

  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly stats = signal<AdminStats | null>(null);
  readonly revenue = signal<RevenueSummary | null>(null);
  readonly subStats = signal<{ totalActive: number } | null>(null);
  readonly queue = signal<QueueStats | null>(null);
  readonly trending = signal<TrendingTool[]>([]);
  readonly recentActivity = signal<ActivityLogEntry[]>([]);
  readonly portfoliosTotal = signal<number | null>(null);
  readonly publishedTotal = signal<number | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.loadError.set(null);

    forkJoin({
      overview: this.adminService.getOverview(),
      revenue: this.adminService.getRevenue(),
      subStats: this.adminService.getDetailedSubscriptionStats(),
      queue: this.adminService.getQueueStats(),
      trending: this.adminService.getTrending(6, 7),
      portfolios: this.adminService.getPortfolios({ limit: '1' }),
      published: this.adminService.getPortfolios({ limit: '1', status: 'published' }),
      activity: this.perms.can('activity.view') ? this.adminService.getActivityLogs({ limit: '6' }) : of(null),
    }).subscribe({
      next: (res) => {
        this.stats.set(res.overview.data);
        this.revenue.set(res.revenue.data);
        this.subStats.set(res.subStats.data);
        this.queue.set(res.queue.data.stats);
        this.trending.set(res.trending.data.trending);
        this.portfoliosTotal.set(res.portfolios.pagination.total);
        this.publishedTotal.set(res.published.pagination.total);
        if (res.activity) this.recentActivity.set(res.activity.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loadError.set(err?.error?.message || 'The backend may be unreachable.');
        this.loading.set(false);
      },
    });
  }
}
