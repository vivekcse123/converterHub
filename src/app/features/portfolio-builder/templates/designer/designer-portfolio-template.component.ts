import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioData, PortfolioSection, AboutConfig, ContactConfig, EducationConfig, ExperienceConfig, HeroConfig, ProjectsConfig, SkillsConfig, TestimonialsConfig } from '../../models/portfolio.model';
import { FONT_STACKS, RADIUS_VALUES, initialsOf, layoutMaxWidthClass, visibleSections } from '../shared/portfolio-template-helpers';

@Component({
  selector: 'app-designer-portfolio-template',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host { display: block; }
    .p-card, .p-btn, .p-img { border-radius: var(--p-radius); }
    .p-avatar { border-radius: 9999px; }
  `],
  template: `
    <div class="min-h-full w-full" [style.font-family]="fontStack()" [style.--p-radius]="radiusValue()" [style.--p-accent]="accent()"
         [class]="mode() === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'">

      <div class="mx-auto px-6 sm:px-10 py-20" [class]="maxW()">

        @if (hero(); as h) {
          <section class="mb-24">
            <div class="flex items-center gap-4 mb-8">
              @if (h.config.photoUrl) {
                <img [src]="h.config.photoUrl" alt="" class="p-avatar w-16 h-16 object-cover" />
              } @else {
                <div class="p-avatar w-16 h-16 flex items-center justify-center text-lg font-extrabold text-white" [style.background]="accent()">{{ initials() }}</div>
              }
              <div>
                <p class="font-bold text-sm">{{ portfolio().displayName || portfolio().username }}</p>
                @if (portfolio().location) { <p class="text-xs opacity-50">{{ portfolio().location }}</p> }
              </div>
            </div>

            <h1 class="text-6xl sm:text-7xl font-extrabold tracking-tight leading-[0.95]">{{ h.config.headline || portfolio().displayName || portfolio().username }}</h1>
            @if (h.config.subheadline) {
              <p class="text-2xl mt-6 font-semibold max-w-2xl" [style.color]="accent()">{{ h.config.subheadline }}</p>
            }

            <div class="flex items-center gap-3 mt-10 flex-wrap">
              @if (h.config.ctaLabel && h.config.ctaUrl) {
                <a [href]="h.config.ctaUrl" target="_blank" rel="noopener noreferrer"
                   class="p-btn inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white shadow-lg hover:scale-[1.03] transition"
                   [style.background]="accent()">{{ h.config.ctaLabel }}</a>
              }
              @if (h.config.resumeCtaEnabled && portfolio().pinnedResumeId) {
                <a [href]="'/r/' + portfolio().pinnedResumeId" target="_blank" rel="noopener noreferrer"
                   class="p-btn inline-flex items-center gap-2 px-6 py-3 text-sm font-bold border-2 transition hover:scale-[1.03]"
                   [class]="mode() === 'dark' ? 'border-white/20' : 'border-slate-900'">Resume</a>
              }
              @for (link of socialLinks(); track link.key) {
                <a [href]="link.url" target="_blank" rel="noopener noreferrer" class="text-sm font-semibold underline underline-offset-4 opacity-70 hover:opacity-100">{{ link.label }}</a>
              }
            </div>
          </section>
        }

        @for (section of rest(); track section.id) {
          <section class="mb-20">
            <h2 class="text-3xl font-extrabold tracking-tight mb-8">{{ sectionTitle(section.type) }}</h2>
            @switch (section.type) {
              @case ('about') {
                <p class="text-xl leading-relaxed max-w-3xl opacity-90 font-medium">{{ aboutConfig(section).body }}</p>
                @if (aboutConfig(section).highlights.length) {
                  <div class="grid sm:grid-cols-3 gap-4 mt-8">
                    @for (hl of aboutConfig(section).highlights; track hl) {
                      <div class="p-card border p-4 text-sm font-semibold" [class]="mode() === 'dark' ? 'border-white/10' : 'border-slate-200'">{{ hl }}</div>
                    }
                  </div>
                }
              }
              @case ('skills') {
                <div class="flex flex-wrap gap-3">
                  @for (group of skillsConfig(section).groups; track group.id) {
                    @for (item of group.items; track item.name) {
                      <span class="p-btn px-5 py-2.5 text-sm font-bold border-2" [class]="mode() === 'dark' ? 'border-white/15' : 'border-slate-900'">{{ item.name }}</span>
                    }
                  }
                </div>
              }
              @case ('experience') {
                <div class="space-y-8">
                  @for (item of experienceConfig(section).items; track item.id) {
                    <div class="flex flex-col sm:flex-row gap-4 pb-8 border-b" [class]="mode() === 'dark' ? 'border-white/10' : 'border-slate-200'">
                      <p class="text-sm font-bold shrink-0 sm:w-40" [style.color]="accent()">{{ item.startDate }} – {{ item.current ? 'Now' : item.endDate }}</p>
                      <div>
                        <p class="text-lg font-bold">{{ item.role }} · {{ item.company }}</p>
                        @if (item.bullets.length) {
                          <ul class="mt-2 space-y-1">
                            @for (b of item.bullets; track $index) { <li class="text-sm opacity-70">{{ b }}</li> }
                          </ul>
                        }
                      </div>
                    </div>
                  }
                </div>
              }
              @case ('projects') {
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  @for (proj of projectsConfig(section).items; track $index) {
                    <div class="group">
                      <div class="p-img overflow-hidden aspect-[4/3] mb-4" [class]="mode() === 'dark' ? 'bg-white/5' : 'bg-slate-100'">
                        @if (proj.imageUrl) {
                          <img [src]="proj.imageUrl" alt="" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        } @else {
                          <div class="w-full h-full flex items-center justify-center text-5xl font-extrabold opacity-20">{{ proj.title ? proj.title.charAt(0) : '?' }}</div>
                        }
                      </div>
                      <div class="flex items-start justify-between gap-2">
                        <h3 class="text-xl font-bold">{{ proj.title }}</h3>
                        @if (proj.featured) { <span class="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-400 text-amber-900 shrink-0">Featured</span> }
                      </div>
                      @if (proj.description) { <p class="text-sm opacity-70 mt-1">{{ proj.description }}</p> }
                      <div class="flex items-center gap-4 mt-3">
                        @if (proj.url) { <a [href]="proj.url" target="_blank" rel="noopener noreferrer" class="text-sm font-bold underline underline-offset-4" [style.color]="accent()">View</a> }
                        @if (proj.githubUrl) { <a [href]="proj.githubUrl" target="_blank" rel="noopener noreferrer" class="text-sm font-bold opacity-60 underline underline-offset-4">Code</a> }
                      </div>
                    </div>
                  }
                </div>
              }
              @case ('education') {
                <div class="space-y-3">
                  @for (item of educationConfig(section).items; track $index) {
                    <div class="flex flex-wrap items-baseline justify-between gap-2">
                      <p class="text-lg font-bold">{{ item.degree }} <span class="font-normal opacity-60">— {{ item.institution }}</span></p>
                      <p class="text-sm opacity-50">{{ item.startDate }}–{{ item.endDate }}</p>
                    </div>
                  }
                </div>
              }
              @case ('testimonials') {
                <div class="grid sm:grid-cols-2 gap-6">
                  @for (t of testimonialsConfig(section).items; track $index) {
                    <div class="p-card border-2 p-6" [class]="mode() === 'dark' ? 'border-white/10' : 'border-slate-900'">
                      <p class="text-lg font-medium leading-snug">&ldquo;{{ t.quote }}&rdquo;</p>
                      <p class="text-sm font-bold mt-4" [style.color]="accent()">{{ t.author }} <span class="font-normal opacity-60">— {{ t.role }}</span></p>
                    </div>
                  }
                </div>
              }
              @case ('contact') {
                <div class="p-card p-10 text-white" [style.background]="accent()">
                  <h3 class="text-3xl font-extrabold mb-4">{{ contactConfig(section).ctaLabel || "Let's work together" }}</h3>
                  <div class="flex flex-wrap gap-5 text-sm font-bold">
                    @if (contactConfig(section).showEmail && portfolio().email) { <a [href]="'mailto:' + portfolio().email" class="underline underline-offset-4">{{ portfolio().email }}</a> }
                    @if (contactConfig(section).showPhone && portfolio().phone) { <a [href]="'tel:' + portfolio().phone" class="underline underline-offset-4">{{ portfolio().phone }}</a> }
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
export class DesignerPortfolioTemplateComponent {
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

  readonly socialLinks = computed(() => {
    const s = this.portfolio().social ?? {};
    const entries: { key: string; url: string; label: string }[] = [];
    if (s.website) entries.push({ key: 'website', url: s.website, label: 'Website' });
    if (s.linkedin) entries.push({ key: 'linkedin', url: s.linkedin, label: 'LinkedIn' });
    if (s.twitter) entries.push({ key: 'twitter', url: s.twitter, label: 'Twitter' });
    if (s.github) entries.push({ key: 'github', url: s.github, label: 'GitHub' });
    if (s.youtube) entries.push({ key: 'youtube', url: s.youtube, label: 'YouTube' });
    return entries;
  });

  sectionTitle(type: string): string {
    const titles: Record<string, string> = {
      about: 'About', skills: 'Skills', experience: 'Experience', projects: 'Selected Work',
      education: 'Education', testimonials: 'What people say', contact: "Let's Talk",
    };
    return titles[type] ?? type;
  }

  aboutConfig(s: any): AboutConfig { return s.config; }
  skillsConfig(s: any): SkillsConfig { return s.config; }
  experienceConfig(s: any): ExperienceConfig { return s.config; }
  projectsConfig(s: any): ProjectsConfig { return s.config; }
  educationConfig(s: any): EducationConfig { return s.config; }
  testimonialsConfig(s: any): TestimonialsConfig { return s.config; }
  contactConfig(s: any): ContactConfig { return s.config; }
}
