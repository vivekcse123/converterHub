import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
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
  imports: [CommonModule, RouterLink, DatePipe, UpgradeModalComponent, ResumePreviewComponent],
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
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {{ initials() }}
            </div>
            <div class="hidden sm:block">
              <p class="font-semibold text-slate-800 dark:text-white text-sm leading-tight">{{ auth.user()?.name }}</p>
              <p class="text-xs font-medium" [class]="auth.isPro() ? 'text-emerald-500' : 'text-slate-400'">{{ planBadgeLabel() }}</p>
            </div>
          </div>
          <nav class="flex items-center gap-2">
            @if (!auth.isPro()) {
              <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold hover:opacity-90 transition shadow"
                      (click)="showUpgrade.set(true)">
                ⭐ Upgrade to Pro - ₹99/mo
              </button>
            }
            <a routerLink="/resume-builder"
               class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-violet-300 transition">
              + New Resume
            </a>
            <a routerLink="/" class="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition hidden sm:block">← Home</a>
          </nav>
        </div>
      </div>

      <div class="container-app py-8 space-y-8">

        <!-- Subscription expiry warning -->
        @if (auth.isPro() && auth.currentPlan() !== 'lifetime' && daysLeft() <= 7 && daysLeft() > 0) {
          <div class="rounded-xl border border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20 px-4 py-3.5 flex items-center gap-3">
            <span class="text-xl shrink-0">⚠️</span>
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
          <div class="rounded-2xl border border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 p-5">
            <div class="flex items-start justify-between gap-3 mb-4">
              <div>
                <p class="font-bold text-violet-900 dark:text-violet-200 text-base">Welcome to ApnaConverter! Let's get you started 🎉</p>
                <p class="text-xs text-violet-600 dark:text-violet-400 mt-0.5">Complete these 3 steps to build your first ATS-ready resume.</p>
              </div>
              <button class="text-violet-400 hover:text-violet-600 text-lg leading-none shrink-0" (click)="dismissOnboarding()">✕</button>
            </div>
            <div class="space-y-2.5">
              @for (step of onboardingSteps(); track step.label) {
                <div class="flex items-center gap-3 p-3 rounded-xl"
                     [class]="step.done ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-slate-800/50 border border-violet-100 dark:border-violet-800'">
                  <div class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                       [class]="step.done ? 'bg-emerald-500 text-white' : 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300'">
                    {{ step.done ? '✓' : step.num }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold" [class]="step.done ? 'text-emerald-700 dark:text-emerald-300 line-through' : 'text-slate-700 dark:text-slate-200'">{{ step.label }}</p>
                    <p class="text-[10px] text-slate-400 dark:text-slate-500">{{ step.hint }}</p>
                  </div>
                  @if (!step.done) {
                    <a [routerLink]="step.route" class="shrink-0 text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:underline">{{ step.action }}</a>
                  }
                </div>
              }
            </div>
          </div>
        }

        <!-- Welcome -->
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">Welcome back, {{ firstName() }} 👋</h1>
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
              <div class="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-lg">📄</div>
              <span class="text-xs font-medium text-slate-400">Saved</span>
            </div>
            <p class="text-3xl font-extrabold text-slate-800 dark:text-white">{{ resumes().length }}</p>
            <p class="text-xs text-slate-500 mt-1">Resumes</p>
          </div>
          <div class="card p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-lg">📋</div>
              <span class="text-xs font-medium text-slate-400">Tracked</span>
            </div>
            <p class="text-3xl font-extrabold text-slate-800 dark:text-white">{{ career.totalJobs() }}</p>
            <p class="text-xs text-slate-500 mt-1">Job Applications</p>
          </div>
          <div class="card p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                   [class]="auth.isPro() ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-slate-100 dark:bg-slate-800'">
                {{ auth.isPro() ? '⭐' : '🆓' }}
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
              <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-lg">⏰</div>
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
                <div class="w-11 h-11 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform" [class]="tool.bg">{{ tool.icon }}</div>
                <p class="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">{{ tool.label }}</p>
                @if (tool.proOnly && !auth.isPro()) {
                  <span class="text-[9px] font-bold text-violet-600 dark:text-violet-400">🔒 Pro</span>
                }
              </a>
            }
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- My Resumes -->
          <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-base font-bold text-slate-800 dark:text-white">My Resumes</h2>
              <a routerLink="/resume-builder" class="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium">+ Create new</a>
            </div>

            @if (resumes().length === 0) {
              <div class="card p-10 text-center">
                <p class="text-5xl mb-4">📄</p>
                <p class="font-semibold text-slate-700 dark:text-slate-200 mb-1">No resumes yet</p>
                <p class="text-sm text-slate-400 mb-5">Build your first ATS-friendly resume in minutes.</p>
                <a routerLink="/resume-builder" class="btn btn-primary text-sm px-6 py-2.5">Create Resume</a>
              </div>
            }

            <!-- Resume preview cards grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              @for (item of previewResumes(); track item.original.id) {
                <div class="card overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200">

                  <!-- Resume preview thumbnail (click to open editor) -->
                  <a [routerLink]="['/resume-builder']" [queryParams]="{id: item.original.id}"
                     class="block relative overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer"
                     style="height:260px;">
                    <div class="absolute inset-0 overflow-hidden">
                      <app-resume-preview [resume]="item.resume" [showControls]="false" />
                    </div>
                    <!-- Bottom fade overlay -->
                    <div class="absolute bottom-0 inset-x-0 h-16 pointer-events-none"
                         style="background:linear-gradient(to bottom,transparent,rgba(255,255,255,0.95))"></div>
                  </a>

                  <!-- Card footer: name, actions, template chips -->
                  <div class="px-3 pt-2.5 pb-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">

                    <!-- Name + action buttons -->
                    <div class="flex items-start justify-between gap-2">
                      <div class="min-w-0">
                        <p class="font-semibold text-slate-800 dark:text-white text-sm truncate leading-tight">
                          {{ item.original.name || 'Untitled Resume' }}
                        </p>
                        <p class="text-[10px] text-slate-400 mt-0.5 capitalize flex items-center gap-1.5">
                          <span>{{ item.original.templateId }} · {{ item.original.updatedAt | date:'dd MMM' }}</span>
                          @if (resumeViews()[item.original.id]?.published) {
                            <span class="inline-flex items-center gap-0.5 text-emerald-500">
                              · 👁 {{ resumeViews()[item.original.id]?.views || 0 }} views
                            </span>
                          }
                        </p>
                      </div>
                      <div class="flex items-center gap-1 shrink-0">
                        <a [routerLink]="['/resume-builder']" [queryParams]="{id: item.original.id}"
                           class="text-[11px] px-2 py-1 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-semibold hover:bg-violet-200 transition">
                          Edit
                        </a>
                        <button type="button" title="Duplicate"
                                class="text-[11px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                                (click)="duplicateResume(item.original.id)">⧉</button>
                        <button type="button" title="Delete"
                                class="text-[11px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-100 hover:text-red-600 transition"
                                (click)="deleteResume(item.original.id)">✕</button>
                      </div>
                    </div>

                    <!-- Template chips - hover to preview, click to apply -->
                    <div class="flex gap-1.5 overflow-x-auto" style="scrollbar-width:none;-ms-overflow-style:none;padding-bottom:2px;">
                      @for (t of allTemplates; track t.id) {
                        <button type="button"
                                class="shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-medium border transition-all whitespace-nowrap"
                                [class]="item.original.templateId === t.id
                                  ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'"
                                (mouseenter)="hoverTemplate(item.original.id, t.id)"
                                (mouseleave)="clearHover(item.original.id)"
                                (click)="applyTemplate(item.original.id, t.id)">
                          <span [class]="'inline-block w-2 h-2 rounded-full shrink-0 bg-gradient-to-br ' + t.accent"></span>
                          {{ t.name }}
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>

            @if (!auth.isPro() && resumes().length >= 2) {
              <div class="card p-4 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/10 text-center">
                <p class="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">🔒 Free plan - 2 resume limit</p>
                <p class="text-xs text-amber-600 dark:text-amber-400 mb-3">Upgrade to Pro for unlimited resumes</p>
                <button class="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline" (click)="showUpgrade.set(true)">Upgrade to Pro →</button>
              </div>
            }
          </div>

          <!-- Right sidebar -->
          <div class="space-y-5">

            <!-- Subscription card -->
            <div class="card p-5">
              <h3 class="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">💳 Your Plan</h3>

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
                      <a routerLink="/resume-builder/pricing" class="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium">
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
                  <p class="text-4xl mb-3">🚀</p>
                  <p class="text-sm font-bold text-slate-800 dark:text-white mb-1">Go Pro - ₹99/month</p>
                  <p class="text-xs text-slate-400 mb-1">All templates · No watermark · 6 tools</p>
                  <p class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mb-4">Up to 13× cheaper than international resume platforms</p>
                  <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold hover:opacity-90 transition shadow-md"
                          (click)="showUpgrade.set(true)">
                    ⭐ Upgrade to Pro
                  </button>
                  <a routerLink="/resume-builder/pricing" class="block mt-2 text-xs text-slate-400 hover:text-violet-500 transition">
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
              <div class="card p-5 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/10 border-violet-200 dark:border-violet-800">
                <h3 class="text-sm font-bold text-slate-800 dark:text-white mb-3">🔒 Unlock with Pro</h3>
                <div class="space-y-1.5 mb-4">
                  @for (f of proTeaser; track f) {
                    <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span class="text-slate-300">🔒</span> {{ f }}
                    </div>
                  }
                </div>
                <button class="w-full py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 transition"
                        (click)="showUpgrade.set(true)">
                  Unlock Pro Features
                </button>
              </div>
            }

          </div>
        </div>

        <!-- Upgrade banner for free users -->
        @if (!auth.isPro()) {
          <div class="rounded-2xl overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div class="text-4xl shrink-0">🚀</div>
            <div class="flex-1 text-center sm:text-left">
              <h3 class="text-white font-extrabold text-lg mb-1">India's Complete Career Platform - ₹99/month</h3>
              <p class="text-indigo-200 text-sm">All 30 templates · No watermark · Cover letters · Portfolio · Job tracker · AI assistant · Cheaper than every competitor.</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-2 shrink-0">
              <button class="px-5 py-2.5 rounded-xl bg-white text-violet-700 text-sm font-bold hover:bg-violet-50 transition shadow-lg"
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
        <button class="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold shadow-md"
                (click)="showUpgrade.set(true)">
          ⭐ Upgrade to Pro - ₹99/month
        </button>
      </div>
    }
  `,
})
export class ResumeDashboardComponent implements OnInit {
  readonly auth    = inject(AuthService);
  readonly subs    = inject(SubscriptionService);
  readonly career  = inject(CareerService);
  private readonly store = inject(ResumeStoreService);
  private readonly http  = inject(HttpClient);

  readonly showUpgrade  = signal(false);
  readonly cancelling   = signal(false);
  readonly payments     = signal<any[]>([]);
  readonly resumes      = this.store.resumes;

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
    { icon: '📄', label: 'Resume Builder',    route: '/resume-builder',              bg: 'bg-violet-100 dark:bg-violet-900/30',  proOnly: false },
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
}
