import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiodataStoreService } from '../../services/biodata-store.service';
import { BiodataPdfService } from '../../services/biodata-pdf.service';
import { BiodataAuthGateService } from '../../services/biodata-auth-gate.service';

@Component({
  selector: 'app-biodata-toolbar',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (bd(); as b) {
      <div class="card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3">

        <!-- Name + switcher -->
        <div class="flex flex-1 items-center gap-2 min-w-0">
          <input
            class="input flex-1 min-w-0 font-medium"
            [value]="b.name"
            (input)="rename($event)"
            placeholder="Biodata name"
            aria-label="Biodata name"
          />
          @if (store.biodatas().length > 1) {
            <select
              class="input w-auto max-w-[160px] shrink-0"
              [value]="b.id"
              (change)="store.setActive(val($event))"
              aria-label="Switch biodata"
            >
              @for (item of store.biodatas(); track item.id) {
                <option [value]="item.id">{{ item.name || 'Untitled' }}</option>
              }
            </select>
          }
        </div>

        <!-- Action buttons -->
        <div class="flex items-center gap-2 flex-wrap shrink-0">
          <button type="button" class="btn btn-secondary btn-sm" (click)="store.createBiodata()" title="Create new biodata">
            + New
          </button>

          <button type="button" class="btn btn-secondary btn-sm" (click)="store.duplicateBiodata(b.id)" title="Duplicate this biodata">
            ⧉ Duplicate
          </button>

          <button
            type="button"
            class="btn btn-secondary btn-sm text-red-600 hover:text-red-700 dark:text-red-400"
            [disabled]="store.biodatas().length <= 1"
            (click)="confirmDelete(b.id)"
            title="Delete this biodata"
          >
            🗑️ Delete
          </button>

          <button
            type="button"
            class="btn btn-primary btn-sm whitespace-nowrap"
            [disabled]="downloading()"
            (click)="download()"
          >
            @if (downloading()) { ⏳ Generating… } @else { ⬇️ Download PDF }
          </button>
        </div>
      </div>
    }
  `,
})
export class BiodataToolbarComponent {
  readonly store = inject(BiodataStoreService);
  private readonly pdfService = inject(BiodataPdfService);
  private readonly authGate = inject(BiodataAuthGateService);

  readonly bd = computed(() => this.store.activeBiodata());
  readonly downloading = signal(false);

  rename(event: Event): void {
    const id = this.store.activeId();
    if (id) this.store.renameBiodata(id, (event.target as HTMLInputElement).value);
  }

  val(e: Event): string {
    return (e.target as HTMLSelectElement).value;
  }

  confirmDelete(id: string): void {
    if (confirm('Delete this biodata? This cannot be undone.')) {
      this.store.deleteBiodata(id);
    }
  }

  async download(): Promise<void> {
    const b = this.bd();
    if (!b || this.downloading()) return;
    if (!this.authGate.canDownload()) return;
    this.downloading.set(true);
    try {
      await this.pdfService.download(b);
    } finally {
      this.downloading.set(false);
    }
  }
}
