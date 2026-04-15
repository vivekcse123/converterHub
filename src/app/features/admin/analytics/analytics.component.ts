import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { DailyStat, ToolStat } from '../../../core/models/admin.model';

interface SubscriptionStat { _id: string; count: number; }

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-6">Analytics</h1>

      <!-- Daily Conversions -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-5 mb-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Daily Conversions (last 30 days)</h2>
        <div *ngIf="loadingDaily()" class="text-center text-slate-400 py-8">Loading...</div>
        <div *ngIf="!loadingDaily() && dailyStats().length" class="overflow-x-auto">
          <div class="flex items-end gap-1 h-36">
            <ng-container *ngFor="let d of dailyStats()">
              <div class="flex-1 flex flex-col items-center gap-0.5 group" [title]="d._id + ': ' + d.count">
                <div class="w-full bg-indigo-500 dark:bg-indigo-400 rounded-t transition-all hover:bg-indigo-600"
                     [style.height.%]="barHeight(d.count)"></div>
                <span class="text-[9px] text-slate-400 rotate-45 origin-left whitespace-nowrap hidden group-hover:block absolute mt-1">{{ d._id }}</span>
              </div>
            </ng-container>
          </div>
          <div class="flex justify-between mt-1 text-xs text-slate-400">
            <span>{{ dailyStats()[0]?._id }}</span>
            <span>{{ dailyStats()[dailyStats().length - 1]?._id }}</span>
          </div>
        </div>
        <p *ngIf="!loadingDaily() && !dailyStats().length" class="text-slate-400 text-sm text-center py-8">No data available</p>
      </div>

      <!-- Top Tools + Subscription Distribution -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <!-- Tool Stats -->
        <div class="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Top Tools by Usage</h2>
          <div *ngIf="loadingTools()" class="text-center text-slate-400 py-6">Loading...</div>
          <div *ngIf="!loadingTools()" class="space-y-2">
            <div *ngFor="let t of toolStats(); let i = index" class="flex items-center gap-3">
              <span class="text-xs font-medium text-slate-400 w-4">{{ i + 1 }}</span>
              <span class="text-xs text-slate-700 dark:text-slate-300 flex-1 truncate">{{ formatTool(t._id) }}</span>
              <div class="w-32 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                <div class="bg-indigo-500 h-1.5 rounded-full" [style.width.%]="toolBarWidth(t.count)"></div>
              </div>
              <span class="text-xs text-slate-500 w-10 text-right">{{ t.count }}</span>
            </div>
            <p *ngIf="!toolStats().length" class="text-slate-400 text-sm text-center py-4">No data</p>
          </div>
        </div>

        <!-- Subscription Distribution -->
        <div class="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Subscription Distribution</h2>
          <div *ngIf="loadingSubs()" class="text-center text-slate-400 py-6">Loading...</div>
          <div *ngIf="!loadingSubs()" class="space-y-3">
            <div *ngFor="let s of subStats()" class="flex items-center gap-3">
              <span [class]="planColor(s._id)" class="inline-flex w-16 justify-center px-2 py-0.5 rounded-full text-xs font-medium">{{ s._id }}</span>
              <div class="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div class="h-2 rounded-full" [class]="planBar(s._id)" [style.width.%]="subBarWidth(s.count)"></div>
              </div>
              <span class="text-sm font-semibold text-slate-700 dark:text-slate-300 w-10 text-right">{{ s.count }}</span>
            </div>
            <p *ngIf="!subStats().length" class="text-slate-400 text-sm text-center py-4">No data</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AnalyticsComponent implements OnInit {
  readonly dailyStats  = signal<DailyStat[]>([]);
  readonly toolStats   = signal<ToolStat[]>([]);
  readonly subStats    = signal<SubscriptionStat[]>([]);
  readonly loadingDaily = signal(true);
  readonly loadingTools = signal(true);
  readonly loadingSubs  = signal(true);

  private maxDaily = 0;
  private maxTool  = 0;
  private totalSubs = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getDailyStats(30).subscribe({
      next: (r) => { const d = r.data; this.maxDaily = Math.max(...d.map((x: DailyStat) => x.count), 1); this.dailyStats.set(d); this.loadingDaily.set(false); },
      error: () => this.loadingDaily.set(false),
    });
    this.adminService.getToolStats(15).subscribe({
      next: (r) => { const d = r.data; this.maxTool = d[0]?.count || 1; this.toolStats.set(d); this.loadingTools.set(false); },
      error: () => this.loadingTools.set(false),
    });
    this.adminService.getSubscriptionStats().subscribe({
      next: (r) => { const d = r.data; this.totalSubs = d.reduce((a: number, s: SubscriptionStat) => a + s.count, 0) || 1; this.subStats.set(d); this.loadingSubs.set(false); },
      error: () => this.loadingSubs.set(false),
    });
  }

  barHeight(c: number): number  { return Math.max((c / this.maxDaily) * 100, 2); }
  toolBarWidth(c: number): number { return (c / this.maxTool) * 100; }
  subBarWidth(c: number): number  { return (c / this.totalSubs) * 100; }

  formatTool(id: string): string { return id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); }

  planColor(plan: string): string {
    const m: Record<string, string> = { enterprise: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', team: 'bg-purple-100 text-purple-700', pro: 'bg-blue-100 text-blue-700', free: 'bg-slate-100 text-slate-600' };
    return m[plan] || m['free'];
  }
  planBar(plan: string): string {
    const m: Record<string, string> = { enterprise: 'bg-rose-500', team: 'bg-purple-500', pro: 'bg-blue-500', free: 'bg-slate-400' };
    return m[plan] || 'bg-slate-400';
  }
}
