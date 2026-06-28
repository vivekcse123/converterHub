import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../../models/resume.model';
import { buildContactParts, formatDateRange, formatMonthYear, getCustomSection, getSectionKind, getVisibleSections } from '../shared/template-helpers';
import { RichTextComponent } from '../shared/rich-text.component';

const SIDEBAR_SECTIONS = ['skills', 'languages', 'interests', 'certifications'];

@Component({
  selector: 'app-navy-gold-template',
  standalone: true,
  imports: [CommonModule, RichTextComponent],
  templateUrl: './navy-gold-template.component.html',
  styleUrls: ['../shared/print.css', './navy-gold-template.component.css'],
})
export class NavyGoldTemplateComponent {
  readonly resume = input.required<ResumeData>();
  readonly contactParts = computed(() => buildContactParts(this.resume().personal));
  readonly visibleSections = computed(() => getVisibleSections(this.resume()));
  readonly mainSections = computed(() =>
    this.visibleSections().filter(s => !SIDEBAR_SECTIONS.includes(s as string))
  );
  readonly sidebarSections = computed(() =>
    this.visibleSections().filter(s => SIDEBAR_SECTIONS.includes(s as string))
  );
  isVisible = (s: string) => this.resume().sectionVisibility[s] !== false;
  sectionKind = getSectionKind;
  customSection = (section: string) => getCustomSection(this.resume(), section as any);
  dateRange = formatDateRange;
  monthYear = formatMonthYear;
}
