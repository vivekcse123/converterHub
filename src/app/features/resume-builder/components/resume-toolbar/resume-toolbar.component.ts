import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStoreService } from '../../services/resume-store.service';
import { ResumePdfService } from '../../services/resume-pdf.service';
import { ResumeAuthGateService } from '../../services/resume-auth-gate.service';
import { inputValue } from '../editor/editor-utils';

@Component({
  selector: 'app-resume-toolbar',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
      <div class="flex flex-1 items-center gap-2 min-w-0">
        <input
          class="input flex-1 min-w-0 font-medium"
          [value]="resume()?.name ?? ''"
          (input)="rename($event)"
          placeholder="Resume name"
          aria-label="Resume name"
        />
        <select class="input w-auto max-w-[160px] shrink-0" [value]="store.activeId() ?? ''" (change)="switchResume($event)" aria-label="Switch resume">
          @for (r of store.resumes(); track r.id) {
            <option [value]="r.id">{{ r.name || 'Untitled Resume' }}</option>
          }
        </select>
      </div>

      <div class="flex items-center gap-2.5 flex-wrap shrink-0">
        <button type="button" class="btn btn-secondary btn-sm" (click)="store.createResume()" title="Create a new blank resume">
          + New
        </button>
        <button type="button" class="btn btn-secondary btn-sm" (click)="duplicate()" title="Duplicate this resume">
          ⧉ Duplicate
        </button>
        <button
          type="button"
          class="btn btn-secondary btn-sm text-red-600 hover:text-red-700 dark:text-red-400"
          (click)="remove()"
          [disabled]="store.resumes().length <= 1"
          title="Delete this resume"
        >
          🗑️ Delete
        </button>

        <button type="button" class="btn btn-primary btn-sm whitespace-nowrap" (click)="download()" [disabled]="downloading()">
          @if (downloading()) {
            ⏳ Generating...
          } @else {
            ⬇️ Download PDF
          }
        </button>
      </div>
    </div>
  `,
})
export class ResumeToolbarComponent {
  readonly store = inject(ResumeStoreService);
  private readonly pdfService = inject(ResumePdfService);
  private readonly authGate = inject(ResumeAuthGateService);

  readonly resume = computed(() => this.store.activeResume());
  readonly downloading = signal(false);

  rename(event: Event): void {
    const id = this.store.activeId();
    if (id) this.store.renameResume(id, inputValue(event));
  }

  switchResume(event: Event): void {
    this.store.setActive(inputValue(event));
  }

  duplicate(): void {
    const id = this.store.activeId();
    if (id) this.store.duplicateResume(id);
  }

  remove(): void {
    const id = this.store.activeId();
    if (id) this.store.deleteResume(id);
  }

  async download(): Promise<void> {
    const resume = this.resume();
    if (!resume || this.downloading()) return;
    if (!this.authGate.canDownload()) return;
    this.downloading.set(true);
    try {
      await this.pdfService.download(resume);
    } finally {
      this.downloading.set(false);
    }
  }
}
