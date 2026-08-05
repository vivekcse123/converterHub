import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { AdminPermissionService } from '../../../core/services/admin-permission.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Plan, SiteConfig } from '../../../core/models/admin.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <h1 class="text-2xl font-bold text-content-primary">Settings</h1>

      @if (perms.can('settings.branding.manage')) {
        <div class="card-elevated p-5">
          <h2 class="text-sm font-bold text-content-primary mb-4">Site branding</h2>
          @if (siteConfig(); as cfg) {
            <div class="space-y-3">
              <div><label class="label">Site name</label><input class="input" [(ngModel)]="cfg.siteName"></div>
              <div><label class="label">Logo URL</label><input class="input" [(ngModel)]="cfg.logoUrl"></div>
              <div><label class="label">Support email</label><input class="input" [(ngModel)]="cfg.supportEmail"></div>
              <div class="grid grid-cols-3 gap-3">
                <div><label class="label">Twitter</label><input class="input" [(ngModel)]="cfg.social.twitter"></div>
                <div><label class="label">LinkedIn</label><input class="input" [(ngModel)]="cfg.social.linkedin"></div>
                <div><label class="label">GitHub</label><input class="input" [(ngModel)]="cfg.social.github"></div>
              </div>
              <button type="button" class="btn-primary btn-sm" [disabled]="savingBranding()" (click)="saveBranding()">Save branding</button>
            </div>
          }
        </div>
      }

      @if (perms.can('settings.plans.manage')) {
        <div class="card-elevated p-5">
          <h2 class="text-sm font-bold text-content-primary mb-4">Plan limits</h2>
          @if (loadingPlans()) {
            <div class="space-y-2">
              @for (i of [1,2,3]; track i) { <div class="h-10 rounded bg-slate-100 dark:bg-slate-800 animate-pulse"></div> }
            </div>
          } @else {
            <div class="space-y-4">
              @for (plan of plans(); track plan.id) {
                <div class="card-bordered p-4">
                  <div class="flex items-center justify-between mb-3">
                    <p class="font-semibold text-content-primary">{{ plan.name }}</p>
                    <button type="button" class="btn-secondary btn-xs" [disabled]="savingPlan() === plan.id" (click)="savePlan(plan)">Save</button>
                  </div>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div><label class="label">Conversions/day</label><input class="input" type="number" [(ngModel)]="plan.limits.conversionsPerDay"></div>
                    <div><label class="label">AI requests/day</label><input class="input" type="number" [(ngModel)]="plan.limits.aiRequestsPerDay"></div>
                    <div><label class="label">Max file size (MB)</label><input class="input" type="number" [(ngModel)]="plan.limits.maxFileSizeMb"></div>
                    <div><label class="label">Max batch files</label><input class="input" type="number" [(ngModel)]="plan.limits.maxBatchFiles"></div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      @if (perms.can('settings.logs.view')) {
        <div class="card-elevated overflow-hidden">
          <div class="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <h2 class="text-sm font-bold text-content-primary">Recent error logs</h2>
            <button type="button" class="btn-secondary btn-xs" (click)="loadLogs()">Refresh</button>
          </div>
          @if (loadingLogs()) {
            <p class="p-6 text-center text-content-muted text-sm">Loading…</p>
          } @else if (logLines().length === 0) {
            <p class="p-6 text-center text-content-muted text-sm">No errors logged.</p>
          } @else {
            <pre class="p-4 text-[11px] leading-relaxed text-content-secondary overflow-x-auto max-h-96 overflow-y-auto">{{ logLines().join('\n') }}</pre>
          }
        </div>
      }
    </div>
  `,
})
export class SettingsComponent implements OnInit {
  private adminService = inject(AdminService);
  private notify = inject(NotificationService);
  readonly perms = inject(AdminPermissionService);

  readonly siteConfig = signal<SiteConfig | null>(null);
  readonly savingBranding = signal(false);

  readonly plans = signal<Plan[]>([]);
  readonly loadingPlans = signal(true);
  readonly savingPlan = signal<string | null>(null);

  readonly logLines = signal<string[]>([]);
  readonly loadingLogs = signal(true);

  ngOnInit(): void {
    if (this.perms.can('settings.branding.manage')) {
      this.adminService.getSiteConfig().subscribe({ next: (res) => this.siteConfig.set(res.data.config) });
    }
    if (this.perms.can('settings.plans.manage')) {
      this.loadPlans();
    }
    if (this.perms.can('settings.logs.view')) {
      this.loadLogs();
    }
  }

  saveBranding(): void {
    const cfg = this.siteConfig();
    if (!cfg) return;
    this.savingBranding.set(true);
    this.adminService.updateSiteConfig(cfg).subscribe({
      next: (res) => { this.siteConfig.set(res.data.config); this.savingBranding.set(false); this.notify.success('Branding saved'); },
      error: () => { this.savingBranding.set(false); this.notify.error('Failed to save branding'); },
    });
  }

  loadPlans(): void {
    this.loadingPlans.set(true);
    this.adminService.getPlans().subscribe({
      next: (res) => { this.plans.set((res.data as any).plans ?? res.data); this.loadingPlans.set(false); },
      error: () => { this.loadingPlans.set(false); this.notify.error('Failed to load plans'); },
    });
  }

  savePlan(plan: Plan): void {
    this.savingPlan.set(plan.id);
    this.adminService.updatePlan(plan.id, { limits: plan.limits }).subscribe({
      next: () => { this.savingPlan.set(null); this.notify.success('Plan updated'); },
      error: () => { this.savingPlan.set(null); this.notify.error('Failed to update plan'); },
    });
  }

  loadLogs(): void {
    this.loadingLogs.set(true);
    this.adminService.getErrorLogs().subscribe({
      next: (res) => { this.logLines.set((res.data as any).lines ?? []); this.loadingLogs.set(false); },
      error: () => { this.loadingLogs.set(false); },
    });
  }
}
