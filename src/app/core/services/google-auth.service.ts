import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';

declare const google: any;

/**
 * Wraps Google Identity Services' OAuth2 token client so a custom-styled
 * "Continue with Google" button can trigger the consent popup directly
 * (google.accounts.id's One Tap flow can't be reliably triggered on click —
 * it's a passive prompt, not a button-driven flow).
 */
@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private tokenClient: any = null;

  /** Resolves with a Google OAuth2 access token once the user grants consent. */
  signIn(): Promise<string> {
    if (!this.isBrowser) return Promise.reject(new Error('Google sign-in is only available in the browser'));

    return new Promise((resolve, reject) => {
      this.waitForGis()
        .then(() => {
          const client = this.getTokenClient(resolve, reject);
          client.requestAccessToken();
        })
        .catch(reject);
    });
  }

  private getTokenClient(resolve: (token: string) => void, reject: (err: Error) => void): any {
    // A fresh client per call keeps the resolve/reject pair correct for each attempt.
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: environment.googleClientId,
      scope: 'openid email profile',
      callback: (response: any) => {
        if (response.error) {
          reject(new Error(response.error_description || response.error));
          return;
        }
        resolve(response.access_token);
      },
      error_callback: (err: any) => {
        reject(new Error(err?.message || 'Google sign-in was cancelled'));
      },
    });
    return this.tokenClient;
  }

  private waitForGis(): Promise<void> {
    if (typeof google !== 'undefined' && google?.accounts?.oauth2) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const start = Date.now();
      const timeoutMs = 10000;
      const poll = setInterval(() => {
        if (typeof google !== 'undefined' && google?.accounts?.oauth2) {
          clearInterval(poll);
          resolve();
        } else if (Date.now() - start > timeoutMs) {
          clearInterval(poll);
          reject(new Error('Google Sign-In failed to load. Check your connection and try again.'));
        }
      }, 100);
    });
  }
}
