import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeStoreService } from '../../services/resume-store.service';
import { AtsScoreService } from '../../services/ats-score.service';
import { AuthService } from '../../../../core/services/auth.service';

type Tab = 'ats' | 'jd';

@Component({
  selector: 'app-ats-score-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card p-4">
      <!-- Tab bar -->
      <div class="flex gap-0 mb-4 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <button class="flex-1 py-2 text-xs font-semibold transition"
                [class]="tab() === 'ats' ? 'bg-violet-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'"
                (click)="tab.set('ats')">📊 ATS Score</button>
        <button class="flex-1 py-2 text-xs font-semibold transition"
                [class]="tab() === 'jd' ? 'bg-violet-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'"
                (click)="tab.set('jd')">🎯 JD Match</button>
      </div>

      <!-- ── ATS Score tab ── -->
      @if (tab() === 'ats') {
        <div class="flex items-center gap-4 mb-4">
          <div class="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 36 36" class="w-20 h-20 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" class="stroke-slate-200 dark:stroke-slate-700" stroke-width="3" />
              <circle cx="18" cy="18" r="15.5" fill="none"
                [class]="ringColorClass()" stroke-width="3" stroke-linecap="round"
                [attr.stroke-dasharray]="circumference"
                [attr.stroke-dashoffset]="dashOffset()" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-xl font-bold text-slate-800 dark:text-slate-100">{{ result().score }}</span>
            </div>
          </div>
          <div>
            <p class="font-semibold" [class]="labelColorClass()">{{ scoreLabel() }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Based on contact info, summary, experience, skills, and resume length.</p>
          </div>
        </div>

        <ul class="space-y-2">
          @for (check of result().checks; track check.label) {
            <li class="flex items-start gap-2 text-sm">
              <span [class]="check.passed ? 'text-green-600 dark:text-green-400' : 'text-red-400 dark:text-red-400'">
                {{ check.passed ? '✅' : '⭕' }}
              </span>
              <span class="flex-1">
                <span class="block text-slate-700 dark:text-slate-200">{{ check.label }}</span>
                @if (!check.passed) {
                  <span class="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ check.tip }}</span>
                }
              </span>
            </li>
          }
        </ul>
      }

      <!-- ── JD Match tab ── -->
      @if (tab() === 'jd') {
        <div class="space-y-3">
          <div>
            <label class="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">Paste Job Description</label>
            <textarea [(ngModel)]="jdText" (ngModelChange)="runJdMatch()"
                      rows="5"
                      placeholder="Paste the full job description here to see how well your resume matches..."
                      class="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"></textarea>
          </div>

          @if (jdText.trim()) {
            <!-- Match score ring -->
            <div class="flex items-center gap-4 py-2">
              <div class="relative w-16 h-16 shrink-0">
                <svg viewBox="0 0 36 36" class="w-16 h-16 -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" class="stroke-slate-200 dark:stroke-slate-700" stroke-width="3" />
                  <circle cx="18" cy="18" r="15.5" fill="none"
                    [class]="jdRingClass()" stroke-width="3" stroke-linecap="round"
                    [attr.stroke-dasharray]="circumference"
                    [attr.stroke-dashoffset]="jdDashOffset()" />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-sm font-extrabold text-slate-800 dark:text-white">{{ jdResult().score }}%</span>
                </div>
              </div>
              <div>
                <p class="font-bold text-slate-800 dark:text-white text-sm">{{ jdMatchLabel() }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ jdResult().matched.length }} of {{ jdResult().totalKeywords }} keywords matched</p>
              </div>
            </div>

            @if (jdResult().matched.length > 0) {
              <div>
                <p class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1.5">✅ Matched Keywords ({{ jdResult().matched.length }})</p>
                <div class="flex flex-wrap gap-1">
                  @for (kw of jdResult().matched; track kw) {
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">{{ kw }}</span>
                  }
                </div>
              </div>
            }

            @if (jdResult().missing.length > 0) {
              <div>
                <p class="text-xs font-semibold text-red-600 dark:text-red-400 mb-1.5">❌ Missing Keywords ({{ jdResult().missing.length }})</p>
                <div class="flex flex-wrap gap-1">
                  @for (kw of jdResult().missing; track kw) {
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-200 transition" title="Add this keyword to your resume">{{ kw }} +</span>
                  }
                </div>
                <p class="text-[10px] text-slate-400 mt-2">💡 Add these keywords naturally into your skills, summary, or experience bullets.</p>
              </div>
            }
          } @else {
            <div class="text-center py-4 text-slate-400">
              <p class="text-3xl mb-2">🎯</p>
              <p class="text-xs">Paste a job description to see how well your resume matches its keywords.</p>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class AtsScorePanelComponent {
  private readonly store   = inject(ResumeStoreService);
  private readonly atsSvc  = inject(AtsScoreService);
  readonly auth            = inject(AuthService);

  readonly circumference = 2 * Math.PI * 15.5;
  readonly tab = signal<Tab>('ats');
  jdText = '';

  readonly result = computed(() => this.atsSvc.compute(this.store.activeResume()));

  readonly jdResult = signal({ score: 0, matched: [] as string[], missing: [] as string[], totalKeywords: 0 });

  readonly dashOffset = computed(() => this.circumference * (1 - this.result().score / 100));
  readonly jdDashOffset = computed(() => this.circumference * (1 - this.jdResult().score / 100));

  runJdMatch(): void {
    const resume = this.store.activeResume();
    if (!resume) return;
    this.jdResult.set(this.atsSvc.computeJdMatch(resume, this.jdText));
  }

  scoreLabel(): string {
    const s = this.result().score;
    if (s >= 80) return 'Excellent — ATS ready';
    if (s >= 60) return 'Good — minor improvements needed';
    if (s >= 40) return 'Fair — needs work';
    return 'Needs significant improvement';
  }

  ringColorClass(): string {
    const s = this.result().score;
    return s >= 80 ? 'stroke-emerald-500' : s >= 60 ? 'stroke-amber-500' : 'stroke-red-500';
  }

  labelColorClass(): string {
    const s = this.result().score;
    return s >= 80 ? 'text-emerald-600 dark:text-emerald-400' : s >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400';
  }

  jdRingClass(): string {
    const s = this.jdResult().score;
    return s >= 70 ? 'stroke-emerald-500' : s >= 45 ? 'stroke-amber-500' : 'stroke-red-500';
  }

  jdMatchLabel(): string {
    const s = this.jdResult().score;
    if (s >= 70) return 'Strong match';
    if (s >= 45) return 'Moderate match';
    return 'Weak match — add more keywords';
  }
}
