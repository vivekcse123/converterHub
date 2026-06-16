import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

const PENDING_DOWNLOAD_KEY = 'rb_pending_download';
const RETURN_URL = '/resume-builder';

/** Gates resume PDF downloads behind login/signup so resumes can be tied to a user's account. */
@Injectable({ providedIn: 'root' })
export class ResumeAuthGateService {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly showPrompt = signal(false);

  /** Returns true if the download can proceed now; otherwise opens the login/signup prompt. */
  canDownload(): boolean {
    if (this.auth.isLoggedIn()) return true;
    this.showPrompt.set(true);
    return false;
  }

  dismiss(): void {
    this.showPrompt.set(false);
  }

  goToLogin(): void {
    this.redirectToAuth('/login');
  }

  goToSignup(): void {
    this.redirectToAuth('/register');
  }

  /** Call once on builder init — resumes a download that was interrupted by the login/signup redirect. */
  consumePendingDownload(): boolean {
    if (!this.isBrowser || !this.auth.isLoggedIn()) return false;
    if (sessionStorage.getItem(PENDING_DOWNLOAD_KEY) !== '1') return false;
    sessionStorage.removeItem(PENDING_DOWNLOAD_KEY);
    return true;
  }

  private redirectToAuth(path: string): void {
    if (this.isBrowser) sessionStorage.setItem(PENDING_DOWNLOAD_KEY, '1');
    this.showPrompt.set(false);
    this.router.navigate([path], { queryParams: { returnUrl: RETURN_URL } });
  }
}
