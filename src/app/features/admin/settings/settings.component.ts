import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Plan } from '../../../core/models/admin.model';

interface LogEntry { timestamp: string; level: string; message: string; meta?: any; }

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-6">Settings</h1>

      <!-- Plans -->
      <div class="mb-6">
        <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Subscription Plans</h2>
        <div *ngIf="loadingPlans()" class="text-slate-400 text-sm">Loading...</div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4" *ngIf="!loadingPlans()">
          <div *ngFor="let plan of plans()" class="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-bold text-slate-800 dark:text-white capitalize">{{ plan.id }}</span>
              <span class="text-lg font-semibold text-indigo-600">\${{ plan.price }}/mo</span>
            </div>
            <ng-container *ngIf="editingPlan !== plan.id; else editingTpl">
              <ul class="space-y-1 text-xs text-slate-600 dark:text-slate-400 mb-3">
                <li>Conversions/day: <strong>{{ plan.limits.conversionsPerDay ?? '∞' }}</strong></li>
                <li>Max file size: <strong>{{ plan.limits.maxFileSizeMb ?? '–' }} MB</strong></li>
                <li>AI requests/day: <strong>{{ plan.limits.aiRequestsPerDay ?? 0 }}</strong></li>
                <li>Max files/batch: <strong>{{ plan.limits.maxBatchFiles ?? 1 }}</strong></li>
              </ul>
              <button (click)="startEditPlan(plan)" class="text-xs text-indigo-500 hover:text-indigo-700">Edit limits</button>
            </ng-container>
            <ng-template #editingTpl>
              <div class="space-y-2 mb-3">
                <div>
                  <label class="text-xs text-slate-500">Conversions/day (0=∞)</label>
                  <input type="number" [(ngModel)]="planForm.conversionsPerDay" class="w-full mt-0.5 px-2 py-1 text-sm rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white" />
                </div>
                <div>
                  <label class="text-xs text-slate-500">Max file size (MB)</label>
                  <input type="number" [(ngModel)]="planForm.maxFileSizeMb" class="w-full mt-0.5 px-2 py-1 text-sm rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white" />
                </div>
                <div>
                  <label class="text-xs text-slate-500">AI requests/day</label>
                  <input type="number" [(ngModel)]="planForm.aiRequestsPerDay" class="w-full mt-0.5 px-2 py-1 text-sm rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white" />
                </div>
                <div>
                  <label class="text-xs text-slate-500">Max files/batch</label>
                  <input type="number" [(ngModel)]="planForm.maxFilesPerBatch" class="w-full mt-0.5 px-2 py-1 text-sm rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white" />
                </div>
              </div>
              <div class="flex gap-2">
                <button (click)="savePlan(plan.id)" class="flex-1 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
                <button (click)="editingPlan = null" class="flex-1 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">Cancel</button>
              </div>
            </ng-template>
          </div>
        </div>
      </div>

      <!-- Error Logs -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div class="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-300">Recent Error Logs</h2>
          <button (click)="loadLogs()" class="text-xs text-indigo-500 hover:text-indigo-700">Refresh</button>
        </div>
        <div *ngIf="loadingLogs()" class="p-6 text-center text-slate-400 text-sm">Loading...</div>
        <div *ngIf="!loadingLogs() && !logs().length" class="p-6 text-center text-slate-400 text-sm">No error logs found</div>
        <div *ngIf="!loadingLogs() && logs().length" class="divide-y divide-slate-100 dark:divide-slate-700 max-h-96 overflow-y-auto">
          <div *ngFor="let log of logs()" class="px-4 py-3 font-mono text-xs">
            <div class="flex gap-3 items-start">
              <span class="text-slate-400 shrink-0">{{ log.timestamp | date:'short' }}</span>
              <span [class]="levelColor(log.level)" class="shrink-0 font-semibold uppercase">{{ log.level }}</span>
              <span class="text-slate-700 dark:text-slate-300 break-all">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SettingsComponent implements OnInit {
  readonly plans       = signal<Plan[]>([]);
  readonly logs        = signal<LogEntry[]>([]);
  readonly loadingPlans = signal(true);
  readonly loadingLogs  = signal(true);

  editingPlan: string | null = null;
  planForm: any = {};

  constructor(private adminService: AdminService, private notify: NotificationService) {}

  ngOnInit(): void { this.loadPlans(); this.loadLogs(); }

  loadPlans(): void {
    this.adminService.getPlans().subscribe({
      next: (r) => { this.plans.set(r.data); this.loadingPlans.set(false); },
      error: () => this.loadingPlans.set(false),
    });
  }

  loadLogs(): void {
    this.loadingLogs.set(true);
    this.adminService.getErrorLogs(100).subscribe({
      next: (r) => { this.logs.set(r.data as LogEntry[]); this.loadingLogs.set(false); },
      error: () => this.loadingLogs.set(false),
    });
  }

  startEditPlan(plan: Plan): void {
    this.editingPlan = plan.id;
    this.planForm = {
      conversionsPerDay: plan.limits.conversionsPerDay ?? 0,
        maxFileSizeMb: plan.limits.maxFileSizeMb ?? 10,
        aiRequestsPerDay: plan.limits.aiRequestsPerDay ?? 0,
        maxFilesPerBatch: plan.limits.maxBatchFiles ?? 1,
    };
  }

  savePlan(id: string): void {
    this.adminService.updatePlan(id, { limits: this.planForm }).subscribe({
      next: () => { this.notify.success('Plan updated'); this.editingPlan = null; this.loadPlans(); },
      error: (err) => this.notify.error(err?.error?.message || 'Failed'),
    });
  }

  levelColor(level: string): string {
    const m: Record<string, string> = { error: 'text-red-500', warn: 'text-amber-500', info: 'text-blue-500' };
    return m[level] || 'text-slate-400';
  }
}
