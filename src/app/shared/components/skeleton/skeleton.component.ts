import { Component, ChangeDetectionStrategy, input } from '@angular/core';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

const VARIANT_RADIUS: Record<SkeletonVariant, string> = {
  text: 'rounded-md',
  circle: 'rounded-full',
  rect: 'rounded-lg',
};

@Component({
  selector: 'app-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="skeleton block"
      [class]="VARIANT_RADIUS[variant()]"
      [style.width]="width()"
      [style.height]="height()"
      aria-hidden="true"
    ></span>
  `,
})
export class SkeletonComponent {
  variant = input<SkeletonVariant>('rect');
  width = input<string>('100%');
  height = input<string>('1rem');

  readonly VARIANT_RADIUS = VARIANT_RADIUS;
}
