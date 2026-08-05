import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import {
  AboutConfig, ContactConfig, EducationConfig, ExperienceConfig, HeroConfig,
  PortfolioData, PortfolioSection, ProjectsConfig, SkillsConfig, TestimonialsConfig,
} from '../../models/portfolio.model';
import { FONT_CLASS, initials, normalizeUrl, socialLinks, visibleSections } from '../shared/theme-helpers';
import { resolveMediaUrl } from '../../models/portfolio.model';

@Component({
  selector: 'app-studio-theme',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="relative bg-[#fdfaf6] dark:bg-[#161213] text-slate-900 dark:text-slate-100 min-h-full overflow-hidden" [class]="fontClass()">
      <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-30" [style.background]="accent()"></div>
        <div class="absolute bottom-0 -left-24 h-72 w-72 rounded-full blur-3xl opacity-20 bg-orange-400"></div>
      </div>

      <div class="relative mx-auto px-6 sm:px-10 py-16 sm:py-24" [class]="widthClass()">
        @for (section of sections(); track section.id) {
          <div class="mb-14 last:mb-0">
            @switch (section.type) {

              @case ('hero') {
                <div class="grid sm:grid-cols-[auto_1fr] gap-8 items-center">
                  @if (heroCfg(section).photoUrl) {
                    <img [src]="resolveMediaUrl(heroCfg(section).photoUrl)" alt="" class="w-28 h-28 sm:w-36 sm:h-36 rounded-[28px] object-cover rotate-[-3deg] shadow-xl">
                  } @else {
                    <div class="w-28 h-28 sm:w-36 sm:h-36 rounded-[28px] flex items-center justify-center text-3xl font-black text-white rotate-[-3deg] shadow-xl" [style.background]="accent()">{{ initials(heroCfg(section).headline) }}</div>
                  }
                  <div>
                    <h1 class="text-4xl sm:text-6xl font-black tracking-tight leading-[0.95]">{{ heroCfg(section).headline || 'Your Name' }}</h1>
                    <p class="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">{{ heroCfg(section).subheadline }}</p>
                    @if (heroCfg(section).ctaLabel) {
                      <a [href]="normalizeUrl(heroCfg(section).ctaUrl)" class="inline-block mt-6 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-transform hover:-rotate-2" [style.background]="accent()">
                        {{ heroCfg(section).ctaLabel }} →
                      </a>
                    }
                  </div>
                </div>
              }

              @case ('about') {
                <div>
                  <h2 class="tag" [style.background]="accentTint()" [style.color]="accent()">About</h2>
                  <p class="mt-4 text-xl leading-relaxed font-medium whitespace-pre-line" [innerHTML]="aboutCfg(section).body"></p>
                  @if (aboutCfg(section).highlights.length) {
                    <div class="flex flex-wrap gap-2 mt-5">
                      @for (h of aboutCfg(section).highlights; track h) {
                        <span class="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900">{{ h }}</span>
                      }
                    </div>
                  }
                </div>
              }

              @case ('skills') {
                <div>
                  <h2 class="tag" [style.background]="accentTint()" [style.color]="accent()">Skills</h2>
                  <div class="mt-4 grid sm:grid-cols-2 gap-5">
                    @for (group of skillsCfg(section).groups; track group.id) {
                      <div class="rounded-2xl border-2 border-slate-900 dark:border-white p-4">
                        <p class="text-xs font-black uppercase mb-2">{{ group.label }}</p>
                        <div class="flex flex-wrap gap-1.5">
                          @for (item of group.items; track item.name) {
                            <span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10">{{ item.name }}</span>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('experience') {
                <div>
                  <h2 class="tag" [style.background]="accentTint()" [style.color]="accent()">Experience</h2>
                  <div class="mt-4 space-y-6">
                    @for (item of experienceCfg(section).items; track $index) {
                      <div class="grid sm:grid-cols-[140px_1fr] gap-3">
                        <p class="text-xs font-bold text-slate-400 pt-1">{{ item.startDate }} – {{ item.current ? 'Now' : item.endDate }}</p>
                        <div>
                          <p class="text-lg font-black">{{ item.role }} <span class="font-medium text-slate-500">— {{ item.company }}</span></p>
                          <ul class="mt-1.5 space-y-1">
                            @for (b of item.bullets; track $index) { <li class="text-sm text-slate-600 dark:text-slate-400">{{ b }}</li> }
                          </ul>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('projects') {
                <div>
                  <h2 class="tag" [style.background]="accentTint()" [style.color]="accent()">Projects</h2>
                  <div class="mt-4 grid sm:grid-cols-2 gap-5">
                    @for (item of projectsCfg(section).items; track $index) {
                      <div class="rounded-[24px] overflow-hidden border-2 border-slate-900 dark:border-white bg-white dark:bg-white/5">
                        @if (item.imageUrl) { <img [src]="resolveMediaUrl(item.imageUrl)" alt="" class="w-full aspect-[16/9] object-cover border-b-2 border-slate-900 dark:border-white"> }
                        <div class="p-4">
                          <p class="font-black text-base">{{ item.title }} @if (item.featured) { <span [style.color]="accent()">★</span> }</p>
                          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1" [innerHTML]="item.description"></p>
                          <div class="flex items-center gap-3 mt-2">
                            @if (item.url) { <a [href]="normalizeUrl(item.url)" class="text-xs font-bold underline">Live</a> }
                            @if (item.githubUrl) { <a [href]="normalizeUrl(item.githubUrl)" class="text-xs font-bold underline text-slate-500">Code</a> }
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('education') {
                <div>
                  <h2 class="tag" [style.background]="accentTint()" [style.color]="accent()">Education</h2>
                  <div class="mt-4 space-y-2">
                    @for (item of educationCfg(section).items; track $index) {
                      <p class="text-sm"><span class="font-black">{{ item.institution }}</span> — {{ item.degree }}, {{ item.field }} <span class="text-slate-400">({{ item.startDate }}–{{ item.endDate }})</span></p>
                    }
                  </div>
                </div>
              }

              @case ('testimonials') {
                <div>
                  <h2 class="tag" [style.background]="accentTint()" [style.color]="accent()">Testimonials</h2>
                  <div class="mt-4 grid sm:grid-cols-2 gap-5">
                    @for (item of testimonialsCfg(section).items; track $index) {
                      <div class="rounded-2xl bg-slate-900 dark:bg-white/10 text-white p-5">
                        <p class="text-sm leading-relaxed">"{{ item.quote }}"</p>
                        <p class="text-xs font-bold mt-3" [style.color]="accent()">{{ item.author }} · {{ item.role }}</p>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('contact') {
                <div class="rounded-[28px] p-10 text-center" [style.background]="accent()">
                  <p class="text-2xl sm:text-3xl font-black text-white">Let's create something great</p>
                  <div class="flex items-center justify-center gap-4 mt-5 flex-wrap text-sm">
                    @if (contactCfg(section).showEmail && portfolio().email) { <a [href]="'mailto:' + portfolio().email" class="font-bold text-white underline">{{ portfolio().email }}</a> }
                    @if (contactCfg(section).showPhone && portfolio().phone) { <span class="text-white/80">{{ portfolio().phone }}</span> }
                  </div>
                  @if (contactCfg(section).showSocial && links().length) {
                    <div class="flex items-center justify-center gap-4 mt-3">
                      @for (l of links(); track l.key) { <a [href]="l.url" class="text-xs font-bold text-white/80 hover:text-white">{{ l.label }}</a> }
                    </div>
                  }
                </div>
              }
            }
          </div>
        }

        <footer class="mt-8 pt-6 border-t-2 border-slate-900 dark:border-white text-center text-xs font-bold">
          © {{ year }} {{ portfolio().displayName || portfolio().username }}
        </footer>
      </div>
    </div>
  `,
  styles: [`.tag { @apply inline-block text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg; }`],
})
export class StudioThemeComponent {
  portfolio = input.required<PortfolioData>();
  editable = input(false);

  readonly year = new Date().getFullYear();

  sections(): PortfolioSection[] { return visibleSections(this.portfolio()); }
  accent(): string { return this.portfolio().theme.accentColor || '#f97316'; }
  accentTint(): string { return this.accent() + '22'; }
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
