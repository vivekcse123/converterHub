import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

export type AvatarSize = 'sm' | 'md' | 'lg';

const SIZE_CLASS: Record<AvatarSize, string> = {
  sm: 'w-7 h-7 text-[11px]',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
};

@Component({
  selector: 'app-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (imageUrl()) {
      <img
        [src]="imageUrl()"
        [alt]="name()"
        [class]="'rounded-full object-cover shrink-0 ' + SIZE_CLASS[size()]"
      />
    } @else {
      <span
        [class]="'rounded-full shrink-0 inline-flex items-center justify-center font-semibold text-white ' + SIZE_CLASS[size()]"
        [style.background-image]="'var(--gradient-brand)'"
        aria-hidden="true"
      >{{ initials() }}</span>
    }
  `,
})
export class AvatarComponent {
  name = input<string>('');
  imageUrl = input<string | null | undefined>(null);
  size = input<AvatarSize>('md');

  readonly SIZE_CLASS = SIZE_CLASS;

  initials = computed(() => {
    const parts = this.name().trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    const first = parts[0][0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : '';
    return (first + last).toUpperCase();
  });
}
