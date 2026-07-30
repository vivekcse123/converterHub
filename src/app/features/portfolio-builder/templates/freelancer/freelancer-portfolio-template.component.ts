import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioData, PortfolioSection, AboutConfig, ContactConfig, EducationConfig, ExperienceConfig, HeroConfig, ProjectsConfig, SkillsConfig, TestimonialsConfig } from '../../models/portfolio.model';
import { FONT_STACKS, RADIUS_VALUES, initialsOf, layoutMaxWidthClass, visibleSections } from '../shared/portfolio-template-helpers';

@Component({
  selector: 'app-freelancer-portfolio-template',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host { display: block; }
    .p-card, .p-btn, .p-img { border-radius: var(--p-radius); }
    .p-avatar { border-radius: 9999px; }
  `],
  template: `
    <div class="min-h-full w-full" [style.font-family]="fontStack()" [style.--p-radius]="radiusValue()" [style.--p-accent]="accent()"
         [class]="mode() === 'dark' ? 'bg-[#171310] text-amber-50' : 'bg-[#fffaf3] text-slate-900'">

      <div class="mx-auto px-6 sm:px-10 py-16" [class]="maxW()">

        @if (hero(); as h) {
          <section class="flex flex-col items-center text-center mb-20">
            @if (h.config.photoUrl) {
              <img [src]="h.config.photoUrl" alt="" class="p-avatar w-32 h-32 object-cover shadow-xl mb-6" [style.border]="'4px solid ' + accent()" />
            } @else {
              <div class="p-avatar w-32 h-32 flex items-center justify-center text-4xl font-extrabold text-white shadow-xl mb-6" [style.background]="accent()">{{ initials() }}</div>
            }
            <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight">{{ h.config.headline || portfolio().displayName || portfolio().username }}</h1>
            @if (h.config.subheadline) {
              <p class="text-lg mt-3 font-semibold max-w-xl" [style.color]="accent()">{{ h.config.subheadline }}</p>
            }
            @if (portfolio().location) { <p class="text-sm mt-2 opacity-60">📍 {{ portfolio().location }}</p> }

            <div class="flex items-center justify-center gap-3 mt-8 flex-wrap">
              @if (h.config.ctaLabel && h.config.ctaUrl) {
                <a [href]="h.config.ctaUrl" target="_blank" rel="noopener noreferrer"
                   class="p-btn inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white shadow-lg hover:opacity-90 transition"
                   [style.background]="accent()">{{ h.config.ctaLabel }}</a>
              }
              @if (h.config.resumeCtaEnabled && portfolio().pinnedResumeId) {
                <a [href]="'/r/' + portfolio().pinnedResumeId" target="_blank" rel="noopener noreferrer"
                   class="p-btn inline-flex items-center gap-2 px-6 py-3 text-sm font-bold border-2 transition"
                   [class]="mode() === 'dark' ? 'border-amber-100/20' : 'border-slate-900/10 bg-white'">📄 Resume</a>
              }
            </div>
            @if (socialLinks().length) {
              <div class="flex items-center justify-center gap-3 mt-5">
                @for (link of socialLinks(); track link.key) {
                  <a [href]="link.url" target="_blank" rel="noopener noreferrer"
                     class="w-10 h-10 flex items-center justify-center p-btn border transition"
                     [class]="mode() === 'dark' ? 'border-amber-100/15 hover:bg-white/5' : 'border-slate-900/10 hover:bg-white'">{{ link.icon }}</a>
                }
              </div>
            }
          </section>
        }

        @for (section of rest(); track section.id) {
          <section class="mb-16">
            @switch (section.type) {
              @case ('about') {
                <div class="p-card p-8 text-center max-w-2xl mx-auto" [class]="mode() === 'dark' ? 'bg-white/5' : 'bg-white shadow-sm'">
                  <p class="text-lg leading-relaxed opacity-90">{{ aboutConfig(section).body }}</p>
                </div>
              }
              @case ('skills') {
                <h2 class="text-xs font-bold uppercase tracking-widest mb-5 text-center opacity-60">What I do</h2>
                <div class="flex flex-wrap justify-center gap-2.5">
                  @for (group of skillsConfig(section).groups; track group.id) {
                    @for (item of group.items; track item.name) {
                      <span class="p-btn px-4 py-2 text-sm font-semibold" [class]="mode() === 'dark' ? 'bg-white/10' : 'bg-white shadow-sm'">{{ item.name }}</span>
                    }
                  }
                </div>
              }
              @case ('testimonials') {
                <h2 class="text-xs font-bold uppercase tracking-widest mb-6 text-center opacity-60">Kind words</h2>
                <div class="grid sm:grid-cols-2 gap-6">
                  @for (t of testimonialsConfig(section).items; track $index) {
                    <div class="p-card p-6" [class]="mode() === 'dark' ? 'bg-white/5' : 'bg-white shadow-sm'">
                      <p class="text-3xl leading-none mb-2" [style.color]="accent()">&ldquo;</p>
                      <p class="text-base leading-relaxed opacity-90">{{ t.quote }}</p>
                      <div class="flex items-center gap-3 mt-5">
                        @if (t.avatarUrl) { <img [src]="t.avatarUrl" alt="" class="p-avatar w-10 h-10 object-cover" /> }
                        @else { <div class="p-avatar w-10 h-10 flex items-center justify-center text-xs font-bold text-white" [style.background]="accent()">{{ initialsOf(t.author) }}</div> }
                        <div><p class="text-sm font-bold">{{ t.author }}</p><p class="text-xs opacity-50">{{ t.role }}</p></div>
                      </div>
                    </div>
                  }
                </div>
              }
              @case ('experience') {
                <h2 class="text-xs font-bold uppercase tracking-widest mb-5 text-center opacity-60">Experience</h2>
                <div class="space-y-5 max-w-2xl mx-auto">
                  @for (item of experienceConfig(section).items; track item.id) {
                    <div class="p-card p-5" [class]="mode() === 'dark' ? 'bg-white/5' : 'bg-white shadow-sm'">
                      <div class="flex flex-wrap items-baseline justify-between gap-2">
                        <p class="font-bold">{{ item.role }} · {{ item.company }}</p>
                        <p class="text-xs opacity-50">{{ item.startDate }} – {{ item.current ? 'Now' : item.endDate }}</p>
                      </div>
                      @if (item.bullets.length) {
                        <ul class="mt-2 space-y-1">
                          @for (b of item.bullets; track $index) { <li class="text-sm opacity-80">• {{ b }}</li> }
                        </ul>
                      }
                    </div>
                  }
                </div>
              }
              @case ('projects') {
                <h2 class="text-xs font-bold uppercase tracking-widest mb-6 text-center opacity-60">Selected Projects</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  @for (proj of projectsConfig(section).items; track $index) {
                    <div class="p-card overflow-hidden" [class]="mode() === 'dark' ? 'bg-white/5' : 'bg-white shadow-sm'">
                      @if (proj.imageUrl) {
                        <img [src]="proj.imageUrl" alt="" class="h-40 w-full object-cover" />
                      } @else {
                        <div class="h-32 flex items-center justify-center text-3xl font-extrabold opacity-20" [style.background]="mode() === 'dark' ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.03)'">{{ proj.title ? proj.title.charAt(0) : '?' }}</div>
                      }
                      <div class="p-5">
                        <h3 class="font-bold">{{ proj.title }}</h3>
                        @if (proj.description) { <p class="text-sm opacity-70 mt-1 line-clamp-2">{{ proj.description }}</p> }
                        @if (proj.url) { <a [href]="proj.url" target="_blank" rel="noopener noreferrer" class="inline-block mt-3 text-sm font-bold" [style.color]="accent()">View project →</a> }
                      </div>
                    </div>
                  }
                </div>
              }
              @case ('education') {
                <h2 class="text-xs font-bold uppercase tracking-widest mb-5 text-center opacity-60">Education</h2>
                <div class="space-y-3 max-w-2xl mx-auto text-center">
                  @for (item of educationConfig(section).items; track $index) {
                    <p class="text-sm"><span class="font-bold">{{ item.degree }}</span> — {{ item.institution }} <span class="opacity-50">({{ item.startDate }}–{{ item.endDate }})</span></p>
                  }
                </div>
              }
              @case ('contact') {
                <div class="p-card p-10 text-center" [class]="mode() === 'dark' ? 'bg-white/5' : 'bg-white shadow-sm'">
                  <h2 class="text-2xl font-extrabold mb-3">{{ contactConfig(section).ctaLabel || "Let's build something great" }}</h2>
                  <div class="flex items-center justify-center gap-4 flex-wrap text-sm mt-2">
                    @if (contactConfig(section).showEmail && portfolio().email) {
                      <a [href]="'mailto:' + portfolio().email" class="p-btn inline-block px-5 py-2.5 text-white font-bold" [style.background]="accent()">✉️ {{ portfolio().email }}</a>
                    }
                    @if (contactConfig(section).showPhone && portfolio().phone) {
                      <a [href]="'tel:' + portfolio().phone" class="font-semibold hover:underline" [style.color]="accent()">📱 {{ portfolio().phone }}</a>
                    }
                  </div>
                </div>
              }
            }
          </section>
        }
      </div>
    </div>
  `,
})
export class FreelancerPortfolioTemplateComponent {
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

  readonly socialLinks = computed(() => {
    const s = this.portfolio().social ?? {};
    const entries: { key: string; url: string; icon: string }[] = [];
    if (s.linkedin) entries.push({ key: 'linkedin', url: s.linkedin, icon: '💼' });
    if (s.website) entries.push({ key: 'website', url: s.website, icon: '🌐' });
    if (s.twitter) entries.push({ key: 'twitter', url: s.twitter, icon: '🐦' });
    if (s.github) entries.push({ key: 'github', url: s.github, icon: '🐙' });
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
