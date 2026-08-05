import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-resume-showcase',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="lp-section bg-slate-50 dark:bg-slate-900/40">
      <div class="container-app">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          <!-- Mockup -->
          <div class="order-2 lg:order-1" aria-hidden="true">
            <div class="lp-card p-6 shadow-card max-w-md mx-auto">
              <div class="flex items-center justify-between mb-5">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600"></div>
                  <div class="h-2.5 w-24 bg-slate-800 dark:bg-slate-200 rounded"></div>
                </div>
                <span class="badge-pro">Live preview</span>
              </div>

              <div class="rounded-xl border border-slate-100 dark:border-slate-800 p-4 mb-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">ATS Score</span>
                  <span class="text-xs font-bold text-emerald-600">94 / 100</span>
                </div>
                <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div class="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 w-[94%]"></div>
                </div>
              </div>

              <div class="space-y-2 mb-4">
                <div class="h-2 bg-slate-100 dark:bg-slate-800 rounded"></div>
                <div class="h-2 bg-slate-100 dark:bg-slate-800 rounded w-5/6"></div>
                <div class="h-2 bg-slate-100 dark:bg-slate-800 rounded w-3/4"></div>
              </div>

              <div class="flex items-center gap-2 rounded-xl bg-primary-50 dark:bg-primary-900/30 px-3.5 py-2.5">
                <svg class="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z"/></svg>
                <span class="text-xs font-medium text-primary-700 dark:text-primary-300">AI Writer suggested 3 stronger bullet points</span>
              </div>
            </div>
          </div>

          <!-- Copy -->
          <div class="order-1 lg:order-2">
            <p class="lp-eyebrow mb-3">Resume Builder</p>
            <h2 class="lp-heading mb-4">A resume that clears the bots and impresses the humans.</h2>
            <p class="section-subtitle mb-8">
              Real-time ATS scoring, AI-assisted writing, and 30+ professional templates,
              exported as a clean, one-click PDF.
            </p>

            <ul class="space-y-4 mb-9">
              @for (item of highlights; track item.title) {
                <li class="flex items-start gap-3">
                  <span class="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                    <svg class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </span>
                  <span>
                    <span class="block font-semibold text-slate-800 dark:text-white text-sm">{{ item.title }}</span>
                    <span class="block text-sm text-slate-500 dark:text-slate-400">{{ item.desc }}</span>
                  </span>
                </li>
              }
            </ul>

            <a routerLink="/resume-builder" class="btn btn-primary btn-lg">Build Resume</a>
          </div>

        </div>
      </div>
    </section>
  `,
})
export class ResumeShowcaseComponent {
  readonly highlights = [
    { title: 'ATS Score', desc: 'See exactly how a hiring system will read your resume, before you apply.' },
    { title: 'AI Writer', desc: 'Turn rough notes into polished, achievement-driven bullet points.' },
    { title: 'Templates', desc: '30+ layouts: minimal, executive, technical, and photo formats.' },
    { title: 'One-click Export', desc: 'Download a print-ready, watermark-free PDF instantly.' },
  ];
}
