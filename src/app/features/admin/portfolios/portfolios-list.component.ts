import { Component, ChangeDetectionStrategy, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AdminPermissionService } from '../../../core/services/admin-permission.service';
import { NotificationService } from '../../../core/services/notification.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { AdminPortfolio } from '../../../core/models/admin.model';
import { PortfolioDetailDrawerComponent } from './portfolio-detail-drawer.component';

@Component({
  selector: 'app-portfolios-list',
  standalone: true,
  imports: [FormsModule, DatePipe, TitleCasePipe, IconComponent, BadgeComponent, PortfolioDetailDrawerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto space-y-5">
      <div>
        <h1 class="text-2xl font-bold text-content-primary">Portfolios</h1>
        <p class="text-sm text-content-muted mt-1">{{ total() }} total</p>
      </div>

      <div class="card-elevated p-4 flex flex-wrap items-center gap-2.5">
        <div class="relative flex-1 min-w-[220px]">
          <app-icon name="search" [size]="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
          <input class="input pl-9" placeholder="Search username or name…" [(ngModel)]="search" (ngModelChange)="onFilterChange()" />
        </div>
        <select class="input w-auto" [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()">
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <select class="input w-auto" [(ngModel)]="featuredFilter" (ngModelChange)="onFilterChange()">
          <option value="">Featured: any</option>
          <option value="true">Featured only</option>
          <option value="false">Not featured</option>
        </select>
      </div>

      <div class="card-elevated overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-elevated border-b border-border">
              <tr class="text-left text-xs font-semibold uppercase tracking-wide text-content-muted">
                <th class="px-4 py-3">Portfolio</th>
                <th class="px-4 py-3">Owner</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">Views</th>
                <th class="px-4 py-3">Flags</th>
                <th class="px-4 py-3">Updated</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              @if (loading()) {
                @for (i of [1,2,3,4,5]; track i) {
                  <tr><td colspan="7" class="px-4 py-3"><div class="h-6 rounded bg-slate-100 dark:bg-slate-800 animate-pulse"></div></td></tr>
                }
              } @else if (portfolios().length === 0) {
                <tr><td colspan="7" class="px-4 py-10 text-center text-content-muted">No portfolios match these filters.</td></tr>
              } @else {
                @for (p of portfolios(); track p._id) {
                  <tr class="hover:bg-elevated transition-colors cursor-pointer" (click)="openDetail(p._id)">
                    <td class="px-4 py-2.5">
                      <p class="font-medium text-content-primary">{{ p.displayName || p.username }}</p>
                      <p class="text-xs text-content-muted">/{{ p.username }}</p>
                    </td>
                    <td class="px-4 py-2.5 text-content-secondary">{{ ownerLabel(p) }}</td>
                    <td class="px-4 py-2.5"><app-badge [variant]="p.status === 'published' ? 'success' : 'neutral'" size="sm">{{ p.status | titlecase }}</app-badge></td>
                    <td class="px-4 py-2.5 text-content-secondary tabular-nums">{{ p.views }}</td>
                    <td class="px-4 py-2.5">
                      <div class="flex gap-1">
                        @if (p.featured) { <app-badge variant="pro" size="sm">Featured</app-badge> }
                        @if (p.isHidden) { <app-badge variant="danger" size="sm">Hidden</app-badge> }
                      </div>
                    </td>
                    <td class="px-4 py-2.5 text-content-muted">{{ p.updatedAt | date: 'mediumDate' }}</td>
                    <td class="px-4 py-2.5 text-right"><app-icon name="arrow-left" [size]="14" class="rotate-180 text-content-muted" /></td>
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
    </div>

    @if (detailId(); as id) {
      <app-portfolio-detail-drawer [portfolioId]="id" (close)="detailId.set(null)" (changed)="load()" />
    }
  `,
})
export class PortfoliosListComponent implements OnInit {
  private adminService = inject(AdminService);
  private notify = inject(NotificationService);
  readonly perms = inject(AdminPermissionService);

  readonly portfolios = signal<AdminPortfolio[]>([]);
  readonly loading = signal(true);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly limit = 20;
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.limit)));

  search = '';
  statusFilter = '';
  featuredFilter = '';

  readonly detailId = signal<string | null>(null);
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
    if (this.search) params['search'] = this.search;
    if (this.statusFilter) params['status'] = this.statusFilter;
    if (this.featuredFilter) params['featured'] = this.featuredFilter;

    this.adminService.getPortfolios(params).subscribe({
      next: (res) => { this.portfolios.set(res.data); this.total.set(res.pagination.total); this.loading.set(false); },
      error: () => { this.loading.set(false); this.notify.error('Failed to load portfolios'); },
    });
  }

  ownerLabel(p: AdminPortfolio): string {
    return typeof p.userId === 'string' ? p.userId : (p.userId?.name || p.userId?.email || '—');
  }

  openDetail(id: string): void { this.detailId.set(id); }
}
