import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly mobileOpen = signal(false);

  constructor(
    public theme: ThemeService,
    public auth: AuthService
  ) {}

  toggleMobile(): void { this.mobileOpen.update((v) => !v); }
  closeMobile():  void { this.mobileOpen.set(false); }
}
