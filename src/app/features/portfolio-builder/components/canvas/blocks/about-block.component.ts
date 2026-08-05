import { Component, ChangeDetectionStrategy, ElementRef, ViewChild, inject, input, signal } from '@angular/core';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { AboutConfig, PortfolioSection, PortfolioTheme } from '../../../models/portfolio.model';
import { RichTextFieldComponent } from '../rich-text-field.component';
import { AiAssistButtonComponent } from '../../ai/ai-assist-button.component';
import { getThemePreset } from '../../../themes/shared/theme-presets';

@Component({
  selector: 'app-about-block',
  standalone: true,
  imports: [RichTextFieldComponent, AiAssistButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="max-w-2xl mx-auto px-4" [class]="preset().fontClass">
      <div class="flex items-center justify-between mb-3">
        <h3 [class]="preset().heading">About</h3>
        <app-ai-assist-button mode="rewrite" [text]="config().body" (result)="patch({ body: $event })" />
      </div>

      <app-rich-text-field [value]="config().body" placeholder="Tell your story — who you are, what you do, what drives you."
        [textClass]="'text-base ' + preset().body"
        (valueChange)="patch({ body: $event })" />

      <div class="flex flex-wrap items-center gap-2 mt-4">
        @for (h of config().highlights; track $index) {
          <span [class]="'inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 text-xs font-medium ' + preset().chip">
            {{ h }}
            <button type="button" (click)="removeHighlight($index)" class="w-4 h-4 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </span>
        }
        @if (adding()) {
          <input #newInput type="text" placeholder="e.g. 5+ years experience"
            class="px-3 py-1 rounded-full border border-primary-300 dark:border-primary-700 bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-primary-500 w-40"
            (keydown.enter)="commit(newInput.value); newInput.value = ''"
            (blur)="commit(newInput.value); newInput.value = ''" />
        } @else {
          <button type="button" (click)="startAdd()"
            class="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-dashed border-slate-300 dark:border-slate-600 text-xs font-medium text-slate-400 hover:border-primary-400 hover:text-primary-600 transition-colors">
            + Add highlight
          </button>
        }
      </div>
    </div>
  `,
})
export class AboutBlockComponent {
  section = input.required<PortfolioSection<AboutConfig>>();
  theme = input<PortfolioTheme | null>(null);

  private store = inject(PortfolioStoreService);

  preset() { return getThemePreset(this.theme()?.templateId); }

  readonly adding = signal(false);
  @ViewChild('newInput') newInputRef?: ElementRef<HTMLInputElement>;

  config(): AboutConfig { return this.section().config; }

  patch(patch: Partial<AboutConfig>): void {
    this.store.updateSectionConfig(this.section().id, patch);
  }

  startAdd(): void {
    this.adding.set(true);
    setTimeout(() => this.newInputRef?.nativeElement.focus(), 0);
  }

  commit(value: string): void {
    this.adding.set(false);
    const label = value.trim();
    if (label) this.patch({ highlights: [...this.config().highlights, label] });
  }

  removeHighlight(index: number): void {
    this.patch({ highlights: this.config().highlights.filter((_, i) => i !== index) });
  }
}
