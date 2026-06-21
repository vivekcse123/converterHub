import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { ResumeData, TemplateId } from '../../models/resume.model';
import { RESUME_TEMPLATES } from '../../data/resume-templates.data';
import { SubscriptionService } from '../../services/subscription.service';
import { ResumePreviewComponent } from '../preview/resume-preview.component';

type FilterId =
  | 'all'
  | 'Classic & ATS-Safe'
  | 'Modern & Professional'
  | 'Creative & Bold'
  | 'Executive & Two-Column'
  | 'free'
  | 'premium';

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all',                        label: 'All Templates'  },
  { id: 'Classic & ATS-Safe',         label: '📋 ATS-Safe'   },
  { id: 'Modern & Professional',      label: '💼 Modern'      },
  { id: 'Creative & Bold',            label: '🎨 Creative'    },
  { id: 'Executive & Two-Column',     label: '👔 Executive'   },
  { id: 'free',                       label: '✓ Free'         },
  { id: 'premium',                    label: '⭐ Pro'          },
];

@Component({
  selector: 'app-template-gallery-modal',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet, ResumePreviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-[60] flex flex-col bg-white" style="overflow:hidden">

      <!-- ══ Header ══ -->
      <header class="shrink-0 h-14 border-b border-slate-100 px-5 flex items-center gap-4 bg-white">

        <!-- Title -->
        <div class="flex items-center gap-3 shrink-0">
          <div class="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z
                       M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z
                       M16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-sm font-bold text-slate-900 leading-tight">Browse Templates</h2>
            <p class="text-[10px] text-slate-400 leading-tight">
              {{ filteredTemplates().length }} of {{ allTemplates.length }} · All ATS-friendly
            </p>
          </div>
        </div>

        <!-- Search -->
        <div class="relative flex-1 max-w-xs">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="search"
            placeholder="Search templates…"
            [value]="searchQuery()"
            (input)="onSearch($event)"
            class="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl
                   outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                   transition-all placeholder:text-slate-400"
          />
        </div>

        <div class="flex-1 hidden sm:block"></div>

        <!-- Close -->
        <button type="button" (click)="close.emit()"
                class="w-8 h-8 flex items-center justify-center rounded-xl
                       hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </header>

      <!-- ══ Filter tabs ══ -->
      <div class="shrink-0 border-b border-slate-100 bg-white px-5 py-2.5 flex items-center gap-2 overflow-x-auto"
           style="scrollbar-width:none">
        @for (f of filters; track f.id) {
          <button type="button"
                  (click)="activeFilter.set(f.id)"
                  class="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap"
                  [class]="activeFilter() === f.id
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'">
            {{ f.label }}
          </button>
        }
      </div>

      <!-- ══ Body: grid + preview panel ══ -->
      <div class="flex-1 flex overflow-hidden">

        <!-- ─ Template grid ─ -->
        <div class="flex-1 overflow-y-auto p-5">

          @if (filteredTemplates().length === 0) {
            <!-- Empty state -->
            <div class="flex flex-col items-center justify-center min-h-full py-20 text-center">
              <div class="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <p class="text-sm font-semibold text-slate-700">No templates found</p>
              <p class="text-xs text-slate-400 mt-1">Try a different search or filter</p>
              <button type="button"
                      (click)="searchQuery.set(''); activeFilter.set('all')"
                      class="mt-3 text-xs font-semibold text-violet-600 hover:underline">
                Clear filters
              </button>
            </div>

          } @else {
            <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(160px, 1fr))">
              @for (tpl of filteredTemplates(); track tpl.id) {

                <div class="group cursor-pointer" (click)="select(tpl.id)">
                  <div class="rounded-2xl border-2 overflow-hidden transition-all duration-150 will-change-transform"
                       [class]="selectedId() === tpl.id
                         ? 'border-violet-500 shadow-xl shadow-violet-100/60 ring-2 ring-violet-200'
                         : 'border-slate-200 hover:border-violet-300 hover:shadow-xl hover:-translate-y-0.5'">

                    <!-- Thumbnail (A4 ratio ≈ 160 × 226 px) -->
                    <div class="relative bg-white overflow-hidden" style="height:226px">

                      <!-- Scaled full-size template component (live preview with user data) -->
                      <div style="position:absolute;top:0;left:0;width:794px;height:1123px;
                                  transform:scale(0.2015);transform-origin:top left;
                                  pointer-events:none;overflow:hidden">
                        <ng-container *ngComponentOutlet="tpl.component; inputs: { resume: thumbnailResumes()[tpl.id] }" />
                      </div>

                      <!-- Free / Pro badge (always on top) -->
                      <div class="absolute top-1.5 left-1.5 z-10">
                        @if (tpl.isPremium) {
                          <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400 text-white shadow-sm">⭐ Pro</span>
                        } @else {
                          <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm">Free</span>
                        }
                      </div>

                      <!-- ATS badge -->
                      <div class="absolute bottom-1.5 right-1.5 z-10">
                        <span class="text-[9px] font-semibold px-1.5 py-0.5 rounded-full
                                     bg-white/95 shadow border border-slate-100 text-slate-700">
                          {{ tpl.atsScore }}% ATS
                        </span>
                      </div>

                      <!-- Selected overlay -->
                      @if (selectedId() === tpl.id) {
                        <div class="absolute inset-0 bg-violet-600/5 flex items-end justify-center pb-3 z-10">
                          <span class="bg-violet-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                            ✓ Selected
                          </span>
                        </div>
                      }

                      <!-- Hover hint (desktop only) -->
                      @if (selectedId() !== tpl.id) {
                        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent
                                    opacity-0 group-hover:opacity-100 transition-opacity
                                    flex items-end justify-center pb-3 z-10">
                          <span class="bg-white text-violet-700 text-[10px] font-bold px-3 py-1 rounded-full shadow-lg
                                       opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all">
                            Preview →
                          </span>
                        </div>
                      }

                    </div><!-- /thumbnail -->

                    <!-- Card footer -->
                    <div class="px-3 py-2.5 bg-white border-t border-slate-100">
                      <p class="text-xs font-bold text-slate-800 truncate">{{ tpl.name }}</p>
                      <p class="text-[10px] text-slate-400 mt-0.5 truncate leading-tight">{{ tpl.category }}</p>
                    </div>

                  </div>
                </div>

              }
            </div>
          }
        </div>

        <!-- ─ Preview panel (desktop only) ─ -->
        <aside class="shrink-0 hidden lg:flex w-[360px] xl:w-[400px] flex-col border-l border-slate-100 bg-slate-50/50">

          @if (selectedTemplate(); as tpl) {

            <!-- Template info bar -->
            <div class="shrink-0 px-5 py-4 bg-white border-b border-slate-100">
              <div class="flex items-start gap-3">
                <!-- Color chip -->
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-sm"
                     [class]="tpl.accent">
                  <span class="text-white font-bold text-sm drop-shadow">Aa</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="text-sm font-bold text-slate-900">{{ tpl.name }}</h3>
                    @if (tpl.isPremium) {
                      <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">⭐ Pro</span>
                    } @else {
                      <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Free</span>
                    }
                  </div>
                  <div class="flex items-center gap-2 mt-1 text-[11px] flex-wrap">
                    <span class="font-semibold text-emerald-600">{{ tpl.atsScore }}% ATS</span>
                    <span class="text-slate-300">·</span>
                    <span class="text-slate-500">{{ tpl.category }}</span>
                  </div>
                  <p class="text-[11px] text-slate-400 mt-1.5 leading-relaxed line-clamp-2">{{ tpl.bestFor }}</p>
                </div>
              </div>
            </div>

            <!-- Live preview with user's actual data -->
            <div class="flex-1 overflow-y-auto p-4">
              @if (previewResume(); as r) {
                <app-resume-preview [resume]="r" [showControls]="false" />
              }
            </div>

            <!-- CTA -->
            <div class="shrink-0 px-5 py-4 bg-white border-t border-slate-100 space-y-2">
              @if (tpl.isPremium && !subs.isPro()) {
                <button type="button" (click)="apply()"
                        class="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600
                               hover:from-amber-600 hover:to-amber-700
                               text-white text-sm font-bold rounded-xl transition-all shadow-sm active:scale-[0.98]">
                  ⭐ Use Template — Upgrade to Download
                </button>
                <p class="text-[10px] text-slate-400 text-center">
                  Preview free · Pro required to download without watermark
                </p>
              } @else {
                <button type="button" (click)="apply()"
                        class="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold
                               rounded-xl transition-all shadow-sm active:scale-[0.98]">
                  Use This Template →
                </button>
              }
            </div>

          } @else {
            <!-- No template selected: placeholder -->
            <div class="flex-1 flex flex-col items-center justify-center text-center px-8">
              <div class="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z
                           M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z
                           M16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
                </svg>
              </div>
              <p class="text-sm font-bold text-slate-700 mb-2">Click a template to preview</p>
              <p class="text-xs text-slate-400 leading-relaxed max-w-[200px]">
                See a live preview built from your actual resume data
              </p>
            </div>
          }

        </aside>

      </div><!-- /body -->

      <!-- Mobile apply bar (shows when a template is selected) -->
      @if (selectedId()) {
        <div class="lg:hidden shrink-0 border-t border-slate-200 bg-white px-4 py-3 flex items-center gap-3">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-slate-900 truncate">{{ selectedTemplate()?.name }}</p>
            <p class="text-[11px] text-slate-400">{{ selectedTemplate()?.atsScore }}% ATS</p>
          </div>
          <button type="button" (click)="apply()"
                  class="shrink-0 px-5 py-2.5 bg-violet-600 hover:bg-violet-700
                         text-white text-sm font-bold rounded-xl transition-colors">
            Use Template →
          </button>
        </div>
      }

    </div><!-- /modal root -->
  `,
})
export class TemplateGalleryModalComponent {
  readonly subs = inject(SubscriptionService);

  readonly resume            = input.required<ResumeData>();
  readonly close             = output<void>();
  readonly templateApplied   = output<TemplateId>();

  readonly filters     = FILTERS;
  readonly allTemplates = RESUME_TEMPLATES;

  readonly searchQuery  = signal('');
  readonly activeFilter = signal<FilterId>('all');
  readonly selectedId   = signal<TemplateId | null>(null);

  /** One resume object per template ID, all using the user's actual data. */
  readonly thumbnailResumes = computed(() => {
    const r = this.resume();
    const map: Record<string, ResumeData> = {};
    for (const tpl of RESUME_TEMPLATES) {
      map[tpl.id] = { ...r, templateId: tpl.id as TemplateId };
    }
    return map;
  });

  readonly filteredTemplates = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const f = this.activeFilter();
    return this.allTemplates.filter(t => {
      const matchQ = !q || t.name.toLowerCase().includes(q)
                       || t.category.toLowerCase().includes(q)
                       || t.bestFor.toLowerCase().includes(q);
      const matchF = f === 'all'     ? true
                   : f === 'free'    ? !t.isPremium
                   : f === 'premium' ? t.isPremium
                   : (t.category as string) === f;
      return matchQ && matchF;
    });
  });

  readonly selectedTemplate = computed(() =>
    this.allTemplates.find(t => t.id === this.selectedId()) ?? null
  );

  readonly previewResume = computed<ResumeData | null>(() => {
    const id = this.selectedId();
    return id ? (this.thumbnailResumes()[id] ?? null) : null;
  });

  @HostListener('document:keydown.escape')
  onEsc(): void { this.close.emit(); }

  onSearch(e: Event): void {
    this.searchQuery.set((e.target as HTMLInputElement).value);
  }

  select(id: TemplateId): void { this.selectedId.set(id); }

  apply(): void {
    const id = this.selectedId();
    if (!id) return;
    this.templateApplied.emit(id);
    this.close.emit();
  }
}
