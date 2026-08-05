import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, inject, output, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { CommandPaletteService } from '../../../core/services/command-palette.service';
import { SystemStatusService } from '../../../core/services/system-status.service';
import { AdminService } from '../../../core/services/admin.service';
import { AdminPermissionService } from '../../../core/services/admin-permission.service';
import { ActivityLogEntry } from '../../../core/models/admin.model';
import { IconComponent } from '../icon/icon.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { BadgeComponent } from '../badge/badge.component';
import { MenuComponent } from '../menu/menu.component';

const STATUS_DOT: Record<string, string> = {
  checking: 'bg-slate-300 dark:bg-slate-600',
  ok: 'bg-emerald-500',
  down: 'bg-red-500',
};
const STATUS_LABEL: Record<string, string> = {
  checking: 'Checking…',
  ok: 'All systems operational',
  down: 'Backend unreachable',
};

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [RouterLink, DatePipe, TitleCasePipe, IconComponent, AvatarComponent, BadgeComponent, MenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <header class="dash-topbar">
      <button
        type="button"
        class="lg:hidden text-content-secondary hover:text-content-primary p-1.5 -ml-1.5"
        (click)="toggleMobileNav.emit()"
        aria-label="Open navigation"
      >
        <app-icon name="menu" [size]="20" />
      </button>

      <app-badge variant="danger" size="sm" class="hidden sm:inline-flex shrink-0">
        <app-icon name="shield" [size]="11" class="mr-1" /> Admin Mode
      </app-badge>

      <button
        type="button"
        class="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border border-border bg-elevated
               text-content-muted text-sm w-full max-w-xs hover:border-border-strong transition-colors ml-2"
        (click)="commandPalette.open()"
      >
        <app-icon name="search" [size]="15" />
        <span class="hidden sm:inline">Search or jump to...</span>
        <span class="sm:hidden">Search</span>
        <span class="dash-kbd ml-auto hidden sm:inline-flex">&#8984;K</span>
      </button>

      <div class="ml-auto flex items-center gap-1.5 sm:gap-2.5">
        <!-- Server status: real /health check, not decorative -->
        <div class="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-md)] border border-border text-xs text-content-secondary"
             [title]="STATUS_LABEL[status.status()]">
          <span class="w-1.5 h-1.5 rounded-full" [class]="STATUS_DOT[status.status()]"></span>
          {{ STATUS_LABEL[status.status()] }}
        </div>

        <!-- Notifications: real recent admin activity, not fake unread badges -->
        @if (perms.can('activity.view')) {
          <app-menu #notifMenu="appMenu" align="right">
            <button trigger type="button" (click)="notifMenu.toggle(); loadRecentActivity()"
              class="relative text-content-secondary hover:text-content-primary p-2 rounded-[var(--radius-md)] hover:bg-elevated transition-colors"
              aria-label="Recent activity">
              <app-icon name="bell" [size]="18" />
            </button>
            <div class="min-w-[20rem] max-h-96 overflow-y-auto">
              <p class="px-2.5 py-2 text-xs font-semibold uppercase tracking-wide text-content-muted border-b border-border">Recent activity</p>
              @if (recentActivity() === null) {
                <p class="px-2.5 py-4 text-sm text-content-muted">Loading…</p>
              } @else if (recentActivity()!.length === 0) {
                <p class="px-2.5 py-4 text-sm text-content-muted">No activity recorded yet.</p>
              } @else {
                @for (entry of recentActivity(); track entry._id) {
                  <div class="px-2.5 py-2 border-b border-border last:border-0">
                    <p class="text-sm text-content-primary">
                      <span class="font-medium">{{ entry.actorEmail }}</span> — {{ entry.action }}
                      @if (entry.targetLabel) { <span class="text-content-muted">({{ entry.targetLabel }})</span> }
                    </p>
                    <p class="text-[11px] text-content-muted">{{ entry.createdAt | date: 'short' }}</p>
                  </div>
                }
              }
              <a routerLink="/admin/activity" class="menu-item" (click)="notifMenu.close()">
                <app-icon name="activity" [size]="15" /> View all activity
              </a>
            </div>
          </app-menu>
        }

        <button
          type="button"
          class="text-content-secondary hover:text-content-primary p-2 rounded-[var(--radius-md)] hover:bg-elevated transition-colors"
          (click)="theme.toggle()"
          [attr.aria-label]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <app-icon [name]="theme.isDark() ? 'sun' : 'moon'" [size]="18" />
        </button>

        <app-menu #userMenu="appMenu" align="right">
          <button trigger type="button" (click)="userMenu.toggle()" aria-label="Account menu">
            <app-avatar [name]="auth.user()?.name || ''" size="sm" />
          </button>

          <div class="w-80 rounded-2xl overflow-hidden -m-1">
            <div class="px-4 py-4 bg-gradient-to-br from-primary-600 to-indigo-600">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-full bg-white/20 border border-white/30 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {{ initials() }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-white truncate">{{ auth.user()?.name }}</p>
                  <p class="text-xs text-white/75 truncate mt-0.5">{{ auth.user()?.email }}</p>
                </div>
              </div>
            </div>

            <div class="px-4 py-3 border-b border-border flex items-center justify-between bg-elevated">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-wide text-content-muted">Role</p>
                <app-badge variant="danger" size="sm" class="inline-block mt-1">{{ auth.user()?.role | titlecase }}</app-badge>
              </div>
              <div class="text-right">
                <p class="text-[10px] font-bold uppercase tracking-wide text-content-muted">Last login</p>
                <p class="text-xs font-semibold text-content-secondary mt-1.5">{{ (auth.user()?.lastLoginAt | date: 'mediumDate') ?? '—' }}</p>
              </div>
            </div>

            <div class="py-1.5">
              <a routerLink="/dashboard" class="menu-item" (click)="userMenu.close()">
                <app-icon name="arrow-left" [size]="16" /> Back to Dashboard
              </a>
              <button type="button" class="menu-item-danger" (click)="auth.logout()">
                <app-icon name="logout" [size]="16" />
                Sign out
              </button>
            </div>
          </div>
        </app-menu>
      </div>
    </header>
  `,
})
export class AdminTopbarComponent implements OnInit, OnDestroy {
  toggleMobileNav = output<void>();

  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  readonly commandPalette = inject(CommandPaletteService);
  readonly status = inject(SystemStatusService);
  readonly perms = inject(AdminPermissionService);
  private adminService = inject(AdminService);
  private router = inject(Router);

  readonly STATUS_DOT = STATUS_DOT;
  readonly STATUS_LABEL = STATUS_LABEL;
  readonly recentActivity = signal<ActivityLogEntry[] | null>(null);

  ngOnInit(): void {
    this.status.start();
  }

  ngOnDestroy(): void {
    this.status.stop();
  }

  loadRecentActivity(): void {
    if (this.recentActivity() !== null) return; // already loaded this session
    this.adminService.getActivityLogs({ limit: '8' }).subscribe({
      next: (res) => this.recentActivity.set(res.data),
      error: () => this.recentActivity.set([]),
    });
  }

  initials(): string {
    const name = this.auth.user()?.name || '';
    return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || '?';
  }
}
