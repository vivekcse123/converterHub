import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ResumeData } from '../models/resume.model';
import { buildResumeDocDefinition } from './pdf-section-builders';

/** Blue-accented layout with colored name and section headings. */
export function buildModernProfessionalDoc(resume: ResumeData): TDocumentDefinitions {
  return buildResumeDocDefinition(resume, {
    accentColor: '#2563eb',
    headingColor: '#1d4ed8',
    nameColor: '#1d4ed8',
    mutedColor: '#64748b',
    textColor: '#1e293b',
  });
}
