import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStoreService } from '../../../services/resume-store.service';
import { LanguageItem } from '../../../models/resume.model';
import { LABEL_CLASS, inputValue } from '../editor-utils';

const PROFICIENCY_LEVELS: LanguageItem['proficiency'][] = ['Basic', 'Conversational', 'Fluent', 'Native'];

@Component({
  selector: 'app-languages-form',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-3">
      @for (lang of languages(); track lang.id) {
        <div class="flex flex-wrap items-end gap-4">
          <div class="flex-1 min-w-[140px]">
            <label [class]="labelClass">Language</label>
            <input class="input" [value]="lang.name" (input)="patchName(lang.id, $event)" placeholder="English" />
          </div>
          <div class="flex-1 min-w-[140px]">
            <label [class]="labelClass">Proficiency</label>
            <select class="input" [value]="lang.proficiency" (change)="patchProficiency(lang.id, $event)">
              @for (level of levels; track level) {
                <option [value]="level">{{ level }}</option>
              }
            </select>
          </div>
          <button type="button" class="text-slate-400 hover:text-red-500 transition-colors mb-2" (click)="store.removeLanguage(lang.id)" aria-label="Remove language">✕</button>
        </div>
      }
    </div>
    <button type="button" class="btn btn-primary btn-sm mt-3" (click)="store.addLanguage()">+ Add Language</button>
  `,
})
export class LanguagesFormComponent {
  readonly store = inject(ResumeStoreService);
  readonly resume = computed(() => this.store.activeResume());
  readonly languages = computed(() => this.resume()?.languages ?? []);
  readonly labelClass = LABEL_CLASS;
  readonly levels = PROFICIENCY_LEVELS;

  patchName(id: string, event: Event): void {
    this.store.updateLanguage(id, { name: inputValue(event) });
  }

  patchProficiency(id: string, event: Event): void {
    this.store.updateLanguage(id, { proficiency: inputValue(event) as LanguageItem['proficiency'] });
  }
}
