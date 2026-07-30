import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioData, PortfolioSection, AboutConfig, ContactConfig, EducationConfig, ExperienceConfig, HeroConfig, ProjectsConfig, SkillsConfig, TestimonialsConfig } from '../../models/portfolio.model';
import { FONT_STACKS, RADIUS_VALUES, initialsOf, layoutMaxWidthClass, projectGradient, visibleSections } from '../shared/portfolio-template-helpers';

@Component({
  selector: 'app-minimal-portfolio-template',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host { display: block; }
    .p-card, .p-pill, .p-btn, .p-img { border-radius: var(--p-radius); }
    .p-avatar { border-radius: 9999px; }
  `],
  template: `
    <div class="min-h-full w-full" [style.font-family]="fontStack()" [style.--p-radius]="radiusValue()" [style.--p-accent]="accent()"
         [class]="mode() === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'">

      <div class="mx-auto px-6 sm:px-10 py-16" [class]="maxW()">

        @if (hero(); as h) {
          <section class="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-16">
            @if (h.config.photoUrl) {
              <img [src]="h.config.photoUrl" alt="" class="p-avatar w-28 h-28 object-cover shrink-0 shadow-lg" />
            } @else {
              <div class="p-avatar w-28 h-28 shrink-0 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg"
                   [style.background]="accent()">
                {{ initials() }}
              </div>
            }
            <div class="flex-1 text-center sm:text-left">
              <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">{{ h.config.headline || portfolio().displayName || portfolio().username }}</h1>
              @if (h.config.subheadline) {
                <p class="text-lg mt-2 font-medium" [style.color]="accent()">{{ h.config.subheadline }}</p>
              }
              @if (portfolio().location) {
                <p class="text-sm mt-2 opacity-60">📍 {{ portfolio().location }}</p>
              }
              <div class="flex items-center justify-center sm:justify-start gap-3 mt-6 flex-wrap">
                @if (h.config.ctaLabel && h.config.ctaUrl) {
                  <a [href]="h.config.ctaUrl" target="_blank" rel="noopener noreferrer"
                     class="p-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:opacity-90 transition"
                     [style.background]="accent()">{{ h.config.ctaLabel }}</a>
                }
                @if (h.config.resumeCtaEnabled && portfolio().pinnedResumeId) {
                  <a [href]="'/r/' + portfolio().pinnedResumeId" target="_blank" rel="noopener noreferrer"
                     class="p-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold border transition"
                     [class]="mode() === 'dark' ? 'border-white/15 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'">
                    📄 Download Resume
                  </a>
                }
                @for (link of socialLinks(); track link.key) {
                  <a [href]="link.url" target="_blank" rel="noopener noreferrer"
                     class="w-10 h-10 flex items-center justify-center p-btn border transition"
                     [class]="mode() === 'dark' ? 'border-white/15 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'">
                    {{ link.icon }}
                  </a>
                }
              </div>
            </div>
          </section>
        }

        @for (section of rest(); track section.id) {
          <section class="mb-14">
            @switch (section.type) {
              @case ('about') {
                <h2 class="text-xs font-bold uppercase tracking-widest mb-4 opacity-60">About</h2>
                <p class="text-base leading-relaxed max-w-3xl opacity-90">{{ aboutConfig(section).body }}</p>
                @if (aboutConfig(section).highlights.length) {
                  <ul class="grid sm:grid-cols-2 gap-2 mt-4">
                    @for (hl of aboutConfig(section).highlights; track hl) {
                      <li class="text-sm flex items-start gap-2 opacity-80"><span [style.color]="accent()">✓</span> {{ hl }}</li>
                    }
                  </ul>
                }
              }
              @case ('skills') {
                <h2 class="text-xs font-bold uppercase tracking-widest mb-5 opacity-60">Skills</h2>
                <div class="space-y-5">
                  @for (group of skillsConfig(section).groups; track group.label) {
                    <div>
                      @if (skillsConfig(section).groups.length > 1) {
                        <p class="text-xs font-semibold opacity-50 mb-2">{{ group.label }}</p>
                      }
                      <div class="flex flex-wrap gap-2">
                        @for (item of group.items; track item.name) {
                          <span class="p-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold border"
                                [class]="mode() === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'">
                            {{ item.name }}
                            @if (item.level) { <span class="opacity-50 text-[10px] capitalize">{{ item.level }}</span> }
                          </span>
                        }
                      </div>
                    </div>
                  }
                </div>
              }
              @case ('experience') {
                <h2 class="text-xs font-bold uppercase tracking-widest mb-5 opacity-60">Experience</h2>
                <div class="space-y-6">
                  @for (item of experienceConfig(section).items; track item.company + item.role) {
                    <div class="p-card border p-5" [class]="mode() === 'dark' ? 'border-white/10' : 'border-slate-200'">
                      <div class="flex flex-wrap items-baseline justify-between gap-2">
                        <p class="font-bold">{{ item.role }} <span class="font-normal opacity-60">· {{ item.company }}</span></p>
                        <p class="text-xs opacity-50 shrink-0">{{ item.startDate }} — {{ item.current ? 'Present' : item.endDate }}</p>
                      </div>
                      @if (item.bullets.length) {
                        <ul class="mt-3 space-y-1.5">
                          @for (b of item.bullets; track b) {
                            <li class="text-sm opacity-80 flex items-start gap-2"><span [style.color]="accent()">–</span> {{ b }}</li>
                          }
                        </ul>
                      }
                    </div>
                  }
                </div>
              }
              @case ('projects') {
                <h2 class="text-xs font-bold uppercase tracking-widest mb-5 opacity-60">Projects</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  @for (proj of projectsConfig(section).items; track proj.title; let i = $index) {
                    <div class="p-card overflow-hidden border transition hover:-translate-y-0.5 flex flex-col"
                         [class]="mode() === 'dark' ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-white'">
                      @if (proj.imageUrl) {
                        <img [src]="proj.imageUrl" alt="" class="h-36 w-full object-cover" />
                      } @else {
                        <div class="h-28 flex items-center justify-center bg-gradient-to-br {{ projectGrad(i) }}">
                          @if (proj.featured) {
                            <span class="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full bg-amber-400 text-amber-900">⭐ Featured</span>
                          }
                          <span class="text-3xl text-white/70">{{ proj.title ? proj.title.charAt(0).toUpperCase() : '📁' }}</span>
                        </div>
                      }
                      <div class="p-5 flex flex-col flex-1 gap-2">
                        <h3 class="font-bold text-sm">{{ proj.title }}</h3>
                        @if (proj.description) { <p class="text-xs opacity-70 leading-relaxed line-clamp-3">{{ proj.description }}</p> }
                        @if (proj.tags.length) {
                          <div class="flex flex-wrap gap-1.5 mt-1">
                            @for (t of proj.tags; track t) {
                              <span class="text-[10px] px-2 py-0.5 rounded-full opacity-70" [class]="mode() === 'dark' ? 'bg-white/10' : 'bg-slate-100'">{{ t }}</span>
                            }
                          </div>
                        }
                        <div class="flex items-center gap-3 mt-auto pt-3 border-t" [class]="mode() === 'dark' ? 'border-white/10' : 'border-slate-100'">
                          @if (proj.url) { <a [href]="proj.url" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold hover:underline" [style.color]="accent()">Live Demo</a> }
                          @if (proj.githubUrl) { <a [href]="proj.githubUrl" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold opacity-70 hover:opacity-100">GitHub</a> }
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }
              @case ('education') {
                <h2 class="text-xs font-bold uppercase tracking-widest mb-5 opacity-60">Education</h2>
                <div class="space-y-4">
                  @for (item of educationConfig(section).items; track item.institution) {
                    <div class="flex flex-wrap items-baseline justify-between gap-2">
                      <p class="font-bold text-sm">{{ item.degree }}<span class="font-normal opacity-60"> · {{ item.field }}</span></p>
                      <p class="text-xs opacity-50">{{ item.startDate }} — {{ item.endDate }}</p>
                    </div>
                    <p class="text-sm opacity-70 -mt-3">{{ item.institution }}</p>
                  }
                </div>
              }
              @case ('testimonials') {
                <h2 class="text-xs font-bold uppercase tracking-widest mb-5 opacity-60">Testimonials</h2>
                <div class="grid sm:grid-cols-2 gap-5">
                  @for (t of testimonialsConfig(section).items; track t.author) {
                    <div class="p-card border p-5" [class]="mode() === 'dark' ? 'border-white/10' : 'border-slate-200'">
                      <p class="text-sm italic opacity-90 leading-relaxed">&ldquo;{{ t.quote }}&rdquo;</p>
                      <div class="flex items-center gap-3 mt-4">
                        @if (t.avatarUrl) {
                          <img [src]="t.avatarUrl" alt="" class="p-avatar w-9 h-9 object-cover" />
                        } @else {
                          <div class="p-avatar w-9 h-9 flex items-center justify-center text-xs font-bold text-white" [style.background]="accent()">{{ initialsOf(t.author) }}</div>
                        }
                        <div>
                          <p class="text-xs font-bold">{{ t.author }}</p>
                          <p class="text-[11px] opacity-50">{{ t.role }}</p>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }
              @case ('contact') {
                <div class="p-card border p-8 text-center" [class]="mode() === 'dark' ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'">
                  <h2 class="text-xl font-extrabold mb-2">{{ contactConfig(section).ctaLabel || 'Get in touch' }}</h2>
                  <div class="flex items-center justify-center gap-4 mt-4 flex-wrap text-sm">
                    @if (contactConfig(section).showEmail && portfolio().email) {
                      <a [href]="'mailto:' + portfolio().email" class="font-semibold hover:underline" [style.color]="accent()">✉️ {{ portfolio().email }}</a>
                    }
                    @if (contactConfig(section).showPhone && portfolio().phone) {
                      <a [href]="'tel:' + portfolio().phone" class="font-semibold hover:underline" [style.color]="accent()">📱 {{ portfolio().phone }}</a>
                    }
                  </div>
                  @if (contactConfig(section).showSocial && socialLinks().length) {
                    <div class="flex items-center justify-center gap-3 mt-5 flex-wrap">
                      @for (link of socialLinks(); track link.key) {
                        <a [href]="link.url" target="_blank" rel="noopener noreferrer"
                           class="w-10 h-10 flex items-center justify-center p-btn border transition"
                           [class]="mode() === 'dark' ? 'border-white/15 hover:bg-white/5' : 'border-slate-200 hover:bg-white'">{{ link.icon }}</a>
                      }
                    </div>
                  }
                </div>
              }
            }
          </section>
        }

      </div>
    </div>
  `,
})
export class MinimalPortfolioTemplateComponent {
  readonly portfolio = input.required<PortfolioData>();

  readonly theme = computed(() => this.portfolio().theme);
  readonly mode = computed(() => this.theme().mode);
  readonly accent = computed(() => this.theme().accentColor);
  readonly fontStack = computed(() => FONT_STACKS[this.theme().fontFamily]);
  readonly radiusValue = computed(() => RADIUS_VALUES[this.theme().radius]);
  readonly maxW = computed(() => layoutMaxWidthClass(this.theme().layoutWidth));

  readonly visible = computed(() => visibleSections(this.portfolio().sections));
  readonly hero = computed(() => this.visible().find(s => s.type === 'hero') as PortfolioSection<HeroConfig> | undefined);
  readonly rest = computed(() => this.visible().filter(s => s.type !== 'hero'));

  readonly initials = computed(() => initialsOf(this.portfolio().displayName || this.portfolio().username));
  initialsOf = initialsOf;
  projectGrad = projectGradient;

  readonly socialLinks = computed(() => {
    const s = this.portfolio().social ?? {};
    const entries: { key: string; url: string; icon: string }[] = [];
    if (s.linkedin) entries.push({ key: 'linkedin', url: s.linkedin, icon: '💼' });
    if (s.github) entries.push({ key: 'github', url: s.github, icon: '🐙' });
    if (s.twitter) entries.push({ key: 'twitter', url: s.twitter, icon: '🐦' });
    if (s.website) entries.push({ key: 'website', url: s.website, icon: '🌐' });
    if (s.youtube) entries.push({ key: 'youtube', url: s.youtube, icon: '▶️' });
    return entries;
  });

  aboutConfig(s: any): AboutConfig { return s.config; }
  skillsConfig(s: any): SkillsConfig { return s.config; }
  experienceConfig(s: any): ExperienceConfig { return s.config; }
  projectsConfig(s: any): ProjectsConfig { return s.config; }
  educationConfig(s: any): EducationConfig { return s.config; }
  testimonialsConfig(s: any): TestimonialsConfig { return s.config; }
  contactConfig(s: any): ContactConfig { return s.config; }
}
