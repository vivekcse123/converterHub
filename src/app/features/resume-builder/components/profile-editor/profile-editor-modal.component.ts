import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalInfoFormComponent } from '../editor/personal-info-form/personal-info-form.component';

/**
 * Dedicated "Edit Profile" entry point — the header avatar and Settings-rail
 * account card both open this. Wraps the existing `PersonalInfoFormComponent`
 * unchanged, so editing here is the exact same instant-save, live-preview-linked
 * flow as editing the Personal Info section in the sidebar.
 */
@Component({
  selector: 'app-profile-editor-modal',
  standalone: true,
  imports: [CommonModule, PersonalInfoFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-16 pb-4 bg-black/60 backdrop-blur-sm" (click)="close.emit()">
      <div class="relative w-full max-w-lg max-h-[88vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl" (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="flex items-start justify-between px-6 py-5 border-b border-hairline dark:border-slate-800 shrink-0">
          <div>
            <h2 class="text-lg font-extrabold text-gray-900 dark:text-white">Edit Profile</h2>
            <p class="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Changes save instantly and appear in your resume preview.</p>
          </div>
          <button type="button" (click)="close.emit()" aria-label="Close"
                  class="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="overflow-y-auto flex-1 min-h-0">
          <app-personal-info-form />
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-hairline dark:border-slate-800 shrink-0">
          <button type="button" (click)="close.emit()"
                  class="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold transition-colors">
            Done
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProfileEditorModalComponent {
  readonly close = output<void>();
}
