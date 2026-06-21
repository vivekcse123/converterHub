import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeStoreService } from '../../services/resume-store.service';
import { AtsScoreService, JdMatchResult } from '../../services/ats-score.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

const ACTION_VERBS = [
  'Developed','Built','Designed','Implemented','Led','Delivered','Optimized','Reduced','Increased','Improved',
  'Architected','Streamlined','Automated','Launched','Managed','Coordinated','Spearheaded','Established',
];

const IMPACT_PHRASES = [
  'reducing manual effort by 40%','improving performance by 30%','increasing team productivity by 25%',
  'cutting load time by 50%','saving 10+ hours per week','supporting 10,000+ users',
];

function pickRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function rewriteBullet(bullet: string): string[] {
  const clean = bullet.replace(/^[-•*]\s*/, '').trim();
  if (!clean) return [];
  const alreadyHasVerb = ACTION_VERBS.some(v => clean.toLowerCase().startsWith(v.toLowerCase()));
  const hasNumbers = /\d/.test(clean);
  const base = alreadyHasVerb ? clean : `${pickRandom(ACTION_VERBS)} ${clean.charAt(0).toLowerCase() + clean.slice(1)}`;
  const variants: string[] = [];
  if (!hasNumbers) { variants.push(`${base}, ${pickRandom(IMPACT_PHRASES)}`); } else { variants.push(base); }
  const verb2 = pickRandom(ACTION_VERBS.filter(v => !base.startsWith(v)));
  const core = alreadyHasVerb ? clean.split(' ').slice(1).join(' ') : clean;
  variants.push(`${verb2} ${core.charAt(0).toLowerCase() + core.slice(1)}, ${pickRandom(IMPACT_PHRASES)}`);
  const impact = pickRandom(IMPACT_PHRASES);
  const verb3 = pickRandom(ACTION_VERBS);
  variants.push(`${impact.charAt(0).toUpperCase() + impact.slice(1)} by ${verb3.toLowerCase()}ing ${core.toLowerCase()}`);
  return variants.slice(0, 3);
}

const OPENERS = ['Results-driven','Dedicated','Dynamic','Accomplished','Experienced','Innovative','Skilled','Versatile'];
const MID_PHRASES = [
  'Proven track record of delivering scalable, high-quality solutions that drive measurable business outcomes.',
  'Adept at translating business requirements into robust, maintainable technical solutions.',
  'Experienced across the full software development lifecycle - from design through deployment.',
];
const CLOSERS = [
  'Passionate about building innovative products and collaborating with cross-functional teams.',
  'Committed to writing clean, maintainable code and continuously improving engineering processes.',
  'Driven by a passion for solving complex problems and creating meaningful user experiences.',
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function generateSummary(jobTitle: string, skills: string[], expYears: number, hasProjects: boolean): string[] {
  const shuffledSkills = shuffle(skills);
  const yearStr = expYears > 0 ? `${expYears}+ year${expYears !== 1 ? 's' : ''}` : '';
  const expClause = yearStr ? `with ${yearStr} of professional experience` : '';
  const openers = shuffle(OPENERS); const mids = shuffle(MID_PHRASES); const closers = shuffle(CLOSERS);
  const variants: string[] = [];
  for (let i = 0; i < 3; i++) {
    const topSkills = shuffledSkills.slice(0, 3 + (i % 2)).join(', ') || 'software development';
    const projectClause = hasProjects ? ', with a portfolio of impactful projects' : '';
    const t = `${openers[i]} ${jobTitle} ${expClause ? expClause + ' and a' : 'with a'} strong background in ${topSkills}${projectClause}. ${mids[i % mids.length]} ${closers[i % closers.length]}`;
    variants.push(t.replace(/\s+/g, ' ').trim());
  }
  return variants;
}

type PanelView = 'score' | 'jd' | 'ai-summary' | 'ai-bullet';

@Component({
  selector: 'app-ats-score-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col">

      <!-- ── ATS SCORE ── -->
      <div class="px-4 pt-4 pb-3 border-b border-slate-100">
        <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">ATS Score</p>

        <!-- Score ring -->
        <div class="flex items-center gap-3 mb-3" role="status" aria-live="polite" [attr.aria-label]="'ATS score: ' + result().score + ' out of 100'">
          <div class="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 36 36" class="w-16 h-16 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#f1f5f9" stroke-width="3"/>
              <circle cx="18" cy="18" r="15.5" fill="none"
                      [class]="ringColorClass()" stroke-width="3" stroke-linecap="round"
                      [attr.stroke-dasharray]="circumference"
                      [attr.stroke-dashoffset]="dashOffset()"/>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-lg font-extrabold text-slate-800 leading-none">{{ result().score }}</span>
              <span class="text-[8px] text-slate-400 font-medium">/100</span>
            </div>
          </div>
          <div>
            <p class="text-sm font-bold" [class]="labelColorClass()">{{ scoreLabel() }}</p>
            <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{{ scoreDescription() }}</p>
          </div>
        </div>

        <!-- Quick ATS actions -->
        <div class="flex gap-2">
          <button type="button"
                  class="flex-1 py-1.5 text-[11px] font-semibold rounded-lg border transition-colors"
                  [class]="view() === 'score'
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'text-slate-600 border-slate-200 hover:bg-slate-50'"
                  (click)="view.set('score')">ATS Check</button>
          <button type="button"
                  class="flex-1 py-1.5 text-[11px] font-semibold rounded-lg border transition-colors"
                  [class]="view() === 'jd'
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'text-slate-600 border-slate-200 hover:bg-slate-50'"
                  (click)="view.set('jd')">JD Match</button>
        </div>
      </div>

      <!-- ── ATS CHECK VIEW ── -->
      @if (view() === 'score') {
        <div class="px-4 py-3 border-b border-slate-100">
          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">Score Breakdown</p>
          <div class="space-y-2.5">
            @for (sub of result().subScores; track sub.label) {
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[11px] font-medium text-slate-600">{{ sub.label }}</span>
                  <span class="text-[11px] font-bold tabular-nums"
                        [class]="sub.color === 'emerald' ? 'text-emerald-600' : sub.color === 'amber' ? 'text-amber-600' : 'text-red-500'">
                    {{ sub.pct }}/100
                  </span>
                </div>
                <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
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
        <div class="px-4 py-3 border-b border-slate-100">
          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Resume Checks</p>
          <div class="space-y-1.5">
            @for (check of result().checks; track check.label) {
              <div class="flex items-start gap-2">
                @if (check.passed) {
                  <svg class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                } @else {
                  <svg class="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                }
                <div class="flex-1 min-w-0">
                  <span class="text-[11px] block leading-tight"
                        [class]="check.passed ? 'text-slate-700' : 'text-slate-500'">
                    {{ check.label }}
                  </span>
                  @if (!check.passed && check.tip) {
                    <span class="text-[10px] text-amber-600 block mt-0.5 leading-tight">{{ check.tip }}</span>
                  }
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Positive feedback -->
        @if (result().score >= 70) {
          <div class="px-4 py-3 border-b border-slate-100">
            <div class="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
              <p class="text-sm">🎉</p>
              <p class="text-xs font-semibold text-emerald-800 mt-1">Looking good!</p>
              <p class="text-[11px] text-emerald-600 mt-0.5 leading-relaxed">Your resume is well-structured and optimized for ATS.</p>
            </div>
          </div>
        }
      }

      <!-- ── JD MATCH VIEW ── -->
      @if (view() === 'jd') {
        <div class="px-4 py-3 border-b border-slate-100">
          <label class="text-[11px] font-semibold text-slate-600 block mb-1.5">Paste Job Description</label>
          <textarea [(ngModel)]="jdText" (ngModelChange)="runJdMatch()"
                    rows="4"
                    placeholder="Paste the job description to see keyword match..."
                    class="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 leading-relaxed">
          </textarea>
        </div>

        @if (jdText.trim()) {
          <div class="px-4 py-3 border-b border-slate-100">
            <!-- JD score ring -->
            <div class="flex items-center gap-3 mb-3">
              <div class="relative w-12 h-12 shrink-0">
                <svg viewBox="0 0 36 36" class="w-12 h-12 -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#f1f5f9" stroke-width="3"/>
                  <circle cx="18" cy="18" r="15.5" fill="none"
                          [class]="jdRingClass()" stroke-width="3" stroke-linecap="round"
                          [attr.stroke-dasharray]="circumference"
                          [attr.stroke-dashoffset]="jdDashOffset()"/>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-sm font-extrabold text-slate-800">{{ jdResult().weightedScore }}%</span>
                </div>
              </div>
              <div>
                <p class="text-xs font-bold text-slate-800">{{ jdMatchLabel() }}</p>
                <p class="text-[11px] text-slate-500 mt-0.5">
                  {{ jdResult().matched.length }} / {{ jdResult().totalKeywords }} keywords
                </p>
              </div>
            </div>

            @if (jdResult().highPriorityMissing.length > 0) {
              <div class="mb-2.5">
                <p class="text-[10px] font-bold text-red-600 mb-1.5">Critical Missing ({{ jdResult().highPriorityMissing.length }})</p>
                <div class="flex flex-wrap gap-1">
                  @for (kw of jdResult().highPriorityMissing.slice(0, 8); track kw) {
                    <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200">+ {{ kw }}</span>
                  }
                </div>
              </div>
            }

            @if (jdResult().matched.length > 0) {
              <div>
                <p class="text-[10px] font-bold text-emerald-700 mb-1.5">Matched ({{ jdResult().matched.length }})</p>
                <div class="flex flex-wrap gap-1">
                  @for (kw of jdResult().matched.slice(0, 10); track kw) {
                    <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">{{ kw }}</span>
                  }
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="px-4 py-6 text-center text-slate-400">
            <p class="text-2xl mb-2">🎯</p>
            <p class="text-xs leading-relaxed">Paste a job description above to see how well your resume matches.</p>
          </div>
        }
      }

      <!-- ── AI ASSISTANT ── -->
      <div class="px-4 pt-3 pb-2">
        <div class="flex items-center gap-2 mb-2.5">
          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">AI Assistant</p>
          <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-600">BETA</span>
        </div>

        <div class="space-y-1.5">
          <!-- Improve with AI -->
          <button type="button"
                  class="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50 transition-all group text-left"
                  (click)="view.set('ai-bullet')">
            <div class="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-slate-800 group-hover:text-violet-700">Improve with AI</p>
              <p class="text-[10px] text-slate-400 mt-0.5">Get AI suggestions to improve your resume</p>
            </div>
            <svg class="w-3.5 h-3.5 text-slate-300 group-hover:text-violet-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          <!-- Generate Summary -->
          <button type="button"
                  class="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50 transition-all group text-left"
                  (click)="view.set('ai-summary')">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-slate-800 group-hover:text-violet-700">Generate Summary</p>
              <p class="text-[10px] text-slate-400 mt-0.5">Create a professional summary with AI</p>
            </div>
            <svg class="w-3.5 h-3.5 text-slate-300 group-hover:text-violet-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          <!-- Keyword Optimizer -->
          <button type="button"
                  class="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50 transition-all group text-left"
                  (click)="view.set('jd')">
            <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-slate-800 group-hover:text-violet-700">Keyword Optimizer</p>
              <p class="text-[10px] text-slate-400 mt-0.5">Find and add relevant keywords</p>
            </div>
            <svg class="w-3.5 h-3.5 text-slate-300 group-hover:text-violet-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          <!-- Check ATS Score -->
          <button type="button"
                  class="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50 transition-all group text-left"
                  (click)="view.set('score')">
            <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-slate-800 group-hover:text-violet-700">Check ATS Score</p>
              <p class="text-[10px] text-slate-400 mt-0.5">Recalculate your ATS score</p>
            </div>
            <svg class="w-3.5 h-3.5 text-slate-300 group-hover:text-violet-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- ── AI Summary Generator (expanded view) ── -->
      @if (view() === 'ai-summary') {
        <div class="px-4 py-3 border-t border-slate-100">
          @if (!auth.isPro()) {
            <div class="text-center py-4">
              <p class="text-2xl mb-2">🔒</p>
              <p class="text-xs font-semibold text-slate-700">Pro Feature</p>
              <p class="text-[11px] text-slate-400 mt-1">Upgrade to generate AI-powered summaries.</p>
            </div>
          } @else {
            <p class="text-xs font-semibold text-slate-700 mb-2">Generate Summary</p>
            <button class="w-full py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold hover:opacity-90 transition mb-3"
                    (click)="generateSummary()">
              ✨ Generate
            </button>
            @for (v of summaryVariants(); track $index) {
              <div class="bg-slate-50 rounded-xl p-2.5 text-[11px] text-slate-700 leading-relaxed border border-slate-200 mb-2">
                <p class="mb-1.5">{{ v }}</p>
                <button class="text-violet-600 font-semibold text-[10px] hover:underline"
                        (click)="applySummary(v)">Use this →</button>
              </div>
            }
          }
        </div>
      }

      <!-- ── AI Bullet Rewriter (expanded view) ── -->
      @if (view() === 'ai-bullet') {
        <div class="px-4 py-3 border-t border-slate-100">
          @if (!auth.isPro()) {
            <div class="text-center py-4">
              <p class="text-2xl mb-2">🔒</p>
              <p class="text-xs font-semibold text-slate-700">Pro Feature</p>
              <p class="text-[11px] text-slate-400 mt-1">Upgrade to rewrite bullets with AI.</p>
            </div>
          } @else {
            <p class="text-xs font-semibold text-slate-700 mb-2">Rewrite Bullet Point</p>
            <textarea [(ngModel)]="bulletInput" rows="2"
                      placeholder='e.g. "worked on reporting feature"'
                      class="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 mb-2">
            </textarea>
            <button class="w-full py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold hover:opacity-90 transition disabled:opacity-50 mb-2"
                    [disabled]="!bulletInput.trim()"
                    (click)="rewriteBullet()">
              ✨ Rewrite
            </button>
            @for (v of bulletVariants(); track $index) {
              <div class="bg-slate-50 rounded-xl p-2.5 text-[11px] text-slate-700 leading-relaxed border border-slate-200 mb-1.5">
                <p class="mb-1.5">• {{ v }}</p>
                <button class="text-violet-600 font-semibold text-[10px] hover:underline"
                        (click)="copyText(v)">Copy</button>
              </div>
            }
          }
        </div>
      }

      <!-- Bottom spacer -->
      <div class="h-4"></div>
    </div>
  `,
})
export class AtsScorePanelComponent {
  private readonly store   = inject(ResumeStoreService);
  private readonly atsSvc  = inject(AtsScoreService);
  readonly auth            = inject(AuthService);
  private notify           = inject(NotificationService);

  readonly circumference = 2 * Math.PI * 15.5;
  readonly view = signal<PanelView>('score');
  jdText = '';
  bulletInput = '';

  readonly result = computed(() => this.atsSvc.compute(this.store.activeResume()));

  readonly jdResult = signal<JdMatchResult>({
    score: 0, weightedScore: 0, matched: [], missing: [], totalKeywords: 0, highPriorityMissing: [],
  });

  readonly dashOffset   = computed(() => this.circumference * (1 - this.result().score / 100));
  readonly jdDashOffset = computed(() => this.circumference * (1 - this.jdResult().weightedScore / 100));

  readonly summaryVariants = signal<string[]>([]);
  readonly bulletVariants  = signal<string[]>([]);

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

  ringColorClass(): string {
    const s = this.result().score;
    return s >= 70 ? 'stroke-emerald-500' : s >= 50 ? 'stroke-amber-500' : 'stroke-red-500';
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

  generateSummary(): void {
    const r = this.store.activeResume();
    if (!r) return;
    const skills = r.skills.flatMap(g => g.items).slice(0, 6);
    const expYears = this.calcExpYears(r.experience);
    this.summaryVariants.set(generateSummary(r.personal.jobTitle || 'Professional', skills, expYears, r.projects.length > 0));
  }

  applySummary(text: string): void {
    this.store.updateSummary(text);
    this.notify.success('Summary applied', 'Your professional summary has been updated.');
  }

  rewriteBullet(): void {
    const variants = rewriteBullet(this.bulletInput);
    this.bulletVariants.set(variants.length > 0 ? variants : ['Could not rewrite - try a more descriptive bullet.']);
  }

  copyText(text: string): void {
    navigator.clipboard.writeText(text).then(() => this.notify.success('Copied to clipboard'));
  }

  private calcExpYears(experience: { startDate: string; endDate: string; current: boolean }[]): number {
    let months = 0;
    for (const e of experience) {
      const start = e.startDate ? new Date(e.startDate + '-01') : null;
      const end = e.current ? new Date() : (e.endDate ? new Date(e.endDate + '-01') : null);
      if (start && end && end > start) {
        months += (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      }
    }
    return Math.min(20, Math.floor(months / 12));
  }
}
