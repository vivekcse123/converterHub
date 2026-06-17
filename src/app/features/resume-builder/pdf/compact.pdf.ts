import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ResumeData } from '../models/resume.model';
import { buildResumeDocDefinition } from './pdf-section-builders';

export function buildCompactDoc(resume: ResumeData): TDocumentDefinitions {
  return buildResumeDocDefinition(resume, {
    accentColor: '#1d4ed8',
    headingColor: '#1d4ed8',
    nameColor: '#1e3a5f',
    mutedColor: '#6b7280',
    textColor: '#1e293b',
  });
}
