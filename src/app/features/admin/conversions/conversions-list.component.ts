import { Component, ChangeDetectionStrategy, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe, DecimalPipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AdminPermissionService } from '../../../core/services/admin-permission.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { AdminStatTileComponent } from '../../../shared/components/admin/admin-stat-tile.component';
import { AdminConversion, QueueStats } from '../../../core/models/admin.model';

interface FailedJob {
  id: string; name: string; failedReason: string; attemptsMade: number; timestamp: number;
}

type ConvTab = 'history' | 'queue';

@Component({
  selector: 'app-conversions-list',
  standalone: true,
  imports: [FormsModule, DatePipe, TitleCasePipe, DecimalPipe, BadgeComponent, AdminStatTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto space-y-5">
      <h1 class="text-2xl font-bold text-content-primary">File Conversions</h1>

      <div class="flex gap-1 border-b border-border">
        <button type="button" class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors"
          [class]="tab() === 'history' ? 'border-primary-600 text-primary-600 dark:text-primary-400' : 'border-transparent text-content-muted hover:text-content-primary'"
          (click)="tab.set('history')">History</button>
        <button type="button" class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors"
          [class]="tab() === 'queue' ? 'border-primary-600 text-primary-600 dark:text-primary-400' : 'border-transparent text-content-muted hover:text-content-primary'"
          (click)="tab.set('queue'); loadQueue()">Live Queue</button>
      </div>

      @if (tab() === 'history') {
        <div class="card-elevated p-4 flex flex-wrap items-center gap-2.5">
          <select class="input w-auto" [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()">
            <option value="">All statuses</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          <input class="input w-auto" placeholder="Filter by tool…" [(ngModel)]="toolFilter" (ngModelChange)="onFilterChange()">
        </div>

        <div class="card-elevated overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-elevated border-b border-border">
                <tr class="text-left text-xs font-semibold uppercase tracking-wide text-content-muted">
                  <th class="px-4 py-3">Tool</th>
                  <th class="px-4 py-3">User</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3">Size</th>
                  <th class="px-4 py-3">Time</th>
                  <th class="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                @if (loading()) {
                  @for (i of [1,2,3,4,5]; track i) {
                    <tr><td colspan="6" class="px-4 py-3"><div class="h-6 rounded bg-slate-100 dark:bg-slate-800 animate-pulse"></div></td></tr>
                  }
                } @else if (conversions().length === 0) {
                  <tr><td colspan="6" class="px-4 py-10 text-center text-content-muted">No conversions match these filters.</td></tr>
                } @else {
                  @for (c of conversions(); track c._id) {
                    <tr class="hover:bg-elevated transition-colors" [title]="c.errorMessage || ''">
                      <td class="px-4 py-2.5 font-medium text-content-primary">{{ c.tool }}</td>
                      <td class="px-4 py-2.5 text-content-secondary">{{ c.user?.email || 'Guest' }}</td>
                      <td class="px-4 py-2.5"><app-badge [variant]="c.status === 'completed' ? 'success' : c.status === 'failed' ? 'danger' : 'warning'" size="sm">{{ c.status | titlecase }}</app-badge></td>
                      <td class="px-4 py-2.5 text-content-muted">{{ formatBytes(c.inputSizeBytes) }}</td>
                      <td class="px-4 py-2.5 text-content-muted">{{ c.processingTimeMs ? (c.processingTimeMs / 1000 | number: '1.1-1') + 's' : '—' }}</td>
                      <td class="px-4 py-2.5 text-content-muted">{{ c.createdAt | date: 'short' }}</td>
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
      } @else {
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <app-admin-stat-tile label="Waiting" [loading]="queueLoading()" [value]="queue()?.waiting ?? '—'" />
          <app-admin-stat-tile label="Active" [loading]="queueLoading()" [value]="queue()?.active ?? '—'" />
          <app-admin-stat-tile label="Completed" [loading]="queueLoading()" [value]="queue()?.completed ?? '—'" />
          <app-admin-stat-tile label="Failed" [loading]="queueLoading()" [value]="queue()?.failed ?? '—'" />
          <app-admin-stat-tile label="Delayed" [loading]="queueLoading()" [value]="queue()?.delayed ?? '—'" />
        </div>

        <div class="card-elevated overflow-hidden">
          <div class="px-4 py-3 border-b border-border flex items-center justify-between">
            <h2 class="text-sm font-bold text-content-primary">Failed jobs</h2>
            <button type="button" class="btn-secondary btn-xs" (click)="loadQueue()">Refresh</button>
          </div>
          @if (queueLoading()) {
            <div class="p-4 space-y-2">
              @for (i of [1,2,3]; track i) { <div class="h-10 rounded bg-slate-100 dark:bg-slate-800 animate-pulse"></div> }
            </div>
          } @else if (failedJobs().length === 0) {
            <p class="p-6 text-center text-content-muted text-sm">No failed jobs in the queue.</p>
          } @else {
            <div class="divide-y divide-border">
              @for (j of failedJobs(); track j.id) {
                <div class="p-3.5 flex items-center gap-3">
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-content-primary">{{ j.name }} <span class="text-content-muted font-normal">· {{ j.attemptsMade }} attempts</span></p>
                    <p class="text-xs text-red-600 dark:text-red-400 truncate">{{ j.failedReason }}</p>
                  </div>
                  @if (perms.can('conversions.manage')) {
                    <button type="button" class="btn-secondary btn-xs shrink-0" (click)="retry(j.id)">Retry</button>
                    <button type="button" class="btn-danger btn-xs shrink-0" (click)="remove(j.id)">Remove</button>
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class ConversionsListComponent implements OnInit {
  private adminService = inject(AdminService);
  private notify = inject(NotificationService);
  readonly perms = inject(AdminPermissionService);

  readonly tab = signal<ConvTab>('history');

  readonly conversions = signal<AdminConversion[]>([]);
  readonly loading = signal(true);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly limit = 25;
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.limit)));
  statusFilter = '';
  toolFilter = '';
  private filterDebounce?: ReturnType<typeof setTimeout>;

  readonly queue = signal<QueueStats | null>(null);
  readonly failedJobs = signal<FailedJob[]>([]);
  readonly queueLoading = signal(false);
  private queueLoaded = false;

  ngOnInit(): void { this.load(); }

  onFilterChange(): void {
    clearTimeout(this.filterDebounce);
    this.filterDebounce = setTimeout(() => { this.page.set(1); this.load(); }, 300);
  }
  goPage(p: number): void { this.page.set(p); this.load(); }

  load(): void {
    this.loading.set(true);
    const params: Record<string, string> = { page: String(this.page()), limit: String(this.limit) };
    if (this.statusFilter) params['status'] = this.statusFilter;
    if (this.toolFilter) params['tool'] = this.toolFilter;
    this.adminService.getConversions(params).subscribe({
      next: (res) => { this.conversions.set(res.data); this.total.set(res.pagination.total); this.loading.set(false); },
      error: () => { this.loading.set(false); this.notify.error('Failed to load conversions'); },
    });
  }

  loadQueue(): void {
    this.queueLoading.set(true);
    this.adminService.getQueueStats().subscribe({ next: (res) => this.queue.set(res.data.stats) });
    this.adminService.getFailedJobs().subscribe({
      next: (res) => { this.failedJobs.set((res.data as any).jobs ?? []); this.queueLoading.set(false); this.queueLoaded = true; },
      error: () => { this.queueLoading.set(false); },
    });
  }

  retry(jobId: string): void {
    this.adminService.retryJob(jobId).subscribe({
      next: () => { this.notify.success('Job queued for retry'); this.loadQueue(); },
      error: () => this.notify.error('Retry failed'),
    });
  }

  remove(jobId: string): void {
    if (!confirm('Remove this job from the queue?')) return;
    this.adminService.removeJob(jobId).subscribe({
      next: () => { this.notify.success('Job removed'); this.loadQueue(); },
      error: () => this.notify.error('Remove failed'),
    });
  }

  formatBytes(bytes?: number): string {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
