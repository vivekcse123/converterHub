import { Injectable, inject } from '@angular/core';
import { SeoService } from './seo.service';
import { JsonLdService } from './json-ld.service';
import { TOOLS } from '../models/tool.model';
import { TOOL_CONTENT } from '../../shared/data/tool-content.data';

const SITE_URL = 'https://www.apnaconverter.com';

/**
 * One-call SEO setup for every converter tool page.
 * Injects SoftwareApplication + FAQPage + HowTo + BreadcrumbList.
 * Call setup() in ngOnInit, cleanup() in ngOnDestroy.
 */
@Injectable({ providedIn: 'root' })
export class ToolSeoService {
  private seo    = inject(SeoService);
  private jsonLd = inject(JsonLdService);

  setup(toolId: string): void {
    const tool    = TOOLS.find(t => t.id === toolId);
    const content = TOOL_CONTENT[toolId];
    if (!tool) return;

    const pageUrl = `${SITE_URL}${tool.route}`;

    // ── Meta tags ────────────────────────────────────────────────────────────
    this.seo.setPage({
      title:       `${tool.title} | ApnaConverter`,
      description: tool.description,
      canonical:   pageUrl,
    });

    // ── SoftwareApplication ──────────────────────────────────────────────────
    this.jsonLd.setJsonLd(`${toolId}-app`, {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.title,
      description: tool.description,
      url: pageUrl,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Requires a modern web browser with JavaScript enabled',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      publisher: {
        '@type': 'Organization',
        name: 'ApnaConverter',
        url: SITE_URL,
        logo: `${SITE_URL}/assets/web-app-manifest-192x192.png`,
      },
    });

    if (!content) return;

    // ── HowTo ────────────────────────────────────────────────────────────────
    if (content.steps?.length) {
      this.jsonLd.setJsonLd(`${toolId}-howto`, {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `How to use ${tool.title} - Step-by-step guide`,
        description: `Learn how to ${tool.description.toLowerCase()}`,
        tool: [{
          '@type': 'HowToTool',
          name: 'ApnaConverter',
        }],
        step: content.steps.map((s, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: s.title,
          text: s.desc,
          image: `${SITE_URL}/assets/web-app-manifest-192x192.png`,
        })),
      });
    }

    // ── FAQPage ───────────────────────────────────────────────────────────────
    if (content.faqs?.length) {
      this.jsonLd.setJsonLd(`${toolId}-faq`, {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: content.faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      });
    }

    // ── BreadcrumbList ────────────────────────────────────────────────────────
    const categoryLabel = this.categoryLabel(tool.category);
    this.jsonLd.setJsonLd(`${toolId}-breadcrumb`, {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',           item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: categoryLabel,    item: `${SITE_URL}/#${tool.category}` },
        { '@type': 'ListItem', position: 3, name: tool.title,       item: pageUrl },
      ],
    });
  }

  cleanup(toolId: string): void {
    this.jsonLd.removeJsonLd(`${toolId}-app`);
    this.jsonLd.removeJsonLd(`${toolId}-howto`);
    this.jsonLd.removeJsonLd(`${toolId}-faq`);
    this.jsonLd.removeJsonLd(`${toolId}-breadcrumb`);
  }

  private categoryLabel(cat: string): string {
    const map: Record<string, string> = {
      pdf:      'PDF Tools',
      image:    'Image Tools',
      document: 'Document Tools',
      archive:  'Archive Tools',
      resume:   'Resume Tools',
      biodata:  'Biodata Tools',
    };
    return map[cat] ?? 'Tools';
  }
}
