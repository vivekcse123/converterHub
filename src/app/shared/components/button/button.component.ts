import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

const SIZE_CLASS: Record<ButtonSize, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading() || null"
      [class]="classes()"
      (click)="clicked.emit($event)"
    >
      @if (loading()) {
        <app-icon name="spinner" [size]="iconSize()" />
      }
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  disabled = input(false);
  loading = input(false);
  type = input<'button' | 'submit'>('button');
  fullWidth = input(false);

  clicked = output<MouseEvent>();

  iconSize(): number {
    return { xs: 14, sm: 16, md: 18, lg: 20 }[this.size()];
  }

  classes(): string {
    return [
      `btn-${this.variant()}`,
      SIZE_CLASS[this.size()],
      this.fullWidth() ? 'w-full' : '',
    ].filter(Boolean).join(' ');
  }
}
