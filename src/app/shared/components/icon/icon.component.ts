import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ICON_PATHS, IconName } from '../../data/icon-paths.data';

@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      [class]="'shrink-0 ' + spinClass()"
    >
      @for (d of paths(); track d) {
        <path stroke-linecap="round" stroke-linejoin="round" [attr.stroke-width]="strokeWidth()" [attr.d]="d" />
      }
    </svg>
  `,
})
export class IconComponent {
  name = input.required<IconName>();
  size = input<number>(20);
  strokeWidth = input<number>(2);

  paths(): string[] {
    return ICON_PATHS[this.name()];
  }

  spinClass(): string {
    return this.name() === 'spinner' ? 'animate-spin-slow' : '';
  }
}
