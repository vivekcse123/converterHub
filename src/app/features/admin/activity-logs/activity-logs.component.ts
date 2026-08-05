import { Component, ChangeDetectionStrategy, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ActivityLogEntry } from '../../../core/models/admin.model';

@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [FormsModule, DatePipe, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto space-y-5">
      <div>
        <h1 class="text-2xl font-bold text-content-primary">Activity Logs</h1>
        <p class="text-sm text-content-muted mt-1">Audit trail of admin actions — this log starts tracking from when it shipped, no historical backfill.</p>
      </div>

      <div class="card-elevated p-4 flex flex-wrap items-center gap-2.5">
        <input class="input w-auto" placeholder="Filter by action (e.g. user.ban)…" [(ngModel)]="actionFilter" (ngModelChange)="onFilterChange()">
        <input class="input w-auto" placeholder="Filter by target type…" [(ngModel)]="targetTypeFilter" (ngModelChange)="onFilterChange()">
      </div>

      <div class="card-elevated overflow-hidden">
        @if (loading()) {
          <div class="p-4 space-y-2">
            @for (i of [1,2,3,4,5]; track i) { <div class="h-12 rounded bg-slate-100 dark:bg-slate-800 animate-pulse"></div> }
          </div>
        } @else if (logs().length === 0) {
          <p class="p-10 text-center text-content-muted text-sm">No activity recorded yet — this log starts tracking from today.</p>
        } @else {
          <div class="divide-y divide-border">
            @for (entry of logs(); track entry._id) {
              <div class="p-4">
                <div class="flex items-center justify-between gap-3 flex-wrap">
                  <p class="text-sm text-content-primary">
                    <span class="font-semibold">{{ entry.actorEmail }}</span>
                    <span class="text-content-muted"> ({{ entry.actorRole }})</span>
                    — <span class="font-medium">{{ entry.action }}</span>
                    @if (entry.targetLabel) { <span class="text-content-muted"> on {{ entry.targetType }} "{{ entry.targetLabel }}"</span> }
                  </p>
                  <p class="text-xs text-content-muted shrink-0">{{ entry.createdAt | date: 'medium' }}</p>
                </div>
                @if (entry.metadata && objectKeys(entry.metadata).length > 0) {
                  <pre class="mt-2 text-[11px] text-content-muted bg-elevated rounded-md p-2 overflow-x-auto">{{ entry.metadata | json }}</pre>
                }
              </div>
            }
          </div>
        }

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
export class ActivityLogsComponent implements OnInit {
  private adminService = inject(AdminService);
  private notify = inject(NotificationService);

  readonly logs = signal<ActivityLogEntry[]>([]);
  readonly loading = signal(true);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly limit = 30;
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.limit)));

  actionFilter = '';
  targetTypeFilter = '';
  private filterDebounce?: ReturnType<typeof setTimeout>;

  ngOnInit(): void { this.load(); }

  onFilterChange(): void {
    clearTimeout(this.filterDebounce);
    this.filterDebounce = setTimeout(() => { this.page.set(1); this.load(); }, 300);
  }
  goPage(p: number): void { this.page.set(p); this.load(); }

  load(): void {
    this.loading.set(true);
    const params: Record<string, string> = { page: String(this.page()), limit: String(this.limit) };
    if (this.actionFilter) params['action'] = this.actionFilter;
    if (this.targetTypeFilter) params['targetType'] = this.targetTypeFilter;
    this.adminService.getActivityLogs(params).subscribe({
      next: (res) => { this.logs.set(res.data); this.total.set(res.pagination.total); this.loading.set(false); },
      error: () => { this.loading.set(false); this.notify.error('Failed to load activity logs'); },
    });
  }

  objectKeys(obj: Record<string, unknown>): string[] { return Object.keys(obj); }
}
