import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../../models/resume.model';
import { buildContactParts, formatDateRange, formatMonthYear, getCustomSection, getSectionKind, getVisibleSections } from '../shared/template-helpers';
import { RichTextComponent } from '../shared/rich-text.component';

const SIDEBAR_SECTIONS = ['skills', 'languages', 'certifications', 'interests'];

@Component({
  selector: 'app-compact-template',
  standalone: true,
  imports: [CommonModule, RichTextComponent],
  templateUrl: './compact-template.component.html',
  styleUrls: ['../shared/print.css', './compact-template.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompactTemplateComponent {
  readonly resume = input.required<ResumeData>();
  readonly contactParts = computed(() => buildContactParts(this.resume().personal));
  readonly visibleSections = computed(() => getVisibleSections(this.resume()));
  readonly mainSections = computed(() =>
    this.visibleSections().filter(s => !SIDEBAR_SECTIONS.includes(s as string))
  );
  isVisible(section: string): boolean {
    return this.resume().sectionVisibility[section] !== false;
  }
  sectionKind = getSectionKind;
  customSection = (section: string) => getCustomSection(this.resume(), section as any);
  dateRange = formatDateRange;
  monthYear = formatMonthYear;
}
