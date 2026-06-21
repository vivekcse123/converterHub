import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ResumeStoreService } from '../../services/resume-store.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UpgradeModalComponent } from '../../components/upgrade-modal/upgrade-modal.component';
import { JsonLdService } from '../../../../core/services/json-ld.service';
import { AiService } from '../../../../core/services/ai.service';

interface CoverLetterForm {
  hiringManager: string;
  company: string;
  role: string;
  resumeId: string;
  tone: 'professional' | 'confident' | 'enthusiastic';
  highlight: string;
}

function buildLetter(form: CoverLetterForm, candidateName: string, jobTitle: string, skills: string[], expYears: number): string {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const greeting = form.hiringManager ? `Dear ${form.hiringManager},` : 'Dear Hiring Manager,';
  const topSkills = skills.slice(0, 3).join(', ') || 'the required skills';
  const expStr = expYears > 0 ? `${expYears}+ years of experience` : 'a strong foundation';
  const highlight = form.highlight.trim() ? `\n\n${form.highlight.trim()}` : '';

  const openers: Record<string, string> = {
    professional: `I am writing to express my strong interest in the ${form.role || 'open position'} at ${form.company || 'your company'}.`,
    confident: `I am excited to apply for the ${form.role || 'position'} role at ${form.company || 'your company'}, where I am confident I can make an immediate impact.`,
    enthusiastic: `I was thrilled to discover the ${form.role || 'opening'} at ${form.company || 'your company'} and am eager to bring my skills and energy to your team.`,
  };

  const closers: Record<string, string> = {
    professional: `I would welcome the opportunity to discuss how my background aligns with your team's needs. Thank you for your time and consideration.`,
    confident: `I would love the opportunity to discuss how I can contribute to ${form.company || 'your team'}'s success. I am available at your earliest convenience.`,
    enthusiastic: `I would be delighted to discuss how my background and enthusiasm can add value to ${form.company || 'your team'}. I look forward to hearing from you!`,
  };

  return `${today}

${greeting}

${openers[form.tone]} With ${expStr} as a ${jobTitle || 'professional'} and expertise in ${topSkills}, I am well-positioned to contribute meaningfully to ${form.company || 'your organisation'}.${highlight}

Throughout my career, I have consistently delivered results by leveraging my technical and collaborative skills. I am particularly drawn to ${form.company || 'your company'} because of its reputation for innovation and its commitment to excellence. I believe my background makes me a strong fit for the ${form.role || 'this'} role.

${closers[form.tone]}

Sincerely,
${candidateName || 'Your Name'}`;
}

@Component({
  selector: 'app-cover-letter',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe, UpgradeModalComponent],
  template: `
    @if (showUpgrade()) {
      <app-upgrade-modal (close)="showUpgrade.set(false)" />
    }

    <div class="container-app py-8 space-y-6 max-w-4xl">

      <!-- Header -->
      <div class="flex items-center gap-3 flex-wrap">
        <a routerLink="/resume-builder" class="text-xs text-slate-400 hover:text-violet-600 transition flex items-center gap-1">← Resume Builder</a>
        <span class="text-slate-300 dark:text-slate-700">|</span>
        <h1 class="text-xl font-extrabold text-slate-900 dark:text-white">Cover Letter Builder</h1>
        @if (!auth.isPro()) {
          <span class="ml-auto text-xs font-bold px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">Pro Feature</span>
        }
      </div>

      @if (!auth.isPro()) {
        <div class="space-y-4">
          <!-- Sample preview (blurred teaser) -->
          <div class="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div class="absolute inset-0 bg-white/80 dark:bg-slate-900/85 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <p class="text-4xl">🔒</p>
              <p class="text-base font-bold text-slate-800 dark:text-white">Cover Letter Builder - Pro Only</p>
              <p class="text-sm text-slate-500 dark:text-slate-400 max-w-xs">Generate tailored, professional cover letters from your resume in seconds.</p>
              <button class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm hover:opacity-90 transition shadow-md"
                      (click)="showUpgrade.set(true)">Upgrade to Pro ⭐</button>
            </div>
            <!-- Blurred sample letter content -->
            <div class="p-6 pointer-events-none select-none" aria-hidden="true">
              <pre class="whitespace-pre-wrap text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{{ sampleLetter }}</pre>
            </div>
          </div>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <!-- Left: Form -->
          <div class="space-y-4">
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              <h2 class="text-sm font-bold text-slate-700 dark:text-slate-300">Job Details</h2>

              <div>
                <label class="text-xs font-semibold text-slate-500 block mb-1">Based on Resume</label>
                <select [(ngModel)]="form.resumeId" (ngModelChange)="onResumeChange()"
                        class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500">
                  @for (r of store.resumes(); track r.id) {
                    <option [value]="r.id">{{ r.name || 'Untitled Resume' }}</option>
                  }
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-semibold text-slate-500 block mb-1">Role Applying For *</label>
                  <input type="text" [(ngModel)]="form.role" placeholder="e.g. Senior Developer"
                         class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
                <div>
                  <label class="text-xs font-semibold text-slate-500 block mb-1">Company Name *</label>
                  <input type="text" [(ngModel)]="form.company" placeholder="e.g. Google"
                         class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
              </div>

              <div>
                <label class="text-xs font-semibold text-slate-500 block mb-1">Hiring Manager Name (optional)</label>
                <input type="text" [(ngModel)]="form.hiringManager" placeholder="e.g. Ms. Priya Sharma"
                       class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>

              <div>
                <label class="text-xs font-semibold text-slate-500 block mb-1">Tone</label>
                <div class="grid grid-cols-3 gap-2">
                  @for (t of tones; track t.value) {
                    <button class="py-2 rounded-xl text-xs font-semibold border transition"
                            [class]="form.tone === t.value ? 'bg-violet-100 dark:bg-violet-900/30 border-violet-400 text-violet-700 dark:text-violet-300' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-violet-300'"
                            (click)="form.tone = t.value">{{ t.label }}</button>
                  }
                </div>
              </div>

              <div>
                <label class="text-xs font-semibold text-slate-500 block mb-1">Custom Highlight (optional)</label>
                <textarea [(ngModel)]="form.highlight" rows="2"
                          placeholder="Add a specific achievement or why you're excited about this company..."
                          class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"></textarea>
              </div>

              <!-- Generate buttons -->
              <div class="flex flex-col gap-2">
                <!-- AI generate — Pro only -->
                <button class="w-full py-3 rounded-xl font-bold text-sm transition shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                        [class]="auth.isPro()
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90'
                          : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90'"
                        [disabled]="!form.role || !form.company || generating()"
                        (click)="generateWithAI()">
                  @if (generating()) {
                    <span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    Generating with AI…
                  } @else if (!auth.isPro()) {
                    🔒 Generate with AI — Pro Only
                  } @else {
                    🤖 Generate with AI
                  }
                </button>
                <!-- Quick template — always free -->
                <button class="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        [disabled]="!form.role || !form.company"
                        (click)="generate()">
                  ✍️ Quick Template
                </button>
              </div>
            </div>
          </div>

          <!-- Right: Preview -->
          <div class="space-y-3">
            @if (letterText()) {
              <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-sm font-bold text-slate-700 dark:text-slate-300">Preview</h2>
                  <div class="flex items-center gap-2">
                    <button class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
                            (click)="copy()">📋 Copy</button>
                    <button class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 transition"
                            (click)="downloadTxt()">⬇️ Download .txt</button>
                  </div>
                </div>
                <pre class="whitespace-pre-wrap text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/50 max-h-[600px] overflow-y-auto">{{ letterText() }}</pre>
              </div>
            } @else {
              <div class="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center">
                <p class="text-5xl mb-4">✉️</p>
                <p class="font-semibold text-slate-600 dark:text-slate-300 mb-1">Your cover letter will appear here</p>
                <p class="text-xs text-slate-400">Fill in the job details and click Generate.</p>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class CoverLetterComponent implements OnInit, OnDestroy {
  readonly store   = inject(ResumeStoreService);
  readonly auth    = inject(AuthService);
  private notify   = inject(NotificationService);
  private readonly jsonLd = inject(JsonLdService);
  private readonly ai     = inject(AiService);

  readonly showUpgrade = signal(false);
  readonly letterText  = signal('');
  readonly generating  = signal(false);

  readonly sampleLetter = `21 June 2026

Dear Hiring Manager,

I am writing to express my strong interest in the Senior Software Engineer position at TechCorp India. With 5+ years of experience as a Full Stack Developer and expertise in React, Node.js, and cloud infrastructure, I am well-positioned to contribute meaningfully to your organisation.

Throughout my career at InnoSoft Solutions, I consistently delivered results — reducing API response times by 40%, leading a team of 4 engineers, and shipping 3 major product features ahead of schedule.

I would welcome the opportunity to discuss how my background aligns with your team's needs. Thank you for your time and consideration.

Sincerely,
Rahul Sharma`;

  readonly tones = [
    { value: 'professional' as const, label: '🎩 Professional' },
    { value: 'confident'    as const, label: '💪 Confident' },
    { value: 'enthusiastic' as const, label: '🌟 Enthusiastic' },
  ];

  form: CoverLetterForm = {
    hiringManager: '',
    company: '',
    role: '',
    resumeId: '',
    tone: 'professional',
    highlight: '',
  };

  ngOnInit(): void {
    const active = this.store.activeResume();
    if (active) {
      this.form.resumeId = active.id;
      this.form.role = active.personal.jobTitle || '';
    }
    this.jsonLd.setJsonLd('cover-letter-app', {
      '@context': 'https://schema.org', '@type': 'SoftwareApplication',
      name: 'ApnaConverter Cover Letter Builder',
      url: 'https://www.apnaconverter.com/resume-builder/cover-letter',
      applicationCategory: 'BusinessApplication',
      description: 'Generate a professional, tailored cover letter from your resume data in seconds. Choose tone, fill in company details, and get a ready-to-send letter - free.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    });
  }

  ngOnDestroy(): void {
    this.jsonLd.removeJsonLd('cover-letter-app');
  }

  onResumeChange(): void {
    const r = this.store.resumes().find(r => r.id === this.form.resumeId);
    if (r && !this.form.role) this.form.role = r.personal.jobTitle || '';
  }

  generate(): void {
    const r = this.store.resumes().find(r => r.id === this.form.resumeId) ?? this.store.activeResume();
    if (!r) return;
    const skills = r.skills.flatMap(g => g.items);
    const expYears = this.calcExpYears(r.experience);
    const text = buildLetter(this.form, r.personal.fullName, r.personal.jobTitle, skills, expYears);
    this.letterText.set(text);
  }

  async generateWithAI(): Promise<void> {
    if (!this.auth.isPro()) { this.showUpgrade.set(true); return; }
    const r = this.store.resumes().find(r => r.id === this.form.resumeId) ?? this.store.activeResume();
    if (!r) { this.notify.error('Select a resume first'); return; }

    this.generating.set(true);
    try {
      const skills     = r.skills.flatMap(g => g.items);
      const experience = r.experience.map(e => `${e.role} at ${e.company}`).join(', ');
      const res = await firstValueFrom(
        this.ai.generateCoverLetter({
          name:        r.personal.fullName,
          jobTitle:    this.form.role,
          company:     this.form.company,
          skills,
          experience,
        })
      );
      this.letterText.set(res.data?.letter ?? '');
    } catch {
      this.notify.error('AI generation failed. Try the Quick Template instead.');
    } finally {
      this.generating.set(false);
    }
  }

  copy(): void {
    navigator.clipboard.writeText(this.letterText()).then(() => this.notify.success('Copied to clipboard'));
  }

  downloadTxt(): void {
    const blob = new Blob([this.letterText()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${this.form.company || 'application'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
