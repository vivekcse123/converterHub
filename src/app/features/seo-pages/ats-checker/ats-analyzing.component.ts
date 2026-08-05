import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/** Stage labels reflect the REAL pipeline steps (see ats-resume-checker's
 *  orchestration) — the active stage genuinely corresponds to what's
 *  happening: fast local stages resolve almost immediately, "Analyzing with
 *  AI" stays active for however long the real Gemini call actually takes.
 *  Not a decorative timer running independent of real work. */
const STAGES = [
  'Parsing resume',
  'Detecting sections',
  'Analyzing with AI — grammar, achievements, ATS compatibility',
  'Calculating scores',
];

@Component({
  selector: 'app-ats-analyzing',
  standalone: true,
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-10 flex flex-col items-center text-center">
      <div class="relative w-16 h-16 mb-6">
        <div class="absolute inset-0 rounded-full border-4 border-emerald-100 dark:border-emerald-900/40"></div>
        <div class="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
      </div>
      <p class="text-sm font-bold text-slate-800 dark:text-white mb-1">Analyzing your resume…</p>
      <p class="text-xs text-slate-400 mb-6">This takes a few seconds for a genuinely deep pass.</p>

      <div class="w-full max-w-xs space-y-2.5">
        @for (label of stages; track label; let i = $index) {
          <div class="flex items-center gap-2.5 text-left">
            @if (i < stage()) {
              <span class="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shrink-0">✓</span>
            } @else if (i === stage()) {
              <span class="w-4 h-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin shrink-0"></span>
            } @else {
              <span class="w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-700 shrink-0"></span>
            }
            <span class="text-xs" [class]="i <= stage() ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400'">{{ label }}</span>
          </div>
        }
      </div>
    </div>
  `,
})
export class AtsAnalyzingComponent {
  /** 0-based index of the currently active stage. */
  stage = input(0);
  readonly stages = STAGES;
}
