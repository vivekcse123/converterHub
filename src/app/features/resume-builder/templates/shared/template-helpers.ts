import { BuiltInSectionId, CustomSection, ResumeData, SectionRef } from '../../models/resume.model';

/** Returns the resume's sections in display order, skipping hidden ones. */
export function getVisibleSections(resume: ResumeData): SectionRef[] {
  return resume.sectionOrder.filter(s => resume.sectionVisibility[s] !== false);
}

/** Discriminates a section reference into either 'custom' or its built-in id. */
export function getSectionKind(section: SectionRef): 'custom' | BuiltInSectionId {
  return section.startsWith('custom:') ? 'custom' : (section as BuiltInSectionId);
}

/** Resolves the CustomSection object referenced by a `custom:<id>` SectionRef. */
export function getCustomSection(resume: ResumeData, section: SectionRef): CustomSection | undefined {
  if (!section.startsWith('custom:')) return undefined;
  const id = section.slice('custom:'.length);
  return resume.customSections.find(s => s.id === id);
}

/** Formats a `YYYY-MM` (or empty) date string as "Mon YYYY". */
export function formatMonthYear(value: string): string {
  if (!value) return '';
  const [year, month] = value.split('-');
  if (!year) return value;
  if (!month) return year;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const idx = Number(month) - 1;
  return months[idx] ? `${months[idx]} ${year}` : value;
}

/** Formats a start/end date pair, e.g. "Jun 2022 – Present" or "Jul 2020 – May 2022". */
export function formatDateRange(start: string, end: string, current: boolean): string {
  const startLabel = formatMonthYear(start);
  if (!startLabel) return '';
  const endLabel = current ? 'Present' : formatMonthYear(end);
  return endLabel ? `${startLabel} – ${endLabel}` : startLabel;
}

/** Builds the contact line for the resume header, filtering out empty fields. */
export function buildContactParts(personal: {
  email: string; phone: string; location: string; linkedin: string; portfolio: string; github: string;
}): string[] {
  return [personal.email, personal.phone, personal.location, personal.linkedin, personal.portfolio, personal.github]
    .map(v => (v ?? '').trim())
    .filter(Boolean);
}
