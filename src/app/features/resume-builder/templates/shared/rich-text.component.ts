import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { parseRichText } from './rich-text';

/** Renders text containing `**bold**` markup, used by resume templates for bullet/summary text. */
@Component({
  selector: 'app-rich-text',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (run of runs(); track $index) {
      @if (run.bold) {
        <strong>{{ run.text }}</strong>
      } @else {
        {{ run.text }}
      }
    }
  `,
})
export class RichTextComponent {
  readonly text = input<string>('');
  readonly runs = computed(() => parseRichText(this.text()));
}
