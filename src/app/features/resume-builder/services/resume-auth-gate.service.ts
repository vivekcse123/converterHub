import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PREMIUM_TEMPLATE_IDS } from '../data/resume-templates.data';

const PENDING_DOWNLOAD_KEY = 'rb_pending_download';
const RETURN_URL = '/resume-builder';

/** Gates resume PDF downloads behind login/signup + subscription checks. */
@Injectable({ providedIn: 'root' })
export class ResumeAuthGateService {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly showPrompt    = signal(false);
  readonly showUpgrade   = signal(false);   // show upgrade modal for premium template block

  /**
   * Returns true if the download can proceed.
   * For premium templates, also requires an active Pro subscription.
   * The server enforces this too — this is the UX-layer fast-fail.
   */
  canDownload(templateId?: string): boolean {
    if (!this.auth.isLoggedIn()) {
      this.showPrompt.set(true);
      return false;
    }
    if (templateId && PREMIUM_TEMPLATE_IDS.includes(templateId as any) && !this.auth.isPro()) {
      this.showUpgrade.set(true);
      return false;
    }
    return true;
  }

  dismissUpgrade(): void { this.showUpgrade.set(false); }

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
