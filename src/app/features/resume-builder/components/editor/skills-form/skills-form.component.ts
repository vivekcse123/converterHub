import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStoreService } from '../../../services/resume-store.service';
import { LABEL_CLASS, inputValue } from '../editor-utils';

@Component({
  selector: 'app-skills-form',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-4">
      @for (group of skills(); track group.id; let i = $index) {
        <div class="card p-4 relative">
          <div class="flex items-center justify-between mb-3">
            <span class="badge bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
              Skill Group {{ i + 1 }}
            </span>
            <button type="button" class="text-slate-400 hover:text-red-500 transition-colors text-sm" (click)="store.removeSkillGroup(group.id)" aria-label="Remove skill group">
              🗑️ Remove
            </button>
          </div>

          <div class="space-y-3">
            <div>
              <label [class]="labelClass">Category Name (optional)</label>
              <input class="input" [value]="group.category" (input)="patchCategory(group.id, $event)" placeholder="e.g. Languages, Frameworks, Tools" />
            </div>
            <div>
              <label [class]="labelClass">Skills (comma-separated)</label>
              <input class="input" [value]="group.items.join(', ')" (input)="patchItems(group.id, $event)" placeholder="JavaScript, TypeScript, Angular, Node.js" />
            </div>
          </div>
        </div>
      }
    </div>

    <button type="button" class="btn btn-primary btn-sm mt-4" (click)="store.addSkillGroup()">+ Add Skill Group</button>

    <p class="text-xs text-slate-500 dark:text-slate-400 mt-3">
      Tip: group skills by category (e.g. "Languages", "Frameworks", "Tools") for a cleaner layout, or use a single
      group for a simple skill list.
    </p>
  `,
})
export class SkillsFormComponent {
  readonly store = inject(ResumeStoreService);
  readonly resume = computed(() => this.store.activeResume());
  readonly skills = computed(() => this.resume()?.skills ?? []);
  readonly labelClass = LABEL_CLASS;

  patchCategory(id: string, event: Event): void {
    this.store.updateSkillGroup(id, { category: inputValue(event) });
  }

  patchItems(id: string, event: Event): void {
    this.store.setSkillItemsFromText(id, inputValue(event));
  }
}
