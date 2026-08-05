import { Injectable, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type DashboardNotificationType = 'success' | 'info' | 'warning';

export interface DashboardNotification {
  id: string;
  type: DashboardNotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const STORAGE_KEY = 'ch_dash_notifications';

/**
 * Persistent notification center (topbar bell + Recent Notifications
 * widget) — distinct from `NotificationService`, which is an ephemeral
 * toast queue only. No backend model exists for notifications yet, so this
 * is a genuine local store: empty on a fresh account rather than seeded
 * with fake data.
 */
@Injectable({ providedIn: 'root' })
export class DashboardNotificationsService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly _items = signal<DashboardNotification[]>(this.load());

  readonly items = this._items.asReadonly();
  readonly unreadCount = computed(() => this._items().filter((n) => !n.read).length);

  add(type: DashboardNotificationType, title: string, message = ''): void {
    const entry: DashboardNotification = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };
    this._items.update((items) => [entry, ...items].slice(0, 50));
    this.persist();
  }

  markAllRead(): void {
    this._items.update((items) => items.map((n) => ({ ...n, read: true })));
    this.persist();
  }

  dismiss(id: string): void {
    this._items.update((items) => items.filter((n) => n.id !== id));
    this.persist();
  }

  private load(): DashboardNotification[] {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
  }
}
