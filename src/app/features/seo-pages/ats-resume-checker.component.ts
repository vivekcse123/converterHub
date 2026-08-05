import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { JsonLdService } from '../../core/services/json-ld.service';
import { AtsCheckerService } from '../../core/services/ats-checker.service';
import { AtsReport } from '../../core/models/ats-checker.model';
import { AtsUploadComponent } from './ats-checker/ats-upload.component';
import { AtsAnalyzingComponent } from './ats-checker/ats-analyzing.component';
import { AtsReportComponent } from './ats-checker/ats-report.component';

type ViewState = 'upload' | 'analyzing' | 'report';

@Component({
  selector: 'app-ats-resume-checker',
  standalone: true,
  host: { class: 'block' },
  imports: [RouterLink, CommonModule, AtsUploadComponent, AtsAnalyzingComponent, AtsReportComponent],
  template: `
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white py-20">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none"></div>
      <div class="container-app relative text-center max-w-3xl mx-auto">
        <span class="inline-flex items-center gap-2 mb-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm font-medium">
          <span class="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
          Real AI Analysis · Instant · No Signup Required
        </span>
        <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
          AI-Powered ATS Resume Checker<br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300">A Real Deep Analysis, Not a Guess</span>
        </h1>
        <p class="text-lg text-emerald-100 max-w-2xl mx-auto mb-8 leading-relaxed">
          Our AI reviews your resume the way a recruiter, an ATS parser, and a professional editor would — grammar, achievements, formatting, and ATS compatibility, with a section-by-section score and exact fixes.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button (click)="scrollToChecker()"
             class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-emerald-700 font-bold hover:bg-emerald-50 shadow-xl transition text-base">
            🎯 Check My ATS Score - Free
          </button>
          <a routerLink="/resume-builder"
             class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition text-base">
            📄 Build ATS Resume
          </a>
        </div>
      </div>
    </section>

    <!-- Live ATS Checker Tool -->
    <section id="ats-checker" class="container-app py-12" [class]="viewState() === 'report' ? 'max-w-5xl' : 'max-w-3xl'">
      <div class="mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 class="text-base font-bold text-slate-800 dark:text-white">Check Your ATS Score</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Upload a PDF/DOCX/TXT file or paste your resume text for a real, deep AI analysis.</p>
        </div>

        @if (errorMessage()) {
          <div class="mx-6 mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
            {{ errorMessage() }}
          </div>
        }

        @switch (viewState()) {
          @case ('upload') {
            <app-ats-upload (fileSubmit)="onFileSubmit($event)" (textSubmit)="onTextSubmit($event)" />
          }
          @case ('analyzing') {
            <app-ats-analyzing [stage]="analyzingStage()" />
          }
          @case ('report') {
            @if (report(); as r) {
              <app-ats-report [report]="r" (startOver)="reset()" />
            }
          }
        }
      </div>
    </section>

    <!-- What is ATS -->
    <section class="container-app py-16 max-w-4xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">What is ATS and Why Does It Matter?</h2>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            An <strong>Applicant Tracking System (ATS)</strong> is software used by 98% of Fortune 500 companies and most Indian MNCs to automatically filter resumes before a human even reads them.
          </p>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            If your resume doesn't pass ATS screening, it gets rejected automatically - even if you're perfectly qualified. Our AI analyzes your resume the same way a recruiter and an ATS parser would.
          </p>
          <div class="flex flex-col gap-3">
            @for (check of atsChecks; track $index) {
              <div class="flex items-start gap-3">
                <span class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm shrink-0 mt-0.5">✓</span>
                <p class="text-sm text-slate-600 dark:text-slate-300">{{ check }}</p>
              </div>
            }
          </div>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 space-y-4">
          <p class="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Example ATS Score Report</p>
          @for (item of sampleScore; track $index) {
            <div>
              <div class="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                <span>{{ item.label }}</span>
                <span [class]="item.score >= 80 ? 'text-emerald-600' : item.score >= 60 ? 'text-amber-600' : 'text-red-500'">{{ item.score }}%</span>
              </div>
              <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all"
                     [class]="item.score >= 80 ? 'bg-emerald-500' : item.score >= 60 ? 'bg-amber-500' : 'bg-red-500'"
                     [style.width.%]="item.score"></div>
              </div>
            </div>
          }
          <div class="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between">
            <span class="text-sm font-bold text-slate-700 dark:text-slate-200">Overall ATS Score</span>
            <span class="text-sm font-extrabold text-emerald-600">88%</span>
          </div>
          <p class="text-[11px] text-slate-400 pt-1">Illustrative example — your real report includes 12 scored dimensions.</p>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="bg-slate-50 dark:bg-slate-800/30 py-16">
      <div class="container-app">
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">What Our AI Analyzes</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm">A genuinely deep pass across every dimension that matters to recruiters and ATS software</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (f of features; track $index) {
            <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3" [class]="f.bg">{{ f.icon }}</div>
              <h3 class="font-bold text-slate-800 dark:text-white text-sm mb-1">{{ f.title }}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ f.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="container-app py-16 max-w-3xl mx-auto">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-10">Frequently Asked Questions</h2>
      <div class="space-y-4">
        @for (faq of faqs; track $index) {
          <details class="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <summary class="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-slate-800 dark:text-white text-sm list-none select-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              {{ faq.q }}
              <span class="text-slate-400 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-3">▼</span>
            </summary>
            <div class="px-5 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">{{ faq.a }}</div>
          </details>
        }
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-gradient-to-r from-emerald-600 to-teal-600 py-16 text-white text-center">
      <div class="container-app max-w-2xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-extrabold mb-4">Ready to Beat the ATS?</h2>
        <p class="text-emerald-100 mb-8 text-base">Create an ATS-optimized resume in minutes. Our builder shows your ATS score in real time as you type.</p>
        <a routerLink="/resume-builder" class="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-emerald-700 font-bold hover:bg-emerald-50 shadow-xl transition text-base">
          🎯 Build ATS Resume - Free
        </a>
      </div>
    </section>
  `,
})
export class AtsResumeCheckerComponent implements OnInit, OnDestroy {
  private seo    = inject(SeoService);
  private jsonLd = inject(JsonLdService);
  private atsChecker = inject(AtsCheckerService);

  readonly viewState = signal<ViewState>('upload');
  readonly analyzingStage = signal(0);
  readonly report = signal<AtsReport | null>(null);
  readonly errorMessage = signal('');

  private stageTimers: ReturnType<typeof setTimeout>[] = [];

  scrollToChecker(): void {
    document.getElementById('ats-checker')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onFileSubmit(file: File): void {
    this.beginAnalysis();
    this.atsChecker.analyzeFile(file).subscribe({
      next: (res) => this.onAnalysisComplete(res.report),
      error: (err) => this.onAnalysisError(err),
    });
  }

  onTextSubmit(text: string): void {
    this.beginAnalysis();
    this.atsChecker.analyzeText(text).subscribe({
      next: (res) => this.onAnalysisComplete(res.report),
      error: (err) => this.onAnalysisError(err),
    });
  }

  private beginAnalysis(): void {
    this.errorMessage.set('');
    this.viewState.set('analyzing');
    this.analyzingStage.set(0);
    this.clearStageTimers();
    // Stages 0→1→2 are fast, real local/extraction steps that happen inside
    // the same request — advanced on a short timer since there's no
    // granular server-sent progress. Stage 2 ("Analyzing with AI") stays
    // active until the real response actually arrives (see onAnalysisComplete),
    // so the wait genuinely reflects the real Gemini call's duration, not a
    // decoupled fake timer.
    this.stageTimers.push(setTimeout(() => this.analyzingStage.set(1), 500));
    this.stageTimers.push(setTimeout(() => this.analyzingStage.set(2), 1100));
  }

  private onAnalysisComplete(report: AtsReport): void {
    this.clearStageTimers();
    this.analyzingStage.set(3);
    this.stageTimers.push(setTimeout(() => {
      this.report.set(report);
      this.viewState.set('report');
    }, 400));
  }

  private onAnalysisError(err: any): void {
    this.clearStageTimers();
    this.errorMessage.set(err?.error?.message || 'Something went wrong analyzing your resume. Please try again.');
    this.viewState.set('upload');
  }

  private clearStageTimers(): void {
    this.stageTimers.forEach(t => clearTimeout(t));
    this.stageTimers = [];
  }

  reset(): void {
    this.report.set(null);
    this.errorMessage.set('');
    this.viewState.set('upload');
  }

  readonly atsChecks = [
    'Contact information completeness',
    'Keyword density and job-title matching',
    'Section headings recognized by ATS',
    'Work experience with quantified achievements',
    'Skills coverage and formatting',
    'Grammar, spelling, and readability',
  ];

  readonly sampleScore = [
    { label: 'Keywords & Skills',       score: 92 },
    { label: 'Contact Info',             score: 100 },
    { label: 'Work Experience Quality',  score: 78 },
    { label: 'Section Structure',        score: 95 },
    { label: 'Quantified Achievements',  score: 72 },
  ];

  readonly features = [
    { icon: '🔍', bg: 'bg-emerald-100 dark:bg-emerald-900/30', title: 'Real AI Deep Analysis',     desc: 'Genuine Gemini-backed review of grammar, achievements, and ATS compatibility — not a random score.' },
    { icon: '📊', bg: 'bg-teal-100 dark:bg-teal-900/30',     title: '12 Section Scores',           desc: 'ATS compatibility, formatting, grammar, spelling, structure, readability, keywords, and more — each explained.' },
    { icon: '🖍️', bg: 'bg-cyan-100 dark:bg-cyan-900/30',     title: 'Inline Issue Highlighting',   desc: 'Every issue is located directly inside your resume preview, not buried in a generic list.' },
    { icon: '🎯', bg: 'bg-blue-100 dark:bg-blue-900/30',     title: 'Exact Fixes',                 desc: 'Every issue includes a concrete suggestion — a rewritten sentence, correct spelling, a stronger verb.' },
    { icon: '👔', bg: 'bg-primary-100 dark:bg-primary-900/30', title: 'Recruiter-Style Verdict',   desc: 'A realistic "Interview Ready / Borderline / Needs Work" assessment, not just a number.' },
    { icon: '🆓', bg: 'bg-amber-100 dark:bg-amber-900/30',   title: 'Free Daily Scans',            desc: 'Free accounts get real deep scans every day. No signup required to try it.' },
  ];

  readonly faqs = [
    { q: 'What is an ATS resume checker?', a: 'An ATS resume checker analyzes your resume the way Applicant Tracking Systems and recruiters do. Ours uses real AI analysis — grammar, achievement quality, formatting, and ATS compatibility — to give you a genuinely measured score, not a guess.' },
    { q: 'Is the ATS checker completely free?', a: 'Yes! You get real deep AI scans for free every day, with no signup required to try it. Create a free account for more daily scans.' },
    { q: 'How does ATS affect my job application?', a: 'Most large companies use ATS software to filter applications before a recruiter sees them. Studies show that over 75% of resumes are rejected by ATS before reaching a human. A good ATS score dramatically increases your chances of getting an interview call.' },
    { q: 'What ATS score should I aim for?', a: 'Aim for 80% or above. Scores between 70-80% are acceptable but need improvement. Below 70% means your resume is likely to be filtered out. Our templates are specifically designed to help you achieve 80%+ scores easily.' },
    { q: 'Does ApnaConverter support all ATS systems?', a: 'Our checker is calibrated against the most common ATS platforms used in India and globally - including Taleo, Workday, Greenhouse, and iCIMS. Our ATS-professional template is the safest choice for maximum compatibility.' },
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Free ATS Resume Checker - Score Your Resume Instantly | ApnaConverter',
      description: 'Check if your resume passes ATS systems with real AI analysis. Get an instant, deeply-scored ATS report with exact fixes. No signup required.',
      keywords: 'ATS resume checker, ATS score, applicant tracking system checker, resume ATS scanner, free ATS checker India',
    });
    this.jsonLd.setJsonLd('faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
    this.jsonLd.setJsonLd('software', {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'ApnaConverter ATS Resume Checker',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      description: 'AI-powered ATS resume checker that deeply analyzes your resume and provides a scored, explainable report.',
    });
  }

  ngOnDestroy(): void {
    this.jsonLd.removeJsonLd('faq');
    this.jsonLd.removeJsonLd('software');
    this.clearStageTimers();
  }
}
