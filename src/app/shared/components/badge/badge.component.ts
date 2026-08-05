import { Component, ChangeDetectionStrategy, input } from '@angular/core';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'pro' | 'neutral';

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  primary: 'badge-primary',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  info: 'badge-info',
  pro: 'badge-pro',
  neutral: 'badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
};

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="classes()"><ng-content /></span>
  `,
})
export class BadgeComponent {
  variant = input<BadgeVariant>('neutral');
  size = input<'sm' | 'md'>('md');

  classes(): string {
    return [VARIANT_CLASS[this.variant()], this.size() === 'sm' ? 'text-[10px] px-2 py-0.5' : ''].filter(Boolean).join(' ');
  }
}
