import { Injectable, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { JobProgress } from '../models/job.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class WebsocketService implements OnDestroy {
  private socket: any = null;
  private connected = false;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private jobProgressSubject = new Subject<JobProgress>();
  private jobCompleteSubject = new Subject<{ jobId: string; result: unknown }>();
  private jobFailedSubject   = new Subject<{ jobId: string; error: string }>();

  readonly jobProgress$ = this.jobProgressSubject.asObservable();
  readonly jobComplete$ = this.jobCompleteSubject.asObservable();
  readonly jobFailed$   = this.jobFailedSubject.asObservable();

  constructor(private auth: AuthService) {}

  connect(): void {
    if (!this.isBrowser || this.connected || this.socket?.connected) return;

    import('socket.io-client').then(({ io }) => {
      const wsUrl = (environment as any).wsUrl ?? environment.apiUrl.replace('/api', '');
      const token = this.auth.token();

      this.socket = io(wsUrl, {
        auth:                  { token },
        transports:            ['websocket', 'polling'],
        reconnectionAttempts:  10,
        reconnectionDelay:     1_000,
        reconnectionDelayMax:  30_000,
        randomizationFactor:   0.5,
        timeout:               20_000,
        // Socket.io engine.io ping keeps the connection alive server-side
        // (default 25s interval, 20s timeout).  No manual heartbeat needed.
      });

      this.socket.on('connect', () => {
        this.connected = true;
      });

      this.socket.on('disconnect', (reason: string) => {
        this.connected = false;
        // If the server closed the connection, force reconnect immediately
        if (reason === 'io server disconnect') {
          this.socket.connect();
        }
      });

      this.socket.on('connect_error', (_err: Error) => {
        this.connected = false;
      });

      this.socket.on('reconnect', () => {
        this.connected = true;
      });

      this.socket.on('job:progress', (data: JobProgress) =>
        this.jobProgressSubject.next(data),
      );
      this.socket.on('job:complete', (data: any) =>
        this.jobCompleteSubject.next(data),
      );
      this.socket.on('job:failed', (data: any) =>
        this.jobFailedSubject.next(data),
      );
    }).catch(() => {
      // socket.io-client unavailable — HTTP polling fallback is sufficient
    });
  }

  subscribeToJob(jobId: string): void {
    this.socket?.emit('subscribe:job', jobId);
  }

  unsubscribeFromJob(jobId: string): void {
    this.socket?.emit('unsubscribe:job', jobId);
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket    = null;
    this.connected = false;
  }

  ngOnDestroy(): void { this.disconnect(); }
}
