import { Component, ChangeDetectionStrategy, OnInit, inject, input, output, signal } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AdminPermissionService } from '../../../core/services/admin-permission.service';
import { NotificationService } from '../../../core/services/notification.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { AdminPortfolio } from '../../../core/models/admin.model';

@Component({
  selector: 'app-portfolio-detail-drawer',
  standalone: true,
  imports: [DatePipe, TitleCasePipe, IconComponent, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex justify-end">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" (click)="close.emit()"></div>
      <div class="relative w-full max-w-lg h-full bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto">
        @if (!loading() && portfolio(); as p) {
          <div class="p-5 border-b border-border flex items-start gap-3">
            <div class="min-w-0 flex-1">
              <p class="font-bold text-content-primary truncate">{{ p.displayName || p.username }}</p>
              <a [href]="'/' + p.username" target="_blank" class="text-sm text-primary-600 dark:text-primary-400 hover:underline">/{{ p.username }} ↗</a>
              <div class="flex items-center gap-1.5 mt-2 flex-wrap">
                <app-badge [variant]="p.status === 'published' ? 'success' : 'neutral'" size="sm">{{ p.status | titlecase }}</app-badge>
                @if (p.featured) { <app-badge variant="pro" size="sm">Featured</app-badge> }
                @if (p.isHidden) { <app-badge variant="danger" size="sm">Hidden</app-badge> }
                @if (!p.isPublic) { <app-badge variant="neutral" size="sm">Private</app-badge> }
              </div>
            </div>
            <button type="button" class="text-content-muted hover:text-content-primary" (click)="close.emit()"><app-icon name="close" [size]="18" /></button>
          </div>

          <div class="p-5 space-y-4">
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="card-bordered p-3"><p class="text-content-muted">Views</p><p class="text-lg font-bold text-content-primary">{{ p.views }}</p></div>
              <div class="card-bordered p-3"><p class="text-content-muted">Theme</p><p class="text-lg font-bold text-content-primary">{{ p.theme?.templateId || '—' | titlecase }}</p></div>
            </div>

            <div class="text-sm space-y-1.5">
              <p><span class="text-content-muted">Owner:</span> <span class="text-content-primary font-medium">{{ ownerLabel() }}</span></p>
              @if (p.tagline) { <p><span class="text-content-muted">Tagline:</span> {{ p.tagline }}</p> }
              @if (p.metaTitle) { <p><span class="text-content-muted">SEO title:</span> {{ p.metaTitle }}</p> }
              @if (p.metaDescription) { <p><span class="text-content-muted">SEO description:</span> {{ p.metaDescription }}</p> }
              <p><span class="text-content-muted">Updated:</span> {{ p.updatedAt | date: 'medium' }}</p>
              @if (p.isHidden && p.hiddenReason) { <p><span class="text-content-muted">Hidden reason:</span> {{ p.hiddenReason }}</p> }
            </div>

            @if (perms.canAny('portfolios.moderate','portfolios.delete')) {
              <div class="border-t border-border pt-4 flex flex-wrap gap-2">
                @if (perms.can('portfolios.moderate')) {
                  <button type="button" class="btn-secondary btn-sm" [disabled]="busy()" (click)="toggleFeatured()">
                    {{ p.featured ? 'Unfeature' : 'Feature' }}
                  </button>
                  <button type="button" class="btn-secondary btn-sm" [disabled]="busy()" (click)="toggleHidden()">
                    {{ p.isHidden ? 'Unhide' : 'Hide' }}
                  </button>
                }
                @if (perms.can('portfolios.delete')) {
                  <button type="button" class="btn-danger btn-sm" [disabled]="busy()" (click)="deletePortfolio()">Delete</button>
                }
              </div>
            }
          </div>
        } @else if (loading()) {
          <div class="p-8 flex justify-center"><div class="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
        }
      </div>
    </div>
  `,
})
export class PortfolioDetailDrawerComponent implements OnInit {
  portfolioId = input.required<string>();
  close = output<void>();
  changed = output<void>();

  private adminService = inject(AdminService);
  private notify = inject(NotificationService);
  readonly perms = inject(AdminPermissionService);

  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly portfolio = signal<AdminPortfolio | null>(null);

  ngOnInit(): void { this.fetch(); }

  private fetch(): void {
    this.loading.set(true);
    this.adminService.getPortfolio(this.portfolioId()).subscribe({
      next: (res) => { this.portfolio.set(res.data.portfolio); this.loading.set(false); },
      error: () => { this.loading.set(false); this.notify.error('Failed to load portfolio'); },
    });
  }

  ownerLabel(): string {
    const u = this.portfolio()?.userId;
    return typeof u === 'string' ? u : (u?.name ? `${u.name} (${u.email})` : '—');
  }

  toggleFeatured(): void {
    const p = this.portfolio();
    if (!p) return;
    this.busy.set(true);
    this.adminService.featurePortfolio(p._id, !p.featured).subscribe({
      next: () => { this.busy.set(false); this.notify.success(p.featured ? 'Unfeatured' : 'Featured'); this.fetch(); this.changed.emit(); },
      error: () => this.busy.set(false),
    });
  }

  toggleHidden(): void {
    const p = this.portfolio();
    if (!p) return;
    const reason = p.isHidden ? undefined : (prompt('Reason for hiding this portfolio (optional):') ?? '');
    this.busy.set(true);
    this.adminService.hidePortfolio(p._id, !p.isHidden, reason ?? undefined).subscribe({
      next: () => { this.busy.set(false); this.notify.success(p.isHidden ? 'Unhidden' : 'Hidden'); this.fetch(); this.changed.emit(); },
      error: () => this.busy.set(false),
    });
  }

  deletePortfolio(): void {
    if (!confirm('Delete this portfolio? This can be reversed only by a database admin.')) return;
    this.busy.set(true);
    this.adminService.deletePortfolio(this.portfolioId()).subscribe({
      next: () => { this.busy.set(false); this.notify.success('Portfolio deleted'); this.changed.emit(); this.close.emit(); },
      error: () => this.busy.set(false),
    });
  }
}
