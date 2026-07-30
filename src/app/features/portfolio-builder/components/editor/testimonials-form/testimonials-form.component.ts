import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioStoreService } from '../../../services/portfolio-store.service';
import { PortfolioSection, TestimonialItem, TestimonialsConfig } from '../../../models/portfolio.model';
import { ImageUploadFieldComponent } from '../image-upload-field/image-upload-field.component';

@Component({
  selector: 'app-testimonials-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUploadFieldComponent],
  template: `
    <div class="space-y-3">
      @for (item of section().config.items; track $index) {
        <div class="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold text-slate-600 dark:text-slate-300">Testimonial {{ $index + 1 }}</p>
            <button type="button" class="text-red-400 hover:text-red-600 text-xs" (click)="remove($index)">Remove</button>
          </div>
          <textarea rows="2" [ngModel]="item.quote" (ngModelChange)="set($index, { quote: $event })" placeholder="“Working with them was a pleasure...”"
                    class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm resize-none focus:outline-none"></textarea>
          <div class="grid grid-cols-2 gap-2">
            <input type="text" [ngModel]="item.author" (ngModelChange)="set($index, { author: $event })" placeholder="Author name"
                   class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none" />
            <input type="text" [ngModel]="item.role" (ngModelChange)="set($index, { role: $event })" placeholder="Role, Company"
                   class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none" />
          </div>
          <app-image-upload-field label="Avatar (optional)" kind="avatar" [url]="item.avatarUrl" (urlChange)="set($index, { avatarUrl: $event })" />
        </div>
      }
      <button type="button"
              class="w-full text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 py-2 border border-dashed border-slate-300 dark:border-slate-600 hover:border-primary-400 rounded-xl transition-colors"
              (click)="add()">+ Add testimonial</button>
    </div>
  `,
})
export class TestimonialsFormComponent {
  readonly section = input.required<PortfolioSection<TestimonialsConfig>>();
  private store = inject(PortfolioStoreService);

  private update(patch: Partial<TestimonialsConfig>): void {
    this.store.updateSectionConfig<TestimonialsConfig>(this.section().id, patch);
  }

  add(): void {
    const blank: TestimonialItem = { quote: '', author: '', role: '' };
    this.update({ items: [...this.section().config.items, blank] });
  }

  remove(i: number): void {
    this.update({ items: this.section().config.items.filter((_, idx) => idx !== i) });
  }

  set(i: number, patch: Partial<TestimonialItem>): void {
    const items = [...this.section().config.items];
    items[i] = { ...items[i], ...patch };
    this.update({ items });
  }
}
