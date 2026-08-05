import { Component, ChangeDetectionStrategy, computed, inject, output, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { ADMIN_NAV } from '../../data/admin-nav.data';
import { IconComponent } from '../icon/icon.component';
import { BadgeComponent } from '../badge/badge.component';
import { AuthService } from '../../../core/services/auth.service';
import { AdminPermissionService } from '../../../core/services/admin-permission.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent, BadgeComponent, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside
      [class]="
        'dash-sidebar h-screen lg:sticky lg:top-0 lg:self-start w-64 ' +
        (mobileOpen() ? 'fixed inset-y-0 left-0 z-50' : 'hidden lg:flex')
      "
    >
      <div class="flex items-center gap-2.5 h-16 px-4 shrink-0">
        <a routerLink="/" class="flex items-center gap-2.5 min-w-0" (click)="closeMobile.emit()">
          <img src="assets/web-app-manifest-192x192.png" alt="ApnaConverter logo" class="w-8 h-8 object-contain shrink-0" width="32" height="32" />
          <span class="min-w-0">
            <span class="block font-bold text-content-primary truncate tracking-tight leading-tight">
              Apna<span class="text-primary-600 dark:text-primary-400">Converter</span>
            </span>
            <span class="block text-[10px] font-semibold uppercase tracking-widest text-content-muted">Admin</span>
          </span>
        </a>
        <button type="button" class="ml-auto lg:hidden text-content-muted hover:text-content-primary p-1" (click)="closeMobile.emit()" aria-label="Close navigation">
          <app-icon name="close" [size]="18" />
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto px-2.5 pb-4" aria-label="Admin">
        @for (item of visibleNav(); track item.id) {
          <a
            [routerLink]="'/admin/' + item.route"
            routerLinkActive="dash-nav-item-active"
            class="dash-nav-item mb-0.5"
            (click)="closeMobile.emit()"
          >
            <app-icon [name]="item.icon" [size]="18" class="shrink-0" />
            <span class="truncate">{{ item.label }}</span>
          </a>
        }
      </nav>

      <div class="p-2.5 border-t border-border shrink-0 space-y-1.5">
        <a routerLink="/dashboard" class="dash-nav-item" (click)="closeMobile.emit()">
          <app-icon name="arrow-left" [size]="18" class="shrink-0" />
          <span class="truncate">Back to Dashboard</span>
        </a>
        <div class="px-3 flex items-center justify-between gap-2">
          <p class="text-xs text-content-muted truncate">{{ auth.user()?.email }}</p>
          <app-badge variant="danger" size="sm" class="shrink-0">{{ auth.user()?.role | titlecase }}</app-badge>
        </div>
      </div>
    </aside>
  `,
})
export class AdminSidebarComponent {
  mobileOpen = input(false);
  closeMobile = output<void>();

  readonly auth = inject(AuthService);
  readonly perms = inject(AdminPermissionService);
  readonly nav = ADMIN_NAV;

  readonly visibleNav = computed(() =>
    this.nav.filter(item => this.perms.canAny(...item.permissions))
  );
}
