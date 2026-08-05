import { Component, ChangeDetectionStrategy, ElementRef, ViewChild, input, output } from '@angular/core';

@Component({
  selector: 'app-inline-text-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    @if (multiline()) {
      <textarea #el
        [value]="value()"
        [placeholder]="placeholder()"
        [attr.rows]="rows()"
        [attr.aria-label]="ariaLabel()"
        (input)="onInput(el.value)"
        [class]="'w-full bg-transparent resize-none border border-transparent hover:border-dashed hover:border-slate-300 dark:hover:border-slate-600 focus:border-solid focus:border-primary-400 rounded-lg px-2 -mx-2 py-1 outline-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 ' + textClass()"
      ></textarea>
    } @else {
      <input #el type="text"
        [value]="value()"
        [placeholder]="placeholder()"
        [attr.aria-label]="ariaLabel()"
        (input)="onInput(el.value)"
        [class]="'w-full bg-transparent border border-transparent hover:border-dashed hover:border-slate-300 dark:hover:border-slate-600 focus:border-solid focus:border-primary-400 rounded-lg px-2 -mx-2 py-1 outline-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 ' + textClass()"
      />
    }
  `,
})
export class InlineTextFieldComponent {
  value = input('');
  placeholder = input('');
  multiline = input(false);
  rows = input(3);
  textClass = input('');
  ariaLabel = input('Edit text');
  valueChange = output<string>();

  @ViewChild('el') elRef?: ElementRef<HTMLInputElement | HTMLTextAreaElement>;

  onInput(v: string): void {
    this.valueChange.emit(v);
  }
}
