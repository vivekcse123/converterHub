import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiodataStoreService } from '../../../services/biodata-store.service';
import { LABEL, inp } from '../editor-utils';

@Component({
  selector: 'app-biodata-skills-form',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (bd(); as b) {
      <div class="space-y-5">

        <!-- Skills -->
        <div>
          <label [class]="lc">Skills <span class="text-slate-400 font-normal">(comma-separated)</span></label>
          <input class="input" [value]="skillsText()" (input)="onSkills($event)" placeholder="JavaScript, Angular, Python, SQL" />
          @if (b.skills.length > 0) {
            <div class="flex flex-wrap gap-1.5 mt-2">
              @for (s of b.skills; track s) {
                <span class="badge bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">{{ s }}</span>
              }
            </div>
          }
        </div>

        <!-- Hobbies -->
        <div>
          <label [class]="lc">Hobbies & Interests <span class="text-slate-400 font-normal">(comma-separated)</span></label>
          <input class="input" [value]="hobbiesText()" (input)="onHobbies($event)" placeholder="Classical Dance, Reading, Cooking" />
          @if (b.hobbies.length > 0) {
            <div class="flex flex-wrap gap-1.5 mt-2">
              @for (h of b.hobbies; track h) {
                <span class="badge bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300">{{ h }}</span>
              }
            </div>
          }
        </div>

        <!-- Languages -->
        <div>
          <label [class]="lc">Languages Known <span class="text-slate-400 font-normal">(comma-separated)</span></label>
          <input class="input" [value]="languagesText()" (input)="onLanguages($event)" placeholder="Hindi, English, Sanskrit" />
          @if (b.languages.length > 0) {
            <div class="flex flex-wrap gap-1.5 mt-2">
              @for (l of b.languages; track l) {
                <span class="badge bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">{{ l }}</span>
              }
            </div>
          }
        </div>

      </div>
    }
  `,
})
export class BiodataSkillsFormComponent {
  private readonly store = inject(BiodataStoreService);
  readonly bd = computed(() => this.store.activeBiodata());
  readonly lc = LABEL;

  readonly skillsText = computed(() => this.bd()?.skills.join(', ') ?? '');
  readonly hobbiesText = computed(() => this.bd()?.hobbies.join(', ') ?? '');
  readonly languagesText = computed(() => this.bd()?.languages.join(', ') ?? '');

  private parseList(raw: string): string[] {
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  }

  onSkills(e: Event): void {
    this.store.updateSkills(this.parseList(inp(e)));
  }

  onHobbies(e: Event): void {
    this.store.updateHobbies(this.parseList(inp(e)));
  }

  onLanguages(e: Event): void {
    this.store.updateLanguages(this.parseList(inp(e)));
  }
}
