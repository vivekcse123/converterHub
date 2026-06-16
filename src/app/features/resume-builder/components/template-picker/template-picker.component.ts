import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStoreService } from '../../services/resume-store.service';
import { RESUME_TEMPLATES } from '../../data/resume-templates.data';
import { TemplateId } from '../../models/resume.model';

@Component({
  selector: 'app-template-picker',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card p-4 sm:p-5">
      <h3 class="font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
        <span>🎨</span> Step 1 — Choose a Template
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        @for (tpl of templates; track tpl.id) {
          <button
            type="button"
            class="flex items-center gap-3 text-left rounded-xl border-2 transition-colors p-2.5 sm:p-3 group"
            [class]="activeId() === tpl.id
              ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-900/50 bg-primary-50/50 dark:bg-primary-900/10'
              : 'border-slate-200 dark:border-slate-700 hover:border-primary-300'"
            (click)="select(tpl.id)"
          >
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0" [class]="tpl.accent">
              <span class="text-white font-bold text-base sm:text-lg drop-shadow">Aa</span>
            </div>
            <div class="min-w-0">
              <p class="font-medium text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                {{ tpl.name }}
                @if (activeId() === tpl.id) {
                  <span class="badge bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">Active</span>
                }
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{{ tpl.bestFor }}</p>
            </div>
          </button>
        }
      </div>
    </div>
  `,
})
export class TemplatePickerComponent {
  private readonly store = inject(ResumeStoreService);
  readonly templates = RESUME_TEMPLATES;
  readonly activeId = computed(() => this.store.activeResume()?.templateId);

  select(id: TemplateId): void {
    this.store.setTemplate(id);
  }
}
