import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email    = '';
  password = '';
  readonly loading = signal(false);

  constructor(
    private auth:     AuthService,
    private notify:   NotificationService,
    private router:   Router,
    private route:    ActivatedRoute,
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.notify.warning('Missing fields', 'Please fill in all fields.');
      return;
    }
    this.loading.set(true);

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.notify.success('Welcome back!');
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (e) => {
        this.notify.error('Login failed', e.error?.message ?? 'Invalid credentials');
        this.loading.set(false);
      },
    });
  }
}
