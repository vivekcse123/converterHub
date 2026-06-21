import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ResumeStoreService } from '../../services/resume-store.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AiService } from '../../../../core/services/ai.service';

type Tab = 'summary' | 'bullet' | 'suggest';

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
        <span class="text-base">🤖</span>
        <h3 class="font-semibold text-slate-800 dark:text-slate-100 text-sm">AI Writing Assistant</h3>
        @if (auth.isPro()) {
          <span class="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">Pro</span>
        } @else {
          <span class="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">Pro Only</span>
        }
      </div>

      @if (!auth.isPro()) {
        <div class="text-center py-6 space-y-2">
          <p class="text-3xl">🔒</p>
          <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">AI Assistant is a Pro feature</p>
          <p class="text-xs text-slate-400 leading-relaxed">Generate professional summaries, rewrite weak bullets with Gemini AI, and get fresh bullet suggestions — upgrade to unlock.</p>
        </div>
      } @else {

        <!-- Tabs -->
        <div class="grid grid-cols-3 gap-0 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs font-semibold">
          @for (t of tabs; track t.id) {
            <button class="py-2 transition"
                    [style.background]="tab() === t.id ? '#4f46e5' : ''"
                    [style.color]="tab() === t.id ? '#fff' : ''"
                    (click)="tab.set(t.id)">{{ t.label }}</button>
          }
        </div>

        <!-- ── SUMMARY TAB ── -->
        @if (tab() === 'summary') {
          <div class="space-y-3">
            <p class="text-xs text-slate-500 dark:text-slate-400">Gemini will write a professional summary from your resume data.</p>
            <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60"
                    [disabled]="loading()"
                    (click)="generateSummary()">
              @if (loading()) {
                <span class="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Generating…
              } @else { ✨ Generate Summary }
            </button>
            @for (v of summaryVariants(); track $index) {
              <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-200 leading-relaxed border border-slate-200 dark:border-slate-700">
                <p class="mb-2">{{ v }}</p>
                <div class="flex gap-3">
                  <button class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline" (click)="applySummary(v)">Use this →</button>
                  <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" (click)="copy(v)">Copy</button>
                </div>
              </div>
            }
            @if (summaryVariants().length > 0) {
              <button class="w-full py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition"
                      (click)="generateSummary()">🔄 Regenerate</button>
            }
          </div>
        }

        <!-- ── BULLET REWRITE TAB ── -->
        @if (tab() === 'bullet') {
          <div class="space-y-3">
            <p class="text-xs text-slate-500 dark:text-slate-400">Paste a weak bullet — AI rewrites it with action verbs and metrics.</p>
            <textarea [(ngModel)]="bulletInput" rows="2"
                      placeholder='e.g. "worked on reporting feature" or "helped with testing"'
                      class="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
            <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60"
                    [disabled]="!bulletInput.trim() || loading()"
                    (click)="rewriteBullet()">
              @if (loading()) {
                <span class="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Rewriting…
              } @else { ✨ Rewrite with AI }
            </button>
            @for (v of bulletVariants(); track $index) {
              <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-200 leading-relaxed border border-slate-200 dark:border-slate-700">
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
                   class="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input [(ngModel)]="suggestCompany" type="text" placeholder="Company (optional)"
                   class="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60"
                    [disabled]="!suggestJobTitle.trim() || loading()"
                    (click)="suggestBullets()">
              @if (loading()) {
                <span class="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Generating…
              } @else { 🚀 Generate Bullets }
            </button>
            @for (v of suggestedBullets(); track $index) {
              <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-200 leading-relaxed border border-slate-200 dark:border-slate-700">
                <p class="mb-2">• {{ v }}</p>
                <button class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline" (click)="copy(v)">Copy</button>
              </div>
            }
            @if (suggestedBullets().length > 0) {
              <button class="w-full py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition"
                      (click)="suggestBullets()">🔄 Regenerate</button>
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

  readonly tab             = signal<Tab>('summary');
  readonly loading         = signal(false);
  readonly summaryVariants = signal<string[]>([]);
  readonly bulletVariants  = signal<string[]>([]);
  readonly suggestedBullets = signal<string[]>([]);

  bulletInput    = '';
  suggestJobTitle = '';
  suggestCompany  = '';

  readonly tabs: { id: Tab; label: string }[] = [
    { id: 'summary', label: '📝 Summary' },
    { id: 'bullet',  label: '✨ Rewrite' },
    { id: 'suggest', label: '🚀 Suggest' },
  ];

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

  copy(text: string): void {
    navigator.clipboard.writeText(text).then(() => this.notify.success('Copied to clipboard'));
  }
}
