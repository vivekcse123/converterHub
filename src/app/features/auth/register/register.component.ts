import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { GoogleAuthService } from '../../../core/services/google-auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthLayoutComponent } from '../shared/auth-layout/auth-layout.component';
import { PasswordFieldComponent } from '../shared/password-field/password-field.component';
import { PasswordStrengthComponent } from '../shared/password-strength/password-strength.component';
import { SocialButtonsComponent } from '../shared/social-buttons/social-buttons.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, AuthLayoutComponent, PasswordFieldComponent, PasswordStrengthComponent, SocialButtonsComponent, IconComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  firstName = '';
  lastName  = '';
  email     = '';
  password  = '';
  confirmPassword = '';
  agreedToTerms = false;

  readonly loading = signal(false);
  readonly googleLoading = signal(false);

  readonly passwordsMismatch = computed(() =>
    this.confirmPassword.length > 0 && this.password !== this.confirmPassword);

  constructor(
    private auth:   AuthService,
    private googleAuth: GoogleAuthService,
    private notify: NotificationService,
    private router: Router,
    private route:  ActivatedRoute,
  ) {}

  onSubmit(): void {
    if (this.loading()) return;
    if (this.password !== this.confirmPassword) return;
    if (!this.agreedToTerms) {
      this.notify.warning('Accept our terms', 'Please agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    const name = `${this.firstName} ${this.lastName}`.trim();
    this.loading.set(true);

    this.auth.register(name, this.email, this.password).subscribe({
      next: () => {
        this.notify.success('Account created!', 'Welcome to ApnaConverter.');
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        this.router.navigateByUrl(returnUrl || '/dashboard');
      },
      error: (e) => {
        this.notify.error('Registration failed', e.error?.message ?? 'Please try again.');
        this.loading.set(false);
      },
    });
  }

  async onSocial(provider: 'Google'): Promise<void> {
    if (this.googleLoading()) return;
    if (!this.agreedToTerms) {
      this.notify.warning('Accept our terms', 'Please agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }
    this.googleLoading.set(true);
    try {
      const accessToken = await this.googleAuth.signIn();
      this.auth.loginWithGoogle(accessToken).subscribe({
        next: () => {
          this.notify.success('Welcome to ApnaConverter!');
          const returnUrl = this.route.snapshot.queryParams['returnUrl'];
          this.router.navigateByUrl(returnUrl || '/dashboard');
          this.googleLoading.set(false);
        },
        error: (e) => {
          this.notify.error('Google sign-up failed', e.error?.message ?? 'Please try again.');
          this.googleLoading.set(false);
        },
      });
    } catch (e: any) {
      this.googleLoading.set(false);
      if (e?.message && !/cancelled|closed/i.test(e.message)) {
        this.notify.error('Google sign-up failed', e.message);
      }
    }
  }
}
