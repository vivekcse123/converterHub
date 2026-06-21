import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { JsonLdService } from '../../core/services/json-ld.service';

@Component({
  selector: 'app-government-resume-builder',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-indigo-900 text-white py-20">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none"></div>
      <div class="container-app relative text-center max-w-3xl mx-auto">
        <span class="inline-flex items-center gap-2 mb-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm font-medium">
          🏛️ SSC · UPSC · State PSC · Banking · Railways
        </span>
        <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
          Government Job Resume Format<br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300">Free Download in PDF</span>
        </h1>
        <p class="text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Create a government job resume in the correct official format. Approved for SSC, UPSC, State PSC, Banking, Railways, and all central and state government positions.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <a routerLink="/resume-builder" [queryParams]="{template: 'ats-professional'}"
             class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-800 font-bold hover:bg-slate-100 shadow-xl transition text-base">
            🏛️ Create Govt Resume - Free
          </a>
          <a routerLink="/resume-builder" [queryParams]="{template: 'minimal'}"
             class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition text-base">
            📋 View Templates
          </a>
        </div>
        <div class="inline-flex flex-wrap justify-center gap-4 bg-white/5 rounded-2xl px-6 py-4">
          @for (badge of exams; track $index) {
            <span class="text-sm font-semibold text-slate-300">{{ badge }}</span>
          }
        </div>
      </div>
    </section>

    <!-- Recommended templates -->
    <section class="container-app py-12 max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Recommended Templates for Government Resumes</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm">Use a clean, plain format - no tables, no colors, no graphics</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        @for (tpl of recommendedTemplates; track tpl.id) {
          <a [routerLink]="'/resume-builder'" [queryParams]="{template: tpl.id}"
             class="group flex items-start gap-4 bg-white dark:bg-slate-900 border-2 rounded-2xl p-5 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
             [class]="tpl.recommended ? 'border-indigo-400 ring-2 ring-indigo-200 dark:ring-indigo-900/50' : 'border-slate-200 dark:border-slate-700'">
            <div class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-sm" [class]="tpl.gradient">
              {{ tpl.icon }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <p class="font-bold text-slate-800 dark:text-white text-sm">{{ tpl.name }}</p>
                @if (tpl.recommended) {
                  <span class="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded">⭐ RECOMMENDED</span>
                }
                @if (tpl.free) {
                  <span class="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded">FREE</span>
                }
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">{{ tpl.desc }}</p>
              <span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline">Use this template →</span>
            </div>
          </a>
        }
      </div>
    </section>

    <!-- Format requirements -->
    <section class="container-app py-16 max-w-4xl mx-auto">
      <div class="text-center mb-10">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Government Resume Format Requirements</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm">What every government job application resume must include</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        @for (req of requirements; track $index) {
          <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:shadow-md transition-all">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3" [class]="req.bg">{{ req.icon }}</div>
            <h3 class="font-bold text-slate-800 dark:text-white text-sm mb-1">{{ req.title }}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ req.desc }}</p>
          </div>
        }
      </div>
    </section>

    <!-- Do's and Don'ts -->
    <section class="bg-slate-50 dark:bg-slate-800/30 py-16">
      <div class="container-app max-w-4xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-10">Government Resume Do's and Don'ts</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800">
            <h3 class="font-bold text-emerald-800 dark:text-emerald-300 mb-4 flex items-center gap-2">✅ Do's</h3>
            <ul class="space-y-3">
              @for (item of dos; track $index) {
                <li class="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span class="text-emerald-500 shrink-0 mt-0.5">✓</span> {{ item }}
                </li>
              }
            </ul>
          </div>
          <div class="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
            <h3 class="font-bold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">❌ Don'ts</h3>
            <ul class="space-y-3">
              @for (item of donts; track $index) {
                <li class="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span class="text-red-500 shrink-0 mt-0.5">✗</span> {{ item }}
                </li>
              }
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="container-app py-16 max-w-3xl mx-auto">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-10">Government Resume FAQs</h2>
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
    <section class="bg-gradient-to-r from-slate-800 to-indigo-800 py-16 text-white text-center">
      <div class="container-app max-w-2xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-extrabold mb-4">Build Your Government Job Resume</h2>
        <p class="text-slate-300 mb-8">Professional format accepted by all government departments. Free PDF download.</p>
        <a routerLink="/resume-builder"
           class="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-800 font-bold hover:bg-slate-100 shadow-xl transition text-base">
          🏛️ Create Government Resume - Free
        </a>
      </div>
    </section>
  `,
})
export class GovernmentResumeBuilderComponent implements OnInit, OnDestroy {
  private seo    = inject(SeoService);
  private jsonLd = inject(JsonLdService);

  readonly recommendedTemplates = [
    {
      id: 'ats-professional',
      name: 'ATS Professional',
      icon: '📋',
      gradient: 'bg-gradient-to-br from-slate-700 to-slate-900',
      desc: 'Single-column, plain typography - the closest match to official government resume format. Accepted by all departments.',
      recommended: true,
      free: false,
    },
    {
      id: 'minimal',
      name: 'Minimal',
      icon: '📄',
      gradient: 'bg-gradient-to-br from-gray-400 to-gray-600',
      desc: 'Pure typography, no color or graphics - ideal for government applications that require a simple, clean format.',
      recommended: false,
      free: true,
    },
  ];

  readonly exams = ['SSC', 'UPSC', 'State PSC', 'IBPS', 'SBI PO', 'Railways', 'Defence', 'NHM'];

  readonly requirements = [
    { icon: '📋', bg: 'bg-slate-100 dark:bg-slate-800',   title: 'Plain Text Format',         desc: 'Government resumes must use simple, plain formatting without borders, tables, or decorative elements.' },
    { icon: '📸', bg: 'bg-blue-100 dark:bg-blue-900/30',  title: 'Passport Size Photo',        desc: 'A recent passport-size photograph is mandatory for most government job applications.' },
    { icon: '📅', bg: 'bg-indigo-100 dark:bg-indigo-900/30', title: 'Date of Birth',           desc: 'Must be clearly mentioned with proof reference (10th marksheet or birth certificate).' },
    { icon: '🆔', bg: 'bg-violet-100 dark:bg-violet-900/30', title: 'Category & Reservation',  desc: 'Clearly state General/OBC/SC/ST/EWS category as it affects eligibility and cut-offs.' },
    { icon: '📜', bg: 'bg-amber-100 dark:bg-amber-900/30', title: 'Declarations',              desc: 'Government resumes often require a declaration: "I hereby declare that the above information is true to the best of my knowledge."' },
    { icon: '🖊️', bg: 'bg-emerald-100 dark:bg-emerald-900/30', title: 'Signature & Date',     desc: 'Physical signature with place and date is required at the bottom of the government resume.' },
  ];

  readonly dos = [
    'Keep the format simple and professional',
    'Include all educational qualifications with % and year',
    'Mention category (General/OBC/SC/ST) clearly',
    'Include a passport-size photo',
    'Add a declaration with date and signature',
    'Use A4 size with standard margins',
    'Include all government-required personal details',
  ];

  readonly donts = [
    'Don\'t use fancy fonts or colored text',
    'Don\'t use tables, columns or borders',
    'Don\'t add unnecessary graphics or icons',
    'Don\'t exceed 2 pages for most positions',
    'Don\'t leave gaps in employment history unexplained',
    'Don\'t use abbreviations without full forms',
    'Don\'t submit without a physical or digital signature',
  ];

  readonly faqs = [
    { q: 'What is the correct format for a government job resume in India?', a: 'A government job resume in India should be simple, plain text format with sections for: Personal Details (with photo), Educational Qualifications, Work Experience, Technical Skills, Achievements, and a Declaration. It should be typed in Times New Roman or Arial font, size 12, on A4 paper.' },
    { q: 'Do I need a different resume for SSC and UPSC?', a: 'The basic format is similar, but UPSC resumes (Detailed Application Form) follow a very specific government-prescribed format. SSC and banking resumes are more flexible. Our resume builder\'s "ATS Professional" template works well for most government applications.' },
    { q: 'Should a government resume include a photo?', a: 'Yes, most government job applications in India require a recent passport-size photograph to be affixed in the top right corner of the resume. Our resume builder supports photo upload and placement.' },
    { q: 'Is it free to create a government resume on ApnaConverter?', a: 'Yes, completely free! You can create, edit, and download your government resume as a PDF at no cost. No watermarks, no registration required for basic download.' },
    { q: 'What font should I use for a government job resume?', a: 'Use simple, professional fonts: Times New Roman (size 12) is the most traditional choice for government applications. Arial or Calibri (size 11-12) are also widely accepted. Our ATS Professional template uses these standards automatically.' },
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Government Job Resume Format - Free PDF Download | ApnaConverter',
      description: 'Create a government job resume in the correct official format. Works for SSC, UPSC, State PSC, Banking, Railways. Free PDF download. No registration needed.',
      keywords: 'government job resume format, sarkari naukri resume, SSC resume format, UPSC resume, government resume India, sarkari resume PDF',
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
  }

  ngOnDestroy(): void { this.jsonLd.removeJsonLd('faq'); }
}
