import {
  ChangeDetectionStrategy, Component, computed, effect, inject,
  input, signal, untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { ResumeStoreService } from '../../../services/resume-store.service';
import { SectionRef } from '../../../models/resume.model';
import { getSectionKind, getCustomSection } from '../../../templates/shared/template-helpers';
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
      <div class="space-y-1.5">

        <!-- Reorder mode hint banner -->
        @if (reorderMode()) {
          <div class="flex items-center gap-2.5 px-3 py-2.5 bg-primary-50 border border-primary-200 rounded-xl">
            <svg class="w-4 h-4 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
            <p class="text-xs text-primary-700 font-medium leading-snug">
              Drag sections to reorder · click <span class="font-bold">👁</span> to hide/show
            </p>
          </div>
        }

        <!-- Collapse All / Expand All buttons (normal editing mode only) -->
        @if (!reorderMode()) {
          <div class="flex items-center gap-1.5 px-0.5">
            <button type="button"
                    (click)="collapseAll()"
                    class="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
              Collapse All
            </button>
            <div class="w-px h-3 bg-slate-200 dark:bg-slate-700"></div>
            <button type="button"
                    (click)="expandAll()"
                    class="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
              </svg>
              Expand All
            </button>
          </div>
        }

        <!-- Personal info - always first, locked position -->
        <section class="bg-white dark:bg-slate-900 rounded-xl border overflow-hidden transition-colors"
                 [class]="reorderMode()
                   ? 'border-slate-200 dark:border-slate-700 opacity-60'
                   : personalExpanded()
                     ? 'border-primary-200 dark:border-primary-800'
                     : 'border-slate-200 dark:border-slate-700'">
          <div class="flex items-center gap-2.5 px-3 py-2.5"
               [class.cursor-default]="reorderMode()">
            <!-- Lock icon in reorder mode, section icon otherwise -->
            @if (reorderMode()) {
              <span class="text-slate-300 dark:text-slate-600 text-sm shrink-0 leading-none select-none w-5 text-center">
                <svg class="w-3.5 h-3.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </span>
            } @else {
              <span class="text-base leading-none shrink-0">👤</span>
            }

            <!-- Name -->
            <button
              type="button"
              class="flex-1 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 min-w-0 truncate py-0.5"
              [class.cursor-default]="reorderMode()"
              (click)="togglePersonal()">
              Personal Info
            </button>

            @if (reorderMode()) {
              <!-- "Always first" badge in reorder mode -->
              <span class="text-[10px] font-medium text-slate-400 dark:text-slate-500 shrink-0 mr-1">Always first</span>
            } @else {
              <!-- Expand chevron in normal mode -->
              <button
                type="button"
                class="shrink-0 p-1.5 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                (click)="togglePersonal()">
                <svg class="w-3.5 h-3.5 transition-transform" [class.rotate-180]="personalExpanded()"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            }
          </div>

          <!-- Personal info form - only in normal editing mode when expanded -->
          @if (personalExpanded() && !reorderMode()) {
            <div class="px-4 pb-4 border-t border-slate-100 dark:border-slate-800 pt-3">
              <app-personal-info-form />
            </div>
          }
        </section>

        <!-- Reorderable sections -->
        <div cdkDropList cdkDropListOrientation="vertical" class="space-y-1.5"
             (cdkDropListDropped)="drop($event)">
          @for (section of r.sectionOrder; track section; let i = $index) {
            <section cdkDrag cdkDragLockAxis="y"
                     class="bg-white dark:bg-slate-900 rounded-xl border overflow-hidden transition-colors"
                     [class]="isExpanded(section) && !reorderMode()
                       ? 'border-primary-200 dark:border-primary-800'
                       : reorderMode()
                         ? 'border-slate-200 dark:border-slate-700 shadow-sm'
                         : 'border-slate-200 dark:border-slate-700'">

              <!-- Section header row -->
              <div class="flex items-center px-3"
                   [class]="reorderMode() ? 'py-3' : 'py-2.5'">

                <!-- Drag handle - always shown, more prominent in reorder mode -->
                <span cdkDragHandle
                      class="select-none shrink-0 mr-1.5 leading-none transition-colors"
                      [class]="reorderMode()
                        ? 'cursor-grab active:cursor-grabbing text-slate-400 dark:text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 text-base'
                        : 'cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 text-base'"
                      title="Drag to reorder">⠿</span>

                <!-- Section name - clickable only in normal mode -->
                <button
                  type="button"
                  class="flex-1 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 min-w-0 truncate py-0.5"
                  [class.cursor-default]="reorderMode()"
                  (click)="!reorderMode() && toggleExpanded(section)">
                  {{ store.sectionLabel(r, section) }}
                  @if (!isVisible(r, section)) {
                    <span class="ml-1 text-[10px] font-normal text-slate-400 dark:text-slate-500 normal-case">hidden</span>
                  }
                </button>

                <!-- Show/hide toggle - always visible -->
                <button
                  type="button"
                  class="shrink-0 p-1.5 rounded-lg transition-colors"
                  [class]="isVisible(r, section)
                    ? 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'"
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
                    class="shrink-0 p-1.5 rounded-lg transition-colors text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
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
                    class="shrink-0 p-1.5 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    (click)="toggleExpanded(section)">
                    <svg class="w-3.5 h-3.5 transition-transform" [class.rotate-180]="isExpanded(section)"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                }
              </div>

              <!-- Section content - only in normal editing mode when expanded -->
              @if (isExpanded(section) && !reorderMode()) {
                <div class="px-4 pb-4 border-t border-slate-100 dark:border-slate-800 pt-3">
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
                   class="h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 border-2 border-dashed border-primary-300 dark:border-primary-700"></div>
            </section>
          }
        </div>

        <!-- Add Section button (normal editing mode only) -->
        @if (!reorderMode()) {
          <button type="button"
                  class="w-full text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 py-2 border border-dashed border-slate-300 dark:border-slate-600 hover:border-primary-400 dark:hover:border-primary-600 rounded-xl transition-colors"
                  (click)="addCustomSection()">
            + Add Section
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
