import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { User } from '../../../core/models/user.model';

type ModalType = 'grant-pro' | 'remove-pro' | 'extend' | 'suspend' | 'delete' | null;

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <!-- ══ HEADER ══ -->
    <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
      <div>
        <h1 class="text-xl font-extrabold text-slate-900 dark:text-white">User Management</h1>
        <p class="text-xs text-slate-400 mt-0.5">{{ total() }} total users</p>
      </div>
      <button (click)="openCreateModal()"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition shadow-sm">
        + Create User
      </button>
    </div>

    <!-- ══ FILTER BAR ══ -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-4 flex flex-wrap gap-3 items-center shadow-sm">
      <div class="relative flex-1 min-w-48">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
        </svg>
        <input type="search" [(ngModel)]="search" (ngModelChange)="onSearch()" placeholder="Search name or email..."
               class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
      </div>
      <select [(ngModel)]="planFilter" (ngModelChange)="loadUsers()"
              class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm">
        <option value="">All Plans</option>
        <option value="free">Free</option>
        <option value="monthly">Pro Monthly</option>
        <option value="yearly">Pro Yearly</option>
      </select>
      <select [(ngModel)]="statusFilter" (ngModelChange)="loadUsers()"
              class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
        <option value="banned">Banned</option>
        <option value="inactive">Inactive</option>
      </select>
      <select [(ngModel)]="subStatusFilter" (ngModelChange)="loadUsers()"
              class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm">
        <option value="">All Subscriptions</option>
        <option value="active">Sub Active</option>
        <option value="cancelled">Cancelled</option>
        <option value="expired">Expired</option>
      </select>
      @if (hasFilters()) {
        <button class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap" (click)="clearFilters()">Clear filters</button>
      }
    </div>

    <!-- Bulk action bar -->
    @if (selected().size > 0) {
      <div class="mb-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl px-4 py-2.5 flex items-center gap-4 flex-wrap">
        <span class="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{{ selected().size }} selected</span>
        <div class="flex gap-2 flex-wrap">
          <button class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition"
                  (click)="bulkGrantPro()">⭐ Grant Pro</button>
          <button class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 hover:bg-amber-200 transition"
                  (click)="bulkSuspend()">⏸ Suspend</button>
          <button class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-200 transition"
                  (click)="bulkActivate()">✅ Activate</button>
          <button class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 hover:bg-red-200 transition"
                  (click)="bulkDelete()">🗑 Delete</button>
        </div>
        <button class="ml-auto text-xs text-slate-400 hover:text-slate-600" (click)="clearSelection()">✕ Deselect all</button>
      </div>
    }

    <!-- ══ TABLE ══ -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      @if (loading()) {
        <div class="p-12 text-center">
          <div class="inline-flex items-center gap-2 text-slate-400">
            <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Loading users...
          </div>
        </div>
      } @else {
        <div class="overflow-x-auto">
          <table class="w-full text-xs min-w-[900px]">
            <thead class="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th class="px-3 py-3 text-left w-8">
                  <input type="checkbox" class="rounded" [checked]="allSelected()" (change)="toggleSelectAll()"/>
                </th>
                @for (h of tableHeaders; track h) {
                  <th class="px-3 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{{ h }}</th>
                }
                <th class="px-3 py-3 text-right font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              @for (user of users(); track user._id) {
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                    [class.bg-indigo-50]="selected().has(user._id)"
                    [class.dark:bg-indigo-900]="selected().has(user._id)">
                  <!-- Checkbox -->
                  <td class="px-3 py-3">
                    <input type="checkbox" class="rounded" [checked]="selected().has(user._id)" (change)="toggleSelect(user._id)"/>
                  </td>
                  <!-- User -->
                  <td class="px-3 py-3">
                    <button class="flex items-center gap-2.5 text-left hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                            (click)="openDrawer(user)">
                      <div class="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
                           [style.background]="avatarColor(user.name)">
                        {{ initials(user.name) }}
                      </div>
                      <div>
                        <p class="font-semibold text-slate-800 dark:text-white text-xs leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">{{ user.name }}</p>
                        <p class="text-[10px] text-slate-400 truncate max-w-[150px]">{{ user.email }}</p>
                      </div>
                    </button>
                  </td>
                  <!-- Account Status -->
                  <td class="px-3 py-3">
                    @if (user.isBanned) {
                      <span class="badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Banned</span>
                    } @else if (user.isSuspended) {
                      <span class="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Suspended</span>
                    } @else if (user.isActive) {
                      <span class="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Active</span>
                    } @else {
                      <span class="badge bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">Inactive</span>
                    }
                  </td>
                  <!-- Plan -->
                  <td class="px-3 py-3">
                    <span [class]="planBadgeClass(user)">{{ planLabel(user) }}</span>
                  </td>
                  <!-- Sub Status -->
                  <td class="px-3 py-3">
                    <span [class]="subStatusBadgeClass(user)">{{ subStatusLabel(user) }}</span>
                  </td>
                  <!-- Expiry -->
                  <td class="px-3 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {{ (user.subscription?.currentPeriodEnd | date:'dd MMM yyyy') ?? '-' }}
                  </td>
                  <!-- Resumes -->
                  <td class="px-3 py-3 text-center text-slate-600 dark:text-slate-400 font-medium">
                    {{ user.subscription?.resumeCount ?? 0 }}
                  </td>
                  <!-- Conversions -->
                  <td class="px-3 py-3 text-center text-slate-600 dark:text-slate-400 font-medium">
                    {{ user.usage?.totalConversions ?? 0 }}
                  </td>
                  <!-- Joined -->
                  <td class="px-3 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {{ user.createdAt | date:'dd MMM yyyy' }}
                  </td>
                  <!-- Actions dropdown -->
                  <td class="px-3 py-3 text-right">
                    <div class="relative inline-block">
                      <button class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition"
                              (click)="toggleMenu(user._id, $event)">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                        </svg>
                      </button>
                      @if (openMenuId() === user._id) {
                        <div class="absolute right-0 top-8 z-30 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 animate-fade-in"
                             (click)="$event.stopPropagation()">
                          <button class="menu-item" (click)="openDrawer(user); closeMenu()">
                            👁 View Profile
                          </button>
                          <button class="menu-item" (click)="openEdit(user); closeMenu()">
                            ✏️ Edit User
                          </button>
                          <div class="my-1 border-t border-slate-100 dark:border-slate-700"></div>
                          <button class="menu-item text-emerald-600 dark:text-emerald-400 font-semibold" (click)="openModal('grant-pro', user); closeMenu()">
                            ⭐ Grant Pro Access
                          </button>
                          <button class="menu-item" (click)="openModal('extend', user); closeMenu()">
                            📅 Extend Subscription
                          </button>
                          @if (user.subscription?.status === 'active') {
                            <button class="menu-item text-amber-600 dark:text-amber-400" (click)="openModal('remove-pro', user); closeMenu()">
                              🔓 Remove Pro Access
                            </button>
                          }
                          <div class="my-1 border-t border-slate-100 dark:border-slate-700"></div>
                          @if (!user.isSuspended && !user.isBanned) {
                            <button class="menu-item text-amber-600 dark:text-amber-400" (click)="openModal('suspend', user); closeMenu()">
                              ⏸ Suspend User
                            </button>
                          }
                          @if (user.isSuspended) {
                            <button class="menu-item text-emerald-600 dark:text-emerald-400" (click)="unsuspendUserAction(user); closeMenu()">
                              ▶ Unsuspend User
                            </button>
                          }
                          @if (user.isBanned) {
                            <button class="menu-item text-emerald-600 dark:text-emerald-400" (click)="unbanUserAction(user); closeMenu()">
                              ✅ Unban User
                            </button>
                          }
                          <button class="menu-item" (click)="resetUsage(user); closeMenu()">
                            🔄 Reset Usage Limits
                          </button>
                          <div class="my-1 border-t border-slate-100 dark:border-slate-700"></div>
                          <button class="menu-item text-red-500 font-semibold" (click)="openModal('delete', user); closeMenu()">
                            🗑 Delete User
                          </button>
                        </div>
                      }
                    </div>
                  </td>
                </tr>
              }
              @if (users().length === 0) {
                <tr>
                  <td colspan="11" class="px-4 py-12 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-4 py-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <p class="text-xs text-slate-500">Showing {{ (page - 1) * limit + 1 }}–{{ Math.min(page * limit, total()) }} of {{ total() }}</p>
          <div class="flex items-center gap-2">
            <button (click)="prevPage()" [disabled]="page === 1"
                    class="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              ← Prev
            </button>
            <span class="text-xs font-medium text-slate-600 dark:text-slate-300 px-2">{{ page }}</span>
            <button (click)="nextPage()" [disabled]="page * limit >= total()"
                    class="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              Next →
            </button>
          </div>
        </div>
      }
    </div>

    <!-- ══ USER DRAWER ══ -->
    @if (drawerUser()) {
      <div class="fixed inset-0 z-40 flex justify-end" (click)="closeDrawer()">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl h-full overflow-y-auto animate-slide-in-right"
             (click)="$event.stopPropagation()">

          <!-- Drawer header -->
          <div class="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-4 flex items-center justify-between z-10">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                   [style.background]="avatarColor(drawerUser()!.name)">
                {{ initials(drawerUser()!.name) }}
              </div>
              <div>
                <p class="font-bold text-slate-800 dark:text-white text-sm">{{ drawerUser()!.name }}</p>
                <p class="text-[11px] text-slate-400">{{ drawerUser()!.email }}</p>
              </div>
            </div>
            <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                    (click)="closeDrawer()">✕</button>
          </div>

          <div class="p-5 space-y-5">
            <!-- Status badges -->
            <div class="flex flex-wrap gap-2">
              <span [class]="planBadgeClass(drawerUser()!)">{{ planLabel(drawerUser()!) }}</span>
              <span [class]="subStatusBadgeClass(drawerUser()!)">{{ subStatusLabel(drawerUser()!) }}</span>
              @if (drawerUser()!.subscription?.grantedByAdmin) {
                <span class="badge bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" title="Manually granted by admin">👨‍💼 Admin Granted</span>
              }
            </div>

            <!-- Quick actions -->
            <div class="flex gap-2 flex-wrap">
              <button class="flex-1 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-200 transition"
                      (click)="openModal('grant-pro', drawerUser()!); closeDrawer()">⭐ Grant Pro</button>
              <button class="flex-1 py-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-200 transition"
                      (click)="openModal('extend', drawerUser()!); closeDrawer()">📅 Extend</button>
              @if (drawerUser()!.subscription?.status === 'active') {
                <button class="flex-1 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 text-xs font-semibold hover:bg-red-100 transition"
                        (click)="openModal('remove-pro', drawerUser()!); closeDrawer()">🔓 Remove Pro</button>
              }
            </div>

            <!-- Account Info -->
            <div class="drawer-section">
              <p class="drawer-section-title">Account Information</p>
              <div class="space-y-2">
                @for (row of accountRows(drawerUser()!); track row.label) {
                  <div class="flex justify-between items-center py-1.5 border-b border-slate-50 dark:border-slate-800 last:border-0">
                    <span class="text-xs text-slate-400">{{ row.label }}</span>
                    <span class="text-xs font-medium text-slate-700 dark:text-slate-200 text-right max-w-[180px] break-words">{{ row.value }}</span>
                  </div>
                }
              </div>
            </div>

            <!-- Subscription Info -->
            <div class="drawer-section">
              <p class="drawer-section-title">Subscription</p>
              <div class="space-y-2">
                @for (row of subscriptionRows(drawerUser()!); track row.label) {
                  <div class="flex justify-between items-center py-1.5 border-b border-slate-50 dark:border-slate-800 last:border-0">
                    <span class="text-xs text-slate-400">{{ row.label }}</span>
                    <span class="text-xs font-medium text-slate-700 dark:text-slate-200">{{ row.value }}</span>
                  </div>
                }
              </div>
            </div>

            <!-- Usage Stats -->
            <div class="drawer-section">
              <p class="drawer-section-title">Usage Statistics</p>
              <div class="grid grid-cols-2 gap-3 mt-3">
                @for (s of usageStats(drawerUser()!); track s.label) {
                  <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                    <p class="text-lg font-extrabold text-slate-800 dark:text-white">{{ s.value }}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">{{ s.label }}</p>
                  </div>
                }
              </div>
            </div>

            <!-- Payment History -->
            @if (drawerPayments().length > 0) {
              <div class="drawer-section">
                <p class="drawer-section-title">Payment History</p>
                <div class="space-y-1.5 mt-2">
                  @for (p of drawerPayments(); track p._id) {
                    <div class="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div>
                        <p class="text-xs font-semibold text-slate-700 dark:text-slate-200 capitalize">Pro {{ p.plan }}</p>
                        <p class="text-[10px] text-slate-400">{{ p.createdAt | date:'dd MMM yyyy' }} · {{ p.invoiceNumber }}</p>
                      </div>
                      <div class="text-right">
                        <p class="text-xs font-bold text-slate-800 dark:text-white">₹{{ p.amount / 100 }}</p>
                        <span class="text-[10px] font-semibold" [class]="p.status === 'captured' ? 'text-emerald-500' : 'text-red-500'">
                          {{ p.status === 'captured' ? 'Paid' : p.status }}
                        </span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Danger zone -->
            <div class="drawer-section border-red-100 dark:border-red-900/30">
              <p class="text-xs font-bold text-red-500 mb-3">Danger Zone</p>
              <div class="flex gap-2 flex-wrap">
                @if (!drawerUser()!.isBanned) {
                  <button class="text-xs px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-semibold hover:bg-amber-100 transition"
                          (click)="openModal('suspend', drawerUser()!); closeDrawer()">⏸ Suspend</button>
                }
                @if (drawerUser()!.isBanned) {
                  <button class="text-xs px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-semibold hover:bg-emerald-100 transition"
                          (click)="unbanUserAction(drawerUser()!); closeDrawer()">✅ Unban</button>
                } @else {
                  <button class="text-xs px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 font-semibold hover:bg-red-100 transition"
                          (click)="banUserAction(drawerUser()!); closeDrawer()">🚫 Ban User</button>
                }
                <button class="text-xs px-3 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 font-semibold hover:bg-red-200 transition"
                        (click)="openModal('delete', drawerUser()!); closeDrawer()">🗑 Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- ══ GRANT PRO MODAL ══ -->
    @if (activeModal() === 'grant-pro' && modalUser()) {
      <div class="modal-backdrop" (click)="closeModal()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-icon bg-emerald-100 dark:bg-emerald-900/30">⭐</div>
          <h3 class="modal-title">Grant Pro Access</h3>
          <p class="modal-subtitle">{{ modalUser()!.name }} · {{ modalUser()!.email }}</p>

          <div class="space-y-3 text-left mb-5">
            <div>
              <label class="form-label">Plan Type</label>
              <select [(ngModel)]="grantForm.plan" class="form-select">
                <option value="monthly">Pro Monthly</option>
                <option value="yearly">Pro Yearly</option>
                <option value="lifetime">Lifetime Pro</option>
              </select>
            </div>
            @if (grantForm.plan !== 'lifetime') {
              <div>
                <label class="form-label">Expiry Date <span class="text-slate-400">(optional - defaults to 30/365 days)</span></label>
                <input type="date" [(ngModel)]="grantForm.expiryDate" class="form-input"/>
              </div>
            }
            <div>
              <label class="form-label">Notes / Reason</label>
              <textarea [(ngModel)]="grantForm.notes" rows="2" placeholder="e.g. Influencer partnership, support refund..."
                        class="form-input resize-none"></textarea>
            </div>
          </div>

          <!-- Confirm preview -->
          <div class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 mb-5 text-left text-xs space-y-1">
            <p class="font-semibold text-emerald-800 dark:text-emerald-300">Confirm Grant:</p>
            <p class="text-emerald-700 dark:text-emerald-400">Plan: <strong>{{ planTypeLabel(grantForm.plan) }}</strong></p>
            @if (grantForm.plan !== 'lifetime' && grantForm.expiryDate) {
              <p class="text-emerald-700 dark:text-emerald-400">Expires: <strong>{{ grantForm.expiryDate | date:'dd MMMM yyyy' }}</strong></p>
            }
          </div>

          <div class="modal-actions">
            <button class="btn-cancel" (click)="closeModal()">Cancel</button>
            <button class="btn-confirm bg-emerald-600 hover:bg-emerald-700" [disabled]="saving()" (click)="submitGrantPro()">
              {{ saving() ? 'Granting...' : 'Grant Access' }}
            </button>
          </div>
        </div>
      </div>
    }

    <!-- ══ REMOVE PRO MODAL ══ -->
    @if (activeModal() === 'remove-pro' && modalUser()) {
      <div class="modal-backdrop" (click)="closeModal()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-icon bg-red-100 dark:bg-red-900/30">🔓</div>
          <h3 class="modal-title">Remove Pro Access</h3>
          <p class="modal-subtitle">{{ modalUser()!.name }} · {{ modalUser()!.email }}</p>
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-5 text-sm text-red-700 dark:text-red-400">
            ⚠ This user will <strong>immediately</strong> lose access to all premium features.
          </div>
          <div class="flex items-center gap-2 mb-5 text-sm text-slate-600 dark:text-slate-400">
            <input type="checkbox" id="remove-confirm" [(ngModel)]="removeProConfirmed" class="rounded"/>
            <label for="remove-confirm" class="cursor-pointer">I understand this action will revoke premium access immediately.</label>
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" (click)="closeModal()">Cancel</button>
            <button class="btn-confirm bg-red-600 hover:bg-red-700" [disabled]="saving() || !removeProConfirmed" (click)="submitRemovePro()">
              {{ saving() ? 'Removing...' : 'Remove Access' }}
            </button>
          </div>
        </div>
      </div>
    }

    <!-- ══ EXTEND SUBSCRIPTION MODAL ══ -->
    @if (activeModal() === 'extend' && modalUser()) {
      <div class="modal-backdrop" (click)="closeModal()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-icon bg-blue-100 dark:bg-blue-900/30">📅</div>
          <h3 class="modal-title">Extend Subscription</h3>
          <p class="modal-subtitle">{{ modalUser()!.name }}</p>

          <div class="space-y-3 text-left mb-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="form-label">Additional Days</label>
                <input type="number" [(ngModel)]="extendForm.days" min="0" class="form-input"/>
              </div>
              <div>
                <label class="form-label">Additional Months</label>
                <input type="number" [(ngModel)]="extendForm.months" min="0" class="form-input"/>
              </div>
            </div>
            <div>
              <label class="form-label">Reason</label>
              <input type="text" [(ngModel)]="extendForm.reason" placeholder="e.g. Support credit, goodwill extension" class="form-input"/>
            </div>
          </div>

          @if (modalUser()?.subscription?.currentPeriodEnd) {
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 mb-4 text-xs text-left space-y-1">
              <p class="font-semibold text-blue-800 dark:text-blue-300">Preview:</p>
              <p class="text-blue-700 dark:text-blue-400">Current: <strong>{{ modalUser()!.subscription!.currentPeriodEnd | date:'dd MMM yyyy' }}</strong></p>
              <p class="text-blue-700 dark:text-blue-400">New Expiry: <strong>{{ previewNewExpiry() | date:'dd MMM yyyy' }}</strong></p>
            </div>
          }

          <div class="modal-actions">
            <button class="btn-cancel" (click)="closeModal()">Cancel</button>
            <button class="btn-confirm bg-blue-600 hover:bg-blue-700" [disabled]="saving()" (click)="submitExtend()">
              {{ saving() ? 'Extending...' : 'Extend Subscription' }}
            </button>
          </div>
        </div>
      </div>
    }

    <!-- ══ SUSPEND MODAL ══ -->
    @if (activeModal() === 'suspend' && modalUser()) {
      <div class="modal-backdrop" (click)="closeModal()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-icon bg-amber-100 dark:bg-amber-900/30">⏸</div>
          <h3 class="modal-title">Suspend User Account</h3>
          <p class="modal-subtitle">{{ modalUser()!.name }} · {{ modalUser()!.email }}</p>

          <div class="space-y-3 text-left mb-5">
            <div>
              <label class="form-label">Reason</label>
              <select [(ngModel)]="suspendForm.reason" class="form-select">
                <option value="">Select reason...</option>
                <option value="Spam">Spam</option>
                <option value="Abuse">Abuse</option>
                <option value="Fraud">Fraud</option>
                <option value="Policy Violation">Policy Violation</option>
                <option value="custom">Custom...</option>
              </select>
            </div>
            @if (suspendForm.reason === 'custom') {
              <div>
                <label class="form-label">Custom Reason</label>
                <input type="text" [(ngModel)]="suspendForm.customReason" placeholder="Describe the reason..." class="form-input"/>
              </div>
            }
            <div>
              <label class="form-label">Duration (hours)</label>
              <input type="number" [(ngModel)]="suspendForm.hours" min="1" class="form-input"/>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-cancel" (click)="closeModal()">Cancel</button>
            <button class="btn-confirm bg-amber-500 hover:bg-amber-600" [disabled]="saving()" (click)="submitSuspend()">
              {{ saving() ? 'Suspending...' : 'Suspend User' }}
            </button>
          </div>
        </div>
      </div>
    }

    <!-- ══ DELETE MODAL ══ -->
    @if (activeModal() === 'delete' && modalUser()) {
      <div class="modal-backdrop" (click)="closeModal()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-icon bg-red-100 dark:bg-red-900/30">🗑</div>
          <h3 class="modal-title text-red-600 dark:text-red-400">Delete User Permanently</h3>

          <!-- User summary -->
          <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 mb-4 text-xs text-left space-y-1.5 text-slate-600 dark:text-slate-300">
            <p>👤 <strong>{{ modalUser()!.name }}</strong></p>
            <p>✉ {{ modalUser()!.email }}</p>
            <p>📄 {{ modalUser()!.subscription?.resumeCount ?? 0 }} resumes · {{ modalUser()!.usage?.totalConversions ?? 0 }} conversions</p>
            @if (modalUser()!.subscription?.status === 'active') {
              <p class="text-amber-600 dark:text-amber-400 font-semibold">⚠ Active subscription will be lost</p>
            }
          </div>

          <div class="mb-5 text-left">
            <label class="form-label">Type <strong class="text-red-600 font-mono">DELETE</strong> to confirm</label>
            <input type="text" [(ngModel)]="deleteConfirmText"
                   placeholder="Type DELETE to enable button"
                   class="form-input font-mono uppercase tracking-widest"/>
          </div>

          <div class="modal-actions">
            <button class="btn-cancel" (click)="closeModal()">Cancel</button>
            <button class="btn-confirm bg-red-600 hover:bg-red-700"
                    [disabled]="deleteConfirmText !== 'DELETE' || saving()"
                    (click)="submitDelete()">
              {{ saving() ? 'Deleting...' : 'Delete Permanently' }}
            </button>
          </div>
        </div>
      </div>
    }

    <!-- ══ CREATE/EDIT USER MODAL ══ -->
    @if (showEditModal()) {
      <div class="modal-backdrop" (click)="showEditModal.set(false)">
        <div class="modal-box max-w-md" (click)="$event.stopPropagation()">
          <h3 class="modal-title">{{ editingUser ? 'Edit User' : 'Create User' }}</h3>

          <div class="space-y-3 text-left mb-5">
            <div>
              <label class="form-label">Name</label>
              <input type="text" [(ngModel)]="editForm.name" class="form-input"/>
            </div>
            @if (!editingUser) {
              <div>
                <label class="form-label">Email</label>
                <input type="email" [(ngModel)]="editForm.email" class="form-input"/>
              </div>
              <div>
                <label class="form-label">Password</label>
                <input type="password" [(ngModel)]="editForm.password" class="form-input"/>
              </div>
            }
            <div>
              <label class="form-label">Role</label>
              <select [(ngModel)]="editForm.role" class="form-select">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label class="form-label">Admin Notes</label>
              <textarea [(ngModel)]="editForm.adminNotes" rows="2" class="form-input resize-none"></textarea>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-cancel" (click)="showEditModal.set(false)">Cancel</button>
            <button class="btn-confirm bg-indigo-600 hover:bg-indigo-700" [disabled]="saving()" (click)="submitEdit()">
              {{ saving() ? 'Saving...' : (editingUser ? 'Save Changes' : 'Create User') }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .badge { @apply inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold; }
    .menu-item { @apply w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left; }
    .modal-backdrop { @apply fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm; }
    .modal-box { @apply w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 text-center; }
    .modal-icon { @apply w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl; }
    .modal-title { @apply text-base font-bold text-slate-800 dark:text-white mb-1; }
    .modal-subtitle { @apply text-xs text-slate-400 mb-4; }
    .modal-actions { @apply flex gap-3; }
    .btn-cancel { @apply flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition; }
    .btn-confirm { @apply flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition disabled:opacity-50; }
    .form-label { @apply text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1; }
    .form-input { @apply w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500; }
    .form-select { @apply w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm; }
    .drawer-section { @apply bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700; }
    .drawer-section-title { @apply text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2; }
  `],
})
export class UsersListComponent implements OnInit {
  private adminSvc = inject(AdminService);
  private notify   = inject(NotificationService);
  private confirm  = inject(ConfirmDialogService);

  readonly users   = signal<User[]>([]);
  readonly loading = signal(true);
  readonly total   = signal(0);
  readonly saving  = signal(false);

  page = 1; limit = 20;
  search = ''; planFilter = ''; statusFilter = ''; subStatusFilter = '';
  searchTimeout: any;
  Math = Math;

  readonly openMenuId  = signal<string | null>(null);
  readonly drawerUser  = signal<User | null>(null);
  readonly drawerPayments = signal<any[]>([]);
  readonly activeModal = signal<ModalType>(null);
  readonly modalUser   = signal<User | null>(null);
  readonly selected    = signal<Set<string>>(new Set());
  readonly showEditModal = signal(false);
  editingUser: User | null = null;

  // Form state
  grantForm   = { plan: 'monthly', expiryDate: '', notes: '' };
  extendForm  = { days: 30, months: 0, reason: '' };
  suspendForm = { reason: '', customReason: '', hours: 24 };
  deleteConfirmText = '';
  removeProConfirmed = false;
  editForm: any = { name: '', email: '', password: '', role: 'user', adminNotes: '' };

  readonly tableHeaders = ['User', 'Account Status', 'Plan', 'Sub Status', 'Expiry', 'Resumes', 'Conversions', 'Joined'];

  allSelected = computed(() => this.users().length > 0 && this.users().every(u => this.selected().has(u._id)));
  hasFilters = computed(() => !!(this.planFilter || this.statusFilter || this.subStatusFilter || this.search));

  ngOnInit() {
    this.loadUsers();
    document.addEventListener('click', () => this.openMenuId.set(null));
  }

  loadUsers(): void {
    this.loading.set(true);
    const params: Record<string, string> = { page: String(this.page), limit: String(this.limit) };
    if (this.search)         params['search'] = this.search;
    if (this.planFilter)     params['plan']   = this.planFilter;
    if (this.statusFilter)   params['status'] = this.statusFilter;
    if (this.subStatusFilter) params['subscriptionStatus'] = this.subStatusFilter;

    this.adminSvc.getUsers(params).subscribe({
      next:  (r) => { this.users.set(r.data); this.total.set(r.pagination.total); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => { this.page = 1; this.loadUsers(); }, 300);
  }

  clearFilters(): void {
    this.search = ''; this.planFilter = ''; this.statusFilter = ''; this.subStatusFilter = '';
    this.page = 1; this.loadUsers();
  }

  prevPage(): void { if (this.page > 1) { this.page--; this.loadUsers(); } }
  nextPage(): void { if (this.page * this.limit < this.total()) { this.page++; this.loadUsers(); } }

  // ── Selection ──────────────────────────────────────────────────────────────
  toggleSelect(id: string): void {
    const s = new Set(this.selected());
    s.has(id) ? s.delete(id) : s.add(id);
    this.selected.set(s);
  }

  toggleSelectAll(): void {
    if (this.allSelected()) {
      this.selected.set(new Set());
    } else {
      this.selected.set(new Set(this.users().map(u => u._id)));
    }
  }

  clearSelection(): void { this.selected.set(new Set()); }

  // ── Menu ───────────────────────────────────────────────────────────────────
  toggleMenu(id: string, e: Event): void {
    e.stopPropagation();
    this.openMenuId.set(this.openMenuId() === id ? null : id);
  }

  closeMenu(): void { this.openMenuId.set(null); }

  // ── Drawer ─────────────────────────────────────────────────────────────────
  openDrawer(user: User): void {
    this.drawerUser.set(user);
    this.drawerPayments.set([]);
    this.adminSvc.getUserPayments(user._id).subscribe({
      next: (r: any) => this.drawerPayments.set(r.data?.payments ?? []),
      error: () => {},
    });
  }

  closeDrawer(): void { this.drawerUser.set(null); }

  // ── Modals ─────────────────────────────────────────────────────────────────
  openModal(type: ModalType, user: User): void {
    this.modalUser.set(user);
    this.activeModal.set(type);
    this.deleteConfirmText = '';
    this.removeProConfirmed = false;
    this.grantForm   = { plan: 'monthly', expiryDate: '', notes: '' };
    this.extendForm  = { days: 30, months: 0, reason: '' };
    this.suspendForm = { reason: '', customReason: '', hours: 24 };
  }

  closeModal(): void { this.activeModal.set(null); this.modalUser.set(null); }

  // ── Grant Pro ──────────────────────────────────────────────────────────────
  submitGrantPro(): void {
    const user = this.modalUser()!;
    const payload: any = { plan: this.grantForm.plan, notes: this.grantForm.notes };
    if (this.grantForm.plan !== 'lifetime' && this.grantForm.expiryDate) {
      payload.expiryDate = this.grantForm.expiryDate;
    }
    this.saving.set(true);
    this.adminSvc.grantPro(user._id, payload).subscribe({
      next: () => {
        this.notify.success('Pro Granted', `${user.name} now has ${this.planTypeLabel(this.grantForm.plan)} access.`);
        this.closeModal(); this.loadUsers(); this.saving.set(false);
      },
      error: (err: any) => { this.notify.error(err?.error?.message || 'Failed to grant pro'); this.saving.set(false); },
    });
  }

  // ── Remove Pro ─────────────────────────────────────────────────────────────
  submitRemovePro(): void {
    const user = this.modalUser()!;
    this.saving.set(true);
    this.adminSvc.removePro(user._id).subscribe({
      next: () => {
        this.notify.success('Pro Removed', `${user.name}'s pro access has been revoked.`);
        this.closeModal(); this.loadUsers(); this.saving.set(false);
      },
      error: (err: any) => { this.notify.error(err?.error?.message || 'Failed'); this.saving.set(false); },
    });
  }

  // ── Extend ─────────────────────────────────────────────────────────────────
  submitExtend(): void {
    const user = this.modalUser()!;
    this.saving.set(true);
    this.adminSvc.extendSubscription(user._id, { days: this.extendForm.days, months: this.extendForm.months, reason: this.extendForm.reason }).subscribe({
      next: (r: any) => {
        const newDate = new Date(r.data?.newExpiry).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        this.notify.success('Extended', `Subscription extended to ${newDate}.`);
        this.closeModal(); this.loadUsers(); this.saving.set(false);
      },
      error: (err: any) => { this.notify.error(err?.error?.message || 'Failed'); this.saving.set(false); },
    });
  }

  // ── Suspend ────────────────────────────────────────────────────────────────
  submitSuspend(): void {
    const user = this.modalUser()!;
    const reason = this.suspendForm.reason === 'custom' ? this.suspendForm.customReason : this.suspendForm.reason;
    if (!reason) { this.notify.warning('Please select a reason'); return; }
    this.saving.set(true);
    this.adminSvc.suspendUser(user._id, this.suspendForm.hours, reason).subscribe({
      next: () => {
        this.notify.success('Suspended', `${user.name} has been suspended for ${this.suspendForm.hours}h.`);
        this.closeModal(); this.loadUsers(); this.saving.set(false);
      },
      error: (err: any) => { this.notify.error(err?.error?.message || 'Failed'); this.saving.set(false); },
    });
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  submitDelete(): void {
    const user = this.modalUser()!;
    this.saving.set(true);
    this.adminSvc.deleteUser(user._id).subscribe({
      next: () => {
        this.notify.success('Deleted', `${user.name}'s account has been permanently deleted.`);
        this.closeModal(); this.loadUsers(); this.saving.set(false);
      },
      error: (err: any) => { this.notify.error(err?.error?.message || 'Failed'); this.saving.set(false); },
    });
  }

  // ── Unsuspend / Unban / Ban ────────────────────────────────────────────────
  async unsuspendUserAction(user: User): Promise<void> {
    const ok = await this.confirm.open({ icon: '▶', title: 'Unsuspend User', message: `Restore full access for ${user.name}?`, confirmLabel: 'Unsuspend' });
    if (!ok) return;
    this.adminSvc.unsuspendUser(user._id).subscribe({
      next: () => { this.notify.success('Unsuspended'); this.loadUsers(); },
      error: (err: any) => this.notify.error(err?.error?.message || 'Failed'),
    });
  }

  async unbanUserAction(user: User): Promise<void> {
    const ok = await this.confirm.open({ icon: '✅', title: 'Unban User', message: `Restore access for ${user.name}?`, confirmLabel: 'Unban' });
    if (!ok) return;
    this.adminSvc.unbanUser(user._id).subscribe({
      next: () => { this.notify.success('Unbanned'); this.loadUsers(); },
      error: (err: any) => this.notify.error(err?.error?.message || 'Failed'),
    });
  }

  async banUserAction(user: User): Promise<void> {
    const ok = await this.confirm.open({ icon: '🚫', title: 'Ban User', message: `Permanently ban ${user.name}? They will lose all access.`, confirmLabel: 'Ban User', danger: true });
    if (!ok) return;
    this.adminSvc.banUser(user._id, 'Banned by admin').subscribe({
      next: () => { this.notify.success('Banned'); this.loadUsers(); },
      error: (err: any) => this.notify.error(err?.error?.message || 'Failed'),
    });
  }

  async resetUsage(user: User): Promise<void> {
    const ok = await this.confirm.open({ icon: '🔄', title: 'Reset Usage', message: `Reset all daily usage limits for ${user.name}?`, confirmLabel: 'Reset' });
    if (!ok) return;
    this.adminSvc.resetUserUsage(user._id).subscribe({
      next: () => this.notify.success('Usage reset'),
      error: (err: any) => this.notify.error(err?.error?.message || 'Failed'),
    });
  }

  // ── Edit / Create ──────────────────────────────────────────────────────────
  openCreateModal(): void {
    this.editingUser = null;
    this.editForm = { name: '', email: '', password: '', role: 'user', adminNotes: '' };
    this.showEditModal.set(true);
  }

  openEdit(user: User): void {
    this.editingUser = user;
    this.editForm = { name: user.name, email: user.email, role: user.role, adminNotes: (user as any).adminNotes || '' };
    this.showEditModal.set(true);
  }

  submitEdit(): void {
    this.saving.set(true);
    if (this.editingUser) {
      this.adminSvc.updateUser(this.editingUser._id, this.editForm).subscribe({
        next: () => { this.notify.success('Updated'); this.showEditModal.set(false); this.loadUsers(); this.saving.set(false); },
        error: (err: any) => { this.notify.error(err?.error?.message || 'Failed'); this.saving.set(false); },
      });
    } else {
      const { name, email, password, role } = this.editForm;
      if (!name || !email || !password) { this.notify.warning('Name, email and password are required'); this.saving.set(false); return; }
      this.adminSvc.createUser({ name, email, password, role } as any).subscribe({
        next: () => { this.notify.success('User created'); this.showEditModal.set(false); this.loadUsers(); this.saving.set(false); },
        error: (err: any) => { this.notify.error(err?.error?.message || 'Failed'); this.saving.set(false); },
      });
    }
  }

  // ── Bulk ───────────────────────────────────────────────────────────────────
  async bulkGrantPro(): Promise<void> {
    const ids = [...this.selected()];
    const ok = await this.confirm.open({ icon: '⭐', title: 'Bulk Grant Pro', message: `Grant Pro Monthly to ${ids.length} selected users?`, confirmLabel: 'Grant Pro' });
    if (!ok) return;
    let done = 0;
    for (const id of ids) {
      this.adminSvc.grantPro(id, { plan: 'monthly' }).subscribe({ next: () => { done++; if (done === ids.length) { this.notify.success(`Granted pro to ${done} users`); this.selected.set(new Set()); this.loadUsers(); } } });
    }
  }

  async bulkSuspend(): Promise<void> {
    const ids = [...this.selected()];
    const ok = await this.confirm.open({ icon: '⏸', title: 'Bulk Suspend', message: `Suspend ${ids.length} selected users for 24 hours?`, confirmLabel: 'Suspend', danger: true });
    if (!ok) return;
    let done = 0;
    for (const id of ids) {
      this.adminSvc.suspendUser(id, 24, 'Bulk suspend by admin').subscribe({ next: () => { done++; if (done === ids.length) { this.notify.success(`Suspended ${done} users`); this.selected.set(new Set()); this.loadUsers(); } } });
    }
  }

  async bulkActivate(): Promise<void> {
    const ids = [...this.selected()];
    const ok = await this.confirm.open({ icon: '✅', title: 'Bulk Activate', message: `Unsuspend and activate ${ids.length} selected users?`, confirmLabel: 'Activate' });
    if (!ok) return;
    let done = 0;
    for (const id of ids) {
      this.adminSvc.unsuspendUser(id).subscribe({ next: () => { done++; if (done === ids.length) { this.notify.success(`Activated ${done} users`); this.selected.set(new Set()); this.loadUsers(); } } });
    }
  }

  async bulkDelete(): Promise<void> {
    const ids = [...this.selected()];
    const ok = await this.confirm.open({ icon: '🗑️', title: 'Bulk Delete', message: `Permanently delete ${ids.length} users? This cannot be undone.`, confirmLabel: 'Delete All', danger: true });
    if (!ok) return;
    let done = 0;
    for (const id of ids) {
      this.adminSvc.deleteUser(id).subscribe({ next: () => { done++; if (done === ids.length) { this.notify.success(`Deleted ${done} users`); this.selected.set(new Set()); this.loadUsers(); } } });
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  initials(name: string): string { return (name ?? 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(); }

  avatarColor(name: string): string {
    const colors = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6'];
    return colors[(name?.charCodeAt(0) ?? 0) % colors.length];
  }

  planLabel(user: User): string {
    if (user.subscription?.grantedByAdmin) return 'Admin Pro';
    const p = user.subscription?.plan;
    if (p === 'monthly') return 'Pro Monthly';
    if (p === 'yearly')  return 'Pro Yearly';
    return 'Free Plan';
  }

  planBadgeClass(user: User): string {
    const base = 'badge ';
    if (user.subscription?.grantedByAdmin) return base + 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
    const p = user.subscription?.plan;
    if (p === 'monthly') return base + 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    if (p === 'yearly')  return base + 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
    return base + 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400';
  }

  subStatusLabel(user: User): string {
    const s = user.subscription?.status;
    if (!s || s === 'free') return 'No sub';
    if (s === 'active') {
      const end = user.subscription?.currentPeriodEnd;
      if (end) {
        const daysLeft = Math.ceil((new Date(end).getTime() - Date.now()) / 86_400_000);
        if (daysLeft <= 7 && daysLeft > 0) return 'Expiring Soon';
      }
      return 'Active';
    }
    if (s === 'cancelled') return 'Cancelled';
    if (s === 'past_due' || s === 'expired') return 'Expired';
    return s;
  }

  subStatusBadgeClass(user: User): string {
    const base = 'badge ';
    const label = this.subStatusLabel(user);
    if (label === 'Active')        return base + 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    if (label === 'Expiring Soon') return base + 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    if (label === 'Expired')       return base + 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    if (label === 'Cancelled')     return base + 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400';
    return base + 'bg-slate-100 text-slate-400';
  }

  planTypeLabel(plan: string): string {
    return plan === 'monthly' ? 'Pro Monthly' : plan === 'yearly' ? 'Pro Yearly' : 'Lifetime Pro';
  }

  accountRows(user: User) {
    return [
      { label: 'User ID',        value: user._id },
      { label: 'Role',           value: user.role },
      { label: 'Email',          value: user.email },
      { label: 'Account Status', value: user.isBanned ? 'Banned' : user.isSuspended ? 'Suspended' : user.isActive ? 'Active' : 'Inactive' },
      { label: 'Joined',         value: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-' },
    ];
  }

  subscriptionRows(user: User) {
    const s = user.subscription;
    return [
      { label: 'Plan',         value: this.planLabel(user) },
      { label: 'Status',       value: this.subStatusLabel(user) },
      { label: 'Started',      value: s?.currentPeriodStart ? new Date(s.currentPeriodStart).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-' },
      { label: 'Expires',      value: s?.currentPeriodEnd  ? new Date(s.currentPeriodEnd).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-' },
      { label: 'Admin Granted', value: s?.grantedByAdmin ? 'Yes' : 'No' },
      { label: 'Admin Notes',  value: (s as any)?.adminNotes || '-' },
    ];
  }

  usageStats(user: User) {
    const s = user.subscription;
    return [
      { label: 'Resumes',     value: s?.resumeCount ?? 0 },
      { label: 'Downloads',   value: s?.totalDownloads ?? 0 },
      { label: 'Conversions', value: user.usage?.totalConversions ?? 0 },
      { label: 'Today',       value: user.usage?.conversionsToday ?? 0 },
    ];
  }

  previewNewExpiry(): Date {
    const base = this.modalUser()?.subscription?.currentPeriodEnd
      ? new Date(this.modalUser()!.subscription!.currentPeriodEnd!)
      : new Date();
    const d = new Date(base);
    d.setDate(d.getDate() + Number(this.extendForm.days));
    d.setMonth(d.getMonth() + Number(this.extendForm.months));
    return d;
  }
}
