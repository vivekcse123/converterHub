import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ResumeData } from '../models/resume.model';
import { buildResumeDocDefinition } from './pdf-section-builders';

/** Classic black-on-white layout — maximum ATS compatibility. */
export function buildAtsProfessionalDoc(resume: ResumeData): TDocumentDefinitions {
  return buildResumeDocDefinition(resume, {
    accentColor: '#1f2937',
    headingColor: '#111827',
    nameColor: '#111827',
    mutedColor: '#4b5563',
    textColor: '#1f2937',
  });
}
