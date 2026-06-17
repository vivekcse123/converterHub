import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ResumeData } from '../models/resume.model';
import { buildResumeDocDefinition } from './pdf-section-builders';

export function buildExecutiveDoc(resume: ResumeData): TDocumentDefinitions {
  return buildResumeDocDefinition(resume, {
    accentColor: '#c9a84c',
    headingColor: '#1e3a5f',
    nameColor: '#1e3a5f',
    mutedColor: '#6b7280',
    textColor: '#1e293b',
  });
}
