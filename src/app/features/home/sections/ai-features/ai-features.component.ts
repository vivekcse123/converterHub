import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

interface AiFeatureCard {
  title: string;
  desc: string;
  route: string;
  queryParams?: Record<string, string>;
}

@Component({
  selector: 'app-ai-features',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="lp-section bg-gradient-to-b from-primary-50/60 to-white dark:from-primary-950/20 dark:to-slate-950">
      <div class="container-app">
        <div class="max-w-2xl mb-10">
          <p class="lp-eyebrow mb-3">AI Features</p>
          <h2 class="lp-heading mb-4">Let AI handle the blank page.</h2>
          <p class="section-subtitle">Built into the resume and cover letter builder, no separate app, no extra sign-up.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (f of features; track f.title) {
            <a [routerLink]="f.route" [queryParams]="f.queryParams ?? null" class="lp-card-hover p-6 flex flex-col bg-white/80 dark:bg-slate-900/80">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center mb-4" aria-hidden="true">
                <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"/></svg>
              </div>
              <h3 class="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">{{ f.title }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ f.desc }}</p>
            </a>
          }
        </div>
      </div>
    </section>
  `,
})
export class AiFeaturesComponent {
  readonly features: AiFeatureCard[] = [
    { title: 'AI Resume Writer', desc: 'Generate a polished professional summary from a few bullet points.', route: '/resume-builder', queryParams: { ai: 'writer' } },
    { title: 'AI Resume Improvement', desc: 'Rewrite weak bullet points into achievement-driven statements.', route: '/resume-builder', queryParams: { ai: 'improve' } },
    { title: 'AI Cover Letter', desc: 'Draft a tailored cover letter from your resume in seconds.', route: '/resume-builder/cover-letter' },
    { title: 'AI Summary', desc: 'Condense your experience into a sharp, recruiter-ready summary.', route: '/resume-builder' },
    { title: 'AI Skills Generator', desc: 'Suggest relevant skills based on your role and industry.', route: '/resume-builder' },
  ];
}
