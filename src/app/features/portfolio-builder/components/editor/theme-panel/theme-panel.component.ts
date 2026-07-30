import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { PortfolioTheme } from '../../../models/portfolio.model';

@Component({
  selector: 'app-theme-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (store.portfolio(); as p) {
      <div class="space-y-5">

        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2.5">Accent color</label>
          <div class="flex items-center gap-2 flex-wrap mb-2.5">
            @for (c of presetColors; track c) {
              <button type="button" class="w-8 h-8 rounded-full shrink-0 transition-transform hover:scale-110"
                      [style.background]="c"
                      [style.box-shadow]="isSelected(p.theme.accentColor, c) ? '0 0 0 2px var(--tw-ring-offset-color, white), 0 0 0 4px ' + c : 'none'"
                      (click)="update({ accentColor: c })"
                      [attr.aria-label]="'Use ' + c">
                @if (isSelected(p.theme.accentColor, c)) {
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" class="w-4 h-4 mx-auto"><path d="M5 12l5 5L19 7"/></svg>
                }
              </button>
            }
          </div>
          <div class="flex items-center gap-2">
            <input type="color" [ngModel]="p.theme.accentColor" (ngModelChange)="update({ accentColor: $event })"
                   class="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent shrink-0" />
            <input type="text" [ngModel]="p.theme.accentColor" (ngModelChange)="update({ accentColor: $event })"
                   class="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-0" />
          </div>
        </div>

        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2.5">Typography</label>
          <select [ngModel]="p.theme.fontFamily" (ngModelChange)="update({ fontFamily: $event })"
                  class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            @for (f of fonts; track f.value) { <option [value]="f.value">{{ f.label }}</option> }
          </select>
        </div>

        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2.5">Mode</label>
          <div class="grid grid-cols-2 gap-2">
            @for (m of modes; track m.value) {
              <button type="button" class="flex flex-col items-center gap-1.5 py-2.5 rounded-xl border-[1.5px] text-[11px] font-semibold transition-colors"
                      [class]="p.theme.mode === m.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'"
                      (click)="update({ mode: m.value })">
                <span class="text-base leading-none">{{ m.icon }}</span>{{ m.label }}
              </button>
            }
          </div>
        </div>

        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2.5">Layout width</label>
          <div class="grid grid-cols-2 gap-2">
            @for (w of widths; track w.value) {
              <button type="button" class="py-2.5 rounded-xl border-[1.5px] text-[11px] font-semibold capitalize transition-colors"
                      [class]="p.theme.layoutWidth === w.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'"
                      (click)="update({ layoutWidth: w.value })">
                {{ w.label }}
              </button>
            }
          </div>
        </div>

        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2.5">Corner radius</label>
          <div class="grid grid-cols-3 gap-2">
            @for (r of radii; track r.value) {
              <button type="button" class="py-2.5 rounded-xl border-[1.5px] text-[11px] font-semibold capitalize transition-colors flex flex-col items-center gap-1.5"
                      [class]="p.theme.radius === r.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'"
                      (click)="update({ radius: r.value })">
                <span class="w-4 h-4 bg-current opacity-60" [style.border-radius]="r.preview"></span>
                {{ r.label }}
              </button>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class ThemePanelComponent {
  readonly store = inject(PortfolioStoreService);

  readonly presetColors = ['#7c3aed', '#2563eb', '#16a34a', '#e11d48', '#ea580c', '#0f172a'];

  readonly fonts: { value: PortfolioTheme['fontFamily']; label: string }[] = [
    { value: 'inter', label: 'Inter (Sans)' },
    { value: 'poppins', label: 'Poppins (Sans)' },
    { value: 'georgia', label: 'Georgia (Serif)' },
    { value: 'jetbrains-mono', label: 'JetBrains Mono' },
  ];
  readonly modes: { value: PortfolioTheme['mode']; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
  ];
  readonly widths: { value: PortfolioTheme['layoutWidth']; label: string }[] = [
    { value: 'narrow', label: 'Narrow' },
    { value: 'wide', label: 'Wide' },
  ];
  readonly radii: { value: PortfolioTheme['radius']; label: string; preview: string }[] = [
    { value: 'sharp', label: 'Sharp', preview: '2px' },
    { value: 'rounded', label: 'Rounded', preview: '6px' },
    { value: 'pill', label: 'Pill', preview: '9999px' },
  ];

  isSelected(current: string, candidate: string): boolean {
    return current?.toLowerCase() === candidate.toLowerCase();
  }

  update(patch: Partial<PortfolioTheme>): void {
    this.store.updateTheme(patch);
  }
}
