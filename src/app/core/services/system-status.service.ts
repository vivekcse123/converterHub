import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export type SystemStatus = 'checking' | 'ok' | 'down';

/** Polls the backend's real /health endpoint (not /api-prefixed — see
 *  backend/converterHubServer/src/app.js) for the admin topbar's status dot.
 *  No synthetic/fake status — a "down" reading means the health request
 *  actually failed. */
@Injectable({ providedIn: 'root' })
export class SystemStatusService {
  private readonly healthUrl = environment.apiUrl.replace(/\/api\/?$/, '') + '/health';
  private readonly _status = signal<SystemStatus>('checking');
  readonly status = this._status.asReadonly();
  private timer?: ReturnType<typeof setInterval>;

  constructor(private http: HttpClient) {}

  start(): void {
    if (this.timer) return;
    this.check();
    this.timer = setInterval(() => this.check(), 60_000);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }

  private check(): void {
    this.http.get<{ status: string }>(this.healthUrl).subscribe({
      next: (res) => this._status.set(res.status === 'OK' ? 'ok' : 'down'),
      error: () => this._status.set('down'),
    });
  }
}
