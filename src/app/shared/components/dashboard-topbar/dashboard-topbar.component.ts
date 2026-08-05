import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { CommandPaletteService } from '../../../core/services/command-palette.service';
import { DashboardNotificationsService } from '../../../core/services/dashboard-notifications.service';
import { IconComponent } from '../icon/icon.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';
import { MenuComponent } from '../menu/menu.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

@Component({
  selector: 'app-dashboard-topbar',
  standalone: true,
  imports: [RouterLink, TitleCasePipe, IconComponent, AvatarComponent, BadgeComponent, ButtonComponent, MenuComponent, EmptyStateComponent],
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

      <button
        type="button"
        class="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border border-border bg-elevated
               text-content-muted text-sm w-full max-w-xs hover:border-border-strong transition-colors"
        (click)="commandPalette.open()"
      >
        <app-icon name="search" [size]="15" />
        <span class="hidden sm:inline">Search or jump to...</span>
        <span class="sm:hidden">Search</span>
        <span class="dash-kbd ml-auto hidden sm:inline-flex">&#8984;K</span>
      </button>

      <span class="hidden md:inline-flex items-center gap-1.5 ml-2 text-xs font-medium text-content-muted">
        <app-icon name="users" [size]="14" />
        Personal Workspace
      </span>

      <div class="ml-auto flex items-center gap-1.5 sm:gap-2.5">
        @if (!auth.isPro()) {
          <app-button variant="primary" size="sm" (clicked)="router.navigateByUrl('/resume-builder/pricing')">
            <app-icon name="zap" [size]="14" />
            <span class="hidden sm:inline">Upgrade</span>
          </app-button>
        }

        <app-menu #notifMenu="appMenu" align="right">
          <button
            trigger
            type="button"
            (click)="notifMenu.toggle()"
            class="relative text-content-secondary hover:text-content-primary p-2 rounded-[var(--radius-md)] hover:bg-elevated transition-colors"
            aria-label="Notifications"
          >
            <app-icon name="bell" [size]="18" />
            @if (notifications.unreadCount() > 0) {
              <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border border-elevated"></span>
            }
          </button>

          <div class="flex items-center justify-between px-2 pb-1.5 mb-1 border-b border-border">
            <span class="text-sm font-semibold text-content-primary">Notifications</span>
            @if (notifications.unreadCount() > 0) {
              <button type="button" class="text-xs text-primary-600 dark:text-primary-400 hover:underline" (click)="notifications.markAllRead()">
                Mark all read
              </button>
            }
          </div>
          @if (notifications.items().length === 0) {
            <app-empty-state icon="bell" title="You're all caught up" description="New activity will show up here." />
          } @else {
            <div class="max-h-72 overflow-y-auto">
              @for (n of notifications.items(); track n.id) {
                <div class="menu-item items-start !cursor-default">
                  <span class="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" [class]="n.read ? 'bg-transparent' : 'bg-primary-500'"></span>
                  <span class="flex-1 min-w-0">
                    <span class="block text-content-primary font-medium truncate">{{ n.title }}</span>
                    @if (n.message) { <span class="block text-xs text-content-muted truncate">{{ n.message }}</span> }
                  </span>
                </div>
              }
            </div>
          }
        </app-menu>

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

          <div class="min-w-[15rem]">
            <div class="flex items-center gap-3 px-2.5 py-2.5 mb-1 border-b border-border">
              <app-avatar [name]="auth.user()?.name || ''" size="md" />
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-content-primary truncate" style='display:flex;'>{{ auth.user()?.name }}</p>
                <p class="text-xs text-content-muted truncate">{{ auth.user()?.email }}</p>
              </div>
              <app-badge [variant]="auth.isPro() ? 'pro' : 'neutral'" size="sm">{{ auth.currentPlan() | titlecase }}</app-badge>
            </div>

            <a routerLink="/dashboard/settings" class="menu-item" (click)="userMenu.close()">
              <app-icon name="settings" [size]="16" /> Settings
            </a>
            <a routerLink="/dashboard/billing" class="menu-item" (click)="userMenu.close()">
              <app-icon name="credit-card" [size]="16" /> Billing
            </a>
            @if (auth.isAdmin()) {
              <a routerLink="/admin" class="menu-item" (click)="userMenu.close()">
                <app-icon name="shield" [size]="16" /> Admin Dashboard
              </a>
            }

            <div class="border-t border-border my-1"></div>

            <button type="button" class="menu-item-danger" (click)="auth.logout()">
              <app-icon name="logout" [size]="16" />
              Log out
            </button>
          </div>
        </app-menu>
      </div>
    </header>
  `,
})
export class DashboardTopbarComponent {
  toggleMobileNav = output<void>();

  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  readonly commandPalette = inject(CommandPaletteService);
  readonly notifications = inject(DashboardNotificationsService);
  readonly router = inject(Router);
}
