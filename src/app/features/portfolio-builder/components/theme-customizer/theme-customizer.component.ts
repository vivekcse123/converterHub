import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PortfolioStoreService } from '../../services/portfolio-store.service';
import { PortfolioTheme } from '../../models/portfolio.model';
import { getPortfolioThemeMeta } from '../../data/portfolio-themes.data';

const PRESET_COLORS = ['#4f46e5', '#7c3aed', '#2563eb', '#0ea5e9', '#16a34a', '#e11d48', '#ea580c', '#0f172a'];

@Component({
  selector: 'app-theme-customizer',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    @if (store.portfolio(); as p) {
      <div class="p-4 space-y-6">

        <section>
          <h4 class="prop-label">Accent color</h4>
          <div class="flex items-center gap-2 flex-wrap mb-2.5">
            @for (c of presetColors; track c) {
              <button type="button" class="w-7 h-7 rounded-full shrink-0 transition-transform hover:scale-110 flex items-center justify-center"
                      [style.background]="c" (click)="update({ accentColor: c })">
                @if (isColor(p.theme.accentColor, c)) {
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M5 12l5 5L19 7"/></svg>
                }
              </button>
            }
            <input type="color" [ngModel]="p.theme.accentColor" (ngModelChange)="update({ accentColor: $event })"
                   class="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent shrink-0" />
          </div>
        </section>

        <section>
          <h4 class="prop-label">Typography</h4>
          <select [ngModel]="p.theme.fontFamily" (ngModelChange)="update({ fontFamily: $event })"
                  class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            @for (f of fonts; track f.value) { <option [value]="f.value">{{ f.label }}</option> }
          </select>
        </section>

        <section>
          <h4 class="prop-label">Mode</h4>
          @if (modeLocked(p.theme.templateId); as locked) {
            <div class="grid grid-cols-2 gap-2">
              @for (m of modes; track m.value) {
                <button type="button" class="py-2.5 rounded-xl border-2 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
                        [disabled]="locked"
                        [class]="p.theme.mode === m.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-700 text-slate-500'"
                        [class.opacity-40]="locked" [class.cursor-not-allowed]="locked"
                        (click)="!locked && update({ mode: m.value })">
                  {{ m.icon }} {{ m.label }}
                </button>
              }
            </div>
            <p class="text-[11px] text-slate-400 mt-2">{{ modeHint(p.theme.templateId) }}</p>
          }
        </section>

        <section>
          <h4 class="prop-label">Container width</h4>
          <div class="grid grid-cols-2 gap-2">
            @for (w of widths; track w.value) {
              <button type="button" class="py-2.5 rounded-xl border-2 text-[11px] font-semibold capitalize transition-colors"
                      [class]="p.theme.layoutWidth === w.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-700 text-slate-500'"
                      (click)="update({ layoutWidth: w.value })">
                {{ w.label }}
              </button>
            }
          </div>
        </section>

        <section>
          <h4 class="prop-label">Corner radius</h4>
          <div class="grid grid-cols-3 gap-2">
            @for (r of radii; track r.value) {
              <button type="button" class="py-2.5 rounded-xl border-2 text-[11px] font-semibold flex flex-col items-center gap-1.5 transition-colors"
                      [class]="p.theme.radius === r.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-700 text-slate-500'"
                      (click)="update({ radius: r.value })">
                <span class="w-4 h-4 bg-current opacity-60" [style.border-radius]="r.preview"></span>
                {{ r.label }}
              </button>
            }
          </div>
        </section>

        <section>
          <h4 class="prop-label">Effects</h4>
          <label class="flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
            <span class="text-xs font-medium text-slate-600 dark:text-slate-300">Glass effect</span>
            <input type="checkbox" [checked]="p.theme.glassEffect" (change)="update({ glassEffect: !p.theme.glassEffect })" class="rounded accent-primary-600">
          </label>
        </section>
      </div>
    }
  `,
  styles: [`.prop-label { @apply text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2; }`],
})
export class ThemeCustomizerComponent {
  readonly store = inject(PortfolioStoreService);
  readonly presetColors = PRESET_COLORS;

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

  isColor(current: string, candidate: string): boolean {
    return current?.toLowerCase() === candidate.toLowerCase();
  }

  modeLocked(templateId: string): boolean {
    return getPortfolioThemeMeta(templateId).modeSupport !== 'both';
  }

  modeHint(templateId: string): string {
    const support = getPortfolioThemeMeta(templateId).modeSupport;
    if (support === 'dark-only') return 'This theme is always dark — it’s part of its design.';
    if (support === 'light-only') return 'This theme is always light — dark mode isn’t available yet for it.';
    return '';
  }

  update(patch: Partial<PortfolioTheme>): void {
    this.store.updateTheme(patch);
  }
}
