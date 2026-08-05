import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="border-y border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 py-4">
      <div class="container-app">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          @for (s of stats; track s.label) {
            <div>
              <p class="text-2xl font-extrabold text-slate-800 dark:text-white">{{ s.value }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ s.label }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class StatsBarComponent {
  readonly stats = [
    { value: '50,000+', label: 'Resumes Created' },
    { value: '30+', label: 'Resume Templates' },
    { value: '40+', label: 'File Converter Tools' },
    { value: '₹99/mo', label: 'Pro Plan from' },
  ];
}
