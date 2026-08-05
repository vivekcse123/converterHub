import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../../models/resume.model';
import { buildContactParts, formatDateRange, formatMonthYear, getCustomSection, getSectionKind, getVisibleSections } from '../shared/template-helpers';
import { RichTextComponent } from '../shared/rich-text.component';

@Component({
  selector: 'app-data-scientist-metrics-template',
  standalone: true,
  imports: [CommonModule, RichTextComponent],
  templateUrl: './data-scientist-metrics-template.component.html',
  styleUrls: ['../shared/print.css', './data-scientist-metrics-template.component.css'],
})
export class DataScientistMetricsTemplateComponent {
  readonly resume = input.required<ResumeData>();
  readonly contactParts = computed(() => buildContactParts(this.resume().personal));
  readonly visibleSections = computed(() => getVisibleSections(this.resume()));

  /** Stat row under the header — a quick-scan summary of experience depth. */
  readonly stats = computed(() => [
    { label: 'Roles', value: this.resume().experience.length },
    { label: 'Projects', value: this.resume().projects.length },
    { label: 'Certifications', value: this.resume().certifications.length },
  ]);

  sectionKind = getSectionKind;
  customSection = (section: string) => getCustomSection(this.resume(), section as any);
  dateRange = formatDateRange;
  monthYear = formatMonthYear;
}
