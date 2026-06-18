import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmDialogService } from '../../shared/components/confirm-dialog/confirm-dialog.service';
import { SubscriptionService } from '../resume-builder/services/subscription.service';
import { ResumeStoreService } from '../resume-builder/services/resume-store.service';
import { CareerService, JOB_STATUS_CONFIG, JobStatus } from '../resume-builder/services/career.service';
import { UpgradeModalComponent } from '../resume-builder/components/upgrade-modal/upgrade-modal.component';
import { ConversionHistory, PaginatedResponse } from '../../core/models/conversion.model';
import { ResumeData } from '../resume-builder/models/resume.model';
import { BiodataStoreService } from '../biodata-maker/services/biodata-store.service';
import { BiodataPdfService } from '../biodata-maker/services/biodata-pdf.service';
import { BiodataData } from '../biodata-maker/models/biodata.model';

type Section = 'overview' | 'resumes' | 'jobs' | 'subscription' | 'payments' | 'history' | 'profile' | 'portfolio' | 'biodata';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, FormsModule, UpgradeModalComponent],
  template: `
    @if (showUpgrade()) {
      <app-upgrade-modal (close)="showUpgrade.set(false)" (upgraded)="onUpgraded()" />
    }

    <div class="flex min-h-screen bg-slate-50 dark:bg-slate-950">

      <!-- ── Sidebar ── -->
      <aside class="hidden md:flex flex-col w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <a routerLink="/" class="flex items-center gap-2.5 group" title="Back to home">
            <img src="assets/web-app-manifest-192x192.png" alt="ApnaConverter" class="w-8 h-8 object-contain group-hover:scale-105 transition-transform" width="32" height="32">
            <span class="font-bold text-slate-900 dark:text-white text-sm tracking-tight">Apna<span class="text-violet-600">Converter</span></span>
          </a>
          <a routerLink="/" class="mt-2 flex items-center gap-1 text-[11px] text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors font-medium">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back to Home
          </a>
        </div>
        <div class="px-4 py-4 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">{{ initials() }}</div>
            <div class="min-w-0">
              <p class="text-xs font-semibold text-slate-800 dark:text-white truncate">{{ auth.user()?.name }}</p>
              <p class="text-[10px] font-medium" [class]="auth.isPro() ? 'text-emerald-500' : 'text-slate-400'">{{ auth.isPro() ? planLabel() : 'Free Plan' }}</p>
            </div>
          </div>
        </div>
        <nav class="flex-1 px-3 py-4 space-y-0.5">
          @for (item of navItems; track item.id) {
            <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                    [class]="activeSection() === item.id ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
                    (click)="setSection(item.id)">
              <span class="text-base">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
              @if (item.id === 'jobs' && career.totalJobs() > 0) {
                <span class="ml-auto text-[10px] font-bold bg-violet-200 dark:bg-violet-900 text-violet-700 dark:text-violet-300 px-1.5 py-0.5 rounded-full">{{ career.totalJobs() }}</span>
              }
            </button>
          }
        </nav>
        <div class="px-3 py-4 border-t border-slate-100 dark:border-slate-800 space-y-0.5">
          @if (!auth.isPro()) {
            <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 transition"
                    (click)="showUpgrade.set(true)">
              <span>⭐</span><span>Upgrade to Pro</span>
            </button>
          }
          <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  (click)="logout()">
            <span>🚪</span><span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- ── Main ── -->
      <div class="flex-1 flex flex-col min-w-0">

        <!-- Mobile top bar -->
        <div class="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <p class="font-bold text-slate-800 dark:text-white text-sm">{{ activeSectionLabel() }}</p>
          @if (!auth.isPro()) {
            <button class="text-xs font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white" (click)="showUpgrade.set(true)">⭐ Pro</button>
          }
        </div>
        <div class="md:hidden overflow-x-auto bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 pb-2">
          <div class="flex gap-1 pt-2">
            @for (item of navItems; track item.id) {
              <button class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition shrink-0"
                      [class]="activeSection() === item.id ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'"
                      (click)="setSection(item.id)">
                {{ item.icon }} {{ item.label }}
              </button>
            }
          </div>
        </div>

        <div class="flex-1 p-5 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-8">

          <!-- ══ OVERVIEW ══ -->
          @if (activeSection() === 'overview') {
            <!-- Header -->
            <div class="flex items-start justify-between gap-4 flex-wrap">
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

            <!-- Plan card -->
            <div class="rounded-2xl p-5 border" [class]="auth.isPro() ? 'bg-gradient-to-r from-violet-600 to-indigo-600 border-transparent text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'">
              <div class="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p class="text-xs font-semibold opacity-80 mb-1">{{ auth.isPro() ? 'Active Plan' : 'Current Plan' }}</p>
                  <p class="text-2xl font-extrabold">{{ auth.isPro() ? planLabel() : 'Free Plan' }}</p>
                  @if (auth.isPro() && daysLeft() > 0) {
                    <p class="text-xs mt-1 opacity-80">Renews in {{ daysLeft() }} days · {{ auth.user()?.subscription?.currentPeriodEnd | date:'dd MMM yyyy' }}</p>
                  }
                  @if (!auth.isPro()) {
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">1 resume · 2 templates · basic features</p>
                  }
                </div>
                <div class="flex items-center gap-3">
                  @if (auth.isPro()) {
                    <div class="text-right">
                      <p class="text-xs opacity-80">Resumes</p>
                      <p class="text-xl font-extrabold">{{ store.resumes().length }}</p>
                    </div>
                    <div class="w-px h-8 bg-white/30"></div>
                    <div class="text-right">
                      <p class="text-xs opacity-80">Downloads</p>
                      <p class="text-xl font-extrabold">{{ auth.user()?.subscription?.totalDownloads ?? 0 }}</p>
                    </div>
                  } @else {
                    <button class="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold hover:opacity-90 transition shadow-md"
                            (click)="showUpgrade.set(true)">
                      Upgrade ⭐
                    </button>
                  }
                </div>
              </div>
              @if (!auth.isPro()) {
                <div class="mt-4 flex flex-wrap gap-2">
                  @for (feat of proHighlights; track feat) {
                    <span class="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg">{{ feat }}</span>
                  }
                </div>
              }
            </div>

            <!-- Stats grid -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              @for (stat of overviewStats(); track stat.label) {
                <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 transition cursor-pointer"
                     (click)="setSection(stat.section)">
                  <div class="text-2xl mb-2">{{ stat.icon }}</div>
                  <p class="text-2xl font-extrabold" [class]="stat.color">{{ stat.value }}</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ stat.label }}</p>
                </div>
              }
            </div>

            <!-- Quick actions -->
            <div>
              <h2 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Quick Actions</h2>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <a routerLink="/resume-builder" class="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-violet-300 hover:shadow-md transition text-center">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">📝</div>
                  <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">New Resume</p>
                </a>
                <button class="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-amber-300 hover:shadow-md transition text-center"
                        (click)="setSection('jobs')">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">🎯</div>
                  <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">Track Job</p>
                </button>
                <button class="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-rose-300 hover:shadow-md transition text-center"
                        (click)="setSection('biodata')">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">📋</div>
                  <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">Biodata</p>
                </button>
                <button class="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-emerald-300 hover:shadow-md transition text-center"
                        (click)="auth.isPro() ? null : showUpgrade.set(true)">
                  <div class="w-10 h-10 rounded-xl" [class]="auth.isPro() ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-slate-400 to-slate-500'" style="display:flex;align-items:center;justify-content:center;font-size:1.125rem">
                    {{ auth.isPro() ? '🤖' : '🔒' }}
                  </div>
                  <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">AI Assistant</p>
                </button>
              </div>
            </div>

            <!-- Recent resumes -->
            @if (store.resumes().length > 0) {
              <div>
                <div class="flex items-center justify-between mb-3">
                  <h2 class="text-sm font-bold text-slate-700 dark:text-slate-300">Recent Resumes</h2>
                  <button class="text-xs text-violet-600 dark:text-violet-400 hover:underline" (click)="setSection('resumes')">View all →</button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  @for (r of store.resumes().slice(0, 3); track r.id) {
                    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 hover:border-violet-200 hover:shadow-sm transition group">
                      <div class="w-10 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">{{ (r.name || 'R').substring(0,2).toUpperCase() }}</div>
                      <div class="flex-1 min-w-0">
                        <p class="font-semibold text-slate-800 dark:text-white text-sm truncate">{{ r.name || 'Untitled' }}</p>
                        <div class="flex items-center gap-2 mt-0.5">
                          <p class="text-[11px] text-slate-400">{{ r.updatedAt | date:'dd MMM' }}</p>
                          @if (r.atsScore) {
                            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                  [class]="r.atsScore >= 80 ? 'bg-emerald-100 text-emerald-700' : r.atsScore >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'">
                              ATS {{ r.atsScore }}%
                            </span>
                          }
                        </div>
                      </div>
                      <a routerLink="/resume-builder" [queryParams]="{id: r.id}" class="text-xs text-violet-600 opacity-0 group-hover:opacity-100 transition font-medium">Edit</a>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Job tracker preview -->
            @if (career.totalJobs() > 0) {
              <div>
                <div class="flex items-center justify-between mb-3">
                  <h2 class="text-sm font-bold text-slate-700 dark:text-slate-300">Job Applications</h2>
                  <button class="text-xs text-violet-600 dark:text-violet-400 hover:underline" (click)="setSection('jobs')">View all →</button>
                </div>
                <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  @for (s of jobStatusList; track s) {
                    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
                      <p class="text-lg mb-1">{{ jobConfig(s).icon }}</p>
                      <p class="text-lg font-extrabold text-slate-800 dark:text-white">{{ career.jobStats()[s] || 0 }}</p>
                      <p class="text-[10px] text-slate-400 leading-tight">{{ jobConfig(s).label }}</p>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Pro upsell if free -->
            @if (!auth.isPro()) {
              <div class="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-5">
                <div class="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p class="font-bold text-violet-900 dark:text-violet-200 text-base">Unlock the Full Career Platform</p>
                    <p class="text-xs text-violet-700 dark:text-violet-400 mt-1">Unlimited resumes, AI tools, version history, job tracker, portfolio, ATS checker + more.</p>
                  </div>
                  <button class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold hover:opacity-90 transition shadow-lg whitespace-nowrap"
                          (click)="showUpgrade.set(true)">
                    Upgrade from ₹9/mo
                  </button>
                </div>
              </div>
            }
          }

          <!-- ══ MY RESUMES ══ -->
          @if (activeSection() === 'resumes') {
            <div>
              <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                  <h1 class="text-lg font-extrabold text-slate-900 dark:text-white">My Resumes</h1>
                  <p class="text-xs text-slate-400 mt-0.5">{{ store.resumes().length }} resume{{ store.resumes().length !== 1 ? 's' : '' }} · {{ auth.isPro() ? 'Unlimited' : '1 resume limit on Free' }}</p>
                </div>
                <div class="flex items-center gap-2">
                  @if (!auth.isPro() && store.resumes().length >= 1) {
                    <button class="text-xs font-bold px-3 py-2 rounded-xl border border-violet-300 dark:border-violet-700 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition"
                            (click)="showUpgrade.set(true)">🔒 Unlock More</button>
                  }
                  @if (auth.isPro() || store.resumes().length === 0) {
                    <a routerLink="/resume-builder" class="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 transition">+ New Resume</a>
                  }
                </div>
              </div>

              @if (store.resumes().length === 0) {
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
                  <p class="text-5xl mb-4">📄</p>
                  <p class="font-semibold text-slate-700 dark:text-slate-200 mb-2">No resumes yet</p>
                  <a routerLink="/resume-builder" class="inline-block mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold">Create Resume</a>
                </div>
              }

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                @for (r of store.resumes(); track r.id) {
                  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-4 hover:border-violet-200 dark:hover:border-violet-700 hover:shadow-md transition group">
                    <div class="h-28 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                      <span class="text-white font-extrabold text-4xl opacity-20">Aa</span>
                      <div class="absolute bottom-2 right-2 text-[9px] font-bold bg-white/20 text-white px-1.5 py-0.5 rounded capitalize">{{ r.templateId }}</div>
                      @if (r.atsScore) {
                        <div class="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                             [class]="r.atsScore >= 80 ? 'bg-emerald-500 text-white' : r.atsScore >= 60 ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'">
                          ATS {{ r.atsScore }}
                        </div>
                      }
                    </div>
                    <div class="flex-1">
                      <p class="font-bold text-slate-800 dark:text-white text-sm truncate">{{ r.name || 'Untitled Resume' }}</p>
                      <p class="text-[11px] text-slate-400 mt-0.5">Updated {{ r.updatedAt | date:'dd MMM yyyy' }}</p>
                      @if ((r.versions?.length ?? 0) > 0) {
                        <p class="text-[10px] text-violet-500 mt-0.5">{{ r.versions!.length }} version{{ r.versions!.length !== 1 ? 's' : '' }} saved</p>
                      }
                    </div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <a [routerLink]="['/resume-builder']" [queryParams]="{id: r.id}"
                         class="flex-1 text-center text-xs py-2 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-semibold hover:bg-violet-200 transition">Edit</a>
                      @if (auth.isPro()) {
                        <button class="flex-1 text-center text-xs py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 transition"
                                (click)="duplicateResume(r)">Copy</button>
                        <button class="flex-1 text-center text-xs py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 transition"
                                (click)="saveVersion(r)">💾 Save Ver.</button>
                      } @else {
                        <button class="flex-1 text-center text-xs py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-semibold cursor-not-allowed"
                                (click)="showUpgrade.set(true)" title="Pro feature">🔒 Copy</button>
                      }
                      <button class="text-xs py-2 px-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 font-semibold hover:bg-red-100 transition"
                              (click)="confirmDelete(r)">🗑</button>
                    </div>
                    <!-- Versions -->
                    @if (auth.isPro() && (r.versions?.length ?? 0) > 0 && expandedVersions() === r.id) {
                      <div class="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1.5">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Version History</p>
                        @for (v of r.versions!.slice(0, 5); track v.versionId) {
                          <div class="flex items-center justify-between gap-2 text-xs">
                            <div>
                              <p class="font-medium text-slate-700 dark:text-slate-200">{{ v.label }}</p>
                            </div>
                            <button class="text-violet-600 dark:text-violet-400 hover:underline whitespace-nowrap"
                                    (click)="restoreVersion(r.id, v.versionId)">Restore</button>
                          </div>
                        }
                      </div>
                    }
                    @if (auth.isPro() && (r.versions?.length ?? 0) > 0) {
                      <button class="text-[11px] text-center text-slate-400 hover:text-violet-600 transition"
                              (click)="toggleVersions(r.id)">
                        {{ expandedVersions() === r.id ? '▲ Hide history' : '▼ Version history (' + r.versions!.length + ')' }}
                      </button>
                    }
                  </div>
                }
              </div>

              @if (!auth.isPro() && store.resumes().length >= 1) {
                <div class="mt-4 bg-amber-50 dark:bg-amber-900/10 border border-dashed border-amber-300 dark:border-amber-700 rounded-2xl p-4 text-center">
                  <p class="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">🔒 Free plan: 1 resume limit</p>
                  <button class="text-xs font-bold text-violet-600 hover:underline" (click)="showUpgrade.set(true)">Upgrade to Pro for unlimited →</button>
                </div>
              }
            </div>
          }

          <!-- ══ JOB TRACKER ══ -->
          @if (activeSection() === 'jobs') {
            <div>
              <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                  <h1 class="text-lg font-extrabold text-slate-900 dark:text-white">Job Tracker</h1>
                  <p class="text-xs text-slate-400 mt-0.5">Track your job applications in one place</p>
                </div>
                <button class="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 transition"
                        (click)="openAddJob()">+ Add Application</button>
              </div>

              <!-- Status filter tabs -->
              <div class="flex gap-2 overflow-x-auto pb-1 mb-4">
                <button class="text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition"
                        [class]="jobFilter() === '' ? 'bg-violet-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'"
                        (click)="jobFilter.set(''); loadJobs()">All ({{ career.totalJobs() }})</button>
                @for (s of jobStatusList; track s) {
                  <button class="text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition"
                          [class]="jobFilter() === s ? 'bg-violet-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'"
                          (click)="jobFilter.set(s); loadJobs()">
                    {{ jobConfig(s).icon }} {{ jobConfig(s).label }} ({{ career.jobStats()[s] || 0 }})
                  </button>
                }
              </div>

              @if (career.loading()) {
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-sm">Loading...</div>
              } @else if (career.jobs().length === 0) {
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
                  <p class="text-5xl mb-4">🎯</p>
                  <p class="font-semibold text-slate-700 dark:text-slate-200 mb-1">No applications yet</p>
                  <p class="text-sm text-slate-400 mb-5">Start tracking your job search journey.</p>
                  <button class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold" (click)="openAddJob()">Add First Application</button>
                </div>
              } @else {
                <div class="space-y-2">
                  @for (job of career.jobs(); track job._id) {
                    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4 hover:border-violet-200 dark:hover:border-violet-700 transition group">
                      <div class="text-2xl shrink-0">{{ jobConfig(job.status).icon }}</div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                          <p class="font-bold text-slate-800 dark:text-white text-sm truncate">{{ job.jobTitle }}</p>
                          <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full {{ jobConfig(job.status).color }}">{{ jobConfig(job.status).label }}</span>
                        </div>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ job.company }}{{ job.location ? ' · ' + job.location : '' }}</p>
                        <p class="text-[11px] text-slate-400 mt-0.5">Applied {{ job.appliedDate | date:'dd MMM yyyy' }}</p>
                      </div>
                      <div class="flex items-center gap-2 shrink-0">
                        <select class="text-[11px] font-semibold border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                                [value]="job.status"
                                (change)="updateJobStatus(job._id, $event)">
                          @for (s of jobStatusList; track s) {
                            <option [value]="s">{{ jobConfig(s).label }}</option>
                          }
                        </select>
                        <button class="text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                (click)="deleteJob(job._id)">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <!-- ══ SUBSCRIPTION ══ -->
          @if (activeSection() === 'subscription') {
            <div class="max-w-lg">
              <h1 class="text-lg font-extrabold text-slate-900 dark:text-white mb-5">Subscription</h1>
              @if (auth.isPro()) {
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-4">
                  <div class="flex items-center gap-3 mb-5">
                    <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-2xl">✅</div>
                    <div><p class="font-bold text-slate-800 dark:text-white">Pro Active</p><p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium capitalize">{{ planLabel() }}</p></div>
                  </div>
                  <div class="space-y-2 divide-y divide-slate-100 dark:divide-slate-800">
                    @for (row of subscriptionRows(); track row.label) {
                      <div class="flex items-center justify-between pt-2 first:pt-0">
                        <span class="text-xs text-slate-500">{{ row.label }}</span>
                        <span class="text-xs font-semibold text-slate-800 dark:text-white">{{ row.value }}</span>
                      </div>
                    }
                  </div>
                  <div class="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button class="text-xs text-red-500 hover:text-red-700 font-medium" [disabled]="cancelling()" (click)="cancelSub()">
                      {{ cancelling() ? 'Cancelling...' : 'Cancel Subscription' }}
                    </button>
                  </div>
                </div>
              } @else {
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center mb-4">
                  <p class="text-5xl mb-4">🚀</p>
                  <p class="font-bold text-slate-800 dark:text-white text-lg mb-2">Upgrade to Pro</p>
                  <p class="text-sm text-slate-500 dark:text-slate-400 mb-5">Unlock the full career platform.</p>
                  <div class="flex gap-3">
                    <button class="flex-1 py-3 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-bold text-sm hover:bg-violet-200 transition" (click)="subscribeTo('monthly')">₹9/month</button>
                    <button class="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm hover:opacity-90 transition shadow-md" (click)="subscribeTo('yearly')">₹99/year ⭐</button>
                  </div>
                </div>
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
                  <h3 class="text-sm font-bold text-slate-800 dark:text-white mb-3">🔒 Pro Features</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    @for (f of allProFeatures; track f) {
                      <button class="flex items-center gap-2 p-2 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 transition text-left" (click)="showUpgrade.set(true)">
                        <span class="text-sm">✓</span><span class="text-xs text-slate-600 dark:text-slate-300">{{ f }}</span>
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
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center">
                  <p class="text-4xl mb-3">🧾</p><p class="text-slate-500 text-sm">No payments yet.</p>
                </div>
              } @else {
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <table class="w-full text-xs">
                    <thead class="bg-slate-50 dark:bg-slate-800">
                      <tr>@for (h of ['Date','Invoice','Plan','Amount','Status']; track h) { <th class="px-4 py-3 text-left font-semibold text-slate-500">{{ h }}</th> }</tr>
                    </thead>
                    <tbody>
                      @for (p of payments(); track p._id) {
                        <tr class="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ p.createdAt | date:'dd MMM yyyy' }}</td>
                          <td class="px-4 py-3 font-mono text-slate-500">{{ p.invoiceNumber ?? '—' }}</td>
                          <td class="px-4 py-3 capitalize font-medium text-slate-700 dark:text-slate-200">Pro {{ p.plan }}</td>
                          <td class="px-4 py-3 font-bold text-slate-800 dark:text-white">₹{{ p.amount / 100 }}</td>
                          <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full font-semibold" [class]="p.status === 'captured' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'">{{ p.status === 'captured' ? 'Paid' : p.status }}</span></td>
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
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-400">Loading...</div>
              } @else if (history().length === 0) {
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center">
                  <p class="text-4xl mb-3">📂</p><p class="text-slate-500 text-sm">No conversions yet.</p>
                </div>
              } @else {
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  @for (h of history(); track h._id) {
                    <div class="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 group">
                      <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-base shrink-0">📄</div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{{ toolLabel(h.tool) }}</p>
                        <p class="text-[11px] text-slate-400">{{ h.createdAt | date:'dd MMM yyyy, h:mm a' }}</p>
                      </div>
                      <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full" [class]="statusClass(h.status)">{{ h.status }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <!-- ══ PORTFOLIO ══ -->
          @if (activeSection() === 'portfolio') {
            <div class="max-w-lg">
              <h1 class="text-lg font-extrabold text-slate-900 dark:text-white mb-5">Portfolio</h1>
              @if (!auth.isPro()) {
                <div class="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 text-center space-y-3">
                  <p class="text-4xl">🌐</p>
                  <p class="font-bold text-slate-800 dark:text-white">Portfolio Page — Pro Only</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">Create a public profile with your bio, skills, and projects.</p>
                  <button class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold" (click)="showUpgrade.set(true)">Upgrade to Pro ⭐</button>
                </div>
              } @else if (career.portfolio()) {
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">{{ initials() }}</div>
                    <div>
                      <p class="font-bold text-slate-800 dark:text-white">{{ career.portfolio()!.displayName || career.portfolio()!.username }}</p>
                      <p class="text-xs text-slate-400">{{ career.portfolio()!.tagline }}</p>
                    </div>
                    <a [routerLink]="['/p', career.portfolio()!.username]" target="_blank"
                       class="ml-auto text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline">View public →</a>
                  </div>
                  <div class="flex gap-3">
                    <a routerLink="/resume-builder/portfolio" class="flex-1 text-center py-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold hover:bg-violet-200 transition">Edit Portfolio</a>
                    <a routerLink="/resume-builder/cover-letter" class="flex-1 text-center py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition">Cover Letter</a>
                  </div>
                </div>
              } @else {
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3">
                  <p class="text-4xl">🌐</p>
                  <p class="font-bold text-slate-800 dark:text-white">No portfolio yet</p>
                  <a routerLink="/resume-builder/portfolio" class="inline-block mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold">Create Portfolio</a>
                </div>
              }
            </div>
          }

          <!-- ══ BIODATA ══ -->
          @if (activeSection() === 'biodata') {
            <div>
              <div class="flex items-center justify-between mb-5">
                <h1 class="text-lg font-extrabold text-slate-900 dark:text-white">My Biodata</h1>
                <a routerLink="/biodata-maker" class="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold hover:opacity-90 transition">+ Create New</a>
              </div>

              @if (biodataStore.biodatas().length === 0) {
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
                  <p class="text-5xl">📋</p>
                  <p class="font-bold text-slate-800 dark:text-white text-base">No biodata yet</p>
                  <p class="text-sm text-slate-500 dark:text-slate-400">Create a marriage or professional biodata with instant PDF download.</p>
                  <a routerLink="/biodata-maker" class="inline-block mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-bold">Create Biodata</a>
                </div>
              } @else {
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  @for (b of biodataStore.biodatas(); track b.id) {
                    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-rose-200 dark:hover:border-rose-800 hover:shadow-sm transition">
                      <div class="flex items-start gap-3">
                        <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow">
                          {{ (b.personal.fullName || b.name || 'B').substring(0, 2).toUpperCase() }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="font-semibold text-slate-800 dark:text-white text-sm truncate">{{ b.name }}</p>
                          <div class="flex items-center gap-2 mt-0.5">
                            <span class="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                                  [class]="b.type === 'marriage' ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300' : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300'">
                              {{ biodataTypeLabel(b) }}
                            </span>
                            <span class="text-[10px] text-slate-400">{{ b.updatedAt | date:'dd MMM yyyy' }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="flex gap-2 mt-auto">
                        <button class="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300 transition"
                                (click)="editBiodata(b)">✏️ Edit</button>
                        <button class="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300 transition"
                                (click)="downloadBiodata(b)">⬇ PDF</button>
                        <button class="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 transition"
                                (click)="confirmDeleteBiodata(b)">🗑</button>
                      </div>
                    </div>
                  }
                  <!-- Add new card -->
                  <a routerLink="/biodata-maker" class="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-center hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-sm transition group min-h-[140px]">
                    <span class="text-3xl group-hover:scale-110 transition-transform">➕</span>
                    <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-rose-600 transition">New Biodata</p>
                  </a>
                </div>
              }
            </div>
          }

          <!-- ══ PROFILE ══ -->
          @if (activeSection() === 'profile') {
            <div class="max-w-lg">
              <h1 class="text-lg font-extrabold text-slate-900 dark:text-white mb-5">Profile</h1>
              <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl">{{ initials() }}</div>
                  <div>
                    <p class="font-bold text-slate-800 dark:text-white">{{ auth.user()?.name }}</p>
                    <p class="text-sm text-slate-500">{{ auth.user()?.email }}</p>
                  </div>
                </div>
                <div class="divide-y divide-slate-100 dark:divide-slate-800">
                  <div class="py-3 flex justify-between"><span class="text-xs text-slate-500">Member since</span><span class="text-xs font-medium text-slate-700 dark:text-slate-300">{{ auth.user()?.createdAt | date:'MMMM yyyy' }}</span></div>
                  <div class="py-3 flex justify-between"><span class="text-xs text-slate-500">Current plan</span><span class="text-xs font-bold" [class]="auth.isPro() ? 'text-emerald-600' : 'text-slate-500'">{{ auth.isPro() ? planLabel() : 'Free' }}</span></div>
                  <div class="py-3 flex justify-between"><span class="text-xs text-slate-500">Total resumes</span><span class="text-xs font-medium text-slate-700 dark:text-slate-300">{{ store.resumes().length }}</span></div>
                  <div class="py-3 flex justify-between"><span class="text-xs text-slate-500">Job applications</span><span class="text-xs font-medium text-slate-700 dark:text-slate-300">{{ career.totalJobs() }}</span></div>
                </div>
                <button class="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-800 text-red-500 text-sm font-semibold hover:bg-red-50 transition" (click)="logout()">Sign Out</button>
              </div>
            </div>
          }

        </div>
      </div>
    </div>

    <!-- Add Job Modal -->
    @if (showAddJob()) {
      <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" (click)="showAddJob.set(false)">
        <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6" (click)="$event.stopPropagation()">
          <h3 class="text-base font-bold text-slate-800 dark:text-white mb-4">Add Job Application</h3>
          <div class="space-y-3">
            <div><label class="text-xs font-semibold text-slate-500 block mb-1">Job Title *</label><input type="text" [(ngModel)]="jobForm.jobTitle" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"/></div>
            <div><label class="text-xs font-semibold text-slate-500 block mb-1">Company *</label><input type="text" [(ngModel)]="jobForm.company" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"/></div>
            <div class="grid grid-cols-2 gap-3">
              <div><label class="text-xs font-semibold text-slate-500 block mb-1">Location</label><input type="text" [(ngModel)]="jobForm.location" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none"/></div>
              <div><label class="text-xs font-semibold text-slate-500 block mb-1">Status</label>
                <select [(ngModel)]="jobForm.status" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm">
                  @for (s of jobStatusList; track s) { <option [value]="s">{{ jobConfig(s).label }}</option> }
                </select>
              </div>
            </div>
            <div><label class="text-xs font-semibold text-slate-500 block mb-1">Job URL</label><input type="url" [(ngModel)]="jobForm.jobUrl" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none"/></div>
            <div><label class="text-xs font-semibold text-slate-500 block mb-1">Notes</label><textarea [(ngModel)]="jobForm.notes" rows="2" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm resize-none focus:outline-none"></textarea></div>
          </div>
          <div class="flex gap-3 mt-5">
            <button class="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition" (click)="showAddJob.set(false)">Cancel</button>
            <button class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white hover:opacity-90 transition" [disabled]="savingJob()" (click)="submitJob()">{{ savingJob() ? 'Adding...' : 'Add Application' }}</button>
          </div>
        </div>
      </div>
    }

    <!-- Mobile sticky CTA -->
    @if (!auth.isPro()) {
      <div class="fixed bottom-0 left-0 right-0 md:hidden z-30 p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-2xl">
        <button class="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold" (click)="showUpgrade.set(true)">⭐ Upgrade to Pro — ₹9/month</button>
      </div>
    }
  `,
})
export class DashboardComponent implements OnInit {
  readonly auth          = inject(AuthService);
  readonly subs          = inject(SubscriptionService);
  readonly store         = inject(ResumeStoreService);
  readonly career        = inject(CareerService);
  readonly biodataStore  = inject(BiodataStoreService);
  private  biodataPdf    = inject(BiodataPdfService);
  private  api           = inject(ApiService);
  private  notify        = inject(NotificationService);
  private  confirm       = inject(ConfirmDialogService);
  private  router        = inject(Router);

  readonly showUpgrade    = signal(false);
  readonly cancelling     = signal(false);
  readonly loadingHistory = signal(true);
  readonly history        = signal<ConversionHistory[]>([]);
  readonly payments       = signal<any[]>([]);
  readonly activeSection  = signal<Section>('overview');
  readonly expandedVersions = signal<string | null>(null);
  readonly showAddJob     = signal(false);
  readonly savingJob      = signal(false);
  readonly jobFilter      = signal<string>('');

  jobForm: any = { jobTitle: '', company: '', location: '', status: 'applied', jobUrl: '', notes: '' };

  readonly navItems = [
    { id: 'overview'      as Section, icon: '🏠', label: 'Dashboard' },
    { id: 'resumes'       as Section, icon: '📄', label: 'My Resumes' },
    { id: 'jobs'          as Section, icon: '🎯', label: 'Job Tracker' },
    { id: 'biodata'       as Section, icon: '📋', label: 'My Biodata' },
    { id: 'portfolio'     as Section, icon: '🌐', label: 'Portfolio' },
    { id: 'subscription'  as Section, icon: '⭐', label: 'Subscription' },
    { id: 'payments'      as Section, icon: '🧾', label: 'Payments' },
    { id: 'history'       as Section, icon: '📂', label: 'Conversions' },
    { id: 'profile'       as Section, icon: '👤', label: 'Profile' },
  ];

  readonly proHighlights = ['Unlimited resumes', 'Version history', 'AI assistant', 'ATS checker', 'Job tracker', 'Cover letter builder', 'Portfolio page'];

  readonly allProFeatures = [
    'Unlimited resumes', 'Unlimited PDF downloads', 'All 10 templates (3 premium)',
    'Resume duplication', 'Version history', 'Cover letter builder',
    'ATS score checker', 'Job description match', 'AI summary generator',
    'AI bullet rewriter', 'Shareable resume links', 'Personal portfolio',
    'Job application tracker', 'Priority support',
  ];

  readonly jobStatusList: JobStatus[] = ['saved','applied','interviewing','offer','rejected','withdrawn'];

  ngOnInit() {
    this.loadHistory();
    this.career.loadStats();
    this.career.loadJobs();
    if (this.auth.isLoggedIn()) {
      this.subs.getPaymentHistory().then(p => this.payments.set(p));
      this.subs.syncResumeCount(this.store.resumes().length);
      if (this.auth.isPro()) this.career.loadPortfolio();
    }
  }

  setSection(s: Section) {
    this.activeSection.set(s);
    if (s === 'jobs') this.loadJobs();
    if (s === 'portfolio' && !this.career.portfolio()) this.career.loadPortfolio();
  }

  activeSectionLabel() { return this.navItems.find(n => n.id === this.activeSection())?.label ?? 'Dashboard'; }
  initials() { return (this.auth.user()?.name ?? 'U').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(); }
  firstName() { return (this.auth.user()?.name ?? 'there').split(' ')[0]; }
  planLabel() { const p = this.auth.currentPlan(); return p === 'monthly' ? 'Pro Monthly' : p === 'yearly' ? 'Pro Yearly' : 'Free'; }
  welcomeSubtitle() { return this.auth.isPro() ? 'Full career platform unlocked.' : 'Free plan · Upgrade to unlock all features.'; }
  jobConfig(s: string) { return JOB_STATUS_CONFIG[s as JobStatus] ?? { label: s, color: '', icon: '📋' }; }

  daysLeft() {
    const end = this.auth.user()?.subscription?.currentPeriodEnd;
    if (!end) return 0;
    return Math.max(0, Math.ceil((new Date(end).getTime() - Date.now()) / 86_400_000));
  }

  overviewStats() {
    return [
      { icon: '📄', label: 'Resumes',      value: String(this.store.resumes().length),   color: 'text-violet-600',  section: 'resumes' as Section },
      { icon: '🎯', label: 'Applications', value: String(this.career.totalJobs()),        color: 'text-amber-500',   section: 'jobs' as Section },
      { icon: '📋', label: 'Biodatas',     value: String(this.biodataStore.biodatas().length), color: 'text-rose-500', section: 'biodata' as Section },
      { icon: '🔄', label: 'Conversions',  value: String(this.history().length),          color: 'text-blue-600',    section: 'history' as Section },
    ];
  }

  subscriptionRows() {
    const s = this.auth.user()?.subscription;
    return [
      { label: 'Plan',      value: this.planLabel() },
      { label: 'Status',    value: s?.status ?? 'free' },
      { label: 'Renews',    value: s?.currentPeriodEnd ? new Date(s.currentPeriodEnd).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
      { label: 'Days left', value: this.daysLeft() + ' days' },
    ];
  }

  async confirmDelete(r: ResumeData) {
    const ok = await this.confirm.open({ icon: '🗑️', title: 'Delete Resume', message: `Delete "${r.name || 'this resume'}"? This cannot be undone.`, confirmLabel: 'Delete', danger: true });
    if (ok) { this.store.deleteResume(r.id); this.notify.success('Deleted'); this.subs.syncResumeCount(this.store.resumes().length); }
  }

  duplicateResume(r: ResumeData) { this.store.duplicateResume(r.id); this.notify.success('Duplicated', r.name + ' (Copy) created.'); }

  saveVersion(r: ResumeData) {
    this.store.saveVersion(r.id);
    this.notify.success('Version saved', 'You can restore it anytime from the resume card.');
  }

  restoreVersion(resumeId: string, versionId: string) {
    this.store.restoreVersion(resumeId, versionId);
    this.notify.success('Restored', 'Resume restored to selected version.');
    this.expandedVersions.set(null);
  }

  toggleVersions(id: string) { this.expandedVersions.set(this.expandedVersions() === id ? null : id); }

  // ── Job tracker ────────────────────────────────────────────────────────────
  loadJobs() { this.career.loadJobs(this.jobFilter() || undefined); }

  openAddJob() { this.jobForm = { jobTitle: '', company: '', location: '', status: 'applied', jobUrl: '', notes: '' }; this.showAddJob.set(true); }

  async submitJob() {
    if (!this.jobForm.jobTitle || !this.jobForm.company) { this.notify.warning('Job title and company required'); return; }
    this.savingJob.set(true);
    const result = await this.career.createJob(this.jobForm);
    this.savingJob.set(false);
    if (result) { this.showAddJob.set(false); this.notify.success('Application added'); this.career.loadStats(); }
    else this.notify.error('Failed to add application');
  }

  async updateJobStatus(id: string, event: Event) {
    const status = (event.target as HTMLSelectElement).value as JobStatus;
    await this.career.updateJob(id, { status });
    // Reload both stats and the current filtered list so moved jobs disappear from active filter
    await Promise.all([this.career.loadStats(), this.loadJobs()]);
    this.notify.success('Status updated');
  }

  async deleteJob(id: string) {
    const ok = await this.confirm.open({ icon: '🗑️', title: 'Remove Application', message: 'Remove this job application?', confirmLabel: 'Remove', danger: true });
    if (ok) { await this.career.deleteJob(id); this.career.loadStats(); this.notify.success('Removed'); }
  }

  // ── Biodata ────────────────────────────────────────────────────────────────
  editBiodata(b: BiodataData) {
    this.biodataStore.setActive(b.id);
    this.router.navigate(['/biodata-maker']);
  }

  async downloadBiodata(b: BiodataData) {
    await this.biodataPdf.download(b);
  }

  async confirmDeleteBiodata(b: BiodataData) {
    const ok = await this.confirm.open({ icon: '🗑️', title: 'Delete Biodata', message: `Delete "${b.name}"? This cannot be undone.`, confirmLabel: 'Delete', danger: true });
    if (ok) { this.biodataStore.deleteBiodata(b.id); this.notify.success('Deleted'); }
  }

  biodataTypeLabel(b: BiodataData): string { return b.type === 'marriage' ? '💍 Marriage' : '💼 Professional'; }

  // ── Subscription ────────────────────────────────────────────────────────────
  async cancelSub() {
    const ok = await this.confirm.open({ icon: '⚠️', title: 'Cancel Subscription', message: 'Access continues until end of billing period. Cancel anyway?', confirmLabel: 'Yes, Cancel', danger: true });
    if (!ok) return;
    this.cancelling.set(true);
    await this.subs.cancelSubscription();
    this.cancelling.set(false);
  }

  onUpgraded() { this.showUpgrade.set(false); this.career.loadStats(); }
  async subscribeTo(plan: 'monthly' | 'yearly') { await this.subs.subscribe(plan); }

  async logout() {
    const ok = await this.confirm.open({ icon: '👋', title: 'Sign Out', message: 'Sign out of your account?', confirmLabel: 'Sign Out' });
    if (ok) this.auth.logout();
  }

  loadHistory() {
    this.loadingHistory.set(true);
    this.api.get<PaginatedResponse<ConversionHistory>>('history?page=1&limit=50').subscribe({
      next: (res) => { this.history.set(res.data); this.loadingHistory.set(false); },
      error: () => this.loadingHistory.set(false),
    });
  }

  toolLabel(tool: string) {
    const map: Record<string, string> = { 'image-to-pdf': 'Image → PDF', 'pdf-to-word': 'PDF → Word', 'word-to-pdf': 'Word → PDF', 'pdf-merge': 'PDF Merge' };
    return map[tool] ?? tool;
  }

  statusClass(s: string) {
    const c: Record<string, string> = {
      completed: 'bg-emerald-100 text-emerald-700', failed: 'bg-red-100 text-red-700', processing: 'bg-blue-100 text-blue-700',
    };
    return c[s] ?? 'bg-slate-100 text-slate-600';
  }
}
