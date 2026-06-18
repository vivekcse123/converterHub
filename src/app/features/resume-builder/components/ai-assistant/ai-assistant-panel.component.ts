import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeStoreService } from '../../services/resume-store.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

const ACTION_VERBS = [
  'Developed','Built','Designed','Implemented','Led','Delivered','Optimized','Reduced','Increased','Improved',
  'Architected','Streamlined','Automated','Launched','Managed','Coordinated','Spearheaded','Established',
  'Transformed','Accelerated','Engineered','Created','Deployed','Integrated','Maintained',
];

const IMPACT_PHRASES = [
  'reducing manual effort by 40%',
  'improving performance by 30%',
  'increasing team productivity by 25%',
  'cutting load time by 50%',
  'saving 10+ hours per week',
  'supporting 10,000+ users',
  'reducing errors by 60%',
  'boosting conversion rate by 20%',
];

function pickRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function rewriteBullet(bullet: string): string[] {
  const clean = bullet.replace(/^[-•*]\s*/, '').trim();
  if (!clean) return [];

  const alreadyHasVerb = ACTION_VERBS.some(v => clean.toLowerCase().startsWith(v.toLowerCase()));
  const hasNumbers = /\d/.test(clean);

  const base = alreadyHasVerb ? clean : `${pickRandom(ACTION_VERBS)} ${clean.charAt(0).toLowerCase() + clean.slice(1)}`;

  const variants: string[] = [];

  // Variant 1: add impact if no numbers
  if (!hasNumbers) {
    variants.push(`${base}, ${pickRandom(IMPACT_PHRASES)}`);
  } else {
    variants.push(base);
  }

  // Variant 2: different verb
  const verb2 = pickRandom(ACTION_VERBS.filter(v => !base.startsWith(v)));
  const core = alreadyHasVerb ? clean.split(' ').slice(1).join(' ') : clean;
  variants.push(`${verb2} ${core.charAt(0).toLowerCase() + core.slice(1)}, ${pickRandom(IMPACT_PHRASES)}`);

  // Variant 3: result-first framing
  const impact = pickRandom(IMPACT_PHRASES);
  const verb3 = pickRandom(ACTION_VERBS);
  variants.push(`${impact.charAt(0).toUpperCase() + impact.slice(1)} by ${verb3.toLowerCase()}ing ${core.toLowerCase()}`);

  return variants.slice(0, 3);
}

const OPENERS   = ['Results-driven','Dedicated','Dynamic','Accomplished','Experienced','Innovative','Skilled','Versatile','Motivated','Detail-oriented'];
const CLOSERS   = [
  'Passionate about building innovative products and collaborating with cross-functional teams.',
  'Committed to writing clean, maintainable code and continuously improving engineering processes.',
  'Known for delivering projects on time and raising engineering standards across teams.',
  'Driven by a passion for solving complex problems and creating meaningful user experiences.',
  'Adept at bridging the gap between technical teams and business stakeholders.',
  'Strong communicator who thrives in fast-paced, agile environments.',
  'Continuously upskilling to stay at the forefront of industry trends and best practices.',
];
const MID_PHRASES = [
  'Proven track record of delivering scalable, high-quality solutions that drive measurable business outcomes.',
  'Adept at translating business requirements into robust, maintainable technical solutions.',
  'Experienced across the full software development lifecycle — from design through deployment.',
  'Brings a strong foundation in system design, performance optimization, and team collaboration.',
  'Skilled at breaking down complex challenges into elegant, efficient solutions.',
  'Consistently delivers impactful results in cross-functional, deadline-driven environments.',
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function generateSummary(jobTitle: string, skills: string[], expYears: number, hasProjects: boolean): string[] {
  const shuffledSkills = shuffle(skills);
  const yearStr = expYears > 0 ? `${expYears}+ year${expYears !== 1 ? 's' : ''}` : '';
  const expClause = yearStr ? `with ${yearStr} of professional experience` : '';
  const openers  = shuffle(OPENERS);
  const mids     = shuffle(MID_PHRASES);
  const closers  = shuffle(CLOSERS);

  const variants: string[] = [];
  for (let i = 0; i < 3; i++) {
    const topSkills = shuffledSkills.slice(0, 3 + (i % 2)).join(', ') || 'software development';
    const projectClause = hasProjects ? `, with a portfolio of impactful projects` : '';
    const t = `${openers[i]} ${jobTitle} ${expClause ? expClause + ' and a' : 'with a'} strong background in ${topSkills}${projectClause}. ${mids[i % mids.length]} ${closers[i % closers.length]}`;
    variants.push(t.replace(/\s+/g, ' ').trim());
  }
  return variants;
}

@Component({
  selector: 'app-ai-assistant-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card p-4">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-base">🤖</span>
        <h3 class="font-semibold text-slate-800 dark:text-slate-100 text-sm">AI Writing Assistant</h3>
        @if (auth.isPro()) {
          <span class="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">Pro</span>
        } @else {
          <span class="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">Pro Only</span>
        }
      </div>

      @if (!auth.isPro()) {
        <div class="text-center py-5 space-y-2">
          <p class="text-3xl">🔒</p>
          <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">AI Assistant is a Pro feature</p>
          <p class="text-xs text-slate-400">Generate professional summaries, rewrite weak bullets, and get smart suggestions — upgrade to Pro to unlock.</p>
        </div>
      } @else {
        <!-- Tab -->
        <div class="flex gap-0 mb-4 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <button class="flex-1 py-2 text-xs font-semibold transition"
                  [style.background]="tool() === 'summary' ? '#4f46e5' : ''"
                  [style.color]="tool() === 'summary' ? '#fff' : ''"
                  (click)="tool.set('summary')">📝 Summary</button>
          <button class="flex-1 py-2 text-xs font-semibold transition"
                  [style.background]="tool() === 'bullet' ? '#4f46e5' : ''"
                  [style.color]="tool() === 'bullet' ? '#fff' : ''"
                  (click)="tool.set('bullet')">✨ Bullet</button>
        </div>

        <!-- Summary generator -->
        @if (tool() === 'summary') {
          <div class="space-y-3">
            <p class="text-xs text-slate-500 dark:text-slate-400">Generate a professional summary from your resume data.</p>
            <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold hover:opacity-90 transition"
                    (click)="generateSummary()">
              ✨ Generate Summary
            </button>
            @for (v of summaryVariants(); track $index) {
              <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-200 leading-relaxed border border-slate-200 dark:border-slate-700 group">
                <p class="mb-2">{{ v }}</p>
                <div class="flex gap-2">
                  <button class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline text-[11px]"
                          (click)="applySummary(v)">Use this →</button>
                  <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[11px]"
                          (click)="copyText(v)">Copy</button>
                </div>
              </div>
            }
            @if (summaryVariants().length > 0) {
              <button class="w-full py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition"
                      (click)="generateSummary()">🔄 Regenerate</button>
            }
          </div>
        }

        <!-- Bullet rewriter -->
        @if (tool() === 'bullet') {
          <div class="space-y-3">
            <p class="text-xs text-slate-500 dark:text-slate-400">Enter a weak bullet point and get 3 stronger, results-focused rewrites.</p>
            <div>
              <label class="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Original bullet</label>
              <textarea [(ngModel)]="bulletInput" rows="2"
                        placeholder='e.g. "worked on reporting feature" or "helped with testing"'
                        class="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
            </div>
            <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold hover:opacity-90 transition disabled:opacity-50"
                    [disabled]="!bulletInput.trim()"
                    (click)="rewriteBullet()">
              ✨ Rewrite Bullet
            </button>
            @for (v of bulletVariants(); track $index) {
              <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-200 leading-relaxed border border-slate-200 dark:border-slate-700">
                <p class="mb-2">• {{ v }}</p>
                <button class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline text-[11px]"
                        (click)="copyText(v)">Copy</button>
              </div>
            }
            @if (bulletVariants().length === 0 && bulletInput.trim()) {
              <p class="text-xs text-slate-400 text-center">Click "Rewrite Bullet" to see suggestions.</p>
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

  readonly tool = signal<'summary' | 'bullet'>('summary');
  readonly summaryVariants = signal<string[]>([]);
  readonly bulletVariants  = signal<string[]>([]);

  bulletInput = '';

  generateSummary(): void {
    const r = this.store.activeResume();
    if (!r) return;
    const skills = r.skills.flatMap(g => g.items).slice(0, 6);
    const expYears = this.calcExpYears(r.experience);
    const variants = generateSummary(r.personal.jobTitle || 'Professional', skills, expYears, r.projects.length > 0);
    this.summaryVariants.set(variants);
  }

  applySummary(text: string): void {
    this.store.updateSummary(text);
    this.notify.success('Summary applied', 'Your professional summary has been updated.');
  }

  rewriteBullet(): void {
    const variants = rewriteBullet(this.bulletInput);
    this.bulletVariants.set(variants.length > 0 ? variants : ['Could not rewrite — try a more descriptive bullet.']);
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
