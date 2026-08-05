import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AdminService } from './admin.service';

/** Server-authoritative admin-panel RBAC. Hydrated once (via an
 *  admin.routes.ts resolver) from GET /admin/me/permissions — this service
 *  never hardcodes the role→permission mapping itself, it only caches what
 *  the server said the current admin can do. */
@Injectable({ providedIn: 'root' })
export class AdminPermissionService {
  private adminService = inject(AdminService);

  private readonly _role = signal<string | null>(null);
  private readonly _permissions = signal<Set<string>>(new Set());
  private loaded = false;

  readonly role = this._role.asReadonly();

  async load(): Promise<void> {
    if (this.loaded) return;
    const res = await firstValueFrom(this.adminService.getMyPermissions());
    this._role.set(res.data.role);
    this._permissions.set(new Set(res.data.permissions));
    this.loaded = true;
  }

  can(key: string): boolean {
    return this._permissions().has(key);
  }

  canAny(...keys: string[]): boolean {
    return keys.some(k => this.can(k));
  }
}
