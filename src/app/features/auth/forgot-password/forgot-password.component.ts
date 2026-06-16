import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 px-4 py-12">
      <div class="w-full max-w-md">
        <div class="card p-8 animate-slide-up">

          <div class="text-center mb-8">
            <div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl shadow-md">🔑</div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Forgot your password?</h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          @if (sent()) {
            <div class="text-center space-y-4 py-2">
              <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto text-3xl">📬</div>
              <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Check your inbox</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                If <strong class="text-slate-700 dark:text-slate-300">{{ email }}</strong> is registered,
                we've sent a password reset link. It expires in 1 hour.
              </p>
              <p class="text-xs text-slate-400 dark:text-slate-500">
                Don't see it? Check your spam folder.
              </p>
              <a routerLink="/login" class="btn btn-secondary w-full mt-2">Back to Login</a>
            </div>
          } @else {
            <form (ngSubmit)="onSubmit()" #form="ngForm" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Email address
                </label>
                <input type="email" [(ngModel)]="email" name="email" required
                  placeholder="you@example.com" class="input" autocomplete="email">
              </div>

              <button type="submit" [disabled]="loading() || form.invalid"
                class="btn btn-primary w-full py-3 text-base font-semibold">
                @if (loading()) {
                  <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                }
                {{ loading() ? 'Sending…' : 'Send Reset Link' }}
              </button>
            </form>

            <p class="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Remembered it?
              <a routerLink="/login" class="text-primary-600 font-medium hover:underline ml-1">Back to login</a>
            </p>
          }

        </div>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  email   = '';
  readonly loading = signal(false);
  readonly sent    = signal(false);

  constructor(
    private auth:   AuthService,
    private notify: NotificationService,
  ) {}

  onSubmit(): void {
    this.loading.set(true);
    this.auth.forgotPassword(this.email).subscribe({
      next: () => {
        this.sent.set(true);
        this.loading.set(false);
      },
      error: (e) => {
        this.notify.error('Something went wrong', e.error?.message ?? 'Please try again.');
        this.loading.set(false);
      },
    });
  }
}
