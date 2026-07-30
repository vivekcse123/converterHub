import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { ExperienceConfig, ExperienceItem, PortfolioSection, uid } from '../../../models/portfolio.model';

@Component({
  selector: 'app-experience-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-3">
      @for (item of section().config.items; track item.id; let i = $index) {
        <div class="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold text-slate-600 dark:text-slate-300">Role {{ i + 1 }}</p>
            <button type="button" class="text-red-400 hover:text-red-600 text-xs" (click)="remove(item.id)">Remove</button>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <input type="text" [ngModel]="item.role" (ngModelChange)="set(item.id, { role: $event })" placeholder="Job title"
                   class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none" />
            <input type="text" [ngModel]="item.company" (ngModelChange)="set(item.id, { company: $event })" placeholder="Company"
                   class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <input type="text" [ngModel]="item.startDate" (ngModelChange)="set(item.id, { startDate: $event })" placeholder="Start (e.g. Jan 2022)"
                   class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none" />
            <input type="text" [ngModel]="item.endDate" [disabled]="item.current" (ngModelChange)="set(item.id, { endDate: $event })" placeholder="End"
                   class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none disabled:opacity-50" />
          </div>
          <label class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <input type="checkbox" [ngModel]="item.current" (ngModelChange)="set(item.id, { current: $event })" class="rounded" />
            I currently work here
          </label>
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-xs font-semibold text-slate-500">Highlights</label>
              <button type="button" class="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline" (click)="addBullet(item.id)">+ Add</button>
            </div>
            @for (b of item.bullets; track $index) {
              <div class="flex items-center gap-2 mb-1.5">
                <input type="text" [ngModel]="b" (ngModelChange)="setBullet(item.id, $index, $event)" placeholder="Shipped X that improved Y by Z%"
                       class="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none" />
                <button type="button" class="text-red-400 hover:text-red-600 text-sm px-1" (click)="removeBullet(item.id, $index)">✕</button>
              </div>
            }
          </div>
        </div>
      }
      <button type="button"
              class="w-full text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 py-2 border border-dashed border-slate-300 dark:border-slate-600 hover:border-primary-400 rounded-xl transition-colors"
              (click)="addRole()">+ Add role</button>
    </div>
  `,
})
export class ExperienceFormComponent {
  readonly section = input.required<PortfolioSection<ExperienceConfig>>();
  private store = inject(PortfolioStoreService);

  private update(patch: Partial<ExperienceConfig>): void {
    this.store.updateSectionConfig<ExperienceConfig>(this.section().id, patch);
  }

  addRole(): void {
    const blank: ExperienceItem = { id: uid('exp'), role: '', company: '', startDate: '', endDate: '', current: false, bullets: [] };
    this.update({ items: [...this.section().config.items, blank] });
  }

  remove(id: string): void {
    this.update({ items: this.section().config.items.filter(it => it.id !== id) });
  }

  set(id: string, patch: Partial<ExperienceItem>): void {
    this.update({ items: this.section().config.items.map(it => it.id === id ? { ...it, ...patch } : it) });
  }

  addBullet(id: string): void {
    this.update({ items: this.section().config.items.map(it => it.id === id ? { ...it, bullets: [...it.bullets, ''] } : it) });
  }

  setBullet(id: string, bi: number, value: string): void {
    this.update({
      items: this.section().config.items.map(it => {
        if (it.id !== id) return it;
        const bullets = [...it.bullets];
        bullets[bi] = value;
        return { ...it, bullets };
      }),
    });
  }

  removeBullet(id: string, bi: number): void {
    this.update({
      items: this.section().config.items.map(it => it.id === id ? { ...it, bullets: it.bullets.filter((_, idx) => idx !== bi) } : it),
    });
  }
}
