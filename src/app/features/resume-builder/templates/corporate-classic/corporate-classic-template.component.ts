import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../../models/resume.model';
import {
  buildContactParts, formatDateRange, formatMonthYear,
  getCustomSection, getSectionKind, getVisibleSections,
} from '../shared/template-helpers';
import { RichTextComponent } from '../shared/rich-text.component';

@Component({
  selector: 'app-corporate-classic-template',
  standalone: true,
  imports: [CommonModule, RichTextComponent],
  templateUrl: './corporate-classic-template.component.html',
  styleUrls: ['../shared/print.css', './corporate-classic-template.component.css'],
})
export class CorporateClassicTemplateComponent {
  readonly resume = input.required<ResumeData>();

  readonly contactParts  = computed(() => buildContactParts(this.resume().personal));
  readonly visibleSections = computed(() => getVisibleSections(this.resume()));

  sectionKind   = getSectionKind;
  customSection = (s: string) => getCustomSection(this.resume(), s as any);
  dateRange     = formatDateRange;
  monthYear     = formatMonthYear;
}
