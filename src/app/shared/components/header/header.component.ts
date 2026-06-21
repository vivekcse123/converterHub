import { Component, ElementRef, HostListener, signal } from '@angular/core';
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
  readonly mobileOpen    = signal(false);
  readonly profileOpen   = signal(false);
  readonly searchOpen    = signal(false);
  readonly templatesOpen = signal(false);

  constructor(
    public theme: ThemeService,
    public auth: AuthService,
    private el: ElementRef
  ) {}

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    const t = event.target as HTMLElement;
    if (this.profileOpen() && !t.closest('.profile-dropdown-root')) {
      this.profileOpen.set(false);
    }
    if (this.templatesOpen() && !t.closest('.templates-menu-root')) {
      this.templatesOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.searchOpen.set(false);
    this.templatesOpen.set(false);
  }

  toggleMobile():    void { this.mobileOpen.update((v) => !v); }
  closeMobile():     void { this.mobileOpen.set(false); }
  toggleProfile():   void { this.profileOpen.update((v) => !v); }
  closeProfile():    void { this.profileOpen.set(false); }
  openSearch():      void { this.searchOpen.set(true); }
  closeSearch():     void { this.searchOpen.set(false); }
  toggleTemplates(): void { this.templatesOpen.update((v) => !v); }
  closeTemplates():  void { this.templatesOpen.set(false); }
}
