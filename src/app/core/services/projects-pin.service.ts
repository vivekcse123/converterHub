import { Injectable, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IconName } from '../../shared/data/icon-paths.data';

export type PinnedItemType = 'resume' | 'portfolio' | 'biodata';

export interface PinnedItem {
  type: PinnedItemType;
  id: string;
  label: string;
  route: string;
  icon: IconName;
  pinnedAt: string;
}

const STORAGE_KEY = 'ch_dash_pinned_items';

/**
 * Local pin/favorite store for the Dashboard Home "Pinned Projects" widget.
 * No backend concept of pinning exists (or of "projects" spanning resumes/
 * portfolios/biodata), so this is intentionally local-only — small now,
 * reused in full once the My Projects page (Phase 2+) lands.
 */
@Injectable({ providedIn: 'root' })
export class ProjectsPinService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly _pinned = signal<PinnedItem[]>(this.load());

  readonly pinned = this._pinned.asReadonly();

  isPinned(type: PinnedItemType, id: string): boolean {
    return this._pinned().some((p) => p.type === type && p.id === id);
  }

  toggle(item: Omit<PinnedItem, 'pinnedAt'>): void {
    if (this.isPinned(item.type, item.id)) {
      this._pinned.update((items) => items.filter((p) => !(p.type === item.type && p.id === item.id)));
    } else {
      this._pinned.update((items) => [{ ...item, pinnedAt: new Date().toISOString() }, ...items]);
    }
    this.persist();
  }

  private load(): PinnedItem[] {
    if (!this.isBrowser) return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private persist(): void {
    if (!this.isBrowser) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._pinned()));
  }
}
