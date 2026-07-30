import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { PortfolioSection, SkillsConfig, uid } from '../../../models/portfolio.model';

@Component({
  selector: 'app-skills-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      @for (group of section().config.groups; track group.id) {
        <div class="border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-2">
          <div class="flex items-center gap-2">
            <input type="text" [ngModel]="group.label" (ngModelChange)="setGroupLabel(group.id, $event)" placeholder="Group name"
                   class="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none" />
            @if (section().config.groups.length > 1) {
              <button type="button" class="text-red-400 hover:text-red-600 text-xs" (click)="removeGroup(group.id)">Remove group</button>
            }
          </div>
          @for (item of group.items; track $index) {
            <div class="flex items-center gap-2">
              <input type="text" [ngModel]="item.name" (ngModelChange)="setItem(group.id, $index, { name: $event })" placeholder="Skill name"
                     class="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none" />
              <select [ngModel]="item.level ?? 'intermediate'" (ngModelChange)="setItem(group.id, $index, { level: $event })"
                      class="px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 focus:outline-none">
                @for (l of levels; track l) { <option [value]="l">{{ l }}</option> }
              </select>
              <button type="button" class="text-red-400 hover:text-red-600 text-sm px-1" (click)="removeItem(group.id, $index)">✕</button>
            </div>
          }
          <button type="button" class="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline" (click)="addItem(group.id)">+ Add skill</button>
        </div>
      }
      <button type="button"
              class="w-full text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 py-2 border border-dashed border-slate-300 dark:border-slate-600 hover:border-primary-400 rounded-xl transition-colors"
              (click)="addGroup()">+ Add group</button>
    </div>
  `,
})
export class SkillsFormComponent {
  readonly section = input.required<PortfolioSection<SkillsConfig>>();
  private store = inject(PortfolioStoreService);
  readonly levels = ['beginner', 'intermediate', 'advanced', 'expert'] as const;

  private update(patch: Partial<SkillsConfig>): void {
    this.store.updateSectionConfig<SkillsConfig>(this.section().id, patch);
  }

  addGroup(): void {
    this.update({ groups: [...this.section().config.groups, { id: uid('grp'), label: 'New Group', items: [] }] });
  }

  removeGroup(id: string): void {
    this.update({ groups: this.section().config.groups.filter(g => g.id !== id) });
  }

  setGroupLabel(id: string, label: string): void {
    this.update({ groups: this.section().config.groups.map(g => g.id === id ? { ...g, label } : g) });
  }

  addItem(id: string): void {
    this.update({
      groups: this.section().config.groups.map(g => g.id === id ? { ...g, items: [...g.items, { name: '', level: 'intermediate' as const }] } : g),
    });
  }

  removeItem(id: string, ii: number): void {
    this.update({
      groups: this.section().config.groups.map(g => g.id === id ? { ...g, items: g.items.filter((_, idx) => idx !== ii) } : g),
    });
  }

  setItem(id: string, ii: number, patch: Partial<{ name: string; level: string }>): void {
    this.update({
      groups: this.section().config.groups.map(g => {
        if (g.id !== id) return g;
        const items = [...g.items];
        items[ii] = { ...items[ii], ...patch } as any;
        return { ...g, items };
      }),
    });
  }
}
