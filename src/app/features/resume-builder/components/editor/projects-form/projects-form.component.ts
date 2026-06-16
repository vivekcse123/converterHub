import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStoreService } from '../../../services/resume-store.service';
import { ProjectItem } from '../../../models/resume.model';
import { BOLD_BTN_CLASS, LABEL_CLASS, applyBoldToggle, inputValue } from '../editor-utils';

@Component({
  selector: 'app-projects-form',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-4">
      @for (proj of projects(); track proj.id; let i = $index) {
        <div class="card p-5 relative">
          <div class="flex items-center justify-between mb-3">
            <span class="badge bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
              Project {{ i + 1 }}
            </span>
            <button type="button" class="text-slate-400 hover:text-red-500 transition-colors text-sm" (click)="store.removeProject(proj.id)" aria-label="Remove project">
              🗑️ Remove
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label [class]="labelClass">Project Name</label>
              <input class="input" [value]="proj.name" (input)="patch(proj.id, 'name', $event)" placeholder="TaskFlow — Team Productivity App" />
            </div>
            <div>
              <label [class]="labelClass">Link (optional)</label>
              <input class="input" [value]="proj.link" (input)="patch(proj.id, 'link', $event)" placeholder="github.com/you/project" />
            </div>
            <div class="sm:col-span-2">
              <label [class]="labelClass">Tech Stack</label>
              <input class="input" [value]="proj.techStack" (input)="patch(proj.id, 'techStack', $event)" placeholder="Angular, Node.js, MongoDB" />
            </div>
          </div>

          <div class="mt-3">
            <label [class]="labelClass">Highlights (one per line)</label>
            <div class="space-y-3">
              @for (bullet of proj.bullets; track $index) {
                <div class="flex gap-2">
                  <textarea
                    #bulletEl
                    class="input min-h-[44px] resize-y flex-1"
                    [value]="bullet"
                    (input)="patchBullet(proj.id, $index, $event)"
                    placeholder="Built a real-time task board used by 1,200+ users with sub-200ms sync latency."
                  ></textarea>
                  <div class="flex flex-col items-center gap-1.5 pt-0.5">
                    <button type="button" [class]="boldBtnClass" (click)="toggleBoldBullet(proj.id, $index, bulletEl)" title="Bold selected text">B</button>
                    <button type="button" class="text-slate-400 hover:text-red-500 transition-colors" (click)="store.removeProjectBullet(proj.id, $index)" aria-label="Remove bullet">✕</button>
                  </div>
                </div>
              }
            </div>
            <button type="button" class="btn btn-sm btn-outline mt-2" (click)="store.addProjectBullet(proj.id)">+ Add Bullet Point</button>
          </div>
        </div>
      }
    </div>

    <button type="button" class="btn btn-primary btn-sm mt-4" (click)="store.addProject()">+ Add Project</button>
  `,
})
export class ProjectsFormComponent {
  readonly store = inject(ResumeStoreService);
  readonly resume = computed(() => this.store.activeResume());
  readonly projects = computed(() => this.resume()?.projects ?? []);
  readonly labelClass = LABEL_CLASS;
  readonly boldBtnClass = BOLD_BTN_CLASS;

  patch(id: string, field: keyof ProjectItem, event: Event): void {
    this.store.updateProject(id, { [field]: inputValue(event) } as Partial<ProjectItem>);
  }

  patchBullet(id: string, index: number, event: Event): void {
    this.store.updateProjectBullet(id, index, inputValue(event));
  }

  toggleBoldBullet(id: string, index: number, textarea: HTMLTextAreaElement): void {
    this.store.updateProjectBullet(id, index, applyBoldToggle(textarea));
  }
}
