import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { ThemeService } from './core/services/theme.service';
import { SeoService } from './core/services/seo.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, NotificationComponent, ConfirmDialogComponent],
  template: `
    <div [class]="hideShell() ? 'contents' : 'min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300'">
      @if (!hideShell()) { <app-header /> }
      <main [class]="hideShell() ? '' : 'flex-1'">
        <router-outlet />
      </main>
      @if (!hideShell()) { <app-footer /> }
      <app-notification />
      <app-confirm-dialog />
    </div>
  `,
})
export class AppComponent implements OnInit {
  readonly hideShell = signal(false);

  constructor(private themeService: ThemeService, private seo: SeoService, private router: Router) {}

  ngOnInit(): void {
    this.themeService.initTheme();
    this.seo.init();

    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      let route = this.router.routerState.snapshot.root;
      let hide = false;
      while (route) {
        if (route.data['hideShell']) { hide = true; break; }
        route = route.firstChild!;
      }
      this.hideShell.set(hide);
    });
  }
}
