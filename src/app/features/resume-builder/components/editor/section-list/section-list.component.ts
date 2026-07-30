import {
  ChangeDetectionStrategy, Component, computed, effect, inject,
  input, signal, untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { ResumeStoreService } from '../../../services/resume-store.service';
import { SectionRef } from '../../../models/resume.model';
import { getSectionKind, getCustomSection, SECTION_DESCRIPTIONS } from '../../../templates/shared/template-helpers';
import { PersonalInfoFormComponent } from '../personal-info-form/personal-info-form.component';
import { SummaryFormComponent } from '../summary-form/summary-form.component';
import { ExperienceFormComponent } from '../experience-form/experience-form.component';
import { EducationFormComponent } from '../education-form/education-form.component';
import { ProjectsFormComponent } from '../projects-form/projects-form.component';
import { SkillsFormComponent } from '../skills-form/skills-form.component';
import { CertificationsFormComponent } from '../certifications-form/certifications-form.component';
import { AchievementsFormComponent } from '../achievements-form/achievements-form.component';
import { LanguagesFormComponent } from '../languages-form/languages-form.component';
import { InterestsFormComponent } from '../interests-form/interests-form.component';
import { CustomSectionFormComponent } from '../custom-section-form/custom-section-form.component';

/**
 * Colorful icon + accent-color set for the section-manager cards only — a local,
 * presentation-only companion to the shared (emoji) `SECTION_ICONS` map in
 * `template-helpers.ts`. Deliberately NOT merged into that shared map, since it's
 * also consumed by `templates/fresher/fresher-template.component.ts` to render the
 * actual printable resume, which must stay untouched.
 */
type SectionVisual = { paths: string[]; bg: string; text: string };
const SECTION_VISUALS: Record<string, SectionVisual> = {
  personal:       { paths: ['M16 7a4 4 0 11-8 0 4 4 0 018 0z', 'M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'], bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600 dark:text-violet-400' },
  summary:        { paths: ['M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'], bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400' },
  experience:     { paths: ['M4 7a2 2 0 012-2h2V4a2 2 0 012-2h4a2 2 0 012 2v1h2a2 2 0 012 2v3H4V7z', 'M4 10h16v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8z'], bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
  education:      { paths: ['M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222'], bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
  projects:       { paths: ['M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0120 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-2 2Z', 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0', 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5'], bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-400' },
  skills:         { paths: ['M13 10V3L4 14h7v7l9-11h-7z'], bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' },
  certifications: { paths: ['M12 2l2.4 4.86L20 8l-4 3.9.9 5.6L12 15l-4.9 2.5.9-5.6L4 8l5.6-1.14L12 2Z'], bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
  achievements:   { paths: ['M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0Z', 'M7 6H4a1 1 0 00-1 1c0 2 1 4 4 4M17 6h3a1 1 0 011 1c0 2-1 4-4 4'], bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
  languages:      { paths: ['M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 'M3 12h18', 'M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z'], bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400' },
  interests:      { paths: ['M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'], bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600 dark:text-rose-400' },
  custom:         { paths: ['M12 4v16m8-8H4'], bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500 dark:text-slate-400' },
};

@Component({
  selector: 'app-section-list',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    PersonalInfoFormComponent,
    SummaryFormComponent,
    ExperienceFormComponent,
    EducationFormComponent,
    ProjectsFormComponent,
    SkillsFormComponent,
    CertificationsFormComponent,
    AchievementsFormComponent,
    LanguagesFormComponent,
    InterestsFormComponent,
    CustomSectionFormComponent,
  ],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (resume(); as r) {
      <div class="space-y-2.5">

        <!-- Reorder mode hint banner -->
        @if (reorderMode()) {
          <div class="flex items-center gap-2.5 px-3.5 py-3 bg-lavender dark:bg-primary-900/20 border border-primary-100 dark:border-primary-900 rounded-2xl">
            <svg class="w-4 h-4 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
            <p class="text-xs text-primary-700 dark:text-primary-300 font-medium leading-snug">
              Drag sections to reorder · click <span class="font-bold">👁</span> to hide/show
            </p>
          </div>
        }

        <!-- Collapse All / Expand All buttons (normal editing mode only) -->
        @if (!reorderMode()) {
          <div class="flex items-center gap-1.5 px-0.5 py-1">
            <button type="button"
                    (click)="collapseAll()"
                    class="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium text-gray-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-lavender dark:hover:bg-slate-800 transition-all duration-[250ms]">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
              Collapse All
            </button>
            <div class="w-px h-3 bg-hairline dark:bg-slate-700"></div>
            <button type="button"
                    (click)="expandAll()"
                    class="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium text-gray-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-lavender dark:hover:bg-slate-800 transition-all duration-[250ms]">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
              </svg>
              Expand All
            </button>
          </div>
        }

        <!-- Personal info - always first, locked position -->
        <section class="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden transition-all duration-[250ms]"
                 [class]="reorderMode()
                   ? 'border-hairline dark:border-slate-700 opacity-60'
                   : personalExpanded()
                     ? 'border-primary-200 dark:border-primary-800 shadow-sm'
                     : 'border-hairline dark:border-slate-700 hover:border-primary-100 dark:hover:border-slate-600 hover:shadow-sm hover:-translate-y-0.5'">
          <div class="flex items-center gap-3 px-3.5 py-3"
               [class.cursor-default]="reorderMode()">
            <!-- Lock icon in reorder mode, colorful section icon otherwise -->
            @if (reorderMode()) {
              <span class="text-gray-300 dark:text-slate-600 text-sm shrink-0 leading-none select-none w-10 h-10 flex items-center justify-center">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </span>
            } @else {
              <span class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" [class]="visual('personal').bg">
                <svg class="w-[18px] h-[18px]" [class]="visual('personal').text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  @for (d of visual('personal').paths; track d) {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" [attr.d]="d"/>
                  }
                </svg>
              </span>
            }

            <!-- Name + description -->
            <button
              type="button"
              class="flex-1 text-left min-w-0 py-0.5"
              [class.cursor-default]="reorderMode()"
              (click)="togglePersonal()">
              <span class="block text-sm font-semibold text-gray-700 dark:text-slate-200 truncate">Personal Info</span>
              @if (!reorderMode()) {
                <span class="block text-[11px] text-gray-400 dark:text-slate-500 truncate">{{ sectionDescriptions.personal }}</span>
              }
            </button>

            @if (reorderMode()) {
              <!-- "Always first" badge in reorder mode -->
              <span class="text-[10px] font-medium text-gray-400 dark:text-slate-500 shrink-0 mr-1">Always first</span>
            } @else {
              <!-- Expand chevron in normal mode -->
              <button
                type="button"
                class="shrink-0 p-2 rounded-xl transition-all duration-[250ms] text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-lavender dark:hover:bg-slate-800"
                (click)="togglePersonal()">
                <svg class="w-3.5 h-3.5 transition-transform duration-[250ms]" [class.rotate-180]="personalExpanded()"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            }
          </div>

          <!-- Personal info form - only in normal editing mode when expanded -->
          @if (personalExpanded() && !reorderMode()) {
            <div class="px-4 pb-4 border-t border-hairline dark:border-slate-800 pt-3">
              <app-personal-info-form />
            </div>
          }
        </section>

        <!-- Reorderable sections -->
        @if (!reorderMode() && searchQuery().trim() && visibleSections().length === 0) {
          <p class="text-xs text-gray-400 dark:text-slate-500 text-center py-4">No sections match "{{ searchQuery() }}"</p>
        }

        <div cdkDropList cdkDropListOrientation="vertical" class="space-y-2.5"
             (cdkDropListDropped)="drop($event)">
          @for (section of (reorderMode() ? r.sectionOrder : visibleSections()); track section; let i = $index) {
            <section cdkDrag cdkDragLockAxis="y" [cdkDragDisabled]="!!searchQuery().trim()"
                     class="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden transition-all duration-[250ms]"
                     [class]="isExpanded(section) && !reorderMode()
                       ? 'border-primary-200 dark:border-primary-800 shadow-sm'
                       : reorderMode()
                         ? 'border-hairline dark:border-slate-700 shadow-sm'
                         : 'border-hairline dark:border-slate-700 hover:border-primary-100 dark:hover:border-slate-600 hover:shadow-sm hover:-translate-y-0.5'">

              <!-- Section header row -->
              <div class="flex items-center gap-1 px-3.5"
                   [class]="reorderMode() ? 'py-3.5' : 'py-3'">

                <!-- Drag handle - always shown, more prominent in reorder mode -->
                <span cdkDragHandle
                      class="select-none shrink-0 mr-1 leading-none transition-colors duration-[250ms]"
                      [class]="reorderMode()
                        ? 'cursor-grab active:cursor-grabbing text-gray-400 dark:text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 text-base'
                        : 'cursor-grab active:cursor-grabbing text-gray-300 dark:text-slate-600 hover:text-gray-500 dark:hover:text-slate-400 text-base'"
                      title="Drag to reorder">⠿</span>

                <!-- Colorful icon badge (normal mode only) -->
                @if (!reorderMode()) {
                  <span class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mr-2.5" [class]="visual(kind(section)).bg">
                    <svg class="w-[18px] h-[18px]" [class]="visual(kind(section)).text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      @for (d of visual(kind(section)).paths; track d) {
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" [attr.d]="d"/>
                      }
                    </svg>
                  </span>
                }

                <!-- Section name + description - clickable only in normal mode -->
                <button
                  type="button"
                  class="flex-1 text-left min-w-0 py-0.5"
                  [class.cursor-default]="reorderMode()"
                  (click)="!reorderMode() && toggleExpanded(section)">
                  <span class="block text-sm font-semibold text-gray-700 dark:text-slate-200 truncate">
                    {{ store.sectionLabel(r, section) }}
                    @if (!isVisible(r, section)) {
                      <span class="ml-1 text-[10px] font-normal text-gray-400 dark:text-slate-500 normal-case">hidden</span>
                    }
                  </span>
                  @if (!reorderMode()) {
                    <span class="block text-[11px] text-gray-400 dark:text-slate-500 truncate">{{ sectionDescriptions[kind(section)] }}</span>
                  }
                </button>

                <!-- Show/hide toggle - always visible -->
                <button
                  type="button"
                  class="shrink-0 p-2 rounded-xl transition-all duration-[250ms]"
                  [class]="isVisible(r, section)
                    ? 'text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-lavender dark:hover:bg-slate-800'
                    : 'text-gray-300 dark:text-slate-600 hover:text-gray-500 hover:bg-lavender dark:hover:bg-slate-800'"
                  (click)="store.toggleSectionVisibility(section)"
                  [title]="isVisible(r, section) ? 'Hide from resume' : 'Show on resume'">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    @if (isVisible(r, section)) {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    } @else {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    }
                  </svg>
                </button>

                <!-- Delete button for custom sections (reorder mode only) -->
                @if (reorderMode() && section.startsWith('custom:')) {
                  <button
                    type="button"
                    class="shrink-0 p-2 rounded-xl transition-all duration-[250ms] text-gray-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    (click)="removeCustom(section)"
                    title="Delete section">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                }

                <!-- Expand chevron (normal mode only) -->
                @if (!reorderMode()) {
                  <button
                    type="button"
                    class="shrink-0 p-2 rounded-xl transition-all duration-[250ms] text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-lavender dark:hover:bg-slate-800"
                    (click)="toggleExpanded(section)">
                    <svg class="w-3.5 h-3.5 transition-transform duration-[250ms]" [class.rotate-180]="isExpanded(section)"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                }
              </div>

              <!-- Section content - only in normal editing mode when expanded -->
              @if (isExpanded(section) && !reorderMode()) {
                <div class="px-4 pb-4 border-t border-hairline dark:border-slate-800 pt-3">
                  @switch (kind(section)) {
                    @case ('summary')        { <app-summary-form /> }
                    @case ('experience')     { <app-experience-form /> }
                    @case ('education')      { <app-education-form /> }
                    @case ('projects')       { <app-projects-form /> }
                    @case ('skills')         { <app-skills-form /> }
                    @case ('certifications') { <app-certifications-form /> }
                    @case ('achievements')   { <app-achievements-form /> }
                    @case ('languages')      { <app-languages-form /> }
                    @case ('interests')      { <app-interests-form /> }
                    @case ('custom') {
                      @if (customSection(r, section); as custom) {
                        <app-custom-section-form [section]="custom" />
                      }
                    }
                  }
                </div>
              }

              <!-- CDK drag placeholder -->
              <div *cdkDragPlaceholder
                   class="h-12 rounded-2xl bg-lavender dark:bg-primary-900/20 border-2 border-dashed border-primary-300 dark:border-primary-700"></div>
            </section>
          }
        </div>

        <!-- Add Section button (normal editing mode only) -->
        @if (!reorderMode()) {
          <button type="button"
                  class="w-full text-xs font-medium text-gray-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 py-2.5 border border-dashed border-hairline dark:border-slate-600 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-lavender/40 dark:hover:bg-primary-900/10 rounded-2xl transition-all duration-[250ms]"
                  (click)="addCustomSection()">
            + Add New Section
          </button>
        }

      </div>
    }
  `,
})
export class SectionListComponent {
  readonly store = inject(ResumeStoreService);
  readonly resume = computed(() => this.store.activeResume());

  /** When true, all sections collapse and only drag/visibility controls are shown. */
  readonly reorderMode = input<boolean>(false);

  /** Filters the reorderable section list by label (case-insensitive substring match). */
  readonly searchQuery = input<string>('');

  readonly visibleSections = computed<SectionRef[]>(() => {
    const r = this.resume();
    if (!r) return [];
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return r.sectionOrder;
    return r.sectionOrder.filter(s => this.store.sectionLabel(r, s).toLowerCase().includes(q));
  });

  readonly personalExpanded = signal(true);
  private readonly collapsed = signal<Set<SectionRef>>(new Set());

  // Saved state for restoring after reorder mode exits
  private _savedCollapsed: Set<SectionRef> | null = null;
  private _savedPersonal = true;

  constructor() {
    // Watch reorderMode: collapse everything on enter, restore on exit
    effect(() => {
      const rm = this.reorderMode();
      untracked(() => {
        if (rm) {
          this._savedCollapsed = new Set(this.collapsed());
          this._savedPersonal = this.personalExpanded();
          const r = this.resume();
          this.collapsed.set(r ? new Set(r.sectionOrder) : new Set());
          this.personalExpanded.set(false);
        } else if (this._savedCollapsed !== null) {
          this.collapsed.set(this._savedCollapsed);
          this.personalExpanded.set(this._savedPersonal);
          this._savedCollapsed = null;
        }
      });
    });
  }

  togglePersonal(): void {
    if (!this.reorderMode()) this.personalExpanded.update(v => !v);
  }

  readonly kind = getSectionKind;
  readonly sectionDescriptions = SECTION_DESCRIPTIONS;

  visual(kind: string): SectionVisual {
    return SECTION_VISUALS[kind] ?? SECTION_VISUALS['custom'];
  }

  isExpanded(section: SectionRef): boolean {
    return !this.collapsed().has(section);
  }

  toggleExpanded(section: SectionRef): void {
    if (this.reorderMode()) return;
    const next = new Set(this.collapsed());
    if (next.has(section)) next.delete(section);
    else next.add(section);
    this.collapsed.set(next);
  }

  collapseAll(): void {
    const r = this.resume();
    this.collapsed.set(r ? new Set(r.sectionOrder) : new Set());
    this.personalExpanded.set(false);
  }

  expandAll(): void {
    this.collapsed.set(new Set());
    this.personalExpanded.set(true);
  }

  isVisible(r: NonNullable<ReturnType<typeof this.resume>>, section: SectionRef): boolean {
    return this.store.isSectionVisible(r, section);
  }

  customSection(r: NonNullable<ReturnType<typeof this.resume>>, section: SectionRef) {
    return getCustomSection(r, section);
  }

  removeCustom(section: SectionRef): void {
    if (section.startsWith('custom:')) {
      this.store.removeCustomSection(section.slice('custom:'.length));
    }
  }

  drop(event: CdkDragDrop<SectionRef[]>): void {
    const r = this.resume();
    if (!r) return;
    const order = [...r.sectionOrder];
    moveItemInArray(order, event.previousIndex, event.currentIndex);
    this.store.reorderSections(order);
  }

  moveUp(index: number): void   { this.moveTo(index, index - 1); }
  moveDown(index: number): void { this.moveTo(index, index + 1); }

  private moveTo(from: number, to: number): void {
    const r = this.resume();
    if (!r || to < 0 || to >= r.sectionOrder.length) return;
    const order = [...r.sectionOrder];
    moveItemInArray(order, from, to);
    this.store.reorderSections(order);
  }

  addCustomSection(): void { this.store.addCustomSection(); }
}
