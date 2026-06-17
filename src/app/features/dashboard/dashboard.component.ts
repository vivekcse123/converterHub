import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmDialogService } from '../../shared/components/confirm-dialog/confirm-dialog.service';
import { SubscriptionService } from '../resume-builder/services/subscription.service';
import { ResumeStoreService } from '../resume-builder/services/resume-store.service';
import { UpgradeModalComponent } from '../resume-builder/components/upgrade-modal/upgrade-modal.component';
import { ConversionHistory, PaginatedResponse } from '../../core/models/conversion.model';

type Section = 'overview' | 'resumes' | 'subscription' | 'payments' | 'history' | 'profile';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, UpgradeModalComponent],
  template: `
    @if (showUpgrade()) {
      <app-upgrade-modal (close)="showUpgrade.set(false)" (upgraded)="showUpgrade.set(false)" />
    }

    <div class="flex min-h-screen bg-slate-50 dark:bg-slate-950">

      <!-- ── Sidebar ── -->
      <aside class="hidden md:flex flex-col w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 sticky top-0 h-screen overflow-y-auto">
        <!-- Logo -->
        <div class="px-5 py-5 border-b border-slate-100 dark:border-slate-800">
          <a routerLink="/" class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">A</div>
            <span class="font-extrabold text-slate-800 dark:text-white text-sm">ApnaConverter</span>
          </a>
        </div>

        <!-- User info -->
        <div class="px-4 py-4 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {{ initials() }}
            </div>
            <div class="min-w-0">
              <p class="text-xs font-semibold text-slate-800 dark:text-white truncate">{{ auth.user()?.name }}</p>
              <p class="text-[10px] font-medium" [class]="auth.isPro() ? 'text-emerald-500' : 'text-slate-400'">
                {{ auth.isPro() ? planLabel() : 'Free Plan' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Nav items -->
        <nav class="flex-1 px-3 py-4 space-y-0.5">
          @for (item of navItems; track item.id) {
            <button
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
              [class]="activeSection() === item.id
                ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'"
              (click)="setSection(item.id)">
              <span class="text-base">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
              @if (item.badge) {
                <span class="ml-auto text-[10px] font-bold bg-violet-200 dark:bg-violet-900 text-violet-700 dark:text-violet-300 px-1.5 py-0.5 rounded-full">{{ item.badge }}</span>
              }
            </button>
          }
        </nav>

        <!-- Bottom actions -->
        <div class="px-3 py-4 border-t border-slate-100 dark:border-slate-800 space-y-0.5">
          @if (!auth.isPro()) {
            <button
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 transition"
              (click)="showUpgrade.set(true)">
              <span>⭐</span><span>Upgrade to Pro</span>
            </button>
          }
          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            (click)="logout()">
            <span>🚪</span><span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- ── Main content ── -->
      <div class="flex-1 flex flex-col min-w-0">

        <!-- Mobile top bar -->
        <div class="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <p class="font-bold text-slate-800 dark:text-white text-sm">{{ activeSectionLabel() }}</p>
          <div class="flex items-center gap-2">
            @if (!auth.isPro()) {
              <button class="text-xs font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white" (click)="showUpgrade.set(true)">⭐ Pro</button>
            }
          </div>
        </div>

        <!-- Mobile nav -->
        <div class="md:hidden overflow-x-auto bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 pb-2">
          <div class="flex gap-1 pt-2">
            @for (item of navItems; track item.id) {
              <button
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition shrink-0"
                [class]="activeSection() === item.id
                  ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
                (click)="setSection(item.id)">
                {{ item.icon }} {{ item.label }}
              </button>
            }
          </div>
        </div>

        <div class="flex-1 p-5 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-8">

          <!-- ══ OVERVIEW ══ -->
          @if (activeSection() === 'overview') {
            <div>
              <div class="flex items-start justify-between gap-4 flex-wrap mb-6">
                <div>
                  <h1 class="text-xl font-extrabold text-slate-900 dark:text-white">Welcome back, {{ firstName() }} 👋</h1>
                  <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{{ welcomeSubtitle() }}</p>
                </div>
                @if (auth.isPro()) {
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Pro Active
                  </span>
                }
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                @for (stat of overviewStats(); track stat.label) {
                  <div class="card p-4 text-center">
                    <p class="text-xl sm:text-2xl font-extrabold" [class]="stat.color">{{ stat.value }}</p>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">{{ stat.label }}</p>
                  </div>
                }
              </div>

              <!-- Quick actions -->
              <h2 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Quick Actions</h2>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <a routerLink="/resume-builder" class="group card p-4 flex flex-col items-center gap-2 hover:border-violet-300 hover:shadow-md transition cursor-pointer text-center">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">🧑‍💼</div>
                  <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">New Resume</p>
                </a>
                <a routerLink="/biodata-maker" class="group card p-4 flex flex-col items-center gap-2 hover:border-rose-300 hover:shadow-md transition cursor-pointer text-center">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">📋</div>
                  <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">New Biodata</p>
                </a>
                <a routerLink="/resume-builder" class="group card p-4 flex flex-col items-center gap-2 hover:border-emerald-300 hover:shadow-md transition cursor-pointer text-center">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">🎨</div>
                  <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">Templates</p>
                </a>
                <button class="group card p-4 flex flex-col items-center gap-2 hover:border-amber-300 hover:shadow-md transition cursor-pointer text-center"
                        (click)="auth.isPro() ? null : showUpgrade.set(true)">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">⭐</div>
                  <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">{{ auth.isPro() ? 'Pro Active' : 'Go Pro' }}</p>
                </button>
              </div>

              <!-- Recent resumes -->
              @if (resumes().length > 0) {
                <div class="flex items-center justify-between mb-3">
                  <h2 class="text-sm font-bold text-slate-700 dark:text-slate-300">Recent Resumes</h2>
                  <button class="text-xs text-violet-600 dark:text-violet-400 hover:underline" (click)="setSection('resumes')">View all →</button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  @for (r of resumes().slice(0, 3); track r.id) {
                    <div class="card p-4 flex items-center gap-3 hover:border-violet-200 hover:shadow-sm transition group">
                      <div class="w-10 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">{{ r.name.substring(0,2).toUpperCase() }}</div>
                      <div class="flex-1 min-w-0">
                        <p class="font-semibold text-slate-800 dark:text-white text-sm truncate">{{ r.name || 'Untitled' }}</p>
                        <p class="text-[11px] text-slate-400 mt-0.5">{{ r.updatedAt | date:'dd MMM' }}</p>
                      </div>
                      <a routerLink="/resume-builder" [queryParams]="{id: r.id}" class="text-xs text-violet-600 opacity-0 group-hover:opacity-100 transition font-medium">Edit</a>
                    </div>
                  }
                </div>
              }

              <!-- Conversion history preview -->
              @if (history().length > 0) {
                <div class="flex items-center justify-between mt-6 mb-3">
                  <h2 class="text-sm font-bold text-slate-700 dark:text-slate-300">Recent Conversions</h2>
                  <button class="text-xs text-violet-600 dark:text-violet-400 hover:underline" (click)="setSection('history')">View all →</button>
                </div>
                <div class="card overflow-hidden">
                  @for (h of history().slice(0, 5); track h._id) {
                    <div class="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm shrink-0">📄</div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{{ toolLabel(h.tool) }}</p>
                        <p class="text-[10px] text-slate-400">{{ h.createdAt | date:'dd MMM, h:mm a' }}</p>
                      </div>
                      <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full" [class]="statusClass(h.status)">{{ h.status }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <!-- ══ MY RESUMES ══ -->
          @if (activeSection() === 'resumes') {
            <div>
              <div class="flex items-center justify-between mb-5">
                <h1 class="text-lg font-extrabold text-slate-900 dark:text-white">My Resumes</h1>
                <a routerLink="/resume-builder" class="btn btn-primary text-xs py-2 px-4">+ Create New</a>
              </div>

              @if (resumes().length === 0) {
                <div class="card p-12 text-center">
                  <p class="text-5xl mb-4">📄</p>
                  <p class="font-semibold text-slate-700 dark:text-slate-200 mb-2">No resumes yet</p>
                  <p class="text-sm text-slate-400 mb-5">Build your first professional resume in minutes.</p>
                  <a routerLink="/resume-builder" class="btn btn-primary text-sm px-6 py-2.5">Create Resume</a>
                </div>
              }

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                @for (r of resumes(); track r.id) {
                  <div class="card p-5 flex flex-col gap-4 hover:border-violet-200 dark:hover:border-violet-700 hover:shadow-md transition group">
                    <!-- Thumbnail -->
                    <div class="h-28 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                      <span class="text-white font-extrabold text-4xl opacity-30">Aa</span>
                      <div class="absolute bottom-2 right-2 text-[9px] font-bold bg-white/20 text-white px-1.5 py-0.5 rounded capitalize">{{ r.templateId }}</div>
                    </div>
                    <!-- Info -->
                    <div class="flex-1">
                      <p class="font-bold text-slate-800 dark:text-white text-sm truncate">{{ r.name || 'Untitled Resume' }}</p>
                      <p class="text-[11px] text-slate-400 mt-0.5">Updated {{ r.updatedAt | date:'dd MMM yyyy' }}</p>
                    </div>
                    <!-- Actions -->
                    <div class="flex items-center gap-2 flex-wrap">
                      <a [routerLink]="['/resume-builder']" [queryParams]="{id: r.id}"
                         class="flex-1 text-center text-xs py-2 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-semibold hover:bg-violet-200 transition">
                        Edit
                      </a>
                      <button class="flex-1 text-center text-xs py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 transition"
                              (click)="store.duplicateResume(r.id)">
                        Duplicate
                      </button>
                      <button class="text-xs py-2 px-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 font-semibold hover:bg-red-100 transition"
                              (click)="confirmDelete(r.id, r.name)">
                        🗑
                      </button>
                    </div>
                  </div>
                }
              </div>

              @if (!auth.isPro() && resumes().length >= 2) {
                <div class="mt-4 card p-4 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/10 text-center">
                  <p class="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">🔒 Free plan: 2 resume limit</p>
                  <button class="text-xs font-bold text-violet-600 hover:underline" (click)="showUpgrade.set(true)">Upgrade to Pro for unlimited →</button>
                </div>
              }
            </div>
          }

          <!-- ══ SUBSCRIPTION ══ -->
          @if (activeSection() === 'subscription') {
            <div class="max-w-lg">
              <h1 class="text-lg font-extrabold text-slate-900 dark:text-white mb-5">Subscription</h1>

              @if (auth.isPro()) {
                <div class="card p-6 mb-4">
                  <div class="flex items-center gap-3 mb-5">
                    <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-2xl">✅</div>
                    <div>
                      <p class="font-bold text-slate-800 dark:text-white">Pro Active</p>
                      <p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium capitalize">{{ planLabel() }}</p>
                    </div>
                  </div>
                  <div class="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
                    @for (row of subscriptionRows(); track row.label) {
                      <div class="flex items-center justify-between pt-3 first:pt-0">
                        <span class="text-xs text-slate-500">{{ row.label }}</span>
                        <span class="text-xs font-semibold text-slate-800 dark:text-white">{{ row.value }}</span>
                      </div>
                    }
                  </div>
                  @if (auth.user()?.subscription?.cancelAtPeriodEnd) {
                    <div class="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-xs font-medium">
                      ⚠ Subscription cancels at end of current period
                    </div>
                  }
                  <div class="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button class="text-xs text-red-500 hover:text-red-700 font-medium transition"
                            [disabled]="cancelling()"
                            (click)="cancelSub()">
                      {{ cancelling() ? 'Cancelling...' : 'Cancel Subscription' }}
                    </button>
                  </div>
                </div>
              } @else {
                <div class="card p-6 text-center mb-4">
                  <p class="text-5xl mb-4">🚀</p>
                  <p class="font-bold text-slate-800 dark:text-white text-lg mb-2">Upgrade to Pro</p>
                  <p class="text-sm text-slate-500 dark:text-slate-400 mb-5">Unlock all premium templates, no watermark, unlimited resumes.</p>
                  <div class="flex gap-3">
                    <button class="flex-1 py-3 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-bold text-sm hover:bg-violet-200 transition"
                            (click)="subscribeTo('monthly')">
                      ₹9/month
                    </button>
                    <button class="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm hover:opacity-90 transition shadow-md"
                            (click)="subscribeTo('yearly')">
                      ₹99/year ⭐
                    </button>
                  </div>
                </div>

                <!-- Locked features -->
                <div class="card p-5">
                  <h3 class="text-sm font-bold text-slate-800 dark:text-white mb-3">🔒 Pro Features</h3>
                  <div class="space-y-1.5">
                    @for (f of proFeatures; track f.label) {
                      <button class="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 transition group text-left"
                              (click)="showUpgrade.set(true)">
                        <span class="text-lg">{{ f.icon }}</span>
                        <span class="text-sm text-slate-600 dark:text-slate-300 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition">{{ f.label }}</span>
                        <span class="ml-auto text-[10px] font-bold text-slate-300 group-hover:text-violet-400 transition">🔒</span>
                      </button>
                    }
                  </div>
                </div>
              }
            </div>
          }

          <!-- ══ PAYMENTS ══ -->
          @if (activeSection() === 'payments') {
            <div>
              <h1 class="text-lg font-extrabold text-slate-900 dark:text-white mb-5">Payment History</h1>
              @if (payments().length === 0) {
                <div class="card p-10 text-center">
                  <p class="text-4xl mb-3">🧾</p>
                  <p class="text-slate-500 dark:text-slate-400 text-sm">No payment records yet.</p>
                </div>
              } @else {
                <div class="card overflow-hidden">
                  <table class="w-full text-xs">
                    <thead class="bg-slate-50 dark:bg-slate-800">
                      <tr>
                        @for (h of ['Date', 'Invoice', 'Plan', 'Amount', 'Status']; track h) {
                          <th class="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400">{{ h }}</th>
                        }
                      </tr>
                    </thead>
                    <tbody>
                      @for (p of payments(); track p._id) {
                        <tr class="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ p.createdAt | date:'dd MMM yyyy' }}</td>
                          <td class="px-4 py-3 font-mono text-slate-500">{{ p.invoiceNumber ?? '—' }}</td>
                          <td class="px-4 py-3 capitalize font-medium text-slate-700 dark:text-slate-200">Pro {{ p.plan }}</td>
                          <td class="px-4 py-3 font-bold text-slate-800 dark:text-white">₹{{ p.amount / 100 }}</td>
                          <td class="px-4 py-3">
                            <span class="px-2 py-0.5 rounded-full font-semibold"
                                  [class]="p.status === 'captured' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-100 text-red-700'">
                              {{ p.status === 'captured' ? 'Paid' : p.status }}
                            </span>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>
          }

          <!-- ══ CONVERSION HISTORY ══ -->
          @if (activeSection() === 'history') {
            <div>
              <h1 class="text-lg font-extrabold text-slate-900 dark:text-white mb-5">Conversion History</h1>
              @if (loadingHistory()) {
                <div class="card p-8 text-center text-slate-400">Loading...</div>
              } @else if (history().length === 0) {
                <div class="card p-10 text-center">
                  <p class="text-4xl mb-3">📂</p>
                  <p class="text-slate-500 dark:text-slate-400 text-sm">No conversions yet. Try one of our 37+ tools!</p>
                </div>
              } @else {
                <div class="card overflow-hidden">
                  @for (h of history(); track h._id) {
                    <div class="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 group">
                      <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-base shrink-0">📄</div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{{ toolLabel(h.tool) }}</p>
                        <p class="text-[11px] text-slate-400">{{ h.createdAt | date:'dd MMM yyyy, h:mm a' }}</p>
                      </div>
                      <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full" [class]="statusClass(h.status)">{{ h.status }}</span>
                      <button class="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition ml-1"
                              (click)="deleteHistoryEntry(h._id)">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                      </button>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <!-- ══ PROFILE ══ -->
          @if (activeSection() === 'profile') {
            <div class="max-w-lg">
              <h1 class="text-lg font-extrabold text-slate-900 dark:text-white mb-5">Profile Settings</h1>
              <div class="card p-6 space-y-5">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl">
                    {{ initials() }}
                  </div>
                  <div>
                    <p class="font-bold text-slate-800 dark:text-white">{{ auth.user()?.name }}</p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">{{ auth.user()?.email }}</p>
                  </div>
                </div>

                <div class="divide-y divide-slate-100 dark:divide-slate-800">
                  <div class="py-3 flex items-center justify-between">
                    <span class="text-xs text-slate-500">Member since</span>
                    <span class="text-xs font-medium text-slate-700 dark:text-slate-300">{{ auth.user()?.createdAt | date:'MMMM yyyy' }}</span>
                  </div>
                  <div class="py-3 flex items-center justify-between">
                    <span class="text-xs text-slate-500">Current plan</span>
                    <span class="text-xs font-bold" [class]="auth.isPro() ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'">{{ auth.isPro() ? planLabel() : 'Free' }}</span>
                  </div>
                  <div class="py-3 flex items-center justify-between">
                    <span class="text-xs text-slate-500">Total resumes</span>
                    <span class="text-xs font-medium text-slate-700 dark:text-slate-300">{{ resumes().length }}</span>
                  </div>
                </div>

                <div class="pt-2">
                  <button class="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-800 text-red-500 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                          (click)="logout()">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          }

        </div>
      </div>
    </div>

    <!-- Mobile sticky CTA -->
    @if (!auth.isPro()) {
      <div class="fixed bottom-0 left-0 right-0 md:hidden z-30 p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-2xl">
        <button class="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold"
                (click)="showUpgrade.set(true)">
          ⭐ Upgrade to Pro — ₹9/month
        </button>
      </div>
    }
  `,
})
export class DashboardComponent implements OnInit {
  readonly auth    = inject(AuthService);
  readonly subs    = inject(SubscriptionService);
  readonly store   = inject(ResumeStoreService);
  private  api     = inject(ApiService);
  private  notify  = inject(NotificationService);
  private  confirm = inject(ConfirmDialogService);
  private  router  = inject(Router);

  readonly showUpgrade    = signal(false);
  readonly cancelling     = signal(false);
  readonly loadingHistory = signal(true);
  readonly history        = signal<ConversionHistory[]>([]);
  readonly payments       = signal<any[]>([]);
  readonly activeSection  = signal<Section>('overview');
  readonly resumes        = this.store.resumes;

  readonly navItems = [
    { id: 'overview' as Section,      icon: '🏠', label: 'Dashboard' },
    { id: 'resumes'  as Section,      icon: '📄', label: 'My Resumes',  badge: '' },
    { id: 'subscription' as Section,  icon: '⭐', label: 'Subscription' },
    { id: 'payments' as Section,      icon: '🧾', label: 'Payments' },
    { id: 'history'  as Section,      icon: '📂', label: 'Conversions' },
    { id: 'profile'  as Section,      icon: '👤', label: 'Profile' },
  ];

  readonly proFeatures = [
    { icon: '🎨', label: 'All Premium Resume Templates' },
    { icon: '📄', label: 'PDF Downloads — No Watermark' },
    { icon: '♾', label: 'Unlimited Resumes & Biodata' },
    { icon: '🤖', label: 'AI Resume Suggestions (soon)' },
    { icon: '📊', label: 'Full ATS Score Checker' },
    { icon: '📝', label: 'Cover Letter Generator (soon)' },
  ];

  ngOnInit() {
    this.loadHistory();
    if (this.auth.isLoggedIn()) {
      this.subs.getPaymentHistory().then(p => this.payments.set(p));
      this.subs.syncResumeCount(this.store.resumes().length);
    }
  }

  setSection(s: Section) { this.activeSection.set(s); }

  activeSectionLabel() {
    return this.navItems.find(n => n.id === this.activeSection())?.label ?? 'Dashboard';
  }

  initials() {
    return (this.auth.user()?.name ?? 'U').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  }

  firstName() { return (this.auth.user()?.name ?? 'there').split(' ')[0]; }

  planLabel() {
    const p = this.auth.currentPlan();
    return p === 'monthly' ? 'Pro Monthly' : p === 'yearly' ? 'Pro Yearly' : 'Free';
  }

  welcomeSubtitle() {
    return this.auth.isPro()
      ? 'You are on ' + this.planLabel() + ' - all features unlocked.'
      : 'You are on the Free plan. Upgrade to unlock all templates.';
  }

  overviewStats() {
    const sub = this.auth.user()?.subscription;
    return [
      { label: 'Resumes',    value: String(this.resumes().length),  color: 'text-violet-600 dark:text-violet-400' },
      { label: 'Downloads',  value: String(sub?.totalDownloads ?? 0), color: 'text-indigo-600 dark:text-indigo-400' },
      { label: 'Conversions',value: String(this.history().length),   color: 'text-blue-600 dark:text-blue-400' },
      { label: 'Plan',       value: this.planLabel(),                color: this.auth.isPro() ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500' },
      { label: 'Days left',  value: this.auth.isPro() ? String(this.daysLeft()) : '∞', color: 'text-amber-500' },
      { label: 'Payments',   value: String(this.payments().length),  color: 'text-slate-600 dark:text-slate-300' },
    ];
  }

  subscriptionRows() {
    const s = this.auth.user()?.subscription;
    return [
      { label: 'Plan',        value: this.planLabel() },
      { label: 'Status',      value: s?.status ?? 'free' },
      { label: 'Renews',      value: s?.currentPeriodEnd ? new Date(s.currentPeriodEnd).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
      { label: 'Days left',   value: this.daysLeft() + ' days' },
    ];
  }

  daysLeft() {
    const end = this.auth.user()?.subscription?.currentPeriodEnd;
    if (!end) return 0;
    return Math.max(0, Math.ceil((new Date(end).getTime() - Date.now()) / 86_400_000));
  }

  async confirmDelete(id: string, name: string) {
    const ok = await this.confirm.open({
      icon: '🗑️', title: 'Delete Resume',
      message: `Are you sure you want to delete "${name || 'this resume'}"? This cannot be undone.`,
      confirmLabel: 'Delete Resume', cancelLabel: 'Cancel', danger: true,
    });
    if (ok) {
      this.store.deleteResume(id);
      this.notify.success('Deleted', 'Resume removed successfully.');
      this.subs.syncResumeCount(this.store.resumes().length);
    }
  }

  async deleteHistoryEntry(id: string) {
    const ok = await this.confirm.open({
      icon: '🗑️', title: 'Delete Record',
      message: 'Remove this conversion from your history?',
      confirmLabel: 'Delete', danger: true,
    });
    if (!ok) return;
    this.api.delete<void>(`history/${id}`).subscribe({
      next: () => { this.history.update(h => h.filter(e => e._id !== id)); this.notify.success('Deleted'); },
      error: () => this.notify.error('Failed to delete'),
    });
  }

  async cancelSub() {
    const ok = await this.confirm.open({
      icon: '⚠️', title: 'Cancel Subscription',
      message: 'Your access continues until the end of the current billing period. Cancel anyway?',
      confirmLabel: 'Yes, Cancel', danger: true,
    });
    if (!ok) return;
    this.cancelling.set(true);
    await this.subs.cancelSubscription();
    this.cancelling.set(false);
  }

  async logout() {
    const ok = await this.confirm.open({
      icon: '👋', title: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      confirmLabel: 'Sign Out',
    });
    if (ok) this.auth.logout();
  }

  async subscribeTo(plan: 'monthly' | 'yearly') {
    await this.subs.subscribe(plan);
  }

  loadHistory() {
    this.loadingHistory.set(true);
    this.api.get<PaginatedResponse<ConversionHistory>>('history?page=1&limit=50').subscribe({
      next: (res) => { this.history.set(res.data); this.loadingHistory.set(false); },
      error: () => this.loadingHistory.set(false),
    });
  }

  toolLabel(tool: string) {
    const map: Record<string, string> = {
      'image-to-pdf': 'Image → PDF', 'pdf-to-word': 'PDF → Word',
      'word-to-pdf': 'Word → PDF',   'pdf-merge': 'PDF Merge',
      'pdf-split': 'PDF Split',       'pdf-compress': 'PDF Compress',
      'image-resize': 'Image Resize', 'image-compress': 'Image Compress',
    };
    return map[tool] ?? tool;
  }

  statusClass(s: string) {
    const c: Record<string, string> = {
      completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      failed:    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      processing:'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return c[s] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
  }
}
