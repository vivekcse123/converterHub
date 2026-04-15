import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (_route, _state) => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (auth.isAdmin()) return true;
  if (auth.isLoggedIn()) { router.navigate(['/dashboard']); return false; }
  router.navigate(['/login']);
  return false;
};
