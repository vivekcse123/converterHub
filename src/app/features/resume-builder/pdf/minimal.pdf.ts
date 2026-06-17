import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ResumeData } from '../models/resume.model';
import { buildResumeDocDefinition } from './pdf-section-builders';

export function buildMinimalDoc(resume: ResumeData): TDocumentDefinitions {
  return buildResumeDocDefinition(resume, {
    accentColor: '#374151',
    headingColor: '#374151',
    nameColor: '#111827',
    mutedColor: '#9ca3af',
    textColor: '#374151',
  });
}
