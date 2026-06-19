import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { JsonLdService } from '../../core/services/json-ld.service';

@Component({
  selector: 'app-marriage-biodata-maker',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-rose-600 via-pink-600 to-red-700 text-white py-20">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none"></div>
      <div class="container-app relative text-center max-w-3xl mx-auto">
        <span class="inline-flex items-center gap-2 mb-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm font-medium">
          💍 Trusted by families across India
        </span>
        <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
          Free Marriage Biodata Maker<br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300">Beautiful PDF in Minutes</span>
        </h1>
        <p class="text-lg text-rose-100 max-w-2xl mx-auto mb-8 leading-relaxed">
          Create a beautiful, professional marriage biodata for yourself or your family. Multiple templates, easy customization, instant PDF download — all completely free.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <a routerLink="/biodata-maker"
             class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-rose-700 font-bold hover:bg-rose-50 shadow-xl transition text-base">
            💍 Create Marriage Biodata — Free
          </a>
          <a routerLink="/biodata-maker"
             class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition text-base">
            👀 View Templates
          </a>
        </div>
        <div class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-rose-100">
          <span class="flex items-center gap-1.5"><span class="text-yellow-300">✓</span> 100% Free</span>
          <span class="flex items-center gap-1.5"><span class="text-yellow-300">✓</span> PDF in seconds</span>
          <span class="flex items-center gap-1.5"><span class="text-yellow-300">✓</span> Photo support</span>
          <span class="flex items-center gap-1.5"><span class="text-yellow-300">✓</span> No watermark</span>
        </div>
      </div>
    </section>

    <!-- Templates preview -->
    <section class="container-app py-16">
      <div class="text-center mb-10">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Beautiful Marriage Biodata Templates</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm">Traditional, modern, and classic designs for every family's taste</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        @for (t of templates; track $index) {
          <div class="group rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-rose-400 transition-all cursor-pointer bg-white dark:bg-slate-800 hover:shadow-md">
            <div class="h-28 flex flex-col items-center justify-center gap-2" [class]="t.gradient">
              <div class="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-xl">👤</div>
              <div class="h-1.5 bg-white/50 rounded w-16"></div>
            </div>
            <div class="p-3 text-center">
              <p class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ t.name }}</p>
              <span class="text-[9px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded mt-1 inline-block">FREE</span>
            </div>
          </div>
        }
      </div>
      <div class="text-center">
        <a routerLink="/biodata-maker" class="btn btn-primary px-7 py-3 text-sm">Create Your Biodata Now →</a>
      </div>
    </section>

    <!-- What to include -->
    <section class="bg-rose-50 dark:bg-rose-950/20 py-16">
      <div class="container-app max-w-4xl mx-auto">
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">What to Include in Marriage Biodata</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm">A complete guide to making your biodata impressive and informative</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          @for (section of sections; track $index) {
            <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-rose-100 dark:border-slate-800 hover:border-rose-300 transition">
              <div class="flex items-start gap-3">
                <span class="text-2xl shrink-0">{{ section.icon }}</span>
                <div>
                  <h3 class="font-bold text-slate-800 dark:text-white text-sm mb-1">{{ section.title }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ section.desc }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="container-app py-16 max-w-3xl mx-auto">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-10">Marriage Biodata FAQs</h2>
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
    <section class="bg-gradient-to-r from-rose-600 to-pink-600 py-16 text-white text-center">
      <div class="container-app max-w-2xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-extrabold mb-4">Create Your Marriage Biodata Today</h2>
        <p class="text-rose-100 mb-8">Beautiful, professional, and ready to share in minutes. Free PDF download — no registration needed.</p>
        <a routerLink="/biodata-maker"
           class="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-rose-700 font-bold hover:bg-rose-50 shadow-xl transition text-base">
          💍 Create Marriage Biodata — Free
        </a>
      </div>
    </section>
  `,
})
export class MarriageBiodataMakerComponent implements OnInit, OnDestroy {
  private seo    = inject(SeoService);
  private jsonLd = inject(JsonLdService);

  readonly templates = [
    { name: 'Classic Rose',      gradient: 'bg-gradient-to-br from-rose-400 to-pink-600' },
    { name: 'Traditional',       gradient: 'bg-gradient-to-br from-orange-400 to-amber-600' },
    { name: 'Modern Minimal',    gradient: 'bg-gradient-to-br from-slate-500 to-slate-700' },
    { name: 'Royal Blue',        gradient: 'bg-gradient-to-br from-blue-500 to-indigo-700' },
    { name: 'Elegant Gold',      gradient: 'bg-gradient-to-br from-yellow-500 to-amber-700' },
  ];

  readonly sections = [
    { icon: '👤', title: 'Personal Information',    desc: 'Full name, date of birth, time of birth, place of birth, height, weight, complexion, and blood group.' },
    { icon: '📚', title: 'Educational Background',  desc: 'Highest qualification, institution name, year of passing, and any additional certifications or diplomas.' },
    { icon: '💼', title: 'Professional Details',    desc: 'Current occupation, employer name, annual income, and nature of work.' },
    { icon: '🏠', title: 'Family Background',       desc: 'Father\'s and mother\'s name and occupation, siblings, family type (joint/nuclear), and native place.' },
    { icon: '🙏', title: 'Religious & Social',      desc: 'Religion, caste, sub-caste, gotra, and any other community-specific details that are relevant.' },
    { icon: '📞', title: 'Contact Information',     desc: 'Phone number, email address, and residential address for family to reach out directly.' },
  ];

  readonly faqs = [
    { q: 'What is a marriage biodata?', a: 'A marriage biodata (also called shaadi biodata or vivah biodata) is a document used in Indian arranged marriages. It provides personal, educational, professional, and family details about the prospective bride or groom to help families make informed decisions.' },
    { q: 'Is the marriage biodata maker completely free?', a: 'Yes! Our marriage biodata maker is 100% free. You can create, customize, and download your biodata as a high-quality PDF without any charges or watermarks.' },
    { q: 'Can I add a photo to my marriage biodata?', a: 'Absolutely! Our biodata maker supports photo upload. You can add your photo and it will be included in the PDF beautifully alongside your personal details.' },
    { q: 'How long does it take to create a marriage biodata?', a: 'Most people complete their biodata in 5-10 minutes. Simply fill in the required fields, choose a template you like, and download the PDF instantly.' },
    { q: 'Can I share my biodata digitally?', a: 'Yes! The PDF is optimized for both digital sharing (WhatsApp, email) and printing. You can share it directly from your device or print it out for distribution.' },
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Free Marriage Biodata Maker — Beautiful PDF in Minutes | ApnaConverter',
      description: 'Create a beautiful marriage biodata in minutes. Multiple templates, photo support, instant PDF download. Used by 5,000+ families. 100% free — no watermark.',
      keywords: 'marriage biodata maker, shaadi biodata, vivah biodata, marriage biodata format, free biodata maker India, biodata PDF download',
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
