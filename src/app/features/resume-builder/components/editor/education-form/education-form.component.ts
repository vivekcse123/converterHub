import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStoreService } from '../../../services/resume-store.service';
import { EducationItem } from '../../../models/resume.model';
import { BOLD_BTN_CLASS, LABEL_CLASS, applyBoldToggle, inputChecked, inputValue } from '../editor-utils';

@Component({
  selector: 'app-education-form',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-4">
      @for (edu of education(); track edu.id; let i = $index) {
        <div class="card p-5 relative">
          <div class="flex items-center justify-between mb-3">
            <span class="badge bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
              Education {{ i + 1 }}
            </span>
            <button type="button" class="text-slate-400 hover:text-red-500 transition-colors text-sm" (click)="store.removeEducation(edu.id)" aria-label="Remove education">
              🗑️ Remove
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label [class]="labelClass">Degree</label>
              <input class="input" [value]="edu.degree" (input)="patch(edu.id, 'degree', $event)" placeholder="B.Tech / B.Sc / MBA" />
            </div>
            <div>
              <label [class]="labelClass">Field of Study</label>
              <input class="input" [value]="edu.field" (input)="patch(edu.id, 'field', $event)" placeholder="Computer Science" />
            </div>
            <div class="sm:col-span-2">
              <label [class]="labelClass">Institution</label>
              <input class="input" [value]="edu.institution" (input)="patch(edu.id, 'institution', $event)" placeholder="University / College name" />
            </div>
            <div>
              <label [class]="labelClass">Start Date</label>
              <input class="input" type="month" [value]="edu.startDate" (input)="patch(edu.id, 'startDate', $event)" />
            </div>
            <div>
              <label [class]="labelClass">End Date</label>
              <input class="input" type="month" [value]="edu.endDate" [disabled]="edu.current" (input)="patch(edu.id, 'endDate', $event)" />
              <label class="flex items-center gap-2 mt-2 text-xs text-slate-600 dark:text-slate-300">
                <input type="checkbox" [checked]="edu.current" (change)="patchChecked(edu.id, 'current', $event)" class="rounded border-slate-300" />
                Currently studying
              </label>
            </div>
            <div>
              <label [class]="labelClass">GPA / Score (optional)</label>
              <input class="input" [value]="edu.gpa" (input)="patch(edu.id, 'gpa', $event)" placeholder="8.7/10 or 85%" />
            </div>
            <div class="sm:col-span-2">
              <div class="flex items-center justify-between mb-1">
                <label class="text-xs font-medium text-slate-500 dark:text-slate-400">Description (optional)</label>
                <button type="button" [class]="boldBtnClass" (click)="toggleBold(edu.id, descEl)" title="Bold selected text">B</button>
              </div>
              <textarea #descEl class="input min-h-[60px] resize-y" [value]="edu.description" (input)="patch(edu.id, 'description', $event)" placeholder="Relevant coursework, honors, or activities"></textarea>
            </div>
          </div>
        </div>
      }
    </div>

    <button type="button" class="btn btn-primary btn-sm mt-4" (click)="store.addEducation()">+ Add Education</button>
  `,
})
export class EducationFormComponent {
  readonly store = inject(ResumeStoreService);
  readonly resume = computed(() => this.store.activeResume());
  readonly education = computed(() => this.resume()?.education ?? []);
  readonly labelClass = LABEL_CLASS;
  readonly boldBtnClass = BOLD_BTN_CLASS;

  patch(id: string, field: keyof EducationItem, event: Event): void {
    this.store.updateEducation(id, { [field]: inputValue(event) } as Partial<EducationItem>);
  }

  patchChecked(id: string, field: keyof EducationItem, event: Event): void {
    this.store.updateEducation(id, { [field]: inputChecked(event) } as Partial<EducationItem>);
  }

  toggleBold(id: string, textarea: HTMLTextAreaElement): void {
    this.store.updateEducation(id, { description: applyBoldToggle(textarea) });
  }
}
