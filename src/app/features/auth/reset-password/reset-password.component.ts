import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthLayoutComponent } from '../shared/auth-layout/auth-layout.component';
import { PasswordFieldComponent } from '../shared/password-field/password-field.component';
import { PasswordStrengthComponent } from '../shared/password-strength/password-strength.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterLink, AuthLayoutComponent, PasswordFieldComponent, PasswordStrengthComponent, IconComponent],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  password = '';
  confirm  = '';
  private token = '';

  readonly loading      = signal(false);
  readonly done         = signal(false);
  readonly invalidToken = signal(false);

  readonly passwordsMismatch = computed(() =>
    this.confirm.length > 0 && this.password !== this.confirm);

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
    if (this.loading()) return;
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
