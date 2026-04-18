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
        <span class="tabular-nums font-medium">{{ value }}%</span>
      </div>
      <div class="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          class="progress-bar h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600
                 transition-all duration-300 ease-out"
          [style.width.%]="value">
        </div>
      </div>
      @if (showPhase && value < 100) {
        <p class="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
          @if (value < 65) { Uploading file… }
          @else { Server is processing your file… }
        </p>
      }
    </div>
    }
  `,
})
export class ProgressBarComponent {
  @Input() value     = 0;
  @Input() label     = 'Processing…';
  @Input() visible   = true;
  /** Show upload vs processing phase hint below the bar */
  @Input() showPhase = false;
}
