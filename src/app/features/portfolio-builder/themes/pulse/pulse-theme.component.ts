import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import {
  AboutConfig, ContactConfig, EducationConfig, ExperienceConfig, HeroConfig,
  PortfolioData, PortfolioSection, ProjectsConfig, SkillItem, SkillsConfig, TestimonialsConfig,
} from '../../models/portfolio.model';
import { FONT_CLASS, initials, normalizeUrl, socialLinks, visibleSections } from '../shared/theme-helpers';
import { resolveMediaUrl } from '../../models/portfolio.model';
import { ScrollRevealDirective } from '../shared/scroll-reveal.directive';

const LEVEL_PERCENT: Record<string, number> = {
  beginner: 35, intermediate: 60, advanced: 82, expert: 100,
};

/** Bold, animated product-design theme — dark glass cards over drifting
 *  gradient blobs, real data-driven skill meters (only rendered for skills
 *  that actually have a level set, no fabricated percentages). Dark-only by
 *  design, same as Noir/Terminal: the glow only reads against near-black. */
@Component({
  selector: 'app-pulse-theme',
  standalone: true,
  imports: [ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="relative bg-[#08080d] text-slate-100 min-h-full overflow-hidden" [class]="fontClass()">
      <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="portfolio-blob-1 absolute -top-32 -right-20 h-[28rem] w-[28rem] rounded-full blur-[100px] opacity-40" [style.background]="accent()"></div>
        <div class="portfolio-blob-2 absolute bottom-0 -left-32 h-96 w-96 rounded-full blur-[100px] opacity-30 bg-cyan-500"></div>
      </div>

      <div class="relative mx-auto px-6 sm:px-10 py-20 sm:py-28" [class]="widthClass()">
        @for (section of sections(); track section.id; let i = $index) {
          <div class="mb-16 last:mb-0" [appReveal]="i * 60">
            @switch (section.type) {

              @case ('hero') {
                <div class="text-center">
                  @if (heroCfg(section).photoUrl) {
                    <img [src]="resolveMediaUrl(heroCfg(section).photoUrl)" alt="" class="w-24 h-24 rounded-3xl object-cover mx-auto mb-7 ring-1 ring-white/10">
                  } @else {
                    <div class="w-24 h-24 rounded-3xl mx-auto mb-7 flex items-center justify-center text-2xl font-black text-white" [style.background]="accent()">{{ initials(heroCfg(section).headline) }}</div>
                  }
                  <h1 class="text-5xl sm:text-7xl font-black tracking-tight bg-clip-text text-transparent" [style.background-image]="'linear-gradient(135deg,' + accent() + ',#22d3ee)'">
                    {{ heroCfg(section).headline || 'Your Name' }}
                  </h1>
                  <p class="mt-5 text-lg text-slate-400 max-w-md mx-auto leading-relaxed">{{ heroCfg(section).subheadline }}</p>
                  @if (heroCfg(section).ctaLabel) {
                    <a [href]="normalizeUrl(heroCfg(section).ctaUrl)"
                       class="inline-block mt-8 px-7 py-3 rounded-full text-sm font-bold text-white transition-transform hover:scale-105"
                       [style.background]="accent()" [style.box-shadow]="'0 0 40px -8px ' + accent()">
                      {{ heroCfg(section).ctaLabel }}
                    </a>
                  }
                </div>
              }

              @case ('about') {
                <div class="glass max-w-xl mx-auto rounded-3xl p-7">
                  <p class="eyebrow" [style.color]="accent()">About</p>
                  <p class="mt-3 text-base leading-loose text-slate-300 whitespace-pre-line" [innerHTML]="aboutCfg(section).body"></p>
                  @if (aboutCfg(section).highlights.length) {
                    <div class="flex flex-wrap gap-2 mt-5">
                      @for (h of aboutCfg(section).highlights; track h; let k = $index) {
                        <span class="reveal-init reveal-scale text-xs px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-slate-200" [appReveal]="k * 70">{{ h }}</span>
                      }
                    </div>
                  }
                </div>
              }

              @case ('skills') {
                <div class="max-w-xl mx-auto">
                  <p class="eyebrow" [style.color]="accent()">Skills</p>
                  <div class="mt-4 space-y-6">
                    @for (group of skillsCfg(section).groups; track group.id) {
                      <div class="glass rounded-2xl p-5">
                        <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">{{ group.label }}</p>
                        <div class="space-y-3">
                          @for (item of group.items; track item.name) {
                            @if (levelPercent(item); as pct) {
                              <div>
                                <div class="flex items-center justify-between mb-1">
                                  <span class="text-sm font-medium text-slate-200">{{ item.name }}</span>
                                  <span class="text-[11px] text-slate-500">{{ item.level }}</span>
                                </div>
                                <div class="h-1.5 rounded-full bg-white/10 overflow-hidden">
                                  <div class="skill-meter-fill h-full rounded-full" [style.background]="accent()" [style.--meter-target]="pct + '%'"></div>
                                </div>
                              </div>
                            } @else {
                              <span class="inline-block text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-300 mr-1.5 mb-1.5">{{ item.name }}</span>
                            }
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('experience') {
                <div class="max-w-xl mx-auto">
                  <p class="eyebrow" [style.color]="accent()">Experience</p>
                  <div class="mt-4 space-y-4">
                    @for (item of experienceCfg(section).items; track $index) {
                      <div class="glass rounded-2xl p-5" [appReveal]="$index * 90">
                        <div class="flex items-center justify-between flex-wrap gap-2">
                          <p class="text-base font-bold text-white">{{ item.role }} <span class="font-medium text-slate-400">· {{ item.company }}</span></p>
                          <p class="text-xs text-slate-500">{{ item.startDate }} – {{ item.current ? 'Now' : item.endDate }}</p>
                        </div>
                        <ul class="mt-2.5 space-y-1">
                          @for (b of item.bullets; track $index) {
                            <li class="text-sm text-slate-400 leading-relaxed">— {{ b }}</li>
                          }
                        </ul>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('projects') {
                <div class="max-w-2xl mx-auto">
                  <p class="eyebrow" [style.color]="accent()">Projects</p>
                  <div class="mt-4 grid sm:grid-cols-2 gap-5">
                    @for (item of projectsCfg(section).items; track $index) {
                      <div class="glass-hover rounded-2xl overflow-hidden group" [appReveal]="$index * 90">
                        @if (item.imageUrl) {
                          <div class="overflow-hidden">
                            <img [src]="resolveMediaUrl(item.imageUrl)" alt="" class="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-110">
                          </div>
                        }
                        <div class="p-4">
                          <div class="flex items-center gap-2">
                            <p class="font-bold text-white">{{ item.title }}</p>
                            @if (item.featured) { <span class="text-[10px] px-1.5 py-0.5 rounded font-bold text-white" [style.background]="accent()">FEATURED</span> }
                          </div>
                          <p class="text-sm text-slate-400 mt-1 leading-relaxed" [innerHTML]="item.description"></p>
                          <div class="flex items-center gap-3 mt-2.5">
                            @if (item.url) { <a [href]="normalizeUrl(item.url)" class="text-xs font-bold" [style.color]="accent()">Live ↗</a> }
                            @if (item.githubUrl) { <a [href]="normalizeUrl(item.githubUrl)" class="text-xs font-bold text-slate-400">Code ↗</a> }
                          </div>
                          @if (item.tags.length) {
                            <div class="flex flex-wrap gap-1.5 mt-2.5">
                              @for (t of item.tags; track t) { <span class="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-slate-400">{{ t }}</span> }
                            </div>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('education') {
                <div class="glass max-w-xl mx-auto rounded-2xl p-5">
                  <p class="eyebrow" [style.color]="accent()">Education</p>
                  <div class="mt-3 space-y-2.5">
                    @for (item of educationCfg(section).items; track $index) {
                      <div class="flex items-baseline justify-between gap-4">
                        <p class="text-sm text-slate-200"><span class="font-bold text-white">{{ item.institution }}</span> — {{ item.degree }}, {{ item.field }}</p>
                        <p class="text-xs text-slate-500 whitespace-nowrap">{{ item.startDate }}–{{ item.endDate }}</p>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('testimonials') {
                <div class="max-w-2xl mx-auto">
                  <p class="eyebrow" [style.color]="accent()">Testimonials</p>
                  <div class="mt-4 grid sm:grid-cols-2 gap-5">
                    @for (item of testimonialsCfg(section).items; track $index) {
                      <div class="glass rounded-2xl p-5" [appReveal]="$index * 90">
                        <p class="text-sm text-slate-300 leading-relaxed">"{{ item.quote }}"</p>
                        <div class="flex items-center gap-2.5 mt-4">
                          @if (item.avatarUrl) {
                            <img [src]="resolveMediaUrl(item.avatarUrl)" alt="" class="w-8 h-8 rounded-full object-cover">
                          } @else {
                            <div class="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white" [style.background]="accent()">{{ initials(item.author) }}</div>
                          }
                          <div>
                            <p class="text-xs font-bold text-white">{{ item.author }}</p>
                            <p class="text-[11px] text-slate-500">{{ item.role }}</p>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('contact') {
                <div class="glass text-center max-w-xl mx-auto rounded-3xl p-10">
                  <p class="eyebrow" [style.color]="accent()">Contact</p>
                  <p class="mt-3 text-2xl font-black text-white">Let's build something</p>
                  <div class="flex items-center justify-center gap-4 mt-5 flex-wrap text-sm">
                    @if (contactCfg(section).showEmail && portfolio().email) {
                      <a [href]="'mailto:' + portfolio().email"
                         class="px-5 py-2.5 rounded-full text-sm font-bold text-white"
                         [style.background]="accent()" [style.box-shadow]="'0 0 30px -8px ' + accent()">{{ portfolio().email }}</a>
                    }
                    @if (contactCfg(section).showPhone && portfolio().phone) {
                      <span class="text-slate-400">{{ portfolio().phone }}</span>
                    }
                  </div>
                  @if (contactCfg(section).showSocial && links().length) {
                    <div class="flex items-center justify-center gap-4 mt-5">
                      @for (l of links(); track l.key) {
                        <a [href]="l.url" class="text-xs font-bold text-slate-400 hover:text-white transition-colors">{{ l.label }}</a>
                      }
                    </div>
                  }
                </div>
              }
            }
          </div>
        }

        <footer class="mt-10 pt-8 border-t border-white/10 text-center text-xs text-slate-500">
          © {{ year }} {{ portfolio().displayName || portfolio().username }}
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .eyebrow { @apply text-[11px] font-bold uppercase tracking-[0.15em]; }
    .glass { @apply bg-white/[0.04] backdrop-blur-xl border border-white/10; }
    .glass-hover { @apply bg-white/[0.04] backdrop-blur-xl border border-white/10 transition-colors duration-300 hover:border-white/20; }
  `],
})
export class PulseThemeComponent {
  portfolio = input.required<PortfolioData>();
  editable = input(false);

  readonly year = new Date().getFullYear();

  sections(): PortfolioSection[] { return visibleSections(this.portfolio()); }
  accent(): string { return this.portfolio().theme.accentColor || '#8b5cf6'; }
  fontClass(): string { return FONT_CLASS[this.portfolio().theme.fontFamily] ?? 'font-sans'; }
  widthClass(): string { return this.portfolio().theme.layoutWidth === 'narrow' ? 'max-w-xl' : 'max-w-2xl'; }
  initials = initials;
  resolveMediaUrl = resolveMediaUrl;
  normalizeUrl = normalizeUrl;
  links() { return socialLinks(this.portfolio()); }

  /** Only skills with a real level render an animated meter — no fabricated percentage for unrated skills. */
  levelPercent(item: SkillItem): number | null {
    return item.level ? LEVEL_PERCENT[item.level] ?? null : null;
  }

  heroCfg(s: PortfolioSection): HeroConfig { return s.config as HeroConfig; }
  aboutCfg(s: PortfolioSection): AboutConfig { return s.config as AboutConfig; }
  skillsCfg(s: PortfolioSection): SkillsConfig { return s.config as SkillsConfig; }
  experienceCfg(s: PortfolioSection): ExperienceConfig { return s.config as ExperienceConfig; }
  projectsCfg(s: PortfolioSection): ProjectsConfig { return s.config as ProjectsConfig; }
  educationCfg(s: PortfolioSection): EducationConfig { return s.config as EducationConfig; }
  testimonialsCfg(s: PortfolioSection): TestimonialsConfig { return s.config as TestimonialsConfig; }
  contactCfg(s: PortfolioSection): ContactConfig { return s.config as ContactConfig; }
}
