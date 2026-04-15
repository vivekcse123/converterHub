import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id:      number;
  type:    NotificationType;
  title:   string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly notifications = signal<Notification[]>([]);

  private counter = 0;

  show(type: NotificationType, title: string, message = '', duration = 4000): void {
    const id = ++this.counter;
    this.notifications.update((n) => [...n, { id, type, title, message }]);
    if (duration > 0) setTimeout(() => this.dismiss(id), duration);
  }

  success(title: string, message = ''): void { this.show('success', title, message); }
  error  (title: string, message = ''): void { this.show('error',   title, message, 6000); }
  info   (title: string, message = ''): void { this.show('info',    title, message); }
  warning(title: string, message = ''): void { this.show('warning', title, message); }

  dismiss(id: number): void {
    this.notifications.update((n) => n.filter((x) => x.id !== id));
  }
}
