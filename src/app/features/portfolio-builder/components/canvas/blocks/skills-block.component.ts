import { Component, ChangeDetectionStrategy, inject, input, signal } from '@angular/core';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { PortfolioSection, PortfolioTheme, SkillGroup, SkillItem, SkillsConfig, uid } from '../../../models/portfolio.model';
import { InlineTextFieldComponent } from '../inline-text-field.component';
import { getThemePreset } from '../../../themes/shared/theme-presets';

const LEVEL_COLOR: Record<string, string> = {
  beginner: 'bg-slate-300 dark:bg-slate-600',
  intermediate: 'bg-blue-400',
  advanced: 'bg-primary-500',
  expert: 'bg-emerald-500',
};
const LEVELS: SkillItem['level'][] = ['beginner', 'intermediate', 'advanced', 'expert'];

@Component({
  selector: 'app-skills-block',
  standalone: true,
  imports: [InlineTextFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="max-w-3xl mx-auto px-4" [class]="preset().fontClass">
      <h3 [class]="preset().heading + ' mb-4'">Skills</h3>

      <div class="space-y-6">
        @for (group of config().groups; track group.id) {
          <div>
            <div class="flex items-center justify-between mb-2.5">
              <app-inline-text-field [value]="group.label" placeholder="Group name"
                [textClass]="'text-sm ' + preset().title"
                ariaLabel="Group label" (valueChange)="renameGroup(group.id, $event)" />
              <button type="button" (click)="removeGroup(group.id)" class="text-[11px] text-slate-400 hover:text-red-500 shrink-0 ml-2">Remove group</button>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              @for (item of group.items; track $index) {
                <span [class]="'inline-flex items-center gap-1.5 pl-1.5 pr-2 py-1 text-xs font-medium ' + preset().chip">
                  <button type="button" (click)="cycleLevel(group.id, $index)" [title]="item.level"
                          class="w-2.5 h-2.5 rounded-full shrink-0" [class]="LEVEL_COLOR[item.level ?? 'intermediate']"></button>
                  {{ item.name }}
                  <button type="button" (click)="removeItem(group.id, $index)" class="w-3.5 h-3.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </span>
              }
              @if (addingTo() === group.id) {
                <input #si type="text" placeholder="Skill name" autofocus
                  class="px-3 py-1 rounded-full border border-primary-300 dark:border-primary-700 bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-primary-500 w-32"
                  (keydown.enter)="commitItem(group.id, si.value); si.value = ''"
                  (blur)="commitItem(group.id, si.value); si.value = ''" />
              } @else {
                <button type="button" (click)="addingTo.set(group.id)"
                  class="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-dashed border-slate-300 dark:border-slate-600 text-xs font-medium text-slate-400 hover:border-primary-400 hover:text-primary-600 transition-colors">
                  + Add skill
                </button>
              }
            </div>
          </div>
        }
      </div>

      <button type="button" (click)="addGroup()"
        class="mt-5 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors">
        + Add skill group
      </button>
    </div>
  `,
})
export class SkillsBlockComponent {
  section = input.required<PortfolioSection<SkillsConfig>>();
  theme = input<PortfolioTheme | null>(null);

  private store = inject(PortfolioStoreService);
  readonly LEVEL_COLOR = LEVEL_COLOR;
  readonly addingTo = signal<string | null>(null);

  preset() { return getThemePreset(this.theme()?.templateId); }

  config(): SkillsConfig { return this.section().config; }

  private patch(patch: Partial<SkillsConfig>): void {
    this.store.updateSectionConfig(this.section().id, patch);
  }

  private updateGroups(fn: (groups: SkillGroup[]) => SkillGroup[]): void {
    this.patch({ groups: fn(this.config().groups) });
  }

  renameGroup(id: string, label: string): void {
    this.updateGroups(groups => groups.map(g => g.id === id ? { ...g, label } : g));
  }

  addGroup(): void {
    this.updateGroups(groups => [...groups, { id: uid('grp'), label: 'New group', items: [] }]);
  }

  removeGroup(id: string): void {
    this.updateGroups(groups => groups.filter(g => g.id !== id));
  }

  commitItem(groupId: string, value: string): void {
    this.addingTo.set(null);
    const name = value.trim();
    if (!name) return;
    this.updateGroups(groups => groups.map(g =>
      g.id === groupId ? { ...g, items: [...g.items, { name, level: 'intermediate' }] } : g));
  }

  removeItem(groupId: string, index: number): void {
    this.updateGroups(groups => groups.map(g =>
      g.id === groupId ? { ...g, items: g.items.filter((_, i) => i !== index) } : g));
  }

  cycleLevel(groupId: string, index: number): void {
    this.updateGroups(groups => groups.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        items: g.items.map((it, i) => {
          if (i !== index) return it;
          const next = LEVELS[(LEVELS.indexOf(it.level ?? 'intermediate') + 1) % LEVELS.length];
          return { ...it, level: next };
        }),
      };
    }));
  }
}
