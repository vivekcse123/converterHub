import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ResumeData } from '../models/resume.model';
import { buildResumeDocDefinition } from './pdf-section-builders';

export function buildCreativeDoc(resume: ResumeData): TDocumentDefinitions {
  return buildResumeDocDefinition(resume, {
    accentColor: '#7c3aed',
    headingColor: '#6d28d9',
    nameColor: '#6d28d9',
    mutedColor: '#7c3aed',
    textColor: '#1e293b',
  });
}
