import { Component, ChangeDetectionStrategy, input } from '@angular/core';

export type CardVariant = 'static' | 'hover' | 'interactive' | 'elevated' | 'bordered' | 'gradient';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const VARIANT_CLASS: Record<CardVariant, string> = {
  static: 'card',
  hover: 'card-hover',
  interactive: 'card-interactive',
  elevated: 'card-elevated',
  bordered: 'card-bordered',
  gradient: 'card-gradient',
};

const PADDING_CLASS: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="classes()"><ng-content /></div>
  `,
})
export class CardComponent {
  variant = input<CardVariant>('static');
  padding = input<CardPadding>('md');

  classes(): string {
    return [VARIANT_CLASS[this.variant()], PADDING_CLASS[this.padding()]].filter(Boolean).join(' ');
  }
}
