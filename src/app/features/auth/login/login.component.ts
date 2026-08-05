import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { GoogleAuthService } from '../../../core/services/google-auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthLayoutComponent } from '../shared/auth-layout/auth-layout.component';
import { PasswordFieldComponent } from '../shared/password-field/password-field.component';
import { SocialButtonsComponent } from '../shared/social-buttons/social-buttons.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, AuthLayoutComponent, PasswordFieldComponent, SocialButtonsComponent, IconComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email    = '';
  password = '';
  rememberMe = false;
  readonly loading = signal(false);
  readonly googleLoading = signal(false);

  constructor(
    private auth:     AuthService,
    private googleAuth: GoogleAuthService,
    private notify:   NotificationService,
    private router:   Router,
    private route:    ActivatedRoute,
  ) {}

  onSubmit(): void {
    if (this.loading()) return;
    if (!this.email || !this.password) {
      this.notify.warning('Missing fields', 'Please fill in all fields.');
      return;
    }
    this.loading.set(true);

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.notify.success('Welcome back!');
        this.redirectAfterAuth();
      },
      error: (e) => {
        this.notify.error('Login failed', e.error?.message ?? 'Invalid credentials');
        this.loading.set(false);
      },
    });
  }

  async onSocial(provider: 'Google'): Promise<void> {
    if (this.googleLoading()) return;
    this.googleLoading.set(true);
    try {
      const accessToken = await this.googleAuth.signIn();
      this.auth.loginWithGoogle(accessToken).subscribe({
        next: () => {
          this.notify.success('Welcome back!');
          this.redirectAfterAuth();
          this.googleLoading.set(false);
        },
        error: (e) => {
          this.notify.error('Google sign-in failed', e.error?.message ?? 'Please try again.');
          this.googleLoading.set(false);
        },
      });
    } catch (e: any) {
      this.googleLoading.set(false);
      if (e?.message && !/cancelled|closed/i.test(e.message)) {
        this.notify.error('Google sign-in failed', e.message);
      }
    }
  }

  private redirectAfterAuth(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else if (this.auth.isAdmin()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
