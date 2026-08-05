import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthLayoutComponent } from '../shared/auth-layout/auth-layout.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink, AuthLayoutComponent, IconComponent],
  templateUrl: './forgot-password.component.html',
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
    if (this.loading()) return;
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
