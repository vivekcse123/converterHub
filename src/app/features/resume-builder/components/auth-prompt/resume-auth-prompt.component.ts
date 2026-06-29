import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeAuthGateService } from '../../services/resume-auth-gate.service';

@Component({
  selector: 'app-resume-auth-prompt',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (gate.showPrompt()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" (click)="gate.dismiss()">
        <div class="card relative p-6 max-w-sm w-full space-y-4 text-center" (click)="$event.stopPropagation()">
          <button
            type="button"
            class="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            (click)="gate.dismiss()"
            aria-label="Close"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          <div class="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900/40 rounded-2xl flex items-center justify-center" aria-hidden="true">
            <svg class="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Log in to download your resume</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Create a free account (or log in) to save your resume and download the PDF - it only takes a few seconds,
            and you'll be brought right back here.
          </p>

          <div class="flex flex-col gap-2 pt-1">
            <button type="button" class="btn btn-primary w-full" (click)="gate.goToSignup()">
              Create Free Account
            </button>
            <button type="button" class="btn btn-secondary w-full" (click)="gate.goToLogin()">
              Log In
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ResumeAuthPromptComponent {
  readonly gate = inject(ResumeAuthGateService);
}
