import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import {
  AboutConfig, ContactConfig, EducationConfig, ExperienceConfig, HeroConfig,
  PortfolioData, PortfolioSection, ProjectsConfig, SkillsConfig, TestimonialsConfig,
} from '../../models/portfolio.model';
import { FONT_CLASS, initials, normalizeUrl, socialLinks, visibleSections } from '../shared/theme-helpers';
import { resolveMediaUrl } from '../../models/portfolio.model';

@Component({
  selector: 'app-noir-theme',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="relative bg-slate-950 text-slate-100 min-h-full overflow-hidden" [class]="fontClass()">
      <!-- ambient gradient mesh -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute -top-32 -left-20 h-96 w-96 rounded-full blur-3xl opacity-30" [style.background]="accent()"></div>
        <div class="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-20 bg-indigo-500"></div>
        <div class="absolute bottom-0 left-1/3 h-80 w-80 rounded-full blur-3xl opacity-20 bg-fuchsia-500"></div>
      </div>

      <div class="relative mx-auto px-6 sm:px-10 py-16 sm:py-24" [class]="widthClass()">
        @for (section of sections(); track section.id) {
          <div class="mb-8 last:mb-0">
            @switch (section.type) {

              @case ('hero') {
                <div class="glass rounded-[28px] p-10 sm:p-14 text-center">
                  @if (heroCfg(section).photoUrl) {
                    <img [src]="resolveMediaUrl(heroCfg(section).photoUrl)" alt="" class="w-24 h-24 rounded-full object-cover mx-auto mb-6 ring-2 ring-white/10">
                  } @else {
                    <div class="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-xl font-bold text-white" [style.background]="accent()">{{ initials(heroCfg(section).headline) }}</div>
                  }
                  <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">{{ heroCfg(section).headline || 'Your Name' }}</h1>
                  <p class="mt-4 text-lg text-slate-300 max-w-lg mx-auto leading-relaxed">{{ heroCfg(section).subheadline }}</p>
                  @if (heroCfg(section).ctaLabel) {
                    <a [href]="normalizeUrl(heroCfg(section).ctaUrl)" class="inline-block mt-8 px-7 py-3 rounded-full text-sm font-bold text-white transition-transform hover:scale-105"
                       [style.background]="accent()" [style.box-shadow]="'0 0 40px ' + accent() + '55'">
                      {{ heroCfg(section).ctaLabel }}
                    </a>
                  }
                </div>
              }

              @case ('about') {
                <div class="glass rounded-[24px] p-8">
                  <h2 class="eyebrow" [style.color]="accentLight()">About</h2>
                  <p class="mt-3 text-base leading-loose text-slate-300 whitespace-pre-line" [innerHTML]="aboutCfg(section).body"></p>
                  @if (aboutCfg(section).highlights.length) {
                    <div class="flex flex-wrap gap-2 mt-5">
                      @for (h of aboutCfg(section).highlights; track h) {
                        <span class="text-xs px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10">{{ h }}</span>
                      }
                    </div>
                  }
                </div>
              }

              @case ('skills') {
                <div class="glass rounded-[24px] p-8">
                  <h2 class="eyebrow" [style.color]="accentLight()">Skills</h2>
                  <div class="mt-4 grid sm:grid-cols-2 gap-4">
                    @for (group of skillsCfg(section).groups; track group.id) {
                      <div>
                        <p class="text-xs font-semibold text-slate-400 mb-1.5">{{ group.label }}</p>
                        <div class="flex flex-wrap gap-1.5">
                          @for (item of group.items; track item.name) {
                            <span class="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200">{{ item.name }}</span>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('experience') {
                <div class="glass rounded-[24px] p-8">
                  <h2 class="eyebrow" [style.color]="accentLight()">Experience</h2>
                  <div class="mt-4 space-y-6">
                    @for (item of experienceCfg(section).items; track $index) {
                      <div class="rounded-2xl bg-white/[0.03] border border-white/5 p-4">
                        <div class="flex items-center justify-between">
                          <p class="text-base font-bold text-white">{{ item.role }}</p>
                          <p class="text-[11px] text-slate-500">{{ item.startDate }} – {{ item.current ? 'Present' : item.endDate }}</p>
                        </div>
                        <p class="text-sm mb-2" [style.color]="accentLight()">{{ item.company }}</p>
                        <ul class="space-y-1">
                          @for (b of item.bullets; track $index) { <li class="text-sm text-slate-300 leading-relaxed">— {{ b }}</li> }
                        </ul>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('projects') {
                <div class="glass rounded-[24px] p-8">
                  <h2 class="eyebrow" [style.color]="accentLight()">Projects</h2>
                  <div class="mt-4 grid sm:grid-cols-2 gap-4">
                    @for (item of projectsCfg(section).items; track $index) {
                      <div class="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/5">
                        @if (item.imageUrl) { <img [src]="resolveMediaUrl(item.imageUrl)" alt="" class="w-full aspect-[16/9] object-cover"> }
                        <div class="p-4">
                          <div class="flex items-center gap-2">
                            <p class="text-sm font-bold text-white">{{ item.title }}</p>
                            @if (item.featured) { <span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">★</span> }
                          </div>
                          <p class="text-xs text-slate-400 mt-1 leading-relaxed" [innerHTML]="item.description"></p>
                          <div class="flex items-center gap-3 mt-2">
                            @if (item.url) { <a [href]="normalizeUrl(item.url)" class="text-[11px] font-bold" [style.color]="accentLight()">Live ↗</a> }
                            @if (item.githubUrl) { <a [href]="normalizeUrl(item.githubUrl)" class="text-[11px] font-bold text-slate-400">Code ↗</a> }
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('education') {
                <div class="glass rounded-[24px] p-8">
                  <h2 class="eyebrow" [style.color]="accentLight()">Education</h2>
                  <div class="mt-4 space-y-3">
                    @for (item of educationCfg(section).items; track $index) {
                      <div class="flex items-baseline justify-between gap-4">
                        <div>
                          <p class="text-sm font-semibold text-white">{{ item.institution }}</p>
                          <p class="text-xs text-slate-400">{{ item.degree }} · {{ item.field }}</p>
                        </div>
                        <p class="text-xs text-slate-500 whitespace-nowrap">{{ item.startDate }}–{{ item.endDate }}</p>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('testimonials') {
                <div class="glass rounded-[24px] p-8">
                  <h2 class="eyebrow" [style.color]="accentLight()">Testimonials</h2>
                  <div class="mt-4 grid sm:grid-cols-2 gap-4">
                    @for (item of testimonialsCfg(section).items; track $index) {
                      <div class="rounded-2xl bg-white/[0.03] border border-white/5 p-4">
                        <p class="text-sm text-slate-300 italic leading-relaxed">"{{ item.quote }}"</p>
                        <div class="flex items-center gap-2.5 mt-3">
                          @if (item.avatarUrl) {
                            <img [src]="resolveMediaUrl(item.avatarUrl)" alt="" class="w-8 h-8 rounded-full object-cover">
                          } @else {
                            <div class="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white" [style.background]="accent()">{{ initials(item.author) }}</div>
                          }
                          <div>
                            <p class="text-xs font-semibold text-slate-100">{{ item.author }}</p>
                            <p class="text-[11px] text-slate-500">{{ item.role }}</p>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('contact') {
                <div class="glass rounded-[24px] p-10 text-center">
                  <h2 class="eyebrow" [style.color]="accentLight()">Contact</h2>
                  <p class="mt-3 text-2xl font-extrabold text-white">Let's build something</p>
                  <div class="flex items-center justify-center gap-4 mt-5 flex-wrap text-sm">
                    @if (contactCfg(section).showEmail && portfolio().email) {
                      <a [href]="'mailto:' + portfolio().email" class="font-semibold" [style.color]="accentLight()">{{ portfolio().email }}</a>
                    }
                    @if (contactCfg(section).showPhone && portfolio().phone) { <span class="text-slate-400">{{ portfolio().phone }}</span> }
                  </div>
                  @if (contactCfg(section).showSocial && links().length) {
                    <div class="flex items-center justify-center gap-4 mt-4">
                      @for (l of links(); track l.key) {
                        <a [href]="l.url" class="text-xs font-semibold text-slate-400 hover:text-white transition-colors">{{ l.label }}</a>
                      }
                    </div>
                  }
                </div>
              }
            }
          </div>
        }

        <footer class="mt-10 pt-8 border-t border-white/5 text-center text-xs text-slate-500">
          © {{ year }} {{ portfolio().displayName || portfolio().username }}
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .eyebrow { @apply text-[11px] font-bold uppercase tracking-[0.15em]; }
    .glass { @apply bg-white/[0.04] backdrop-blur-xl border border-white/10; }
  `],
})
export class NoirThemeComponent {
  portfolio = input.required<PortfolioData>();
  editable = input(false);

  readonly year = new Date().getFullYear();

  sections(): PortfolioSection[] { return visibleSections(this.portfolio()); }
  accent(): string { return this.portfolio().theme.accentColor || '#7c3aed'; }
  accentLight(): string { return this.accent(); }
  fontClass(): string { return FONT_CLASS[this.portfolio().theme.fontFamily] ?? 'font-sans'; }
  widthClass(): string { return this.portfolio().theme.layoutWidth === 'narrow' ? 'max-w-xl' : 'max-w-3xl'; }
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
