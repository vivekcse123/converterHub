import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { NotificationService } from '../../../core/services/notification.service';
import { QueueStats } from '../../../core/models/admin.model';

interface FailedJob { id: string; name: string; data: any; failedReason: string; processedOn?: number; }

@Component({
  selector: 'app-jobs-monitor',
  standalone: true,
  imports: [],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">Jobs Monitor</h1>
        <button (click)="refresh()" class="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 text-sm font-medium transition-colors">
          ↻ Refresh
        </button>
      </div>

      <!-- Queue Stats -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        @for (stat of statsCards(); track $index) {
        <div class="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
          <div class="text-2xl font-bold" [class]="stat.color">{{ stat.value }}</div>
          <div class="text-xs text-slate-500 mt-0.5">{{ stat.label }}</div>
        </div>
        }
      </div>

      <!-- Failed Jobs -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div class="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-300">Failed Jobs</h2>
          <span class="text-xs text-slate-400">{{ failedJobs().length }} jobs</span>
        </div>
        @if (loading()) {
        <div class="p-8 text-center text-slate-400">Loading...</div>
        }
        @if (!loading() && !failedJobs().length) {
        <div class="p-8 text-center text-slate-400">
          <div class="text-3xl mb-2">✓</div>
          <div class="text-sm">No failed jobs</div>
        </div>
        }
        @if (!loading() && failedJobs().length) {
        <table class="w-full text-sm">
          <thead class="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Job ID</th>
              <th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Tool</th>
              <th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Error</th>
              <th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Time</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
            @for (job of failedJobs(); track job.id) {
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <td class="px-4 py-3 text-xs font-mono text-slate-600 dark:text-slate-400">{{ job.id }}</td>
              <td class="px-4 py-3 text-xs text-slate-700 dark:text-slate-300">{{ formatTool(job.name) }}</td>
              <td class="px-4 py-3 text-xs text-red-500 max-w-xs truncate" [title]="job.failedReason">{{ job.failedReason }}</td>
              <td class="px-4 py-3 text-xs text-slate-500">{{ formatTime(job.processedOn) }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button (click)="retryJob(job.id)" class="text-xs text-indigo-500 hover:text-indigo-700">Retry</button>
                  <button (click)="removeJob(job.id)" class="text-xs text-red-400 hover:text-red-600">Remove</button>
                </div>
              </td>
            </tr>
            }
          </tbody>
        </table>
        }
      </div>
    </div>
  `,
})
export class JobsMonitorComponent implements OnInit, OnDestroy {
  readonly loading    = signal(true);
  readonly failedJobs = signal<FailedJob[]>([]);
  readonly statsCards = signal<{ label: string; value: number; color: string }[]>([]);

  private refreshInterval: any;

  constructor(private adminService: AdminService, private notify: NotificationService) {}

  ngOnInit(): void {
    this.refresh();
    this.refreshInterval = setInterval(() => this.refresh(), 15000);
  }

  ngOnDestroy(): void { clearInterval(this.refreshInterval); }

  refresh(): void {
    this.adminService.getQueueStats().subscribe({
      next: (r) => {
        const s: QueueStats = (r.data as any)?.stats ?? r.data ?? {};
        this.statsCards.set([
          { label: 'Waiting',   value: s.waiting   ?? 0, color: 'text-amber-500' },
          { label: 'Active',    value: s.active    ?? 0, color: 'text-blue-500' },
          { label: 'Completed', value: s.completed ?? 0, color: 'text-emerald-500' },
          { label: 'Failed',    value: s.failed    ?? 0, color: 'text-red-500' },
          { label: 'Delayed',   value: s.delayed   ?? 0, color: 'text-purple-500' },
        ]);
      },
      error: () => {},
    });
    this.adminService.getFailedJobs().subscribe({
      next: (r) => {
        const jobs = (r.data as any)?.jobs ?? (Array.isArray(r.data) ? r.data : []);
        this.failedJobs.set(jobs as FailedJob[]);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  retryJob(id: string): void {
    this.adminService.retryJob(id).subscribe({
      next: () => { this.notify.success('Job queued for retry'); this.refresh(); },
      error: (err) => this.notify.error(err?.error?.message || 'Failed'),
    });
  }

  removeJob(id: string): void {
    if (!confirm('Remove this failed job?')) return;
    this.adminService.removeJob(id).subscribe({
      next: () => { this.notify.success('Job removed'); this.refresh(); },
      error: (err) => this.notify.error(err?.error?.message || 'Failed'),
    });
  }

  formatTool(name: string): string { return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); }
  formatTime(ms?: number): string  { return ms ? new Date(ms).toLocaleString() : '–'; }
}
