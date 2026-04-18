import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/models/user.model';
import { PaginatedApiResponse } from '../../../core/models/user.model';

@Component({
  selector:  'app-users-list',
  standalone: true,
  imports:   [FormsModule],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">User Management</h1>
        <button (click)="showCreateModal = true"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
          + Create User
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-4 mb-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-wrap gap-3">
        <input type="search" [(ngModel)]="search" (ngModelChange)="onSearch()" placeholder="Search name or email..."
               class="flex-1 min-w-48 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm" />
        <select [(ngModel)]="roleFilter" (ngModelChange)="loadUsers()"
                class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="premium">Premium</option>
          <option value="admin">Admin</option>
        </select>
        <select [(ngModel)]="planFilter" (ngModelChange)="loadUsers()"
                class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
          <option value="">All Plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="team">Team</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <select [(ngModel)]="statusFilter" (ngModelChange)="loadUsers()"
                class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
          <option value="">All Status</option>
          <option value="banned">Banned</option>
          <option value="suspended">Suspended</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <!-- Table -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        @if (loading()) {
        <div class="p-8 text-center text-slate-400">Loading users...</div>
        }
        @if (!loading()) {
        <table class="w-full text-sm">
          <thead class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
              <th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
              <th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Plan</th>
              <th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Conversions</th>
              <th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
            @for (user of users(); track user._id) {
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <td class="px-4 py-3">
                <div class="font-medium text-slate-800 dark:text-white">{{ user.name }}</div>
                <div class="text-xs text-slate-500">{{ user.email }}</div>
              </td>
              <td class="px-4 py-3">
                <span [class]="roleBadge(user.role)">{{ user.role }}</span>
              </td>
              <td class="px-4 py-3">
                <span [class]="planBadge(user.subscription?.plan)">{{ user.subscription?.plan || 'free' }}</span>
              </td>
              <td class="px-4 py-3">
                @if (user.isBanned) { <span class="inline-flex px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Banned</span> }
                @if (user.isSuspended && !user.isBanned) { <span class="inline-flex px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Suspended</span> }
                @if (!user.isBanned && !user.isSuspended && user.isActive) { <span class="inline-flex px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Active</span> }
                @if (!user.isActive && !user.isBanned) { <span class="inline-flex px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400">Inactive</span> }
              </td>
              <td class="px-4 py-3 text-slate-600 dark:text-slate-400">
                {{ user.usage?.totalConversions ?? 0 }}
              </td>
              <td class="px-4 py-3 text-slate-500 text-xs">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button (click)="editUser(user)" class="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">Edit</button>
                  @if (!user.isBanned) { <button (click)="banUser(user)" class="text-xs text-red-500 hover:text-red-700">Ban</button> }
                  @if (user.isBanned) { <button (click)="unbanUser(user)" class="text-xs text-emerald-500 hover:text-emerald-700">Unban</button> }
                  <button (click)="deleteUser(user)" class="text-xs text-slate-400 hover:text-red-500">Delete</button>
                </div>
              </td>
            </tr>
            }
          </tbody>
        </table>
        }

        <!-- Pagination -->
        <div class="px-4 py-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
          <div class="text-xs text-slate-500">Total: {{ total() }} users</div>
          <div class="flex gap-2">
            <button (click)="prevPage()" [disabled]="page === 1"
                    class="px-3 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 disabled:opacity-40">Prev</button>
            <span class="px-3 py-1 text-xs text-slate-600 dark:text-slate-400">Page {{ page }}</span>
            <button (click)="nextPage()" [disabled]="page * limit >= total()"
                    class="px-3 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create User Modal -->
    @if (showCreateModal) {
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" (click)="closeCreateOnBackdrop($event)">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 class="text-lg font-bold text-slate-800 dark:text-white mb-4">Create User</h2>
        <div class="space-y-3">
          <div>
            <label class="text-xs text-slate-500 block mb-1">Name</label>
            <input type="text" [(ngModel)]="createForm.name" placeholder="Full name"
                   class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm" />
          </div>
          <div>
            <label class="text-xs text-slate-500 block mb-1">Email</label>
            <input type="email" [(ngModel)]="createForm.email" placeholder="user@example.com"
                   class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm" />
          </div>
          <div>
            <label class="text-xs text-slate-500 block mb-1">Password</label>
            <input type="password" [(ngModel)]="createForm.password" placeholder="Min 8 characters"
                   class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm" />
          </div>
          <div>
            <label class="text-xs text-slate-500 block mb-1">Role</label>
            <select [(ngModel)]="createForm.role"
                   class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
              <option value="user">User</option>
              <option value="premium">Premium</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-slate-500 block mb-1">Plan</label>
            <select [(ngModel)]="createForm.plan"
                   class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="team">Team</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>
        <div class="flex gap-3 mt-5">
          <button (click)="submitCreateUser()" class="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">Create</button>
          <button (click)="showCreateModal = false" class="flex-1 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm">Cancel</button>
        </div>
      </div>
    </div>
    }

    <!-- Edit Modal -->
    @if (selectedUser) {
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" (click)="closeOnBackdrop($event)">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 class="text-lg font-bold text-slate-800 dark:text-white mb-4">Edit User</h2>
        <div class="space-y-3">
          <div>
            <label class="text-xs text-slate-500 block mb-1">Name</label>
            <input type="text" [(ngModel)]="editForm.name"
                   class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm" />
          </div>
          <div>
            <label class="text-xs text-slate-500 block mb-1">Role</label>
            <select [(ngModel)]="editForm.role"
                   class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
              <option value="user">User</option>
              <option value="premium">Premium</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-slate-500 block mb-1">Plan</label>
            <select [(ngModel)]="editForm.plan"
                   class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="team">Team</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-slate-500 block mb-1">Admin Notes</label>
            <textarea [(ngModel)]="editForm.adminNotes" rows="3"
                   class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm resize-none"></textarea>
          </div>
        </div>
        <div class="flex gap-3 mt-5">
          <button (click)="saveUser()" class="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">Save</button>
          <button (click)="selectedUser = null" class="flex-1 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm">Cancel</button>
        </div>
      </div>
    </div>
    }
  `,
})
export class UsersListComponent implements OnInit {
  readonly users   = signal<User[]>([]);
  readonly loading = signal(true);
  readonly total   = signal(0);

  page = 1; limit = 20;
  search = ''; roleFilter = ''; planFilter = ''; statusFilter = '';

  selectedUser:  User | null = null;
  editForm: any  = {};
  showCreateModal = false;
  createForm: any = { name: '', email: '', password: '', role: 'user', plan: 'free' };
  searchTimeout: any;

  constructor(private adminService: AdminService, private notify: NotificationService) {}

  ngOnInit(): void { this.loadUsers(); }

  loadUsers(): void {
    this.loading.set(true);
    const params: Record<string, string> = { page: String(this.page), limit: String(this.limit) };
    if (this.search)      params['search'] = this.search;
    if (this.roleFilter)  params['role']   = this.roleFilter;
    if (this.planFilter)  params['plan']   = this.planFilter;
    if (this.statusFilter) params['status'] = this.statusFilter;

    this.adminService.getUsers(params).subscribe({
      next:  (r) => { this.users.set(r.data); this.total.set(r.pagination.total); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => { this.page = 1; this.loadUsers(); }, 300);
  }

  submitCreateUser(): void {
    const { name, email, password, role, plan } = this.createForm;
    if (!name || !email || !password) { this.notify.error('Name, email and password are required'); return; }
    this.adminService.createUser({ name, email, password, role, subscription: { plan } } as any).subscribe({
      next: () => {
        this.notify.success('User created');
        this.showCreateModal = false;
        this.createForm = { name: '', email: '', password: '', role: 'user', plan: 'free' };
        this.loadUsers();
      },
      error: (err) => this.notify.error(err?.error?.message || 'Failed to create user'),
    });
  }

  closeCreateOnBackdrop(e: MouseEvent): void {
    if (e.target === e.currentTarget) this.showCreateModal = false;
  }

  editUser(user: User): void {
    this.selectedUser = user;
    this.editForm = { name: user.name, role: user.role, plan: user.subscription?.plan || 'free', adminNotes: user.adminNotes || '' };
  }

  saveUser(): void {
    if (!this.selectedUser) return;
    this.adminService.updateUser(this.selectedUser._id, this.editForm).subscribe({
      next: () => { this.notify.success('User updated'); this.selectedUser = null; this.loadUsers(); },
      error: (err) => this.notify.error(err?.error?.message || 'Update failed'),
    });
  }

  banUser(user: User): void {
    const reason = prompt('Reason for ban (optional):') ?? undefined;
    this.adminService.banUser(user._id, reason).subscribe({
      next: () => { this.notify.success('User banned'); this.loadUsers(); },
      error: (err) => this.notify.error(err?.error?.message || 'Failed'),
    });
  }

  unbanUser(user: User): void {
    this.adminService.unbanUser(user._id).subscribe({
      next: () => { this.notify.success('User unbanned'); this.loadUsers(); },
      error: (err) => this.notify.error(err?.error?.message || 'Failed'),
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
    this.adminService.deleteUser(user._id).subscribe({
      next: () => { this.notify.success('User deleted'); this.loadUsers(); },
      error: (err) => this.notify.error(err?.error?.message || 'Failed'),
    });
  }

  prevPage(): void { if (this.page > 1) { this.page--; this.loadUsers(); } }
  nextPage(): void { if (this.page * this.limit < this.total()) { this.page++; this.loadUsers(); } }

  closeOnBackdrop(e: MouseEvent): void {
    if (e.target === e.currentTarget) this.selectedUser = null;
  }

  formatDate(iso: string): string { return iso ? new Date(iso).toLocaleDateString() : '–'; }

  roleBadge(role: string): string {
    const m: Record<string, string> = {
      superadmin: 'inline-flex px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      admin:      'inline-flex px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      premium:    'inline-flex px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      user:       'inline-flex px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    };
    return m[role] || m['user'];
  }

  planBadge(plan?: string): string {
    const m: Record<string, string> = {
      enterprise: 'inline-flex px-2 py-0.5 rounded-full text-xs bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
      team:       'inline-flex px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      pro:        'inline-flex px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      free:       'inline-flex px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    };
    return m[plan || 'free'] || m['free'];
  }
}
