import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../../../shared/components/card/card.component';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [RouterLink, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-16 bg-white dark:bg-slate-950">
      <div class="container-app max-w-4xl mx-auto">
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Ready in Under 5 Minutes</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm">Three simple steps. No design skills needed.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          @for (step of howItWorks; track step.step) {
            <app-card variant="hover" padding="md">
              <div class="flex flex-col items-center text-center">
                <div class="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-200 dark:border-primary-700 flex items-center justify-center text-2xl mb-4 relative z-10" aria-hidden="true">
                  {{ step.icon }}
                </div>
                <span class="text-xs font-bold text-primary-400 dark:text-primary-500 mb-1">STEP {{ step.step }}</span>
                <h3 class="font-bold text-slate-800 dark:text-white text-base mb-2">{{ step.title }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ step.desc }}</p>
              </div>
            </app-card>
          }
        </div>
        <div class="text-center mt-10">
          <a routerLink="/resume-builder" class="btn btn-primary">
            Start Building Free →
          </a>
        </div>
      </div>
    </section>
  `,
})
export class HowItWorksComponent {
  readonly howItWorks = [
    { step: '01', icon: '📋', title: 'Pick a Template', desc: 'Choose from 30+ professional templates: ATS-friendly, photo-enabled, government, and more.' },
    { step: '02', icon: '✏️', title: 'Fill Your Details', desc: 'Enter your details with smart suggestions. Live preview shows every change instantly.' },
    { step: '03', icon: '⬇️', title: 'Download & Apply', desc: 'Export a perfect ATS-optimized PDF in one click. No watermark on free templates.' },
  ];
}
