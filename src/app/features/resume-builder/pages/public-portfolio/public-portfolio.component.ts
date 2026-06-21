import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { SeoService } from '../../../../core/services/seo.service';
import { JsonLdService } from '../../../../core/services/json-ld.service';
import { Portfolio } from '../../services/career.service';
import { firstValueFrom } from 'rxjs';

const SITE_URL = 'https://www.apnaconverter.com';

const LEVEL_STYLE: Record<string, string> = {
  expert:       'bg-violet-600 text-white',
  advanced:     'bg-indigo-500 text-white',
  intermediate: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  beginner:     'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
};

const PROJECT_GRADIENTS = [
  'from-violet-500 to-indigo-600',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-slate-600 to-slate-800',
];

@Component({
  selector: 'app-public-portfolio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (loading()) {
      <div class="min-h-screen bg-slate-950 flex items-center justify-center">
        <div class="flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-slate-400 text-sm">Loading portfolio…</p>
        </div>
      </div>
    } @else if (!portfolio()) {
      <div class="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div class="text-center">
          <p class="text-7xl mb-6">👤</p>
          <h1 class="text-2xl font-bold text-white mb-2">Portfolio Not Found</h1>
          <p class="text-slate-400 text-sm mb-8">This portfolio doesn't exist or has been made private.</p>
          <a routerLink="/" class="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold hover:opacity-90 transition">Go Home</a>
        </div>
      </div>
    } @else {

      <!-- ── Sticky nav ─────────────────────────────────────────── -->
      <nav class="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span class="font-bold text-white text-sm tracking-tight">{{ portfolio()!.displayName || portfolio()!.username }}</span>
          <div class="flex items-center gap-2">
            @if (portfolio()!.social?.github) {
              <a [href]="portfolio()!.social!.github" target="_blank" rel="noopener noreferrer"
                 class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition text-sm">🐙</a>
            }
            @if (portfolio()!.social?.linkedin) {
              <a [href]="portfolio()!.social!.linkedin" target="_blank" rel="noopener noreferrer"
                 class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition text-sm">💼</a>
            }
            @if (portfolio()!.social?.twitter) {
              <a [href]="portfolio()!.social!.twitter" target="_blank" rel="noopener noreferrer"
                 class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition text-sm">🐦</a>
            }
            @if (portfolio()!.social?.website) {
              <a [href]="portfolio()!.social!.website" target="_blank" rel="noopener noreferrer"
                 class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition text-sm">🌐</a>
            }
            <a routerLink="/resume-builder"
               class="ml-2 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition">
              Build Yours →
            </a>
          </div>
        </div>
      </nav>

      <!-- ── Hero ──────────────────────────────────────────────── -->
      <section class="bg-slate-950 pt-16 pb-20 px-4 sm:px-6 relative overflow-hidden">
        <!-- Background glow -->
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/20 rounded-full blur-[100px]"></div>
        </div>
        <div class="max-w-5xl mx-auto relative">
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-7">
            <!-- Avatar -->
            <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-extrabold shrink-0 shadow-2xl shadow-violet-500/30">
              {{ initials() }}
            </div>
            <!-- Info -->
            <div class="flex-1 text-center sm:text-left">
              <h1 class="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {{ portfolio()!.displayName || portfolio()!.username }}
              </h1>
              @if (portfolio()!.tagline) {
                <p class="text-violet-400 font-medium text-lg mt-1">{{ portfolio()!.tagline }}</p>
              }
              @if (portfolio()!.location || portfolio()!.email || portfolio()!.phone) {
                <p class="text-slate-400 text-sm mt-2 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                  @if (portfolio()!.location) { <span>📍 {{ portfolio()!.location }}</span> }
                  @if (portfolio()!.email) { <a [href]="'mailto:' + portfolio()!.email" class="hover:text-violet-400 transition">✉️ {{ portfolio()!.email }}</a> }
                  @if (portfolio()!.phone) { <a [href]="'tel:' + portfolio()!.phone" class="hover:text-violet-400 transition">📱 {{ portfolio()!.phone }}</a> }
                </p>
              }
              <!-- Social pills -->
              @if (hasSocial()) {
                <div class="flex items-center justify-center sm:justify-start gap-2 mt-5 flex-wrap">
                  @if (portfolio()!.social?.linkedin) {
                    <a [href]="portfolio()!.social!.linkedin" target="_blank" rel="noopener noreferrer"
                       class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition">
                      💼 LinkedIn
                    </a>
                  }
                  @if (portfolio()!.social?.github) {
                    <a [href]="portfolio()!.social!.github" target="_blank" rel="noopener noreferrer"
                       class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition">
                      🐙 GitHub
                    </a>
                  }
                  @if (portfolio()!.social?.twitter) {
                    <a [href]="portfolio()!.social!.twitter" target="_blank" rel="noopener noreferrer"
                       class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition">
                      🐦 Twitter
                    </a>
                  }
                  @if (portfolio()!.social?.website) {
                    <a [href]="portfolio()!.social!.website" target="_blank" rel="noopener noreferrer"
                       class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition">
                      🌐 Website
                    </a>
                  }
                  @if (portfolio()!.social?.youtube) {
                    <a [href]="portfolio()!.social!.youtube" target="_blank" rel="noopener noreferrer"
                       class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition">
                      ▶️ YouTube
                    </a>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- ── Main content ───────────────────────────────────────── -->
      <main class="bg-slate-50 dark:bg-slate-900">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 py-14 space-y-14">

          <!-- About -->
          @if (portfolio()!.about) {
            <section>
              <h2 class="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-4">About</h2>
              <p class="text-slate-700 dark:text-slate-200 text-base leading-relaxed max-w-3xl">{{ portfolio()!.about }}</p>
            </section>
          }

          <!-- Skills -->
          @if ((portfolio()!.skills ?? []).length > 0) {
            <section>
              <h2 class="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-5">Skills</h2>
              <div class="flex flex-wrap gap-2.5">
                @for (skill of portfolio()!.skills; track skill.name) {
                  <span class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
                        [class]="levelStyle(skill.level)">
                    {{ skill.name }}
                    @if (skill.level) {
                      <span class="opacity-60 text-[10px] capitalize">{{ skill.level }}</span>
                    }
                  </span>
                }
              </div>
              <!-- Legend -->
              <div class="flex items-center gap-4 mt-4 flex-wrap">
                <span class="text-[11px] text-slate-400">Level:</span>
                @for (entry of levelLegend; track entry.label) {
                  <span class="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg" [class]="entry.cls">{{ entry.label }}</span>
                }
              </div>
            </section>
          }

          <!-- Projects -->
          @if ((portfolio()!.projects ?? []).length > 0) {
            <section>
              <h2 class="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-5">Projects</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                @for (proj of portfolio()!.projects; track proj.title; let i = $index) {
                  <div class="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700 flex flex-col">
                    <!-- Card header gradient -->
                    <div class="h-28 bg-gradient-to-br {{ projectGradient(i) }} flex items-center justify-center relative">
                      @if (proj.featured) {
                        <span class="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full bg-amber-400 text-amber-900">⭐ Featured</span>
                      }
                      <span class="text-4xl opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300">
                        {{ proj.title ? proj.title.charAt(0).toUpperCase() : '📁' }}
                      </span>
                    </div>
                    <!-- Card body -->
                    <div class="p-5 flex flex-col flex-1 gap-3">
                      <h3 class="font-bold text-slate-900 dark:text-white text-sm leading-snug">{{ proj.title }}</h3>
                      @if (proj.description) {
                        <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">{{ proj.description }}</p>
                      }
                      <div class="flex items-center gap-3 mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
                        @if (proj.url) {
                          <a [href]="proj.url" target="_blank" rel="noopener noreferrer"
                             class="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline">
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                            Live Demo
                          </a>
                        }
                        @if (proj.githubUrl) {
                          <a [href]="proj.githubUrl" target="_blank" rel="noopener noreferrer"
                             class="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                            GitHub
                          </a>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            </section>
          }

        </div>
      </main>

      <!-- ── Footer ─────────────────────────────────────────────── -->
      <footer class="bg-slate-950 border-t border-white/5 py-8 px-4 text-center">
        <p class="text-slate-500 text-xs">
          Built with
          <a routerLink="/" class="text-violet-400 hover:text-violet-300 font-semibold transition">ApnaConverter</a>
          - Free Resume & Portfolio Builder
        </p>
        <a routerLink="/resume-builder/portfolio"
           class="mt-3 inline-block text-xs font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 transition">
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
  readonly portfolio = signal<Portfolio | null>(null);

  readonly levelLegend = [
    { label: 'Expert',       cls: 'bg-violet-600 text-white' },
    { label: 'Advanced',     cls: 'bg-indigo-500 text-white' },
    { label: 'Intermediate', cls: 'bg-blue-100 text-blue-700' },
    { label: 'Beginner',     cls: 'bg-slate-100 text-slate-600' },
  ];

  levelStyle(level: string | undefined): string {
    return LEVEL_STYLE[(level ?? '').toLowerCase()] ?? LEVEL_STYLE['intermediate'];
  }

  projectGradient(i: number): string {
    return PROJECT_GRADIENTS[i % PROJECT_GRADIENTS.length];
  }

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

        this.seo.setPage({ title: `${displayName} - Portfolio | ApnaConverter`, description, canonical: pageUrl, ogType: 'profile' });

        const socialLinks = [p.social?.linkedin, p.social?.github, p.social?.twitter, p.social?.website].filter(Boolean);

        this.jsonLd.setJsonLd('public-portfolio', {
          '@context': 'https://schema.org', '@type': 'ProfilePage',
          name: `${displayName} - Portfolio`, url: pageUrl,
          mainEntity: {
            '@type': 'Person', name: displayName,
            description: p.about || undefined, email: p.email || undefined,
            address: p.location ? { '@type': 'PostalAddress', addressLocality: p.location } : undefined,
            sameAs: socialLinks.length ? socialLinks : undefined,
            knowsAbout: (p.skills ?? []).map((s: any) => s.name),
          },
        });

        if ((p.projects ?? []).length > 0) {
          this.jsonLd.setJsonLd('public-portfolio-projects', {
            '@context': 'https://schema.org', '@type': 'ItemList',
            name: `${displayName}'s Projects`,
            itemListElement: (p.projects ?? []).map((proj: any, i: number) => ({
              '@type': 'ListItem', position: i + 1,
              name: proj.title, description: proj.description || undefined,
              url: proj.url || proj.githubUrl || undefined,
            })),
          });
        }

        this.jsonLd.setJsonLd('public-portfolio-breadcrumb', {
          '@context': 'https://schema.org', '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',       item: SITE_URL },
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
