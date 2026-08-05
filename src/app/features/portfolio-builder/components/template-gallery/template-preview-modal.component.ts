import { Component, ChangeDetectionStrategy, HostListener, computed, input, output, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { PortfolioThemeMeta } from '../../data/portfolio-themes.data';
import { demoPortfolioForTheme } from '../../data/portfolio-demo-content.data';

export type PreviewDevice = 'desktop' | 'laptop' | 'tablet' | 'mobile';

const DEVICE_WIDTH: Record<PreviewDevice, string> = {
  desktop: '1440px',
  laptop: '1280px',
  tablet: '768px',
  mobile: '390px',
};

const DEVICE_ICON: Record<PreviewDevice, string> = {
  desktop: 'M2 4h20v13H2zM8 21h8M12 17v4',
  laptop: 'M4 5h16v10H4zM2 19h20l-2-4H4z',
  tablet: 'M5 2h14v20H5zM11 18h2',
  mobile: 'M7 2h10v20H7zM11 18h2',
};

@Component({
  selector: 'app-template-preview-modal',
  standalone: true,
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'fixed inset-0 z-[70] flex flex-col bg-slate-900/95 backdrop-blur-sm' },
  template: `
    <div class="flex items-center justify-between px-4 sm:px-6 py-3 shrink-0 border-b border-white/10">
      <div class="min-w-0">
        <p class="text-sm font-bold text-white truncate">{{ theme().name }}</p>
        <p class="text-[11px] text-white/50 truncate">{{ theme().description }}</p>
      </div>

      <div class="flex items-center gap-1 bg-white/10 rounded-xl p-1 mx-4">
        @for (d of devices; track d) {
          <button type="button" (click)="device.set(d)"
            class="px-2.5 py-1.5 rounded-lg transition-colors"
            [class]="device() === d ? 'bg-white text-slate-900' : 'text-white/60 hover:text-white'"
            [attr.aria-label]="d" [title]="d">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path [attr.d]="DEVICE_ICON[d]"/></svg>
          </button>
        }
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <button type="button" (click)="use.emit()"
          class="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors">
          Use Template
        </button>
        <button type="button" (click)="close.emit()"
          class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>

    <div class="flex-1 min-h-0 flex justify-center overflow-hidden">
      <div class="bg-white h-full overflow-y-auto transition-all duration-300"
           [class]="device() === 'desktop' ? 'w-full' : 'shadow-2xl'"
           [style.width]="device() === 'desktop' ? '100%' : DEVICE_WIDTH[device()]" [style.max-width]="'100%'">
        <ng-container [ngComponentOutlet]="theme().component" [ngComponentOutletInputs]="inputs()" />
      </div>
    </div>
  `,
})
export class TemplatePreviewModalComponent {
  theme = input.required<PortfolioThemeMeta>();
  close = output<void>();
  use = output<void>();

  readonly devices: PreviewDevice[] = ['desktop', 'laptop', 'tablet', 'mobile'];
  readonly device = signal<PreviewDevice>('desktop');
  readonly DEVICE_WIDTH = DEVICE_WIDTH;
  readonly DEVICE_ICON = DEVICE_ICON;

  readonly inputs = computed(() => {
    const t = this.theme();
    return { portfolio: demoPortfolioForTheme(t.id, t.defaultMode, t.defaultAccent), editable: false };
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }
}
