import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortfolioStoreService } from '../../services/portfolio-store.service';
import { BuilderRailComponent } from '../../components/editor/builder-rail/builder-rail.component';
import { IdentityPanelComponent } from '../../components/editor/identity-panel/identity-panel.component';
import { PortfolioSectionListComponent } from '../../components/editor/section-list/portfolio-section-list.component';
import { TemplatePanelComponent } from '../../components/editor/template-panel/template-panel.component';
import { ThemePanelComponent } from '../../components/editor/theme-panel/theme-panel.component';
import { PublishPanelComponent } from '../../components/editor/publish-panel/publish-panel.component';
import { PortfolioPreviewComponent } from '../../components/preview/portfolio-preview.component';
import { PortfolioShareCardComponent } from '../../components/share-card/portfolio-share-card.component';

type RightTab = 'template' | 'theme' | 'content' | 'publish';
type ViewportMode = 'desktop' | 'tablet' | 'mobile';

const RIGHT_TABS: { id: RightTab; label: string }[] = [
  { id: 'template', label: 'Template' },
  { id: 'theme', label: 'Theme' },
  { id: 'content', label: 'Content' },
  { id: 'publish', label: 'Publish' },
];

const DEVICE_META: Record<ViewportMode, { label: string; width: string; frameClass: string }> = {
  desktop: { label: 'Desktop', width: '100%', frameClass: 'max-w-none' },
  tablet:  { label: 'Tablet',  width: '760px', frameClass: 'max-w-[760px] mx-auto' },
  mobile:  { label: 'Mobile',  width: '390px', frameClass: 'max-w-[390px] mx-auto' },
};

@Component({
  selector: 'app-portfolio-editor',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    BuilderRailComponent, IdentityPanelComponent, PortfolioSectionListComponent,
    TemplatePanelComponent, ThemePanelComponent, PublishPanelComponent,
    PortfolioPreviewComponent, PortfolioShareCardComponent,
  ],
  template: `
    <div class="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">

      @if (store.loading()) {
        <div class="flex-1 flex items-center justify-center">
          <div class="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      } @else {
      @if (store.portfolio(); as p) {

        <!-- Header -->
        <header class="h-16 shrink-0 flex items-center gap-3 px-4 sm:px-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          @if (!previewMode()) {
            <div class="hidden sm:block">
              <p class="text-[14px] font-extrabold text-slate-800 dark:text-slate-100 leading-tight">Portfolio Builder</p>
              <p class="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 leading-tight">
                <a routerLink="/dashboard" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Dashboard</a>
                <span>/</span><span>Portfolio Builder</span>
              </p>
            </div>

            <span class="flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full"
                  [class]="saveStateClass()">
              <span class="w-[6px] h-[6px] rounded-full shrink-0" [class]="saveStateDotClass()"></span>
              {{ saveStateLabel() }}
            </span>
          } @else {
            <p class="text-[13px] font-bold text-slate-500 dark:text-slate-400">Preview mode</p>
          }

          <div class="ml-auto flex items-center gap-2">
            @if (!previewMode()) {
              <div class="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                @for (d of devices; track d) {
                  <button type="button" class="px-2 py-1.5 rounded-md transition-colors"
                          [class]="viewport() === d ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'"
                          [title]="deviceMeta[d].label" (click)="viewport.set(d)">
                    @switch (d) {
                      @case ('desktop') { <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="w-4 h-4"><rect x="2" y="4" width="20" height="13" rx="1.5"/><path d="M8 21h8M12 17v4"/></svg> }
                      @case ('tablet')  { <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="w-4 h-4"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M11 18h2"/></svg> }
                      @case ('mobile')  { <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="w-4 h-4"><rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/></svg> }
                    }
                  </button>
                }
              </div>
            }

            <button type="button"
                    class="px-3 py-2 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5"
                    [class]="previewMode() ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'"
                    (click)="previewMode.set(!previewMode())">
              @if (previewMode()) {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5"><path d="M6 6l12 12M18 6L6 18"/></svg> Exit preview
              } @else {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="w-3.5 h-3.5"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg> Preview
              }
            </button>

            @if (!previewMode()) {
              @if (p.status === 'published' && p.isPublic) {
                <button type="button" class="hidden sm:flex px-3 py-2 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors items-center gap-1.5"
                        (click)="showShare.set(true)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="w-3.5 h-3.5"><circle cx="18" cy="5" r="2.7"/><circle cx="6" cy="12" r="2.7"/><circle cx="18" cy="19" r="2.7"/><path d="M8.3 10.6l7.4-4.2M8.3 13.4l7.4 4.2"/></svg> Share
                </button>
              }
              <button type="button" class="px-3.5 py-2 rounded-lg text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white transition-colors shadow-card"
                      (click)="jumpToPublish()">
                Publish
              </button>
            }
          </div>
        </header>

        @if (showShare()) {
          <app-portfolio-share-card [username]="p.username" [displayName]="p.displayName ?? ''" (close)="showShare.set(false)" />
        }

        <!-- Desktop (xl+): full 4-column premium shell -->
        <div class="hidden xl:flex flex-1 min-h-0">
          @if (!previewMode()) {
            <app-builder-rail />

            <aside class="w-[300px] shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-0">
              <app-portfolio-section-list />
            </aside>
          }

          <main class="flex-1 min-h-0 overflow-y-auto bg-slate-100 dark:bg-slate-900/40 px-6 py-6">
            <div class="mb-4 flex items-center justify-center">
              <span class="text-[11px] font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1">
                {{ deviceMeta[viewport()].label }} preview
              </span>
            </div>
            <div class="bg-white dark:bg-slate-950 rounded-2xl shadow-card-hover overflow-hidden transition-all duration-300 border border-slate-200 dark:border-slate-800"
                 [class]="deviceMeta[viewport()].frameClass">
              <app-portfolio-preview [portfolio]="p" />
            </div>
          </main>

          @if (!previewMode()) {
            <aside class="w-[360px] shrink-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-0 flex flex-col">
              <div class="flex px-4 pt-3 gap-1 border-b border-slate-200 dark:border-slate-800 shrink-0">
                @for (t of rightTabs; track t.id) {
                  <button type="button" class="px-2.5 pb-3 text-[12.5px] font-bold relative transition-colors"
                          [class]="rightTab() === t.id ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'"
                          (click)="rightTab.set(t.id)">
                    {{ t.label }}
                    @if (rightTab() === t.id) { <span class="absolute left-0 right-0 -bottom-px h-[2px] bg-primary-500 rounded-t"></span> }
                  </button>
                }
              </div>
              <div class="flex-1 overflow-y-auto p-4">
                @switch (rightTab()) {
                  @case ('template') { <app-template-panel /> }
                  @case ('theme')    { <app-theme-panel /> }
                  @case ('content')  { <app-identity-panel /> }
                  @case ('publish')  { <app-publish-panel /> }
                }
              </div>
            </aside>
          }
        </div>

        <!-- Below xl: simplified stacked editor, no live preview canvas -->
        <div class="flex xl:hidden flex-1 min-h-0 flex-col">
          <div class="flex overflow-x-auto gap-1 px-3 pt-2.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            @for (t of mobileTabs; track t.id) {
              <button type="button" class="px-3 pb-2.5 text-[12.5px] font-bold whitespace-nowrap relative transition-colors"
                      [class]="mobileTab() === t.id ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'"
                      (click)="mobileTab.set(t.id)">
                {{ t.label }}
                @if (mobileTab() === t.id) { <span class="absolute left-0 right-0 -bottom-px h-[2px] bg-primary-500 rounded-t"></span> }
              </button>
            }
          </div>
          <div class="flex-1 overflow-y-auto p-4 max-w-xl w-full mx-auto">
            @switch (mobileTab()) {
              @case ('sections') { <app-portfolio-section-list /> }
              @case ('template') { <app-template-panel /> }
              @case ('theme')    { <app-theme-panel /> }
              @case ('content')  { <app-identity-panel /> }
              @case ('publish')  { <app-publish-panel /> }
            }
          </div>
        </div>
      }
      }
    </div>
  `,
})
export class PortfolioEditorComponent implements OnInit {
  readonly store = inject(PortfolioStoreService);

  readonly viewport = signal<ViewportMode>('desktop');
  readonly previewMode = signal(false);
  readonly showShare = signal(false);
  readonly rightTab = signal<RightTab>('content');
  readonly mobileTab = signal<'sections' | RightTab>('sections');

  readonly devices: ViewportMode[] = ['desktop', 'tablet', 'mobile'];
  readonly deviceMeta = DEVICE_META;
  readonly rightTabs = RIGHT_TABS;
  readonly mobileTabs: { id: 'sections' | RightTab; label: string }[] = [
    { id: 'sections', label: 'Sections' },
    ...RIGHT_TABS,
  ];

  async ngOnInit(): Promise<void> {
    await this.store.load();
  }

  jumpToPublish(): void {
    this.previewMode.set(false);
    this.rightTab.set('publish');
    this.mobileTab.set('publish');
  }

  saveStateLabel(): string {
    switch (this.store.saveState()) {
      case 'saving': return 'Saving…';
      case 'saved':  return 'Saved';
      case 'error':  return 'Save failed';
      default:       return 'Autosave on';
    }
  }

  saveStateClass(): string {
    switch (this.store.saveState()) {
      case 'saving': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400';
      case 'saved':  return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400';
      case 'error':  return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400';
      default:       return 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500';
    }
  }

  saveStateDotClass(): string {
    switch (this.store.saveState()) {
      case 'saving': return 'bg-amber-500 animate-pulse';
      case 'saved':  return 'bg-emerald-500';
      case 'error':  return 'bg-red-500';
      default:       return 'bg-slate-400';
    }
  }
}
