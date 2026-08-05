import { Component, ChangeDetectionStrategy, ElementRef, HostListener, ViewChild, effect, signal } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { GlobalSearchComponent } from '../global-search/global-search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, GlobalSearchComponent, DatePipe, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly mobileOpen   = signal(false);
  readonly profileOpen  = signal(false);
  readonly searchOpen   = signal(false);
  readonly productsOpen = signal(false);

  @ViewChild(GlobalSearchComponent) private globalSearch?: GlobalSearchComponent;

  constructor(
    public theme: ThemeService,
    public auth: AuthService,
    private el: ElementRef
  ) {
    // Focus must wait for the @if(searchOpen()) row to exist in the DOM AND
    // for the child GlobalSearchComponent's own @ViewChild to resolve —
    // crossing a component boundary (unlike CommandPaletteComponent, which
    // focuses its own input from its own effect). A microtask can still run
    // before Angular finishes patching a newly-created child's view child
    // query; a macrotask reliably runs after.
    effect(() => {
      if (this.searchOpen()) {
        setTimeout(() => this.globalSearch?.focusInput(), 0);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    const t = event.target as HTMLElement;
    if (this.profileOpen() && !t.closest('.profile-dropdown-root')) {
      this.profileOpen.set(false);
    }
    if (this.productsOpen() && !t.closest('.products-menu-root')) {
      this.productsOpen.set(false);
    }
    if (this.searchOpen() && !t.closest('.search-overlay-root')) {
      this.searchOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.searchOpen.set(false);
    this.productsOpen.set(false);
  }

  /** "/" focuses global search from anywhere on the public site, matching
   *  the shortcut hint shown inside the search input — skipped while the
   *  user is already typing in any input/textarea/contenteditable. */
  @HostListener('document:keydown', ['$event'])
  onGlobalKeydown(event: KeyboardEvent): void {
    if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement;
    const tag = target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return;
    event.preventDefault();
    this.openSearch();
  }

  toggleMobile():   void { this.mobileOpen.update((v) => !v); }
  closeMobile():    void { this.mobileOpen.set(false); }
  toggleProfile():  void { this.profileOpen.update((v) => !v); }
  closeProfile():   void { this.profileOpen.set(false); }
  openSearch():     void { this.searchOpen.set(true); }
  closeSearch():    void { this.searchOpen.set(false); }
  toggleProducts(): void { this.productsOpen.update((v) => !v); }
  closeProducts():  void { this.productsOpen.set(false); }
}
