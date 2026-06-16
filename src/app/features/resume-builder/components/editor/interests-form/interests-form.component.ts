import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStoreService } from '../../../services/resume-store.service';
import { LABEL_CLASS, inputValue } from '../editor-utils';

@Component({
  selector: 'app-interests-form',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (resume(); as r) {
      <label [class]="labelClass">Interests (comma-separated)</label>
      <input class="input" [value]="r.interests.join(', ')" (input)="update($event)" placeholder="Open source, Photography, Chess" />
    }
  `,
})
export class InterestsFormComponent {
  private readonly store = inject(ResumeStoreService);
  readonly resume = computed(() => this.store.activeResume());
  readonly labelClass = LABEL_CLASS;

  update(event: Event): void {
    this.store.setInterestsFromText(inputValue(event));
  }
}
