import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="visible" class="w-full animate-fade-in">
      <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
        <span>{{ label }}</span>
        <span>{{ value }}%</span>
      </div>
      <div class="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div class="progress-bar h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
          [style.width.%]="value">
        </div>
      </div>
    </div>
  `,
})
export class ProgressBarComponent {
  @Input() value   = 0;
  @Input() label   = 'Processing…';
  @Input() visible = true;
}
