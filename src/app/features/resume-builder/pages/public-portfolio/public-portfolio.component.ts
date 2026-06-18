import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { SeoService } from '../../../../core/services/seo.service';
import { JsonLdService } from '../../../../core/services/json-ld.service';
import { Portfolio } from '../../services/career.service';
import { firstValueFrom } from 'rxjs';

const SITE_URL = 'https://www.apnaconverter.com';

@Component({
  selector: 'app-public-portfolio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (loading()) {
      <div class="min-h-screen flex items-center justify-center">
        <div class="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    } @else if (!portfolio()) {
      <div class="min-h-screen flex items-center justify-center p-6">
        <div class="text-center">
          <p class="text-6xl mb-4">👤</p>
          <h1 class="text-xl font-bold text-slate-800 dark:text-white mb-2">Portfolio Not Found</h1>
          <p class="text-slate-500 text-sm mb-6">This portfolio doesn't exist or has been made private.</p>
          <a routerLink="/" class="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold">Go Home</a>
        </div>
      </div>
    } @else {
      <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
        <!-- Top bar -->
        <div class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
          <a routerLink="/" class="text-xs font-bold text-violet-700 dark:text-violet-400">ApnaConverter</a>
          <a routerLink="/resume-builder" class="text-xs font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white">Build Your Resume →</a>
        </div>

        <div class="max-w-3xl mx-auto px-4 py-10 space-y-8">
          <!-- Hero -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
            <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold mb-4">
              {{ initials() }}
            </div>
            <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">{{ portfolio()!.displayName || portfolio()!.username }}</h1>
            @if (portfolio()!.tagline) {
              <p class="text-violet-600 dark:text-violet-400 font-medium mt-1">{{ portfolio()!.tagline }}</p>
            }
            @if (portfolio()!.location || portfolio()!.email) {
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {{ portfolio()!.location }}{{ portfolio()!.location && portfolio()!.email ? ' · ' : '' }}{{ portfolio()!.email }}
              </p>
            }
            <!-- Social links -->
            @if (hasSocial()) {
              <div class="flex items-center justify-center gap-3 mt-4 flex-wrap">
                @if (portfolio()!.social?.linkedin) {
                  <a [href]="portfolio()!.social!.linkedin" target="_blank" rel="noopener noreferrer"
                     class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:opacity-80 transition">💼 LinkedIn</a>
                }
                @if (portfolio()!.social?.github) {
                  <a [href]="portfolio()!.social!.github" target="_blank" rel="noopener noreferrer"
                     class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:opacity-80 transition">🐙 GitHub</a>
                }
                @if (portfolio()!.social?.twitter) {
                  <a [href]="portfolio()!.social!.twitter" target="_blank" rel="noopener noreferrer"
                     class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 hover:opacity-80 transition">🐦 Twitter</a>
                }
                @if (portfolio()!.social?.website) {
                  <a [href]="portfolio()!.social!.website" target="_blank" rel="noopener noreferrer"
                     class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:opacity-80 transition">🌐 Website</a>
                }
                @if (portfolio()!.social?.youtube) {
                  <a [href]="portfolio()!.social!.youtube" target="_blank" rel="noopener noreferrer"
                     class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:opacity-80 transition">▶️ YouTube</a>
                }
              </div>
            }
          </div>

          <!-- About -->
          @if (portfolio()!.about) {
            <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">About</h2>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ portfolio()!.about }}</p>
            </div>
          }

          <!-- Skills -->
          @if ((portfolio()!.skills ?? []).length > 0) {
            <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Skills</h2>
              <div class="flex flex-wrap gap-2">
                @for (skill of portfolio()!.skills; track skill.name) {
                  <span class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                    {{ skill.name }}
                    @if (skill.level && skill.level !== 'Intermediate') {
                      <span class="text-[10px] opacity-70">· {{ skill.level }}</span>
                    }
                  </span>
                }
              </div>
            </div>
          }

          <!-- Projects -->
          @if ((portfolio()!.projects ?? []).length > 0) {
            <div>
              <h2 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Projects</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                @for (proj of portfolio()!.projects; track proj.title) {
                  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-3 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md transition">
                    <div class="flex items-start justify-between gap-2">
                      <h3 class="font-bold text-slate-800 dark:text-white text-sm">{{ proj.title }}</h3>
                      @if (proj.featured) {
                        <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 shrink-0">⭐ Featured</span>
                      }
                    </div>
                    @if (proj.description) {
                      <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ proj.description }}</p>
                    }
                    <div class="flex items-center gap-2 mt-auto">
                      @if (proj.url) {
                        <a [href]="proj.url" target="_blank" rel="noopener noreferrer"
                           class="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline">Live →</a>
                      }
                      @if (proj.githubUrl) {
                        <a [href]="proj.githubUrl" target="_blank" rel="noopener noreferrer"
                           class="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200">GitHub →</a>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Footer CTA -->
          <div class="text-center py-4">
            <p class="text-sm text-slate-500 mb-3">Build your own portfolio with ApnaConverter</p>
            <a routerLink="/resume-builder" class="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold hover:opacity-90 transition shadow-lg">Get Started — Free</a>
          </div>
        </div>
      </div>
    }
  `,
})
export class PublicPortfolioComponent implements OnInit, OnDestroy {
  private route  = inject(ActivatedRoute);
  private api    = inject(ApiService);
  private seo    = inject(SeoService);
  private jsonLd = inject(JsonLdService);

  readonly loading   = signal(true);
  readonly portfolio = signal<Portfolio | null>(null);

  async ngOnInit(): Promise<void> {
    const username = this.route.snapshot.paramMap.get('username') ?? '';
    try {
      const res = await firstValueFrom(this.api.get<any>(`public/portfolio/${username}`));
      const p: Portfolio | null = res.data?.portfolio ?? null;
      this.portfolio.set(p);

      if (p) {
        const displayName = p.displayName || p.username;
        const pageUrl     = `${SITE_URL}/p/${p.username}`;
        const skillNames  = (p.skills ?? []).map((s: any) => s.name).join(', ');
        const description = p.about
          ? p.about.substring(0, 160)
          : `${displayName}'s professional portfolio. ${skillNames ? 'Skills: ' + skillNames.substring(0, 80) + '.' : ''}`;

        this.seo.setPage({
          title:       `${displayName} — Portfolio | ApnaConverter`,
          description: description,
          canonical:   pageUrl,
          ogType:      'profile',
        });

        const socialLinks = [
          p.social?.linkedin, p.social?.github,
          p.social?.twitter,  p.social?.website,
        ].filter(Boolean);

        this.jsonLd.setJsonLd('public-portfolio', {
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          name: `${displayName} — Portfolio`,
          url: pageUrl,
          mainEntity: {
            '@type': 'Person',
            name:         displayName,
            description:  p.about || undefined,
            email:        p.email || undefined,
            address:      p.location ? { '@type': 'PostalAddress', addressLocality: p.location } : undefined,
            sameAs:       socialLinks.length ? socialLinks : undefined,
            knowsAbout:   (p.skills ?? []).map((s: any) => s.name),
          },
        });

        if ((p.projects ?? []).length > 0) {
          this.jsonLd.setJsonLd('public-portfolio-projects', {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `${displayName}'s Projects`,
            itemListElement: (p.projects ?? []).map((proj: any, i: number) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: proj.title,
              description: proj.description || undefined,
              url: proj.url || proj.githubUrl || undefined,
            })),
          });
        }

        this.jsonLd.setJsonLd('public-portfolio-breadcrumb', {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',      item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Portfolios', item: `${SITE_URL}/resume-builder/portfolio` },
            { '@type': 'ListItem', position: 3, name: displayName,  item: pageUrl },
          ],
        });
      }
    } catch {
      this.portfolio.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  ngOnDestroy(): void {
    this.jsonLd.removeJsonLd('public-portfolio');
    this.jsonLd.removeJsonLd('public-portfolio-projects');
    this.jsonLd.removeJsonLd('public-portfolio-breadcrumb');
  }

  initials(): string {
    const name = this.portfolio()?.displayName || this.portfolio()?.username || 'U';
    return name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  }

  hasSocial(): boolean {
    const s = this.portfolio()?.social;
    return !!(s && Object.values(s).some(v => !!v));
  }
}
