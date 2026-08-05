import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PREMIUM_TEMPLATE_IDS } from '../data/resume-templates.data';

/** An account-only resume action that guests get prompted to sign in for. */
export type PendingResumeAction = 'pdf' | 'docx' | 'share';

const PENDING_ACTION_KEY = 'rb_pending_action';
const RETURN_URL = '/resume-builder';

/**
 * Gates account-only resume actions (PDF/Word download, sharing) behind
 * login/signup + subscription checks. Browsing, editing and previewing the
 * resume builder is always open to guests - this service is only consulted
 * at the moment one of those actions is triggered.
 */
@Injectable({ providedIn: 'root' })
export class ResumeAuthGateService {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly showPrompt    = signal(false);
  readonly showUpgrade   = signal(false);   // show upgrade modal for premium template block
  readonly pendingAction = signal<PendingResumeAction | null>(null);

  /**
   * Returns true if the given account-only action can proceed.
   * For premium templates, also requires an active Pro subscription.
   * The server enforces this too - this is the UX-layer fast-fail.
   */
  canProceed(action: PendingResumeAction, templateId?: string): boolean {
    if (!this.auth.isLoggedIn()) {
      this.pendingAction.set(action);
      this.showPrompt.set(true);
      return false;
    }
    if (templateId && PREMIUM_TEMPLATE_IDS.includes(templateId as any)
        && !this.auth.isPro() && !this.auth.hasPurchasedTemplate(templateId)) {
      this.showUpgrade.set(true);
      return false;
    }
    return true;
  }

  /** @deprecated use canProceed('pdf', templateId) */
  canDownload(templateId?: string): boolean {
    return this.canProceed('pdf', templateId);
  }

  dismissUpgrade(): void { this.showUpgrade.set(false); }

  dismiss(): void {
    this.showPrompt.set(false);
    this.pendingAction.set(null);
  }

  goToLogin(): void {
    this.redirectToAuth('/login');
  }

  goToSignup(): void {
    this.redirectToAuth('/register');
  }

  /**
   * Call once on builder init - returns (and clears) the action that was
   * interrupted by a login/signup redirect, so the caller can re-invoke it
   * automatically now that the user is signed in.
   */
  consumePendingAction(): PendingResumeAction | null {
    if (!this.isBrowser || !this.auth.isLoggedIn()) return null;
    const action = sessionStorage.getItem(PENDING_ACTION_KEY) as PendingResumeAction | null;
    if (!action) return null;
    sessionStorage.removeItem(PENDING_ACTION_KEY);
    return action;
  }

  private redirectToAuth(path: string): void {
    const action = this.pendingAction();
    if (this.isBrowser && action) sessionStorage.setItem(PENDING_ACTION_KEY, action);
    this.showPrompt.set(false);
    this.router.navigate([path], { queryParams: { returnUrl: RETURN_URL } });
  }
}
