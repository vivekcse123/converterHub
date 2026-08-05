import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../../models/resume.model';
import { buildContactParts, formatDateRange, formatMonthYear, getCustomSection, getSectionKind, getVisibleSections } from '../shared/template-helpers';
import { RichTextComponent } from '../shared/rich-text.component';

@Component({
  selector: 'app-intern-launchpad-template',
  standalone: true,
  imports: [CommonModule, RichTextComponent],
  templateUrl: './intern-launchpad-template.component.html',
  styleUrls: ['../shared/print.css', './intern-launchpad-template.component.css'],
})
export class InternLaunchpadTemplateComponent {
  readonly resume = input.required<ResumeData>();
  readonly contactParts = computed(() => buildContactParts(this.resume().personal));
  readonly visibleSections = computed(() => getVisibleSections(this.resume()));
  sectionKind = getSectionKind;
  customSection = (section: string) => getCustomSection(this.resume(), section as any);
  dateRange = formatDateRange;
  monthYear = formatMonthYear;
}
