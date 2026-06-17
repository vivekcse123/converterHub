import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStoreService } from '../../services/resume-store.service';
import { ResumePaymentService } from '../../services/resume-payment.service';
import { TEMPLATE_CATEGORIES, TEMPLATE_PRICE_INR, getTemplatesByCategory } from '../../data/resume-templates.data';
import { TemplateId } from '../../models/resume.model';

@Component({
  selector: 'app-template-picker',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card p-4 sm:p-5 space-y-5">
      <div class="flex items-center justify-between gap-2 flex-wrap">
        <h3 class="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🎨</span> Step 1 — Choose a Template
        </h3>
        <span class="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <span class="inline-block w-3 h-3 rounded-full bg-amber-400"></span> = Premium (₹{{ price }})
        </span>
      </div>

      @for (cat of categories; track cat.label) {
        <div>
          <!-- Section header -->
          <div class="flex items-center gap-2 mb-2.5">
            <span class="text-base leading-none">{{ cat.icon }}</span>
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ cat.label }}</span>
            <span class="hidden sm:inline text-xs text-slate-400 dark:text-slate-500">— {{ cat.hint }}</span>
            <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700 ml-1"></div>
          </div>

          <!-- Templates in this category -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
            @for (tpl of templatesFor(cat.label); track tpl.id) {
              <button
                type="button"
                class="relative flex items-center gap-3 text-left rounded-xl border-2 transition-all p-2.5 group"
                [class]="activeId() === tpl.id
                  ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-900/50 bg-primary-50/50 dark:bg-primary-900/10'
                  : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'"
                [disabled]="paying() === tpl.id"
                (click)="select(tpl.id)"
              >
                <!-- Gradient swatch -->
                <div class="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0 shadow-sm"
                     [class]="tpl.accent">
                  <span class="text-white font-bold text-sm drop-shadow">Aa</span>
                  <!-- Lock overlay for unowned premium templates -->
                  @if (tpl.isPremium && !payment.canUse(tpl.id)) {
                    <div class="absolute inset-0 rounded-lg bg-black/40 flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  }
                </div>

                <!-- Info -->
                <div class="min-w-0 flex-1">
                  <p class="font-medium text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5 flex-wrap">
                    {{ tpl.name }}
                    <!-- Premium badge -->
                    @if (tpl.isPremium && !payment.canUse(tpl.id)) {
                      <span class="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                        ⭐ ₹{{ price }}
                      </span>
                    }
                    <!-- Owned badge -->
                    @if (tpl.isPremium && payment.canUse(tpl.id)) {
                      <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                        ✓ Owned
                      </span>
                    }
                    <!-- Active badge -->
                    @if (activeId() === tpl.id) {
                      <span class="text-[10px] px-1.5 py-0.5 rounded bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">Active</span>
                    }
                  </p>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {{ tpl.bestFor.replace('Best for: ', '') }}
                  </p>
                </div>

                <!-- Right: loading spinner or check -->
                @if (paying() === tpl.id) {
                  <svg class="w-4 h-4 text-amber-500 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                } @else if (activeId() === tpl.id) {
                  <svg class="w-4 h-4 text-primary-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                }
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class TemplatePickerComponent {
  private readonly store = inject(ResumeStoreService);
  readonly payment    = inject(ResumePaymentService);
  readonly categories = TEMPLATE_CATEGORIES;
  readonly price      = TEMPLATE_PRICE_INR;
  readonly activeId   = computed(() => this.store.activeResume()?.templateId);
  readonly paying     = signal<TemplateId | null>(null);

  templatesFor = getTemplatesByCategory;

  async select(id: TemplateId): Promise<void> {
    // Free template or already purchased — switch immediately
    if (this.payment.canUse(id)) {
      this.store.setTemplate(id);
      return;
    }

    // Premium — trigger payment flow
    const tpl = getTemplatesByCategory(this.categories.find(c =>
      this.templatesFor(c.label).some(t => t.id === id))?.label ?? 'Classic & ATS-Safe'
    ).find(t => t.id === id);

    this.paying.set(id);
    const unlocked = await this.payment.purchase(id, tpl?.name ?? id);
    this.paying.set(null);

    if (unlocked) this.store.setTemplate(id);
  }
}
