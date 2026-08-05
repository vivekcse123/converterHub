import { Component, ChangeDetectionStrategy, HostListener, computed, inject, output, signal } from '@angular/core';
import { PortfolioStoreService } from '../../services/portfolio-store.service';
import { PORTFOLIO_THEMES } from '../../data/portfolio-themes.data';
import { ADDABLE_SECTION_TYPES, SECTION_ICONS, SECTION_LABELS } from '../../models/portfolio.model';

type DockTab = 'templates' | 'theme' | 'media' | 'settings';

interface Command {
  id: string;
  label: string;
  group: string;
  icon: string;
  run: () => void;
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-sm animate-fade-in" (click)="close()">
        <div class="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-popover overflow-hidden animate-slide-down" (click)="$event.stopPropagation()">
          <div class="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-400 shrink-0"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
            <input #q type="text" [value]="query()" (input)="query.set(q.value)" placeholder="Type a command…" autofocus
                   class="flex-1 bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400">
            <kbd class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">esc</kbd>
          </div>
          <div class="max-h-80 overflow-y-auto py-2">
            @if (filtered().length === 0) {
              <p class="text-center text-xs text-slate-400 py-8">No matching commands</p>
            }
            @for (cmd of filtered(); track cmd.id) {
              <button type="button" (click)="run(cmd)"
                class="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                <span class="text-base w-5 text-center shrink-0">{{ cmd.icon }}</span>
                <span class="text-sm text-slate-700 dark:text-slate-200">{{ cmd.label }}</span>
                <span class="ml-auto text-[10px] text-slate-400">{{ cmd.group }}</span>
              </button>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class CommandPaletteComponent {
  navigate = output<DockTab>();
  previewToggle = output<void>();
  shareOpen = output<void>();
  publishNow = output<void>();

  private store = inject(PortfolioStoreService);

  readonly open = signal(false);
  readonly query = signal('');

  readonly commands = computed<Command[]>(() => [
    ...ADDABLE_SECTION_TYPES.map(type => ({
      id: `add-${type}`,
      label: `Add ${SECTION_LABELS[type]} section`,
      group: 'Add',
      icon: SECTION_ICONS[type],
      run: () => this.store.addSection(type),
    })),
    ...PORTFOLIO_THEMES.map(t => ({
      id: `theme-${t.id}`,
      label: `Switch to ${t.name} theme`,
      group: 'Theme',
      icon: '🎨',
      run: () => this.store.updateTheme({ templateId: t.id, accentColor: t.defaultAccent, mode: t.defaultMode }),
    })),
    { id: 'open-media', label: 'Open media library', group: 'Go to', icon: '🖼️', run: () => this.navigate.emit('media') },
    { id: 'open-theme', label: 'Open theme customizer', group: 'Go to', icon: '🎛️', run: () => this.navigate.emit('theme') },
    { id: 'open-templates', label: 'Open templates', group: 'Go to', icon: '✨', run: () => this.navigate.emit('templates') },
    { id: 'open-settings', label: 'Open settings', group: 'Go to', icon: '⚙️', run: () => this.navigate.emit('settings') },
    { id: 'preview', label: 'Toggle live preview', group: 'Action', icon: '👁️', run: () => this.previewToggle.emit() },
    { id: 'publish', label: 'Publish portfolio', group: 'Action', icon: '🚀', run: () => this.publishNow.emit() },
    { id: 'share', label: 'Copy share link', group: 'Action', icon: '🔗', run: () => this.shareOpen.emit() },
    { id: 'undo', label: 'Undo', group: 'Action', icon: '↩️', run: () => this.store.undo() },
    { id: 'redo', label: 'Redo', group: 'Action', icon: '↪️', run: () => this.store.redo() },
  ]);

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.commands();
    return this.commands().filter(c => c.label.toLowerCase().includes(q));
  });

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.open.set(!this.open());
      this.query.set('');
    } else if (e.key === 'Escape' && this.open()) {
      this.close();
    }
  }

  close(): void { this.open.set(false); }

  run(cmd: Command): void {
    cmd.run();
    this.close();
  }
}
