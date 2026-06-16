import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ResumeData } from '../models/resume.model';
import { buildResumeDocDefinition } from './pdf-section-builders';

/** Emerald-accented layout suited for entry-level / fresher resumes. */
export function buildFresherDoc(resume: ResumeData): TDocumentDefinitions {
  return buildResumeDocDefinition(resume, {
    accentColor: '#0d9488',
    headingColor: '#0f766e',
    nameColor: '#0f766e',
    mutedColor: '#64748b',
    textColor: '#1e293b',
  });
}
