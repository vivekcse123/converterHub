import { Component, ChangeDetectionStrategy, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardSidebarComponent } from '../../shared/components/dashboard-sidebar/dashboard-sidebar.component';
import { DashboardTopbarComponent } from '../../shared/components/dashboard-topbar/dashboard-topbar.component';
import { CommandPaletteComponent } from '../../shared/components/command-palette/command-palette.component';
import { CommandPaletteService } from '../../core/services/command-palette.service';

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [RouterOutlet, DashboardSidebarComponent, DashboardTopbarComponent, CommandPaletteComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dash-shell flex">
      <app-dashboard-sidebar [mobileOpen]="mobileNavOpen()" (closeMobile)="mobileNavOpen.set(false)" />

      @if (mobileNavOpen()) {
        <div class="dash-scrim lg:hidden" (click)="mobileNavOpen.set(false)"></div>
      }

      <div class="flex-1 min-w-0 flex flex-col">
        <app-dashboard-topbar (toggleMobileNav)="mobileNavOpen.set(true)" />
        <main class="flex-1 p-4 sm:p-6 lg:p-8" id="main-content" tabindex="-1">
          <router-outlet />
        </main>
      </div>
    </div>

    <app-command-palette />
  `,
})
export class DashboardShellComponent {
  readonly mobileNavOpen = signal(false);

  constructor(private readonly commandPalette: CommandPaletteService) {}

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.commandPalette.toggle();
    }
  }
}
