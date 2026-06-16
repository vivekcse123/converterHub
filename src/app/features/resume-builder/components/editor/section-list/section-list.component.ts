import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
      <div class="space-y-5">
        <!-- Personal info is always first and not reorderable -->
        <section class="card p-5 sm:p-6">
          <h3 class="font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 text-base">
            <span>👤</span> Personal Information
          </h3>
          <app-personal-info-form />
        </section>

        <!-- Reorderable sections (vertical reordering only) -->
        <div cdkDropList cdkDropListOrientation="vertical" class="space-y-4" (cdkDropListDropped)="drop($event)">
          @for (section of r.sectionOrder; track section; let i = $index) {
            <section cdkDrag cdkDragLockAxis="y" class="card overflow-hidden">
              <header class="flex items-center gap-2 px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                <span cdkDragHandle class="cursor-move text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 select-none" aria-label="Drag to reorder" title="Drag to reorder">⠿</span>
                <div class="flex flex-col -my-1">
                  <button
                    type="button"
                    class="leading-none text-xs px-1.5 py-0.5 rounded text-slate-400 hover:text-primary-600 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none"
                    (click)="moveUp(i)"
                    [disabled]="i === 0"
                    aria-label="Move section up"
                    title="Move up"
                  >▲</button>
                  <button
                    type="button"
                    class="leading-none text-xs px-1.5 py-0.5 rounded text-slate-400 hover:text-primary-600 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none"
                    (click)="moveDown(i)"
                    [disabled]="i === r.sectionOrder.length - 1"
                    aria-label="Move section down"
                    title="Move down"
                  >▼</button>
                </div>
                <button
                  type="button"
                  class="flex-1 text-left font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2"
                  (click)="toggleExpanded(section)"
                >
                  <span>{{ store.sectionLabel(r, section) }}</span>
                  @if (!isVisible(r, section)) {
                    <span class="badge bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400">Hidden</span>
                  }
                </button>
                <button
                  type="button"
                  class="text-sm px-2 py-1 rounded-md transition-colors text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
                  (click)="store.toggleSectionVisibility(section)"
                  [attr.aria-label]="isVisible(r, section) ? 'Hide section' : 'Show section'"
                  [title]="isVisible(r, section) ? 'Hide from resume' : 'Show on resume'"
                >
                  {{ isVisible(r, section) ? '👁️' : '🚫' }}
                </button>
                <button
                  type="button"
                  class="text-sm px-2 py-1 rounded-md transition-colors text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
                  (click)="toggleExpanded(section)"
                  [attr.aria-label]="isExpanded(section) ? 'Collapse' : 'Expand'"
                >
                  {{ isExpanded(section) ? '⌃' : '⌄' }}
                </button>
              </header>

              @if (isExpanded(section)) {
                <div class="p-5 sm:p-6">
                  @switch (kind(section)) {
                    @case ('summary') { <app-summary-form /> }
                    @case ('experience') { <app-experience-form /> }
                    @case ('education') { <app-education-form /> }
                    @case ('projects') { <app-projects-form /> }
                    @case ('skills') { <app-skills-form /> }
                    @case ('certifications') { <app-certifications-form /> }
                    @case ('achievements') { <app-achievements-form /> }
                    @case ('languages') { <app-languages-form /> }
                    @case ('interests') { <app-interests-form /> }
                    @case ('custom') {
                      @if (customSection(r, section); as custom) {
                        <app-custom-section-form [section]="custom" />
                      }
                    }
                  }
                </div>
              }
            </section>
          }
        </div>

        <button type="button" class="btn btn-secondary btn-sm" (click)="addCustomSection()">+ Add Custom Section</button>
      </div>
    }
  `,
})
export class SectionListComponent {
  readonly store = inject(ResumeStoreService);
  readonly resume = computed(() => this.store.activeResume());

  private readonly collapsed = signal<Set<SectionRef>>(new Set());

  readonly kind = getSectionKind;

  isExpanded(section: SectionRef): boolean {
    return !this.collapsed().has(section);
  }

  toggleExpanded(section: SectionRef): void {
    const next = new Set(this.collapsed());
    if (next.has(section)) {
      next.delete(section);
    } else {
      next.add(section);
    }
    this.collapsed.set(next);
  }

  isVisible(resume: NonNullable<ReturnType<typeof this.resume>>, section: SectionRef): boolean {
    return this.store.isSectionVisible(resume, section);
  }

  customSection(resume: NonNullable<ReturnType<typeof this.resume>>, section: SectionRef) {
    return getCustomSection(resume, section);
  }

  drop(event: CdkDragDrop<SectionRef[]>): void {
    const resume = this.resume();
    if (!resume) return;
    const order = [...resume.sectionOrder];
    moveItemInArray(order, event.previousIndex, event.currentIndex);
    this.store.reorderSections(order);
  }

  moveUp(index: number): void {
    this.moveTo(index, index - 1);
  }

  moveDown(index: number): void {
    this.moveTo(index, index + 1);
  }

  private moveTo(fromIndex: number, toIndex: number): void {
    const resume = this.resume();
    if (!resume) return;
    if (toIndex < 0 || toIndex >= resume.sectionOrder.length) return;
    const order = [...resume.sectionOrder];
    moveItemInArray(order, fromIndex, toIndex);
    this.store.reorderSections(order);
  }

  addCustomSection(): void {
    this.store.addCustomSection();
  }
}
