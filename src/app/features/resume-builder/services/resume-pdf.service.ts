import { EnvironmentInjector, Injectable, PLATFORM_ID, createComponent, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DEFAULT_DESIGN, DesignSettings, ResumeData } from '../models/resume.model';
import { PREMIUM_TEMPLATE_IDS, getTemplateMeta } from '../data/resume-templates.data';
import { AuthService } from '../../../core/services/auth.service';

const FONT_FAMILIES: Record<DesignSettings['fontFamily'], string> = {
  inter:   "'Inter', Arial, Helvetica, sans-serif",
  roboto:  "'Roboto', Arial, Helvetica, sans-serif",
  georgia: "Georgia, 'Times New Roman', serif",
};

const SPACING_MAP: Record<DesignSettings['lineHeight'], string> = {
  compact:   '1.3',
  standard:  '1.5',
  spacious:  '1.75',
};

const BASE_PT = 10.5;

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'resume';
}

@Injectable({ providedIn: 'root' })
export class ResumePdfService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly envInjector = inject(EnvironmentInjector);
  private readonly auth = inject(AuthService);

  get premiumTemplateIds(): string[] { return PREMIUM_TEMPLATE_IDS; }

  isPremiumTemplate(templateId: string): boolean {
    return PREMIUM_TEMPLATE_IDS.includes(templateId as any);
  }

  /**
   * Downloads the resume as a pixel-perfect PDF by capturing the rendered
   * Angular template component with html2canvas and converting to PDF via jsPDF.
   */
  async download(resume: ResumeData): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const templateMeta = getTemplateMeta(resume.templateId);
    if (!templateMeta?.component) throw new Error('Template component not found');

    const d: DesignSettings = { ...DEFAULT_DESIGN, ...resume.design };
    const isPro = this.auth.isPro() || this.auth.hasPurchasedTemplate(resume.templateId);

    // Build CSS custom property string that mirrors what ResumePreviewComponent does
    const hex = (d.accentColor || '#1e293b').replace(/^#/, '').padEnd(6, '0');
    const rC = parseInt(hex.slice(0, 2), 16) || 0;
    const gC = parseInt(hex.slice(2, 4), 16) || 0;
    const bC = parseInt(hex.slice(4, 6), 16) || 0;
    const basePt = typeof d.baseFontPt === 'number' && d.baseFontPt > 0 ? d.baseFontPt : BASE_PT;
    const sizeScale = (basePt / BASE_PT).toFixed(4);

    const designStyle = [
      `--r-accent:${d.accentColor}`,
      `--r-accent-12:rgba(${rC},${gC},${bC},0.12)`,
      `--r-accent-25:rgba(${rC},${gC},${bC},0.25)`,
      `--r-font:${FONT_FAMILIES[d.fontFamily] ?? FONT_FAMILIES['inter']}`,
      `--r-size:${sizeScale}`,
      `--r-spacing:${SPACING_MAP[d.lineHeight ?? 'standard']}`,
    ].join(';');

    // Off-screen container — fixed position, off the left side of the viewport
    const wrapper = document.createElement('div');
    wrapper.setAttribute('style', [
      'position:fixed',
      'top:0',
      'left:-9999px',
      'width:794px',
      'background:#fff',
      'z-index:-9999',
      designStyle,
    ].join(';'));
    document.body.appendChild(wrapper);

    // Render the Angular template component into the container
    const ref = createComponent(templateMeta.component, {
      environmentInjector: this.envInjector,
      hostElement: wrapper,
    });
    ref.setInput('resume', resume);
    ref.changeDetectorRef.detectChanges();

    try {
      // Wait for fonts and images to load
      await document.fonts.ready;
      // Give async images (profile photo) time to render
      await new Promise<void>(r => setTimeout(r, 500));
      ref.changeDetectorRef.detectChanges();

      // Dynamically import html2canvas and jsPDF to keep initial bundle small
      const [html2canvasModule, jsPDFModule] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const html2canvas = html2canvasModule.default;
      const jsPDF = jsPDFModule.jsPDF;

      const canvas = await html2canvas(wrapper, {
        scale: 2,           // 2× for crisp text
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794,
        windowWidth: 794,
        scrollX: 0,
        scrollY: 0,
      });

      // Stamp watermark for free users (drawn on the canvas)
      if (!isPro) {
        const ctx = canvas.getContext('2d')!;
        ctx.save();
        ctx.font = 'bold 26px Arial, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.globalAlpha = 0.18;
        ctx.textAlign = 'center';
        const text = 'ApnaConverter.com  •  Upgrade to Pro';
        for (let y = 120; y < canvas.height; y += 220) {
          ctx.save();
          ctx.translate(canvas.width / 2, y);
          ctx.rotate(-Math.PI / 7);
          ctx.fillText(text, 0, 0);
          ctx.restore();
        }
        ctx.restore();
      }

      // Build A4 PDF with multi-page support
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();   // 210 mm
      const pageH = pdf.internal.pageSize.getHeight();  // 297 mm

      const imgData = canvas.toDataURL('image/jpeg', 0.93);
      const imgH = (canvas.height / canvas.width) * pageW;

      pdf.addImage(imgData, 'JPEG', 0, 0, pageW, imgH);

      let remaining = imgH - pageH;
      let page = 1;
      while (remaining > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, -(page * pageH), pageW, imgH);
        remaining -= pageH;
        page++;
      }

      const filename = `${slugify(resume.personal?.fullName || resume.name)}-resume.pdf`;
      pdf.save(filename);
    } finally {
      ref.destroy();
      document.body.removeChild(wrapper);
    }
  }
}
