import { Component, ChangeDetectionStrategy } from '@angular/core';

interface WhyChooseFeature {
  title: string;
  desc: string;
  iconPath: string;
}

@Component({
  selector: 'app-why-choose',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="features" class="lp-section bg-white dark:bg-slate-950 scroll-mt-16">
      <div class="container-app">
        <div class="max-w-2xl mb-10">
          <p class="lp-eyebrow mb-3">Why ApnaConverter</p>
          <h2 class="lp-heading mb-4">Built for speed, privacy, and results.</h2>
          <p class="section-subtitle">No dark patterns, no watermarks on free plans, no waiting around.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          @for (f of features; track f.title) {
            <div class="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors duration-slow">
              <div class="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-4" aria-hidden="true">
                <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="f.iconPath"/>
                </svg>
              </div>
              <h3 class="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">{{ f.title }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ f.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class WhyChooseComponent {
  readonly features: WhyChooseFeature[] = [
    { title: 'Fast Processing', desc: 'Most files convert in seconds, right in your browser.', iconPath: 'M13 2L4.5 13.5H11L10 22l9-11.5H12l1-8.5z' },
    { title: 'Secure Files', desc: 'Uploads are encrypted in transit and auto-deleted after processing.', iconPath: 'M12 2l8 3v6c0 5-3.4 8.7-8 11-4.6-2.3-8-6-8-11V5l8-3z' },
    { title: 'AI Powered', desc: 'AI writing and scoring built into the resume and cover letter tools.', iconPath: 'M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z' },
    { title: 'No Watermark', desc: 'Free templates and exports stay clean, no branding added.', iconPath: 'M5 13l4 4L19 7' },
    { title: 'Cross Platform', desc: 'Works on any device with a browser: desktop, tablet, or phone.', iconPath: 'M4 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM9 21h6' },
    { title: 'Free to Use', desc: 'Core tools and 13 resume templates are free, permanently.', iconPath: 'M12 8c-3 0-3 3 0 3s3 3 0 3M12 6v2m0 8v2' },
    { title: 'Cloud Processing', desc: 'No installs, everything runs on our servers and syncs instantly.', iconPath: 'M7 18a4 4 0 01-1-7.9A5 5 0 0115.9 8H16a4 4 0 011 7.9M12 12v6m0-6l-2.5 2.5M12 12l2.5 2.5' },
    { title: 'Privacy First', desc: 'We never sell your data or resell your resume content.', iconPath: 'M12 2l8 3v6c0 5-3.4 8.7-8 11-4.6-2.3-8-6-8-11V5l8-3zM9.5 12l1.8 1.8L15 10' },
  ];
}
