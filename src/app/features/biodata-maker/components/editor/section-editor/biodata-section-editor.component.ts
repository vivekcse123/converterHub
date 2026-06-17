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
              class="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors select-none"
              (click)="toggle(section)"
            >
              <span class="text-base">{{ icon(section) }}</span>
              <span class="flex-1 font-semibold text-slate-800 dark:text-slate-100 text-sm">{{ label(section) }}</span>
              <div class="flex items-center gap-2">
                @if (!store.isSectionVisible(section)) {
                  <span class="badge bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs">Hidden in PDF</span>
                }
                <button
                  type="button"
                  class="text-xs text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-1 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                  [title]="store.isSectionVisible(section) ? 'Hide from PDF' : 'Show in PDF'"
                  (click)="$event.stopPropagation(); store.toggleSectionVisibility(section)"
                >
                  {{ store.isSectionVisible(section) ? '👁️' : '🙈' }}
                </button>
                <span class="text-slate-400 text-xs transition-transform duration-200" [class.rotate-180]="isOpen(section)">▼</span>
              </div>
            </header>

            <!-- Accordion body -->
            @if (isOpen(section)) {
              <div class="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-700/60">
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
