import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const proGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  if (auth.isPro()) return true;

  // Not Pro — redirect to pricing with a context param so the page can show a tailored message
  const feature = state.url.split('/').pop() ?? 'this feature';
  router.navigate(['/resume-builder/pricing'], { queryParams: { upgrade: feature } });
  return false;
};
