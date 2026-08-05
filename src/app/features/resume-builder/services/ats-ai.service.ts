import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AiService, AtsAiResult } from '../../../core/services/ai.service';
import { ResumeData } from '../models/resume.model';

export type AtsAiState = 'idle' | 'analyzing' | 'done' | 'error';

/** Named progress stages shown while the real Gemini-backed analysis runs —
 *  purely a UX affordance so the wait never looks frozen; the timer that
 *  advances through them is independent of (and never outruns) the real
 *  network response. */
export const ATS_AI_STAGES = [
  'Reading Resume',
  'Parsing Sections',
  'Matching ATS Rules',
  'AI Research',
  'Calculating Score',
  'Generating Suggestions',
] as const;

/**
 * Orchestrates the AI-powered ATS deep analysis: a single explicit,
 * user-triggered Gemini call (never wired to resume edits/keystrokes) plus
 * the animated stage UI and staleness tracking so re-analysis is opt-in.
 * Deliberately separate from `AtsScoreService`, which stays as the free,
 * instant, deterministic heuristic checker.
 */
@Injectable({ providedIn: 'root' })
export class AtsAiService {
  private readonly aiSvc = inject(AiService);

  readonly stages     = ATS_AI_STAGES;
  readonly state       = signal<AtsAiState>('idle');
  readonly stageIndex  = signal(0);
  readonly result      = signal<AtsAiResult | null>(null);
  readonly error       = signal<string | null>(null);

  private lastSignature: string | null = null;
  private stageTimer?: ReturnType<typeof setInterval>;

  /** True once a result exists and the resume has changed since that analysis ran. */
  isStale(resume: ResumeData): boolean {
    if (!this.result()) return false;
    return this.signatureOf(resume) !== this.lastSignature;
  }

  async analyze(resume: ResumeData): Promise<void> {
    if (this.state() === 'analyzing') return;

    this.state.set('analyzing');
    this.error.set(null);
    this.stageIndex.set(0);
    this.clearStageTimer();

    // Advances through the first N-1 named stages on a fixed cadence and then
    // holds on the last-but-one stage — it never reaches "done" on its own, so
    // the checklist always looks alive without ever claiming completion before
    // the real response lands.
    this.stageTimer = setInterval(() => {
      this.stageIndex.update(i => Math.min(i + 1, this.stages.length - 2));
    }, 900);

    const signature = this.signatureOf(resume);
    try {
      const res = await firstValueFrom(this.aiSvc.analyzeResumeAts(resume));
      this.clearStageTimer();
      this.stageIndex.set(this.stages.length - 1);
      await new Promise<void>(r => setTimeout(r, 350));

      if (!res?.data) throw new Error(res?.message || 'Analysis failed. Please try again.');
      this.result.set(res.data);
      this.lastSignature = signature;
      this.state.set('done');
    } catch (err: unknown) {
      this.clearStageTimer();
      this.error.set(err instanceof Error ? err.message : 'AI analysis failed. Please try again.');
      this.state.set('error');
    }
  }

  reset(): void {
    this.clearStageTimer();
    this.state.set('idle');
    this.stageIndex.set(0);
    this.result.set(null);
    this.error.set(null);
    this.lastSignature = null;
  }

  private signatureOf(resume: ResumeData): string {
    return JSON.stringify({
      personal: resume.personal,
      summary: resume.summary,
      experience: resume.experience,
      education: resume.education,
      projects: resume.projects,
      skills: resume.skills,
      certifications: resume.certifications,
      achievements: resume.achievements,
      languages: resume.languages,
      sectionOrder: resume.sectionOrder,
    });
  }

  private clearStageTimer(): void {
    if (this.stageTimer) clearInterval(this.stageTimer);
    this.stageTimer = undefined;
  }
}
