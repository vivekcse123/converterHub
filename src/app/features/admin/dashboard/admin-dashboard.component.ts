import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService }  from '../../../core/services/admin.service';
import { AdminStats, ToolStat, QueueStats } from '../../../core/models/admin.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div>
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-6">Dashboard Overview</h1>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div *ngFor="let card of statCards()" class="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="text-3xl mb-1">{{ card.icon }}</div>
          <div class="text-2xl font-bold text-slate-800 dark:text-white">{{ card.value }}</div>
          <div class="text-sm text-slate-500">{{ card.label }}</div>
        </div>
      </div>

      <!-- Queue Status & Tool Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Queue Stats -->
        <div class="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 class="font-semibold text-slate-700 dark:text-slate-200 mb-4">Queue Status</h2>
          <div *ngIf="queueStats() as q" class="space-y-3">
            <div *ngFor="let item of queueItems(q)" class="flex justify-between items-center">
              <span class="text-sm text-slate-600 dark:text-slate-400">{{ item.label }}</span>
              <span class="font-medium text-slate-800 dark:text-white">{{ item.value }}</span>
            </div>
          </div>
          <div *ngIf="!queueStats()" class="text-sm text-slate-400">Redis not available — running in sync mode</div>
        </div>

        <!-- Top Tools -->
        <div class="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 class="font-semibold text-slate-700 dark:text-slate-200 mb-4">Top Tools (30 days)</h2>
          <div class="space-y-2">
            <div *ngFor="let tool of topTools()" class="flex justify-between items-center">
              <span class="text-sm font-mono text-indigo-600 dark:text-indigo-400">{{ tool._id }}</span>
              <div class="flex gap-3 text-sm">
                <span class="text-slate-700 dark:text-slate-200">{{ tool.count }}</span>
                <span class="text-red-500">{{ tool.failed }} fail</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <a routerLink="/admin/users" class="bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg p-4 text-center transition-colors">
          <div class="text-2xl mb-1">👥</div>
          <div class="text-sm font-medium text-indigo-700 dark:text-indigo-300">Manage Users</div>
        </a>
        <a routerLink="/admin/analytics" class="bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg p-4 text-center transition-colors">
          <div class="text-2xl mb-1">📈</div>
          <div class="text-sm font-medium text-emerald-700 dark:text-emerald-300">View Analytics</div>
        </a>
        <a routerLink="/admin/jobs" class="bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg p-4 text-center transition-colors">
          <div class="text-2xl mb-1">⚙️</div>
          <div class="text-sm font-medium text-amber-700 dark:text-amber-300">Job Monitor</div>
        </a>
        <a routerLink="/admin/settings" class="bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-lg p-4 text-center transition-colors">
          <div class="text-2xl mb-1">🛠</div>
          <div class="text-sm font-medium text-rose-700 dark:text-rose-300">Settings</div>
        </a>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  readonly stats      = signal<AdminStats | null>(null);
  readonly topTools   = signal<ToolStat[]>([]);
  readonly queueStats = signal<QueueStats | null>(null);

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getOverview().subscribe({ next: (r) => this.stats.set(r.data) });
    this.adminService.getToolStats().subscribe({ next: (r) => this.topTools.set((r.data as any[]).slice(0, 8)) });
    this.adminService.getQueueStats().subscribe({ next: (r) => this.queueStats.set(r.data) });
  }

  statCards() {
    const s = this.stats();
    if (!s) return [];
    return [
      { icon: '👥', value: s.users.total,        label: 'Total Users'          },
      { icon: '🆕', value: s.users.today,         label: 'New Users Today'      },
      { icon: '🔄', value: s.conversions.today,   label: 'Conversions Today'    },
      { icon: '⚡', value: s.users.active,         label: 'Active This Week'     },
      { icon: '✅', value: s.conversions.total,   label: 'Total Conversions'    },
      { icon: '❌', value: s.conversions.failed,  label: 'Failed Conversions'   },
      { icon: '📅', value: s.conversions.month,   label: 'Conversions This Month'},
      { icon: '👤', value: s.users.month,          label: 'New Users This Month' },
    ];
  }

  queueItems(q: QueueStats) {
    return [
      { label: 'Waiting',   value: q.waiting   },
      { label: 'Active',    value: q.active     },
      { label: 'Completed', value: q.completed  },
      { label: 'Failed',    value: q.failed     },
      { label: 'Delayed',   value: q.delayed    },
    ];
  }
}
