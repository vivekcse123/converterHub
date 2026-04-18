import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { GlobalSearchComponent } from '../global-search/global-search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, GlobalSearchComponent],
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
