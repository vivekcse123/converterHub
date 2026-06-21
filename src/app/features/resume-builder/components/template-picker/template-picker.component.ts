import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStoreService } from '../../services/resume-store.service';
import { SubscriptionService } from '../../services/subscription.service';
import { TEMPLATE_CATEGORIES, getTemplatesByCategory } from '../../data/resume-templates.data';
import { TemplateId } from '../../models/resume.model';

@Component({
  selector: 'app-template-picker',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (compact()) {

      <!-- ── COMPACT LIST (left panel, 300px) ─────────────────── -->
      <div class="py-1 select-none">
        @for (cat of categories; track cat.label) {
          <!-- Tiny category divider -->
          <div class="px-4 pt-4 pb-1.5 flex items-center gap-2">
            <span class="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {{ cat.label }}
            </span>
            <div class="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
          </div>

          <!-- Template rows -->
          @for (tpl of templatesFor(cat.label); track tpl.id) {
            <button
              type="button"
              class="w-full flex items-center gap-2.5 px-3 py-2 transition-all text-left relative"
              [class]="activeId() === tpl.id
                ? 'bg-violet-50 dark:bg-violet-900/20'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'"
              (click)="select(tpl.id)">

              <!-- Active left bar -->
              @if (activeId() === tpl.id) {
                <span class="absolute left-0 top-1 bottom-1 w-0.5 bg-violet-500 rounded-full"></span>
              }

              <!-- Color chip -->
              <div class="relative shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-sm"
                   [class]="tpl.accent">
                <span class="text-white text-[10px] font-bold leading-none">Aa</span>
                @if (tpl.isPremium && !subs.isPro()) {
                  <span class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center text-[7px] border-2 border-white dark:border-slate-900">⭐</span>
                }
              </div>

              <!-- Name -->
              <span class="flex-1 min-w-0 text-xs font-medium truncate"
                    [class]="activeId() === tpl.id
                      ? 'text-violet-700 dark:text-violet-300'
                      : 'text-slate-700 dark:text-slate-200'">
                {{ tpl.name }}
              </span>

              <!-- Pro label OR active check -->
              @if (tpl.isPremium && !subs.isPro()) {
                <span class="text-[9px] font-bold text-amber-600 dark:text-amber-400 shrink-0">PRO</span>
              } @else if (activeId() === tpl.id) {
                <svg class="w-3.5 h-3.5 text-violet-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              }
            </button>
          }
        }

        @if (!subs.isPro()) {
          <div class="mx-3 mt-3 mb-2 px-3 py-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <p class="text-[10px] text-amber-700 dark:text-amber-300 font-medium leading-relaxed">
              ⭐ PRO templates can be previewed free - upgrade to download without watermark.
            </p>
          </div>
        }
      </div>

    } @else {

      <!-- ── FULL GRID (mobile / standalone) ──────────────────── -->
      <div class="p-4 space-y-5">

        @if (!subs.isPro()) {
          <p class="text-[11px] text-slate-400 dark:text-slate-500 text-center">
            ⭐ PRO templates - preview free, upgrade to download
          </p>
        }

        @for (cat of categories; track cat.label) {
          <div>
            <!-- Category header -->
            <div class="flex items-center gap-2 mb-2.5">
              <span class="text-sm">{{ cat.icon }}</span>
              <span class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ cat.label }}</span>
              <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
            </div>

            <!-- 2-col template cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              @for (tpl of templatesFor(cat.label); track tpl.id) {
                <button
                  type="button"
                  class="relative flex items-center gap-3 text-left rounded-xl border-2 transition-all p-3"
                  [class]="activeId() === tpl.id
                    ? 'border-violet-500 ring-2 ring-violet-200 dark:ring-violet-900/50 bg-violet-50/50 dark:bg-violet-900/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-violet-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'"
                  (click)="select(tpl.id)">

                  <div class="relative w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0 shadow-sm" [class]="tpl.accent">
                    <span class="text-white font-bold text-sm drop-shadow">Aa</span>
                    @if (tpl.isPremium && !subs.isPro()) {
                      <span class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-[9px] shadow border border-white dark:border-slate-900">⭐</span>
                    }
                  </div>

                  <div class="min-w-0 flex-1">
                    <p class="font-semibold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5 flex-wrap leading-tight">
                      {{ tpl.name }}
                      @if (tpl.isPremium && !subs.isPro()) {
                        <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">Pro</span>
                      }
                    </p>
                    <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1 leading-tight">
                      {{ tpl.bestFor.replace('Best for: ', '') }}
                    </p>
                  </div>

                  @if (activeId() === tpl.id) {
                    <svg class="w-4 h-4 text-violet-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  }
                </button>
              }
            </div>
          </div>
        }
      </div>

    }
  `,
})
export class TemplatePickerComponent {
  private readonly store = inject(ResumeStoreService);
  readonly subs          = inject(SubscriptionService);
  readonly categories    = TEMPLATE_CATEGORIES;
  readonly activeId      = computed(() => this.store.activeResume()?.templateId);
  readonly compact       = input(false);

  templatesFor = getTemplatesByCategory;

  select(id: TemplateId): void {
    this.store.setTemplate(id);
  }
}
