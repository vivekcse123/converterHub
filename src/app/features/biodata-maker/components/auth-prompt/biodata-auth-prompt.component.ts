import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiodataAuthGateService } from '../../services/biodata-auth-gate.service';

@Component({
  selector: 'app-biodata-auth-prompt',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (gate.showPrompt()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" (click)="gate.dismiss()">
        <div class="card relative p-6 max-w-sm w-full space-y-4 text-center" (click)="$event.stopPropagation()">
          <button type="button" class="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg leading-none" (click)="gate.dismiss()" aria-label="Close">✕</button>

          <div class="text-4xl">📋</div>
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Sign in to download your biodata</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Create a free account to save your biodata and download the PDF. It takes only a few seconds - you'll be brought right back here.
          </p>

          <div class="flex flex-col gap-2 pt-1">
            <button type="button" class="btn btn-primary w-full" (click)="gate.goToSignup()">
              Create Free Account
            </button>
            <button type="button" class="btn btn-secondary w-full" (click)="gate.goToLogin()">
              Log In
            </button>
            <button type="button" class="text-xs text-slate-400 hover:text-slate-600 transition-colors mt-1" (click)="gate.dismiss()">
              Maybe later
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class BiodataAuthPromptComponent {
  readonly gate = inject(BiodataAuthGateService);
}
