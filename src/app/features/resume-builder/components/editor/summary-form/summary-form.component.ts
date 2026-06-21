import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStoreService } from '../../../services/resume-store.service';
import { BOLD_BTN_CLASS, applyBoldToggle, inputValue, wordCount } from '../editor-utils';

@Component({
  selector: 'app-summary-form',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (resume(); as r) {
      <div class="flex justify-end mb-1">
        <button type="button" [class]="boldBtnClass" (click)="toggleBold(summaryEl)" title="Bold selected text">B</button>
      </div>
      <textarea
        #summaryEl
        class="input min-h-[140px] resize-y"
        [value]="r.summary"
        (input)="update($event)"
        placeholder="Results-driven Software Engineer with 4+ years of experience building scalable web applications. Skilled in Angular, Node.js, and cloud infrastructure. Increased page load speed by 35% and improved user retention by 18% through performance optimization."
      ></textarea>
      <div class="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
        <span>{{ words() }} words</span>
        @if (words() < 40) {
          <span class="text-amber-600 dark:text-amber-400">Aim for 40–80 words for best ATS results.</span>
        } @else if (words() > 120) {
          <span class="text-amber-600 dark:text-amber-400">Consider trimming - keep it concise (40–100 words).</span>
        } @else {
          <span class="text-emerald-600 dark:text-emerald-400">✓ Good length</span>
        }
      </div>
    }
  `,
})
export class SummaryFormComponent {
  private readonly store = inject(ResumeStoreService);
  readonly resume = computed(() => this.store.activeResume());
  readonly words = computed(() => wordCount(this.resume()?.summary ?? ''));
  readonly boldBtnClass = BOLD_BTN_CLASS;

  update(event: Event): void {
    this.store.updateSummary(inputValue(event));
  }

  toggleBold(textarea: HTMLTextAreaElement): void {
    this.store.updateSummary(applyBoldToggle(textarea));
  }
}
