import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { PortfolioStoreService } from '../../services/portfolio-store.service';
import { NotificationService } from '../../../../core/services/notification.service';

import { EditorHeaderComponent } from '../../components/shell/editor-header.component';
import { EditorSidebarComponent, DockTab } from '../../components/shell/editor-sidebar.component';
import { PortfolioCanvasComponent } from '../../components/canvas/portfolio-canvas.component';
import { PropertyPanelComponent } from '../../components/property-panel/property-panel.component';
import { PreviewFrameComponent } from '../../components/preview/preview-frame.component';
import { ThemePickerComponent } from '../../components/theme-picker/theme-picker.component';
import { ThemeCustomizerComponent } from '../../components/theme-customizer/theme-customizer.component';
import { MediaPanelComponent } from '../../components/media-panel/media-panel.component';
import { SettingsPanelComponent } from '../../components/settings/settings-panel.component';
import { ShareModalComponent } from '../../components/share/share-modal.component';
import { CommandPaletteComponent } from '../../components/command-palette/command-palette.component';

const DOCK_LABEL: Record<DockTab, string> = {
  properties: 'Style',
  templates: 'Templates',
  theme: 'Theme',
  media: 'Media',
  settings: 'Settings',
};

@Component({
  selector: 'app-portfolio-editor',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    EditorHeaderComponent, EditorSidebarComponent, PortfolioCanvasComponent, PropertyPanelComponent,
    PreviewFrameComponent, ThemePickerComponent, ThemeCustomizerComponent, MediaPanelComponent,
    SettingsPanelComponent, ShareModalComponent, CommandPaletteComponent,
  ],
  template: `
    @if (!store.loading() && store.portfolio(); as p) {
      <div class="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <app-editor-header
          [portfolio]="p" [previewMode]="previewMode()"
          (previewToggle)="previewMode.set(!previewMode())"
          (publish)="doPublish()"
          (shareOpen)="showShare.set(true)"
          (exportJson)="exportJson()"
          (commandPalette)="openPalette()" />

        @if (previewMode()) {
          <div class="fixed inset-0 z-40 bg-white dark:bg-slate-950">
            <app-preview-frame [portfolio]="p" />
            <button type="button" (click)="previewMode.set(false)"
              class="fixed top-4 right-4 z-50 w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        } @else {
          <div class="flex-1 flex min-h-0 relative">
            <app-editor-sidebar [collapsed]="sidebarCollapsed()" [active]="dockTab()"
              (select)="openDock($event)" (toggleCollapsed)="sidebarCollapsed.set(!sidebarCollapsed())" />

            <main class="flex-1 min-h-0 overflow-y-auto">
              <app-portfolio-canvas [portfolio]="p" />
            </main>

            <!-- Dock: exactly one instance is ever mounted — desktop side panel
                 above the lg breakpoint, a slide-up sheet below it. Rendering
                 both simultaneously (even with one CSS-hidden) would double-mount
                 every panel, firing duplicate API calls (e.g. the media list). -->
            @if (isDesktop()) {
              <aside class="flex flex-col w-[340px] shrink-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-0 overflow-y-auto">
                <div class="px-4 pt-4 pb-1 shrink-0">
                  <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ DOCK_LABEL[dockTab()] }}</p>
                </div>
                <ng-container [ngTemplateOutlet]="dockContent" />
              </aside>
            } @else if (mobileDockOpen()) {
              <div class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in" (click)="mobileDockOpen.set(false)"></div>
              <div class="fixed inset-x-0 bottom-0 z-50 max-h-[75vh] flex flex-col rounded-t-[24px] bg-white dark:bg-slate-900 shadow-popover animate-slide-up overflow-hidden">
                <div class="relative flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
                  <span class="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700 absolute left-1/2 -translate-x-1/2 top-2"></span>
                  <p class="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">{{ DOCK_LABEL[dockTab()] }}</p>
                  <button type="button" (click)="mobileDockOpen.set(false)" class="mt-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <div class="overflow-y-auto">
                  <ng-container [ngTemplateOutlet]="dockContent" />
                </div>
              </div>
            }
          </div>
        }

        @if (showShare()) {
          <app-share-modal [username]="p.username" (close)="showShare.set(false)" />
        }
      </div>
    } @else {
      <div class="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div class="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }

    <ng-template #dockContent>
      @switch (dockTab()) {
        @case ('properties') { <app-property-panel /> }
        @case ('templates')  { <app-theme-picker /> }
        @case ('theme')      { <app-theme-customizer /> }
        @case ('media')      { <app-media-panel /> }
        @case ('settings')   { <app-settings-panel /> }
      }
    </ng-template>

    <app-command-palette
      (navigate)="openDock($event)"
      (previewToggle)="previewMode.set(!previewMode())"
      (publishNow)="doPublish()"
      (shareOpen)="showShare.set(true)" />
  `,
})
export class PortfolioEditorComponent implements OnInit {
  readonly store = inject(PortfolioStoreService);
  private notify = inject(NotificationService);
  private breakpointObserver = inject(BreakpointObserver);

  readonly previewMode = signal(false);
  readonly sidebarCollapsed = signal(true);
  readonly dockTab = signal<DockTab>('properties');
  readonly mobileDockOpen = signal(false);
  readonly showShare = signal(false);

  // Mirrors Tailwind's `lg` breakpoint (1024px) so exactly one dock — desktop
  // aside or mobile sheet — is ever mounted; see the template comment above.
  readonly isDesktop = toSignal(
    this.breakpointObserver.observe('(min-width: 1024px)').pipe(map(r => r.matches)),
    { initialValue: this.breakpointObserver.isMatched('(min-width: 1024px)') }
  );

  readonly DOCK_LABEL = DOCK_LABEL;

  constructor() {
    // Selecting a block always brings the property panel to the front, even if
    // another dock tab (media, theme, etc.) was open — and opens the mobile
    // sheet too, since below `lg` the dock has no other visible entry point.
    effect(() => {
      if (this.store.selectedSectionId()) {
        this.dockTab.set('properties');
        this.mobileDockOpen.set(true);
      }
    }, { allowSignalWrites: true });
  }

  async ngOnInit(): Promise<void> {
    await this.store.load();
  }

  openDock(tab: DockTab): void {
    this.dockTab.set(tab);
    this.previewMode.set(false);
    this.mobileDockOpen.set(true);
  }

  async doPublish(): Promise<void> {
    const ok = await this.store.publish();
    if (ok) this.notify.success('Published!', 'Your portfolio is live.');
    else this.notify.error('Could not publish', 'Set a username first, then try again.');
  }

  exportJson(): void {
    const p = this.store.portfolio();
    if (!p) return;
    const blob = new Blob([JSON.stringify(p, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${p.username || 'portfolio'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.notify.success('Exported', 'Your portfolio JSON has been downloaded.');
  }

  openPalette(): void {
    // The palette listens for Ctrl/Cmd+K globally; simulate the same key event
    // so the header's search button opens the identical UI.
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  }
}
