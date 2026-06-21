import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStoreService } from '../../../services/resume-store.service';
import { CustomSection, CustomSectionEntry } from '../../../models/resume.model';
import { BOLD_BTN_CLASS, LABEL_CLASS, applyBoldToggle, inputValue } from '../editor-utils';

@Component({
  selector: 'app-custom-section-form',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card p-5 space-y-4">
      <div class="flex items-end gap-4">
        <div class="flex-1">
          <label [class]="labelClass">Section Title</label>
          <input class="input" [value]="section().title" (input)="patchTitle($event)" placeholder="e.g. Volunteer Experience, Publications" />
        </div>
        <button type="button" class="btn btn-sm border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20" (click)="store.removeCustomSection(section().id)">
          🗑️ Remove Section
        </button>
      </div>

      <div class="space-y-4">
        @for (entry of section().entries; track entry.id; let i = $index) {
          <div class="card p-5 relative bg-slate-50 dark:bg-slate-800/60">
            <div class="flex items-center justify-between mb-3">
              <span class="badge bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                Entry {{ i + 1 }}
              </span>
              <button type="button" class="text-slate-400 hover:text-red-500 transition-colors text-sm" (click)="store.removeCustomEntry(section().id, entry.id)" aria-label="Remove entry">
                🗑️ Remove
              </button>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div>
                <label [class]="labelClass">Heading</label>
                <input class="input" [value]="entry.heading" (input)="patchEntry(entry.id, 'heading', $event)" placeholder="e.g. Title, Role, Organization" />
              </div>
              <div>
                <label [class]="labelClass">Subheading</label>
                <input class="input" [value]="entry.subheading" (input)="patchEntry(entry.id, 'subheading', $event)" placeholder="e.g. Location, Publisher" />
              </div>
              <div>
                <label [class]="labelClass">Date</label>
                <input class="input" [value]="entry.date" (input)="patchEntry(entry.id, 'date', $event)" placeholder="e.g. 2023 or Jan 2023" />
              </div>
              <div class="">
                <div class="flex items-center justify-between mb-1">
                  <label class="text-xs font-medium text-slate-500 dark:text-slate-400">Description</label>
                  <button type="button" [class]="boldBtnClass" (click)="toggleBold(entry.id, descEl)" title="Bold selected text">B</button>
                </div>
                <textarea #descEl class="input min-h-[72px] resize-y" [value]="entry.description" (input)="patchEntry(entry.id, 'description', $event)" placeholder="Add details about this entry..."></textarea>
              </div>
            </div>
          </div>
        }
      </div>

      <button type="button" class="btn btn-primary btn-sm" (click)="store.addCustomEntry(section().id)">+ Add Entry</button>
    </div>
  `,
})
export class CustomSectionFormComponent {
  readonly store = inject(ResumeStoreService);
  readonly section = input.required<CustomSection>();
  readonly labelClass = LABEL_CLASS;
  readonly boldBtnClass = BOLD_BTN_CLASS;

  patchTitle(event: Event): void {
    this.store.updateCustomSectionTitle(this.section().id, inputValue(event));
  }

  patchEntry(entryId: string, field: keyof CustomSectionEntry, event: Event): void {
    this.store.updateCustomEntry(this.section().id, entryId, { [field]: inputValue(event) } as Partial<CustomSectionEntry>);
  }

  toggleBold(entryId: string, textarea: HTMLTextAreaElement): void {
    this.store.updateCustomEntry(this.section().id, entryId, { description: applyBoldToggle(textarea) });
  }
}
