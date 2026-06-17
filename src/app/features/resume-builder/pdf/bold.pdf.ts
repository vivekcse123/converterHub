import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ResumeData } from '../models/resume.model';
import { buildResumeDocDefinition } from './pdf-section-builders';

export function buildBoldDoc(resume: ResumeData): TDocumentDefinitions {
  return buildResumeDocDefinition(resume, {
    accentColor: '#7c3aed',
    headingColor: '#5b21b6',
    nameColor: '#5b21b6',
    mutedColor: '#6b7280',
    textColor: '#1e293b',
  });
}
