import { Component, OnDestroy, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthLayoutComponent } from '../shared/auth-layout/auth-layout.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

const RESEND_COOLDOWN = 60;

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterLink, AuthLayoutComponent, IconComponent],
  templateUrl: './verify-email.component.html',
})
export class VerifyEmailComponent implements OnDestroy {
  readonly email: string;
  readonly resending = signal(false);
  readonly secondsLeft = signal(RESEND_COOLDOWN);
  readonly canResend = computed(() => this.secondsLeft() <= 0);

  private timer: ReturnType<typeof setInterval> | null = null;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(
    private notify: NotificationService,
    private auth: AuthService,
    route: ActivatedRoute,
  ) {
    this.email = route.snapshot.queryParams['email'] || this.auth.user()?.email || 'your email address';
    // setInterval keeps NgZone perpetually unstable, which hangs SSR
    // (renderApplication waits for zone stability) — browser-only.
    if (this.isBrowser) this.startCooldown();
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  resend(): void {
    if (!this.canResend() || this.resending()) return;
    this.resending.set(true);

    // No backend verify-email endpoint exists yet — this simulates the
    // resend UX so the flow can be dropped in once that endpoint ships.
    setTimeout(() => {
      this.resending.set(false);
      this.notify.success('Verification email sent', `We've resent the link to ${this.email}.`);
      this.startCooldown();
    }, 700);
  }

  openEmailApp(): void {
    window.location.href = 'mailto:';
  }

  private startCooldown(): void {
    this.secondsLeft.set(RESEND_COOLDOWN);
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.secondsLeft.update(s => (s > 0 ? s - 1 : 0));
      if (this.secondsLeft() <= 0 && this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }, 1000);
  }
}
