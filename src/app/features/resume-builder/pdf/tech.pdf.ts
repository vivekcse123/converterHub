import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ResumeData } from '../models/resume.model';
import { buildResumeDocDefinition } from './pdf-section-builders';

export function buildTechDoc(resume: ResumeData): TDocumentDefinitions {
  return buildResumeDocDefinition(resume, {
    accentColor: '#10b981',
    headingColor: '#0f172a',
    nameColor: '#0f172a',
    mutedColor: '#6b7280',
    textColor: '#1e293b',
  });
}
