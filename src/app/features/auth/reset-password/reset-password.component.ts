import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 px-4 py-12">
      <div class="w-full max-w-md">
        <div class="card p-8 animate-slide-up">

          <div class="text-center mb-8">
            <div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-md" aria-hidden="true">
              <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Set a new password</h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Must be at least 8 characters.
            </p>
          </div>

          @if (invalidToken()) {
            <div class="text-center space-y-4 py-2">
              <div class="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center mx-auto" aria-hidden="true">
                <svg class="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
              </div>
              <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Link expired or invalid</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                This password reset link has expired or already been used. Reset links are valid for 1 hour.
              </p>
              <a routerLink="/forgot-password" class="btn btn-primary w-full">Request a new link</a>
              <a routerLink="/login" class="btn btn-secondary w-full">Back to Login</a>
            </div>
          } @else if (done()) {
            <div class="text-center space-y-4 py-2">
              <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto" aria-hidden="true">
                <svg class="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Password updated!</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Your password has been changed. You can now sign in with your new password.
              </p>
              <a routerLink="/login" class="btn btn-primary w-full">Go to Login</a>
            </div>
          } @else {
            <form (ngSubmit)="onSubmit()" #form="ngForm" class="space-y-4">
              <div>
                <label for="rp-password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  New password
                </label>
                <input id="rp-password" type="password" [(ngModel)]="password" name="password"
                  required minlength="8"
                  placeholder="At least 8 characters" class="input" autocomplete="new-password">
              </div>

              <div>
                <label for="rp-confirm" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm new password
                </label>
                <input id="rp-confirm" type="password" [(ngModel)]="confirm" name="confirm"
                  required
                  placeholder="Repeat your new password" class="input" autocomplete="new-password"
                  [attr.aria-describedby]="confirm && password !== confirm ? 'rp-mismatch' : null">
                @if (confirm && password !== confirm) {
                  <p id="rp-mismatch" class="text-xs text-red-500 mt-1" role="alert">Passwords don't match.</p>
                }
              </div>

              <button type="submit"
                [disabled]="loading() || form.invalid || password !== confirm"
                [attr.aria-busy]="loading()"
                class="btn btn-primary w-full py-3 text-base font-semibold">
                @if (loading()) {
                  <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  <span class="sr-only">Resetting password, please wait</span>
                }
                <span [class.sr-only]="loading()">Reset Password</span>
              </button>
            </form>
          }

        </div>
      </div>
    </div>
  `,
})
export class ResetPasswordComponent implements OnInit {
  password = '';
  confirm  = '';
  private token = '';

  readonly loading      = signal(false);
  readonly done         = signal(false);
  readonly invalidToken = signal(false);

  constructor(
    private auth:   AuthService,
    private notify: NotificationService,
    private route:  ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    if (!this.token) this.invalidToken.set(true);
  }

  onSubmit(): void {
    if (this.password !== this.confirm) return;
    this.loading.set(true);
    this.auth.resetPassword(this.token, this.password).subscribe({
      next: () => {
        this.done.set(true);
        this.loading.set(false);
      },
      error: (e) => {
        const msg: string = e.error?.message ?? '';
        if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('expired')) {
          this.invalidToken.set(true);
        } else {
          this.notify.error('Reset failed', msg || 'Please try again.');
        }
        this.loading.set(false);
      },
    });
  }
}
