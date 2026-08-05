import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { PortfolioStoreService } from '../../services/portfolio-store.service';
import { PortfolioBlockStyle, SECTION_LABELS } from '../../models/portfolio.model';

interface Option<T> { value: T; label: string; }

const PADDING_OPTS: Option<NonNullable<PortfolioBlockStyle['padding']>>[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'cozy', label: 'Cozy' },
  { value: 'spacious', label: 'Spacious' },
];
const RADIUS_OPTS: Option<NonNullable<PortfolioBlockStyle['radius']>>[] = [
  { value: 'none', label: 'None' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'full', label: 'Full' },
];
const SHADOW_OPTS: Option<NonNullable<PortfolioBlockStyle['shadow']>>[] = [
  { value: 'none', label: 'None' },
  { value: 'soft', label: 'Soft' },
  { value: 'strong', label: 'Strong' },
];
const ALIGN_OPTS: Option<NonNullable<PortfolioBlockStyle['align']>>[] = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];
const BG_OPTS: Option<NonNullable<PortfolioBlockStyle['background']>>[] = [
  { value: 'none', label: 'None' },
  { value: 'surface', label: 'Surface' },
  { value: 'accent-tint', label: 'Accent tint' },
  { value: 'gradient', label: 'Gradient' },
];
const ANIMATION_OPTS: Option<NonNullable<PortfolioBlockStyle['animation']>>[] = [
  { value: 'none', label: 'None' },
  { value: 'fade-up', label: 'Fade up' },
  { value: 'fade-in', label: 'Fade in' },
  { value: 'slide-in', label: 'Slide in' },
];

@Component({
  selector: 'app-property-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    @if (store.selectedSection(); as section) {
      <div class="p-4 space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Editing</p>
            <p class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ labels[section.type] }}</p>
          </div>
          <button type="button" (click)="store.selectSection(null)" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <section>
          <h4 class="prop-label">Alignment</h4>
          <div class="grid grid-cols-3 gap-1.5">
            @for (o of alignOpts; track o.value) {
              <button type="button" (click)="setStyle({ align: o.value })" class="prop-chip" [class.prop-chip-active]="isActive('align', o.value)">{{ o.label }}</button>
            }
          </div>
        </section>

        <section>
          <h4 class="prop-label">Spacing</h4>
          <div class="grid grid-cols-3 gap-1.5">
            @for (o of paddingOpts; track o.value) {
              <button type="button" (click)="setStyle({ padding: o.value })" class="prop-chip" [class.prop-chip-active]="isActive('padding', o.value)">{{ o.label }}</button>
            }
          </div>
        </section>

        <section>
          <h4 class="prop-label">Background</h4>
          <div class="grid grid-cols-2 gap-1.5">
            @for (o of bgOpts; track o.value) {
              <button type="button" (click)="setStyle({ background: o.value })" class="prop-chip" [class.prop-chip-active]="isActive('background', o.value)">{{ o.label }}</button>
            }
          </div>
        </section>

        <section>
          <h4 class="prop-label">Border radius</h4>
          <div class="grid grid-cols-4 gap-1.5">
            @for (o of radiusOpts; track o.value) {
              <button type="button" (click)="setStyle({ radius: o.value })" class="prop-chip" [class.prop-chip-active]="isActive('radius', o.value)">{{ o.label }}</button>
            }
          </div>
        </section>

        <section>
          <h4 class="prop-label">Shadow</h4>
          <div class="grid grid-cols-3 gap-1.5">
            @for (o of shadowOpts; track o.value) {
              <button type="button" (click)="setStyle({ shadow: o.value })" class="prop-chip" [class.prop-chip-active]="isActive('shadow', o.value)">{{ o.label }}</button>
            }
          </div>
        </section>

        <section>
          <h4 class="prop-label">Entrance animation</h4>
          <div class="grid grid-cols-2 gap-1.5">
            @for (o of animationOpts; track o.value) {
              <button type="button" (click)="setStyle({ animation: o.value })" class="prop-chip" [class.prop-chip-active]="isActive('animation', o.value)">{{ o.label }}</button>
            }
          </div>
        </section>

        <section>
          <h4 class="prop-label">Visibility</h4>
          <label class="flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
            <span class="text-xs font-medium text-slate-600 dark:text-slate-300">Show this section</span>
            <input type="checkbox" [checked]="section.enabled" (change)="store.toggleSectionEnabled(section.id)" class="rounded accent-primary-600">
          </label>
        </section>
      </div>
    } @else {
      <div class="h-full flex flex-col items-center justify-center text-center px-6 py-16">
        <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="text-slate-400"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
        </div>
        <p class="text-xs font-semibold text-slate-500 dark:text-slate-400">Select a section</p>
        <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Click any block on the canvas to edit its style.</p>
      </div>
    }
  `,
  styles: [`
    .prop-label { @apply text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2; }
    .prop-chip { @apply px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:border-primary-300 transition-colors; }
    .prop-chip-active { @apply border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300; }
  `],
})
export class PropertyPanelComponent {
  readonly store = inject(PortfolioStoreService);
  readonly labels = SECTION_LABELS;

  readonly paddingOpts = PADDING_OPTS;
  readonly radiusOpts = RADIUS_OPTS;
  readonly shadowOpts = SHADOW_OPTS;
  readonly alignOpts = ALIGN_OPTS;
  readonly bgOpts = BG_OPTS;
  readonly animationOpts = ANIMATION_OPTS;

  private static readonly DEFAULTS: Partial<Record<keyof PortfolioBlockStyle, string>> = {
    padding: 'cozy', radius: 'none', shadow: 'none', align: 'left', background: 'none', animation: 'none',
  };

  isActive<K extends keyof PortfolioBlockStyle>(key: K, value: PortfolioBlockStyle[K]): boolean {
    const style = this.store.selectedSection()?.style;
    const current = style?.[key] ?? PropertyPanelComponent.DEFAULTS[key];
    return current === value;
  }

  setStyle(patch: Partial<PortfolioBlockStyle>): void {
    const id = this.store.selectedSectionId();
    if (id) this.store.updateSectionStyle(id, patch);
  }
}
