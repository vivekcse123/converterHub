import { Component, ChangeDetectionStrategy, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AdminPermissionService } from '../../../core/services/admin-permission.service';
import { NotificationService } from '../../../core/services/notification.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { AdminUser } from '../../../core/models/admin.model';
import { UserDetailDrawerComponent } from './user-detail-drawer.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [FormsModule, DatePipe, TitleCasePipe, IconComponent, BadgeComponent, AvatarComponent, UserDetailDrawerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto space-y-5">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-content-primary">Users</h1>
          <p class="text-sm text-content-muted mt-1">{{ total() }} total</p>
        </div>
        @if (perms.can('users.edit')) {
          <button type="button" class="btn-primary btn-sm" (click)="openCreate()">
            <app-icon name="plus" [size]="15" /> New user
          </button>
        }
      </div>

      <div class="card-elevated p-4 flex flex-wrap items-center gap-2.5">
        <div class="relative flex-1 min-w-[220px]">
          <app-icon name="search" [size]="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
          <input class="input pl-9" placeholder="Search name or email…" [(ngModel)]="search" (ngModelChange)="onFilterChange()" />
        </div>
        <select class="input w-auto" [(ngModel)]="roleFilter" (ngModelChange)="onFilterChange()">
          <option value="">All roles</option>
          @for (r of roles; track r) { <option [value]="r">{{ r | titlecase }}</option> }
        </select>
        <select class="input w-auto" [(ngModel)]="planFilter" (ngModelChange)="onFilterChange()">
          <option value="">All plans</option>
          <option value="free">Free</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="lifetime">Lifetime</option>
        </select>
        <select class="input w-auto" [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()">
          <option value="">All statuses</option>
          <option value="banned">Banned</option>
          <option value="suspended">Suspended</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      @if (selected().size > 0 && perms.canAny('users.moderate','users.subscription.manage','users.delete')) {
        <div class="card-elevated p-3 flex items-center gap-2 flex-wrap bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
          <span class="text-sm font-semibold text-content-primary px-2">{{ selected().size }} selected</span>
          @if (perms.can('users.subscription.manage')) {
            <button type="button" class="btn-secondary btn-xs" [disabled]="bulkBusy()" (click)="bulkGrantPro()">Grant Pro</button>
          }
          @if (perms.can('users.moderate')) {
            <button type="button" class="btn-secondary btn-xs" [disabled]="bulkBusy()" (click)="bulkSuspend()">Suspend</button>
            <button type="button" class="btn-secondary btn-xs" [disabled]="bulkBusy()" (click)="bulkActivate()">Activate</button>
          }
          @if (perms.can('users.delete')) {
            <button type="button" class="btn-danger btn-xs" [disabled]="bulkBusy()" (click)="bulkDelete()">Delete</button>
          }
          <button type="button" class="btn-ghost btn-xs ml-auto" (click)="clearSelection()">Clear</button>
        </div>
      }

      <div class="card-elevated overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-elevated border-b border-border">
              <tr class="text-left text-xs font-semibold uppercase tracking-wide text-content-muted">
                <th class="px-4 py-3 w-8"><input type="checkbox" [checked]="allSelected()" (change)="toggleSelectAll()" /></th>
                <th class="px-4 py-3">User</th>
                <th class="px-4 py-3">Role</th>
                <th class="px-4 py-3">Plan</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">Joined</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              @if (loading()) {
                @for (i of [1,2,3,4,5]; track i) {
                  <tr><td colspan="7" class="px-4 py-3"><div class="h-6 rounded bg-slate-100 dark:bg-slate-800 animate-pulse"></div></td></tr>
                }
              } @else if (users().length === 0) {
                <tr><td colspan="7" class="px-4 py-10 text-center text-content-muted">No users match these filters.</td></tr>
              } @else {
                @for (u of users(); track u._id) {
                  <tr class="hover:bg-elevated transition-colors cursor-pointer" (click)="openDetail(u._id)">
                    <td class="px-4 py-2.5" (click)="$event.stopPropagation()"><input type="checkbox" [checked]="selected().has(u._id)" (change)="toggleSelect(u._id)" /></td>
                    <td class="px-4 py-2.5">
                      <div class="flex items-center gap-2.5">
                        <app-avatar [name]="u.name" size="sm" />
                        <div class="min-w-0">
                          <p class="font-medium text-content-primary truncate">{{ u.name }}</p>
                          <p class="text-xs text-content-muted truncate">{{ u.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-2.5"><app-badge [variant]="u.role === 'user' ? 'neutral' : 'danger'" size="sm">{{ u.role | titlecase }}</app-badge></td>
                    <td class="px-4 py-2.5"><app-badge [variant]="u.subscription?.plan === 'free' ? 'neutral' : 'pro'" size="sm">{{ (u.subscription?.plan || 'free') | titlecase }}</app-badge></td>
                    <td class="px-4 py-2.5">
                      @if (u.isBanned) { <app-badge variant="danger" size="sm">Banned</app-badge> }
                      @else if (u.isSuspended) { <app-badge variant="warning" size="sm">Suspended</app-badge> }
                      @else if (!u.isActive) { <app-badge variant="neutral" size="sm">Inactive</app-badge> }
                      @else { <app-badge variant="success" size="sm">Active</app-badge> }
                    </td>
                    <td class="px-4 py-2.5 text-content-muted">{{ u.createdAt | date: 'mediumDate' }}</td>
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

    @if (detailUserId(); as id) {
      <app-user-detail-drawer [userId]="id" [createMode]="creatingNew()" (close)="closeDetail()" (changed)="load()" />
    }
  `,
})
export class UsersListComponent implements OnInit {
  private adminService = inject(AdminService);
  private notify = inject(NotificationService);
  readonly perms = inject(AdminPermissionService);

  readonly roles = ['user', 'premium', 'admin', 'superadmin', 'editor', 'support', 'moderator'];

  readonly users = signal<AdminUser[]>([]);
  readonly loading = signal(true);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly limit = 20;
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.limit)));

  search = '';
  roleFilter = '';
  planFilter = '';
  statusFilter = '';

  readonly selected = signal<Set<string>>(new Set());
  readonly allSelected = computed(() => this.users().length > 0 && this.users().every(u => this.selected().has(u._id)));
  readonly bulkBusy = signal(false);

  readonly detailUserId = signal<string | null>(null);
  readonly creatingNew = signal(false);

  private filterDebounce?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.load();
  }

  onFilterChange(): void {
    clearTimeout(this.filterDebounce);
    this.filterDebounce = setTimeout(() => { this.page.set(1); this.load(); }, 300);
  }

  goPage(p: number): void {
    this.page.set(p);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    const params: Record<string, string> = { page: String(this.page()), limit: String(this.limit) };
    if (this.search) params['search'] = this.search;
    if (this.roleFilter) params['role'] = this.roleFilter;
    if (this.planFilter) params['plan'] = this.planFilter;
    if (this.statusFilter) params['status'] = this.statusFilter;

    this.adminService.getUsers(params).subscribe({
      next: (res) => {
        this.users.set(res.data as unknown as AdminUser[]);
        this.total.set(res.pagination.total);
        this.loading.set(false);
        this.selected.set(new Set());
      },
      error: () => { this.loading.set(false); this.notify.error('Failed to load users', 'Please try again.'); },
    });
  }

  toggleSelect(id: string): void {
    const next = new Set(this.selected());
    next.has(id) ? next.delete(id) : next.add(id);
    this.selected.set(next);
  }

  toggleSelectAll(): void {
    if (this.allSelected()) { this.selected.set(new Set()); return; }
    this.selected.set(new Set(this.users().map(u => u._id)));
  }

  clearSelection(): void { this.selected.set(new Set()); }

  openDetail(id: string): void { this.creatingNew.set(false); this.detailUserId.set(id); }
  openCreate(): void { this.creatingNew.set(true); this.detailUserId.set('new'); }
  closeDetail(): void { this.detailUserId.set(null); }

  private async bulkRun(label: string, action: (id: string) => Promise<unknown>): Promise<void> {
    this.bulkBusy.set(true);
    const ids = Array.from(this.selected());
    const results = await Promise.allSettled(ids.map(action));
    const failed = results.filter(r => r.status === 'rejected').length;
    this.bulkBusy.set(false);
    if (failed) this.notify.error(`${label}: ${failed} failed`, `${ids.length - failed} succeeded.`);
    else this.notify.success(label, `Applied to ${ids.length} user(s).`);
    this.load();
  }

  bulkGrantPro(): void {
    this.bulkRun('Grant Pro', id => firstValueFrom(this.adminService.grantPro(id, { plan: 'monthly' })));
  }
  bulkSuspend(): void {
    this.bulkRun('Suspend', id => firstValueFrom(this.adminService.suspendUser(id, 24, 'Bulk admin action')));
  }
  bulkActivate(): void {
    this.bulkRun('Activate', id => firstValueFrom(this.adminService.unsuspendUser(id)));
  }
  bulkDelete(): void {
    if (!confirm(`Delete ${this.selected().size} user(s)? This cannot be undone.`)) return;
    this.bulkRun('Delete', id => firstValueFrom(this.adminService.deleteUser(id)));
  }
}
