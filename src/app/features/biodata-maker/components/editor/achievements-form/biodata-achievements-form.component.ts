import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiodataStoreService } from '../../../services/biodata-store.service';
import { LABEL, inp } from '../editor-utils';

@Component({
  selector: 'app-biodata-achievements-form',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (bd(); as b) {
      <div class="space-y-3">
        <p class="text-xs text-slate-500 dark:text-slate-400">Add awards, honours, notable projects, or accomplishments (one per line).</p>
        @for (item of b.achievements; track item; let i = $index) {
          <div class="flex gap-2 items-start">
            <span class="text-slate-300 dark:text-slate-600 text-xs mt-2.5 font-mono select-none w-5 text-right flex-shrink-0">{{ i + 1 }}.</span>
            <input class="input flex-1" [value]="item" (input)="update(i, $event)" placeholder="State Merit Scholarship 2023" />
            <button type="button" class="mt-1 text-slate-400 hover:text-red-500 transition-colors px-1" (click)="remove(i)" title="Remove">✕</button>
          </div>
        }
        <button type="button" class="btn btn-secondary btn-sm w-full" (click)="add()">+ Add Achievement</button>
      </div>
    }
  `,
})
export class BiodataAchievementsFormComponent {
  private readonly store = inject(BiodataStoreService);
  readonly bd = computed(() => this.store.activeBiodata());
  readonly lc = LABEL;

  add(): void {
    const list = [...(this.bd()?.achievements ?? []), ''];
    this.store.updateAchievements(list);
  }

  update(i: number, e: Event): void {
    const list = [...(this.bd()?.achievements ?? [])];
    list[i] = inp(e);
    this.store.updateAchievements(list);
  }

  remove(i: number): void {
    const list = (this.bd()?.achievements ?? []).filter((_, idx) => idx !== i);
    this.store.updateAchievements(list);
  }
}
