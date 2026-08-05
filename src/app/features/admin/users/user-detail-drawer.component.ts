import { Component, ChangeDetectionStrategy, OnInit, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AdminPermissionService } from '../../../core/services/admin-permission.service';
import { NotificationService } from '../../../core/services/notification.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { AdminUser, AdminPayment } from '../../../core/models/admin.model';
import { User } from '../../../core/models/user.model';

type Tab = 'account' | 'subscription' | 'usage' | 'sessions' | 'billing';

@Component({
  selector: 'app-user-detail-drawer',
  standalone: true,
  imports: [FormsModule, DatePipe, TitleCasePipe, IconComponent, BadgeComponent, AvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex justify-end">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" (click)="close.emit()"></div>

      <div class="relative w-full max-w-lg h-full bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto">
        @if (createMode()) {
          <div class="p-5 border-b border-border flex items-center justify-between">
            <h2 class="text-base font-bold text-content-primary">New user</h2>
            <button type="button" class="text-content-muted hover:text-content-primary" (click)="close.emit()"><app-icon name="close" [size]="18" /></button>
          </div>
          <form class="p-5 space-y-4" (ngSubmit)="submitCreate()">
            <div><label class="label">Name</label><input class="input" [(ngModel)]="createForm.name" name="name" required></div>
            <div><label class="label">Email</label><input class="input" type="email" [(ngModel)]="createForm.email" name="email" required></div>
            <div><label class="label">Password</label><input class="input" type="password" [(ngModel)]="createForm.password" name="password" required minlength="8"></div>
            <div>
              <label class="label">Role</label>
              <select class="input" [(ngModel)]="createForm.role" name="role">
                <option value="user">User</option>
                <option value="premium">Premium</option>
                <option value="admin">Admin</option>
                @if (perms.can('users.role.assign')) {
                  <option value="editor">Editor</option>
                  <option value="support">Support</option>
                  <option value="moderator">Moderator</option>
                }
              </select>
            </div>
            <button type="submit" class="btn-primary w-full" [disabled]="busy()">{{ busy() ? 'Creating…' : 'Create user' }}</button>
          </form>
        } @else if (loading()) {
          <div class="p-8 flex justify-center"><div class="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
        } @else {
          @if (user(); as u) {
          <div class="p-5 border-b border-border flex items-start gap-3">
            <app-avatar [name]="u.name" size="lg" />
            <div class="min-w-0 flex-1">
              <p class="font-bold text-content-primary truncate">{{ u.name }}</p>
              <p class="text-sm text-content-muted truncate">{{ u.email }}</p>
              <div class="flex items-center gap-1.5 mt-1.5">
                <app-badge [variant]="u.role === 'user' ? 'neutral' : 'danger'" size="sm">{{ u.role | titlecase }}</app-badge>
                @if (u.isBanned) { <app-badge variant="danger" size="sm">Banned</app-badge> }
                @if (u.isSuspended) { <app-badge variant="warning" size="sm">Suspended</app-badge> }
              </div>
            </div>
            <button type="button" class="text-content-muted hover:text-content-primary" (click)="close.emit()"><app-icon name="close" [size]="18" /></button>
          </div>

          <div class="flex border-b border-border px-2 overflow-x-auto">
            @for (t of tabs; track t) {
              <button type="button" class="px-3 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors"
                [class]="tab() === t ? 'border-primary-600 text-primary-600 dark:text-primary-400' : 'border-transparent text-content-muted hover:text-content-primary'"
                (click)="tab.set(t)">{{ t | titlecase }}</button>
            }
          </div>

          <div class="p-5">
            @switch (tab()) {
              @case ('account') {
                <div class="space-y-4">
                  <div><label class="label">Name</label><input class="input" [(ngModel)]="editForm.name" [disabled]="!perms.can('users.edit')"></div>
                  <div><label class="label">Email</label><input class="input" [(ngModel)]="editForm.email" [disabled]="!perms.can('users.edit')"></div>
                  @if (perms.can('users.role.assign')) {
                    <div>
                      <label class="label">Role</label>
                      <select class="input" [(ngModel)]="editForm.role">
                        @for (r of roles; track r) { <option [value]="r">{{ r | titlecase }}</option> }
                      </select>
                    </div>
                  }
                  <div><label class="label">Admin notes</label><textarea class="input" rows="3" [(ngModel)]="editForm.adminNotes" [disabled]="!perms.can('users.edit')"></textarea></div>
                  @if (perms.can('users.edit')) {
                    <button type="button" class="btn-primary btn-sm" [disabled]="busy()" (click)="saveAccount()">Save changes</button>
                  }

                  <div class="border-t border-border pt-4 mt-4 flex flex-wrap gap-2">
                    @if (perms.can('users.moderate')) {
                      @if (u.isSuspended) {
                        <button type="button" class="btn-secondary btn-sm" [disabled]="busy()" (click)="unsuspend()">Unsuspend</button>
                      } @else {
                        <button type="button" class="btn-secondary btn-sm" [disabled]="busy()" (click)="suspend()">Suspend (24h)</button>
                      }
                      @if (u.isBanned) {
                        <button type="button" class="btn-secondary btn-sm" [disabled]="busy()" (click)="unban()">Unban</button>
                      } @else {
                        <button type="button" class="btn-secondary btn-sm" [disabled]="busy()" (click)="ban()">Ban</button>
                      }
                      <button type="button" class="btn-secondary btn-sm" [disabled]="busy()" (click)="resetUsage()">Reset usage</button>
                    }
                    @if (perms.can('users.delete')) {
                      <button type="button" class="btn-danger btn-sm" [disabled]="busy()" (click)="deleteUser()">Delete user</button>
                    }
                  </div>
                </div>
              }

              @case ('subscription') {
                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-3 text-sm">
                    <div><p class="text-content-muted">Plan</p><p class="font-semibold text-content-primary">{{ u.subscription?.plan || 'free' | titlecase }}</p></div>
                    <div><p class="text-content-muted">Status</p><p class="font-semibold text-content-primary">{{ u.subscription?.status || 'free' | titlecase }}</p></div>
                    <div><p class="text-content-muted">Renews / expires</p><p class="font-semibold text-content-primary">{{ (u.subscription?.currentPeriodEnd | date: 'mediumDate') || '—' }}</p></div>
                    <div><p class="text-content-muted">Granted by admin</p><p class="font-semibold text-content-primary">{{ u.subscription?.grantedByAdmin ? 'Yes' : 'No' }}</p></div>
                  </div>

                  @if (perms.can('users.subscription.manage')) {
                    <div class="border-t border-border pt-4 space-y-3">
                      <div class="flex items-center gap-2">
                        <select class="input" [(ngModel)]="grantPlan">
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                          <option value="lifetime">Lifetime</option>
                        </select>
                        <button type="button" class="btn-primary btn-sm shrink-0" [disabled]="busy()" (click)="grantPro()">Grant Pro</button>
                      </div>
                      <div class="flex items-center gap-2">
                        <input class="input" type="number" placeholder="Days to extend" [(ngModel)]="extendDays">
                        <button type="button" class="btn-secondary btn-sm shrink-0" [disabled]="busy()" (click)="extend()">Extend</button>
                      </div>
                      <button type="button" class="btn-secondary btn-sm" [disabled]="busy()" (click)="removePro()">Remove Pro access</button>
                    </div>
                  }
                </div>
              }

              @case ('usage') {
                <div class="grid grid-cols-2 gap-3 text-sm">
                  <div class="card-bordered p-3"><p class="text-content-muted">Conversions today</p><p class="text-lg font-bold text-content-primary">{{ u.usage?.conversionsToday ?? 0 }}</p></div>
                  <div class="card-bordered p-3"><p class="text-content-muted">AI requests today</p><p class="text-lg font-bold text-content-primary">{{ u.usage?.aiRequestsToday ?? 0 }}</p></div>
                  <div class="card-bordered p-3"><p class="text-content-muted">Total conversions</p><p class="text-lg font-bold text-content-primary">{{ u.usage?.totalConversions ?? 0 }}</p></div>
                  <div class="card-bordered p-3"><p class="text-content-muted">Files uploaded</p><p class="text-lg font-bold text-content-primary">{{ u.usage?.totalFilesUploaded ?? 0 }}</p></div>
                </div>
              }

              @case ('sessions') {
                @if (!u.loginHistory?.length) {
                  <p class="text-sm text-content-muted">No login history recorded yet.</p>
                } @else {
                  <div class="space-y-2">
                    @for (s of recentSessions(u.loginHistory); track s.at) {
                      <div class="card-bordered p-3 text-sm">
                        <p class="text-content-primary font-medium">{{ s.ip || 'Unknown IP' }}</p>
                        <p class="text-xs text-content-muted truncate">{{ s.userAgent || 'Unknown device' }}</p>
                        <p class="text-xs text-content-muted mt-1">{{ s.at | date: 'medium' }}</p>
                      </div>
                    }
                  </div>
                }
              }

              @case ('billing') {
                @if (payments() === null) {
                  <div class="flex justify-center py-6"><div class="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
                } @else if (payments()!.length === 0) {
                  <p class="text-sm text-content-muted">No payments on record.</p>
                } @else {
                  <div class="space-y-2">
                    @for (p of payments()!; track p._id) {
                      <div class="card-bordered p-3 text-sm flex items-center justify-between">
                        <div>
                          <p class="font-medium text-content-primary">₹{{ (p.amount / 100).toFixed(2) }} · {{ p.plan | titlecase }}</p>
                          <p class="text-xs text-content-muted">{{ p.invoiceNumber }} · {{ p.createdAt | date: 'mediumDate' }}</p>
                        </div>
                        <app-badge [variant]="p.status === 'captured' ? 'success' : p.status === 'refunded' ? 'warning' : 'danger'" size="sm">{{ p.status | titlecase }}</app-badge>
                      </div>
                    }
                  </div>
                }
              }
            }
          </div>
          }
        }
      </div>
    </div>
  `,
})
export class UserDetailDrawerComponent implements OnInit {
  userId = input.required<string>();
  createMode = input(false);
  close = output<void>();
  changed = output<void>();

  private adminService = inject(AdminService);
  private notify = inject(NotificationService);
  readonly perms = inject(AdminPermissionService);

  readonly tabs: Tab[] = ['account', 'subscription', 'usage', 'sessions', 'billing'];
  readonly tab = signal<Tab>('account');
  readonly roles = ['user', 'premium', 'admin', 'superadmin', 'editor', 'support', 'moderator'];

  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly user = signal<AdminUser | null>(null);
  readonly payments = signal<AdminPayment[] | null>(null);

  editForm: { name: string; email: string; role: User['role']; adminNotes: string } =
    { name: '', email: '', role: 'user', adminNotes: '' };
  createForm = { name: '', email: '', password: '', role: 'user' };
  grantPlan = 'monthly';
  extendDays: number | null = null;

  ngOnInit(): void {
    if (!this.createMode()) this.fetch();
  }

  private fetch(): void {
    this.loading.set(true);
    this.adminService.getUser(this.userId()).subscribe({
      next: (res) => {
        const u = res.data.user;
        this.user.set(u);
        this.editForm = { name: u.name, email: u.email, role: u.role, adminNotes: u.adminNotes || '' };
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); this.notify.error('Failed to load user'); },
    });
    this.adminService.getUserPayments(this.userId()).subscribe({
      next: (res) => this.payments.set((res.data as any).payments ?? []),
      error: () => this.payments.set([]),
    });
  }

  private after(msg: string): void {
    this.busy.set(false);
    this.notify.success(msg);
    this.fetch();
    this.changed.emit();
  }

  submitCreate(): void {
    this.busy.set(true);
    this.adminService.createUser(this.createForm as any).subscribe({
      next: () => { this.busy.set(false); this.notify.success('User created'); this.changed.emit(); this.close.emit(); },
      error: (err) => { this.busy.set(false); this.notify.error('Failed to create user', err?.error?.message); },
    });
  }

  saveAccount(): void {
    this.busy.set(true);
    this.adminService.updateUser(this.userId(), this.editForm).subscribe({
      next: () => this.after('User updated'),
      error: (err) => { this.busy.set(false); this.notify.error('Update failed', err?.error?.message); },
    });
  }

  suspend(): void {
    this.busy.set(true);
    this.adminService.suspendUser(this.userId(), 24).subscribe({ next: () => this.after('User suspended') });
  }
  unsuspend(): void {
    this.busy.set(true);
    this.adminService.unsuspendUser(this.userId()).subscribe({ next: () => this.after('User unsuspended') });
  }
  ban(): void {
    if (!confirm('Ban this user?')) return;
    this.busy.set(true);
    this.adminService.banUser(this.userId()).subscribe({ next: () => this.after('User banned') });
  }
  unban(): void {
    this.busy.set(true);
    this.adminService.unbanUser(this.userId()).subscribe({ next: () => this.after('User unbanned') });
  }
  resetUsage(): void {
    this.busy.set(true);
    this.adminService.resetUserUsage(this.userId()).subscribe({ next: () => this.after('Usage reset') });
  }
  deleteUser(): void {
    if (!confirm('Delete this user permanently? This cannot be undone.')) return;
    this.busy.set(true);
    this.adminService.deleteUser(this.userId()).subscribe({
      next: () => { this.busy.set(false); this.notify.success('User deleted'); this.changed.emit(); this.close.emit(); },
    });
  }
  grantPro(): void {
    this.busy.set(true);
    this.adminService.grantPro(this.userId(), { plan: this.grantPlan }).subscribe({ next: () => this.after('Pro access granted') });
  }
  removePro(): void {
    this.busy.set(true);
    this.adminService.removePro(this.userId()).subscribe({ next: () => this.after('Pro access removed') });
  }
  extend(): void {
    if (!this.extendDays) return;
    this.busy.set(true);
    this.adminService.extendSubscription(this.userId(), { days: this.extendDays }).subscribe({ next: () => this.after('Subscription extended') });
  }

  /** Newest-first — Angular template syntax has no array spread, so this lives here. */
  recentSessions(history: AdminUser['loginHistory']): NonNullable<AdminUser['loginHistory']> {
    return (history ?? []).slice().reverse();
  }
}
