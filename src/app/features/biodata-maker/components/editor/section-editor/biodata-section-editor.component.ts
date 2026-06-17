import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiodataStoreService } from '../../../services/biodata-store.service';
import { BIODATA_SECTION_LABELS, BiodataSectionId, MARRIAGE_SECTIONS, PROFESSIONAL_SECTIONS } from '../../../models/biodata.model';
import { BiodataPersonalFormComponent } from '../personal-form/biodata-personal-form.component';
import { BiodataContactFormComponent } from '../contact-form/biodata-contact-form.component';
import { BiodataEducationFormComponent } from '../education-form/biodata-education-form.component';
import { BiodataProfessionalFormComponent } from '../professional-form/biodata-professional-form.component';
import { BiodataFamilyFormComponent } from '../family-form/biodata-family-form.component';
import { BiodataSkillsFormComponent } from '../skills-form/biodata-skills-form.component';
import { BiodataAchievementsFormComponent } from '../achievements-form/biodata-achievements-form.component';
import { BiodataPreferencesFormComponent } from '../preferences-form/biodata-preferences-form.component';

const SECTION_ICONS: Record<BiodataSectionId, string> = {
  personal: '👤',
  contact: '📞',
  education: '🎓',
  professional: '💼',
  family: '👨‍👩‍👧‍👦',
  skills: '⭐',
  achievements: '🏆',
  partnerPreferences: '💞',
};

@Component({
  selector: 'app-biodata-section-editor',
  standalone: true,
  host: { class: 'block' },
  imports: [
    CommonModule,
    BiodataPersonalFormComponent,
    BiodataContactFormComponent,
    BiodataEducationFormComponent,
    BiodataProfessionalFormComponent,
    BiodataFamilyFormComponent,
    BiodataSkillsFormComponent,
    BiodataAchievementsFormComponent,
    BiodataPreferencesFormComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (bd(); as b) {
      <div class="space-y-3">
        @for (section of visibleSections(); track section) {
          <section class="card overflow-hidden">
            <!-- Accordion header -->
            <header
              class="flex items-center gap-2.5 px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none"
              (click)="toggle(section)"
            >
              <span class="text-base leading-none">{{ icon(section) }}</span>
              <span class="flex-1 font-semibold text-slate-800 dark:text-slate-100 text-sm">{{ label(section) }}</span>
              <div class="flex items-center gap-1.5">
                @if (!store.isSectionVisible(section)) {
                  <span class="text-xs px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-medium">Hidden</span>
                }
                <button
                  type="button"
                  class="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm"
                  [title]="store.isSectionVisible(section) ? 'Hide from PDF' : 'Show in PDF'"
                  (click)="$event.stopPropagation(); store.toggleSectionVisibility(section)"
                >
                  {{ store.isSectionVisible(section) ? '👁' : '🚫' }}
                </button>
                <svg class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200 flex-shrink-0" [class.rotate-180]="isOpen(section)" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4l4 4 4-4"/></svg>
              </div>
            </header>

            <!-- Accordion body -->
            @if (isOpen(section)) {
              <div class="px-5 py-4">
                @switch (section) {
                  @case ('personal') { <app-biodata-personal-form /> }
                  @case ('contact') { <app-biodata-contact-form /> }
                  @case ('education') { <app-biodata-education-form /> }
                  @case ('professional') { <app-biodata-professional-form /> }
                  @case ('family') { <app-biodata-family-form /> }
                  @case ('skills') { <app-biodata-skills-form /> }
                  @case ('achievements') { <app-biodata-achievements-form /> }
                  @case ('partnerPreferences') { <app-biodata-preferences-form /> }
                }
              </div>
            }
          </section>
        }
      </div>
    }
  `,
})
export class BiodataSectionEditorComponent {
  readonly store = inject(BiodataStoreService);
  readonly bd = computed(() => this.store.activeBiodata());

  private readonly openSections = signal<Set<BiodataSectionId>>(new Set(['personal']));

  readonly visibleSections = computed<BiodataSectionId[]>(() => {
    const b = this.bd();
    if (!b) return [];
    return b.type === 'marriage' ? MARRIAGE_SECTIONS : PROFESSIONAL_SECTIONS;
  });

  label(section: BiodataSectionId): string {
    return BIODATA_SECTION_LABELS[section];
  }

  icon(section: BiodataSectionId): string {
    return SECTION_ICONS[section];
  }

  isOpen(section: BiodataSectionId): boolean {
    return this.openSections().has(section);
  }

  toggle(section: BiodataSectionId): void {
    this.openSections.update(s => {
      const next = new Set(s);
      if (next.has(section)) { next.delete(section); } else { next.add(section); }
      return next;
    });
  }
}
