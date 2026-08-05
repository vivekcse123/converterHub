import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-social-buttons',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <button type="button" (click)="google.emit()" [disabled]="loading()" [attr.aria-busy]="loading()"
      class="inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-700
             bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200
             hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600
             active:scale-[0.98] transition-all duration-150 focus:outline-none focus-visible:ring-2
             focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed">
      @if (loading()) {
        <app-icon name="spinner" [size]="18" />
        <span class="sr-only">Signing in with Google, please wait</span>
      } @else {
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.54 5.54 0 01-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.11A11.997 11.997 0 0012 24z"/>
          <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 014.9 12c0-.79.14-1.56.37-2.28V6.61H1.26A11.997 11.997 0 000 12c0 1.94.46 3.77 1.26 5.39l4.01-3.11z"/>
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.26 6.61l4.01 3.11C6.22 6.86 8.87 4.75 12 4.75z"/>
        </svg>
      }
      <span [class.sr-only]="loading()">Continue with Google</span>
    </button>
  `,
})
export class SocialButtonsComponent {
  loading = input(false);
  google = output<void>();
}
