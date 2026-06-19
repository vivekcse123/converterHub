import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeStoreService } from '../../services/resume-store.service';
import { AtsScoreService, JdMatchResult } from '../../services/ats-score.service';
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
        <!-- Score ring + label -->
        <div class="flex items-center gap-4 mb-4">
          <div class="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 36 36" class="w-20 h-20 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" class="stroke-slate-200 dark:stroke-slate-700" stroke-width="3" />
              <circle cx="18" cy="18" r="15.5" fill="none"
                [class]="ringColorClass()" stroke-width="3" stroke-linecap="round"
                [attr.stroke-dasharray]="circumference"
                [attr.stroke-dashoffset]="dashOffset()" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center flex-col">
              <span class="text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">{{ result().score }}</span>
              <span class="text-[9px] text-slate-400 leading-none">/100</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm" [class]="labelColorClass()">{{ scoreLabel() }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Analyzing contact info, content, skills &amp; structure.</p>
          </div>
        </div>

        <!-- Sub-score bars -->
        <div class="space-y-2 mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          @for (sub of result().subScores; track sub.label) {
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-[11px] font-medium text-slate-600 dark:text-slate-300">{{ sub.label }}</span>
                <span class="text-[11px] font-bold"
                  [class]="sub.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : sub.color === 'amber' ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'">
                  {{ sub.pct }}%
                </span>
              </div>
              <div class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500"
                  [class]="sub.color === 'emerald' ? 'bg-emerald-500' : sub.color === 'amber' ? 'bg-amber-500' : 'bg-red-500'"
                  [style.width.%]="sub.pct">
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Checklist -->
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
            <!-- Score rings: weighted (primary) + raw -->
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
                  <span class="text-sm font-extrabold text-slate-800 dark:text-white">{{ jdResult().weightedScore }}%</span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-slate-800 dark:text-white text-sm">{{ jdMatchLabel() }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {{ jdResult().matched.length }} of {{ jdResult().totalKeywords }} keywords matched
                </p>
                @if (jdResult().highPriorityMissing.length === 0 && jdResult().missing.length > 0) {
                  <p class="text-[10px] text-amber-600 dark:text-amber-400 mt-1">General terms missing — check soft skills</p>
                }
              </div>
            </div>

            <!-- High-priority missing (tech skills) -->
            @if (jdResult().highPriorityMissing.length > 0) {
              <div class="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 p-3">
                <p class="text-xs font-bold text-red-700 dark:text-red-400 mb-2">🔴 Critical Skills Missing ({{ jdResult().highPriorityMissing.length }})</p>
                <div class="flex flex-wrap gap-1">
                  @for (kw of jdResult().highPriorityMissing; track kw) {
                    <span class="text-[10px] font-semibold px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 cursor-pointer hover:bg-red-200 transition" title="Add to resume">+ {{ kw }}</span>
                  }
                </div>
                <p class="text-[10px] text-red-500 dark:text-red-400/70 mt-2">Add these to your Skills section or experience bullets.</p>
              </div>
            }

            <!-- General missing keywords -->
            @if (generalMissing().length > 0) {
              <div>
                <p class="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1.5">🟡 Other Missing ({{ generalMissing().length }})</p>
                <div class="flex flex-wrap gap-1">
                  @for (kw of generalMissing(); track kw) {
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 cursor-pointer hover:bg-amber-200 transition" title="Add this keyword to your resume">{{ kw }} +</span>
                  }
                </div>
              </div>
            }

            @if (jdResult().matched.length > 0) {
              <div>
                <p class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1.5">✅ Matched ({{ jdResult().matched.length }})</p>
                <div class="flex flex-wrap gap-1">
                  @for (kw of jdResult().matched; track kw) {
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">{{ kw }}</span>
                  }
                </div>
              </div>
            }

            @if (jdResult().missing.length === 0 && jdResult().matched.length > 0) {
              <p class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold text-center py-1">Your resume covers all detected keywords!</p>
            }
            <p class="text-[10px] text-slate-400 mt-1">💡 Score weighted by skill importance. Add missing keywords naturally into your summary, skills, or bullets.</p>
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

  readonly jdResult = signal<JdMatchResult>({
    score: 0, weightedScore: 0, matched: [], missing: [], totalKeywords: 0, highPriorityMissing: [],
  });

  readonly generalMissing = computed(() =>
    this.jdResult().missing.filter(kw => !this.jdResult().highPriorityMissing.includes(kw))
  );

  readonly dashOffset   = computed(() => this.circumference * (1 - this.result().score / 100));
  readonly jdDashOffset = computed(() => this.circumference * (1 - this.jdResult().weightedScore / 100));

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
    const s = this.jdResult().weightedScore;
    return s >= 70 ? 'stroke-emerald-500' : s >= 45 ? 'stroke-amber-500' : 'stroke-red-500';
  }

  jdMatchLabel(): string {
    const s = this.jdResult().weightedScore;
    if (s >= 70) return 'Strong match';
    if (s >= 45) return 'Moderate match';
    return 'Weak match — add missing skills';
  }
}
