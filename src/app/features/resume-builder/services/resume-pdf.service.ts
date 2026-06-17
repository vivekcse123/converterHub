import { Injectable } from '@angular/core';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ResumeData, TemplateId } from '../models/resume.model';
import { buildAtsProfessionalDoc } from '../pdf/ats-professional.pdf';
import { buildModernProfessionalDoc } from '../pdf/modern-professional.pdf';
import { buildFresherDoc } from '../pdf/fresher.pdf';
import { buildExecutiveDoc } from '../pdf/executive.pdf';
import { buildCreativeDoc } from '../pdf/creative.pdf';
import { buildMinimalDoc } from '../pdf/minimal.pdf';
import { buildTechDoc } from '../pdf/tech.pdf';
import { buildElegantDoc } from '../pdf/elegant.pdf';
import { buildCompactDoc } from '../pdf/compact.pdf';
import { buildBoldDoc } from '../pdf/bold.pdf';

const DOC_BUILDERS: Record<TemplateId, (resume: ResumeData) => TDocumentDefinitions> = {
  'ats-professional': buildAtsProfessionalDoc,
  'modern-professional': buildModernProfessionalDoc,
  fresher: buildFresherDoc,
  executive: buildExecutiveDoc,
  creative: buildCreativeDoc,
  minimal: buildMinimalDoc,
  tech: buildTechDoc,
  elegant: buildElegantDoc,
  compact: buildCompactDoc,
  bold: buildBoldDoc,
};

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'resume';
}

@Injectable({ providedIn: 'root' })
export class ResumePdfService {
  /** Generates and downloads the resume as a client-side PDF (lazy-loads pdfmake). */
  async download(resume: ResumeData): Promise<void> {
    const [pdfMakeModule, vfsFontsModule] = await Promise.all([
      import('pdfmake/build/pdfmake'),
      import('pdfmake/build/vfs_fonts'),
    ]);

    const pdfMake = (pdfMakeModule as any).default ?? pdfMakeModule;
    const vfs = (vfsFontsModule as any).default ?? vfsFontsModule;
    pdfMake.addVirtualFileSystem(vfs);

    const buildDoc = DOC_BUILDERS[resume.templateId] ?? buildAtsProfessionalDoc;
    const docDefinition = buildDoc(resume);

    const filename = `${slugify(resume.personal.fullName || resume.name)}-resume.pdf`;
    pdfMake.createPdf(docDefinition).download(filename);
  }
}
