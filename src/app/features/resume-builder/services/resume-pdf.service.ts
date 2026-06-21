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
  private readonly platformId  = inject(PLATFORM_ID);
  private readonly envInjector = inject(EnvironmentInjector);
  private readonly auth        = inject(AuthService);

  get premiumTemplateIds(): string[] { return PREMIUM_TEMPLATE_IDS; }

  isPremiumTemplate(templateId: string): boolean {
    return PREMIUM_TEMPLATE_IDS.includes(templateId as any);
  }

  /**
   * Downloads the resume as a pixel-perfect PDF.
   *
   * When `captureEl` (the #pageHost element from ResumePreviewComponent) is provided,
   * html2canvas captures that exact element — same CSS, same fonts, same template render
   * as what the user sees.  Falls back to an off-screen render when no element is passed.
   */
  async download(resume: ResumeData, captureEl?: HTMLElement): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const isPro = this.auth.isPro() || this.auth.hasPurchasedTemplate(resume.templateId);
    const filename = `${slugify(resume.personal?.fullName || resume.name)}-resume.pdf`;

    const [html2canvasModule, jsPDFModule] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);
    const html2canvas = html2canvasModule.default;
    const { jsPDF } = jsPDFModule;

    // Wait for all fonts to finish loading (Inter, Roboto, etc.)
    await document.fonts.ready;

    let canvas: HTMLCanvasElement;

    if (captureEl) {
      canvas = await this._capturePageHost(captureEl, html2canvas);
    } else {
      canvas = await this._renderOffScreen(resume, html2canvas);
    }

    // Stamp watermark for free users
    if (!isPro) {
      const ctx = canvas.getContext('2d')!;
      ctx.save();
      ctx.font = 'bold 28px Arial, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.globalAlpha = 0.18;
      ctx.textAlign = 'center';
      const text = 'ApnaConverter.com  •  Upgrade to Pro';
      for (let y = 140; y < canvas.height; y += 240) {
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
    // Image height in mm, proportional to the canvas aspect ratio
    const imgH = (canvas.height / canvas.width) * pageW;

    pdf.addImage(imgData, 'JPEG', 0, 0, pageW, imgH);

    // Only add more pages when there is a meaningful overflow (> 0.5 mm).
    // The 0.5 mm guard prevents floating-point rounding from creating a blank
    // second page when the content is almost exactly 1 A4 page tall.
    let remaining = imgH - pageH;
    let page = 1;
    while (remaining > 0.5) {
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, -(page * pageH), pageW, imgH);
      remaining -= pageH;
      page++;
    }

    pdf.save(filename);
  }

  /**
   * Captures the existing #pageHost element from ResumePreviewComponent.
   *
   * The pageHost sits inside .preview-zoom-wrap which has a CSS transform:scale(n).
   * We temporarily reset that transform to scale(1) so html2canvas captures at the
   * element's natural layout size (A4 width = 210mm ≈ 794px) rather than the
   * visually-scaled-down preview size.
   */
  private async _capturePageHost(
    pageHost: HTMLElement,
    html2canvas: (el: HTMLElement, opts: any) => Promise<HTMLCanvasElement>,
  ): Promise<HTMLCanvasElement> {
    const zoomWrap = pageHost.parentElement;   // .preview-zoom-wrap
    const origTransform = zoomWrap?.style.transform ?? '';

    // Reset parent zoom so pageHost renders at its natural A4 width
    if (zoomWrap) zoomWrap.style.transform = 'scale(1)';

    try {
      return await html2canvas(pageHost, {
        scale:           2,          // 2× pixel ratio for crisp text
        useCORS:         true,
        allowTaint:      true,
        backgroundColor: '#ffffff',
        logging:         false,
        // Use the element's natural layout dimensions — ignores any parent transform
        width:           pageHost.offsetWidth,
        height:          pageHost.scrollHeight,
        windowWidth:     pageHost.offsetWidth,
        scrollX:         0,
        scrollY:         0,
      });
    } finally {
      // Always restore the zoom transform
      if (zoomWrap) zoomWrap.style.transform = origTransform;
    }
  }

  /**
   * Fallback: render the template component in a hidden off-screen container
   * and capture it with html2canvas.  Used when no preview element is available.
   */
  private async _renderOffScreen(
    resume: ResumeData,
    html2canvas: (el: HTMLElement, opts: any) => Promise<HTMLCanvasElement>,
  ): Promise<HTMLCanvasElement> {
    const templateMeta = getTemplateMeta(resume.templateId);
    if (!templateMeta?.component) throw new Error('Template component not found');

    const d: DesignSettings = { ...DEFAULT_DESIGN, ...resume.design };
    const hex    = (d.accentColor || '#1e293b').replace(/^#/, '').padEnd(6, '0');
    const rC     = parseInt(hex.slice(0, 2), 16) || 0;
    const gC     = parseInt(hex.slice(2, 4), 16) || 0;
    const bC     = parseInt(hex.slice(4, 6), 16) || 0;
    const basePt = typeof d.baseFontPt === 'number' && d.baseFontPt > 0 ? d.baseFontPt : BASE_PT;

    const wrapper = document.createElement('div');
    wrapper.setAttribute('style', [
      'position:fixed',
      'top:0',
      'left:-9999px',
      'width:210mm',      // same as preview-page-host
      'background:#fff',
      'z-index:-9999',
      `--r-accent:${d.accentColor}`,
      `--r-accent-12:rgba(${rC},${gC},${bC},0.12)`,
      `--r-accent-25:rgba(${rC},${gC},${bC},0.25)`,
      `--r-font:${FONT_FAMILIES[d.fontFamily] ?? FONT_FAMILIES['inter']}`,
      `--r-size:${((basePt / BASE_PT)).toFixed(4)}`,
      `--r-spacing:${SPACING_MAP[d.lineHeight ?? 'standard']}`,
    ].join(';'));
    document.body.appendChild(wrapper);

    const ref = createComponent(templateMeta.component, {
      environmentInjector: this.envInjector,
      hostElement: wrapper,
    });
    ref.setInput('resume', resume);
    ref.changeDetectorRef.detectChanges();

    // Give async images time to render (profile photo, etc.)
    await new Promise<void>(r => setTimeout(r, 500));
    ref.changeDetectorRef.detectChanges();

    try {
      return await html2canvas(wrapper, {
        scale:           2,
        useCORS:         true,
        allowTaint:      true,
        backgroundColor: '#ffffff',
        logging:         false,
        width:           wrapper.offsetWidth,
        height:          wrapper.scrollHeight,
        windowWidth:     wrapper.offsetWidth,
        scrollX:         0,
        scrollY:         0,
      });
    } finally {
      ref.destroy();
      document.body.removeChild(wrapper);
    }
  }
}
