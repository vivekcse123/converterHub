import { Component, ChangeDetectionStrategy, computed, inject, input, output, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DASHBOARD_NAV, dashboardNavHref } from '../../data/dashboard-nav.data';
import { IconComponent } from '../icon/icon.component';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { AuthService } from '../../../core/services/auth.service';

const COLLAPSE_KEY = 'ch_dash_sidebar_collapsed';

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent, TooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside
      [class]="
        'dash-sidebar ' +
        (mobileOpen()
          ? 'fixed inset-y-0 left-0 z-50 w-72 h-screen'
          : 'hidden lg:flex lg:sticky lg:top-0 lg:self-start lg:h-screen ' + (collapsed() ? 'lg:w-[4.5rem]' : 'lg:w-64'))
      "
    >
      <div class="flex items-center gap-2.5 h-16 px-4 shrink-0">
        <a routerLink="/" class="flex items-center gap-2.5 min-w-0" (click)="closeMobile.emit()">
          <img
            src="assets/web-app-manifest-192x192.png"
            alt="ApnaConverter logo"
            class="w-8 h-8 object-contain shrink-0"
            width="32"
            height="32"
          />
          @if (!collapsed() || mobileOpen()) {
            <span class="font-bold text-content-primary truncate tracking-tight">
              Apna<span class="text-primary-600 dark:text-primary-400">Converter</span>
            </span>
          }
        </a>
        <button
          type="button"
          class="ml-auto lg:hidden text-content-muted hover:text-content-primary p-1"
          (click)="closeMobile.emit()"
          aria-label="Close navigation"
        >
          <app-icon name="close" [size]="18" />
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto px-2.5 pb-4" aria-label="Dashboard">
        @for (group of groups(); track group.name) {
          @if (!collapsed() || mobileOpen()) {
            <p class="dash-nav-group-label">{{ group.name }}</p>
          }
          @for (item of group.items; track item.id) {
            <a
              [routerLink]="hrefFor(item)"
              routerLinkActive="dash-nav-item-active"
              [routerLinkActiveOptions]="{ exact: item.route === '' }"
              class="dash-nav-item mb-0.5"
              [appTooltip]="collapsed() && !mobileOpen() ? item.label : ''"
              (click)="closeMobile.emit()"
            >
              <app-icon [name]="item.icon" [size]="18" class="shrink-0" />
              @if (!collapsed() || mobileOpen()) {
                <span class="truncate">{{ item.label }}</span>
              }
            </a>
          }
        }
        @if (auth.isAdmin()) {
          <p class="dash-nav-group-label">{{ collapsed() && !mobileOpen() ? '' : 'Admin' }}</p>
          <a
            routerLink="/admin"
            class="dash-nav-item mb-0.5"
            [appTooltip]="collapsed() && !mobileOpen() ? 'Admin Dashboard' : ''"
            (click)="closeMobile.emit()"
          >
            <app-icon name="shield" [size]="18" class="shrink-0" />
            @if (!collapsed() || mobileOpen()) {
              <span class="truncate">Admin Dashboard</span>
            }
          </a>
        }
      </nav>

      <div class="p-2.5 border-t border-border shrink-0 hidden lg:block">
        <button
          type="button"
          class="dash-nav-item w-full justify-center lg:justify-start"
          (click)="toggleCollapsed()"
          [attr.aria-label]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <app-icon name="panel-left" [size]="18" class="shrink-0" />
          @if (!collapsed()) {
            <span>Collapse</span>
          }
        </button>
      </div>
    </aside>
  `,
})
export class DashboardSidebarComponent {
  mobileOpen = input(false);
  closeMobile = output<void>();

  readonly auth = inject(AuthService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly collapsed = signal(this.loadCollapsed());

  readonly groups = computed(() => {
    const byGroup = new Map<string, typeof DASHBOARD_NAV>();
    for (const item of DASHBOARD_NAV) {
      if (!byGroup.has(item.group)) byGroup.set(item.group, []);
      byGroup.get(item.group)!.push(item);
    }
    return Array.from(byGroup, ([name, items]) => ({ name, items }));
  });

  hrefFor = dashboardNavHref;

  toggleCollapsed(): void {
    this.collapsed.update((v) => !v);
    if (this.isBrowser) localStorage.setItem(COLLAPSE_KEY, String(this.collapsed()));
  }

  private loadCollapsed(): boolean {
    if (!this.isBrowser) return false;
    return localStorage.getItem(COLLAPSE_KEY) === 'true';
  }
}
