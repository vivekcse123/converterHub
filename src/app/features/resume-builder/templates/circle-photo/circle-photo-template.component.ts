import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../../models/resume.model';
import { buildContactParts, formatDateRange, formatMonthYear, getCustomSection, getSectionKind, getVisibleSections } from '../shared/template-helpers';
import { RichTextComponent } from '../shared/rich-text.component';

@Component({
  selector: 'app-circle-photo-template',
  standalone: true,
  imports: [CommonModule, RichTextComponent],
  templateUrl: './circle-photo-template.component.html',
  styleUrls: ['../shared/print.css', './circle-photo-template.component.css'],
})
export class CirclePhotoTemplateComponent {
  readonly resume = input.required<ResumeData>();
  readonly contactParts = computed(() => buildContactParts(this.resume().personal));
  readonly visibleSections = computed(() => getVisibleSections(this.resume()));
  readonly initials = computed(() => {
    const name = this.resume().personal.fullName || 'YN';
    return name.split(' ').map(n => n[0] ?? '').slice(0, 2).join('').toUpperCase();
  });
  sectionKind = getSectionKind;
  customSection = (section: string) => getCustomSection(this.resume(), section as any);
  dateRange = formatDateRange;
  monthYear = formatMonthYear;
}
