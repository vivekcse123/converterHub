import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="relative overflow-hidden bg-white dark:bg-slate-950 pt-10 pb-14 sm:pt-14 sm:pb-20">
      <!-- Soft gradient blobs — replaces the old grid-pattern background -->
      <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[52rem] h-[32rem] rounded-full bg-primary-200/40 dark:bg-primary-900/20 blur-3xl"></div>
        <div class="absolute top-40 -right-24 w-96 h-96 rounded-full bg-indigo-200/30 dark:bg-indigo-900/10 blur-3xl"></div>
      </div>

      <div class="container-app relative">
        <div class="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-16 items-center">

          <!-- Copy -->
          <div class="max-w-xl">
            <div class="lp-eyebrow mb-5">
              <span class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse-soft"></span>
              One platform, every career document
            </div>

            <h1 class="text-[2.75rem] sm:text-6xl font-bold text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-6">
              Build your career,
              <span class="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-500">not just your resume.</span>
            </h1>

            <p class="text-lg text-slate-500 dark:text-slate-400 mb-9 leading-relaxed">
              Resumes, portfolios, cover letters and 40+ file tools, designed to get you noticed,
              built to get you hired. Free to start, no credit card required.
            </p>

            <div class="flex flex-col sm:flex-row gap-3 mb-10">
              <a routerLink="/resume-builder" class="btn btn-primary btn-lg">Start Free</a>
              <a routerLink="/tools" class="btn btn-secondary btn-lg">Explore Tools</a>
            </div>

            <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400 dark:text-slate-500">
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                No credit card required
              </span>
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                ATS-optimized PDFs
              </span>
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                2,500+ users
              </span>
            </div>
          </div>

          <!-- Product mockup: browser-chrome workspace window -->
          <div class="hidden lg:block relative" aria-hidden="true">
            <div class="lp-glass relative rounded-2xl shadow-2xl overflow-hidden">
              <!-- window chrome -->
              <div class="flex items-center gap-1.5 px-4 py-3 border-b border-slate-200/70 dark:border-slate-700/70">
                <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span class="ml-3 text-[11px] font-medium text-slate-400 dark:text-slate-500">apnaconverter.com/resume-builder</span>
              </div>
              <!-- workspace -->
              <div class="grid grid-cols-[100px_1fr] gap-0">
                <div class="border-r border-slate-200/70 dark:border-slate-700/70 p-3 space-y-2">
                  <div class="h-8 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 text-[10px] font-bold">CV</div>
                  <div class="h-8 rounded-lg bg-slate-100 dark:bg-slate-800"></div>
                  <div class="h-8 rounded-lg bg-slate-100 dark:bg-slate-800"></div>
                  <div class="h-8 rounded-lg bg-slate-100 dark:bg-slate-800"></div>
                </div>
                <div class="p-5 space-y-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-indigo-500 shrink-0"></div>
                    <div class="flex-1 space-y-1.5">
                      <div class="h-2.5 bg-slate-800 dark:bg-slate-200 rounded w-28"></div>
                      <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded w-36"></div>
                    </div>
                  </div>
                  <div class="space-y-1.5">
                    <div class="h-2 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    <div class="h-2 bg-slate-100 dark:bg-slate-800 rounded w-5/6"></div>
                    <div class="h-2 bg-slate-100 dark:bg-slate-800 rounded w-4/6"></div>
                  </div>
                  <div class="flex gap-2 flex-wrap">
                    <span class="h-5 w-16 rounded-md bg-primary-100 dark:bg-primary-900/40"></span>
                    <span class="h-5 w-12 rounded-md bg-primary-100 dark:bg-primary-900/40"></span>
                    <span class="h-5 w-20 rounded-md bg-primary-100 dark:bg-primary-900/40"></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- floating chips -->
            <div class="absolute -top-6 -right-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2 animate-slide-down">
              <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <div class="leading-tight">
                <p class="text-[11px] font-bold text-slate-700 dark:text-slate-200">ATS Score 94</p>
              </div>
            </div>
            <div class="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2 animate-slide-up">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft"></span>
              <p class="text-[11px] font-bold text-slate-700 dark:text-slate-200">Portfolio live at /p/you</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
})
export class HeroComponent {}
