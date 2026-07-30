import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ResumeStoreService } from '../../services/resume-store.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AiService } from '../../../../core/services/ai.service';

type Tab = 'summary' | 'bullet' | 'suggest' | 'tools';
type ToolMode = 'grammar' | 'deepcheck' | 'professional' | 'executive' | 'shorten' | 'expand' | 'translate';

const TOOL_MODES: { id: ToolMode; label: string }[] = [
  { id: 'grammar',      label: 'Fix Grammar' },
  { id: 'deepcheck',    label: 'Deep Check' },
  { id: 'professional', label: 'Professional' },
  { id: 'executive',    label: 'Executive' },
  { id: 'shorten',      label: 'Shorten' },
  { id: 'expand',       label: 'Expand' },
  { id: 'translate',    label: 'Translate' },
];

@Component({
  selector: 'app-ai-assistant-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 space-y-3">

      <!-- Header -->
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
        <h3 class="font-semibold text-gray-800 dark:text-slate-100 text-sm">AI Writing Assistant</h3>
        @if (auth.isPro()) {
          <span class="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">Pro</span>
        } @else {
          <span class="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">Pro Only</span>
        }
      </div>

      @if (!auth.isPro()) {
        <div class="text-center py-6 space-y-2">
          <div class="w-12 h-12 mx-auto bg-canvas dark:bg-slate-800 rounded-full flex items-center justify-center" aria-hidden="true">
            <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <p class="text-sm font-semibold text-gray-700 dark:text-slate-200">AI Assistant is a Pro feature</p>
          <p class="text-xs text-gray-400 leading-relaxed">Generate professional summaries, rewrite weak bullets with Gemini AI, and get fresh bullet suggestions — upgrade to unlock.</p>
        </div>
      } @else {

        <!-- Tabs -->
        <div class="grid grid-cols-4 gap-1 bg-canvas dark:bg-slate-800 rounded-2xl p-1 text-[11px] font-semibold">
          @for (t of tabs; track t.id) {
            <button class="py-2 rounded-xl transition-all duration-[250ms]"
                    [style.background]="tab() === t.id ? '#4f46e5' : ''"
                    [style.color]="tab() === t.id ? '#fff' : ''"
                    (click)="tab.set(t.id)">{{ t.label }}</button>
          }
        </div>

        <!-- ── SUMMARY TAB ── -->
        @if (tab() === 'summary') {
          <div class="space-y-3">
            <p class="text-xs text-slate-500 dark:text-slate-400">Gemini will write a professional summary from your resume data.</p>
            <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-primary-600 text-white text-xs font-bold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60"
                    [disabled]="loading()"
                    (click)="generateSummary()">
              @if (loading()) {
                <span class="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Generating…
              } @else {
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                Generate Summary
              }
            </button>
            @for (v of summaryVariants(); track $index) {
              <div class="bg-canvas dark:bg-slate-800 rounded-2xl p-3.5 text-xs text-gray-700 dark:text-slate-200 leading-relaxed border border-hairline dark:border-slate-700">
                <p class="mb-2">{{ v }}</p>
                <div class="flex gap-3">
                  <button class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline" (click)="applySummary(v)">Use this →</button>
                  <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" (click)="copy(v)">Copy</button>
                </div>
              </div>
            }
            @if (summaryVariants().length > 0) {
              <button class="w-full py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition"
                      (click)="generateSummary()">Regenerate</button>
            }
          </div>
        }

        <!-- ── BULLET REWRITE TAB ── -->
        @if (tab() === 'bullet') {
          <div class="space-y-3">
            <p class="text-xs text-slate-500 dark:text-slate-400">Paste a weak bullet — AI rewrites it with action verbs and metrics.</p>
            <textarea [(ngModel)]="bulletInput" rows="2"
                      placeholder='e.g. "worked on reporting feature" or "helped with testing"'
                      class="w-full text-xs px-3 py-2.5 rounded-2xl border border-hairline dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
            <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-primary-600 text-white text-xs font-bold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60"
                    [disabled]="!bulletInput.trim() || loading()"
                    (click)="rewriteBullet()">
              @if (loading()) {
                <span class="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Rewriting…
              } @else {
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                Rewrite with AI
              }
            </button>
            @for (v of bulletVariants(); track $index) {
              <div class="bg-canvas dark:bg-slate-800 rounded-2xl p-3.5 text-xs text-gray-700 dark:text-slate-200 leading-relaxed border border-hairline dark:border-slate-700">
                <p class="mb-2">• {{ v }}</p>
                <button class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline" (click)="copy(v)">Copy</button>
              </div>
            }
          </div>
        }

        <!-- ── SUGGEST BULLETS TAB ── -->
        @if (tab() === 'suggest') {
          <div class="space-y-3">
            <p class="text-xs text-slate-500 dark:text-slate-400">Get fresh ATS-optimised bullet points for a specific job role.</p>
            <input [(ngModel)]="suggestJobTitle" type="text" placeholder="Job title, e.g. Frontend Developer"
                   class="w-full text-xs px-3 py-2.5 rounded-2xl border border-hairline dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input [(ngModel)]="suggestCompany" type="text" placeholder="Company (optional)"
                   class="w-full text-xs px-3 py-2.5 rounded-2xl border border-hairline dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-primary-600 text-white text-xs font-bold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60"
                    [disabled]="!suggestJobTitle.trim() || loading()"
                    (click)="suggestBullets()">
              @if (loading()) {
                <span class="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Generating…
              } @else {
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Generate Bullets
              }
            </button>
            @for (v of suggestedBullets(); track $index) {
              <div class="bg-canvas dark:bg-slate-800 rounded-2xl p-3.5 text-xs text-gray-700 dark:text-slate-200 leading-relaxed border border-hairline dark:border-slate-700">
                <p class="mb-2">• {{ v }}</p>
                <button class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline" (click)="copy(v)">Copy</button>
              </div>
            }
            @if (suggestedBullets().length > 0) {
              <button class="w-full py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition"
                      (click)="suggestBullets()">Regenerate</button>
            }
          </div>
        }

        <!-- ── TOOLS TAB (grammar / tone / length / translate) ── -->
        @if (tab() === 'tools') {
          <div class="space-y-3">
            <div class="flex flex-wrap gap-1.5">
              @for (m of toolModes; track m.id) {
                <button type="button" (click)="toolMode.set(m.id)"
                        class="px-2.5 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-[250ms]"
                        [class]="toolMode() === m.id ? 'bg-indigo-600 text-white' : 'bg-canvas dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'">
                  {{ m.label }}
                </button>
              }
            </div>

            <p class="text-xs text-slate-500 dark:text-slate-400">{{ toolModeHint() }}</p>

            @if (toolMode() === 'translate') {
              <input [(ngModel)]="targetLanguage" type="text" placeholder="Target language, e.g. Hindi, Spanish"
                     class="w-full text-xs px-3 py-2.5 rounded-2xl border border-hairline dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            }

            <textarea [(ngModel)]="toolInput" rows="4"
                      placeholder="Paste the resume text you want to transform…"
                      class="w-full text-xs px-3 py-2.5 rounded-2xl border border-hairline dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>

            <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-primary-600 text-white text-xs font-bold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60"
                    [disabled]="!toolInput.trim() || loading()"
                    (click)="runTool()">
              @if (loading()) {
                <span class="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Working…
              } @else {
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                Run {{ toolModeLabel() }}
              }
            </button>

            @if (toolResult()) {
              <div class="bg-canvas dark:bg-slate-800 rounded-2xl p-3.5 text-xs text-gray-700 dark:text-slate-200 leading-relaxed border border-hairline dark:border-slate-700">
                <p class="mb-2 whitespace-pre-line">{{ toolResult() }}</p>
                <button class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline" (click)="copy(toolResult())">Copy</button>
              </div>
            }
          </div>
        }

      }
    </div>
  `,
})
export class AiAssistantPanelComponent {
  readonly store  = inject(ResumeStoreService);
  readonly auth   = inject(AuthService);
  private notify  = inject(NotificationService);
  private aiSvc   = inject(AiService);

  /** Which tab to open on first render — set by the caller (e.g. the bottom AI dock buttons). */
  readonly initialTab      = input<Tab>('summary');
  readonly tab             = signal<Tab>('summary');

  /** Which Tools-tab mode to preselect on open — set by the AI dock's per-tool buttons. */
  readonly initialToolMode = input<ToolMode>('grammar');
  readonly toolMode        = signal<ToolMode>('grammar');

  /** Emitted once a generated result has actually been applied to the resume — the
   *  parent uses this to auto-close the floating panel on real completion. Copy
   *  actions don't emit this: users often copy several bullet variants in a row. */
  readonly applied = output<void>();

  constructor() {
    effect(() => {
      const t = this.initialTab();
      untracked(() => this.tab.set(t));
    });
    effect(() => {
      const m = this.initialToolMode();
      untracked(() => this.toolMode.set(m));
    });
  }
  readonly loading         = signal(false);
  readonly summaryVariants = signal<string[]>([]);
  readonly bulletVariants  = signal<string[]>([]);
  readonly suggestedBullets = signal<string[]>([]);
  readonly toolResult      = signal<string>('');

  bulletInput     = '';
  suggestJobTitle = '';
  suggestCompany  = '';
  toolInput       = '';
  targetLanguage  = '';

  readonly tabs: { id: Tab; label: string }[] = [
    { id: 'summary', label: 'Summary' },
    { id: 'bullet',  label: 'Rewrite' },
    { id: 'suggest', label: 'Suggest' },
    { id: 'tools',   label: 'Tools' },
  ];

  readonly toolModes = TOOL_MODES;

  toolModeLabel(): string {
    return TOOL_MODES.find(m => m.id === this.toolMode())?.label ?? 'Transform';
  }

  toolModeHint(): string {
    switch (this.toolMode()) {
      case 'grammar':      return 'Fixes grammar, spelling, and punctuation — keeps the meaning the same.';
      case 'deepcheck':    return 'A deeper pass: grammar, clarity, weak verbs, and ATS-friendliness.';
      case 'professional': return 'Rewrites in a polished, professional tone.';
      case 'executive':    return 'Rewrites in a confident, leadership-oriented tone for senior roles.';
      case 'shorten':      return 'Cuts the text down while keeping every key fact and metric.';
      case 'expand':       return 'Adds specific detail, scope, and impact to a short line.';
      case 'translate':    return 'Translates into the language you specify below.';
      default:             return '';
    }
  }

  async generateSummary(): Promise<void> {
    const r = this.store.activeResume();
    if (!r) { this.notify.error('Open a resume first'); return; }

    this.loading.set(true);
    this.summaryVariants.set([]);
    try {
      const skills = r.skills.flatMap(g => g.items).slice(0, 8).join(', ');
      const exp    = r.experience.map(e => `${e.role} at ${e.company}`).join('; ');

      // Generate 3 variants by calling AI 3 times with different style prompts
      const styles = ['professional and concise', 'confident and results-focused', 'enthusiastic and dynamic'];
      const results = await Promise.all(styles.map(style =>
        firstValueFrom(this.aiSvc.generateCoverLetter({
          name:     r.personal.fullName,
          jobTitle: r.personal.jobTitle,
          skills:   skills.split(', '),
          experience: exp,
        }))
      ));
      // Extract first 3 sentences from each as a "summary"
      const variants = results.map(res => {
        const letter = res.data?.letter ?? '';
        const sentences = letter.split(/(?<=[.!?])\s+/);
        return sentences.slice(1, 4).join(' ').replace(/^(I am|I'm)\s/, '').trim();
      }).filter(Boolean);

      this.summaryVariants.set(variants.length ? variants : ['Could not generate — check your AI key and try again.']);
    } catch {
      this.notify.error('AI request failed. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  applySummary(text: string): void {
    this.store.updateSummary(text);
    this.notify.success('Summary applied');
    this.applied.emit();
  }

  async rewriteBullet(): Promise<void> {
    if (!this.bulletInput.trim()) return;
    const r = this.store.activeResume();

    this.loading.set(true);
    this.bulletVariants.set([]);
    try {
      const res = await firstValueFrom(
        this.aiSvc.generateBullets({
          jobTitle:    r?.personal.jobTitle || 'Professional',
          description: this.bulletInput,
          count:       3,
        })
      );
      const bullets = res.data?.bullets ?? [];
      this.bulletVariants.set(bullets.length ? bullets : ['Could not rewrite — try a more descriptive bullet.']);
    } catch {
      this.notify.error('AI request failed. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  async suggestBullets(): Promise<void> {
    if (!this.suggestJobTitle.trim()) return;

    this.loading.set(true);
    this.suggestedBullets.set([]);
    try {
      const res = await firstValueFrom(
        this.aiSvc.generateBullets({
          jobTitle: this.suggestJobTitle,
          company:  this.suggestCompany,
          count:    5,
        })
      );
      const bullets = res.data?.bullets ?? [];
      this.suggestedBullets.set(bullets.length ? bullets : ['No suggestions generated — try a different job title.']);
    } catch {
      this.notify.error('AI request failed. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  async runTool(): Promise<void> {
    if (!this.toolInput.trim()) return;

    this.loading.set(true);
    this.toolResult.set('');
    try {
      const res = await firstValueFrom(
        this.aiSvc.transformText({
          mode: this.toolMode(),
          text: this.toolInput,
          targetLanguage: this.toolMode() === 'translate' ? (this.targetLanguage || 'Hindi') : undefined,
        })
      );
      this.toolResult.set(res.data?.result || 'Could not transform — please try again.');
    } catch {
      this.notify.error('AI request failed. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  copy(text: string): void {
    navigator.clipboard.writeText(text).then(() => this.notify.success('Copied to clipboard'));
  }
}
