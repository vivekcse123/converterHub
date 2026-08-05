import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import {
  AboutConfig, ContactConfig, EducationConfig, ExperienceConfig, HeroConfig,
  PortfolioData, PortfolioSection, ProjectsConfig, SkillsConfig, TestimonialsConfig,
} from '../../models/portfolio.model';
import { FONT_CLASS, initials, normalizeUrl, socialLinks, visibleSections } from '../shared/theme-helpers';
import { resolveMediaUrl } from '../../models/portfolio.model';
import { ScrollRevealDirective } from '../shared/scroll-reveal.directive';

/** Magazine-editorial theme — bold sans masthead headline, serif body copy
 *  (the inverse pairing of Lumen's serif-display/sans-body), a drop-cap
 *  About paragraph, an animated draw-in vertical timeline for Experience,
 *  and an asymmetric project grid. Light-only by design. */
@Component({
  selector: 'app-folio-theme',
  standalone: true,
  imports: [ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="bg-white text-[#161616] min-h-full" [class]="fontClass()">
      <div class="mx-auto px-6 sm:px-10 py-16 sm:py-24" [class]="widthClass()">

        @for (section of sections(); track section.id; let i = $index) {
          <div class="mb-20 last:mb-0" [appReveal]="i * 60">
            @switch (section.type) {

              @case ('hero') {
                <div>
                  @if (heroCfg(section).photoUrl) {
                    <img [src]="resolveMediaUrl(heroCfg(section).photoUrl)" alt="" class="w-16 h-16 rounded-full object-cover mb-6">
                  }
                  <h1 class="text-5xl sm:text-7xl font-black tracking-tighter uppercase leading-[0.9]">{{ heroCfg(section).headline || 'Your Name' }}</h1>
                  <p class="mt-5 font-georgia italic text-xl text-[#161616]/60 max-w-lg leading-relaxed">{{ heroCfg(section).subheadline }}</p>
                  <div class="h-[3px] w-16 mt-7 mb-2" [style.background]="accent()"></div>
                  @if (heroCfg(section).ctaLabel) {
                    <a [href]="normalizeUrl(heroCfg(section).ctaUrl)" class="inline-flex items-center gap-1.5 mt-4 text-sm font-bold uppercase tracking-wide" [style.color]="accent()">
                      {{ heroCfg(section).ctaLabel }} <span aria-hidden="true">→</span>
                    </a>
                  }
                </div>
              }

              @case ('about') {
                <div class="max-w-xl">
                  <h2 class="section-head" [style.color]="accent()">About</h2>
                  <p class="mt-4 font-georgia text-lg leading-loose whitespace-pre-line dropcap" [style.--dropcap-color]="accent()" [innerHTML]="aboutCfg(section).body"></p>
                  @if (aboutCfg(section).highlights.length) {
                    <div class="flex flex-wrap gap-2 mt-6">
                      @for (h of aboutCfg(section).highlights; track h) {
                        <span class="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 border" [style.border-color]="accent()" [style.color]="accent()">{{ h }}</span>
                      }
                    </div>
                  }
                </div>
              }

              @case ('skills') {
                <div class="max-w-xl">
                  <h2 class="section-head" [style.color]="accent()">Skills</h2>
                  <div class="mt-4 space-y-5">
                    @for (group of skillsCfg(section).groups; track group.id) {
                      <div>
                        <p class="text-xs font-bold uppercase tracking-wide text-[#161616]/40 mb-2 pb-1 border-b border-[#161616]/10">{{ group.label }}</p>
                        <div class="flex flex-wrap gap-x-4 gap-y-1.5 font-georgia text-[#161616]/80">
                          @for (item of group.items; track item.name) { <span>{{ item.name }}</span> }
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('experience') {
                <div class="max-w-xl">
                  <h2 class="section-head" [style.color]="accent()">Experience</h2>
                  <div class="relative mt-6 pl-8">
                    <div class="timeline-rule absolute left-[3px] top-1 bottom-1 w-px bg-[#161616]/15"></div>
                    @for (item of experienceCfg(section).items; track $index) {
                      <div class="relative pb-9 last:pb-0" [appReveal]="$index * 90">
                        <span class="absolute -left-8 top-1.5 w-[7px] h-[7px] rounded-full" [style.background]="accent()"></span>
                        <p class="text-xs text-[#161616]/40">{{ item.startDate }} — {{ item.current ? 'Present' : item.endDate }}</p>
                        <p class="text-lg font-bold mt-0.5">{{ item.role }}</p>
                        <p class="text-sm font-georgia italic" [style.color]="accent()">{{ item.company }}</p>
                        <ul class="mt-2 space-y-1">
                          @for (b of item.bullets; track $index) {
                            <li class="text-sm text-[#161616]/70 font-georgia leading-relaxed">{{ b }}</li>
                          }
                        </ul>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('projects') {
                <div>
                  <h2 class="section-head" [style.color]="accent()">Work</h2>
                  <div class="mt-5 grid sm:grid-cols-3 gap-4 auto-rows-[180px]">
                    @for (item of projectsCfg(section).items; track $index) {
                      <div class="group relative overflow-hidden bg-[#f4f2ee]" [class]="$first ? 'sm:col-span-2 sm:row-span-2' : ''" [appReveal]="$index * 90">
                        @if (item.imageUrl) {
                          <img [src]="resolveMediaUrl(item.imageUrl)" alt="" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                        }
                        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"></div>
                        <div class="absolute bottom-0 left-0 right-0 p-4">
                          <p class="text-white font-bold" [class]="$first ? 'text-xl' : 'text-sm'">{{ item.title }}</p>
                          @if ($first && item.description) {
                            <p class="text-white/70 text-sm mt-1 font-georgia italic line-clamp-2" [innerHTML]="item.description"></p>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('education') {
                <div class="max-w-xl">
                  <h2 class="section-head" [style.color]="accent()">Education</h2>
                  <div class="mt-4 space-y-2.5">
                    @for (item of educationCfg(section).items; track $index) {
                      <p class="font-georgia text-base"><span class="font-bold not-italic">{{ item.institution }}</span> — {{ item.degree }}, {{ item.field }} <span class="text-[#161616]/40 text-sm">({{ item.startDate }}–{{ item.endDate }})</span></p>
                    }
                  </div>
                </div>
              }

              @case ('testimonials') {
                <div class="max-w-2xl grid sm:grid-cols-2 gap-6">
                  @for (item of testimonialsCfg(section).items; track $index) {
                    <div class="pl-5 border-l-4" [style.border-color]="accent()" [appReveal]="$index * 100">
                      <p class="font-georgia italic text-lg leading-relaxed">"{{ item.quote }}"</p>
                      <p class="text-xs font-bold uppercase tracking-wide mt-3 text-[#161616]/50">{{ item.author }} — {{ item.role }}</p>
                    </div>
                  }
                </div>
              }

              @case ('contact') {
                <div class="max-w-xl">
                  <h2 class="section-head" [style.color]="accent()">Contact</h2>
                  <p class="mt-4 text-4xl font-black tracking-tight">Let's work together.</p>
                  <div class="flex items-center gap-6 mt-6 flex-wrap text-sm">
                    @if (contactCfg(section).showEmail && portfolio().email) {
                      <a [href]="'mailto:' + portfolio().email" class="font-bold text-lg" [style.color]="accent()">{{ portfolio().email }}</a>
                    }
                    @if (contactCfg(section).showPhone && portfolio().phone) {
                      <span class="text-[#161616]/60">{{ portfolio().phone }}</span>
                    }
                  </div>
                  @if (contactCfg(section).showSocial && links().length) {
                    <div class="flex items-center gap-5 mt-5">
                      @for (l of links(); track l.key) {
                        <a [href]="l.url" class="text-xs font-bold uppercase tracking-wide text-[#161616]/40 hover:text-[#161616] transition-colors">{{ l.label }}</a>
                      }
                    </div>
                  }
                </div>
              }
            }
          </div>
        }

        <footer class="mt-12 pt-6 border-t-2 border-[#161616] flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-[#161616]/50">
          <span>{{ portfolio().displayName || portfolio().username }}</span>
          <span>© {{ year }}</span>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .section-head { @apply text-xs font-bold uppercase tracking-[0.2em]; }
    .dropcap::first-letter {
      font-family: Georgia, 'Times New Roman', serif;
      float: left;
      font-size: 3.75rem;
      line-height: 0.85;
      font-weight: 700;
      padding-right: 0.35rem;
      color: var(--dropcap-color, currentColor);
    }
  `],
})
export class FolioThemeComponent {
  portfolio = input.required<PortfolioData>();
  editable = input(false);

  readonly year = new Date().getFullYear();

  sections(): PortfolioSection[] { return visibleSections(this.portfolio()); }
  accent(): string { return this.portfolio().theme.accentColor || '#c2410c'; }
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
