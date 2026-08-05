import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

let uid = 0;

@Component({
  selector: 'app-password-field',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div>
      <label [for]="id" class="sr-only">{{ label() }}</label>
      <div class="relative">
        <span class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
          <app-icon name="lock" [size]="18" />
        </span>
        <input
          [id]="id"
          [type]="visible() ? 'text' : 'password'"
          [name]="name()"
          [value]="value()"
          (input)="onInput($event)"
          (keyup)="onKeyEvent($event)"
          (keydown)="onKeyEvent($event)"
          [required]="required()"
          [attr.minlength]="minlength() || null"
          [attr.autocomplete]="autocomplete()"
          [placeholder]="placeholder()"
          [attr.aria-describedby]="capsLockOn() ? id + '-capslock' : null"
          class="input pl-11 pr-11 lg:py-3.5 lg:text-[15px]"
        />
        <button type="button" (click)="visible.set(!visible())"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          [attr.aria-label]="visible() ? 'Hide password' : 'Show password'">
          <app-icon [name]="visible() ? 'eye-off' : 'eye'" [size]="18" />
        </button>
      </div>
      @if (capsLockOn()) {
        <p [id]="id + '-capslock'" class="mt-1.5 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400" role="status">
          <app-icon name="warning" [size]="13" />
          Caps Lock is on
        </p>
      }
      <ng-content />
    </div>
  `,
})
export class PasswordFieldComponent {
  readonly id = `pw-field-${uid++}`;

  label = input('Password');
  name = input('password');
  placeholder = input('••••••••');
  autocomplete = input('current-password');
  required = input(true);
  minlength = input<number | null>(null);
  value = input('');

  valueChange = output<string>();

  readonly visible = signal(false);
  readonly capsLockOn = signal(false);

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }

  onKeyEvent(event: KeyboardEvent): void {
    if (typeof event.getModifierState === 'function') {
      this.capsLockOn.set(event.getModifierState('CapsLock'));
    }
  }
}
