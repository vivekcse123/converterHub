import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStoreService } from '../../../services/resume-store.service';
import { BOLD_BTN_CLASS, applyBoldToggle, inputValue } from '../editor-utils';

@Component({
  selector: 'app-achievements-form',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-3">
      @for (item of achievements(); track $index) {
        <div class="flex gap-2">
          <textarea
            #itemEl
            class="input min-h-[44px] resize-y flex-1"
            [value]="item"
            (input)="patch($index, $event)"
            placeholder="Winner, Smart India Hackathon 2019 — built an AI-based crop disease detection app."
          ></textarea>
          <div class="flex flex-col items-center gap-1.5 pt-0.5">
            <button type="button" [class]="boldBtnClass" (click)="toggleBold($index, itemEl)" title="Bold selected text">B</button>
            <button type="button" class="text-slate-400 hover:text-red-500 transition-colors" (click)="store.removeAchievement($index)" aria-label="Remove achievement">✕</button>
          </div>
        </div>
      }
    </div>
    <button type="button" class="btn btn-primary btn-sm mt-3" (click)="store.addAchievement()">+ Add Achievement</button>
  `,
})
export class AchievementsFormComponent {
  readonly store = inject(ResumeStoreService);
  readonly resume = computed(() => this.store.activeResume());
  readonly achievements = computed(() => this.resume()?.achievements ?? []);
  readonly boldBtnClass = BOLD_BTN_CLASS;

  patch(index: number, event: Event): void {
    this.store.updateAchievement(index, inputValue(event));
  }

  toggleBold(index: number, textarea: HTMLTextAreaElement): void {
    this.store.updateAchievement(index, applyBoldToggle(textarea));
  }
}
