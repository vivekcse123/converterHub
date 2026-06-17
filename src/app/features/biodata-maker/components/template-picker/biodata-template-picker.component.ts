import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiodataStoreService } from '../../services/biodata-store.service';
import { BIODATA_TEMPLATES } from '../../data/biodata-templates.data';
import { BiodataTemplateId, BiodataType } from '../../models/biodata.model';

@Component({
  selector: 'app-biodata-template-picker',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (bd(); as b) {
      <div class="card p-5 sm:p-6 space-y-5">
        <!-- Biodata type toggle -->
        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Biodata Type</h3>
          <div class="flex gap-2">
            <button
              type="button"
              class="flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all"
              [class]="b.type === 'marriage' ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-rose-300'"
              (click)="setType('marriage')"
            >
              💍 Marriage Biodata
            </button>
            <button
              type="button"
              class="flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all"
              [class]="b.type === 'professional' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300'"
              (click)="setType('professional')"
            >
              💼 Professional Biodata
            </button>
          </div>
        </div>

        <!-- Template selection -->
        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Template</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            @for (tmpl of templates; track tmpl.id) {
              <button
                type="button"
                class="relative rounded-xl border-2 overflow-hidden transition-all text-left"
                [class]="b.templateId === tmpl.id ? 'border-primary-500 shadow-md shadow-primary-100 dark:shadow-primary-900/30' : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600'"
                (click)="setTemplate(tmpl.id)"
              >
                <!-- Gradient preview strip -->
                <div class="h-10 bg-gradient-to-r" [ngClass]="tmpl.gradient"></div>
                <div class="p-3">
                  <div class="flex items-start justify-between gap-2 mb-0.5">
                    <span class="font-semibold text-slate-800 dark:text-slate-100 text-sm">{{ tmpl.name }}</span>
                    @if (b.templateId === tmpl.id) {
                      <span class="text-primary-500 text-xs font-bold flex-shrink-0">✓</span>
                    }
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 leading-snug">{{ tmpl.description }}</p>
                  <span class="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{{ tmpl.badge }}</span>
                </div>
              </button>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class BiodataTemplatePickerComponent {
  private readonly store = inject(BiodataStoreService);
  readonly bd = computed(() => this.store.activeBiodata());
  readonly templates = BIODATA_TEMPLATES;

  setTemplate(id: BiodataTemplateId): void {
    this.store.setTemplate(id);
  }

  setType(type: BiodataType): void {
    this.store.setType(type);
  }
}
