import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiodataStoreService } from '../../services/biodata-store.service';

@Component({
  selector: 'app-biodata-toolbar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (bd(); as b) {
      <div class="flex flex-wrap items-center gap-2">
        <!-- Biodata name -->
        <div class="flex-1 min-w-40">
          @if (editing()) {
            <input
              #nameInput
              class="input text-sm font-semibold py-1.5"
              [value]="b.name"
              (input)="store.renameBiodata(b.id, nameInput.value)"
              (blur)="editing.set(false)"
              (keydown.enter)="editing.set(false)"
              (keydown.escape)="editing.set(false)"
              autofocus
            />
          } @else {
            <button
              type="button"
              class="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
              (click)="editing.set(true)"
              title="Click to rename"
            >
              <span>📄</span>
              <span>{{ b.name }}</span>
              <span class="text-slate-300 group-hover:text-primary-400 text-xs">✏️</span>
            </button>
          }
        </div>

        <!-- Switcher (if multiple biodatas) -->
        @if (store.biodatas().length > 1) {
          <select
            class="input text-sm py-1.5 max-w-36"
            [value]="b.id"
            (change)="store.setActive(selectVal($event))"
            title="Switch biodata"
          >
            @for (bd of store.biodatas(); track bd.id) {
              <option [value]="bd.id">{{ bd.name }}</option>
            }
          </select>
        }

        <!-- New -->
        <button type="button" class="btn btn-secondary btn-sm" (click)="store.createBiodata()" title="Create new biodata">
          + New
        </button>

        <!-- Duplicate -->
        <button type="button" class="btn btn-secondary btn-sm" (click)="store.duplicateBiodata(b.id)" title="Duplicate this biodata">
          ⧉ Duplicate
        </button>

        <!-- Delete -->
        @if (store.biodatas().length > 1) {
          <button type="button" class="btn btn-sm text-red-600 border border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" (click)="confirmDelete(b.id)" title="Delete this biodata">
            🗑 Delete
          </button>
        }
      </div>
    }
  `,
})
export class BiodataToolbarComponent {
  readonly store = inject(BiodataStoreService);
  readonly bd = computed(() => this.store.activeBiodata());
  readonly editing = signal(false);

  selectVal(e: Event): string {
    return (e.target as HTMLSelectElement).value;
  }

  confirmDelete(id: string): void {
    if (confirm('Delete this biodata? This cannot be undone.')) {
      this.store.deleteBiodata(id);
    }
  }
}
