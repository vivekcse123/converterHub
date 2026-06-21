import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStoreService } from '../../../services/resume-store.service';
import { ExperienceItem } from '../../../models/resume.model';
import { BOLD_BTN_CLASS, LABEL_CLASS, applyBoldToggle, inputChecked, inputValue } from '../editor-utils';

@Component({
  selector: 'app-experience-form',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-4">
      @for (exp of experience(); track exp.id; let i = $index) {
        <div class="card p-5 relative">
          <div class="flex items-center justify-between mb-3">
            <span class="badge bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
              Experience {{ i + 1 }}
            </span>
            <button type="button" class="text-slate-400 hover:text-red-500 transition-colors text-sm" (click)="store.removeExperience(exp.id)" aria-label="Remove experience">
              🗑️ Remove
            </button>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <div>
              <label [class]="labelClass">Job Title</label>
              <input class="input" [value]="exp.role" (input)="patch(exp.id, 'role', $event)" placeholder="Software Engineer" />
            </div>
            <div>
              <label [class]="labelClass">Company</label>
              <input class="input" [value]="exp.company" (input)="patch(exp.id, 'company', $event)" placeholder="Acme Corp" />
            </div>
            <div class="">
              <label [class]="labelClass">Location</label>
              <input class="input" [value]="exp.location" (input)="patch(exp.id, 'location', $event)" placeholder="City, Country" />
            </div>
            <div>
              <label [class]="labelClass">Start Date</label>
              <input class="input" type="month" [value]="exp.startDate" (input)="patch(exp.id, 'startDate', $event)" />
            </div>
            <div>
              <label [class]="labelClass">End Date</label>
              <input class="input" type="month" [value]="exp.endDate" [disabled]="exp.current" (input)="patch(exp.id, 'endDate', $event)" />
              <label class="flex items-center gap-2 mt-2 text-xs text-slate-600 dark:text-slate-300">
                <input type="checkbox" [checked]="exp.current" (change)="patchChecked(exp.id, 'current', $event)" class="rounded border-slate-300" />
                I currently work here
              </label>
            </div>
          </div>

          <div class="mt-3">
            <label [class]="labelClass">Key Achievements (one per line)</label>
            <div class="space-y-3">
              @for (bullet of exp.bullets; track $index) {
                <div class="flex gap-2">
                  <textarea
                    #bulletEl
                    class="input min-h-[44px] resize-y flex-1"
                    [value]="bullet"
                    (input)="patchBullet(exp.id, $index, $event)"
                    placeholder="Increased page load speed by 35% by optimizing bundle size and lazy-loading routes."
                  ></textarea>
                  <div class="flex flex-col items-center gap-1.5 pt-0.5">
                    <button type="button" [class]="boldBtnClass" (click)="toggleBoldBullet(exp.id, $index, bulletEl)" title="Bold selected text">B</button>
                    <button type="button" class="text-slate-400 hover:text-red-500 transition-colors" (click)="store.removeExperienceBullet(exp.id, $index)" aria-label="Remove bullet">✕</button>
                  </div>
                </div>
              }
            </div>
            <button type="button" class="btn btn-sm btn-outline mt-2" (click)="store.addExperienceBullet(exp.id)">+ Add Bullet Point</button>
          </div>
        </div>
      }
    </div>

    <button type="button" class="btn btn-primary btn-sm mt-4" (click)="store.addExperience()">+ Add Experience</button>
  `,
})
export class ExperienceFormComponent {
  readonly store = inject(ResumeStoreService);
  readonly resume = computed(() => this.store.activeResume());
  readonly experience = computed(() => this.resume()?.experience ?? []);
  readonly labelClass = LABEL_CLASS;
  readonly boldBtnClass = BOLD_BTN_CLASS;

  patch(id: string, field: keyof ExperienceItem, event: Event): void {
    this.store.updateExperience(id, { [field]: inputValue(event) } as Partial<ExperienceItem>);
  }

  patchChecked(id: string, field: keyof ExperienceItem, event: Event): void {
    this.store.updateExperience(id, { [field]: inputChecked(event) } as Partial<ExperienceItem>);
  }

  patchBullet(id: string, index: number, event: Event): void {
    this.store.updateExperienceBullet(id, index, inputValue(event));
  }

  toggleBoldBullet(id: string, index: number, textarea: HTMLTextAreaElement): void {
    this.store.updateExperienceBullet(id, index, applyBoldToggle(textarea));
  }
}
