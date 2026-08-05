import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

interface Requirement {
  label: string;
  met: boolean;
}

const LEVELS = [
  { label: '', color: '' },
  { label: 'Weak', color: 'bg-red-500' },
  { label: 'Fair', color: 'bg-amber-500' },
  { label: 'Good', color: 'bg-yellow-500' },
  { label: 'Strong', color: 'bg-emerald-500' },
  { label: 'Very strong', color: 'bg-emerald-600' },
];

@Component({
  selector: 'app-password-strength',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    @if (password().length > 0) {
      <div class="mt-2.5 animate-fade-in">
        <div class="flex items-center gap-1.5">
          @for (i of [0, 1, 2, 3, 4]; track i) {
            <span class="h-1.5 flex-1 rounded-full transition-colors duration-200"
              [class]="i < score() ? level().color : 'bg-slate-200 dark:bg-slate-700'"></span>
          }
        </div>
        @if (level().label) {
          <p class="mt-1.5 text-xs font-medium" [class]="scoreTextClass()">{{ level().label }}</p>
        }

        <ul class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5">
          @for (r of requirements(); track r.label) {
            <li class="flex items-center gap-1.5 text-xs transition-colors duration-150"
                [class]="r.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'">
              <app-icon [name]="r.met ? 'check' : 'close'" [size]="12" [strokeWidth]="2.5" />
              {{ r.label }}
            </li>
          }
        </ul>
      </div>
    }
  `,
})
export class PasswordStrengthComponent {
  password = input('');

  requirements = computed<Requirement[]>(() => {
    const pw = this.password();
    return [
      { label: '8+ characters', met: pw.length >= 8 },
      { label: 'Uppercase letter', met: /[A-Z]/.test(pw) },
      { label: 'Lowercase letter', met: /[a-z]/.test(pw) },
      { label: 'Number', met: /[0-9]/.test(pw) },
      { label: 'Special character', met: /[^A-Za-z0-9]/.test(pw) },
    ];
  });

  score = computed(() => this.requirements().filter(r => r.met).length);

  level = computed(() => LEVELS[this.score()]);

  scoreTextClass(): string {
    const s = this.score();
    if (s <= 1) return 'text-red-500';
    if (s === 2) return 'text-amber-500';
    if (s === 3) return 'text-yellow-600 dark:text-yellow-500';
    return 'text-emerald-600 dark:text-emerald-400';
  }
}
