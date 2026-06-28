import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData, SectionRef } from '../../models/resume.model';
import {
  buildContactParts, formatDateRange, formatMonthYear,
  getCustomSection, getSectionKind, getVisibleSections,
} from '../shared/template-helpers';
import { RichTextComponent } from '../shared/rich-text.component';

/** Sections that appear in the left (main) column. Everything else goes right. */
const MAIN_SECTIONS = new Set(['experience', 'projects', 'achievements', 'custom']);

@Component({
  selector: 'app-two-col-classic-template',
  standalone: true,
  imports: [CommonModule, RichTextComponent],
  templateUrl: './two-col-classic-template.component.html',
  styleUrls: ['../shared/print.css', './two-col-classic-template.component.css'],
})
export class TwoColClassicTemplateComponent {
  readonly resume = input.required<ResumeData>();

  readonly contactParts    = computed(() => buildContactParts(this.resume().personal));
  readonly visibleSections = computed(() => getVisibleSections(this.resume()));

  /** Sections routed to the left (experience-heavy) column. */
  readonly mainSections = computed<SectionRef[]>(() =>
    this.visibleSections().filter(s =>
      MAIN_SECTIONS.has(s.startsWith('custom:') ? 'custom' : s)
    )
  );

  /** Sections routed to the right (info/skills) column. */
  readonly sidebarSections = computed<SectionRef[]>(() =>
    this.visibleSections().filter(s =>
      !MAIN_SECTIONS.has(s.startsWith('custom:') ? 'custom' : s)
    )
  );

  sectionKind   = getSectionKind;
  customSection = (s: string) => getCustomSection(this.resume(), s as any);
  dateRange     = formatDateRange;
  monthYear     = formatMonthYear;
}
