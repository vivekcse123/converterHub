import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AdminPermissionService } from '../services/admin-permission.service';

// isAdmin() covers all admin-panel-capable roles (admin/superadmin/editor/
// support/moderator) — fine-grained access within that set is enforced by
// AdminPermissionService inside each module, not here.
export const adminGuard: CanActivateFn = async (_route, _state) => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  const perms  = inject(AdminPermissionService);
  if (auth.isAdmin()) {
    await perms.load();
    return true;
  }
  if (auth.isLoggedIn()) { router.navigate(['/dashboard']); return false; }
  router.navigate(['/login']);
  return false;
};
