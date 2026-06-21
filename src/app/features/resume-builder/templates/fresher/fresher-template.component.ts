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

const SECTION_ICONS: Record<string, string> = {
  summary: '👤',
  experience: '💼',
  education: '🎓',
  projects: '🚀',
  skills: '🛠️',
  certifications: '📜',
  achievements: '🏆',
  languages: '🌐',
  interests: '✨',
  custom: '📌',
};

@Component({
  selector: 'app-fresher-template',
  standalone: true,
  imports: [CommonModule, RichTextComponent],
  templateUrl: './fresher-template.component.html',
  styleUrls: ['../shared/print.css', './fresher-template.component.css'],
})
export class FresherTemplateComponent {
  readonly resume = input.required<ResumeData>();

  readonly contactParts = computed(() => buildContactParts(this.resume().personal));
  readonly visibleSections = computed(() => getVisibleSections(this.resume()));

  sectionKind = getSectionKind;
  customSection = (section: string) => getCustomSection(this.resume(), section as any);
  dateRange = formatDateRange;
  monthYear = formatMonthYear;

  sectionIcon(section: string): string {
    const kind = this.sectionKind(section as any);
    return SECTION_ICONS[kind] ?? '📌';
  }
}
