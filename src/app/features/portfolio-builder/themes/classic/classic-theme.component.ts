import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import {
  AboutConfig, ContactConfig, EducationConfig, ExperienceConfig, HeroConfig,
  PortfolioData, PortfolioSection, ProjectsConfig, SkillsConfig, TestimonialsConfig,
} from '../../models/portfolio.model';
import { FONT_CLASS, initials, normalizeUrl, socialLinks, visibleSections } from '../shared/theme-helpers';
import { resolveMediaUrl } from '../../models/portfolio.model';

@Component({
  selector: 'app-classic-theme',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="bg-white dark:bg-[#141414] text-slate-800 dark:text-slate-200 min-h-full" [class]="fontClass()">
      <div class="mx-auto px-6 sm:px-10 py-14 sm:py-20" [class]="widthClass()">

        @for (section of sections(); track section.id; let first = $first) {
          <div [class]="first ? 'mb-12' : 'mb-10 pt-8 border-t border-slate-200 dark:border-slate-800'">
            @switch (section.type) {

              @case ('hero') {
                <div class="flex items-center gap-6">
                  @if (heroCfg(section).photoUrl) {
                    <img [src]="resolveMediaUrl(heroCfg(section).photoUrl)" alt="" class="w-24 h-24 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0">
                  } @else {
                    <div class="w-24 h-24 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0" [style.background]="accent()">{{ initials(heroCfg(section).headline) }}</div>
                  }
                  <div>
                    <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">{{ heroCfg(section).headline || 'Your Name' }}</h1>
                    <p class="mt-1.5 text-sm sm:text-base text-slate-500 dark:text-slate-400">{{ heroCfg(section).subheadline }}</p>
                    @if (heroCfg(section).ctaLabel) {
                      <a [href]="normalizeUrl(heroCfg(section).ctaUrl)" class="inline-block mt-3 text-sm font-semibold underline underline-offset-4" [style.color]="accent()">
                        {{ heroCfg(section).ctaLabel }}
                      </a>
                    }
                  </div>
                </div>
              }

              @case ('about') {
                <div>
                  <h2 class="heading">Summary</h2>
                  <p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line" [innerHTML]="aboutCfg(section).body"></p>
                  @if (aboutCfg(section).highlights.length) {
                    <ul class="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                      @for (h of aboutCfg(section).highlights; track h) {
                        <li class="text-xs text-slate-500 dark:text-slate-400 before:content-['•'] before:mr-1.5" [style.color]="'inherit'">{{ h }}</li>
                      }
                    </ul>
                  }
                </div>
              }

              @case ('skills') {
                <div>
                  <h2 class="heading">Skills</h2>
                  <div class="mt-2 space-y-1.5">
                    @for (group of skillsCfg(section).groups; track group.id) {
                      <p class="text-sm"><span class="font-semibold">{{ group.label }}:</span> <span class="text-slate-600 dark:text-slate-400">{{ joinNames(group.items) }}</span></p>
                    }
                  </div>
                </div>
              }

              @case ('experience') {
                <div>
                  <h2 class="heading">Experience</h2>
                  <div class="mt-2 space-y-5">
                    @for (item of experienceCfg(section).items; track $index) {
                      <div>
                        <div class="flex items-baseline justify-between">
                          <p class="text-sm font-bold">{{ item.role }}, <span class="font-medium">{{ item.company }}</span></p>
                          <p class="text-xs text-slate-400 whitespace-nowrap">{{ item.startDate }} – {{ item.current ? 'Present' : item.endDate }}</p>
                        </div>
                        <ul class="mt-1 space-y-0.5">
                          @for (b of item.bullets; track $index) { <li class="text-sm text-slate-600 dark:text-slate-400 before:content-['–'] before:mr-1.5">{{ b }}</li> }
                        </ul>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('projects') {
                <div>
                  <h2 class="heading">Projects</h2>
                  <div class="mt-2 space-y-4">
                    @for (item of projectsCfg(section).items; track $index) {
                      <div class="flex gap-4">
                        @if (item.imageUrl) { <img [src]="resolveMediaUrl(item.imageUrl)" alt="" class="w-20 h-20 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"> }
                        <div>
                          <p class="text-sm font-bold">{{ item.title }}</p>
                          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5" [innerHTML]="item.description"></p>
                          <div class="flex items-center gap-3 mt-1">
                            @if (item.url) { <a [href]="normalizeUrl(item.url)" class="text-xs underline" [style.color]="accent()">Live</a> }
                            @if (item.githubUrl) { <a [href]="normalizeUrl(item.githubUrl)" class="text-xs underline text-slate-400">Source</a> }
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('education') {
                <div>
                  <h2 class="heading">Education</h2>
                  <div class="mt-2 space-y-1.5">
                    @for (item of educationCfg(section).items; track $index) {
                      <div class="flex items-baseline justify-between">
                        <p class="text-sm"><span class="font-semibold">{{ item.institution }}</span> — {{ item.degree }}, {{ item.field }}</p>
                        <p class="text-xs text-slate-400 whitespace-nowrap">{{ item.startDate }}–{{ item.endDate }}</p>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('testimonials') {
                <div>
                  <h2 class="heading">Testimonials</h2>
                  <div class="mt-2 space-y-3">
                    @for (item of testimonialsCfg(section).items; track $index) {
                      <p class="text-sm text-slate-600 dark:text-slate-400 italic">"{{ item.quote }}" <span class="not-italic font-semibold text-slate-800 dark:text-slate-200">— {{ item.author }}, {{ item.role }}</span></p>
                    }
                  </div>
                </div>
              }

              @case ('contact') {
                <div>
                  <h2 class="heading">Contact</h2>
                  <div class="mt-2 flex items-center gap-5 flex-wrap text-sm">
                    @if (contactCfg(section).showEmail && portfolio().email) { <a [href]="'mailto:' + portfolio().email" class="font-semibold underline" [style.color]="accent()">{{ portfolio().email }}</a> }
                    @if (contactCfg(section).showPhone && portfolio().phone) { <span class="text-slate-500 dark:text-slate-400">{{ portfolio().phone }}</span> }
                  </div>
                  @if (contactCfg(section).showSocial && links().length) {
                    <div class="flex items-center gap-4 mt-2">
                      @for (l of links(); track l.key) { <a [href]="l.url" class="text-xs text-slate-500 dark:text-slate-400 underline">{{ l.label }}</a> }
                    </div>
                  }
                </div>
              }
            }
          </div>
        }

        <footer class="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
          © {{ year }} {{ portfolio().displayName || portfolio().username }}
        </footer>
      </div>
    </div>
  `,
  styles: [`.heading { @apply text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500; }`],
})
export class ClassicThemeComponent {
  portfolio = input.required<PortfolioData>();
  editable = input(false);

  readonly year = new Date().getFullYear();

  sections(): PortfolioSection[] { return visibleSections(this.portfolio()); }
  accent(): string { return this.portfolio().theme.accentColor || '#1e3a8a'; }
  fontClass(): string { return FONT_CLASS[this.portfolio().theme.fontFamily] ?? 'font-sans'; }
  widthClass(): string { return this.portfolio().theme.layoutWidth === 'narrow' ? 'max-w-lg' : 'max-w-2xl'; }
  initials = initials;
  resolveMediaUrl = resolveMediaUrl;
  normalizeUrl = normalizeUrl;
  links() { return socialLinks(this.portfolio()); }
  joinNames(items: { name: string }[]): string { return items.map(i => i.name).join(', '); }

  heroCfg(s: PortfolioSection): HeroConfig { return s.config as HeroConfig; }
  aboutCfg(s: PortfolioSection): AboutConfig { return s.config as AboutConfig; }
  skillsCfg(s: PortfolioSection): SkillsConfig { return s.config as SkillsConfig; }
  experienceCfg(s: PortfolioSection): ExperienceConfig { return s.config as ExperienceConfig; }
  projectsCfg(s: PortfolioSection): ProjectsConfig { return s.config as ProjectsConfig; }
  educationCfg(s: PortfolioSection): EducationConfig { return s.config as EducationConfig; }
  testimonialsCfg(s: PortfolioSection): TestimonialsConfig { return s.config as TestimonialsConfig; }
  contactCfg(s: PortfolioSection): ContactConfig { return s.config as ContactConfig; }
}
