import { BuiltInSectionId, CustomSection, ResumeData, SectionRef } from '../../models/resume.model';

/** Shared icon glyph per section kind — used by section-management UI (not by templates). */
export const SECTION_ICONS: Record<BuiltInSectionId | 'custom' | 'personal', string> = {
  personal: '👤',
  summary: '📝',
  experience: '💼',
  education: '🎓',
  projects: '🚀',
  skills: '🛠️',
  certifications: '📜',
  achievements: '🏆',
  languages: '🌐',
  interests: '✨',
  custom: '📌',
};

/** Short one-line description shown under each section card in the manage-sections panel. */
export const SECTION_DESCRIPTIONS: Record<BuiltInSectionId | 'custom' | 'personal', string> = {
  personal: 'Your name, position & contact',
  summary: 'Your professional story',
  experience: 'Jobs & work history',
  education: 'Degrees & institutions',
  projects: 'Showcase your best work',
  skills: 'Technical & soft skills',
  certifications: 'Licenses & credentials',
  achievements: 'Awards & recognitions',
  languages: 'Languages you know',
  interests: 'Hobbies & interests',
  custom: 'Your custom section',
};

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

/** Strips protocol + www from a URL so it fits inline on a resume. */
function shortUrl(url: string): string {
  return (url ?? '').replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
}

/** Builds the contact line for the resume header, filtering out empty fields. */
export function buildContactParts(personal: {
  email: string; phone: string; location: string; linkedin: string; portfolio: string; github: string;
}): string[] {
  return [
    personal.email,
    personal.phone,
    personal.location,
    shortUrl(personal.linkedin),
    shortUrl(personal.portfolio),
    shortUrl(personal.github),
  ].map(v => (v ?? '').trim()).filter(Boolean);
}
