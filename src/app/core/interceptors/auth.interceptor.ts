import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, catchError, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

/** Singleton so duplicate 429s don't stack banners */
let rateLimitToastShown = false;

function showRateLimitToast(isPro: boolean) {
  if (rateLimitToastShown) return;
  rateLimitToastShown = true;

  const el = document.createElement('div');
  el.style.cssText = [
    'position:fixed', 'bottom:24px', 'left:50%', 'transform:translateX(-50%)',
    'background:#1e293b', 'color:#fff', 'padding:14px 20px', 'border-radius:12px',
    'font-size:14px', 'font-family:system-ui,sans-serif', 'z-index:99999',
    'box-shadow:0 8px 24px rgba(0,0,0,.35)', 'display:flex', 'align-items:center',
    'gap:12px', 'max-width:420px', 'width:calc(100% - 32px)',
  ].join(';');

  const msg = document.createElement('span');
  msg.style.flex = '1';

  if (isPro) {
    msg.textContent = 'You\'ve hit the rate limit - please wait a moment and try again.';
    el.appendChild(msg);
  } else {
    msg.innerHTML = '⚡ <strong>Limit reached.</strong> Upgrade to Pro for higher limits.';
    const btn = document.createElement('a');
    btn.href        = '/resume-builder/pricing';
    btn.textContent = 'Upgrade →';
    btn.style.cssText = 'color:#a78bfa;font-weight:700;white-space:nowrap;text-decoration:none;';
    el.appendChild(msg);
    el.appendChild(btn);
  }

  document.body.appendChild(el);
  setTimeout(() => { el.remove(); rateLimitToastShown = false; }, 5000);
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth  = inject(AuthService);
  const token = auth.token();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // Auto-refresh on 401 (except auth endpoints to avoid loops)
      if (err.status === 401 && !req.url.includes('/auth/refresh') && !req.url.includes('/auth/login')) {
        return auth.refreshToken().pipe(
          switchMap((res) => {
            const newToken = res?.data?.accessToken || res?.data?.token;
            const retried  = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
            return next(retried);
          }),
          catchError((refreshErr) => {
            auth.logout();
            return throwError(() => refreshErr);
          })
        );
      }

      // Rate-limit → show upgrade nudge instead of a generic error
      if (err.status === 429) {
        showRateLimitToast(auth.isPro());
      }

      return throwError(() => err);
    })
  );
};
