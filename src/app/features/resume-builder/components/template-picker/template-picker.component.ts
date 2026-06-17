import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStoreService } from '../../services/resume-store.service';
import { SubscriptionService } from '../../services/subscription.service';
import { TEMPLATE_CATEGORIES, getTemplatesByCategory } from '../../data/resume-templates.data';
import { UpgradeModalComponent } from '../upgrade-modal/upgrade-modal.component';
import { TemplateId } from '../../models/resume.model';

@Component({
  selector: 'app-template-picker',
  standalone: true,
  imports: [CommonModule, UpgradeModalComponent],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Upgrade modal -->
    @if (showUpgrade()) {
      <app-upgrade-modal
        (close)="showUpgrade.set(false)"
        (upgraded)="showUpgrade.set(false)"
      />
    }

    <div class="card p-4 sm:p-5 space-y-5">
      <div class="flex items-center justify-between gap-2 flex-wrap">
        <h3 class="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🎨</span> Step 1 — Choose a Template
        </h3>
        @if (!subs.isPro()) {
          <button
            class="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 transition flex items-center gap-1"
            (click)="showUpgrade.set(true)">
            ⭐ Upgrade to Pro
          </button>
        }
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
                class="relative flex items-center gap-3 text-left rounded-xl border-2 transition-all p-2.5"
                [class]="activeId() === tpl.id
                  ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-900/50 bg-primary-50/50 dark:bg-primary-900/10'
                  : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'"
                (click)="select(tpl.id)"
              >
                <!-- Gradient swatch with optional lock -->
                <div class="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0 shadow-sm"
                     [class]="tpl.accent">
                  <span class="text-white font-bold text-sm drop-shadow">Aa</span>
                  @if (tpl.isPremium && !subs.isPro()) {
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
                    @if (tpl.isPremium && !subs.isPro()) {
                      <span class="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
                        ⭐ PRO
                      </span>
                    }
                    @if (tpl.isPremium && subs.isPro()) {
                      <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                        ✓ Pro
                      </span>
                    }
                    @if (activeId() === tpl.id) {
                      <span class="text-[10px] px-1.5 py-0.5 rounded bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">Active</span>
                    }
                  </p>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {{ tpl.bestFor.replace('Best for: ', '') }}
                  </p>
                </div>

                <!-- Check icon when active -->
                @if (activeId() === tpl.id) {
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
  readonly subs       = inject(SubscriptionService);
  readonly categories = TEMPLATE_CATEGORIES;
  readonly activeId   = computed(() => this.store.activeResume()?.templateId);
  readonly showUpgrade = signal(false);

  templatesFor = getTemplatesByCategory;

  select(id: TemplateId): void {
    const tpl = this.templatesFor(
      this.categories.find(c => this.templatesFor(c.label).some(t => t.id === id))?.label ?? 'Classic & ATS-Safe'
    ).find(t => t.id === id);

    if (tpl?.isPremium && !this.subs.isPro()) {
      this.showUpgrade.set(true);
      return;
    }
    this.store.setTemplate(id);
  }
}
