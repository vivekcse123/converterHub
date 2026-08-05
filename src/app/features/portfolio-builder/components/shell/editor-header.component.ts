import { Component, ChangeDetectionStrategy, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortfolioStoreService } from '../../services/portfolio-store.service';
import { PortfolioData } from '../../models/portfolio.model';

@Component({
  selector: 'app-editor-header',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <header class="h-16 shrink-0 flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
      <a routerLink="/" class="flex items-center gap-2 shrink-0" title="Back to home">
        <img src="assets/web-app-manifest-192x192.png" alt="" class="w-8 h-8 object-contain" width="32" height="32">
      </a>
      <div class="hidden sm:block shrink-0">
        <p class="text-[13px] font-extrabold text-slate-800 dark:text-slate-100 leading-tight">Portfolio Builder</p>
        <span class="inline-flex items-center gap-1.5 text-[10.5px] font-semibold" [class]="saveStateClass()">
          <span class="w-[5px] h-[5px] rounded-full shrink-0" [class]="saveStateDotClass()"></span>
          {{ saveStateLabel() }}
        </span>
      </div>

      <div class="flex-1"></div>

      <div class="flex items-center gap-1 mr-1">
        <button type="button" title="Undo (Ctrl+Z)" [disabled]="!store.canUndo()" (click)="store.undo()"
                class="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10h10a5 5 0 015 5v0a5 5 0 01-5 5H9M3 10l4-4M3 10l4 4"/></svg>
        </button>
        <button type="button" title="Redo (Ctrl+Shift+Z)" [disabled]="!store.canRedo()" (click)="store.redo()"
                class="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10H11a5 5 0 00-5 5v0a5 5 0 005 5h4M21 10l-4-4M21 10l-4 4"/></svg>
        </button>
      </div>

      <button type="button" (click)="commandPalette.emit()" title="Search commands (Ctrl+K)"
        class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 transition-colors mr-1">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
        <kbd class="text-[10px]">⌘K</kbd>
      </button>

      <button type="button" (click)="previewToggle.emit()"
        class="px-3 py-2 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5"
        [class]="previewMode() ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'">
        @if (previewMode()) {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5"><path d="M6 6l12 12M18 6L6 18"/></svg> Exit
        } @else {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="w-3.5 h-3.5"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg> Preview
        }
      </button>

      <button type="button" (click)="exportJson.emit()" title="Export as JSON"
        class="hidden sm:flex p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg>
      </button>

      @if (portfolio()?.status === 'published' && portfolio()?.isPublic) {
        <button type="button" (click)="shareOpen.emit()"
          class="hidden sm:flex px-3 py-2 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="w-3.5 h-3.5"><circle cx="18" cy="5" r="2.7"/><circle cx="6" cy="12" r="2.7"/><circle cx="18" cy="19" r="2.7"/><path d="M8.3 10.6l7.4-4.2M8.3 13.4l7.4 4.2"/></svg> Share
        </button>
      }

      <button type="button" (click)="publish.emit()"
        class="px-3.5 py-2 rounded-lg text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white transition-colors shadow-card">
        Publish
      </button>
    </header>
  `,
})
export class EditorHeaderComponent {
  portfolio = input<PortfolioData | null>(null);
  previewMode = input(false);

  previewToggle = output<void>();
  publish = output<void>();
  shareOpen = output<void>();
  exportJson = output<void>();
  commandPalette = output<void>();

  readonly store = inject(PortfolioStoreService);

  saveStateLabel(): string {
    switch (this.store.saveState()) {
      case 'saving': return 'Saving…';
      case 'saved': return 'Saved';
      case 'error': return 'Save failed';
      default: return 'Autosave on';
    }
  }
  saveStateClass(): string {
    switch (this.store.saveState()) {
      case 'saving': return 'text-amber-500';
      case 'saved': return 'text-emerald-500';
      case 'error': return 'text-red-500';
      default: return 'text-slate-400';
    }
  }
  saveStateDotClass(): string {
    switch (this.store.saveState()) {
      case 'saving': return 'bg-amber-500 animate-pulse';
      case 'saved': return 'bg-emerald-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-slate-400';
    }
  }
}
