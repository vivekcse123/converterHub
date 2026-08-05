import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

export type DockTab = 'properties' | 'templates' | 'theme' | 'media' | 'settings';

interface NavItem { id: DockTab | 'dashboard'; label: string; icon: string; }

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⬅' },
  { id: 'templates', label: 'Templates', icon: '✨' },
  { id: 'media', label: 'Media', icon: '🖼' },
  { id: 'theme', label: 'Theme', icon: '🎨' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

@Component({
  selector: 'app-editor-sidebar',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    <nav class="h-full flex flex-col py-3 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-200"
         [class]="collapsed() ? 'w-[64px]' : 'w-[190px]'">
      <div class="flex-1 flex flex-col gap-1 px-2">
        @for (item of navItems; track item.id) {
          @if (item.id === 'dashboard') {
            <a routerLink="/dashboard" class="nav-item" [class.justify-center]="collapsed()" [title]="item.label">
              <span class="text-base w-5 text-center shrink-0">{{ item.icon }}</span>
              @if (!collapsed()) { <span>{{ item.label }}</span> }
            </a>
          } @else {
            <button type="button" (click)="select.emit(item.id)" [title]="item.label"
              class="nav-item" [class.justify-center]="collapsed()"
              [class]="active() === item.id ? 'nav-item-active' : ''">
              <span class="text-base w-5 text-center shrink-0">{{ item.icon }}</span>
              @if (!collapsed()) { <span>{{ item.label }}</span> }
            </button>
          }
        }
      </div>

      <button type="button" (click)="toggleCollapsed.emit()" class="nav-item mx-2 justify-center" [title]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [class.rotate-180]="collapsed()" class="transition-transform">
          <path d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
    </nav>
  `,
  styles: [`
    .nav-item { @apply flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors; }
    .nav-item-active { @apply bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300; }
  `],
})
export class EditorSidebarComponent {
  collapsed = input(false);
  active = input<DockTab | null>(null);

  select = output<DockTab>();
  toggleCollapsed = output<void>();

  readonly navItems = NAV_ITEMS;
}
