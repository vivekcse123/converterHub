import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { ThemeService } from './core/services/theme.service';
import { SeoService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NotificationComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
      <app-header />
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-footer />
      <app-notification />
    </div>
  `,
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService, private seo: SeoService) {}

  ngOnInit(): void {
    this.themeService.initTheme();
    this.seo.init();
  }
}
