import { Component, ChangeDetectionStrategy, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from '../../../shared/components/admin/admin-sidebar.component';
import { AdminTopbarComponent } from '../../../shared/components/admin/admin-topbar.component';
import { CommandPaletteComponent } from '../../../shared/components/command-palette/command-palette.component';
import { CommandPaletteService } from '../../../core/services/command-palette.service';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, AdminSidebarComponent, AdminTopbarComponent, CommandPaletteComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dash-shell flex">
      <app-admin-sidebar [mobileOpen]="mobileNavOpen()" (closeMobile)="mobileNavOpen.set(false)" />

      @if (mobileNavOpen()) {
        <div class="dash-scrim lg:hidden" (click)="mobileNavOpen.set(false)"></div>
      }

      <div class="flex-1 min-w-0 flex flex-col">
        <app-admin-topbar (toggleMobileNav)="mobileNavOpen.set(true)" />
        <main class="flex-1 p-4 sm:p-6 lg:p-8" id="main-content" tabindex="-1">
          <router-outlet />
        </main>
      </div>
    </div>

    <app-command-palette />
  `,
})
export class AdminShellComponent {
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
