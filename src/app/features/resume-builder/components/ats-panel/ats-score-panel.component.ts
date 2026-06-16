import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStoreService } from '../../services/resume-store.service';
import { AtsScoreService } from '../../services/ats-score.service';

@Component({
  selector: 'app-ats-score-panel',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card p-4">
      <h3 class="font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
        <span>📊</span> ATS Score
      </h3>

      <div class="flex items-center gap-4 mb-4">
        <div class="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" class="w-20 h-20 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" class="stroke-slate-200 dark:stroke-slate-700" stroke-width="3" />
            <circle
              cx="18" cy="18" r="15.5" fill="none"
              [class]="ringColorClass()"
              stroke-width="3"
              stroke-linecap="round"
              [attr.stroke-dasharray]="circumference"
              [attr.stroke-dashoffset]="dashOffset()"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-xl font-bold text-slate-800 dark:text-slate-100">{{ result().score }}</span>
          </div>
        </div>
        <div>
          <p class="font-semibold" [class]="labelColorClass()">{{ scoreLabel() }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Based on contact info, summary, experience, skills, and resume length.
          </p>
        </div>
      </div>

      <ul class="space-y-2">
        @for (check of result().checks; track check.label) {
          <li class="flex items-start gap-2 text-sm">
            <span [class]="check.passed ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'">
              {{ check.passed ? '✅' : '⭕' }}
            </span>
            <span class="flex-1">
              <span class="block text-slate-700 dark:text-slate-200" [class.line-through]="false">{{ check.label }}</span>
              @if (!check.passed) {
                <span class="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ check.tip }}</span>
              }
            </span>
          </li>
        }
      </ul>
    </div>
  `,
})
export class AtsScorePanelComponent {
  private readonly store = inject(ResumeStoreService);
  private readonly atsScore = inject(AtsScoreService);

  readonly circumference = 2 * Math.PI * 15.5;

  readonly result = computed(() => this.atsScore.compute(this.store.activeResume()));

  readonly dashOffset = computed(() => {
    const score = this.result().score;
    return this.circumference * (1 - score / 100);
  });

  scoreLabel(): string {
    const score = this.result().score;
    if (score >= 80) return 'Excellent';
    if (score >= 50) return 'Good — room to improve';
    return 'Needs work';
  }

  ringColorClass(): string {
    const score = this.result().score;
    if (score >= 80) return 'stroke-green-500';
    if (score >= 50) return 'stroke-amber-500';
    return 'stroke-red-500';
  }

  labelColorClass(): string {
    const score = this.result().score;
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  }
}
