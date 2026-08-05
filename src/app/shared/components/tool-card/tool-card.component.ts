import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tool } from '../../../core/models/tool.model';
import { BadgeComponent } from '../badge/badge.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-tool-card',
  standalone: true,
  imports: [RouterLink, BadgeComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex' },
  template: `
    <a [routerLink]="tool.route"
      class="card-hover flex flex-col p-6 group animate-fade-in h-full">

      <!-- Icon gradient bubble -->
      <div [class]="'w-14 h-14 rounded-2xl bg-gradient-to-br ' + tool.color + ' flex items-center justify-center text-2xl mb-4 shadow-md group-hover:scale-110 transition-transform duration-200'">
        {{ tool.icon }}
      </div>

      <!-- Badge -->
      @if (tool.badge) {
      <app-badge variant="primary" class="mb-2 w-fit">{{ tool.badge }}</app-badge>
      }

      <h3 class="font-semibold text-slate-800 dark:text-white text-base mb-1.5 group-hover:text-primary-600 transition-colors">
        {{ tool.title }}
      </h3>

      <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
        {{ tool.description }}
      </p>

      <!-- Arrow -->
      <div class="mt-4 flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Use tool</span>
        <app-icon name="arrow-right" [size]="14" class="group-hover:translate-x-0.5 transition-transform inline-block" />
      </div>

    </a>
  `,
})
export class ToolCardComponent {
  @Input({ required: true }) tool!: Tool;
}
