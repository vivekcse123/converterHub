import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../../models/resume.model';
import {
  buildContactParts,
  formatDateRange,
  formatMonthYear,
  getCustomSection,
  getSectionKind,
  getVisibleSections,
} from '../shared/template-helpers';
import { RichTextComponent } from '../shared/rich-text.component';

@Component({
  selector: 'app-sidebar-accent-template',
  standalone: true,
  imports: [CommonModule, RichTextComponent],
  templateUrl: './sidebar-accent-template.component.html',
  styleUrls: ['../shared/print.css', './sidebar-accent-template.component.css'],
})
export class SidebarAccentTemplateComponent {
  readonly resume = input.required<ResumeData>();
  readonly contactParts = computed(() => buildContactParts(this.resume().personal));
  readonly visibleSections = computed(() => getVisibleSections(this.resume()));
  readonly initials = computed(() => {
    const name = this.resume().personal.fullName || 'U';
    return name.split(' ').slice(0, 2).map(w => w[0]).join('');
  });
  sectionKind = getSectionKind;
  customSection = (section: string) => getCustomSection(this.resume(), section as any);
  dateRange = formatDateRange;
  monthYear = formatMonthYear;
}
