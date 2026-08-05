import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeStoreService } from '../../services/resume-store.service';
import { AtsScoreService, JdMatchResult } from '../../services/ats-score.service';

type PanelView = 'score' | 'jd';

@Component({
  selector: 'app-ats-score-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col">

      <!-- ── AI Deep Analysis CTA ── -->
      <div class="px-5 pt-5">
        <button type="button" (click)="analyzeAts.emit()"
                class="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-primary-600 text-white hover:opacity-90 transition-all duration-[250ms] hover:-translate-y-0.5 shadow-sm">
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="flex-1 min-w-0 text-left">
            <p class="text-xs font-bold">Analyze with AI</p>
            <p class="text-[10px] text-white/70 mt-0.5">Full AI-powered ATS audit with fix-it suggestions</p>
          </div>
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      <!-- ── ATS SCORE (free, instant heuristic check) ── -->
      <div class="px-5 pt-4 pb-4 border-b border-hairline dark:border-slate-800">
        <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-3.5">Quick ATS Check</p>

        <!-- Score ring -->
        <div class="flex items-center gap-4 mb-4" role="status" aria-live="polite" [attr.aria-label]="'ATS score: ' + result().score + ' out of 100'">
          <div class="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 36 36" class="w-20 h-20 -rotate-90">
              <defs>
                <linearGradient id="atsPanelGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" [attr.stop-color]="result().score >= 70 ? '#10b981' : result().score >= 50 ? '#f59e0b' : '#ef4444'"/>
                  <stop offset="1" [attr.stop-color]="result().score >= 70 ? '#7c3aed' : result().score >= 50 ? '#ef4444' : '#f59e0b'"/>
                </linearGradient>
              </defs>
              <circle cx="18" cy="18" r="15.5" fill="none" class="stroke-hairline dark:stroke-slate-700" stroke-width="3.5"/>
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="url(#atsPanelGrad)" stroke-width="3.5" stroke-linecap="round"
                      [attr.stroke-dasharray]="circumference"
                      [attr.stroke-dashoffset]="dashOffset()"
                      style="transition: stroke-dashoffset 1s cubic-bezier(.2,.7,.2,1)"/>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-xl font-extrabold text-gray-800 dark:text-slate-100 leading-none">{{ result().score }}</span>
              <span class="text-[8px] text-gray-400 dark:text-slate-500 font-medium">/100</span>
            </div>
          </div>
          <div>
            <p class="text-sm font-bold" [class]="labelColorClass()">{{ scoreLabel() }}</p>
            <p class="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">{{ scoreDescription() }}</p>
          </div>
        </div>

        <!-- Quick ATS actions -->
        <div class="flex gap-2 p-1 bg-canvas dark:bg-slate-800 rounded-full">
          <button type="button"
                  class="flex-1 py-2 text-[11px] font-semibold rounded-full transition-all duration-[250ms]"
                  [class]="view() === 'score'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'"
                  (click)="view.set('score')">ATS Check</button>
          <button type="button"
                  class="flex-1 py-2 text-[11px] font-semibold rounded-full transition-all duration-[250ms]"
                  [class]="view() === 'jd'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'"
                  (click)="view.set('jd')">JD Match</button>
        </div>
      </div>

      <!-- ── ATS CHECK VIEW ── -->
      @if (view() === 'score') {
        <div class="px-5 py-4 border-b border-hairline dark:border-slate-800">
          <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-3">Score Breakdown</p>
          <div class="space-y-3">
            @for (sub of result().subScores; track sub.label) {
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-[11px] font-medium text-gray-600 dark:text-slate-300">{{ sub.label }}</span>
                  <span class="text-[11px] font-bold tabular-nums"
                        [class]="sub.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : sub.color === 'amber' ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'">
                    {{ sub.pct }}/100
                  </span>
                </div>
                <div class="h-2 bg-canvas dark:bg-slate-800 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500"
                       [class]="sub.color === 'emerald' ? 'bg-emerald-500' : sub.color === 'amber' ? 'bg-amber-500' : 'bg-red-500'"
                       [style.width.%]="sub.pct">
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Checklist -->
        <div class="px-5 py-4 border-b border-hairline dark:border-slate-800">
          <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-2.5">Resume Checks</p>
          <div class="space-y-2">
            @for (check of result().checks; track check.label) {
              <div class="flex items-start gap-2">
                @if (check.passed) {
                  <svg class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                } @else {
                  <svg class="w-3.5 h-3.5 text-gray-300 dark:text-slate-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                }
                <div class="flex-1 min-w-0">
                  <span class="text-[11px] block leading-tight"
                        [class]="check.passed ? 'text-gray-700 dark:text-slate-200' : 'text-gray-500 dark:text-slate-400'">
                    {{ check.label }}
                  </span>
                  @if (!check.passed && check.tip) {
                    <span class="text-[10px] text-amber-600 dark:text-amber-400 block mt-0.5 leading-tight">{{ check.tip }}</span>
                  }
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Positive feedback -->
        @if (result().score >= 70) {
          <div class="px-5 py-4 border-b border-hairline dark:border-slate-800">
            <div class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900 rounded-2xl p-4 text-center">
              <p class="text-sm">🎉</p>
              <p class="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mt-1">Looking good!</p>
              <p class="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 leading-relaxed">Your resume is well-structured and optimized for ATS.</p>
            </div>
          </div>
        }
      }

      <!-- ── JD MATCH VIEW ── -->
      @if (view() === 'jd') {
        <div class="px-5 py-4 border-b border-hairline dark:border-slate-800">
          <label class="text-[11px] font-semibold text-gray-600 dark:text-slate-300 block mb-2">Paste Job Description</label>
          <textarea [(ngModel)]="jdText" (ngModelChange)="runJdMatch()"
                    rows="4"
                    placeholder="Paste the job description to see keyword match..."
                    class="w-full text-xs px-3.5 py-2.5 rounded-2xl border border-hairline dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 leading-relaxed">
          </textarea>
        </div>

        @if (jdText.trim()) {
          <div class="px-5 py-4 border-b border-hairline dark:border-slate-800">
            <!-- JD score ring -->
            <div class="flex items-center gap-3 mb-3">
              <div class="relative w-12 h-12 shrink-0">
                <svg viewBox="0 0 36 36" class="w-12 h-12 -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" class="stroke-hairline dark:stroke-slate-700" stroke-width="3"/>
                  <circle cx="18" cy="18" r="15.5" fill="none"
                          [class]="jdRingClass()" stroke-width="3" stroke-linecap="round"
                          [attr.stroke-dasharray]="circumference"
                          [attr.stroke-dashoffset]="jdDashOffset()"/>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-sm font-extrabold text-gray-800 dark:text-slate-100">{{ jdResult().weightedScore }}%</span>
                </div>
              </div>
              <div>
                <p class="text-xs font-bold text-gray-800 dark:text-slate-100">{{ jdMatchLabel() }}</p>
                <p class="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
                  {{ jdResult().matched.length }} / {{ jdResult().totalKeywords }} keywords
                </p>
              </div>
            </div>

            @if (jdResult().highPriorityMissing.length > 0) {
              <div class="mb-3">
                <p class="text-[10px] font-bold text-red-600 dark:text-red-400 mb-1.5">Critical Missing ({{ jdResult().highPriorityMissing.length }})</p>
                <div class="flex flex-wrap gap-1.5">
                  @for (kw of jdResult().highPriorityMissing.slice(0, 8); track kw) {
                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">+ {{ kw }}</span>
                  }
                </div>
              </div>
            }

            @if (jdResult().matched.length > 0) {
              <div>
                <p class="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 mb-1.5">Matched ({{ jdResult().matched.length }})</p>
                <div class="flex flex-wrap gap-1.5">
                  @for (kw of jdResult().matched.slice(0, 10); track kw) {
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">{{ kw }}</span>
                  }
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="px-5 py-6 text-center text-gray-400 dark:text-slate-500">
            <p class="text-2xl mb-2">🎯</p>
            <p class="text-xs leading-relaxed">Paste a job description above to see how well your resume matches.</p>
          </div>
        }
      }

      <!-- ── QUICK ACTIONS ── -->
      <div class="px-5 pt-4 pb-4">
        <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-3">Quick Actions</p>

        <div class="space-y-2">
          <!-- Improve with AI — opens the real AI Assistant panel (bullet-rewrite tab) -->
          <button type="button"
                  class="w-full flex items-center gap-3 p-3 rounded-2xl border border-hairline dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-lavender dark:hover:bg-primary-900/10 hover:-translate-y-0.5 transition-all duration-[250ms] group text-left"
                  (click)="openAiAssistant.emit('bullet')">
            <div class="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-gray-800 dark:text-slate-100 group-hover:text-primary-700 dark:group-hover:text-primary-400">Improve with AI</p>
              <p class="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Get AI suggestions to improve your resume</p>
            </div>
            <svg class="w-3.5 h-3.5 text-gray-300 dark:text-slate-600 group-hover:text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          <!-- Generate Summary — opens the real AI Assistant panel (summary tab) -->
          <button type="button"
                  class="w-full flex items-center gap-3 p-3 rounded-2xl border border-hairline dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-lavender dark:hover:bg-primary-900/10 hover:-translate-y-0.5 transition-all duration-[250ms] group text-left"
                  (click)="openAiAssistant.emit('summary')">
            <div class="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-gray-800 dark:text-slate-100 group-hover:text-primary-700 dark:group-hover:text-primary-400">Generate Summary</p>
              <p class="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Create a professional summary with AI</p>
            </div>
            <svg class="w-3.5 h-3.5 text-gray-300 dark:text-slate-600 group-hover:text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          <!-- Keyword Optimizer -->
          <button type="button"
                  class="w-full flex items-center gap-3 p-3 rounded-2xl border border-hairline dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-lavender dark:hover:bg-primary-900/10 hover:-translate-y-0.5 transition-all duration-[250ms] group text-left"
                  (click)="view.set('jd')">
            <div class="w-9 h-9 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-gray-800 dark:text-slate-100 group-hover:text-primary-700 dark:group-hover:text-primary-400">Keyword Optimizer</p>
              <p class="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Find and add relevant keywords</p>
            </div>
            <svg class="w-3.5 h-3.5 text-gray-300 dark:text-slate-600 group-hover:text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          <!-- Check ATS Score -->
          <button type="button"
                  class="w-full flex items-center gap-3 p-3 rounded-2xl border border-hairline dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-lavender dark:hover:bg-primary-900/10 hover:-translate-y-0.5 transition-all duration-[250ms] group text-left"
                  (click)="view.set('score')">
            <div class="w-9 h-9 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-gray-800 dark:text-slate-100 group-hover:text-primary-700 dark:group-hover:text-primary-400">Check ATS Score</p>
              <p class="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Recalculate your ATS score</p>
            </div>
            <svg class="w-3.5 h-3.5 text-gray-300 dark:text-slate-600 group-hover:text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AtsScorePanelComponent {
  private readonly store   = inject(ResumeStoreService);
  private readonly atsSvc  = inject(AtsScoreService);

  /** Emitted when a quick action needs the real (Gemini-backed) AI Assistant panel —
   *  the parent opens it via the existing `showAiPanel`/`aiInitialTab` signals so
   *  there's a single source of truth instead of a second, local, fake generator. */
  readonly openAiAssistant = output<'summary' | 'bullet'>();

  /** Emitted when the user clicks "Analyze with AI" — the parent opens the
   *  real Gemini-backed deep-analysis modal (`AiAtsAnalysisModalComponent`). */
  readonly analyzeAts = output<void>();

  readonly circumference = 2 * Math.PI * 15.5;
  readonly view = signal<PanelView>('score');
  jdText = '';

  readonly result = computed(() => this.atsSvc.compute(this.store.activeResume()));

  readonly jdResult = signal<JdMatchResult>({
    score: 0, weightedScore: 0, matched: [], missing: [], totalKeywords: 0, highPriorityMissing: [],
  });

  readonly dashOffset   = computed(() => this.circumference * (1 - this.result().score / 100));
  readonly jdDashOffset = computed(() => this.circumference * (1 - this.jdResult().weightedScore / 100));

  runJdMatch(): void {
    const resume = this.store.activeResume();
    if (!resume) return;
    this.jdResult.set(this.atsSvc.computeJdMatch(resume, this.jdText));
  }

  scoreLabel(): string {
    const s = this.result().score;
    if (s >= 80) return 'Excellent Score';
    if (s >= 70) return 'Good Score';
    if (s >= 50) return 'Fair Score';
    return 'Needs Work';
  }

  scoreDescription(): string {
    const s = this.result().score;
    if (s >= 70) return 'Your resume is well-optimized for ATS systems.';
    if (s >= 50) return 'A few improvements can boost your score.';
    return 'Add more details to improve your ATS score.';
  }

  labelColorClass(): string {
    const s = this.result().score;
    return s >= 70 ? 'text-emerald-600' : s >= 50 ? 'text-amber-600' : 'text-red-600';
  }

  jdRingClass(): string {
    const s = this.jdResult().weightedScore;
    return s >= 70 ? 'stroke-emerald-500' : s >= 45 ? 'stroke-amber-500' : 'stroke-red-500';
  }

  jdMatchLabel(): string {
    const s = this.jdResult().weightedScore;
    if (s >= 70) return 'Strong match';
    if (s >= 45) return 'Moderate match';
    return 'Weak match';
  }
}
