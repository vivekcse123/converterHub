import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import {
  AboutConfig, ContactConfig, EducationConfig, ExperienceConfig, HeroConfig,
  PortfolioData, PortfolioSection, ProjectsConfig, SkillsConfig, TestimonialsConfig,
} from '../../models/portfolio.model';
import { FONT_CLASS, initials, normalizeUrl, socialLinks, visibleSections } from '../shared/theme-helpers';
import { resolveMediaUrl } from '../../models/portfolio.model';

@Component({
  selector: 'app-aurora-theme',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 min-h-full"
         [class]="fontClass()" [class.dark]="portfolio().theme.mode === 'dark'">
      <div class="mx-auto px-6 sm:px-10 py-16 sm:py-24" [class]="widthClass()">

        @for (section of sections(); track section.id) {
          <div class="mb-20 last:mb-0">
            @switch (section.type) {

              @case ('hero') {
                <div class="text-center">
                  @if (heroCfg(section).photoUrl) {
                    <img [src]="resolveMediaUrl(heroCfg(section).photoUrl)" alt="" class="w-24 h-24 rounded-full object-cover mx-auto mb-6 ring-1 ring-slate-200 dark:ring-slate-800">
                  } @else {
                    <div class="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-xl font-bold text-white"
                         [style.background]="accent()">{{ initials(heroCfg(section).headline) }}</div>
                  }
                  <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">{{ heroCfg(section).headline || 'Your Name' }}</h1>
                  <p class="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">{{ heroCfg(section).subheadline }}</p>
                  @if (heroCfg(section).ctaLabel) {
                    <a [href]="normalizeUrl(heroCfg(section).ctaUrl)" class="inline-block mt-7 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-transform hover:scale-105" [style.background]="accent()">
                      {{ heroCfg(section).ctaLabel }}
                    </a>
                  }
                </div>
              }

              @case ('about') {
                <div class="max-w-xl mx-auto">
                  <h2 class="eyebrow" [style.color]="accent()">About</h2>
                  <p class="mt-3 text-base leading-loose text-slate-600 dark:text-slate-300 whitespace-pre-line" [innerHTML]="aboutCfg(section).body"></p>
                  @if (aboutCfg(section).highlights.length) {
                    <div class="flex flex-wrap gap-2 mt-5">
                      @for (h of aboutCfg(section).highlights; track h) {
                        <span class="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300">{{ h }}</span>
                      }
                    </div>
                  }
                </div>
              }

              @case ('skills') {
                <div class="max-w-xl mx-auto">
                  <h2 class="eyebrow" [style.color]="accent()">Skills</h2>
                  <div class="mt-4 space-y-4">
                    @for (group of skillsCfg(section).groups; track group.id) {
                      <div>
                        <p class="text-xs font-semibold text-slate-400 mb-1.5">{{ group.label }}</p>
                        <div class="flex flex-wrap gap-1.5">
                          @for (item of group.items; track item.name) {
                            <span class="text-xs px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">{{ item.name }}</span>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('experience') {
                <div class="max-w-xl mx-auto">
                  <h2 class="eyebrow" [style.color]="accent()">Experience</h2>
                  <div class="mt-4 space-y-7">
                    @for (item of experienceCfg(section).items; track $index) {
                      <div class="border-l border-slate-200 dark:border-slate-800 pl-5">
                        <p class="text-[13px] text-slate-400">{{ item.startDate }} — {{ item.current ? 'Present' : item.endDate }}</p>
                        <p class="text-base font-semibold text-slate-900 dark:text-white mt-0.5">{{ item.role }}</p>
                        <p class="text-sm mb-2" [style.color]="accent()">{{ item.company }}</p>
                        <ul class="space-y-1">
                          @for (b of item.bullets; track $index) {
                            <li class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">— {{ b }}</li>
                          }
                        </ul>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('projects') {
                <div class="max-w-xl mx-auto">
                  <h2 class="eyebrow" [style.color]="accent()">Projects</h2>
                  <div class="mt-4 space-y-8">
                    @for (item of projectsCfg(section).items; track $index) {
                      <div>
                        @if (item.imageUrl) {
                          <img [src]="resolveMediaUrl(item.imageUrl)" alt="" class="w-full rounded-xl object-cover aspect-[16/9] mb-3">
                        }
                        <div class="flex items-center gap-2">
                          <p class="text-base font-semibold text-slate-900 dark:text-white">{{ item.title }}</p>
                          @if (item.featured) { <span class="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 font-bold">FEATURED</span> }
                        </div>
                        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed" [innerHTML]="item.description"></p>
                        <div class="flex items-center gap-3 mt-2">
                          @if (item.url) { <a [href]="normalizeUrl(item.url)" class="text-xs font-semibold" [style.color]="accent()">Live ↗</a> }
                          @if (item.githubUrl) { <a [href]="normalizeUrl(item.githubUrl)" class="text-xs font-semibold text-slate-500 dark:text-slate-400">Code ↗</a> }
                        </div>
                        @if (item.tags.length) {
                          <div class="flex flex-wrap gap-1.5 mt-2">
                            @for (t of item.tags; track t) { <span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400">{{ t }}</span> }
                          </div>
                        }
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('education') {
                <div class="max-w-xl mx-auto">
                  <h2 class="eyebrow" [style.color]="accent()">Education</h2>
                  <div class="mt-4 space-y-4">
                    @for (item of educationCfg(section).items; track $index) {
                      <div class="flex items-baseline justify-between gap-4">
                        <div>
                          <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ item.institution }}</p>
                          <p class="text-xs text-slate-500 dark:text-slate-400">{{ item.degree }} · {{ item.field }}</p>
                        </div>
                        <p class="text-xs text-slate-400 whitespace-nowrap">{{ item.startDate }}–{{ item.endDate }}</p>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('testimonials') {
                <div class="max-w-xl mx-auto">
                  <h2 class="eyebrow" [style.color]="accent()">Testimonials</h2>
                  <div class="mt-4 grid sm:grid-cols-2 gap-6">
                    @for (item of testimonialsCfg(section).items; track $index) {
                      <div>
                        <p class="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">"{{ item.quote }}"</p>
                        <div class="flex items-center gap-2.5 mt-3">
                          @if (item.avatarUrl) {
                            <img [src]="resolveMediaUrl(item.avatarUrl)" alt="" class="w-8 h-8 rounded-full object-cover">
                          } @else {
                            <div class="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white" [style.background]="accent()">{{ initials(item.author) }}</div>
                          }
                          <div>
                            <p class="text-xs font-semibold text-slate-800 dark:text-slate-100">{{ item.author }}</p>
                            <p class="text-[11px] text-slate-400">{{ item.role }}</p>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('contact') {
                <div class="text-center max-w-xl mx-auto">
                  <h2 class="eyebrow" [style.color]="accent()">Contact</h2>
                  <p class="mt-3 text-2xl font-bold text-slate-900 dark:text-white">Let's talk</p>
                  <div class="flex items-center justify-center gap-4 mt-5 flex-wrap text-sm">
                    @if (contactCfg(section).showEmail && portfolio().email) {
                      <a [href]="'mailto:' + portfolio().email" class="font-semibold" [style.color]="accent()">{{ portfolio().email }}</a>
                    }
                    @if (contactCfg(section).showPhone && portfolio().phone) {
                      <span class="text-slate-500 dark:text-slate-400">{{ portfolio().phone }}</span>
                    }
                  </div>
                  @if (contactCfg(section).showSocial && links().length) {
                    <div class="flex items-center justify-center gap-4 mt-4">
                      @for (l of links(); track l.key) {
                        <a [href]="l.url" class="text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">{{ l.label }}</a>
                      }
                    </div>
                  }
                </div>
              }
            }
          </div>
        }

        <footer class="mt-10 pt-8 border-t border-slate-100 dark:border-slate-900 text-center text-xs text-slate-400">
          © {{ year }} {{ portfolio().displayName || portfolio().username }}
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .eyebrow { @apply text-[11px] font-bold uppercase tracking-[0.15em]; }
  `],
})
export class AuroraThemeComponent {
  portfolio = input.required<PortfolioData>();
  editable = input(false);

  readonly year = new Date().getFullYear();

  sections(): PortfolioSection[] { return visibleSections(this.portfolio()); }
  accent(): string { return this.portfolio().theme.accentColor || '#4f46e5'; }
  fontClass(): string { return FONT_CLASS[this.portfolio().theme.fontFamily] ?? 'font-sans'; }
  widthClass(): string { return this.portfolio().theme.layoutWidth === 'narrow' ? 'max-w-xl' : 'max-w-2xl'; }
  initials = initials;
  resolveMediaUrl = resolveMediaUrl;
  normalizeUrl = normalizeUrl;
  links() { return socialLinks(this.portfolio()); }

  heroCfg(s: PortfolioSection): HeroConfig { return s.config as HeroConfig; }
  aboutCfg(s: PortfolioSection): AboutConfig { return s.config as AboutConfig; }
  skillsCfg(s: PortfolioSection): SkillsConfig { return s.config as SkillsConfig; }
  experienceCfg(s: PortfolioSection): ExperienceConfig { return s.config as ExperienceConfig; }
  projectsCfg(s: PortfolioSection): ProjectsConfig { return s.config as ProjectsConfig; }
  educationCfg(s: PortfolioSection): EducationConfig { return s.config as EducationConfig; }
  testimonialsCfg(s: PortfolioSection): TestimonialsConfig { return s.config as TestimonialsConfig; }
  contactCfg(s: PortfolioSection): ContactConfig { return s.config as ContactConfig; }
}
