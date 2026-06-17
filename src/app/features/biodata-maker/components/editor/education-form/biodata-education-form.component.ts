import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiodataStoreService } from '../../../services/biodata-store.service';
import { BiodataEducationItem } from '../../../models/biodata.model';
import { LABEL, inp } from '../editor-utils';

@Component({
  selector: 'app-biodata-education-form',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (bd(); as b) {
      <div class="space-y-4">
        @for (edu of b.education; track edu.id; let i = $index) {
          <div class="card p-4 space-y-3 relative">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Education {{ i + 1 }}</span>
              <button type="button" class="btn btn-sm text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" (click)="store.removeEducation(edu.id)">✕ Remove</button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label [class]="lc">Degree / Course *</label>
                <input class="input" [value]="edu.degree" (input)="update(edu.id, 'degree', $event)" placeholder="B.Tech / Class XII" />
              </div>
              <div>
                <label [class]="lc">Field of Study</label>
                <input class="input" [value]="edu.field" (input)="update(edu.id, 'field', $event)" placeholder="Computer Science" />
              </div>
              <div class="sm:col-span-2">
                <label [class]="lc">Institution / School / College *</label>
                <input class="input" [value]="edu.institution" (input)="update(edu.id, 'institution', $event)" placeholder="Delhi University" />
              </div>
              <div>
                <label [class]="lc">Year of Completion</label>
                <input class="input" [value]="edu.year" (input)="update(edu.id, 'year', $event)" placeholder="2019" />
              </div>
              <div>
                <label [class]="lc">Grade / Marks / CGPA</label>
                <input class="input" [value]="edu.grade" (input)="update(edu.id, 'grade', $event)" placeholder="8.5 CGPA / 93%" />
              </div>
            </div>
          </div>
        }

        <button type="button" class="btn btn-secondary btn-sm w-full" (click)="store.addEducation()">
          + Add Education
        </button>
      </div>
    }
  `,
})
export class BiodataEducationFormComponent {
  readonly store = inject(BiodataStoreService);
  readonly bd = computed(() => this.store.activeBiodata());
  readonly lc = LABEL;

  update(id: string, field: keyof BiodataEducationItem, event: Event): void {
    this.store.updateEducation(id, { [field]: inp(event) } as any);
  }
}
