import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { JobProgress } from '../models/job.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WebsocketService implements OnDestroy {
  private socket: any = null;
  private connected  = false;

  private jobProgressSubject = new Subject<JobProgress>();
  private jobCompleteSubject = new Subject<{ jobId: string; result: unknown }>();
  private jobFailedSubject   = new Subject<{ jobId: string; error: string }>();

  readonly jobProgress$ = this.jobProgressSubject.asObservable();
  readonly jobComplete$ = this.jobCompleteSubject.asObservable();
  readonly jobFailed$   = this.jobFailedSubject.asObservable();

  constructor(private auth: AuthService) {}

  connect(): void {
    if (this.connected) return;
    // Dynamically import socket.io-client to avoid bundle issues if not installed
    import('socket.io-client').then(({ io }) => {
      const wsUrl = (environment as any).wsUrl || environment.apiUrl.replace('/api', '');
      const token = this.auth.token();
      this.socket  = io(wsUrl, {
        auth:       { token },
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay:    2000,
      });

      this.socket.on('connect',    () => { this.connected = true; });
      this.socket.on('disconnect', () => { this.connected = false; });
      this.socket.on('job:progress', (data: JobProgress) => this.jobProgressSubject.next(data));
      this.socket.on('job:complete', (data: any) => this.jobCompleteSubject.next(data));
      this.socket.on('job:failed',   (data: any) => this.jobFailedSubject.next(data));
    }).catch(() => {
      // socket.io-client not available — polling fallback works without WS
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
    this.connected = false;
  }

  ngOnDestroy(): void { this.disconnect(); }
}
