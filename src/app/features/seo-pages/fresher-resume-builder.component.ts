import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { JsonLdService } from '../../core/services/json-ld.service';

@Component({
  selector: 'app-fresher-resume-builder',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-800 text-white py-20">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.06),transparent_60%)] pointer-events-none"></div>
      <div class="container-app relative">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <span class="inline-flex items-center gap-2 mb-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm font-medium">
              <span class="w-2 h-2 rounded-full bg-yellow-300 animate-pulse"></span>
              Specially designed for students & freshers
            </span>
            <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
              Resume for Freshers - <br>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300">No Experience?</span><br>
              No Problem!
            </h1>
            <p class="text-lg text-indigo-100 max-w-lg mb-8 leading-relaxed">
              Create a professional resume as a fresh graduate or student. Our fresher-optimized templates highlight your skills, education, and projects - exactly what recruiters want to see.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 mb-6">
              <a routerLink="/resume-builder" [queryParams]="{template: 'fresher'}"
                 class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 shadow-xl transition text-sm">
                🎓 Create Fresher Resume - Free
              </a>
              <a routerLink="/resume-templates"
                 class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition text-sm">
                🎨 View Templates
              </a>
            </div>
            <div class="flex flex-wrap gap-x-5 gap-y-2 text-sm text-indigo-200">
              <span class="flex items-center gap-1.5"><span class="text-yellow-300">✓</span> No experience needed</span>
              <span class="flex items-center gap-1.5"><span class="text-yellow-300">✓</span> ATS-friendly format</span>
              <span class="flex items-center gap-1.5"><span class="text-yellow-300">✓</span> 100% free</span>
            </div>
          </div>
          <!-- Resume mockup -->
          <div class="hidden lg:block">
            <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-xs mx-auto">
              <div class="h-1 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 mb-4"></div>
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-full bg-violet-200 shrink-0"></div>
                <div>
                  <div class="h-3 bg-slate-800 rounded w-28 mb-1.5"></div>
                  <div class="h-2 bg-violet-400 rounded w-20"></div>
                </div>
              </div>
              <div class="space-y-3">
                @for (section of resumeMock; track $index) {
                  <div>
                    <div class="h-2 bg-violet-600 rounded w-16 mb-1.5"></div>
                    <div class="space-y-1">
                      <div class="h-1.5 bg-slate-100 rounded w-full"></div>
                      <div class="h-1.5 bg-slate-100 rounded w-4/5"></div>
                    </div>
                  </div>
                }
              </div>
              <div class="mt-4 flex gap-2">
                <span class="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">ATS ✓</span>
                <span class="text-[9px] font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">Fresher Template</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tips for freshers -->
    <section class="container-app py-16 max-w-4xl mx-auto">
      <div class="text-center mb-10">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">What to Include in a Fresher Resume</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm">No work experience? Here's exactly what recruiters want to see</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        @for (tip of tips; track $index) {
          <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-violet-300 hover:shadow-md transition-all">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3" [class]="tip.bg">{{ tip.icon }}</div>
            <h3 class="font-bold text-slate-800 dark:text-white text-sm mb-1">{{ tip.title }}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ tip.desc }}</p>
          </div>
        }
      </div>
    </section>

    <!-- Companies that hire freshers -->
    <section class="bg-slate-50 dark:bg-slate-800/30 py-12">
      <div class="container-app text-center">
        <p class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider">Top companies hiring freshers from our platform</p>
        <div class="flex flex-wrap justify-center gap-4">
          @for (co of companies; track $index) {
            <span class="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm">{{ co }}</span>
          }
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="container-app py-16 max-w-3xl mx-auto">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-10">Fresher Resume FAQs</h2>
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
    <section class="bg-gradient-to-r from-violet-600 to-indigo-600 py-16 text-white text-center">
      <div class="container-app max-w-2xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-extrabold mb-4">Land Your First Job - Start Today!</h2>
        <p class="text-indigo-100 mb-8">Create a professional fresher resume in under 10 minutes. ATS-optimized, downloadable as PDF, completely free.</p>
        <a routerLink="/resume-builder" [queryParams]="{template: 'fresher'}"
           class="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 shadow-xl transition text-base">
          🎓 Create My Fresher Resume - Free
        </a>
      </div>
    </section>
  `,
})
export class FresherResumeBuilderComponent implements OnInit, OnDestroy {
  private seo    = inject(SeoService);
  private jsonLd = inject(JsonLdService);

  readonly resumeMock = ['Education', 'Projects', 'Skills', 'Internships'];

  readonly tips = [
    { icon: '🎓', bg: 'bg-violet-100 dark:bg-violet-900/30',   title: 'Education First',        desc: 'Lead with your degree, CGPA, and relevant coursework. For freshers, education is your biggest selling point.' },
    { icon: '💡', bg: 'bg-indigo-100 dark:bg-indigo-900/30',   title: 'Academic Projects',       desc: 'Showcase 2-3 strong projects with tech stack, your role, and the impact or result achieved.' },
    { icon: '🛠', bg: 'bg-blue-100 dark:bg-blue-900/30',       title: 'Technical Skills',        desc: 'List programming languages, tools, frameworks, and certifications. Be honest about your proficiency level.' },
    { icon: '🤝', bg: 'bg-emerald-100 dark:bg-emerald-900/30', title: 'Internships & Training',  desc: 'Include any internships, industrial training, or part-time work - even if they were short or unpaid.' },
    { icon: '🏆', bg: 'bg-amber-100 dark:bg-amber-900/30',     title: 'Achievements',            desc: 'Hackathons, competitions, scholarships, and certifications show initiative and stand out to recruiters.' },
    { icon: '📊', bg: 'bg-rose-100 dark:bg-rose-900/30',       title: 'Keep It One Page',        desc: 'Freshers should always have a one-page resume. Concise, well-formatted, and easy to read wins every time.' },
  ];

  readonly companies = ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Capgemini', 'HCL', 'Tech Mahindra', 'Cognizant', 'IBM', 'Deloitte'];

  readonly faqs = [
    { q: 'How do I write a resume with no work experience?', a: 'Focus on your education, academic projects, internships, certifications, and skills. Use action verbs to describe your projects and quantify results wherever possible. Our fresher template is specifically designed to present these sections in the most impactful way.' },
    { q: 'What should a fresher resume look like?', a: 'A fresher resume should be 1 page, clean, and ATS-friendly. Lead with a short objective statement, followed by education, technical skills, projects, and any internships. Avoid photos, graphics, and tables as these can confuse ATS systems.' },
    { q: 'Which resume template is best for freshers in India?', a: 'The "Fresher" template on ApnaConverter is specifically designed for Indian job seekers with no experience. It puts education and projects first, includes space for CGPA, and uses a clean format that passes all major ATS systems used by Indian MNCs.' },
    { q: 'Should freshers include a career objective?', a: 'Yes! A 2-3 line career objective tailored to the specific role is very effective for freshers. It tells recruiters your goal and shows you have direction. Our AI-powered suggestions can help you write one in seconds.' },
    { q: 'Is it free to create a fresher resume on ApnaConverter?', a: 'Yes, completely free! You can create, edit, and download your resume as a PDF without any charges. Free accounts include the Fresher template and 6 other designs with no watermark.' },
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Free Resume Builder for Freshers - No Experience? No Problem! | ApnaConverter',
      description: 'Create a professional fresher resume in minutes. ATS-friendly templates for students and fresh graduates. Highlight projects, skills, and education. Free PDF download.',
      keywords: 'fresher resume builder, resume for freshers, resume with no experience, student resume India, first job resume, college graduate resume',
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
