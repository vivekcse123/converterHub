import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-final-cta',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="relative overflow-hidden bg-slate-900 dark:bg-slate-950 py-16 sm:py-20">
      <div class="pointer-events-none absolute inset-0 -z-0" aria-hidden="true">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[24rem] rounded-full bg-primary-600/20 blur-3xl"></div>
      </div>

      <div class="container-app relative text-center max-w-2xl mx-auto">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-[1.1] tracking-tight">
          Everything you need to build your career.
        </h2>
        <p class="text-slate-400 mb-10 text-base leading-relaxed">
          Free to start. No credit card. ATS-optimized PDFs in minutes.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a routerLink="/resume-builder" class="btn btn-primary btn-lg">Start Free</a>
          <a routerLink="/tools" class="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-base font-medium text-white border-2 border-slate-700 hover:border-slate-500 hover:bg-white/5 transition-all duration-slow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
            Explore Products
          </a>
        </div>
      </div>
    </section>
  `,
})
export class FinalCtaComponent {}
