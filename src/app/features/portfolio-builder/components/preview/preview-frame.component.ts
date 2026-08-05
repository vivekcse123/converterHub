import { Component, ChangeDetectionStrategy, computed, input, output, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { PortfolioData } from '../../models/portfolio.model';
import { getPortfolioThemeMeta } from '../../data/portfolio-themes.data';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTH: Record<ViewportMode, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '390px',
};

@Component({
  selector: 'app-preview-frame',
  standalone: true,
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    <div class="h-full flex flex-col bg-slate-100 dark:bg-slate-900/60">
      <div class="flex items-center justify-center gap-2 py-2.5 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div class="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
          @for (d of devices; track d) {
            <button type="button" class="px-2.5 py-1.5 rounded-md transition-colors"
                    [class]="viewport() === d ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'"
                    (click)="viewport.set(d)">
              @switch (d) {
                @case ('desktop') { <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="w-4 h-4"><rect x="2" y="4" width="20" height="13" rx="1.5"/><path d="M8 21h8M12 17v4"/></svg> }
                @case ('tablet')  { <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="w-4 h-4"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M11 18h2"/></svg> }
                @case ('mobile')  { <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="w-4 h-4"><rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/></svg> }
              }
            </button>
          }
        </div>
        <button type="button" (click)="fullscreen.emit()" title="Full screen"
                class="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
        </button>
      </div>

      <div class="flex-1 min-h-0 flex justify-center overflow-hidden">
        <div class="bg-white dark:bg-slate-950 h-full overflow-y-auto transition-all duration-300"
             [class]="viewport() === 'desktop' ? 'w-full' : 'shadow-card-hover'"
             [style.width]="viewport() === 'desktop' ? '100%' : DEVICE_WIDTH[viewport()]" [style.max-width]="'100%'">
          <ng-container [ngComponentOutlet]="themeComponent()" [ngComponentOutletInputs]="{ portfolio: portfolio(), editable: false }" />
        </div>
      </div>
    </div>
  `,
})
export class PreviewFrameComponent {
  portfolio = input.required<PortfolioData>();
  fullscreen = output<void>();

  readonly devices: ViewportMode[] = ['desktop', 'tablet', 'mobile'];
  readonly viewport = signal<ViewportMode>('desktop');
  readonly DEVICE_WIDTH = DEVICE_WIDTH;

  themeComponent = computed(() => getPortfolioThemeMeta(this.portfolio().theme.templateId).component);
}
