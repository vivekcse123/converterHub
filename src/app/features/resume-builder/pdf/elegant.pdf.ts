import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ResumeData } from '../models/resume.model';
import { buildResumeDocDefinition } from './pdf-section-builders';

export function buildElegantDoc(resume: ResumeData): TDocumentDefinitions {
  return buildResumeDocDefinition(resume, {
    accentColor: '#9d174d',
    headingColor: '#9d174d',
    nameColor: '#9d174d',
    mutedColor: '#be185d',
    textColor: '#1e293b',
  });
}
