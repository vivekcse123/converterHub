import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../../models/resume.model';
import { buildContactParts, formatDateRange, formatMonthYear, getCustomSection, getSectionKind, getVisibleSections } from '../shared/template-helpers';
import { RichTextComponent } from '../shared/rich-text.component';

const LEFT_SECTIONS  = ['summary', 'education', 'skills', 'languages', 'interests', 'certifications'];
const RIGHT_SECTIONS = ['experience', 'projects', 'achievements'];

@Component({
  selector: 'app-two-col-balanced-template',
  standalone: true,
  imports: [CommonModule, RichTextComponent],
  templateUrl: './two-col-balanced-template.component.html',
  styleUrls: ['../shared/print.css', './two-col-balanced-template.component.css'],
})
export class TwoColBalancedTemplateComponent {
  readonly resume = input.required<ResumeData>();
  readonly contactParts = computed(() => buildContactParts(this.resume().personal));
  readonly visibleSections = computed(() => getVisibleSections(this.resume()));
  readonly leftSections = computed(() =>
    this.visibleSections().filter(s => LEFT_SECTIONS.includes(s as string))
  );
  readonly rightSections = computed(() =>
    this.visibleSections().filter(s => !LEFT_SECTIONS.includes(s as string) || RIGHT_SECTIONS.includes(s as string))
      .filter(s => !LEFT_SECTIONS.includes(s as string))
  );
  sectionKind = getSectionKind;
  customSection = (section: string) => getCustomSection(this.resume(), section as any);
  dateRange = formatDateRange;
  monthYear = formatMonthYear;
}
