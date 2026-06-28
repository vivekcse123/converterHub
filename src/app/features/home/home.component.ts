import { Component, OnDestroy, OnInit, PLATFORM_ID, Renderer2, Type, inject } from '@angular/core';
import { isPlatformBrowser, DOCUMENT, NgComponentOutlet, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../shared/components/ad-banner/ad-banner.component';
import { RESUME_TEMPLATES, getTemplateDefaultAccent } from '../resume-builder/data/resume-templates.data';
import { createSampleResume } from '../resume-builder/data/resume-defaults';
import { ResumeData } from '../resume-builder/models/resume.model';
import { computeDesignVarsCss } from '../resume-builder/components/preview/resume-preview.component';

interface ResumeTemplateCard {
  id: string;
  slug: string;
  name: string;
  isPremium: boolean;
  accentColor: string;
  headerBg: string;
  layout: 'single' | 'single-white' | 'two-col' | 'dark' | 'photo-right' | 'photo-sidebar' | 'photo-center' | 'photo-dark';
  atsScore: number;
  category: string;
  tags: string[];
}

interface BiodataTemplateCard {
  name: string;
  gradient: string;
  accentHex: string;
  templateId: 'classic-marriage' | 'professional' | 'modern-card';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet, RouterLink, AdBannerComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly isBrowser  = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly renderer   = inject(Renderer2);
  private readonly document   = inject(DOCUMENT);
  private readonly router     = inject(Router);
  private faqSchemaScript?: HTMLScriptElement;

  ngOnInit(): void {
    if (this.isBrowser) this._injectFaqSchema();
  }

  ngOnDestroy(): void {
    if (this.faqSchemaScript) {
      this.renderer.removeChild(this.document.head, this.faqSchemaScript);
    }
  }

  private _injectFaqSchema(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    };
    const script = this.renderer.createElement('script') as HTMLScriptElement;
    this.renderer.setAttribute(script, 'type', 'application/ld+json');
    this.renderer.setProperty(script, 'text', JSON.stringify(schema));
    this.renderer.appendChild(this.document.head, script);
    this.faqSchemaScript = script;
  }

  private readonly _tplMap = new Map<string, { component: Type<unknown>; sample: ResumeData }>(
    (['ats-professional','minimal','fresher','compact','modern-professional','tech','elegant',
      'creative','bold','executive','photo-professional','photo-sidebar-modern','photo-teacher',
      'photo-government','photo-executive'] as const).map(id => {
      const meta = RESUME_TEMPLATES.find(m => m.id === id);
      return [id, { component: meta!.component, sample: createSampleResume(id) }];
    })
  );

  getTplComponent(id: string): Type<unknown> | null { return this._tplMap.get(id)?.component ?? null; }
  getTplSample(id: string): ResumeData | null { return this._tplMap.get(id)?.sample ?? null; }
  /** CSS custom-property string derived from the template's own default accent colour (single source of truth). */
  getTplDesignVars(templateId: string): string {
    const meta = RESUME_TEMPLATES.find(m => m.id === templateId);
    const accentColor = meta ? getTemplateDefaultAccent(meta) : '#1e293b';
    return computeDesignVarsCss({ accentColor });
  }

  readonly resumeTemplates: ResumeTemplateCard[] = [
    { id: 'ats-professional',    slug: 'ats-professional-resume-template',        name: 'ATS Professional',    isPremium: true,  accentColor: '#475569', headerBg: '#1e293b', layout: 'single',       atsScore: 95, category: 'ATS-Safe',    tags: ['ats'] },
    { id: 'minimal',             slug: 'minimal-resume-template',                 name: 'Minimal',             isPremium: false, accentColor: '#64748b', headerBg: '#ffffff', layout: 'single-white',  atsScore: 93, category: 'ATS-Safe',    tags: ['ats'] },
    { id: 'fresher',             slug: 'fresher-entry-level-resume-template',     name: 'Fresher',             isPremium: false, accentColor: '#059669', headerBg: '#059669', layout: 'single',       atsScore: 90, category: 'Fresher',      tags: ['ats', 'fresher'] },
    { id: 'compact',             slug: 'compact-resume-template',                 name: 'Compact',             isPremium: false, accentColor: '#2563eb', headerBg: '#1d4ed8', layout: 'two-col',      atsScore: 91, category: 'Executive',    tags: ['ats', 'executive'] },
    { id: 'modern-professional', slug: 'modern-professional-resume-template',     name: 'Modern Professional', isPremium: true,  accentColor: '#2563eb', headerBg: '#1d4ed8', layout: 'single',       atsScore: 88, category: 'Modern',       tags: ['modern'] },
    { id: 'tech',                slug: 'tech-developer-resume-template',          name: 'Tech Dark',           isPremium: true,  accentColor: '#10b981', headerBg: '#0f172a', layout: 'dark',         atsScore: 85, category: 'Modern',       tags: ['modern'] },
    { id: 'elegant',             slug: 'elegant-resume-template',                 name: 'Elegant',             isPremium: false, accentColor: '#f43f5e', headerBg: '#ffffff', layout: 'single-white',  atsScore: 84, category: 'Modern',       tags: ['modern'] },
    { id: 'creative',            slug: 'creative-resume-template',                name: 'Creative',            isPremium: false, accentColor: '#7c3aed', headerBg: '#6d28d9', layout: 'single',       atsScore: 80, category: 'Creative',     tags: ['modern'] },
    { id: 'bold',                slug: 'bold-resume-template',                    name: 'Bold',                isPremium: false, accentColor: '#6d28d9', headerBg: '#5b21b6', layout: 'single',       atsScore: 82, category: 'Creative',     tags: ['modern'] },
    { id: 'executive',           slug: 'executive-resume-template',               name: 'Executive',           isPremium: false, accentColor: '#b45309', headerBg: '#1e293b', layout: 'two-col',      atsScore: 87, category: 'Executive',    tags: ['executive'] },
    { id: 'photo-professional',  slug: 'photo-professional-resume-template',      name: 'Photo Professional',  isPremium: false, accentColor: '#2563eb', headerBg: '#1d4ed8', layout: 'photo-right',  atsScore: 88, category: 'Photo Resume', tags: ['photo'] },
    { id: 'photo-sidebar-modern',slug: 'photo-sidebar-modern-resume-template',    name: 'Photo Sidebar',       isPremium: false, accentColor: '#0f4c81', headerBg: '#0f4c81', layout: 'photo-sidebar', atsScore: 82, category: 'Photo Resume', tags: ['photo', 'executive'] },
    { id: 'photo-teacher',       slug: 'photo-teacher-resume-template',           name: 'Photo Teacher',       isPremium: false, accentColor: '#059669', headerBg: '#ffffff', layout: 'photo-center', atsScore: 87, category: 'Photo Resume', tags: ['photo'] },
    { id: 'photo-government',    slug: 'photo-government-resume-template',        name: 'Photo Government',    isPremium: true,  accentColor: '#374151', headerBg: '#111827', layout: 'single',       atsScore: 95, category: 'Government',   tags: ['photo', 'govt'] },
    { id: 'photo-executive',     slug: 'photo-executive-resume-template',         name: 'Photo Executive',     isPremium: true,  accentColor: '#94a3b8', headerBg: '#0f172a', layout: 'photo-dark',   atsScore: 86, category: 'Executive',    tags: ['photo', 'executive'] },
  ];

  readonly categories = [
    { id: 'all',       label: 'All (15)' },
    { id: 'ats',       label: 'ATS-Safe'  },
    { id: 'photo',     label: 'Photo'     },
    { id: 'executive', label: 'Executive' },
    { id: 'fresher',   label: 'Fresher'   },
    { id: 'govt',      label: 'Government'},
    { id: 'modern',    label: 'Modern'    },
  ];

  activeCategory = 'all';

  get filteredTemplates(): ResumeTemplateCard[] {
    if (this.activeCategory === 'all') return this.resumeTemplates;
    return this.resumeTemplates.filter(t => t.tags.includes(this.activeCategory));
  }

  setCategory(cat: string): void { this.activeCategory = cat; }

  openTemplate(slug: string): void {
    this.router.navigate(['/resume-templates', slug]);
  }

  readonly biodataTemplates: BiodataTemplateCard[] = [
    { name: 'Marriage Classic',    gradient: 'from-rose-500 to-pink-600',    accentHex: '#f43f5e', templateId: 'classic-marriage' },
    { name: 'Marriage Modern',     gradient: 'from-rose-400 to-red-500',     accentHex: '#ef4444', templateId: 'modern-card'       },
    { name: 'Traditional',         gradient: 'from-orange-500 to-amber-600', accentHex: '#f59e0b', templateId: 'classic-marriage' },
    { name: 'Simple & Clean',      gradient: 'from-slate-500 to-slate-700',  accentHex: '#475569', templateId: 'professional'      },
    { name: 'Professional',        gradient: 'from-indigo-500 to-blue-600',  accentHex: '#3b82f6', templateId: 'professional'      },
  ];

  readonly testimonials = [
    { quote: 'Got placed at Infosys after optimizing my resume with the ATS score. The templates are clean and professional!', name: 'Priya S.', role: 'Software Engineer, Mumbai', initials: 'PS', avatarBg: 'bg-violet-500' },
    { quote: 'The marriage biodata templates are beautiful. My family loved the quality of the PDF. Highly recommended!', name: 'Rahul M.', role: 'Chartered Accountant, Delhi', initials: 'RM', avatarBg: 'bg-rose-500' },
    { quote: 'Best resume builder for freshers. Completely free, no hidden charges. Got placed in TCS in my first attempt!', name: 'Ananya K.', role: 'Fresher, Bangalore', initials: 'AK', avatarBg: 'bg-emerald-600' },
  ];

  readonly products = [
    { icon: '📄', iconBg: 'bg-violet-100 dark:bg-violet-900/40',  title: 'Resume Builder',         desc: 'ATS-friendly resumes with live score feedback and 30+ templates',   route: '/resume-builder',              badge: null,    badgeClass: '' },
    { icon: '🎯', iconBg: 'bg-blue-100 dark:bg-blue-900/40',      title: 'ATS Checker',            desc: 'Score your resume against job descriptions in real time',            route: '/ats-resume-checker',          badge: 'Free',  badgeClass: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' },
    { icon: '✉️', iconBg: 'bg-emerald-100 dark:bg-emerald-900/40', title: 'Cover Letter Builder',   desc: 'Tailored cover letters generated instantly from your resume',          route: '/resume-builder/cover-letter', badge: 'Pro',   badgeClass: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300' },
    { icon: '💍', iconBg: 'bg-rose-100 dark:bg-rose-900/40',      title: 'Biodata Maker',          desc: 'Marriage & professional biodata with photo support, all free',        route: '/biodata-maker',               badge: 'Free',  badgeClass: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' },
    { icon: '🌐', iconBg: 'bg-indigo-100 dark:bg-indigo-900/40',  title: 'Portfolio Builder',      desc: 'Shareable online portfolio with a unique live URL',                   route: '/resume-builder/portfolio',    badge: 'Pro',   badgeClass: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300' },
    { icon: '🏛️', iconBg: 'bg-orange-100 dark:bg-orange-900/40',  title: 'Govt Resume Builder',    desc: 'Government job resumes with declaration section & passport photo',   route: '/government-resume-builder',   badge: 'New',   badgeClass: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' },
    { icon: '🎓', iconBg: 'bg-teal-100 dark:bg-teal-900/40',      title: 'Fresher Resume Builder', desc: 'First-job templates optimized for freshers and recent graduates',      route: '/fresher-resume-builder',      badge: 'Free',  badgeClass: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' },
    { icon: '📚', iconBg: 'bg-amber-100 dark:bg-amber-900/40',    title: 'Template Library',       desc: '30+ professional templates, free and premium, ATS-optimized',          route: '/resume-templates',            badge: '30+',   badgeClass: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' },
  ];

  readonly productPills = ['📄 Resume', '🎯 ATS Score', '✉️ Cover Letter', '🌐 Portfolio', '💍 Biodata', '🏛️ Govt Resume', '🎓 Fresher'];

  readonly stats = [
    { value: '50,000+', label: 'Resumes Created'     },
    { value: '30+',     label: 'Resume Templates'    },
    { value: '40+',     label: 'File Converter Tools' },
    { value: '₹99/mo',  label: 'Pro Plan from'       },
  ];

  readonly howItWorks = [
    { step: '01', icon: '📋', title: 'Pick a Template', desc: 'Choose from 30+ professional templates: ATS-friendly, photo-enabled, government, and more.' },
    { step: '02', icon: '✏️', title: 'Fill Your Details', desc: 'Enter your details with smart suggestions. Live preview shows every change instantly.' },
    { step: '03', icon: '⬇️', title: 'Download & Apply', desc: 'Export a perfect ATS-optimized PDF in one click. No watermark on free templates.' },
  ];

  readonly faqs = [
    { q: 'Is ApnaConverter completely free?', a: 'Yes! Core features including Resume Builder, ATS Checker, Biodata Maker, and 13 free resume templates are 100% free. No credit card required. Premium plans start at ₹99/month for advanced features like the Cover Letter Builder, Portfolio, and 12 premium templates.' },
    { q: 'Will my resume pass ATS (Applicant Tracking Systems)?', a: 'Absolutely. All templates are tested against modern ATS systems used by Naukri, LinkedIn, and top Indian companies. Each template shows an ATS score so you know exactly how well your resume will perform before you download.' },
    { q: 'What is the difference between free and premium templates?', a: 'Free templates cover all standard resume formats with clean, professional designs. Premium templates include executive layouts, photo-enabled designs, government resume formats with declaration sections, and specialized templates for specific industries.' },
    { q: 'Can I create a government job resume on ApnaConverter?', a: 'Yes! Our Government Resume Builder includes a dedicated template with passport photo upload, declaration section, formal layout, and print-ready A4 format, covering everything required for Indian government job applications.' },
    { q: 'How do I create a resume with no work experience?', a: "Use our Fresher Resume Builder, optimized for students and fresh graduates. It emphasizes education, projects, skills, and achievements over work experience, helping you create a compelling resume even with zero job history." },
    { q: 'Can I create a marriage biodata on ApnaConverter?', a: 'Yes! Our Biodata Maker offers multiple marriage biodata templates with family details, horoscope sections, and photo support. All biodata templates are completely free to download.' },
  ];

  openFaqIdx: number | null = null;
  toggleFaq(idx: number): void { this.openFaqIdx = this.openFaqIdx === idx ? null : idx; }
}
