import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-portfolio-showcase',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="lp-section bg-white dark:bg-slate-950">
      <div class="container-app">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          <!-- Copy -->
          <div>
            <p class="lp-eyebrow mb-3">Portfolio Builder</p>
            <h2 class="lp-heading mb-4">Your work, live on the web in minutes.</h2>
            <p class="section-subtitle mb-8">
              A hosted portfolio page with your bio, projects, and skills, shareable with one
              link, no hosting setup required.
            </p>

            <ul class="space-y-4 mb-9">
              @for (item of highlights; track item.title) {
                <li class="flex items-start gap-3">
                  <span class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                    <svg class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </span>
                  <span>
                    <span class="block font-semibold text-slate-800 dark:text-white text-sm">{{ item.title }}</span>
                    <span class="block text-sm text-slate-500 dark:text-slate-400">{{ item.desc }}</span>
                  </span>
                </li>
              }
            </ul>

            <a routerLink="/portfolio" class="btn btn-primary btn-lg">Create Portfolio</a>
          </div>

          <!-- Mockup: theme-switching preview card -->
          <div aria-hidden="true">
            <div class="lp-card p-6 shadow-card max-w-md mx-auto">
              <div class="flex items-center justify-between mb-5">
                <span class="text-[11px] font-semibold text-slate-400 dark:text-slate-500">apnaconverter.com/p/you</span>
                <div class="flex items-center gap-1.5">
                  @for (t of themes; track t.name; let i = $index) {
                    <button type="button" (click)="activeTheme.set(i)"
                      class="w-5 h-5 rounded-full border-2 transition-transform duration-fast"
                      [class]="t.swatch + ' ' + (activeTheme() === i ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent')"
                      [attr.aria-label]="'Preview ' + t.name + ' theme'"></button>
                  }
                </div>
              </div>

              <div class="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                <div class="h-16 bg-gradient-to-br transition-all duration-slow" [class]="themes[activeTheme()].gradient"></div>
                <div class="p-4 -mt-6">
                  <div class="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 shadow-md mb-2"></div>
                  <div class="h-2.5 w-28 bg-slate-800 dark:bg-slate-200 rounded mb-1.5"></div>
                  <div class="h-2 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
                  <div class="grid grid-cols-3 gap-1.5">
                    <div class="h-10 rounded-lg bg-slate-100 dark:bg-slate-800"></div>
                    <div class="h-10 rounded-lg bg-slate-100 dark:bg-slate-800"></div>
                    <div class="h-10 rounded-lg bg-slate-100 dark:bg-slate-800"></div>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2 mt-4 text-xs text-slate-400 dark:text-slate-500">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM9 21h6"/></svg>
                Responsive on every screen size
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
})
export class PortfolioShowcaseComponent {
  readonly activeTheme = signal(0);

  readonly themes = [
    { name: 'Indigo', swatch: 'bg-indigo-500', gradient: 'from-indigo-500 to-primary-600' },
    { name: 'Emerald', swatch: 'bg-emerald-500', gradient: 'from-emerald-500 to-teal-600' },
    { name: 'Rose', swatch: 'bg-rose-500', gradient: 'from-rose-500 to-pink-600' },
  ];

  readonly highlights = [
    { title: 'Theme Switching', desc: 'Pick from multiple color themes without touching code.' },
    { title: 'Responsive Preview', desc: 'Every layout adapts cleanly from phone to ultra-wide.' },
    { title: 'One-click Export', desc: 'Update your bio, skills, and projects anytime.' },
    { title: 'Free Hosting', desc: 'Published instantly at your own apnaconverter.com/p/ link.' },
  ];
}
