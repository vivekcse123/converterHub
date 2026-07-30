import { Component, input } from '@angular/core';
import { PortfolioSectionType } from '../../../models/portfolio.model';

@Component({
  selector: 'app-section-icon',
  standalone: true,
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="w-full h-full">
      @switch (type()) {
        @case ('hero') {
          <rect x="3" y="4" width="18" height="8" rx="1.5"/><path d="M7 16h10M7 19h6"/>
        }
        @case ('about') {
          <circle cx="12" cy="8" r="3.2"/><path d="M5 20c1.2-4 4-5.8 7-5.8s5.8 1.8 7 5.8"/>
        }
        @case ('skills') {
          <circle cx="12" cy="12" r="2.6"/>
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z"/>
        }
        @case ('experience') {
          <path d="M4 4h9l3 3h4v13H4z"/>
        }
        @case ('projects') {
          <rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/>
          <rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>
        }
        @case ('education') {
          <path d="M12 3l10 5-10 5L2 8z"/><path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5"/>
        }
        @case ('testimonials') {
          <path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.5 8.5 0 0 1-3.8-.9L3 20l1-5.3A8.4 8.4 0 1 1 21 11.5z"/>
        }
        @case ('contact') {
          <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>
        }
      }
    </svg>
  `,
})
export class SectionIconComponent {
  readonly type = input.required<PortfolioSectionType>();
}
