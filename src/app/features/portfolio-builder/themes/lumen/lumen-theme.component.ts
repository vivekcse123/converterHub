import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import {
  AboutConfig, ContactConfig, EducationConfig, ExperienceConfig, HeroConfig,
  PortfolioData, PortfolioSection, ProjectsConfig, SkillsConfig, TestimonialsConfig,
} from '../../models/portfolio.model';
import { FONT_CLASS, initials, normalizeUrl, socialLinks, visibleSections } from '../shared/theme-helpers';
import { resolveMediaUrl } from '../../models/portfolio.model';
import { ScrollRevealDirective } from '../shared/scroll-reveal.directive';

/** Luxury editorial theme — cream/ink palette, serif display type, thin
 *  gold-toned rules that draw in on scroll. Light-only by design: the
 *  cream/ivory identity is the point, the same way Noir/Terminal are
 *  intentionally dark-only. */
@Component({
  selector: 'app-lumen-theme',
  standalone: true,
  imports: [ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="bg-[#faf6f0] text-[#1c1a17] min-h-full" [class]="fontClass()">
      <div class="mx-auto px-6 sm:px-10 py-20 sm:py-28" [class]="widthClass()">

        @for (section of sections(); track section.id; let i = $index) {
          <div class="mb-24 last:mb-0" [appReveal]="i * 60">
            @switch (section.type) {

              @case ('hero') {
                <div class="text-center">
                  @if (heroCfg(section).photoUrl) {
                    <img [src]="resolveMediaUrl(heroCfg(section).photoUrl)" alt="" class="w-28 h-28 rounded-full object-cover mx-auto mb-8 ring-1 ring-[#1c1a17]/10">
                  } @else {
                    <div class="w-28 h-28 rounded-full mx-auto mb-8 flex items-center justify-center text-2xl font-georgia text-white" [style.background]="accent()">{{ initials(heroCfg(section).headline) }}</div>
                  }
                  <h1 class="font-georgia text-5xl sm:text-6xl tracking-tight">{{ heroCfg(section).headline || 'Your Name' }}</h1>
                  <div class="underline-draw h-px mx-auto mt-5" [style.background]="accent()" [style.--underline-target]="'64px'"></div>
                  <p class="mt-6 font-georgia italic text-lg text-[#1c1a17]/60 max-w-md mx-auto leading-relaxed">{{ heroCfg(section).subheadline }}</p>
                  @if (heroCfg(section).ctaLabel) {
                    <a [href]="normalizeUrl(heroCfg(section).ctaUrl)" class="inline-flex items-center gap-2 mt-9 text-xs font-bold uppercase tracking-[0.2em] pb-1 border-b transition-colors" [style.color]="accent()" [style.border-color]="accent()">
                      {{ heroCfg(section).ctaLabel }} <span aria-hidden="true">→</span>
                    </a>
                  }
                </div>
              }

              @case ('about') {
                <div class="max-w-xl mx-auto">
                  <p class="eyebrow" [style.color]="accent()">About</p>
                  <div class="underline-draw h-px mt-2 mb-6" [style.background]="accent() + '55'" [style.--underline-target]="'40px'"></div>
                  <p class="font-georgia text-xl leading-loose whitespace-pre-line" [innerHTML]="aboutCfg(section).body"></p>
                  @if (aboutCfg(section).highlights.length) {
                    <div class="flex flex-wrap gap-x-6 gap-y-2 mt-7">
                      @for (h of aboutCfg(section).highlights; track h) {
                        <span class="text-xs uppercase tracking-widest text-[#1c1a17]/50">{{ h }}</span>
                      }
                    </div>
                  }
                </div>
              }

              @case ('skills') {
                <div class="max-w-xl mx-auto">
                  <p class="eyebrow" [style.color]="accent()">Skills</p>
                  <div class="underline-draw h-px mt-2 mb-6" [style.background]="accent() + '55'" [style.--underline-target]="'40px'"></div>
                  <div class="space-y-5">
                    @for (group of skillsCfg(section).groups; track group.id) {
                      <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6">
                        <p class="text-xs font-bold uppercase tracking-widest text-[#1c1a17]/40 w-32 shrink-0">{{ group.label }}</p>
                        <p class="font-georgia text-base text-[#1c1a17]/80">
                          @for (item of group.items; track item.name; let last = $last) {{{ item.name }}{{ last ? '' : ' · ' }}}
                        </p>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('experience') {
                <div class="max-w-xl mx-auto">
                  <p class="eyebrow" [style.color]="accent()">Experience</p>
                  <div class="underline-draw h-px mt-2 mb-8" [style.background]="accent() + '55'" [style.--underline-target]="'40px'"></div>
                  <div class="space-y-9">
                    @for (item of experienceCfg(section).items; track $index) {
                      <div class="grid sm:grid-cols-[140px_1fr] gap-2 sm:gap-6" [appReveal]="$index * 90">
                        <p class="text-xs font-georgia italic text-[#1c1a17]/45">{{ item.startDate }} — {{ item.current ? 'Present' : item.endDate }}</p>
                        <div>
                          <p class="font-georgia text-lg">{{ item.role }}</p>
                          <p class="text-xs font-bold uppercase tracking-widest mt-0.5" [style.color]="accent()">{{ item.company }}</p>
                          <ul class="mt-3 space-y-1.5">
                            @for (b of item.bullets; track $index) {
                              <li class="text-sm text-[#1c1a17]/70 leading-relaxed">{{ b }}</li>
                            }
                          </ul>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('projects') {
                <div class="max-w-2xl mx-auto">
                  <p class="eyebrow" [style.color]="accent()">Selected Work</p>
                  <div class="underline-draw h-px mt-2 mb-8" [style.background]="accent() + '55'" [style.--underline-target]="'40px'"></div>
                  <div class="grid sm:grid-cols-2 gap-x-8 gap-y-12">
                    @for (item of projectsCfg(section).items; track $index) {
                      <div class="group" [appReveal]="$index * 90">
                        @if (item.imageUrl) {
                          <div class="overflow-hidden mb-4 border" [style.border-color]="accent() + '33'">
                            <img [src]="resolveMediaUrl(item.imageUrl)" alt="" class="w-full aspect-[4/3] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]">
                          </div>
                        }
                        <p class="font-georgia text-lg">{{ item.title }}</p>
                        <p class="text-sm text-[#1c1a17]/60 mt-1 leading-relaxed font-georgia italic" [innerHTML]="item.description"></p>
                        <div class="flex items-center gap-4 mt-2">
                          @if (item.url) { <a [href]="normalizeUrl(item.url)" class="text-[11px] font-bold uppercase tracking-widest" [style.color]="accent()">View ↗</a> }
                          @if (item.githubUrl) { <a [href]="normalizeUrl(item.githubUrl)" class="text-[11px] font-bold uppercase tracking-widest text-[#1c1a17]/40">Code ↗</a> }
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('education') {
                <div class="max-w-xl mx-auto">
                  <p class="eyebrow" [style.color]="accent()">Education</p>
                  <div class="underline-draw h-px mt-2 mb-6" [style.background]="accent() + '55'" [style.--underline-target]="'40px'"></div>
                  <div class="space-y-3">
                    @for (item of educationCfg(section).items; track $index) {
                      <div class="flex items-baseline justify-between gap-4">
                        <p class="font-georgia text-base">{{ item.institution }} <span class="text-[#1c1a17]/50 text-sm">— {{ item.degree }}, {{ item.field }}</span></p>
                        <p class="text-xs text-[#1c1a17]/40 whitespace-nowrap">{{ item.startDate }}–{{ item.endDate }}</p>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('testimonials') {
                <div class="max-w-2xl mx-auto">
                  <p class="eyebrow text-center" [style.color]="accent()">Testimonials</p>
                  <div class="underline-draw h-px mt-2 mb-10 mx-auto" [style.background]="accent() + '55'" [style.--underline-target]="'40px'"></div>
                  <div class="space-y-12">
                    @for (item of testimonialsCfg(section).items; track $index) {
                      <div class="text-center" [appReveal]="$index * 100">
                        <p class="font-georgia text-4xl leading-none mb-3" [style.color]="accent() + '80'" aria-hidden="true">❝</p>
                        <p class="font-georgia italic text-xl leading-relaxed">{{ item.quote }}</p>
                        <p class="text-xs font-bold uppercase tracking-widest mt-5 text-[#1c1a17]/50">{{ item.author }} · {{ item.role }}</p>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('contact') {
                <div class="text-center max-w-xl mx-auto">
                  <p class="eyebrow" [style.color]="accent()">Contact</p>
                  <p class="font-georgia text-3xl mt-4">Let's talk</p>
                  <div class="underline-draw h-px mx-auto mt-5 mb-7" [style.background]="accent()" [style.--underline-target]="'64px'"></div>
                  <div class="flex items-center justify-center gap-6 flex-wrap text-sm">
                    @if (contactCfg(section).showEmail && portfolio().email) {
                      <a [href]="'mailto:' + portfolio().email" class="font-georgia italic text-lg" [style.color]="accent()">{{ portfolio().email }}</a>
                    }
                    @if (contactCfg(section).showPhone && portfolio().phone) {
                      <span class="text-[#1c1a17]/60">{{ portfolio().phone }}</span>
                    }
                  </div>
                  @if (contactCfg(section).showSocial && links().length) {
                    <div class="flex items-center justify-center gap-5 mt-6">
                      @for (l of links(); track l.key) {
                        <a [href]="l.url" class="text-[11px] font-bold uppercase tracking-widest text-[#1c1a17]/40 hover:text-[#1c1a17] transition-colors">{{ l.label }}</a>
                      }
                    </div>
                  }
                </div>
              }
            }
          </div>
        }

        <footer class="mt-12 pt-8 border-t border-[#1c1a17]/10 text-center text-[11px] font-bold uppercase tracking-widest text-[#1c1a17]/40">
          © {{ year }} {{ portfolio().displayName || portfolio().username }}
        </footer>
      </div>
    </div>
  `,
  styles: [`.eyebrow { @apply text-[11px] font-bold uppercase tracking-[0.2em]; }`],
})
export class LumenThemeComponent {
  portfolio = input.required<PortfolioData>();
  editable = input(false);

  readonly year = new Date().getFullYear();

  sections(): PortfolioSection[] { return visibleSections(this.portfolio()); }
  accent(): string { return this.portfolio().theme.accentColor || '#a6812c'; }
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
