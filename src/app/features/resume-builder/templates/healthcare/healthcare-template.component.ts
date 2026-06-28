import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../../models/resume.model';
import {
  buildContactParts, formatDateRange, formatMonthYear,
  getCustomSection, getSectionKind, getVisibleSections,
} from '../shared/template-helpers';
import { RichTextComponent } from '../shared/rich-text.component';

@Component({
  selector: 'app-healthcare-template',
  standalone: true,
  imports: [CommonModule, RichTextComponent],
  templateUrl: './healthcare-template.component.html',
  styleUrls: ['../shared/print.css', './healthcare-template.component.css'],
})
export class HealthcareTemplateComponent {
  readonly resume = input.required<ResumeData>();

  readonly contactParts    = computed(() => buildContactParts(this.resume().personal));
  readonly visibleSections = computed(() => getVisibleSections(this.resume()));

  sectionKind   = getSectionKind;
  customSection = (s: string) => getCustomSection(this.resume(), s as any);
  dateRange     = formatDateRange;
  monthYear     = formatMonthYear;
}
