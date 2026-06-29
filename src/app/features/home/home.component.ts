import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  Type,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT, NgComponentOutlet, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../shared/components/ad-banner/ad-banner.component';
import { RESUME_TEMPLATES, getTemplateDefaultAccent } from '../resume-builder/data/resume-templates.data';
import { createSampleResume } from '../resume-builder/data/resume-defaults';
import { ResumeData } from '../resume-builder/models/resume.model';
import { computeDesignVarsCss } from '../resume-builder/components/preview/resume-preview.component';

// ── Carousel constants ────────────────────────────────────────────────────────
const CARD_W   = 264;
const CARD_GAP = 20;
const CARD_STEP = CARD_W + CARD_GAP; // 284px per scroll step

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
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly isBrowser  = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly renderer   = inject(Renderer2);
  private readonly document   = inject(DOCUMENT);
  private readonly router     = inject(Router);
  private faqSchemaScript?: HTMLScriptElement;

  // ── Template data cache ────────────────────────────────────────────────────
  private readonly _tplMap = new Map<string, { component: Type<unknown>; sample: ResumeData }>(
    (['ats-professional','minimal','fresher','compact','modern-professional','tech','elegant',
      'creative','bold','executive','photo-professional','photo-sidebar-modern','photo-teacher',
      'photo-government','photo-executive',
      'sidebar-right','dark-matter','centered-cv','timeline-left','header-split',
      'two-col-balanced','boxed-cv','circle-photo','minimal-serif','gradient-header',
      'skills-bar','navy-gold'] as const).map(id => {
      const meta = RESUME_TEMPLATES.find(m => m.id === id);
      return [id, { component: meta!.component, sample: createSampleResume(id) }];
    })
  );

  getTplComponent(id: string): Type<unknown> | null { return this._tplMap.get(id)?.component ?? null; }
  getTplSample(id: string): ResumeData | null       { return this._tplMap.get(id)?.sample ?? null; }

  getTplDesignVars(templateId: string): string {
    const meta = RESUME_TEMPLATES.find(m => m.id === templateId);
    const accentColor = meta ? getTemplateDefaultAccent(meta) : '#1e293b';
    return computeDesignVarsCss({ accentColor });
  }

  // ── Template list (expanded tags for category filter) ──────────────────────
  readonly resumeTemplates: ResumeTemplateCard[] = [
    { id: 'ats-professional',    slug: 'ats-professional-resume-template',     name: 'ATS Professional',    isPremium: true,  accentColor: '#475569', headerBg: '#1e293b', layout: 'single',        atsScore: 95, category: 'ATS Friendly',    tags: ['ats', 'professional'] },
    { id: 'minimal',             slug: 'minimal-resume-template',              name: 'Minimal',             isPremium: false, accentColor: '#64748b', headerBg: '#ffffff', layout: 'single-white',  atsScore: 93, category: 'Minimal',          tags: ['minimal', 'ats', 'professional'] },
    { id: 'fresher',             slug: 'fresher-entry-level-resume-template',  name: 'Fresher',             isPremium: false, accentColor: '#059669', headerBg: '#059669', layout: 'single',        atsScore: 90, category: 'Student / Fresher', tags: ['student', 'ats', 'professional'] },
    { id: 'compact',             slug: 'compact-resume-template',              name: 'Compact',             isPremium: false, accentColor: '#2563eb', headerBg: '#1d4ed8', layout: 'two-col',       atsScore: 91, category: 'Professional',      tags: ['professional', 'executive'] },
    { id: 'modern-professional', slug: 'modern-professional-resume-template',  name: 'Modern Professional', isPremium: true,  accentColor: '#2563eb', headerBg: '#1d4ed8', layout: 'single',        atsScore: 88, category: 'Professional',      tags: ['professional', 'modern'] },
    { id: 'tech',                slug: 'tech-developer-resume-template',       name: 'Tech Dark',           isPremium: true,  accentColor: '#10b981', headerBg: '#0f172a', layout: 'dark',          atsScore: 85, category: 'Engineering',       tags: ['engineering', 'modern'] },
    { id: 'elegant',             slug: 'elegant-resume-template',              name: 'Elegant',             isPremium: false, accentColor: '#f43f5e', headerBg: '#ffffff', layout: 'single-white',  atsScore: 84, category: 'Minimal',           tags: ['minimal', 'modern'] },
    { id: 'creative',            slug: 'creative-resume-template',             name: 'Creative',            isPremium: false, accentColor: '#7c3aed', headerBg: '#6d28d9', layout: 'single',        atsScore: 80, category: 'Creative',          tags: ['creative'] },
    { id: 'bold',                slug: 'bold-resume-template',                 name: 'Bold',                isPremium: false, accentColor: '#6d28d9', headerBg: '#5b21b6', layout: 'single',        atsScore: 82, category: 'Creative',          tags: ['creative'] },
    { id: 'executive',           slug: 'executive-resume-template',            name: 'Executive',           isPremium: false, accentColor: '#b45309', headerBg: '#1e293b', layout: 'two-col',       atsScore: 87, category: 'Executive',         tags: ['executive', 'professional'] },
    { id: 'photo-professional',  slug: 'photo-professional-resume-template',   name: 'Photo Professional',  isPremium: false, accentColor: '#2563eb', headerBg: '#1d4ed8', layout: 'photo-right',   atsScore: 88, category: 'Photo Resume',      tags: ['photo', 'professional'] },
    { id: 'photo-sidebar-modern',slug: 'photo-sidebar-modern-resume-template', name: 'Photo Sidebar',       isPremium: false, accentColor: '#0f4c81', headerBg: '#0f4c81', layout: 'photo-sidebar', atsScore: 82, category: 'Photo Resume',      tags: ['photo', 'executive'] },
    { id: 'photo-teacher',       slug: 'photo-teacher-resume-template',        name: 'Photo Teacher',       isPremium: false, accentColor: '#059669', headerBg: '#ffffff', layout: 'photo-center',  atsScore: 87, category: 'Photo Resume',      tags: ['photo', 'professional', 'student'] },
    { id: 'photo-government',    slug: 'photo-government-resume-template',     name: 'Photo Government',    isPremium: true,  accentColor: '#374151', headerBg: '#111827', layout: 'single',        atsScore: 95, category: 'Photo Resume',      tags: ['photo', 'professional'] },
    { id: 'photo-executive',     slug: 'photo-executive-resume-template',      name: 'Photo Executive',     isPremium: true,  accentColor: '#94a3b8', headerBg: '#0f172a', layout: 'photo-dark',    atsScore: 86, category: 'Photo Resume',      tags: ['photo', 'executive'] },
    // v3 new templates
    { id: 'sidebar-right',       slug: 'sidebar-right-resume-template',        name: 'Sidebar Right',       isPremium: false, accentColor: '#1e40af', headerBg: '#1e40af', layout: 'two-col',       atsScore: 85, category: 'Executive',         tags: ['executive', 'professional'] },
    { id: 'dark-matter',         slug: 'dark-matter-resume-template',          name: 'Dark Matter',         isPremium: true,  accentColor: '#10b981', headerBg: '#0f172a', layout: 'dark',          atsScore: 78, category: 'Engineering',       tags: ['engineering', 'creative', 'modern'] },
    { id: 'centered-cv',         slug: 'centered-cv-resume-template',          name: 'Centered CV',         isPremium: false, accentColor: '#334155', headerBg: '#ffffff', layout: 'single-white',  atsScore: 89, category: 'ATS Friendly',      tags: ['ats', 'minimal', 'professional'] },
    { id: 'timeline-left',       slug: 'timeline-left-resume-template',        name: 'Timeline Left',       isPremium: false, accentColor: '#1d4ed8', headerBg: '#1d4ed8', layout: 'single',        atsScore: 83, category: 'Professional',      tags: ['professional', 'modern'] },
    { id: 'header-split',        slug: 'header-split-resume-template',         name: 'Header Split',        isPremium: false, accentColor: '#0f766e', headerBg: '#0f766e', layout: 'single',        atsScore: 87, category: 'Professional',      tags: ['professional', 'modern'] },
    { id: 'two-col-balanced',    slug: 'two-col-balanced-resume-template',     name: 'Two-Col Balanced',    isPremium: false, accentColor: '#1e3a5f', headerBg: '#1e3a5f', layout: 'two-col',       atsScore: 84, category: 'Executive',         tags: ['executive', 'professional'] },
    { id: 'boxed-cv',            slug: 'boxed-cv-resume-template',             name: 'Boxed CV',            isPremium: false, accentColor: '#0f172a', headerBg: '#0f172a', layout: 'single',        atsScore: 88, category: 'Professional',      tags: ['professional', 'minimal', 'modern'] },
    { id: 'circle-photo',        slug: 'circle-photo-resume-template',         name: 'Circle Photo',        isPremium: false, accentColor: '#2563eb', headerBg: '#ffffff', layout: 'photo-center',  atsScore: 82, category: 'Photo Resume',      tags: ['photo', 'professional'] },
    { id: 'minimal-serif',       slug: 'minimal-serif-resume-template',        name: 'Minimal Serif',       isPremium: false, accentColor: '#1e293b', headerBg: '#ffffff', layout: 'single-white',  atsScore: 91, category: 'ATS Friendly',      tags: ['ats', 'minimal', 'professional'] },
    { id: 'gradient-header',     slug: 'gradient-header-resume-template',      name: 'Gradient Header',     isPremium: false, accentColor: '#7c3aed', headerBg: '#7c3aed', layout: 'single',        atsScore: 86, category: 'Creative',          tags: ['creative', 'modern'] },
    { id: 'skills-bar',          slug: 'skills-bar-resume-template',           name: 'Skills Bar',          isPremium: true,  accentColor: '#0f4c81', headerBg: '#0f4c81', layout: 'two-col',       atsScore: 81, category: 'Engineering',       tags: ['engineering', 'executive', 'professional'] },
    { id: 'navy-gold',           slug: 'navy-gold-resume-template',            name: 'Navy Gold',           isPremium: true,  accentColor: '#d97706', headerBg: '#0f172a', layout: 'two-col',       atsScore: 84, category: 'Executive',         tags: ['executive', 'professional'] },
  ];

  readonly categories = [
    { id: 'all',          label: 'All Templates' },
    { id: 'professional', label: 'Professional'  },
    { id: 'modern',       label: 'Modern'         },
    { id: 'executive',    label: 'Executive'      },
    { id: 'minimal',      label: 'Minimal'        },
    { id: 'ats',          label: 'ATS Friendly'   },
    { id: 'student',      label: 'Fresher'        },
    { id: 'creative',     label: 'Creative'       },
    { id: 'engineering',  label: 'Engineering'    },
    { id: 'photo',        label: 'Photo Resume'   },
  ];

  // ── Category state (signal so filteredTemplates can be computed) ───────────
  readonly activeCategory = signal('all');

  readonly filteredTemplates = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'all') return this.resumeTemplates;
    return this.resumeTemplates.filter(t => t.tags.includes(cat));
  });

  readonly loopedTemplates = computed(() => {
    const base = this.filteredTemplates();
    // Triple items for seamless infinite loop; only if enough items
    return base.length >= 3 ? [...base, ...base, ...base] : base;
  });

  setCategory(cat: string): void {
    this.activeCategory.set(cat);
    // Reset scroll after Angular re-renders the new item list
    this._removeScrollListener?.();
    this._removeScrollListener = undefined;
    Promise.resolve().then(() => this._initCarousel());
  }

  openTemplate(slug: string): void { this.router.navigate(['/resume-templates', slug]); }
  useTemplate(id: string):   void { this.router.navigate(['/resume-builder'], { queryParams: { template: id } }); }

  // ── Carousel engine ────────────────────────────────────────────────────────
  @ViewChild('carouselEl') carouselEl?: ElementRef<HTMLDivElement>;

  carouselPaused = false;
  dragActive     = false;

  private _autoScrollTimer?: ReturnType<typeof setInterval>;
  private _scrollCheckTimer?: ReturnType<typeof setTimeout>;
  private _removeScrollListener?: () => void;
  private _dragStartX      = 0;
  private _dragScrollLeft  = 0;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this._initCarousel();
  }

  private _initCarousel(): void {
    const el = this.carouselEl?.nativeElement;
    if (!el) return;

    const n = this.filteredTemplates().length;
    // Scroll to start of middle copy so prev/next both work immediately
    el.scrollLeft = n >= 3 ? n * CARD_STEP : 0;

    // Loop detection: after scrolling settles, silently jump back to middle copy
    const onScroll = () => {
      clearTimeout(this._scrollCheckTimer);
      this._scrollCheckTimer = setTimeout(() => this._checkLoop(), 280);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    this._removeScrollListener = () => el.removeEventListener('scroll', onScroll);

    this._startAutoScroll();
  }

  private _checkLoop(): void {
    const el = this.carouselEl?.nativeElement;
    if (!el) return;
    const n = this.filteredTemplates().length;
    if (n < 3) return;
    const setW = n * CARD_STEP;
    // Jump to equivalent position in middle copy — visually seamless
    if      (el.scrollLeft < setW * 0.5)  el.scrollLeft += setW;
    else if (el.scrollLeft > setW * 2.5)  el.scrollLeft -= setW;
  }

  private _startAutoScroll(): void {
    this._stopAutoScroll();
    this._autoScrollTimer = setInterval(() => {
      if (!this.carouselPaused) this.scrollCarouselNext();
    }, 4500);
  }

  private _stopAutoScroll(): void {
    if (this._autoScrollTimer) { clearInterval(this._autoScrollTimer); this._autoScrollTimer = undefined; }
  }

  scrollCarouselNext(): void { this.carouselEl?.nativeElement.scrollBy({ left:  CARD_STEP, behavior: 'smooth' }); }
  scrollCarouselPrev(): void { this.carouselEl?.nativeElement.scrollBy({ left: -CARD_STEP, behavior: 'smooth' }); }

  pauseCarousel():  void { this.carouselPaused = true;  }
  resumeCarousel(): void { this.carouselPaused = false; }

  // Mouse-drag (desktop)
  onDragStart(e: MouseEvent): void {
    const el = this.carouselEl?.nativeElement;
    if (!el) return;
    this.dragActive     = true;
    this._dragStartX    = e.clientX;
    this._dragScrollLeft = el.scrollLeft;
  }

  onDragMove(e: MouseEvent): void {
    if (!this.dragActive) return;
    const el = this.carouselEl?.nativeElement;
    if (!el) return;
    el.scrollLeft = this._dragScrollLeft + (this._dragStartX - e.clientX);
  }

  onDragEnd(): void { this.dragActive = false; }

  // ── Static section data ────────────────────────────────────────────────────
  readonly biodataTemplates: BiodataTemplateCard[] = [
    { name: 'Marriage Classic',  gradient: 'from-rose-500 to-pink-600',    accentHex: '#f43f5e', templateId: 'classic-marriage' },
    { name: 'Marriage Modern',   gradient: 'from-rose-400 to-red-500',     accentHex: '#ef4444', templateId: 'modern-card'       },
    { name: 'Traditional',       gradient: 'from-orange-500 to-amber-600', accentHex: '#f59e0b', templateId: 'classic-marriage' },
    { name: 'Simple & Clean',    gradient: 'from-slate-500 to-slate-700',  accentHex: '#475569', templateId: 'professional'      },
    { name: 'Professional',      gradient: 'from-indigo-500 to-blue-600',  accentHex: '#3b82f6', templateId: 'professional'      },
  ];

  readonly testimonials = [
    { quote: 'Got placed at Infosys after optimizing my resume with the ATS score. The templates are clean and professional!', name: 'Priya S.',   role: 'Software Engineer, Mumbai',   initials: 'PS', avatarBg: 'bg-primary-500'  },
    { quote: 'The marriage biodata templates are beautiful. My family loved the quality of the PDF. Highly recommended!',      name: 'Rahul M.',  role: 'Chartered Accountant, Delhi', initials: 'RM', avatarBg: 'bg-rose-500'    },
    { quote: 'Best resume builder for freshers. Completely free, no hidden charges. Got placed in TCS in my first attempt!',   name: 'Ananya K.', role: 'Fresher, Bangalore',          initials: 'AK', avatarBg: 'bg-emerald-600' },
  ];

  readonly products = [
    { icon: '📄', iconBg: 'bg-primary-100 dark:bg-primary-900/40',  title: 'Resume Builder',         desc: 'ATS-friendly resumes with live score feedback and 30+ templates',   route: '/resume-builder',              badge: null,   badgeClass: '' },
    { icon: '🎯', iconBg: 'bg-blue-100 dark:bg-blue-900/40',      title: 'ATS Checker',            desc: 'Score your resume against job descriptions in real time',            route: '/ats-resume-checker',          badge: 'Free', badgeClass: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' },
    { icon: '✉️', iconBg: 'bg-emerald-100 dark:bg-emerald-900/40', title: 'Cover Letter Builder',   desc: 'Tailored cover letters generated instantly from your resume',          route: '/resume-builder/cover-letter', badge: 'Pro',  badgeClass: 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300' },
    { icon: '💍', iconBg: 'bg-rose-100 dark:bg-rose-900/40',      title: 'Biodata Maker',          desc: 'Marriage & professional biodata with photo support, all free',        route: '/biodata-maker',               badge: 'Free', badgeClass: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' },
    { icon: '🌐', iconBg: 'bg-indigo-100 dark:bg-indigo-900/40',  title: 'Portfolio Builder',      desc: 'Shareable online portfolio with a unique live URL',                   route: '/resume-builder/portfolio',    badge: 'Pro',  badgeClass: 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300' },
    { icon: '🏛️', iconBg: 'bg-orange-100 dark:bg-orange-900/40',  title: 'Govt Resume Builder',    desc: 'Government job resumes with declaration section & passport photo',   route: '/government-resume-builder',   badge: 'New',  badgeClass: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' },
    { icon: '🎓', iconBg: 'bg-teal-100 dark:bg-teal-900/40',      title: 'Fresher Resume Builder', desc: 'First-job templates optimized for freshers and recent graduates',      route: '/fresher-resume-builder',      badge: 'Free', badgeClass: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' },
    { icon: '📚', iconBg: 'bg-amber-100 dark:bg-amber-900/40',    title: 'Template Library',       desc: '30+ professional templates, free and premium, ATS-optimized',          route: '/resume-templates',            badge: '30+',  badgeClass: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' },
  ];

  readonly productPills = ['📄 Resume', '🎯 ATS Score', '✉️ Cover Letter', '🌐 Portfolio', '💍 Biodata', '🏛️ Govt Resume', '🎓 Fresher'];

  readonly stats = [
    { value: '50,000+', label: 'Resumes Created'      },
    { value: '30+',     label: 'Resume Templates'     },
    { value: '40+',     label: 'File Converter Tools' },
    { value: '₹99/mo',  label: 'Pro Plan from'        },
  ];

  readonly howItWorks = [
    { step: '01', icon: '📋', title: 'Pick a Template',  desc: 'Choose from 30+ professional templates: ATS-friendly, photo-enabled, government, and more.' },
    { step: '02', icon: '✏️', title: 'Fill Your Details', desc: 'Enter your details with smart suggestions. Live preview shows every change instantly.'       },
    { step: '03', icon: '⬇️', title: 'Download & Apply',  desc: 'Export a perfect ATS-optimized PDF in one click. No watermark on free templates.'           },
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

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  ngOnInit(): void {
    if (this.isBrowser) this._injectFaqSchema();
  }

  ngOnDestroy(): void {
    if (this.faqSchemaScript) {
      this.renderer.removeChild(this.document.head, this.faqSchemaScript);
    }
    this._stopAutoScroll();
    clearTimeout(this._scrollCheckTimer);
    this._removeScrollListener?.();
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
}
