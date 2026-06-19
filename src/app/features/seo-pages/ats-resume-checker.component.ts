import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { JsonLdService } from '../../core/services/json-ld.service';

@Component({
  selector: 'app-ats-resume-checker',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white py-20">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none"></div>
      <div class="container-app relative text-center max-w-3xl mx-auto">
        <span class="inline-flex items-center gap-2 mb-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm font-medium">
          <span class="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
          Free · Instant · No Signup Required
        </span>
        <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
          Free ATS Resume Checker<br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300">Score Your Resume Instantly</span>
        </h1>
        <p class="text-lg text-emerald-100 max-w-2xl mx-auto mb-8 leading-relaxed">
          Check if your resume passes Applicant Tracking Systems. Get a detailed ATS score, missing keyword analysis, and actionable improvement tips — completely free.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a routerLink="/resume-builder"
             class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-emerald-700 font-bold hover:bg-emerald-50 shadow-xl transition text-base">
            🎯 Check My ATS Score — Free
          </a>
          <a routerLink="/resume-builder"
             class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition text-base">
            📄 Build ATS Resume
          </a>
        </div>
        <!-- Score preview -->
        <div class="mt-10 inline-flex items-center gap-6 bg-white/10 backdrop-blur rounded-2xl px-8 py-4">
          <div class="text-center">
            <p class="text-3xl font-extrabold text-emerald-300">94%</p>
            <p class="text-xs text-white/70">Avg ATS score</p>
          </div>
          <div class="w-px h-8 bg-white/20"></div>
          <div class="text-center">
            <p class="text-3xl font-extrabold text-yellow-300">10K+</p>
            <p class="text-xs text-white/70">Resumes checked</p>
          </div>
          <div class="w-px h-8 bg-white/20"></div>
          <div class="text-center">
            <p class="text-3xl font-extrabold text-white">Free</p>
            <p class="text-xs text-white/70">Always</p>
          </div>
        </div>
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
            If your resume doesn't pass ATS screening, it gets rejected automatically — even if you're perfectly qualified. Our free checker analyzes your resume against the same criteria used by real ATS software.
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
          <p class="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Sample ATS Score Report</p>
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
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="bg-slate-50 dark:bg-slate-800/30 py-16">
      <div class="container-app">
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">What Our ATS Checker Analyzes</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm">Comprehensive checks across every dimension that matters to ATS software</p>
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
          🎯 Build ATS Resume — Free
        </a>
      </div>
    </section>
  `,
})
export class AtsResumeCheckerComponent implements OnInit, OnDestroy {
  private seo    = inject(SeoService);
  private jsonLd = inject(JsonLdService);

  readonly atsChecks = [
    'Contact information completeness',
    'Keyword density and job-title matching',
    'Section headings recognized by ATS',
    'Work experience with quantified achievements',
    'Skills coverage and formatting',
    'File format and parse-ability',
  ];

  readonly sampleScore = [
    { label: 'Keywords & Skills',       score: 92 },
    { label: 'Contact Info',             score: 100 },
    { label: 'Work Experience Quality',  score: 78 },
    { label: 'Section Structure',        score: 95 },
    { label: 'Quantified Achievements',  score: 72 },
  ];

  readonly features = [
    { icon: '🔍', bg: 'bg-emerald-100 dark:bg-emerald-900/30', title: 'Keyword Analysis',        desc: 'Checks if your resume contains industry-specific keywords that ATS systems look for.' },
    { icon: '📊', bg: 'bg-teal-100 dark:bg-teal-900/30',     title: 'Real-Time Score',           desc: 'See your ATS score update live as you fill in your resume sections.' },
    { icon: '📋', bg: 'bg-cyan-100 dark:bg-cyan-900/30',     title: 'Section Detection',         desc: 'Verifies your resume has all standard ATS-recognized sections.' },
    { icon: '🎯', bg: 'bg-blue-100 dark:bg-blue-900/30',     title: 'Actionable Tips',           desc: 'Get specific suggestions to fix issues and improve your score immediately.' },
    { icon: '⚡', bg: 'bg-violet-100 dark:bg-violet-900/30', title: 'Instant Results',           desc: 'No waiting. Score appears as soon as you add content to your resume.' },
    { icon: '🆓', bg: 'bg-amber-100 dark:bg-amber-900/30',   title: 'Completely Free',           desc: 'Basic ATS score is free forever. Pro plan unlocks full detailed analysis.' },
  ];

  readonly faqs = [
    { q: 'What is an ATS resume checker?', a: 'An ATS resume checker is a tool that simulates how Applicant Tracking Systems scan your resume. It analyzes keywords, formatting, section structure, and content to give you a score indicating how likely your resume is to pass automated screening.' },
    { q: 'Is the ATS checker completely free?', a: 'Yes! The basic ATS score is completely free and always will be. You can see your score in real time while building your resume. Our Pro plan unlocks a more detailed breakdown with specific keyword suggestions.' },
    { q: 'How does ATS affect my job application?', a: 'Most large companies use ATS software to filter applications before a recruiter sees them. Studies show that over 75% of resumes are rejected by ATS before reaching a human. A good ATS score dramatically increases your chances of getting an interview call.' },
    { q: 'What ATS score should I aim for?', a: 'Aim for 80% or above. Scores between 70-80% are acceptable but need improvement. Below 70% means your resume is likely to be filtered out. Our templates are specifically designed to help you achieve 80%+ scores easily.' },
    { q: 'Does ApnaConverter support all ATS systems?', a: 'Our checker is calibrated against the most common ATS platforms used in India and globally — including Taleo, Workday, Greenhouse, and iCIMS. Our ATS-professional template is the safest choice for maximum compatibility.' },
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Free ATS Resume Checker — Score Your Resume Instantly | ApnaConverter',
      description: 'Check if your resume passes ATS systems for free. Get instant ATS score, keyword analysis, and tips to improve. No signup required. Used by 10,000+ job seekers.',
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
      description: 'Free ATS resume checker tool that scores your resume and provides improvement suggestions.',
    });
  }

  ngOnDestroy(): void {
    this.jsonLd.removeJsonLd('faq');
    this.jsonLd.removeJsonLd('software');
  }
}
