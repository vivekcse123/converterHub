import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { PortfolioSection, ProjectItem, ProjectsConfig } from '../../../models/portfolio.model';
import { ImageUploadFieldComponent } from '../image-upload-field/image-upload-field.component';

@Component({
  selector: 'app-projects-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUploadFieldComponent],
  template: `
    <div class="space-y-3">
      @for (item of section().config.items; track $index) {
        <div class="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold text-slate-600 dark:text-slate-300">Project {{ $index + 1 }}</p>
            <button type="button" class="text-red-400 hover:text-red-600 text-xs" (click)="remove($index)">Remove</button>
          </div>
          <input type="text" [ngModel]="item.title" (ngModelChange)="set($index, { title: $event })" placeholder="Project title"
                 class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none" />
          <textarea rows="2" [ngModel]="item.description" (ngModelChange)="set($index, { description: $event })" placeholder="What it does..."
                    class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm resize-none focus:outline-none"></textarea>
          <app-image-upload-field label="Cover image" kind="cover" [url]="item.imageUrl" (urlChange)="set($index, { imageUrl: $event })" />
          <div class="grid grid-cols-2 gap-2">
            <input type="url" [ngModel]="item.url" (ngModelChange)="set($index, { url: $event })" placeholder="Live URL"
                   class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none" />
            <input type="url" [ngModel]="item.githubUrl" (ngModelChange)="set($index, { githubUrl: $event })" placeholder="GitHub URL"
                   class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none" />
          </div>
          <input type="text" [ngModel]="tagsStr(item)" (ngModelChange)="setTags($index, $event)" placeholder="Tags, comma separated (React, Node.js)"
                 class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none" />
          <label class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <input type="checkbox" [ngModel]="item.featured" (ngModelChange)="set($index, { featured: $event })" class="rounded" />
            Featured project
          </label>
        </div>
      }
      <button type="button"
              class="w-full text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 py-2 border border-dashed border-slate-300 dark:border-slate-600 hover:border-primary-400 rounded-xl transition-colors"
              (click)="add()">+ Add project</button>
    </div>
  `,
})
export class ProjectsFormComponent {
  readonly section = input.required<PortfolioSection<ProjectsConfig>>();
  private store = inject(PortfolioStoreService);

  private update(patch: Partial<ProjectsConfig>): void {
    this.store.updateSectionConfig<ProjectsConfig>(this.section().id, patch);
  }

  tagsStr(item: ProjectItem): string { return (item.tags ?? []).join(', '); }

  add(): void {
    const blank: ProjectItem = { title: '', description: '', tags: [], featured: false };
    this.update({ items: [...this.section().config.items, blank] });
  }

  remove(i: number): void {
    this.update({ items: this.section().config.items.filter((_, idx) => idx !== i) });
  }

  set(i: number, patch: Partial<ProjectItem>): void {
    const items = [...this.section().config.items];
    items[i] = { ...items[i], ...patch };
    this.update({ items });
  }

  setTags(i: number, value: string): void {
    this.set(i, { tags: value.split(',').map(t => t.trim()).filter(Boolean) });
  }
}
