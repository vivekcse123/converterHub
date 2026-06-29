import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';
import { SubscriptionService } from '../../services/subscription.service';
import { ResumeStoreService } from '../../services/resume-store.service';
import { CareerService } from '../../services/career.service';
import { UpgradeModalComponent } from '../../components/upgrade-modal/upgrade-modal.component';
import { ResumePreviewComponent } from '../../components/preview/resume-preview.component';
import { RESUME_TEMPLATES, ResumeTemplateMeta } from '../../data/resume-templates.data';
import { ResumeData, TemplateId } from '../../models/resume.model';

@Component({
  selector: 'app-resume-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe, UpgradeModalComponent, ResumePreviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (showUpgrade()) {
      <app-upgrade-modal (close)="showUpgrade.set(false)" (upgraded)="showUpgrade.set(false)" />
    }

    <div class="min-h-screen bg-slate-50 dark:bg-slate-950">

      <!-- Top bar -->
      <div class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-sm">
        <div class="container-app py-3 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {{ initials() }}
            </div>
            <div class="hidden sm:block">
              <p class="font-semibold text-slate-800 dark:text-white text-sm leading-tight">{{ auth.user()?.name }}</p>
              <p class="text-xs font-medium" [class]="auth.isPro() ? 'text-emerald-500' : 'text-slate-400'">{{ planBadgeLabel() }}</p>
            </div>
          </div>
          <nav class="flex items-center gap-2">
            @if (!auth.isPro()) {
              <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-xs font-bold hover:opacity-90 transition shadow"
                      (click)="showUpgrade.set(true)">
                Upgrade to Pro — ₹99/mo
              </button>
            }
            <button type="button" (click)="createNewResume()"
               class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-primary-300 transition">
              + New Resume
            </button>
            <a routerLink="/" class="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition hidden sm:block">← Home</a>
          </nav>
        </div>
      </div>

      <div class="container-app py-8 space-y-8">

        <!-- Subscription expiry warning -->
        @if (auth.isPro() && auth.currentPlan() !== 'lifetime' && daysLeft() <= 7 && daysLeft() > 0) {
          <div class="rounded-xl border border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20 px-4 py-3.5 flex items-center gap-3">
            <div class="shrink-0" aria-hidden="true"><svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-amber-900 dark:text-amber-200">
                Your Pro plan expires in {{ daysLeft() }} {{ daysLeft() === 1 ? 'day' : 'days' }}
              </p>
              <p class="text-xs text-amber-800 dark:text-amber-300 mt-0.5">Renew now to keep your templates, cover letters, and portfolio active.</p>
            </div>
            <button class="shrink-0 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition"
                    (click)="showUpgrade.set(true)">
              Renew Now
            </button>
          </div>
        }

        <!-- Onboarding checklist — shown to new users who haven't dismissed it -->
        @if (showOnboarding()) {
          <div class="rounded-2xl border border-primary-200 dark:border-primary-800 bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 p-5">
            <div class="flex items-start justify-between gap-3 mb-4">
              <div>
                <p class="font-bold text-primary-900 dark:text-primary-200 text-base">Welcome to ApnaConverter! Let's get you started</p>
                <p class="text-xs text-primary-600 dark:text-primary-400 mt-0.5">Complete these 3 steps to build your first ATS-ready resume.</p>
              </div>
              <button class="text-primary-400 hover:text-primary-600 text-lg leading-none shrink-0" (click)="dismissOnboarding()">✕</button>
            </div>
            <div class="space-y-2.5">
              @for (step of onboardingSteps(); track step.label) {
                <div class="flex items-center gap-3 p-3 rounded-xl"
                     [class]="step.done ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-slate-800/50 border border-primary-100 dark:border-primary-800'">
                  <div class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                       [class]="step.done ? 'bg-emerald-500 text-white' : 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300'">
                    {{ step.done ? '✓' : step.num }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold" [class]="step.done ? 'text-emerald-700 dark:text-emerald-300 line-through' : 'text-slate-700 dark:text-slate-200'">{{ step.label }}</p>
                    <p class="text-[10px] text-slate-400 dark:text-slate-500">{{ step.hint }}</p>
                  </div>
                  @if (!step.done) {
                    <a [routerLink]="step.route" class="shrink-0 text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:underline">{{ step.action }}</a>
                  }
                </div>
              }
            </div>
          </div>
        }

        <!-- Welcome -->
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">Welcome back, {{ firstName() }}</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ welcomeSubtitle() }}</p>
          </div>
          @if (auth.isPro()) {
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Pro Active - {{ planName() }}
            </span>
          }
        </div>

        <!-- Quick stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="card p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center" aria-hidden="true">
                <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <span class="text-xs font-medium text-slate-400">Saved</span>
            </div>
            <p class="text-3xl font-extrabold text-slate-800 dark:text-white">{{ resumes().length }}</p>
            <p class="text-xs text-slate-500 mt-1">Resumes</p>
          </div>
          <div class="card p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center" aria-hidden="true">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              </div>
              <span class="text-xs font-medium text-slate-400">Tracked</span>
            </div>
            <p class="text-3xl font-extrabold text-slate-800 dark:text-white">{{ career.totalJobs() }}</p>
            <p class="text-xs text-slate-500 mt-1">Job Applications</p>
          </div>
          <div class="card p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                   [class]="auth.isPro() ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-slate-100 dark:bg-slate-800'" aria-hidden="true">
                <svg class="w-5 h-5" [class]="auth.isPro() ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <span class="text-xs font-medium" [class]="auth.isPro() ? 'text-emerald-500' : 'text-slate-400'">
                {{ auth.isPro() ? 'Active' : 'Free' }}
              </span>
            </div>
            <p class="text-base font-extrabold text-slate-800 dark:text-white capitalize leading-tight">{{ planName() }}</p>
            <p class="text-xs text-slate-500 mt-1">Current Plan</p>
          </div>
          <div class="card p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center" aria-hidden="true">
                <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <span class="text-xs font-medium text-slate-400">Remaining</span>
            </div>
            <p class="text-3xl font-extrabold" [class]="daysLeft() <= 7 && auth.isPro() && auth.currentPlan() !== 'lifetime' ? 'text-red-500' : 'text-slate-800 dark:text-white'">
              {{ auth.currentPlan() === 'lifetime' ? '∞' : (auth.isPro() ? daysLeft() : '∞') }}
            </p>
            <p class="text-xs text-slate-500 mt-1">{{ auth.currentPlan() === 'lifetime' ? 'Lifetime' : (auth.isPro() ? 'Days left' : 'Free forever') }}</p>
          </div>
        </div>

        <!-- Career tools grid -->
        <div>
          <h2 class="text-base font-bold text-slate-800 dark:text-white mb-4">Your Career Toolkit</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            @for (tool of careerTools; track tool.label) {
              <a [routerLink]="tool.proOnly && !auth.isPro() ? null : tool.route"
                 class="group card p-4 flex flex-col items-center gap-2 text-center hover:shadow-md transition cursor-pointer"
                 [class]="tool.proOnly && !auth.isPro() ? 'opacity-70' : ''"
                 (click)="onToolClick($event, tool)">
                <div class="w-11 h-11 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform" [class]="tool.bg" aria-hidden="true">{{ tool.icon }}</div>
                <p class="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">{{ tool.label }}</p>
                @if (tool.proOnly && !auth.isPro()) {
                  <span class="text-[9px] font-bold text-primary-600 dark:text-primary-400">🔒 Pro</span>
                }
              </a>
            }
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- My Resumes -->
          <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center justify-between gap-3 flex-wrap">
              <h2 class="text-base font-bold text-slate-800 dark:text-white">My Resumes <span class="text-slate-400 font-normal text-sm">({{ resumes().length }})</span></h2>
              <div class="flex items-center gap-2">
                <select [(ngModel)]="resumeSortValue" class="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-400 cursor-pointer" aria-label="Sort resumes">
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">A – Z</option>
                </select>
                <button type="button" (click)="createNewResume()" class="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
                  New Resume
                </button>
              </div>
            </div>

            <!-- Search bar (only shown when there are resumes) -->
            @if (resumes().length > 0) {
              <div class="relative">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input type="search" [(ngModel)]="resumeSearchValue" placeholder="Search resumes by name…"
                  class="w-full text-sm pl-9 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
                  aria-label="Search resumes">
                @if (resumeSearchValue) {
                  <button (click)="resumeSearchValue = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition" aria-label="Clear search">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                }
              </div>
            }

            @if (resumes().length === 0) {
              <div class="card p-10 text-center">
                <div class="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <svg class="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <p class="font-semibold text-slate-700 dark:text-slate-200 mb-1">No resumes yet</p>
                <p class="text-sm text-slate-400 mb-5">Build your first ATS-friendly resume in under 5 minutes.</p>
                <button type="button" (click)="createNewResume()" class="btn btn-primary text-sm px-6 py-2.5">Create My First Resume →</button>
              </div>
            }

            @if (resumes().length > 0 && filteredSortedResumes().length === 0) {
              <div class="card p-8 text-center">
                <p class="text-slate-500 dark:text-slate-400 text-sm">No resumes match "<strong>{{ resumeSearchValue }}</strong>"</p>
                <button (click)="resumeSearchValue = ''" class="text-xs text-primary-600 dark:text-primary-400 hover:underline mt-2">Clear search</button>
              </div>
            }

            <!-- Resume preview cards grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              @for (item of filteredSortedResumes(); track item.original.id) {
                <div class="card overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200 group/card">

                  <!-- Resume preview thumbnail -->
                  <a [routerLink]="['/resume-builder']" [queryParams]="{id: item.original.id}"
                     class="block relative overflow-hidden bg-slate-50 dark:bg-slate-900 cursor-pointer"
                     [attr.aria-label]="'Edit ' + (item.original.name || 'Untitled Resume')"
                     style="height:260px;">
                    <div class="absolute inset-0 overflow-hidden">
                      <app-resume-preview [resume]="item.resume" [showControls]="false" />
                    </div>
                    <!-- Bottom fade -->
                    <div class="absolute bottom-0 inset-x-0 h-16 pointer-events-none"
                         style="background:linear-gradient(to bottom,transparent,rgba(248,250,252,0.97))"></div>
                    <!-- Edit overlay on hover -->
                    <div class="absolute inset-0 bg-primary-600/0 group-hover/card:bg-primary-600/5 transition-colors duration-200 flex items-center justify-center pointer-events-none">
                      <span class="opacity-0 group-hover/card:opacity-100 transition-opacity bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        Open Editor
                      </span>
                    </div>
                  </a>

                  <!-- Card footer -->
                  <div class="px-3 pt-3 pb-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">

                    <!-- Name (inline rename) + action buttons -->
                    <div class="flex items-start justify-between gap-2">
                      <div class="min-w-0 flex-1">
                        @if (renamingId() === item.original.id) {
                          <input #renameInput type="text" [(ngModel)]="renameValue"
                            class="w-full text-sm font-semibold text-slate-800 dark:text-white bg-transparent border-b-2 border-primary-500 focus:outline-none leading-tight"
                            (keydown.enter)="commitRename(item.original.id)"
                            (keydown.escape)="cancelRename()"
                            (blur)="commitRename(item.original.id)"
                            aria-label="Rename resume">
                        } @else {
                          <p class="font-semibold text-slate-800 dark:text-white text-sm truncate leading-tight cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                             title="Double-click to rename"
                             (dblclick)="startRename(item.original.id, item.original.name)">
                            {{ item.original.name || 'Untitled Resume' }}
                          </p>
                        }
                        <p class="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <span class="capitalize">{{ getTemplateName(item.original.templateId) }}</span>
                          <span aria-hidden="true">·</span>
                          <span>{{ item.original.updatedAt | date:'dd MMM' }}</span>
                          @if (resumeViews()[item.original.id]?.published) {
                            <span class="inline-flex items-center gap-0.5 text-emerald-500">
                              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                              {{ resumeViews()[item.original.id]?.views || 0 }}
                            </span>
                          }
                        </p>
                      </div>
                      <div class="flex items-center gap-1 shrink-0">
                        <a [routerLink]="['/resume-builder']" [queryParams]="{id: item.original.id}"
                           class="p-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/50 transition"
                           title="Edit resume" [attr.aria-label]="'Edit ' + (item.original.name || 'Untitled Resume')">
                          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </a>
                        <button type="button"
                                class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                                title="Rename resume" [attr.aria-label]="'Rename ' + (item.original.name || 'Untitled Resume')"
                                (click)="startRename(item.original.id, item.original.name)">
                          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                        </button>
                        <button type="button"
                                class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                                title="Duplicate resume" [attr.aria-label]="'Duplicate ' + (item.original.name || 'Untitled Resume')"
                                (click)="duplicateResume(item.original.id)">
                          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                        </button>
                        <button type="button"
                                class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-100 dark:hover:bg-red-950/30 hover:text-red-600 transition"
                                title="Delete resume" [attr.aria-label]="'Delete ' + (item.original.name || 'Untitled Resume')"
                                (click)="deleteResume(item.original.id)">
                          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </div>

                    <!-- Quick template switcher — top 6 templates only -->
                    <div class="flex gap-1.5 overflow-x-auto" style="scrollbar-width:none;-ms-overflow-style:none;padding-bottom:2px;" role="group" aria-label="Switch template">
                      @for (t of topTemplates; track t.id) {
                        <button type="button"
                                class="shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-medium border transition-all whitespace-nowrap"
                                [class]="item.original.templateId === t.id
                                  ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'"
                                [attr.aria-pressed]="item.original.templateId === t.id"
                                (mouseenter)="hoverTemplate(item.original.id, t.id)"
                                (mouseleave)="clearHover(item.original.id)"
                                (click)="applyTemplate(item.original.id, t.id)">
                          <span [class]="'inline-block w-2 h-2 rounded-full shrink-0 bg-gradient-to-br ' + t.accent" aria-hidden="true"></span>
                          {{ t.name }}
                        </button>
                      }
                      <a [routerLink]="['/resume-templates']" class="shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium border border-dashed border-slate-300 dark:border-slate-600 text-slate-400 hover:border-primary-400 hover:text-primary-600 transition whitespace-nowrap">
                        +{{ allTemplates.length - topTemplates.length }} more
                      </a>
                    </div>
                  </div>
                </div>
              }
            </div>

            @if (!auth.isPro() && resumes().length >= 2) {
              <div class="card p-4 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/10 text-center">
                <p class="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">🔒 Free plan - 2 resume limit</p>
                <p class="text-xs text-amber-600 dark:text-amber-400 mb-3">Upgrade to Pro for unlimited resumes</p>
                <button class="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline" (click)="showUpgrade.set(true)">Upgrade to Pro →</button>
              </div>
            }
          </div>

          <!-- Right sidebar -->
          <div class="space-y-5">

            <!-- Subscription card -->
            <div class="card p-5">
              <h3 class="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                Your Plan
              </h3>

              @if (auth.isPro()) {
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-slate-500">Plan</span>
                    <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 capitalize">{{ planName() }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-slate-500">Status</span>
                    <span class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                    </span>
                  </div>
                  @if (auth.currentPlan() === 'lifetime') {
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-slate-500">Access</span>
                      <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">♾ Lifetime</span>
                    </div>
                  } @else {
                    @if (auth.user()?.subscription?.currentPeriodEnd) {
                      <div class="flex items-center justify-between">
                        <span class="text-xs text-slate-500">{{ auth.user()?.subscription?.cancelAtPeriodEnd ? 'Expires' : 'Renews' }}</span>
                        <span class="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {{ auth.user()?.subscription?.currentPeriodEnd | date:'dd MMM yyyy' }}
                        </span>
                      </div>
                    }
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-slate-500">Days left</span>
                      <span class="text-xs font-bold" [class]="daysLeft() <= 7 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'">
                        {{ daysLeft() }} days
                      </span>
                    </div>
                    @if (auth.user()?.subscription?.cancelAtPeriodEnd) {
                      <p class="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">⚠ Cancels at end of period</p>
                    }
                  }
                  @if (auth.currentPlan() === 'monthly') {
                    <div class="pt-1">
                      <a routerLink="/resume-builder/pricing" class="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium">
                        ⬆ Upgrade to Yearly - save ₹489
                      </a>
                    </div>
                  }
                  @if (auth.currentPlan() !== 'lifetime') {
                    <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button class="text-xs text-slate-400 hover:text-red-500 transition" [disabled]="cancelling()" (click)="cancel()">
                        {{ cancelling() ? 'Cancelling...' : 'Cancel Subscription' }}
                      </button>
                    </div>
                  }
                </div>
              } @else {
                <div class="text-center py-2">
                  <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center mx-auto mb-3" aria-hidden="true">
                    <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  </div>
                  <p class="text-sm font-bold text-slate-800 dark:text-white mb-1">Go Pro - ₹99/month</p>
                  <p class="text-xs text-slate-400 mb-1">All templates · No watermark · 6 tools</p>
                  <p class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mb-4">Up to 13× cheaper than international resume platforms</p>
                  <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-sm font-bold hover:opacity-90 transition shadow-md"
                          (click)="showUpgrade.set(true)">
                    Upgrade to Pro
                  </button>
                  <a routerLink="/resume-builder/pricing" class="block mt-2 text-xs text-slate-400 hover:text-primary-500 transition">
                    View all plans including Lifetime →
                  </a>
                </div>
              }
            </div>

            <!-- Payment history -->
            @if (payments().length > 0) {
              <div class="card p-5">
                <h3 class="text-sm font-bold text-slate-800 dark:text-white mb-4">🧾 Payment History</h3>
                <div class="space-y-2">
                  @for (p of payments(); track p._id) {
                    <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <div>
                        <p class="text-xs font-semibold text-slate-700 dark:text-slate-300 capitalize">Pro {{ p.plan }}</p>
                        <p class="text-[10px] text-slate-400">{{ p.createdAt | date:'dd MMM yyyy' }}</p>
                      </div>
                      <div class="text-right">
                        <p class="text-xs font-bold text-slate-800 dark:text-white">₹{{ p.amount / 100 }}</p>
                        <span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                              [class]="p.status === 'captured' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-100 text-red-700'">
                          {{ p.status === 'captured' ? 'Paid' : p.status }}
                        </span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Pro features teaser for free users -->
            @if (!auth.isPro()) {
              <div class="card p-5 bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/10 border-primary-200 dark:border-primary-800">
                <h3 class="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                Unlock with Pro
              </h3>
                <div class="space-y-1.5 mb-4">
                  @for (f of proTeaser; track f) {
                    <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <svg class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> {{ f }}
                    </div>
                  }
                </div>
                <button class="w-full py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-primary-600 to-indigo-600 text-white hover:opacity-90 transition"
                        (click)="showUpgrade.set(true)">
                  Unlock Pro Features
                </button>
              </div>
            }

          </div>
        </div>

        <!-- Upgrade banner for free users -->
        @if (!auth.isPro()) {
          <div class="rounded-2xl overflow-hidden bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0" aria-hidden="true"><svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div>
            <div class="flex-1 text-center sm:text-left">
              <h3 class="text-white font-extrabold text-lg mb-1">India's Complete Career Platform - ₹99/month</h3>
              <p class="text-indigo-200 text-sm">All 30 templates · No watermark · Cover letters · Portfolio · Job tracker · AI assistant · Cheaper than every competitor.</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-2 shrink-0">
              <button class="px-5 py-2.5 rounded-xl bg-white text-primary-700 text-sm font-bold hover:bg-primary-50 transition shadow-lg"
                      (click)="subscribeTo('yearly')">
                ₹699/year - Best Value
              </button>
              <button class="px-5 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white text-sm font-bold hover:bg-white/30 transition"
                      (click)="subscribeTo('monthly')">
                ₹99/month
              </button>
            </div>
          </div>
        }

      </div>
    </div>

    <!-- Mobile sticky CTA -->
    @if (!auth.isPro()) {
      <div class="fixed bottom-0 left-0 right-0 sm:hidden z-30 p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-2xl">
        <button class="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-sm font-bold shadow-md"
                (click)="showUpgrade.set(true)">
          Upgrade to Pro — ₹99/month
        </button>
      </div>
    }
  `,
})
export class ResumeDashboardComponent implements OnInit {
  readonly auth    = inject(AuthService);
  readonly subs    = inject(SubscriptionService);
  readonly career  = inject(CareerService);
  private readonly store  = inject(ResumeStoreService);
  private readonly http   = inject(HttpClient);
  private readonly router = inject(Router);

  readonly showUpgrade  = signal(false);
  readonly cancelling   = signal(false);
  readonly payments     = signal<any[]>([]);
  readonly resumes      = this.store.resumes;

  readonly resumeSearch = signal('');
  readonly resumeSort   = signal<'recent' | 'oldest' | 'name'>('recent');
  readonly renamingId   = signal<string | null>(null);
  renameValue           = '';

  get resumeSearchValue() { return this.resumeSearch(); }
  set resumeSearchValue(v: string) { this.resumeSearch.set(v); }
  get resumeSortValue() { return this.resumeSort(); }
  set resumeSortValue(v: 'recent' | 'oldest' | 'name') { this.resumeSort.set(v); }

  /** Top 6 most-downloaded templates shown in quick-switch chips */
  readonly topTemplates: ResumeTemplateMeta[] = [...RESUME_TEMPLATES]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 6);

  /** Filtered + sorted resume cards */
  readonly filteredSortedResumes = computed(() => {
    const q   = this.resumeSearch().toLowerCase().trim();
    const srt = this.resumeSort();
    const map = this.previewTemplateMap();
    let items = this.resumes().map(r => ({
      resume: map[r.id] ? { ...r, templateId: map[r.id] as TemplateId } : r,
      original: r,
    }));
    if (q) items = items.filter(i => (i.original.name ?? '').toLowerCase().includes(q));
    if (srt === 'recent')  items = [...items].sort((a, b) => (b.original.updatedAt ?? 0) - (a.original.updatedAt ?? 0));
    if (srt === 'oldest')  items = [...items].sort((a, b) => (a.original.updatedAt ?? 0) - (b.original.updatedAt ?? 0));
    if (srt === 'name')    items = [...items].sort((a, b) => (a.original.name ?? '').localeCompare(b.original.name ?? ''));
    return items;
  });

  /** resumeId → { views, slug, published } */
  readonly resumeViews  = signal<Record<string, { views: number; slug: string; published: boolean }>>({});

  /** Onboarding: show if not dismissed AND user has no resumes yet */
  private readonly _onboardingDismissed = signal(
    typeof localStorage !== 'undefined' && localStorage.getItem('hub_onboarded') === '1'
  );
  readonly showOnboarding = computed(
    () => !this._onboardingDismissed() && this.resumes().length === 0
  );

  readonly onboardingSteps = computed(() => {
    const hasResume  = this.resumes().length > 0;
    const hasProfile = !!(this.auth.user()?.name);
    const hasPro     = this.auth.isPro();
    return [
      { num: '1', label: 'Create your first resume',          hint: 'Pick a template and fill in your details', route: '/resume-builder',               action: 'Start →', done: hasResume  },
      { num: '2', label: 'Download your PDF',                 hint: 'Get your ATS-optimised resume as a PDF',   route: '/resume-builder',               action: 'Build →', done: hasResume  },
      { num: '3', label: 'Unlock Pro career tools',           hint: 'Cover letter, portfolio, job tracker + AI', route: '/resume-builder/pricing',       action: 'Upgrade →', done: hasPro },
    ];
  });

  dismissOnboarding() {
    if (typeof localStorage !== 'undefined') localStorage.setItem('hub_onboarded', '1');
    this._onboardingDismissed.set(true);
  }

  /** Per-card hover state: resumeId → templateId being previewed */
  readonly previewTemplateMap = signal<Record<string, TemplateId>>({});

  readonly allTemplates: ResumeTemplateMeta[] = RESUME_TEMPLATES;

  /** Resumes merged with hover-preview template for live card updates */
  readonly previewResumes = computed(() => {
    const map = this.previewTemplateMap();
    return this.resumes().map(r => ({
      resume: map[r.id] ? { ...r, templateId: map[r.id] as TemplateId } : r,
      original: r,
    }));
  });

  readonly careerTools = [
    { icon: '📄', label: 'Resume Builder',    route: '/resume-builder',              bg: 'bg-primary-100 dark:bg-primary-900/30',  proOnly: false },
    { icon: '✉️', label: 'Cover Letter',       route: '/resume-builder/cover-letter', bg: 'bg-emerald-100 dark:bg-emerald-900/30', proOnly: true  },
    { icon: '🌐', label: 'Portfolio',          route: '/resume-builder/portfolio',    bg: 'bg-indigo-100 dark:bg-indigo-900/30',  proOnly: true  },
    { icon: '📋', label: 'Job Tracker',        route: '/resume-builder/job-tracker',  bg: 'bg-amber-100 dark:bg-amber-900/30',    proOnly: true  },
    { icon: '💍', label: 'Biodata Maker',      route: '/biodata-maker',               bg: 'bg-rose-100 dark:bg-rose-900/30',      proOnly: false },
    { icon: '⚡', label: 'File Converters',    route: '/tools',                       bg: 'bg-slate-100 dark:bg-slate-800',       proOnly: false },
  ];

  readonly proTeaser = [
    '14 Premium Resume Templates',
    'No watermark on downloaded PDFs',
    'Cover Letter Builder',
    'Portfolio with public URL',
    'Job Application Tracker',
    'AI writing assistant',
  ];

  initials()  { return (this.auth.user()?.name ?? 'U').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(); }
  firstName() { return (this.auth.user()?.name ?? 'there').split(' ')[0]; }

  welcomeSubtitle() {
    return this.auth.isPro()
      ? `${this.planBadgeLabel()} - all features unlocked. Keep building your career.`
      : 'Free plan active. Upgrade to unlock all 6 career tools.';
  }

  planName() {
    const p = this.auth.currentPlan();
    if (p === 'monthly')  return 'Pro Monthly';
    if (p === 'yearly')   return 'Pro Yearly';
    if (p === 'lifetime') return 'Pro Lifetime';
    return 'Free';
  }

  planBadgeLabel() {
    return this.auth.isPro() ? this.planName() + ' ✓' : 'Free Plan';
  }

  daysLeft(): number {
    const end = this.auth.user()?.subscription?.currentPeriodEnd;
    if (!end) return 0;
    return Math.max(0, Math.ceil((new Date(end).getTime() - Date.now()) / 86_400_000));
  }

  async ngOnInit() {
    if (this.auth.isLoggedIn()) {
      const [history] = await Promise.all([
        this.subs.getPaymentHistory(),
        this.subs.getStatus(),
        this.career.loadStats(),
        this.loadViewCounts(),
      ]);
      this.payments.set(history);
      this.subs.syncResumeCount(this.store.resumes().length);
      // Dismiss onboarding once the user has created at least one resume
      if (this.resumes().length > 0) this.dismissOnboarding();
    }
  }

  private async loadViewCounts() {
    try {
      const res: any = await firstValueFrom(
        this.http.get(`${environment.apiUrl}/share/views`)
      );
      if (res?.data) this.resumeViews.set(res.data);
    } catch { /* non-critical — silently ignore */ }
  }

  deleteResume(id: string) {
    this.store.deleteResume(id);
    this.subs.syncResumeCount(this.store.resumes().length);
  }

  duplicateResume(id: string): void {
    this.store.duplicateResume(id);
  }

  hoverTemplate(resumeId: string, templateId: TemplateId): void {
    this.previewTemplateMap.update(map => ({ ...map, [resumeId]: templateId }));
  }

  clearHover(resumeId: string): void {
    this.previewTemplateMap.update(map => {
      const next = { ...map };
      delete next[resumeId];
      return next;
    });
  }

  applyTemplate(resumeId: string, templateId: TemplateId): void {
    this.store.setTemplate(templateId, resumeId);
    this.clearHover(resumeId);
  }

  async cancel() {
    this.cancelling.set(true);
    await this.subs.cancelSubscription();
    this.cancelling.set(false);
  }

  onToolClick(event: Event, tool: { proOnly: boolean; route: string }) {
    if (tool.proOnly && !this.auth.isPro()) {
      event.preventDefault();
      this.showUpgrade.set(true);
    }
  }

  async subscribeTo(plan: 'monthly' | 'yearly') {
    this.showUpgrade.set(false);
    await this.subs.subscribe(plan);
  }

  getTemplateName(id: string): string {
    return RESUME_TEMPLATES.find(t => t.id === id)?.name ?? id;
  }

  startRename(id: string, currentName: string): void {
    this.renameValue = currentName || '';
    this.renamingId.set(id);
  }

  commitRename(id: string): void {
    const name = this.renameValue.trim();
    if (name) this.store.renameResume(id, name);
    this.renamingId.set(null);
  }

  cancelRename(): void {
    this.renamingId.set(null);
  }

  /** Navigate to the builder, or show upgrade if free-tier resume limit is reached. */
  createNewResume(): void {
    const FREE_LIMIT = 2;
    if (!this.auth.isPro() && this.store.resumes().length >= FREE_LIMIT) {
      this.showUpgrade.set(true);
      return;
    }
    this.router.navigate(['/resume-builder']);
  }
}
