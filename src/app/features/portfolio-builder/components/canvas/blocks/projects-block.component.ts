import { Component, ChangeDetectionStrategy, inject, input, signal } from '@angular/core';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { PortfolioSection, PortfolioTheme, ProjectItem, ProjectsConfig, uid } from '../../../models/portfolio.model';
import { InlineTextFieldComponent } from '../inline-text-field.component';
import { InlineImageFieldComponent } from '../inline-image-field.component';
import { RichTextFieldComponent } from '../rich-text-field.component';
import { AiAssistButtonComponent } from '../../ai/ai-assist-button.component';
import { IconComponent } from '../../../../../shared/components/icon/icon.component';
import { getThemePreset } from '../../../themes/shared/theme-presets';

@Component({
  selector: 'app-projects-block',
  standalone: true,
  imports: [InlineTextFieldComponent, InlineImageFieldComponent, RichTextFieldComponent, AiAssistButtonComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="max-w-4xl mx-auto px-4" [class]="preset().fontClass">
      <h3 [class]="preset().heading + ' mb-4'">Projects</h3>

      <div class="grid sm:grid-cols-2 gap-5">
        @for (item of config().items; track item; let itemIdx = $index) {
          <div [class]="preset().card + ' overflow-hidden'">
            <app-inline-image-field [url]="item.imageUrl" kind="cover" shape="wide" size="full"
              (urlChange)="patchItem(itemIdx, { imageUrl: $event })" />

            <div class="p-4">
              <div class="flex items-start justify-between gap-2">
                <app-inline-text-field [value]="item.title" placeholder="Project title" [textClass]="'text-sm ' + preset().title"
                  ariaLabel="Project title" (valueChange)="patchItem(itemIdx, { title: $event })" />
                <button type="button" (click)="patchItem(itemIdx, { featured: !item.featured })" [title]="item.featured ? 'Featured' : 'Mark as featured'"
                        class="shrink-0" [class]="item.featured ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'">
                  <svg width="16" height="16" viewBox="0 0 24 24" [attr.fill]="item.featured ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </button>
              </div>

              <div class="flex items-center justify-between mt-1.5 mb-1">
                <span class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Description</span>
                <app-ai-assist-button mode="rewrite" [text]="item.description" (result)="patchItem(itemIdx, { description: $event })" />
              </div>
              <app-rich-text-field [value]="item.description" placeholder="What does this project do?"
                textClass="text-xs text-slate-500 dark:text-slate-400"
                (valueChange)="patchItem(itemIdx, { description: $event })" />

              <div class="grid grid-cols-2 gap-2 mt-3">
                <div class="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <app-icon name="arrow-right" [size]="11" class="text-slate-400 shrink-0" />
                  <app-inline-text-field [value]="item.url ?? ''" placeholder="Live URL" textClass="text-[11px] text-slate-500"
                    ariaLabel="Live URL" (valueChange)="patchItem(itemIdx, { url: $event })" />
                </div>
                <div class="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <app-icon name="key" [size]="11" class="text-slate-400 shrink-0" />
                  <app-inline-text-field [value]="item.githubUrl ?? ''" placeholder="GitHub URL" textClass="text-[11px] text-slate-500"
                    ariaLabel="GitHub URL" (valueChange)="patchItem(itemIdx, { githubUrl: $event })" />
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-1.5 mt-3">
                @for (tag of item.tags; track tag; let tagIdx = $index) {
                  <span [class]="'inline-flex items-center gap-1 pl-2 pr-1 py-0.5 text-[10px] font-semibold ' + preset().chip">
                    {{ tag }}
                    <button type="button" (click)="removeTag(itemIdx, tagIdx)" class="w-3 h-3 rounded-full hover:bg-primary-100 dark:hover:bg-primary-800 flex items-center justify-center">
                      <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </span>
                }
                @if (addingTagFor() === itemIdx) {
                  <input #ti type="text" placeholder="Tag" autofocus
                    class="px-2 py-0.5 rounded-full border border-primary-300 dark:border-primary-700 bg-white dark:bg-slate-800 text-[10px] outline-none w-16"
                    (keydown.enter)="commitTag(itemIdx, ti.value); ti.value = ''"
                    (blur)="commitTag(itemIdx, ti.value); ti.value = ''" />
                } @else {
                  <button type="button" (click)="addingTagFor.set(itemIdx)" class="text-[10px] text-slate-400 hover:text-primary-600 font-semibold">+ tag</button>
                }
              </div>

              <button type="button" (click)="removeItem(itemIdx)" class="mt-3 text-[11px] text-slate-400 hover:text-red-500">Remove project</button>
            </div>
          </div>
        }
      </div>

      <button type="button" (click)="addItem()"
        class="mt-5 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors">
        + Add project
      </button>
    </div>
  `,
})
export class ProjectsBlockComponent {
  section = input.required<PortfolioSection<ProjectsConfig>>();
  theme = input<PortfolioTheme | null>(null);

  private store = inject(PortfolioStoreService);
  readonly addingTagFor = signal<number | null>(null);

  preset() { return getThemePreset(this.theme()?.templateId); }

  config(): ProjectsConfig { return this.section().config; }

  private patch(patch: Partial<ProjectsConfig>): void {
    this.store.updateSectionConfig(this.section().id, patch);
  }

  private updateItems(fn: (items: ProjectItem[]) => ProjectItem[]): void {
    this.patch({ items: fn(this.config().items) });
  }

  addItem(): void {
    this.updateItems(items => [...items, { title: '', description: '', tags: [], featured: false }]);
  }

  removeItem(index: number): void {
    this.updateItems(items => items.filter((_, i) => i !== index));
  }

  patchItem(index: number, patch: Partial<ProjectItem>): void {
    this.updateItems(items => items.map((it, i) => i === index ? { ...it, ...patch } : it));
  }

  commitTag(itemIndex: number, value: string): void {
    this.addingTagFor.set(null);
    const tag = value.trim();
    if (!tag) return;
    this.updateItems(items => items.map((it, i) => i === itemIndex ? { ...it, tags: [...it.tags, tag] } : it));
  }

  removeTag(itemIndex: number, tagIndex: number): void {
    this.updateItems(items => items.map((it, i) =>
      i === itemIndex ? { ...it, tags: it.tags.filter((_, ti) => ti !== tagIndex) } : it));
  }
}
