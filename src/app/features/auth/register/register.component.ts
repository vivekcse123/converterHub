import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 px-4 py-12">
      <div class="w-full max-w-md">
        <div class="card p-8 animate-slide-up">

          <div class="text-center mb-8">
            <div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl shadow-md">⚡</div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Create an account</h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Free forever. No credit card needed.</p>
          </div>

          <form (ngSubmit)="onSubmit()" #regForm="ngForm" class="space-y-4">

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full name</label>
              <input type="text" [(ngModel)]="name" name="name" required minlength="2"
                placeholder="Jane Smith" class="input" autocomplete="name">
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
              <input type="email" [(ngModel)]="email" name="email" required
                placeholder="you@example.com" class="input" autocomplete="email">
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <input type="password" [(ngModel)]="password" name="password" required minlength="8"
                placeholder="At least 8 characters" class="input" autocomplete="new-password">
            </div>

            <button type="submit" [disabled]="loading() || regForm.invalid"
              class="btn btn-primary w-full py-3 text-base font-semibold mt-2">
              @if (loading()) {
              <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              }
              {{ loading() ? 'Creating account…' : 'Create account' }}
            </button>

          </form>

          <p class="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?
            <a routerLink="/login" class="text-primary-600 font-medium hover:underline ml-1">Sign in</a>
          </p>

        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  name     = '';
  email    = '';
  password = '';
  readonly loading = signal(false);

  constructor(
    private auth:   AuthService,
    private notify: NotificationService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.loading.set(true);
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.notify.success('Account created!', 'Welcome to ApnaConverter.');
        this.router.navigate(['/dashboard']);
      },
      error: (e) => {
        this.notify.error('Registration failed', e.error?.message ?? 'Please try again.');
        this.loading.set(false);
      },
    });
  }
}
