import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JsonLdService } from '../../../../core/services/json-ld.service';
import { SeoService } from '../../../../core/services/seo.service';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { ResumePreviewComponent } from '../../components/preview/resume-preview.component';
import { TemplatePreviewModalComponent } from '../../components/template-preview-modal/template-preview-modal.component';
import { UpgradeModalComponent } from '../../components/upgrade-modal/upgrade-modal.component';
import { ResumeAuthPromptComponent } from '../../components/auth-prompt/resume-auth-prompt.component';
import {
  RESUME_TEMPLATES,
  ResumeTemplateMeta,
  getTemplateBySlug,
} from '../../data/resume-templates.data';
import {
  createPersonaSample,
  SAMPLE_PERSONAS,
  SamplePersona,
} from '../../data/resume-defaults';
import { ResumeData } from '../../models/resume.model';
import { ResumeAuthGateService } from '../../services/resume-auth-gate.service';

const SITE_URL = 'https://www.apnaconverter.com';

@Component({
  selector: 'app-template-detail',
  standalone: true,
  // Override the global `router-outlet + * { animate-fade-in }` rule.
  // That animation runs opacity 0→1, which while active creates a stacking
  // context that traps child z-indices below the sticky site header.
  // Without the animation the component's host has no stacking context,
  // so the fixed-position full-screen modal correctly sits above the header.
  host: { style: 'animation: none' },
  imports: [CommonModule, RouterLink, BreadcrumbComponent, ResumePreviewComponent, TemplatePreviewModalComponent, UpgradeModalComponent, ResumeAuthPromptComponent],
  templateUrl: './template-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDetailComponent implements OnInit, OnDestroy {
  private readonly route      = inject(ActivatedRoute);
  private readonly router     = inject(Router);
  private readonly jsonLd     = inject(JsonLdService);
  private readonly seo        = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId  = inject(PLATFORM_ID);
  readonly authGate           = inject(ResumeAuthGateService);

  readonly template      = signal<ResumeTemplateMeta | null>(null);
  readonly activePersona = signal<SamplePersona>('software-engineer');
  readonly fullPreviewOpen = signal(false);

  readonly personas = SAMPLE_PERSONAS;
  /** Full catalog — passed to the shared preview modal so next/prev cycles every template. */
  readonly allTemplates = RESUME_TEMPLATES;

  readonly sampleResume = computed<ResumeData | null>(() => {
    const t = this.template();
    if (!t) return null;
    return createPersonaSample(this.activePersona(), t.id);
  });

  readonly relatedTemplates = computed(() => {
    const t = this.template();
    if (!t) return [];
    return RESUME_TEMPLATES
      .filter(r => r.id !== t.id && (r.category === t.category || r.industries.some(i => t.industries.includes(i))))
      .slice(0, 3);
  });

  readonly breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const t = this.template();
    return [
      { label: 'Home', path: '/' },
      { label: 'Resume Templates', path: '/resume-templates' },
      { label: t?.name ?? 'Template', path: '' },
    ];
  });

  // Body-scroll locking while the modal is open is handled by
  // TemplatePreviewModalComponent itself (see its ngOnInit/ngOnDestroy).
  openFullPreview(): void {
    this.fullPreviewOpen.set(true);
  }

  closeFullPreview(): void {
    this.fullPreviewOpen.set(false);
  }

  useTemplate(): void {
    const t = this.template();
    if (!t) return;

    this.router.navigate(['/resume-builder'], { queryParams: { template: t.id } });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.fullPreviewOpen()) this.closeFullPreview();
  }

  atsBarWidth(score: number): string {
    return `${score}%`;
  }

  formatDownloads(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const meta = getTemplateBySlug(slug);

    if (!meta) {
      this.router.navigate(['/resume-templates']);
      return;
    }

    this.template.set(meta);

    // Per-template <title>/meta description — previously every template detail
    // page shared the one generic route-level string in app.routes.ts, even
    // though the JSON-LD below was already dynamic per template.
    this.seo.setPage({
      title: `${meta.name} Resume Template - Free & ATS-Optimized (${meta.atsScore}/100) | ApnaConverter`,
      description: `${meta.description} ATS score ${meta.atsScore}/100. ${meta.isPremium ? 'Premium' : 'Free'} ${meta.category} template, preview and use it instantly.`,
      keywords: `${meta.name} resume template, ${meta.category} resume template, ${meta.industries.join(', ')}`,
    });

    this.jsonLd.setJsonLd('template-detail-product', {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${meta.name} Resume Template`,
      description: meta.description,
      url: `${SITE_URL}/resume-templates/${meta.slug}`,
      offers: {
        '@type': 'Offer',
        price: meta.isPremium ? '29' : '0',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: meta.rating,
        ratingCount: Math.floor(meta.downloads * 0.15),
        bestRating: '5',
      },
    });

    this.jsonLd.setJsonLd('template-detail-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Resume Templates', item: `${SITE_URL}/resume-templates` },
        { '@type': 'ListItem', position: 3, name: meta.name, item: `${SITE_URL}/resume-templates/${meta.slug}` },
      ],
    });

    this.destroyRef.onDestroy(() => {
      this.jsonLd.removeJsonLd('template-detail-product');
      this.jsonLd.removeJsonLd('template-detail-breadcrumb');
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }
}
