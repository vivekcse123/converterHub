import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tool } from '../../../core/models/tool.model';

@Component({
  selector: 'app-tool-card',
  standalone: true,
  imports: [RouterLink],
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
      <span class="inline-block mb-2 badge bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 w-fit">
        {{ tool.badge }}
      </span>
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
        <svg class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </div>

    </a>
  `,
})
export class ToolCardComponent {
  @Input({ required: true }) tool!: Tool;
}
