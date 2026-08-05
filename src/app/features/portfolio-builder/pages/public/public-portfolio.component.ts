import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { SeoService } from '../../../../core/services/seo.service';
import { JsonLdService } from '../../../../core/services/json-ld.service';
import { PortfolioData, getDisplayName, mapServerPortfolio } from '../../models/portfolio.model';
import { getPortfolioThemeMeta } from '../../data/portfolio-themes.data';

const SITE_URL = 'https://www.apnaconverter.com';

@Component({
  selector: 'app-public-portfolio',
  standalone: true,
  imports: [NgComponentOutlet, RouterLink],
  template: `
    @if (loading()) {
      <div class="min-h-screen bg-slate-950 flex items-center justify-center">
        <div class="flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-slate-400 text-sm">Loading portfolio…</p>
        </div>
      </div>
    } @else if (!portfolio()) {
      <div class="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div class="text-center">
          <div class="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="text-slate-500"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">Portfolio Not Found</h1>
          <p class="text-slate-400 text-sm mb-8">This portfolio doesn't exist or has been made private.</p>
          <a routerLink="/" class="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-sm font-bold hover:opacity-90 transition">Go Home</a>
        </div>
      </div>
    } @else {
      <ng-container *ngComponentOutlet="templateComponent(); inputs: { portfolio: portfolio(), editable: false }" />

      <footer class="py-6 px-4 text-center" [class]="portfolio()!.theme.mode === 'light' ? 'bg-white' : 'bg-slate-950'">
        <p class="text-xs opacity-50">
          Built with
          <a routerLink="/" class="text-primary-400 hover:text-primary-300 font-semibold transition">ApnaConverter</a>
        </p>
        <a routerLink="/portfolio"
           class="mt-3 inline-block text-xs font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white hover:opacity-90 transition">
          Create Your Portfolio - Free
        </a>
      </footer>
    }
  `,
})
export class PublicPortfolioComponent implements OnInit, OnDestroy {
  private route  = inject(ActivatedRoute);
  private api    = inject(ApiService);
  private seo    = inject(SeoService);
  private jsonLd = inject(JsonLdService);

  readonly loading   = signal(true);
  readonly portfolio = signal<PortfolioData | null>(null);
  readonly templateComponent = computed(() => getPortfolioThemeMeta(this.portfolio()?.theme.templateId ?? 'aurora').component);

  async ngOnInit(): Promise<void> {
    const username = this.route.snapshot.paramMap.get('username') ?? '';
    try {
      const res = await firstValueFrom(this.api.get<any>(`public/portfolio/${username}`));
      const doc = res.data?.portfolio;
      const p: PortfolioData | null = doc ? mapServerPortfolio(doc, 'published') : null;
      this.portfolio.set(p);
      if (p) this.applySeo(p);
    } catch {
      this.portfolio.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  private applySeo(p: PortfolioData): void {
    const displayName = getDisplayName(p);
    const pageUrl      = `${SITE_URL}/p/${p.username}`;
    const about        = p.sections.find(s => s.type === 'about')?.config as { body?: string } | undefined;
    const skillsSec     = p.sections.find(s => s.type === 'skills')?.config as { groups?: { items: { name: string }[] }[] } | undefined;
    const projectsSec   = p.sections.find(s => s.type === 'projects')?.config as { items?: { title: string; description?: string; url?: string; githubUrl?: string }[] } | undefined;
    const skillNames    = (skillsSec?.groups ?? []).flatMap(g => g.items.map(i => i.name)).join(', ');
    const description   = p.metaDescription || (about?.body
      ? about.body.substring(0, 160)
      : `${displayName}'s professional portfolio.${skillNames ? ' Skills: ' + skillNames.substring(0, 80) + '.' : ''}`);

    this.seo.setPage({
      title: p.metaTitle || `${displayName} - Portfolio | ApnaConverter`,
      description, canonical: pageUrl, ogType: 'profile',
      ogImage: p.photoUrl, ogImageAlt: displayName,
    });

    const socialLinks = [p.social?.linkedin, p.social?.github, p.social?.twitter, p.social?.website].filter(Boolean);

    this.jsonLd.setJsonLd('public-portfolio', {
      '@context': 'https://schema.org', '@type': 'ProfilePage', name: `${displayName} - Portfolio`, url: pageUrl,
      mainEntity: {
        '@type': 'Person', name: displayName,
        description: about?.body || undefined, email: p.email || undefined,
        address: p.location ? { '@type': 'PostalAddress', addressLocality: p.location } : undefined,
        sameAs: socialLinks.length ? socialLinks : undefined,
        knowsAbout: (skillsSec?.groups ?? []).flatMap(g => g.items.map(i => i.name)),
      },
    });

    if ((projectsSec?.items ?? []).length) {
      this.jsonLd.setJsonLd('public-portfolio-projects', {
        '@context': 'https://schema.org', '@type': 'ItemList', name: `${displayName}'s Projects`,
        itemListElement: (projectsSec!.items ?? []).map((proj, i) => ({
          '@type': 'ListItem', position: i + 1, name: proj.title, description: proj.description || undefined,
          url: proj.url || proj.githubUrl || undefined,
        })),
      });
    }

    this.jsonLd.setJsonLd('public-portfolio-breadcrumb', {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Portfolio Builder', item: `${SITE_URL}/portfolio` },
        { '@type': 'ListItem', position: 3, name: displayName, item: pageUrl },
      ],
    });
  }

  ngOnDestroy(): void {
    this.jsonLd.removeJsonLd('public-portfolio');
    this.jsonLd.removeJsonLd('public-portfolio-projects');
    this.jsonLd.removeJsonLd('public-portfolio-breadcrumb');
  }
}
