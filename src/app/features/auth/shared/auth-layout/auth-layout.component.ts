import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { ThemeService } from '../../../../core/services/theme.service';

const DEFAULT_FEATURES: string[] = [
  '40+ free file conversion tools, no watermark',
  'ATS-friendly resume & biodata builder',
  'Your files auto-delete within 2 hours',
];

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="relative min-h-screen lg:grid lg:grid-cols-2 bg-white dark:bg-slate-950">

      <!-- Theme toggle -->
      <button type="button" (click)="theme.toggle()"
        class="fixed top-4 right-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full
               bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80
               text-slate-500 dark:text-slate-300 shadow-sm hover:shadow-md hover:text-primary-600
               dark:hover:text-primary-400 transition-all duration-150"
        [attr.aria-label]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'">
        <app-icon [name]="theme.isDark() ? 'sun' : 'moon'" [size]="18" />
      </button>

      <!-- Left: branding panel (desktop only) -->
      <div class="relative hidden lg:flex flex-col justify-between overflow-hidden px-12 py-10 xl:px-16
                  bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-700">
        <!-- ambient blobs -->
        <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div class="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
          <div class="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl"></div>
          <div class="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-primary-300/20 blur-3xl"></div>
          <div class="absolute inset-0 opacity-[0.06]"
               style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 28px 28px;"></div>
        </div>

        <a routerLink="/" aria-label="ApnaConverter home" class="relative z-10 inline-flex items-center gap-2.5 w-fit">
          <div class="w-9 h-9 bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl flex items-center justify-center p-1.5">
            <img src="assets/web-app-manifest-192x192.png" alt="" class="w-full h-full object-contain" width="24" height="24">
          </div>
          <span class="text-white font-bold text-lg tracking-tight">ApnaConverter</span>
        </a>

        <div class="relative z-10 max-w-md">
          <h2 class="text-3xl xl:text-[2.5rem] font-bold text-white leading-[1.15] tracking-tight">
            {{ headline() }}
          </h2>
          <p class="mt-4 text-primary-100/90 text-base leading-relaxed">
            {{ subheadline() }}
          </p>

          <ul class="mt-8 space-y-3.5">
            @for (f of features(); track f) {
              <li class="flex items-start gap-3">
                <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
                  <app-icon name="check" [size]="12" [strokeWidth]="3" />
                </span>
                <span class="text-sm text-primary-50/95 leading-relaxed">{{ f }}</span>
              </li>
            }
          </ul>
        </div>

        <div class="relative z-10 flex items-center gap-4 text-primary-100/80 text-xs">
          <div class="flex items-center gap-1.5">
            <span class="flex -space-x-2">
              @for (c of ['A','B','C','D']; track c) {
                <span class="h-6 w-6 rounded-full border-2 border-primary-600 bg-white/20 backdrop-blur-sm flex items-center justify-center text-[10px] font-semibold text-white">{{ c }}</span>
              }
            </span>
            <span class="ml-1">Trusted by 10,000+ users</span>
          </div>
          <span class="h-1 w-1 rounded-full bg-white/40"></span>
          <span>No credit card required</span>
        </div>
      </div>

      <!-- Right: auth card -->
      <div class="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10 lg:py-6">
        <div class="pointer-events-none absolute inset-0 overflow-hidden lg:hidden" aria-hidden="true">
          <div class="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary-200/40 dark:bg-primary-900/20 blur-3xl"></div>
          <div class="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-indigo-200/40 dark:bg-indigo-900/20 blur-3xl"></div>
        </div>

        <div class="relative w-full max-w-[560px]">
          <a routerLink="/" aria-label="ApnaConverter home" class="mb-6 flex items-center justify-center gap-2.5 lg:hidden">
            <img src="assets/web-app-manifest-192x192.png" alt="" class="w-9 h-9 object-contain" width="36" height="36">
            <span class="text-slate-900 dark:text-white font-bold text-lg tracking-tight">ApnaConverter</span>
          </a>

          <div class="rounded-[24px] bg-white/90 dark:bg-slate-900/80
                      backdrop-blur-xl p-7 sm:p-8 lg:p-7 animate-slide-up">
            <ng-content />
          </div>

          <ng-content select="[belowCard]" />
        </div>
      </div>
    </div>
  `,
})
export class AuthLayoutComponent {
  readonly theme = inject(ThemeService);

  headline = input('Welcome to ApnaConverter');
  subheadline = input('Convert, build, and manage your files and documents — all in one place.');
  features = input<string[]>(DEFAULT_FEATURES);
}
