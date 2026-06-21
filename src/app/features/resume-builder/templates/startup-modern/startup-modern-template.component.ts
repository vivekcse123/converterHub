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
  selector: 'app-startup-modern-template',
  standalone: true,
  imports: [CommonModule, RichTextComponent],
  templateUrl: './startup-modern-template.component.html',
  styleUrls: ['../shared/print.css', './startup-modern-template.component.css'],
})
export class StartupModernTemplateComponent {
  readonly resume = input.required<ResumeData>();
  readonly contactParts = computed(() => buildContactParts(this.resume().personal));
  readonly visibleSections = computed(() => getVisibleSections(this.resume()));
  sectionKind = getSectionKind;
  customSection = (section: string) => getCustomSection(this.resume(), section as any);
  dateRange = formatDateRange;
  monthYear = formatMonthYear;
}
