import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../../models/resume.model';
import {
  buildContactParts, formatDateRange, formatMonthYear,
  getCustomSection, getSectionKind, getVisibleSections,
} from '../shared/template-helpers';
import { RichTextComponent } from '../shared/rich-text.component';

@Component({
  selector: 'app-modern-clean-template',
  standalone: true,
  imports: [CommonModule, RichTextComponent],
  templateUrl: './modern-clean-template.component.html',
  styleUrls: ['../shared/print.css', './modern-clean-template.component.css'],
})
export class ModernCleanTemplateComponent {
  readonly resume = input.required<ResumeData>();

  readonly contactParts    = computed(() => buildContactParts(this.resume().personal));
  readonly visibleSections = computed(() => getVisibleSections(this.resume()));

  sectionKind   = getSectionKind;
  customSection = (s: string) => getCustomSection(this.resume(), s as any);
  dateRange     = formatDateRange;
  monthYear     = formatMonthYear;
}
