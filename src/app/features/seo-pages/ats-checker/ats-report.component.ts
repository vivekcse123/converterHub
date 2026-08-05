import { Component, ChangeDetectionStrategy, computed, input, output, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AtsReport, AtsIssueCategory, SECTION_SCORE_LABELS } from '../../../core/models/ats-checker.model';

const SEVERITY_MARK_CLASS: Record<string, string> = {
  critical: 'bg-red-200/70 dark:bg-red-900/50 border-b-2 border-red-500',
  high:     'bg-orange-200/70 dark:bg-orange-900/50 border-b-2 border-orange-500',
  medium:   'bg-amber-200/60 dark:bg-amber-900/40 border-b-2 border-amber-500',
  low:      'bg-sky-200/60 dark:bg-sky-900/40 border-b-2 border-sky-500',
};

const SEVERITY_BADGE_CLASS: Record<string, string> = {
  critical: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  high:     'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
  medium:   'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  low:      'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300',
};

const VERDICT_LABEL: Record<string, string> = {
  ready: 'Interview Ready', borderline: 'Borderline', 'needs-work': 'Needs Improvement',
};
const VERDICT_CLASS: Record<string, string> = {
  ready: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  borderline: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  'needs-work': 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
};

@Component({
  selector: 'app-ats-report',
  standalone: true,
  host: { class: 'block' },
  imports: [TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-5 sm:p-6 space-y-6">

      <!-- Overall score + verdict -->
      <div class="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl border"
           [class]="report().overallScore >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
                     report().overallScore >= 60 ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' :
                                                    'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'">
        <div class="text-center shrink-0">
          <p class="text-5xl font-extrabold" [class]="report().overallScore >= 80 ? 'text-emerald-600' : report().overallScore >= 60 ? 'text-amber-600' : 'text-red-500'">
            {{ report().overallScore }}
          </p>
          <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mt-1">Overall ATS Score</p>
        </div>
        <div class="flex-1 text-center sm:text-left">
          <span class="inline-block px-2.5 py-1 rounded-full text-xs font-bold mb-2" [class]="VERDICT_CLASS[report().recruiterSummary.verdict]">
            {{ VERDICT_LABEL[report().recruiterSummary.verdict] }}
          </span>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ report().recruiterSummary.notes }}</p>
          <div class="flex items-center justify-center sm:justify-start gap-4 mt-3 text-[11px] text-slate-400">
            <span>~{{ readingTimeLabel() }} read</span>
            <span>{{ report().lengthStats.wordCount }} words</span>
            <span>~{{ report().lengthStats.pageEstimate }} page{{ report().lengthStats.pageEstimate > 1 ? 's' : '' }}</span>
          </div>
        </div>
      </div>

      <!-- Section scores -->
      <div>
        <h3 class="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Score Breakdown</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          @for (key of sectionKeys; track key) {
            <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{{ SECTION_LABELS[key] }}</span>
                <span class="text-[11px] font-bold tabular-nums" [class]="scoreColor(report().sectionScores[key])">{{ report().sectionScores[key] }}</span>
              </div>
              <div class="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500" [class]="scoreBg(report().sectionScores[key])" [style.width.%]="report().sectionScores[key]"></div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Missing sections -->
      @if (report().sectionsMissing.length) {
        <div>
          <h3 class="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Missing Sections</h3>
          <div class="space-y-2">
            @for (m of report().sectionsMissing; track m.name) {
              <div class="p-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold px-1.5 py-0.5 rounded" [class]="SEVERITY_BADGE_CLASS[m.impact]">{{ m.impact | titlecase }}</span>
                  <span class="text-sm font-semibold text-slate-800 dark:text-slate-100">Missing {{ m.name }}</span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{{ m.recommendation }}</p>
              </div>
            }
          </div>
        </div>
      }

      <!-- Two-column: Action Center + highlighted preview -->
      <div class="grid lg:grid-cols-2 gap-5">
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xs font-bold uppercase tracking-wide text-slate-400">Action Center ({{ report().issues.length }})</h3>
          </div>
          <div class="flex flex-wrap gap-1.5 mb-3">
            <button type="button" (click)="activeCategory.set(null)" class="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors"
              [class]="activeCategory() === null ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'">
              All
            </button>
            @for (cat of categoriesPresent(); track cat) {
              <button type="button" (click)="activeCategory.set(cat)" class="px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize transition-colors"
                [class]="activeCategory() === cat ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'">
                {{ cat }} ({{ countByCategory(cat) }})
              </button>
            }
          </div>

          <div class="flex items-center gap-3 mb-3 text-[11px]">
            @for (sev of severities; track sev) {
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full" [class]="SEVERITY_BADGE_CLASS[sev]"></span>{{ sev | titlecase }} ({{ countBySeverity(sev) }})</span>
            }
          </div>

          <div class="space-y-2 max-h-[32rem] overflow-y-auto pr-1">
            @if (filteredIssues().length === 0) {
              <p class="text-sm text-slate-400 py-6 text-center">No issues in this category. 🎉</p>
            }
            @for (issue of filteredIssues(); track issue.id) {
              <button type="button" (click)="scrollToIssue(issue.id)"
                class="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase" [class]="SEVERITY_BADGE_CLASS[issue.severity]">{{ issue.severity }}</span>
                  <span class="text-[10px] text-slate-400 capitalize">{{ issue.category }}</span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 italic mb-1 truncate">"{{ issue.quote }}"</p>
                <p class="text-sm text-slate-700 dark:text-slate-200">{{ issue.explanation }}</p>
                @if (issue.suggestion) {
                  <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1.5"><strong>Fix:</strong> {{ issue.suggestion }}</p>
                }
              </button>
            }
          </div>
        </div>

        <div>
          <h3 class="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Resume Preview <span class="font-normal normal-case text-slate-400">(issues highlighted)</span></h3>
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 max-h-[32rem] overflow-y-auto text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono"
               [innerHTML]="highlightedHtml()"></div>
        </div>
      </div>

      <!-- Strengths / Weaknesses -->
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10">
          <h3 class="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300 mb-2">Strengths</h3>
          <ul class="space-y-1.5">
            @for (s of report().strengths; track s) { <li class="text-sm text-slate-600 dark:text-slate-300 flex gap-2"><span class="text-emerald-500">✓</span>{{ s }}</li> }
          </ul>
        </div>
        <div class="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
          <h3 class="text-xs font-bold uppercase tracking-wide text-red-700 dark:text-red-300 mb-2">Weaknesses</h3>
          <ul class="space-y-1.5">
            @for (w of report().weaknesses; track w) { <li class="text-sm text-slate-600 dark:text-slate-300 flex gap-2"><span class="text-red-500">✗</span>{{ w }}</li> }
          </ul>
        </div>
      </div>

      <!-- Achievement stats -->
      <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <h3 class="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Achievement Quality ({{ report().achievementStats.totalBullets }} bullets analyzed)</h3>
        <div class="grid grid-cols-3 gap-3 text-center">
          <div><p class="text-lg font-bold text-emerald-600">{{ report().achievementStats.strongCount }}</p><p class="text-[10px] text-slate-400 uppercase">Strong</p></div>
          <div><p class="text-lg font-bold text-amber-600">{{ report().achievementStats.moderateCount }}</p><p class="text-[10px] text-slate-400 uppercase">Moderate</p></div>
          <div><p class="text-lg font-bold text-red-500">{{ report().achievementStats.weakCount }}</p><p class="text-[10px] text-slate-400 uppercase">Weak</p></div>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">{{ report().achievementStats.quantifiedCount }} of {{ report().achievementStats.totalBullets }} bullets include a measurable metric.</p>
      </div>

      <button type="button" (click)="startOver.emit()" class="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
        Check another resume
      </button>
    </div>
  `,
})
export class AtsReportComponent {
  report = input.required<AtsReport>();
  startOver = output<void>();

  readonly SECTION_LABELS = SECTION_SCORE_LABELS;
  readonly sectionKeys = Object.keys(SECTION_SCORE_LABELS) as (keyof typeof SECTION_SCORE_LABELS)[];
  readonly SEVERITY_BADGE_CLASS = SEVERITY_BADGE_CLASS;
  readonly VERDICT_LABEL = VERDICT_LABEL;
  readonly VERDICT_CLASS = VERDICT_CLASS;
  readonly severities = ['critical', 'high', 'medium', 'low'] as const;

  readonly activeCategory = signal<AtsIssueCategory | null>(null);

  constructor(private sanitizer: DomSanitizer) {}

  readonly categoriesPresent = computed(() => {
    const set = new Set(this.report().issues.map(i => i.category));
    return Array.from(set);
  });

  readonly filteredIssues = computed(() => {
    const cat = this.activeCategory();
    const issues = this.report().issues;
    return cat ? issues.filter(i => i.category === cat) : issues;
  });

  countByCategory(cat: string): number {
    return this.report().issues.filter(i => i.category === cat).length;
  }
  countBySeverity(sev: string): number {
    return this.report().issues.filter(i => i.severity === sev).length;
  }

  readingTimeLabel(): string {
    const sec = this.report().lengthStats.readingTimeSec;
    return sec < 60 ? `${sec}s` : `${Math.round(sec / 60)} min`;
  }

  scoreColor(score: number): string {
    return score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-500';
  }
  scoreBg(score: number): string {
    return score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500';
  }

  scrollToIssue(id: string): void {
    const el = document.querySelector(`[data-issue="${id}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el?.classList.add('ring-2', 'ring-emerald-500');
    setTimeout(() => el?.classList.remove('ring-2', 'ring-emerald-500'), 1500);
  }

  private escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  readonly highlightedHtml = computed<SafeHtml>(() => {
    const r = this.report();
    let escaped = this.escapeHtml(r.resumeText);
    for (const issue of r.issues) {
      const q = this.escapeHtml(issue.quote || '');
      if (!q || !escaped.includes(q)) continue; // no verbatim match — skip highlighting silently, per plan
      const cls = SEVERITY_MARK_CLASS[issue.severity] ?? SEVERITY_MARK_CLASS['medium'];
      const mark = `<mark class="rounded px-0.5 ${cls}" data-issue="${issue.id}" title="${this.escapeHtml(issue.explanation)}">${q}</mark>`;
      escaped = escaped.replace(q, mark);
    }
    return this.sanitizer.bypassSecurityTrustHtml(escaped.replace(/\n/g, '<br>'));
  });
}
