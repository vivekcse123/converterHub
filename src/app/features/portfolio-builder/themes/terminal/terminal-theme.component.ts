import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import {
  AboutConfig, ContactConfig, EducationConfig, ExperienceConfig, HeroConfig,
  PortfolioData, PortfolioSection, ProjectsConfig, SkillsConfig, TestimonialsConfig,
} from '../../models/portfolio.model';
import { initials, normalizeUrl, socialLinks, visibleSections } from '../shared/theme-helpers';
import { resolveMediaUrl } from '../../models/portfolio.model';

@Component({
  selector: 'app-terminal-theme',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="bg-[#0b0f14] text-slate-300 min-h-full font-mono">
      <div class="mx-auto px-4 sm:px-8 py-12 sm:py-20" [class]="widthClass()">

        @for (section of sections(); track section.id; let first = $first) {
          <div class="mb-6 last:mb-0">
            @switch (section.type) {

              @case ('hero') {
                <div class="rounded-xl overflow-hidden border border-white/10 bg-[#11161d]">
                  <div class="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/10 bg-white/[0.02]">
                    <span class="w-2.5 h-2.5 rounded-full bg-red-500/70"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500/70"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></span>
                    <span class="ml-2 text-[11px] text-slate-500">~/{{ portfolio().username || 'portfolio' }}</span>
                  </div>
                  <div class="p-8 sm:p-12 text-center">
                    @if (heroCfg(section).photoUrl) {
                      <img [src]="resolveMediaUrl(heroCfg(section).photoUrl)" alt="" class="w-20 h-20 rounded-lg object-cover mx-auto mb-5 border border-white/10">
                    } @else {
                      <div class="w-20 h-20 rounded-lg mx-auto mb-5 flex items-center justify-center text-lg font-bold text-white" [style.background]="accent()">{{ initials(heroCfg(section).headline) }}</div>
                    }
                    <p class="text-xs" [style.color]="accent()">$ whoami</p>
                    <h1 class="text-3xl sm:text-5xl font-bold text-white mt-1">{{ heroCfg(section).headline || 'your_name' }}</h1>
                    <p class="mt-3 text-sm text-slate-400 max-w-md mx-auto leading-relaxed">{{ heroCfg(section).subheadline }}</p>
                    @if (heroCfg(section).ctaLabel) {
                      <a [href]="normalizeUrl(heroCfg(section).ctaUrl)" class="inline-flex items-center gap-1.5 mt-7 px-5 py-2 rounded-md text-xs font-bold border transition-colors"
                         [style.color]="accent()" [style.border-color]="accent()">
                        &gt; {{ heroCfg(section).ctaLabel }}
                      </a>
                    }
                  </div>
                </div>
              }

              @case ('about') {
                <div class="code-card">
                  <p class="comment">// about.md</p>
                  <p class="mt-2 text-sm text-slate-300 leading-relaxed whitespace-pre-line" [innerHTML]="aboutCfg(section).body"></p>
                  @if (aboutCfg(section).highlights.length) {
                    <div class="flex flex-wrap gap-2 mt-4">
                      @for (h of aboutCfg(section).highlights; track h) {
                        <span class="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">{{ h }}</span>
                      }
                    </div>
                  }
                </div>
              }

              @case ('skills') {
                <div class="code-card">
                  <p class="comment">// skills.json</p>
                  <div class="mt-2 space-y-3">
                    @for (group of skillsCfg(section).groups; track group.id) {
                      <div>
                        <p class="text-[11px] text-slate-500 mb-1">"{{ group.label }}": [</p>
                        <div class="flex flex-wrap gap-1.5 pl-4">
                          @for (item of group.items; track item.name) {
                            <span class="text-[11px] px-2 py-0.5 rounded bg-white/5 text-emerald-400">"{{ item.name }}"</span>
                          }
                        </div>
                        <p class="text-[11px] text-slate-500">]</p>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('experience') {
                <div class="code-card">
                  <p class="comment">// experience.log</p>
                  <div class="mt-3 space-y-5">
                    @for (item of experienceCfg(section).items; track $index) {
                      <div class="border-l-2 pl-4" [style.border-color]="accent()">
                        <p class="text-[11px] text-slate-500">{{ item.startDate }} → {{ item.current ? 'now' : item.endDate }}</p>
                        <p class="text-sm font-bold text-white">{{ item.role }} <span class="text-slate-500">&#64;</span> {{ item.company }}</p>
                        <ul class="mt-1.5 space-y-1">
                          @for (b of item.bullets; track $index) { <li class="text-[13px] text-slate-400">- {{ b }}</li> }
                        </ul>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('projects') {
                <div class="code-card">
                  <p class="comment">// projects/</p>
                  <div class="mt-3 grid sm:grid-cols-2 gap-3">
                    @for (item of projectsCfg(section).items; track $index) {
                      <div class="rounded-lg border border-white/10 bg-black/20 overflow-hidden">
                        @if (item.imageUrl) { <img [src]="resolveMediaUrl(item.imageUrl)" alt="" class="w-full aspect-[16/9] object-cover opacity-90"> }
                        <div class="p-3">
                          <p class="text-sm font-bold text-white">{{ item.title }}</p>
                          <p class="text-[12px] text-slate-400 mt-1 leading-relaxed" [innerHTML]="item.description"></p>
                          <div class="flex flex-wrap gap-1 mt-2">
                            @for (t of item.tags; track t) { <span class="text-[10px] px-1.5 py-0.5 rounded bg-white/5" [style.color]="accent()">{{ t }}</span> }
                          </div>
                          <div class="flex items-center gap-3 mt-2">
                            @if (item.url) { <a [href]="normalizeUrl(item.url)" class="text-[11px] font-bold text-slate-300">./demo</a> }
                            @if (item.githubUrl) { <a [href]="normalizeUrl(item.githubUrl)" class="text-[11px] font-bold text-slate-500">./source</a> }
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('education') {
                <div class="code-card">
                  <p class="comment">// education.yml</p>
                  <div class="mt-2 space-y-2">
                    @for (item of educationCfg(section).items; track $index) {
                      <p class="text-[13px] text-slate-400"><span class="text-slate-200 font-bold">{{ item.institution }}</span> — {{ item.degree }}, {{ item.field }} <span class="text-slate-600">({{ item.startDate }}–{{ item.endDate }})</span></p>
                    }
                  </div>
                </div>
              }

              @case ('testimonials') {
                <div class="code-card">
                  <p class="comment">// reviews.txt</p>
                  <div class="mt-3 grid sm:grid-cols-2 gap-3">
                    @for (item of testimonialsCfg(section).items; track $index) {
                      <div class="rounded-lg border border-white/10 bg-black/20 p-3">
                        <p class="text-[13px] text-slate-300 italic">"{{ item.quote }}"</p>
                        <p class="text-[11px] text-slate-500 mt-2">— {{ item.author }}, {{ item.role }}</p>
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('contact') {
                <div class="code-card text-center">
                  <p class="comment">// contact.sh</p>
                  <p class="mt-3 text-xl font-bold text-white">$ ./get_in_touch</p>
                  <div class="flex items-center justify-center gap-4 mt-4 flex-wrap text-sm">
                    @if (contactCfg(section).showEmail && portfolio().email) {
                      <a [href]="'mailto:' + portfolio().email" class="font-semibold" [style.color]="accent()">{{ portfolio().email }}</a>
                    }
                    @if (contactCfg(section).showPhone && portfolio().phone) { <span class="text-slate-400">{{ portfolio().phone }}</span> }
                  </div>
                  @if (contactCfg(section).showSocial && links().length) {
                    <div class="flex items-center justify-center gap-4 mt-3">
                      @for (l of links(); track l.key) { <a [href]="l.url" class="text-xs text-slate-500 hover:text-slate-200 transition-colors">{{ l.label }}</a> }
                    </div>
                  }
                </div>
              }
            }
          </div>
        }

        <footer class="mt-8 pt-6 border-t border-white/5 text-center text-[11px] text-slate-600">
          # © {{ year }} {{ portfolio().displayName || portfolio().username }}
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .comment { @apply text-[11px] text-slate-600; }
    .code-card { @apply rounded-xl border border-white/10 bg-[#11161d] p-6; }
  `],
})
export class TerminalThemeComponent {
  portfolio = input.required<PortfolioData>();
  editable = input(false);

  readonly year = new Date().getFullYear();

  sections(): PortfolioSection[] { return visibleSections(this.portfolio()); }
  accent(): string { return this.portfolio().theme.accentColor || '#22d3ee'; }
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
