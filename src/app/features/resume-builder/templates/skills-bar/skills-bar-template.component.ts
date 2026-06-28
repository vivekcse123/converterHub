import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../../models/resume.model';
import { buildContactParts, formatDateRange, formatMonthYear, getCustomSection, getSectionKind, getVisibleSections } from '../shared/template-helpers';
import { RichTextComponent } from '../shared/rich-text.component';

const SIDEBAR_SECTIONS = ['skills', 'languages', 'certifications', 'interests'];

@Component({
  selector: 'app-skills-bar-template',
  standalone: true,
  imports: [CommonModule, RichTextComponent],
  templateUrl: './skills-bar-template.component.html',
  styleUrls: ['../shared/print.css', './skills-bar-template.component.css'],
})
export class SkillsBarTemplateComponent {
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
  skillWidth(index: number): number { return Math.max(60, 95 - index * 5); }
}
