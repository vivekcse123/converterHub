import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { PortfolioSection, PortfolioTheme } from '../../models/portfolio.model';

const PADDING_CLASS: Record<string, string> = {
  compact: 'py-6',
  cozy: 'py-10',
  spacious: 'py-16',
};
const RADIUS_CLASS: Record<string, string> = {
  none: 'rounded-none',
  md: 'rounded-xl',
  lg: 'rounded-[20px]',
  full: 'rounded-[28px]',
};
const SHADOW_CLASS: Record<string, string> = {
  none: '',
  soft: 'shadow-card',
  strong: 'shadow-card-hover',
};
const ALIGN_CLASS: Record<string, string> = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
};
const BG_CLASS: Record<string, string> = {
  none: '',
  surface: 'bg-slate-50 dark:bg-slate-900/60',
  'accent-tint': '',
  gradient: '',
};
const ANIMATION_CLASS: Record<string, string> = {
  none: '',
  'fade-up': 'animate-slide-up',
  'fade-in': 'animate-fade-in',
  'slide-in': 'animate-slide-down',
};

@Component({
  selector: 'app-block-shell',
  standalone: true,
  imports: [DragDropModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="group/block relative transition-all duration-200"
         [class.ring-2]="selected()"
         [class.ring-primary-500]="selected()"
         [class.ring-offset-2]="selected()"
         [class.ring-offset-transparent]="selected()"
         [class]="RADIUS_CLASS[section().style.radius ?? 'none']"
         (click)="select.emit()">

      @if (editable()) {
        <!-- Hover / selected toolbar -->
        <div class="absolute -top-4 left-4 z-20 flex items-center gap-0.5 rounded-lg border border-slate-200 dark:border-slate-700
                    bg-white dark:bg-slate-800 shadow-popover px-1 py-1 opacity-0 transition-opacity duration-150"
             [class.opacity-100]="selected()"
             [class]="selected() ? '' : 'group-hover/block:opacity-100'">
          <button type="button" cdkDragHandle title="Drag to reorder" (click)="$event.stopPropagation()"
                  class="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-grab active:cursor-grabbing">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="6" r="1.6"/><circle cx="16" cy="6" r="1.6"/><circle cx="8" cy="12" r="1.6"/><circle cx="16" cy="12" r="1.6"/><circle cx="8" cy="18" r="1.6"/><circle cx="16" cy="18" r="1.6"/></svg>
          </button>
          <span class="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5"></span>
          <span class="px-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 select-none">{{ label() }}</span>
          <span class="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5"></span>
          @if (removable()) {
            <button type="button" title="Duplicate" (click)="$event.stopPropagation(); duplicate.emit()"
                    class="p-1.5 rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg>
            </button>
          }
          <button type="button" [title]="section().enabled ? 'Hide' : 'Show'" (click)="$event.stopPropagation(); toggleEnabled.emit()"
                  class="p-1.5 rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30">
            <app-icon [name]="section().enabled ? 'eye' : 'eye-off'" [size]="14" />
          </button>
          @if (removable()) {
            <button type="button" title="Delete" (click)="$event.stopPropagation(); remove.emit()"
                    class="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6"/></svg>
            </button>
          }
        </div>
      }

      <div [class]="contentClasses()" [style]="contentStyle()" [class.opacity-40]="!section().enabled">
        <ng-content />
      </div>
    </div>
  `,
})
export class BlockShellComponent {
  section = input.required<PortfolioSection>();
  theme = input<PortfolioTheme | null>(null);
  label = input('Block');
  editable = input(true);
  selected = input(false);
  removable = input(true);

  select = output<void>();
  duplicate = output<void>();
  toggleEnabled = output<void>();
  remove = output<void>();

  readonly RADIUS_CLASS = RADIUS_CLASS;

  contentClasses(): string {
    const style = this.section().style;
    return [
      'w-full flex flex-col',
      PADDING_CLASS[style.padding ?? 'cozy'],
      SHADOW_CLASS[style.shadow ?? 'none'],
      ALIGN_CLASS[style.align ?? 'left'],
      BG_CLASS[style.background ?? 'none'],
      ANIMATION_CLASS[style.animation ?? 'none'],
    ].filter(Boolean).join(' ');
  }

  contentStyle(): Record<string, string> {
    const bg = this.section().style.background ?? 'none';
    const accent = this.theme()?.accentColor || '#4f46e5';
    if (bg === 'accent-tint') return { background: accent + '14' };
    if (bg === 'gradient') return { background: `linear-gradient(135deg, ${accent}1f, transparent 70%)` };
    return {};
  }
}
