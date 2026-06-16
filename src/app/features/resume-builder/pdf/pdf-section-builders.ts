import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import {
  CertificationItem,
  CustomSection,
  EducationItem,
  ExperienceItem,
  LanguageItem,
  ProjectItem,
  ResumeData,
  SkillGroup,
} from '../models/resume.model';
import {
  buildContactParts,
  formatDateRange,
  formatMonthYear,
  getCustomSection,
  getSectionKind,
  getVisibleSections,
} from '../templates/shared/template-helpers';
import { parseRichText } from '../templates/shared/rich-text';

/** Visual theme applied to the shared PDF layout for a given resume template. */
export interface PdfTheme {
  /** Color used for the name, accent lines, and section heading underlines. */
  accentColor: string;
  /** Color used for section heading text (often the same as accentColor). */
  headingColor: string;
  /** Color used for the candidate's name. */
  nameColor: string;
  /** Color used for muted/secondary text (dates, contact line, subtitles). */
  mutedColor: string;
  /** Main body text color. */
  textColor: string;
}

const PAGE_WIDTH_PT = 595.28; // A4 width in points
const PAGE_MARGIN_PT = 40;
const CONTENT_WIDTH_PT = PAGE_WIDTH_PT - PAGE_MARGIN_PT * 2;

function nonEmpty(values: Array<string | undefined | null>): string[] {
  return values.map(v => (v ?? '').trim()).filter(Boolean);
}

/** Converts `**bold**` markup into pdfmake inline text runs, or a plain string when there's none. */
function richInlines(text: string): string | Content[] {
  const runs = parseRichText(text);
  if (runs.length === 1 && !runs[0].bold) return runs[0].text;
  return runs.map(r => (r.bold ? { text: r.text, bold: true } : { text: r.text }));
}

/** Builds a text block (summary/description) preserving `**bold**` runs, with the given style/margin. */
function richTextBlock(text: string, style: string, margin?: [number, number, number, number]): Content {
  return margin
    ? { text: richInlines(text.trim()), style, margin }
    : { text: richInlines(text.trim()), style };
}

/** Builds a `ul` list item preserving `**bold**` runs, with the given style. */
function richListItem(text: string, style: string): Content {
  return { text: richInlines(text.trim()), style } as Content;
}

function bulletList(bullets: string[]): Content[] {
  const items = nonEmpty(bullets).map(b => richListItem(b, 'bulletText'));
  if (!items.length) return [];
  return [{ ul: items, margin: [0, 2, 0, 4] }];
}

function sectionHeading(title: string, theme: PdfTheme): Content {
  return {
    stack: [
      { text: title.toUpperCase(), style: 'sectionHeading', color: theme.headingColor },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: CONTENT_WIDTH_PT, y2: 0, lineWidth: 1, lineColor: theme.accentColor }],
        margin: [0, 2, 0, 6],
      },
    ],
    margin: [0, 12, 0, 0],
  };
}

function buildHeader(resume: ResumeData, theme: PdfTheme): Content {
  const { personal } = resume;
  const contactParts = buildContactParts(personal);

  const stack: Content[] = [
    { text: personal.fullName || 'Your Name', style: 'name', color: theme.nameColor },
  ];

  if (personal.jobTitle.trim()) {
    stack.push({ text: personal.jobTitle, style: 'jobTitle', color: theme.accentColor });
  }

  if (contactParts.length) {
    stack.push({ text: contactParts.join('   |   '), style: 'contact', color: theme.mutedColor });
  }

  return { stack, margin: [0, 0, 0, 4] };
}

function buildSummary(resume: ResumeData, theme: PdfTheme): Content[] {
  if (!resume.summary.trim()) return [];
  return [sectionHeading('Professional Summary', theme), richTextBlock(resume.summary, 'bodyText')];
}

function buildExperienceEntry(exp: ExperienceItem): Content {
  const subtitle = nonEmpty([exp.company, exp.location]).join(' · ');
  return {
    stack: [
      {
        columns: [
          { text: exp.role || 'Role', style: 'entryTitle', width: '*' },
          { text: formatDateRange(exp.startDate, exp.endDate, exp.current), style: 'dateText', width: 'auto', alignment: 'right' },
        ],
      },
      ...(subtitle ? [{ text: subtitle, style: 'entrySubtitle' } as Content] : []),
      ...bulletList(exp.bullets),
    ],
    margin: [0, 0, 0, 6],
  };
}

function buildExperience(resume: ResumeData, theme: PdfTheme): Content[] {
  if (!resume.experience.length) return [];
  return [sectionHeading('Experience', theme), ...resume.experience.map(buildExperienceEntry)];
}

function buildEducationEntry(edu: EducationItem): Content {
  const degreeLine = nonEmpty([edu.degree, edu.field]).join(', ');
  const subtitle = nonEmpty([edu.institution, edu.gpa ? `GPA: ${edu.gpa}` : '']).join(' · ');
  return {
    stack: [
      {
        columns: [
          { text: degreeLine || edu.institution || 'Degree', style: 'entryTitle', width: '*' },
          { text: formatDateRange(edu.startDate, edu.endDate, edu.current), style: 'dateText', width: 'auto', alignment: 'right' },
        ],
      },
      ...(subtitle ? [{ text: subtitle, style: 'entrySubtitle' } as Content] : []),
      ...(edu.description.trim() ? [richTextBlock(edu.description, 'bodyText', [0, 2, 0, 0])] : []),
    ],
    margin: [0, 0, 0, 6],
  };
}

function buildEducation(resume: ResumeData, theme: PdfTheme): Content[] {
  if (!resume.education.length) return [];
  return [sectionHeading('Education', theme), ...resume.education.map(buildEducationEntry)];
}

function buildProjectEntry(proj: ProjectItem): Content {
  const titleParts = nonEmpty([proj.name]).join('');
  return {
    stack: [
      {
        columns: [
          { text: titleParts || 'Project', style: 'entryTitle', width: '*' },
          ...(proj.link.trim() ? [{ text: proj.link.trim(), style: 'dateText', width: 'auto', alignment: 'right' } as Content] : []),
        ],
      },
      ...(proj.techStack.trim() ? [{ text: proj.techStack.trim(), style: 'entrySubtitle' } as Content] : []),
      ...bulletList(proj.bullets),
    ],
    margin: [0, 0, 0, 6],
  };
}

function buildProjects(resume: ResumeData, theme: PdfTheme): Content[] {
  if (!resume.projects.length) return [];
  return [sectionHeading('Projects', theme), ...resume.projects.map(buildProjectEntry)];
}

function buildSkillGroup(group: SkillGroup): Content | null {
  if (!group.items.length) return null;
  if (group.category.trim()) {
    return {
      text: [
        { text: `${group.category.trim()}: `, bold: true },
        { text: group.items.join(', ') },
      ],
      style: 'bodyText',
      margin: [0, 0, 0, 2],
    };
  }
  return { text: group.items.join(', '), style: 'bodyText', margin: [0, 0, 0, 2] };
}

function buildSkills(resume: ResumeData, theme: PdfTheme): Content[] {
  const groups = resume.skills.map(buildSkillGroup).filter((c): c is Content => c !== null);
  if (!groups.length) return [];
  return [sectionHeading('Skills', theme), ...groups];
}

function buildCertificationEntry(cert: CertificationItem): Content {
  const subtitle = nonEmpty([cert.issuer, cert.link]).join(' · ');
  return {
    columns: [
      {
        width: '*',
        stack: [
          { text: cert.name || 'Certification', style: 'entryTitle' },
          ...(subtitle ? [{ text: subtitle, style: 'entrySubtitle' } as Content] : []),
        ],
      },
      { text: formatMonthYear(cert.date), style: 'dateText', width: 'auto', alignment: 'right' },
    ],
    margin: [0, 0, 0, 4],
  };
}

function buildCertifications(resume: ResumeData, theme: PdfTheme): Content[] {
  const certs = resume.certifications.filter(c => c.name.trim());
  if (!certs.length) return [];
  return [sectionHeading('Certifications', theme), ...certs.map(buildCertificationEntry)];
}

function buildAchievements(resume: ResumeData, theme: PdfTheme): Content[] {
  const items = nonEmpty(resume.achievements);
  if (!items.length) return [];
  return [sectionHeading('Achievements', theme), { ul: items.map(i => richListItem(i, 'bulletText')) }];
}

function buildLanguageEntry(lang: LanguageItem): string {
  return lang.proficiency ? `${lang.name} (${lang.proficiency})` : lang.name;
}

function buildLanguages(resume: ResumeData, theme: PdfTheme): Content[] {
  const items = resume.languages.filter(l => l.name.trim()).map(buildLanguageEntry);
  if (!items.length) return [];
  return [sectionHeading('Languages', theme), { text: items.join('   |   '), style: 'bodyText' }];
}

function buildInterests(resume: ResumeData, theme: PdfTheme): Content[] {
  const items = nonEmpty(resume.interests);
  if (!items.length) return [];
  return [sectionHeading('Interests', theme), { text: items.join(', '), style: 'bodyText' }];
}

function buildCustomSectionContent(section: CustomSection, theme: PdfTheme): Content[] {
  if (!section.entries.length) return [];
  const entries: Content[] = section.entries.map(entry => {
    const subtitle = nonEmpty([entry.subheading]).join('');
    return {
      stack: [
        {
          columns: [
            { text: entry.heading || 'Entry', style: 'entryTitle', width: '*' },
            ...(entry.date.trim() ? [{ text: entry.date.trim(), style: 'dateText', width: 'auto', alignment: 'right' } as Content] : []),
          ],
        },
        ...(subtitle ? [{ text: subtitle, style: 'entrySubtitle' } as Content] : []),
        ...(entry.description.trim() ? [richTextBlock(entry.description, 'bodyText', [0, 2, 0, 0])] : []),
      ],
      margin: [0, 0, 0, 6],
    };
  });
  return [sectionHeading(section.title || 'Custom Section', theme), ...entries];
}

/** Builds the full pdfmake document definition for a resume using the given theme. */
export function buildResumeDocDefinition(resume: ResumeData, theme: PdfTheme): TDocumentDefinitions {
  const content: Content[] = [buildHeader(resume, theme)];

  for (const section of getVisibleSections(resume)) {
    const kind = getSectionKind(section);
    switch (kind) {
      case 'summary':
        content.push(...buildSummary(resume, theme));
        break;
      case 'experience':
        content.push(...buildExperience(resume, theme));
        break;
      case 'education':
        content.push(...buildEducation(resume, theme));
        break;
      case 'projects':
        content.push(...buildProjects(resume, theme));
        break;
      case 'skills':
        content.push(...buildSkills(resume, theme));
        break;
      case 'certifications':
        content.push(...buildCertifications(resume, theme));
        break;
      case 'achievements':
        content.push(...buildAchievements(resume, theme));
        break;
      case 'languages':
        content.push(...buildLanguages(resume, theme));
        break;
      case 'interests':
        content.push(...buildInterests(resume, theme));
        break;
      case 'custom': {
        const custom = getCustomSection(resume, section);
        if (custom) content.push(...buildCustomSectionContent(custom, theme));
        break;
      }
    }
  }

  const styles: StyleDictionary = {
    name: { fontSize: 20, bold: true },
    jobTitle: { fontSize: 12, margin: [0, 2, 0, 2] },
    contact: { fontSize: 9, margin: [0, 2, 0, 0] },
    sectionHeading: { fontSize: 11, bold: true },
    entryTitle: { fontSize: 10.5, bold: true, color: theme.textColor },
    entrySubtitle: { fontSize: 9.5, italics: true, color: theme.mutedColor },
    dateText: { fontSize: 9, color: theme.mutedColor },
    bulletText: { fontSize: 9.5, color: theme.textColor },
    bodyText: { fontSize: 9.5, color: theme.textColor },
  };

  return {
    pageSize: 'A4',
    pageMargins: [PAGE_MARGIN_PT, PAGE_MARGIN_PT, PAGE_MARGIN_PT, PAGE_MARGIN_PT],
    content,
    styles,
    defaultStyle: {
      font: 'Roboto',
      fontSize: 9.5,
      color: theme.textColor,
      lineHeight: 1.15,
    },
    info: {
      title: `${resume.personal.fullName || 'Resume'} - Resume`,
      author: resume.personal.fullName || undefined,
    },
  };
}
