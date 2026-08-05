import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AdminStatTileComponent } from '../../../shared/components/admin/admin-stat-tile.component';
import { BarChartComponent, BarDatum } from './charts/bar-chart.component';
import { LineChartComponent, LineSeries } from './charts/line-chart.component';
import { DonutChartComponent, DonutDatum } from './charts/donut-chart.component';
import { TrendingTool } from '../../../core/models/admin.model';

const PLAN_COLOR: Record<string, string> = {
  free: '#94a3b8', monthly: 'rgb(var(--color-primary-600))', yearly: '#0ea5e9', lifetime: '#f59e0b',
};
const PLAN_LABEL: Record<string, string> = { free: 'Free', monthly: 'Monthly', yearly: 'Yearly', lifetime: 'Lifetime' };

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [FormsModule, TitleCasePipe, AdminStatTileComponent, BarChartComponent, LineChartComponent, DonutChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <h1 class="text-2xl font-bold text-content-primary">Analytics &amp; Revenue</h1>
        <select class="input w-auto" [(ngModel)]="days" (ngModelChange)="load()">
          <option [value]="7">Last 7 days</option>
          <option [value]="30">Last 30 days</option>
          <option [value]="90">Last 90 days</option>
        </select>
      </div>

      <div class="card-elevated p-5">
        <h2 class="text-sm font-bold text-content-primary mb-4">Conversions &amp; new users</h2>
        @if (loadingDaily()) {
          <div class="h-44 rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
        } @else if (dailySeries().length === 0) {
          <p class="text-sm text-content-muted py-10 text-center">No activity recorded in this range yet.</p>
        } @else {
          <app-line-chart [series]="dailySeries()" />
        }
      </div>

      <div class="grid lg:grid-cols-2 gap-5">
        <div class="card-elevated p-5">
          <h2 class="text-sm font-bold text-content-primary mb-4">Tool usage</h2>
          @if (loadingTools()) {
            <div class="h-40 rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
          } @else if (toolBars().length === 0) {
            <p class="text-sm text-content-muted py-10 text-center">No conversions recorded in this range yet.</p>
          } @else {
            <app-bar-chart [data]="toolBars()" />
          }
        </div>

        <div class="card-elevated p-5">
          <h2 class="text-sm font-bold text-content-primary mb-4">Subscription distribution</h2>
          @if (loadingPlans()) {
            <div class="h-40 rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
          } @else {
            <app-donut-chart [data]="planDonut()" />
          }
        </div>
      </div>

      <div class="card-elevated overflow-hidden">
        <div class="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <h2 class="text-sm font-bold text-content-primary">Trending tools</h2>
        </div>
        @if (trending().length === 0) {
          <p class="p-6 text-center text-content-muted text-sm">No trending data for this range yet.</p>
        } @else {
          <table class="w-full text-sm">
            <thead class="bg-elevated border-b border-border">
              <tr class="text-left text-xs font-semibold uppercase tracking-wide text-content-muted">
                <th class="px-5 py-2.5">Tool</th>
                <th class="px-5 py-2.5">Uses</th>
                <th class="px-5 py-2.5">Failed</th>
                <th class="px-5 py-2.5">Avg time</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              @for (t of toolStats(); track t._id) {
                <tr>
                  <td class="px-5 py-2.5 font-medium text-content-primary">{{ t._id }}</td>
                  <td class="px-5 py-2.5 text-content-secondary tabular-nums">{{ t.count }}</td>
                  <td class="px-5 py-2.5 text-content-secondary tabular-nums">{{ t.failed }}</td>
                  <td class="px-5 py-2.5 text-content-muted">{{ t.avgTime ? (t.avgTime / 1000).toFixed(1) + 's' : '—' }}</td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  `,
})
export class AnalyticsDashboardComponent implements OnInit {
  private adminService = inject(AdminService);

  days = 30;

  readonly loadingDaily = signal(true);
  readonly loadingTools = signal(true);
  readonly loadingPlans = signal(true);

  readonly dailySeries = signal<LineSeries[]>([]);
  readonly toolBars = signal<BarDatum[]>([]);
  readonly toolStats = signal<{ _id: string; count: number; failed: number; avgTime: number }[]>([]);
  readonly planDonut = signal<DonutDatum[]>([]);
  readonly trending = signal<TrendingTool[]>([]);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loadDaily();
    this.loadTools();
    this.loadPlans();
    this.adminService.getTrending(10, this.days).subscribe({ next: (res) => this.trending.set(res.data.trending) });
  }

  private loadDaily(): void {
    this.loadingDaily.set(true);
    this.adminService.getDailyStats(this.days).subscribe({
      next: (res) => {
        // Build a canonical last-N-days date axis so both series align even
        // on days with zero activity (the aggregates only include dates that
        // actually have data).
        const dates: string[] = [];
        for (let i = this.days - 1; i >= 0; i--) {
          const d = new Date(Date.now() - i * 86_400_000);
          dates.push(d.toISOString().slice(0, 10));
        }
        const convMap = new Map(res.data.conversions.map(c => [c._id, c.conversions]));
        const userMap = new Map(res.data.users.map(u => [u._id, u.newUsers]));

        this.dailySeries.set([
          { label: 'Conversions', color: 'rgb(var(--color-primary-600))', points: dates.map(d => ({ x: d.slice(5), y: convMap.get(d) ?? 0 })) },
          { label: 'New users', color: '#0ea5e9', points: dates.map(d => ({ x: d.slice(5), y: userMap.get(d) ?? 0 })) },
        ]);
        this.loadingDaily.set(false);
      },
      error: () => this.loadingDaily.set(false),
    });
  }

  private loadTools(): void {
    this.loadingTools.set(true);
    this.adminService.getToolStats(this.days).subscribe({
      next: (res) => {
        const stats = res.data.stats.slice(0, 10);
        this.toolStats.set(stats);
        this.toolBars.set(stats.map(s => ({ label: s._id, value: s.count })));
        this.loadingTools.set(false);
      },
      error: () => this.loadingTools.set(false),
    });
  }

  private loadPlans(): void {
    this.loadingPlans.set(true);
    this.adminService.getSubscriptionStats().subscribe({
      next: (res) => {
        this.planDonut.set(res.data.stats.map(p => ({
          label: PLAN_LABEL[p._id] ?? p._id,
          value: p.count,
          color: PLAN_COLOR[p._id] ?? '#94a3b8',
        })));
        this.loadingPlans.set(false);
      },
      error: () => this.loadingPlans.set(false),
    });
  }
}
