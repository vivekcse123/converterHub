import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'portfolio-template-favorites';

function readStored(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** Favorited template ids, persisted to localStorage — favorites are a
 *  per-browser UI preference, not portfolio data, so they don't touch the
 *  backend. */
@Injectable({ providedIn: 'root' })
export class PortfolioTemplateFavoritesService {
  private readonly ids = signal<Set<string>>(new Set(readStored()));
  readonly favorites = this.ids.asReadonly();

  isFavorite(templateId: string): boolean {
    return this.ids().has(templateId);
  }

  toggle(templateId: string): void {
    const next = new Set(this.ids());
    if (next.has(templateId)) {
      next.delete(templateId);
    } else {
      next.add(templateId);
    }
    this.ids.set(next);
    this.persist(next);
  }

  private persist(ids: Set<string>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
    } catch {
      // localStorage unavailable (private mode, quota) — favorites simply won't persist across reloads.
    }
  }
}
