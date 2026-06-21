import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible) {
    <div class="w-full animate-fade-in">
      <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
        <span class="flex items-center gap-1.5">
          @if (value > 0 && value < 100) {
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
          }
          {{ label }}
        </span>
        <span class="tabular-nums font-medium">{{ value < 100 ? value + '%' : 'Done!' }}</span>
      </div>
      <div class="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          class="progress-bar h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600
                 transition-all duration-300 ease-out"
          [style.width.%]="value">
        </div>
      </div>

      <!-- Stuck-state notice: shown when conversion takes unusually long -->
      @if (isStuck) {
      <div class="mt-3 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50
                  dark:border-amber-800/50 dark:bg-amber-900/20 px-3.5 py-3 text-sm">
        <span class="mt-0.5 shrink-0 text-amber-500">⏳</span>
        <div>
          <p class="font-medium text-amber-800 dark:text-amber-300">Still processing…</p>
          <p class="mt-0.5 text-amber-700 dark:text-amber-400">
            Large or complex files can take up to 3 minutes. Please leave this tab open.
            If it keeps stalling,
            <a href="mailto:support@apnaconverter.com"
               class="underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-200">
              contact support
            </a>.
          </p>
        </div>
      </div>
      }
    </div>
    }
  `,
})
export class ProgressBarComponent {
  @Input() value     = 0;
  @Input() label     = 'Processing…';
  @Input() visible   = true;
  /** When true, renders a "still processing" notice below the bar */
  @Input() isStuck   = false;
  /** @deprecated Use label + isStuck instead */
  @Input() showPhase = false;
}
