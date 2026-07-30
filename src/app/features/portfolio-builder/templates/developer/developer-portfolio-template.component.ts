import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioData, PortfolioSection, AboutConfig, ContactConfig, EducationConfig, ExperienceConfig, HeroConfig, ProjectsConfig, SkillsConfig, TestimonialsConfig } from '../../models/portfolio.model';
import { FONT_STACKS, RADIUS_VALUES, initialsOf, layoutMaxWidthClass, visibleSections } from '../shared/portfolio-template-helpers';

@Component({
  selector: 'app-developer-portfolio-template',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host { display: block; }
    .p-card, .p-btn { border-radius: var(--p-radius); }
    .p-avatar { border-radius: 9999px; }
    .term-dot { width: 10px; height: 10px; border-radius: 9999px; }
  `],
  template: `
    <div class="min-h-full w-full" [style.font-family]="fontStack()" [style.--p-radius]="radiusValue()" [style.--p-accent]="accent()"
         [class]="mode() === 'dark' ? 'bg-[#0a0e14] text-slate-100' : 'bg-white text-slate-900'">

      <div class="mx-auto px-6 sm:px-10 py-14" [class]="maxW()">

        @if (hero(); as h) {
          <section class="p-card border overflow-hidden mb-16" [class]="mode() === 'dark' ? 'border-white/10 bg-black/30' : 'border-slate-200 bg-slate-50'">
            <!-- terminal chrome -->
            <div class="flex items-center gap-1.5 px-4 py-2.5 border-b" [class]="mode() === 'dark' ? 'border-white/10' : 'border-slate-200'">
              <span class="term-dot bg-red-400"></span><span class="term-dot bg-amber-400"></span><span class="term-dot bg-emerald-400"></span>
              <span class="ml-3 text-[11px] font-mono opacity-40">~/portfolio</span>
            </div>
            <div class="p-8 sm:p-10 flex flex-col sm:flex-row items-start gap-8">
              @if (h.config.photoUrl) {
                <img [src]="h.config.photoUrl" alt="" class="p-avatar w-24 h-24 object-cover shrink-0 border-2" [style.border-color]="accent()" />
              } @else {
                <div class="p-avatar w-24 h-24 shrink-0 flex items-center justify-center text-2xl font-extrabold font-mono text-white" [style.background]="accent()">{{ initials() }}</div>
              }
              <div class="flex-1">
                <p class="font-mono text-xs opacity-50 mb-2"><span [style.color]="accent()">$</span> whoami</p>
                <h1 class="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight">{{ h.config.headline || portfolio().displayName || portfolio().username }}</h1>
                @if (h.config.subheadline) {
                  <p class="mt-2 font-mono text-sm" [style.color]="accent()">&gt; {{ h.config.subheadline }}</p>
                }
                @if (portfolio().location) { <p class="text-xs mt-2 opacity-50 font-mono">// {{ portfolio().location }}</p> }

                <div class="flex flex-wrap items-center gap-3 mt-6">
                  @if (h.config.ctaLabel && h.config.ctaUrl) {
                    <a [href]="h.config.ctaUrl" target="_blank" rel="noopener noreferrer"
                       class="p-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold font-mono text-white shadow-md hover:opacity-90 transition"
                       [style.background]="accent()">{{ h.config.ctaLabel }}</a>
                  }
                  @if (h.config.resumeCtaEnabled && portfolio().pinnedResumeId) {
                    <a [href]="'/r/' + portfolio().pinnedResumeId" target="_blank" rel="noopener noreferrer"
                       class="p-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold font-mono border transition"
                       [class]="mode() === 'dark' ? 'border-white/15 hover:bg-white/5' : 'border-slate-300 hover:bg-white'">./resume.pdf</a>
                  }
                  @for (link of socialLinks(); track link.key) {
                    <a [href]="link.url" target="_blank" rel="noopener noreferrer"
                       class="w-10 h-10 flex items-center justify-center p-btn border transition"
                       [class]="mode() === 'dark' ? 'border-white/15 hover:bg-white/5' : 'border-slate-300 hover:bg-white'">{{ link.icon }}</a>
                  }
                </div>
              </div>
            </div>
          </section>
        }

        @for (section of rest(); track section.id) {
          <section class="mb-14">
            <p class="font-mono text-xs mb-4 opacity-50"><span [style.color]="accent()">&gt;</span> {{ sectionTag(section.type) }}</p>
            @switch (section.type) {
              @case ('about') {
                <p class="text-base leading-relaxed max-w-3xl opacity-90">{{ aboutConfig(section).body }}</p>
                @if (aboutConfig(section).highlights.length) {
                  <ul class="grid sm:grid-cols-2 gap-2 mt-4 font-mono text-sm">
                    @for (hl of aboutConfig(section).highlights; track hl) {
                      <li class="flex items-start gap-2 opacity-80"><span [style.color]="accent()">✓</span> {{ hl }}</li>
                    }
                  </ul>
                }
              }
              @case ('skills') {
                <div class="space-y-5">
                  @for (group of skillsConfig(section).groups; track group.id) {
                    <div>
                      @if (skillsConfig(section).groups.length > 1) { <p class="text-xs font-mono opacity-50 mb-2">{{ group.label }}</p> }
                      <div class="flex flex-wrap gap-2">
                        @for (item of group.items; track item.name) {
                          <span class="p-btn font-mono inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold border"
                                [class]="mode() === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'">{{ item.name }}</span>
                        }
                      </div>
                    </div>
                  }
                </div>
              }
              @case ('experience') {
                <div class="space-y-6 border-l-2 pl-6" [style.border-color]="accent()">
                  @for (item of experienceConfig(section).items; track item.id) {
                    <div>
                      <p class="font-mono text-xs opacity-50">{{ item.startDate }} — {{ item.current ? 'present' : item.endDate }}</p>
                      <p class="font-bold mt-1">{{ item.role }} <span class="font-normal opacity-60">&#64;{{ item.company }}</span></p>
                      @if (item.bullets.length) {
                        <ul class="mt-2 space-y-1">
                          @for (b of item.bullets; track $index) { <li class="text-sm opacity-80 flex items-start gap-2"><span [style.color]="accent()">-</span> {{ b }}</li> }
                        </ul>
                      }
                    </div>
                  }
                </div>
              }
              @case ('projects') {
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  @for (proj of projectsConfig(section).items; track $index) {
                    <div class="p-card border p-5 transition hover:-translate-y-0.5" [class]="mode() === 'dark' ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-white'">
                      <div class="flex items-center justify-between">
                        <p class="font-bold font-mono text-sm">{{ proj.title }}</p>
                        @if (proj.featured) { <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-500">★ featured</span> }
                      </div>
                      @if (proj.description) { <p class="text-xs opacity-70 leading-relaxed mt-2 line-clamp-3">{{ proj.description }}</p> }
                      @if (proj.tags.length) {
                        <div class="flex flex-wrap gap-1.5 mt-3">
                          @for (t of proj.tags; track t) { <span class="text-[10px] font-mono px-2 py-0.5 rounded" [class]="mode() === 'dark' ? 'bg-white/10' : 'bg-slate-100'">{{ t }}</span> }
                        </div>
                      }
                      <div class="flex items-center gap-4 mt-4 pt-3 border-t font-mono text-xs" [class]="mode() === 'dark' ? 'border-white/10' : 'border-slate-100'">
                        @if (proj.url) { <a [href]="proj.url" target="_blank" rel="noopener noreferrer" class="font-semibold hover:underline" [style.color]="accent()">live_demo</a> }
                        @if (proj.githubUrl) { <a [href]="proj.githubUrl" target="_blank" rel="noopener noreferrer" class="font-semibold opacity-70 hover:opacity-100">source</a> }
                      </div>
                    </div>
                  }
                </div>
              }
              @case ('education') {
                <div class="space-y-4 font-mono text-sm">
                  @for (item of educationConfig(section).items; track $index) {
                    <div class="flex flex-wrap items-baseline justify-between gap-2">
                      <p><span class="font-bold">{{ item.degree }}</span> <span class="opacity-60">· {{ item.field }} · {{ item.institution }}</span></p>
                      <p class="opacity-50 text-xs">{{ item.startDate }}—{{ item.endDate }}</p>
                    </div>
                  }
                </div>
              }
              @case ('testimonials') {
                <div class="grid sm:grid-cols-2 gap-5">
                  @for (t of testimonialsConfig(section).items; track $index) {
                    <div class="p-card border p-5" [class]="mode() === 'dark' ? 'border-white/10' : 'border-slate-200'">
                      <p class="text-sm opacity-90">&ldquo;{{ t.quote }}&rdquo;</p>
                      <p class="text-xs font-mono mt-3 opacity-60">— {{ t.author }}, {{ t.role }}</p>
                    </div>
                  }
                </div>
              }
              @case ('contact') {
                <div class="p-card border p-8" [class]="mode() === 'dark' ? 'border-white/10 bg-black/30' : 'border-slate-200 bg-slate-50'">
                  <p class="font-mono text-sm mb-4">{{ contactConfig(section).ctaLabel || 'Get in touch' }}</p>
                  <div class="flex flex-wrap gap-4 font-mono text-sm">
                    @if (contactConfig(section).showEmail && portfolio().email) { <a [href]="'mailto:' + portfolio().email" class="font-semibold hover:underline" [style.color]="accent()">{{ portfolio().email }}</a> }
                    @if (contactConfig(section).showPhone && portfolio().phone) { <a [href]="'tel:' + portfolio().phone" class="font-semibold hover:underline" [style.color]="accent()">{{ portfolio().phone }}</a> }
                  </div>
                  @if (contactConfig(section).showSocial && socialLinks().length) {
                    <div class="flex gap-3 mt-4">
                      @for (link of socialLinks(); track link.key) {
                        <a [href]="link.url" target="_blank" rel="noopener noreferrer" class="w-9 h-9 flex items-center justify-center p-btn border" [class]="mode() === 'dark' ? 'border-white/15' : 'border-slate-300'">{{ link.icon }}</a>
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
export class DeveloperPortfolioTemplateComponent {
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
    const entries: { key: string; url: string; icon: string }[] = [];
    if (s.github) entries.push({ key: 'github', url: s.github, icon: '🐙' });
    if (s.linkedin) entries.push({ key: 'linkedin', url: s.linkedin, icon: '💼' });
    if (s.twitter) entries.push({ key: 'twitter', url: s.twitter, icon: '🐦' });
    if (s.website) entries.push({ key: 'website', url: s.website, icon: '🌐' });
    if (s.youtube) entries.push({ key: 'youtube', url: s.youtube, icon: '▶️' });
    return entries;
  });

  sectionTag(type: string): string {
    const tags: Record<string, string> = {
      about: 'cat about.md', skills: 'ls ./skills', experience: 'git log --experience',
      projects: 'ls ./projects', education: 'cat education.log', testimonials: 'cat reviews.txt', contact: './contact.sh',
    };
    return tags[type] ?? type;
  }

  aboutConfig(s: any): AboutConfig { return s.config; }
  skillsConfig(s: any): SkillsConfig { return s.config; }
  experienceConfig(s: any): ExperienceConfig { return s.config; }
  projectsConfig(s: any): ProjectsConfig { return s.config; }
  educationConfig(s: any): EducationConfig { return s.config; }
  testimonialsConfig(s: any): TestimonialsConfig { return s.config; }
  contactConfig(s: any): ContactConfig { return s.config; }
}
