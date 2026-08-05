import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../../shared/components/confirm-dialog/confirm-dialog.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { PasswordFieldComponent } from '../../../auth/shared/password-field/password-field.component';

@Component({
  selector: 'app-dashboard-settings',
  standalone: true,
  imports: [FormsModule, IconComponent, PasswordFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-settings.component.html',
})
export class DashboardSettingsComponent {
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  private readonly notify = inject(NotificationService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  readonly name = signal(this.auth.user()?.name ?? '');
  readonly timezone = signal(this.auth.user()?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone);
  readonly savingProfile = signal(false);

  readonly currentPassword = signal('');
  readonly newPassword = signal('');
  readonly confirmPassword = signal('');
  readonly savingPassword = signal(false);

  readonly signingOutAll = signal(false);

  saveProfile(): void {
    const name = this.name().trim();
    if (!name) {
      this.notify.error('Name is required');
      return;
    }
    this.savingProfile.set(true);
    this.auth.updateProfile({ name, timezone: this.timezone() }).subscribe({
      next: () => {
        this.savingProfile.set(false);
        this.notify.success('Profile updated');
      },
      error: () => {
        this.savingProfile.set(false);
        this.notify.error('Could not update profile', 'Please try again.');
      },
    });
  }

  changePassword(): void {
    if (this.newPassword().length < 8) {
      this.notify.error('Password too short', 'Use at least 8 characters.');
      return;
    }
    if (this.newPassword() !== this.confirmPassword()) {
      this.notify.error('Passwords do not match');
      return;
    }
    this.savingPassword.set(true);
    this.auth.changePassword(this.currentPassword(), this.newPassword()).subscribe({
      next: () => {
        this.savingPassword.set(false);
        this.currentPassword.set('');
        this.newPassword.set('');
        this.confirmPassword.set('');
        this.notify.success('Password changed');
      },
      error: (err) => {
        this.savingPassword.set(false);
        this.notify.error('Could not change password', err?.error?.message ?? 'Check your current password and try again.');
      },
    });
  }

  async signOutAllDevices(): Promise<void> {
    const ok = await this.confirmDialog.open({
      title: 'Log out of all devices?',
      message: 'You will be signed out everywhere, including this device, and will need to log in again.',
      confirmLabel: 'Log out everywhere',
      danger: true,
    });
    if (!ok) return;
    this.signingOutAll.set(true);
    this.auth.logoutAllDevices().subscribe({
      error: () => this.signingOutAll.set(false),
    });
  }

  setTheme(target: 'light' | 'dark'): void {
    if (this.theme.theme() !== target) this.theme.toggle();
  }
}
