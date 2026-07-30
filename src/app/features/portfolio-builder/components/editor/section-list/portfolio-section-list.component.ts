import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { ADDABLE_SECTION_TYPES, PortfolioSection, PortfolioSectionType, SECTION_LABELS } from '../../../models/portfolio.model';
import { HeroFormComponent } from '../hero-form/hero-form.component';
import { AboutFormComponent } from '../about-form/about-form.component';
import { SkillsFormComponent } from '../skills-form/skills-form.component';
import { ExperienceFormComponent } from '../experience-form/experience-form.component';
import { ProjectsFormComponent } from '../projects-form/projects-form.component';
import { EducationFormComponent } from '../education-form/education-form.component';
import { TestimonialsFormComponent } from '../testimonials-form/testimonials-form.component';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { SectionIconComponent } from '../section-icon/section-icon.component';

const SECTION_DESCRIPTIONS: Record<PortfolioSectionType, string> = {
  hero: 'Introduction & headline',
  about: 'Your background',
  skills: 'Technical & soft skills',
  experience: 'Work history',
  projects: 'Featured work',
  education: 'Degrees & certifications',
  testimonials: 'Client & colleague feedback',
  contact: 'How people reach you',
};

@Component({
  selector: 'app-portfolio-section-list',
  standalone: true,
  imports: [
    CommonModule, DragDropModule,
    HeroFormComponent, AboutFormComponent, SkillsFormComponent, ExperienceFormComponent,
    ProjectsFormComponent, EducationFormComponent, TestimonialsFormComponent, ContactFormComponent,
    SectionIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (store.portfolio(); as p) {
      <div class="flex flex-col h-full">
        <div class="px-4 pt-4 pb-3">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-[15px] font-extrabold text-slate-800 dark:text-slate-100">Sections</h2>
              <p class="text-[11px] text-slate-400 dark:text-slate-500">Drag to reorder</p>
            </div>
            @if (rest().length > 1) {
              <button type="button"
                      class="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors"
                      [class]="reorderMode() ? 'bg-primary-600 text-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'"
                      (click)="reorderMode.set(!reorderMode())">
                {{ reorderMode() ? 'Done' : 'Reorder' }}
              </button>
            }
          </div>
        </div>

        <div class="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">

          <!-- Hero - locked first -->
          @if (hero(); as h) {
            <div class="group rounded-2xl border overflow-hidden transition-colors"
                 [class]="isExpanded(h.id) && !reorderMode() ? 'border-primary-300 dark:border-primary-700 ring-1 ring-primary-200 dark:ring-primary-800/60' : 'border-slate-200 dark:border-slate-800'">
              <button type="button" class="w-full flex items-center gap-2.5 px-3 py-2.5 text-left"
                      [class.cursor-default]="reorderMode()" (click)="!reorderMode() && toggle(h.id)">
                <span class="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                  <app-section-icon type="hero" />
                </span>
                <span class="flex-1 min-w-0">
                  <span class="block text-[13px] font-bold text-slate-700 dark:text-slate-200 truncate">Hero</span>
                  <span class="block text-[11px] text-slate-400 dark:text-slate-500 truncate">{{ descriptions.hero }}</span>
                </span>
                @if (reorderMode()) {
                  <span class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 shrink-0">Always first</span>
                } @else {
                  <svg class="w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform" [class.rotate-180]="isExpanded(h.id)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                }
              </button>
              @if (isExpanded(h.id) && !reorderMode()) {
                <div class="px-4 pb-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <app-hero-form [section]="asHero(h)" />
                </div>
              }
            </div>
          }

          <!-- Reorderable sections -->
          <div cdkDropList cdkDropListOrientation="vertical" class="space-y-1.5" (cdkDropListDropped)="drop($event)">
            @for (section of rest(); track section.id) {
              <div cdkDrag cdkDragLockAxis="y"
                   class="group rounded-2xl border overflow-hidden transition-colors bg-white dark:bg-slate-900"
                   [class]="isExpanded(section.id) && !reorderMode() ? 'border-primary-300 dark:border-primary-700 ring-1 ring-primary-200 dark:ring-primary-800/60' : 'border-slate-200 dark:border-slate-800'"
                   [class.opacity-50]="!section.enabled">

                <div class="flex items-center gap-2 px-2.5" [class]="reorderMode() ? 'py-2.5' : 'py-2.5'">
                  @if (reorderMode()) {
                    <span cdkDragHandle class="w-4 shrink-0 flex flex-col items-center gap-[3px] cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-500" title="Drag to reorder">
                      <span class="w-[3px] h-[3px] rounded-full bg-current"></span><span class="w-[3px] h-[3px] rounded-full bg-current"></span>
                      <span class="w-[3px] h-[3px] rounded-full bg-current"></span><span class="w-[3px] h-[3px] rounded-full bg-current"></span>
                      <span class="w-[3px] h-[3px] rounded-full bg-current"></span><span class="w-[3px] h-[3px] rounded-full bg-current"></span>
                    </span>
                  }

                  <span class="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                    <app-section-icon [type]="section.type" />
                  </span>

                  <button type="button" class="flex-1 min-w-0 text-left"
                          [class.cursor-default]="reorderMode()" (click)="!reorderMode() && toggle(section.id)">
                    <span class="block text-[13px] font-bold text-slate-700 dark:text-slate-200 truncate">
                      {{ labels[section.type] }}
                      @if (!section.enabled) { <span class="ml-1 text-[10px] font-medium text-slate-400 dark:text-slate-500">· hidden</span> }
                    </span>
                    <span class="block text-[11px] text-slate-400 dark:text-slate-500 truncate">{{ descriptions[section.type] }}</span>
                  </button>

                  <span class="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        [class.opacity-100]="reorderMode()">
                    <button type="button" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            [title]="section.enabled ? 'Hide from portfolio' : 'Show on portfolio'"
                            (click)="store.toggleSectionEnabled(section.id)">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        @if (section.enabled) {
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        } @else {
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                        }
                      </svg>
                    </button>
                    <button type="button" class="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800" title="Duplicate" (click)="store.duplicateSection(section.id)">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                    </button>
                    <button type="button" class="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete section" (click)="store.removeSection(section.id)">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </span>

                  @if (!reorderMode()) {
                    <button type="button" class="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" (click)="toggle(section.id)">
                      <svg class="w-3.5 h-3.5 transition-transform" [class.rotate-180]="isExpanded(section.id)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>
                  }
                </div>

                @if (isExpanded(section.id) && !reorderMode()) {
                  <div class="px-4 pb-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                    @switch (section.type) {
                      @case ('about')         { <app-about-form [section]="asAbout(section)" /> }
                      @case ('skills')        { <app-skills-form [section]="asSkills(section)" /> }
                      @case ('experience')    { <app-experience-form [section]="asExperience(section)" /> }
                      @case ('projects')      { <app-projects-form [section]="asProjects(section)" /> }
                      @case ('education')     { <app-education-form [section]="asEducation(section)" /> }
                      @case ('testimonials')  { <app-testimonials-form [section]="asTestimonials(section)" /> }
                      @case ('contact')       { <app-contact-form [section]="asContact(section)" /> }
                    }
                  </div>
                }

                <div *cdkDragPlaceholder class="h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 border-2 border-dashed border-primary-300 dark:border-primary-700"></div>
              </div>
            }
          </div>
        </div>

        @if (!reorderMode()) {
          <div class="relative px-3 pb-3">
            <button type="button"
                    class="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 py-2.5 border-[1.5px] border-dashed border-slate-300 dark:border-slate-600 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 rounded-xl transition-colors"
                    (click)="showPicker.set(!showPicker())">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>
              Add Section
            </button>
            @if (showPicker()) {
              <div class="absolute z-10 bottom-full mb-1.5 left-3 right-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-card-hover p-1.5 grid grid-cols-2 gap-1">
                @for (t of addableTypes; track t) {
                  <button type="button"
                          class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                          (click)="addSection(t)">
                    <span class="w-5 h-5 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0"><app-section-icon [type]="t" /></span>
                    {{ labels[t] }}
                  </button>
                }
              </div>
            }
          </div>
        }
      </div>
    }
  `,
})
export class PortfolioSectionListComponent {
  readonly store = inject(PortfolioStoreService);

  readonly reorderMode = signal(false);
  readonly showPicker  = signal(false);
  private readonly expanded = signal<Set<string>>(new Set());

  readonly labels = SECTION_LABELS;
  readonly descriptions = SECTION_DESCRIPTIONS;
  readonly addableTypes = ADDABLE_SECTION_TYPES;

  readonly hero = computed(() => this.store.portfolio()?.sections.find(s => s.type === 'hero'));
  readonly rest = computed(() => this.store.portfolio()?.sections.filter(s => s.type !== 'hero') ?? []);

  isExpanded(id: string): boolean { return this.expanded().has(id); }

  toggle(id: string): void {
    const next = new Set(this.expanded());
    if (next.has(id)) next.delete(id); else next.add(id);
    this.expanded.set(next);
  }

  addSection(type: PortfolioSectionType): void {
    this.store.addSection(type);
    this.showPicker.set(false);
  }

  drop(event: CdkDragDrop<PortfolioSection[]>): void {
    const p = this.store.portfolio();
    if (!p) return;
    const hero = p.sections.find(s => s.type === 'hero');
    const rest = p.sections.filter(s => s.type !== 'hero');
    moveItemInArray(rest, event.previousIndex, event.currentIndex);
    this.store.reorderSections(hero ? [hero, ...rest] : rest);
  }

  // Narrowing helpers so the template can bind typed section inputs from a loosely-typed union.
  asHero(s: PortfolioSection)         { return s as any; }
  asAbout(s: PortfolioSection)        { return s as any; }
  asSkills(s: PortfolioSection)       { return s as any; }
  asExperience(s: PortfolioSection)   { return s as any; }
  asProjects(s: PortfolioSection)     { return s as any; }
  asEducation(s: PortfolioSection)    { return s as any; }
  asTestimonials(s: PortfolioSection) { return s as any; }
  asContact(s: PortfolioSection)      { return s as any; }
}
