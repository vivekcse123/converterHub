import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

const PENDING_DOWNLOAD_KEY = 'bd_pending_download';
const RETURN_URL = '/biodata-maker';

@Injectable({ providedIn: 'root' })
export class BiodataAuthGateService {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly showPrompt = signal(false);

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
