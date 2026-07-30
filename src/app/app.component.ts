import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { ThemeService } from './core/services/theme.service';
import { SeoService } from './core/services/seo.service';
import { ConverterService } from './core/services/converter.service';
import { environment } from 'src/environments/environment';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, NotificationComponent, ConfirmDialogComponent],
  template: `
    <a href="#main-content"
       class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg">
      Skip to main content
    </a>
    <div [class]="hideShell() ? 'contents' : 'min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300'">
      @if (!hideShell()) { <app-header /> }
      <main id="main-content" tabindex="-1" [class]="hideShell() ? '' : 'flex-1'">
        <router-outlet />
      </main>
      @if (!hideShell()) { <app-footer /> }
      <app-notification />
      <app-confirm-dialog />

      <!-- Global stuck-conversion notice: appears when any conversion takes > 15 s -->
      @if (converter.isStuck()) {
      <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-fade-in">
        <div class="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 dark:border-amber-700
                    dark:bg-amber-900/80 backdrop-blur-sm px-4 py-3.5 shadow-lg">
          <span class="text-xl leading-none mt-0.5">⏳</span>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-amber-900 dark:text-amber-200 text-sm">Still processing…</p>
            <p class="text-amber-800 dark:text-amber-300 text-xs mt-0.5 leading-snug">
              Large files can take up to 3 minutes. Please keep this tab open.
              If this persists,
              <a href="mailto:support&#64;apnaconverter.com"
                 class="underline underline-offset-2 hover:text-amber-950 dark:hover:text-white">
                contact support
              </a>.
            </p>
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class AppComponent implements OnInit {
  readonly hideShell = signal(false);
  readonly converter = inject(ConverterService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private themeService: ThemeService, private seo: SeoService, private router: Router) {}

  ngOnInit(): void {
    this.themeService.initTheme();
    this.seo.init();

    // Fire-and-forget warmup — wakes the Render backend the moment the page
    // loads so cold-start latency is absorbed before the user clicks anything.
    if (this.isBrowser) {
      const pingUrl = environment.apiUrl.replace(/\/api$/, '') + '/ping';
      fetch(pingUrl, { method: 'GET', cache: 'no-store' }).catch(() => {});
    }

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
