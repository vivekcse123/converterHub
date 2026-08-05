import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtsAiSuggestion } from '../../../../core/services/ai.service';
import { AtsAiService } from '../../services/ats-ai.service';
import { ResumeStoreService } from '../../services/resume-store.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ResumeData } from '../../models/resume.model';

const BREAKDOWN_LABELS: { key: keyof import('../../../../core/services/ai.service').AtsAiBreakdown; label: string }[] = [
  { key: 'formatting',       label: 'Formatting' },
  { key: 'keywords',         label: 'Keywords' },
  { key: 'experience',       label: 'Experience' },
  { key: 'education',        label: 'Education' },
  { key: 'skills',           label: 'Skills' },
  { key: 'readability',      label: 'Readability' },
  { key: 'atsCompatibility', label: 'ATS Compatibility' },
];

/**
 * The real AI-powered ATS deep analysis: an explicit, user-triggered Gemini
 * call (orchestrated by `AtsAiService`) shown as a full modal — an animated
 * stage checklist while it runs, then score/breakdown/strengths/weaknesses/
 * critical-issues/suggestions with one-click Apply. Kept separate from the
 * always-on, free `AtsScorePanelComponent` heuristic check.
 */
@Component({
  selector: 'app-ai-ats-analysis-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-10 pb-4 bg-black/60 backdrop-blur-sm" (click)="close.emit()">
      <div class="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl" (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-hairline dark:border-slate-800 shrink-0 bg-gradient-to-r from-indigo-600 to-primary-600 rounded-t-2xl text-white">
          <div class="flex items-center gap-2.5">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            <h2 class="text-base font-extrabold">AI ATS Deep Analysis</h2>
          </div>
          <button type="button" (click)="close.emit()" aria-label="Close" class="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="overflow-y-auto flex-1 min-h-0">

          <!-- ── Pro gate ── -->
          @if (!auth.isPro()) {
            <div class="text-center py-12 px-6 space-y-3">
              <div class="w-14 h-14 mx-auto bg-canvas dark:bg-slate-800 rounded-full flex items-center justify-center">
                <svg class="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <p class="text-sm font-semibold text-gray-700 dark:text-slate-200">AI Deep Analysis is a Pro feature</p>
              <p class="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">Get a real AI-powered audit of your resume: score breakdown, strengths, weaknesses, critical issues, and one-click fixes, upgrade to unlock.</p>
              <button type="button" (click)="upgrade.emit()"
                      class="mt-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors">
                Upgrade to Pro
              </button>
            </div>
          } @else {

            <!-- ── Loading: animated stage checklist ── -->
            @if (atsAi.state() === 'analyzing') {
              <div class="px-8 py-10 space-y-6">
                <div class="text-center">
                  <p class="text-sm font-bold text-gray-800 dark:text-slate-100">Analyzing your resume…</p>
                  <p class="text-xs text-gray-400 mt-1">This takes a few seconds; we're running a full AI audit, not a shortcut.</p>
                </div>
                <div class="h-1.5 bg-canvas dark:bg-slate-800 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-indigo-500 to-primary-500 rounded-full transition-all duration-700 ease-out"
                       [style.width.%]="stageProgressPct()"></div>
                </div>
                <div class="space-y-3">
                  @for (stage of atsAi.stages; track stage; let i = $index) {
                    <div class="flex items-center gap-3">
                      @if (i < atsAi.stageIndex()) {
                        <span class="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                        </span>
                      } @else if (i === atsAi.stageIndex()) {
                        <span class="w-5 h-5 rounded-full border-2 border-primary-400 border-t-transparent animate-spin shrink-0"></span>
                      } @else {
                        <span class="w-5 h-5 rounded-full border-2 border-gray-200 dark:border-slate-700 shrink-0"></span>
                      }
                      <span class="text-xs font-medium"
                            [class]="i <= atsAi.stageIndex() ? 'text-gray-800 dark:text-slate-100' : 'text-gray-400 dark:text-slate-500'">
                        {{ stage }}
                      </span>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- ── Error ── -->
            @if (atsAi.state() === 'error') {
              <div class="text-center py-12 px-6 space-y-3">
                <p class="text-2xl">⚠️</p>
                <p class="text-sm font-semibold text-gray-700 dark:text-slate-200">{{ atsAi.error() }}</p>
                <button type="button" (click)="runAnalysis()"
                        class="mt-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors">
                  Try Again
                </button>
              </div>
            }

            <!-- ── Idle (shouldn't normally be seen — analysis auto-starts on open) ── -->
            @if (atsAi.state() === 'idle') {
              <div class="text-center py-12 px-6 space-y-3">
                <p class="text-sm text-gray-500 dark:text-slate-400">Ready to run a full AI-powered ATS audit of your resume.</p>
                <button type="button" (click)="runAnalysis()"
                        class="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors">
                  Analyze ATS
                </button>
              </div>
            }

            <!-- ── Results ── -->
            @if (atsAi.state() === 'done' && atsAi.result(); as result) {
              <div class="px-6 py-5 space-y-6">

                @if (isStale()) {
                  <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900">
                    <p class="text-[11px] text-amber-700 dark:text-amber-300 font-medium">Your resume changed since this analysis ran.</p>
                    <button type="button" (click)="runAnalysis()" class="text-[11px] font-bold text-amber-800 dark:text-amber-200 hover:underline shrink-0">Re-analyze</button>
                  </div>
                }

                <!-- Score + breakdown -->
                <div class="flex items-center gap-5">
                  <div class="relative w-24 h-24 shrink-0">
                    <svg viewBox="0 0 36 36" class="w-24 h-24 -rotate-90">
                      <circle cx="18" cy="18" r="15.5" fill="none" class="stroke-hairline dark:stroke-slate-700" stroke-width="3.5"/>
                      <circle cx="18" cy="18" r="15.5" fill="none" [class]="ringClass(result.score)" stroke-width="3.5" stroke-linecap="round"
                              [attr.stroke-dasharray]="circumference"
                              [attr.stroke-dashoffset]="circumference * (1 - result.score / 100)"
                              style="transition: stroke-dashoffset 1s cubic-bezier(.2,.7,.2,1)"/>
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                      <span class="text-2xl font-extrabold text-gray-800 dark:text-slate-100 leading-none">{{ result.score }}</span>
                      <span class="text-[8px] text-gray-400 dark:text-slate-500 font-medium">/100</span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0 grid grid-cols-2 gap-x-4 gap-y-2">
                    @for (b of breakdownLabels; track b.key) {
                      <div>
                        <div class="flex items-center justify-between mb-1">
                          <span class="text-[10px] font-semibold text-gray-500 dark:text-slate-400">{{ b.label }}</span>
                          <span class="text-[10px] font-bold text-gray-700 dark:text-slate-200 tabular-nums">{{ result.breakdown[b.key] }}</span>
                        </div>
                        <div class="h-1.5 bg-canvas dark:bg-slate-800 rounded-full overflow-hidden">
                          <div class="h-full rounded-full transition-all duration-500" [class]="barClass(result.breakdown[b.key])" [style.width.%]="result.breakdown[b.key]"></div>
                        </div>
                      </div>
                    }
                  </div>
                </div>

                <!-- Strengths / Weaknesses / Critical Issues -->
                @if (result.strengths.length) {
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">✓ Strengths</p>
                    <ul class="space-y-1.5">
                      @for (s of result.strengths; track s) {
                        <li class="text-xs text-gray-700 dark:text-slate-200 flex items-start gap-2"><span class="text-emerald-500 mt-0.5">✓</span><span>{{ s }}</span></li>
                      }
                    </ul>
                  </div>
                }
                @if (result.weaknesses.length) {
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">⚠ Weaknesses</p>
                    <ul class="space-y-1.5">
                      @for (w of result.weaknesses; track w) {
                        <li class="text-xs text-gray-700 dark:text-slate-200 flex items-start gap-2"><span class="text-amber-500 mt-0.5">⚠</span><span>{{ w }}</span></li>
                      }
                    </ul>
                  </div>
                }
                @if (result.criticalIssues.length) {
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-red-600 dark:text-red-400 mb-2">❌ Critical Issues</p>
                    <ul class="space-y-1.5">
                      @for (c of result.criticalIssues; track c) {
                        <li class="text-xs text-gray-700 dark:text-slate-200 flex items-start gap-2"><span class="text-red-500 mt-0.5">❌</span><span>{{ c }}</span></li>
                      }
                    </ul>
                  </div>
                }

                <!-- Suggestions -->
                @if (result.suggestions.length) {
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-2.5">AI Enhancement Suggestions</p>
                    <div class="space-y-2.5">
                      @for (s of result.suggestions; track s.id) {
                        <div class="p-3.5 rounded-2xl border border-hairline dark:border-slate-700">
                          <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0">
                              <div class="flex items-center gap-2 mb-1">
                                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide" [class]="severityClass(s.severity)">{{ s.severity }}</span>
                                <p class="text-xs font-bold text-gray-800 dark:text-slate-100">{{ s.title }}</p>
                              </div>
                              <p class="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">{{ s.detail }}</p>
                            </div>
                            @if (s.apply) {
                              @if (isApplied(s.id)) {
                                <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">Applied ✓</span>
                              } @else {
                                <button type="button" (click)="applySuggestion(s)"
                                        class="text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 shrink-0 whitespace-nowrap">
                                  Apply →
                                </button>
                              }
                            }
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }

                <!-- Suggested skills -->
                @if (result.suggestedSkills.length) {
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-2.5">Missing Skills to Add</p>
                    <div class="flex flex-wrap gap-1.5">
                      @for (skill of result.suggestedSkills; track skill) {
                        <button type="button" (click)="addSkill(skill)" [disabled]="isSkillAdded(skill)"
                                class="text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors"
                                [class]="isSkillAdded(skill)
                                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900'
                                  : 'bg-canvas dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-hairline dark:border-slate-700 hover:border-primary-300 hover:text-primary-700'">
                          {{ isSkillAdded(skill) ? '✓ ' : '+ ' }}{{ skill }}
                        </button>
                      }
                    </div>
                  </div>
                }

                <!-- AI rewrite shortcuts -->
                <div class="grid grid-cols-2 gap-2 pt-1">
                  <button type="button" (click)="openAiAssistant.emit('summary')"
                          class="py-2.5 rounded-xl border border-hairline dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-lavender dark:hover:bg-primary-900/10 text-xs font-semibold text-gray-700 dark:text-slate-200 transition-all">
                    AI Improve Summary
                  </button>
                  <button type="button" (click)="openAiAssistant.emit('bullet')"
                          class="py-2.5 rounded-xl border border-hairline dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-lavender dark:hover:bg-primary-900/10 text-xs font-semibold text-gray-700 dark:text-slate-200 transition-all">
                    AI Improve Bullet / Experience
                  </button>
                </div>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class AiAtsAnalysisModalComponent {
  readonly resume = input.required<ResumeData>();

  readonly close           = output<void>();
  readonly upgrade         = output<void>();
  readonly openAiAssistant = output<'summary' | 'bullet'>();

  readonly atsAi  = inject(AtsAiService);
  readonly auth   = inject(AuthService);
  private readonly store  = inject(ResumeStoreService);
  private readonly notify = inject(NotificationService);

  readonly breakdownLabels = BREAKDOWN_LABELS;
  readonly circumference   = 2 * Math.PI * 15.5;

  private readonly appliedIds  = signal<Set<string>>(new Set());
  private readonly addedSkills = signal<Set<string>>(new Set());

  readonly stageProgressPct = computed(() =>
    Math.round((this.atsAi.stageIndex() / (this.atsAi.stages.length - 1)) * 100)
  );

  readonly isStale = computed(() => this.atsAi.isStale(this.resume()));

  private hasAutoTriggered = false;
  constructor() {
    // Auto-start analysis the first time this modal renders with a resume,
    // unless a fresh (non-stale) cached result already exists — reuses the
    // last Gemini call instead of spending another one on every re-open.
    effect(() => {
      const r = this.resume();
      if (this.hasAutoTriggered || !this.auth.isPro()) return;
      untracked(() => {
        this.hasAutoTriggered = true;
        if (this.atsAi.result() && !this.atsAi.isStale(r)) return;
        this.atsAi.analyze(r);
      });
    });
  }

  runAnalysis(): void {
    this.atsAi.analyze(this.resume());
  }

  isApplied(id: string): boolean { return this.appliedIds().has(id); }
  isSkillAdded(skill: string): boolean { return this.addedSkills().has(skill); }

  applySuggestion(s: AtsAiSuggestion): void {
    const r = this.resume();
    const apply = s.apply;
    if (!r || !apply) return;

    switch (apply.type) {
      case 'summary':
        this.store.updateSummary(apply.value ?? '');
        break;
      case 'skills':
        this.store.addSkillItemsToFirstGroupOrCreate(apply.skillItems ?? []);
        break;
      case 'bullet': {
        const list = apply.scope === 'project' ? r.projects : r.experience;
        const item = list[apply.index ?? -1];
        if (!item) return;
        if (apply.scope === 'project') this.store.updateProjectBullet(item.id, apply.bulletIndex ?? 0, apply.value ?? '');
        else this.store.updateExperienceBullet(item.id, apply.bulletIndex ?? 0, apply.value ?? '');
        break;
      }
    }
    this.appliedIds.update(set => new Set(set).add(s.id));
    this.notify.success('Suggestion applied');
  }

  addSkill(skill: string): void {
    if (this.isSkillAdded(skill)) return;
    this.store.addSkillItemsToFirstGroupOrCreate([skill]);
    this.addedSkills.update(set => new Set(set).add(skill));
    this.notify.success('Skill added');
  }

  ringClass(score: number): string {
    return score >= 70 ? 'stroke-emerald-500' : score >= 50 ? 'stroke-amber-500' : 'stroke-red-500';
  }

  barClass(pct: number): string {
    return pct >= 70 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
  }

  severityClass(severity: AtsAiSuggestion['severity']): string {
    if (severity === 'critical') return 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300';
    if (severity === 'warning')  return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300';
    return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
  }
}
