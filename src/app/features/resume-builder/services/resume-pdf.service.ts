import { EnvironmentInjector, Injectable, PLATFORM_ID, createComponent, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ResumeData } from '../models/resume.model';
import { PREMIUM_TEMPLATE_IDS, getTemplateMeta } from '../data/resume-templates.data';
import { AuthService } from '../../../core/services/auth.service';
import { computeDesignVarsCss } from '../components/preview/resume-preview.component';
import { environment } from 'src/environments/environment';

const CSS_VAR_NAMES = ['--r-accent','--r-accent-12','--r-accent-25','--r-font','--r-size','--r-spacing','--r-page-width','--r-page-height'] as const;
const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900' +
  '&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400' +
  '&family=Georgia&display=swap';

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'resume';
}

export type DownloadMethod = 'direct' | 'print-dialog';

@Injectable({ providedIn: 'root' })
export class ResumePdfService {
  private readonly platformId  = inject(PLATFORM_ID);
  private readonly envInjector = inject(EnvironmentInjector);
  private readonly auth        = inject(AuthService);

  // Holds a pre-opened blank window for iOS Safari. window.open() must be called
  // synchronously within the user-gesture context — before any await — or iOS
  // blocks it as a popup. We open it at the start of download() then navigate it
  // to the blob URL once the PDF is ready. Null on non-iOS and on popup-block.
  private _iosWin: Window | null = null;

  // Set at the start of download() so _downloadViaBackend can include it in the
  // Puppeteer request. The server needs the templateId to decide whether to stamp
  // a watermark (only for paid templates the user hasn't unlocked).
  private _downloadTemplateId = '';
  private _downloadPaperSize: 'a4' | 'letter' = 'a4';

  get premiumTemplateIds(): string[] { return PREMIUM_TEMPLATE_IDS; }
  isPremiumTemplate(templateId: string): boolean {
    return PREMIUM_TEMPLATE_IDS.includes(templateId as any);
  }

  /**
   * Downloads the resume as a PDF via Puppeteer on the backend.
   * Always produces a direct blob download — no browser print dialog.
   * Throws with a user-readable message on any failure.
   */
  async download(resume: ResumeData, captureEl?: HTMLElement): Promise<DownloadMethod> {
    if (!isPlatformBrowser(this.platformId)) return 'print-dialog';

    const isPro    = this.auth.isPro() || this.auth.hasPurchasedTemplate(resume.templateId);
    const filename = slugify(resume.personal?.fullName || resume.name) + '-resume';

    // iOS Safari blocks window.open() and a.click() in async callbacks. Pre-open a
    // blank window NOW — synchronously, before any await — while the user gesture is
    // still active. _downloadViaBackend will navigate it to the blob URL once ready.
    this._iosWin = /iPhone|iPad|iPod/.test(navigator.userAgent)
      ? window.open('', '_blank')
      : null;

    // Capture templateId and paperSize for the Puppeteer request.
    this._downloadTemplateId = resume.templateId ?? '';
    this._downloadPaperSize  = (resume.design?.paperSize ?? 'a4') as 'a4' | 'letter';

    try {
      if (captureEl) {
        return await this._downloadWithFallback(captureEl, filename, isPro);
      }
      return await this._downloadOffScreen(resume, filename, isPro);
    } catch (err) {
      // Close the blank tab if PDF generation failed — don't leave it dangling.
      if (this._iosWin) { this._iosWin.close(); this._iosWin = null; }
      throw err;
    }
  }

  // ─── Word (.docx) export — structured data, not the rendered HTML ───────────

  /** Downloads a clean, ATS-friendly Word (.docx) copy of the resume, built
   *  server-side from the resume's structured data (see `resume-docx.service.js`)
   *  — a separate, simpler flow from the Puppeteer PDF path since it needs no
   *  live DOM capture, just the resume JSON. */
  async downloadDocx(resume: ResumeData): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    const token = this.auth.token();
    if (!token) throw new Error('Please log in to download your resume.');

    const filename = slugify(resume.personal?.fullName || resume.name) + '-resume';
    let resp: Response;
    try {
      resp = await fetch(`${environment.apiUrl}/resume/docx`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ resume, templateId: resume.templateId, resumeName: filename }),
        signal: AbortSignal.timeout(60_000),
      });
    } catch {
      throw new Error('Could not reach the server. Check your connection and try again.');
    }

    if (resp.status === 429) throw new Error('Too many downloads. Please wait a few minutes and try again.');
    if (!resp.ok) {
      let msg = `Server error (${resp.status}).`;
      try { const body = await resp.json(); if (body?.message) msg = body.message; } catch {}
      throw new Error(msg);
    }

    const blob = await resp.blob();
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename + '.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  // ─── Backend Puppeteer: direct PDF blob download (no print dialog) ──────────

  private async _downloadWithFallback(
    pageHost: HTMLElement,
    filename: string,
    _isPro: boolean,
  ): Promise<DownloadMethod> {
    await this._downloadViaBackend(pageHost, filename);
    return 'direct';
  }

  private async _downloadViaBackend(pageHost: HTMLElement, filename: string): Promise<void> {
    const token = this.auth.token();
    if (!token) throw new Error('Please log in to download your resume.');

    // Collect ALL CSS text here in the browser so Puppeteer never needs to
    // reach localhost:4200 URLs which are only reachable from this browser.
    const allStyles = await this._collectStyles();

    const cs = window.getComputedStyle(pageHost);
    const cssVarsCss = CSS_VAR_NAMES
      .map(v => `${v}: ${cs.getPropertyValue(v).trim()};`)
      .join(' ');

    const clone = pageHost.cloneNode(true) as HTMLElement;
    CSS_VAR_NAMES.forEach(v => clone.style.setProperty(v, cs.getPropertyValue(v)));
    (['position','top','left','right','bottom','z-index','opacity'] as const)
      .forEach(p => clone.style.removeProperty(p));
    clone.style.setProperty('box-shadow', 'none');

    let resp: Response;
    try {
      resp = await fetch(`${environment.apiUrl}/resume/render-html`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ html: clone.outerHTML, inlineStyles: allStyles, cssVarsCss, filename, templateId: this._downloadTemplateId, paperSize: this._downloadPaperSize }),
        signal: AbortSignal.timeout(90_000),
      });
    } catch {
      throw new Error('Could not reach the server. Check your connection and try again.');
    }

    if (resp.status === 429) {
      throw new Error('Too many downloads. Please wait a few minutes and try again.');
    }
    if (!resp.ok) {
      let msg = `Server error (${resp.status}).`;
      try { const body = await resp.json(); if (body?.message) msg = body.message; } catch {}
      throw new Error(msg);
    }

    const blob = await resp.blob();
    const url  = URL.createObjectURL(blob);

    if (this._iosWin) {
      // Navigate the pre-opened window to the PDF blob URL. iOS Safari displays it
      // in its PDF viewer; user saves via the Share sheet. User taps Back to return.
      this._iosWin.location.href = url;
      this._iosWin = null;
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } else {
      const a = document.createElement('a');
      a.href     = url;
      a.download = filename + '.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    }
  }

  // ─── Style collection ────────────────────────────────────────────────────────
  // External stylesheet URLs include content hashes (Angular build), so they are
  // stable for the entire session and safe to cache. Angular component <style>
  // tags are added lazily as components mount — they must be re-read on every
  // download so late-loaded template styles are never missing from the payload.
  private _externalCssCache: string | null = null;

  private async _collectStyles(): Promise<string> {
    // Always re-read inline <style> tags — Angular adds them lazily per component.
    const inlineParts: string[] = [];
    document.querySelectorAll('style').forEach(s => { inlineParts.push(s.textContent ?? ''); });

    // External stylesheets (Angular bundle + Tailwind) are content-hashed and
    // stable, so cache them after the first fetch (100–200 KB of CSS).
    if (this._externalCssCache === null) {
      const jobs = Array.from(document.styleSheets)
        .filter(sheet => !!sheet.href)
        .map(async sheet => {
          const href = sheet.href!;
          if (!href.startsWith(window.location.origin)) return '';
          try {
            const res = await fetch(href);
            return res.ok ? res.text() : '';
          } catch {
            try { return Array.from(sheet.cssRules ?? []).map(r => r.cssText).join('\n'); }
            catch { return ''; }
          }
        });
      this._externalCssCache = (await Promise.all(jobs)).join('\n');
    }

    return inlineParts.join('\n') + '\n' + this._externalCssCache;
  }

  private async _printViaIframe(pageHost: HTMLElement, filename: string, isPro: boolean): Promise<void> {
    const styles = await this._collectStyles();
    const cs     = window.getComputedStyle(pageHost);
    const clone  = pageHost.cloneNode(true) as HTMLElement;
    CSS_VAR_NAMES.forEach(v => clone.style.setProperty(v, cs.getPropertyValue(v)));
    (['position','top','left','right','bottom','z-index','opacity'] as const)
      .forEach(p => clone.style.removeProperty(p));
    clone.style.setProperty('box-shadow', 'none');

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;border:none;pointer-events:none;';
    document.body.appendChild(iframe);
    const iDoc = iframe.contentDocument!;

    // Watermark only for premium templates the user hasn't paid for.
    // Free templates are always delivered clean, matching server-side logic.
    const needsWatermark = !isPro && this.isPremiumTemplate(this._downloadTemplateId);
    const watermarkCss = needsWatermark ? `
      body::after {
        content: 'ApnaConverter.com  \\2022  Upgrade to Pro';
        position: fixed; top: 50%; left: 50%;
        transform: translate(-50%,-50%) rotate(-25deg);
        font-size: 18pt; font-family: Arial, sans-serif;
        color: rgba(0,0,0,0.07); white-space: nowrap;
        pointer-events: none; z-index: 99999;
      }` : '';

    iDoc.open();
    iDoc.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="${GOOGLE_FONTS_URL}" rel="stylesheet">
      <style>
        @page { size: A4 portrait; margin: 0; }
        html, body { margin: 0; padding: 0; width: 210mm; background: white; color-scheme: light; }
        *, *::before, *::after { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        .page-break-line, .page-break-label { display: none !important; }
        .preview-page-host, .shadow-card { box-shadow: none !important; }
        ${styles}
        ${watermarkCss}
      </style></head><body></body></html>`);
    iDoc.close();
    iDoc.body.appendChild(clone);

    const origTitle = document.title;
    document.title  = filename;
    try { await (iDoc as Document & { fonts?: FontFaceSet }).fonts?.ready; } catch {}
    await new Promise<void>(r => setTimeout(r, 500));

    await new Promise<void>(resolve => {
      let settled = false;
      const done = () => {
        if (settled) return; settled = true;
        document.title = origTitle;
        try { document.body.removeChild(iframe); } catch {}
        resolve();
      };
      iframe.contentWindow!.addEventListener('afterprint', done, { once: true });
      const safety = setTimeout(done, 5 * 60 * 1000);
      iframe.contentWindow!.addEventListener('afterprint', () => clearTimeout(safety), { once: true });
      setTimeout(() => iframe.contentWindow!.print(), 250);
    });
  }

  // ─── Off-screen render (when no live captureEl is provided) ─────────────────

  private async _downloadOffScreen(resume: ResumeData, filename: string, isPro: boolean): Promise<DownloadMethod> {
    const templateMeta = getTemplateMeta(resume.templateId);
    if (!templateMeta?.component) throw new Error('Template component not found');

    // Same token computation the live preview uses (`computeDesignVarsCss`) — sharing
    // it here is what keeps this off-screen render path from drifting out of sync
    // with the preview, which is exactly how the paper-size mismatch bug happened.
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:fixed;top:0;left:-9999px;background:#fff;z-index:2147483647;'
      + computeDesignVarsCss(resume.design);
    wrapper.style.setProperty('width', `var(--r-page-width, 210mm)`);
    document.body.appendChild(wrapper);

    const ref = createComponent(templateMeta.component, { environmentInjector: this.envInjector, hostElement: wrapper });
    ref.setInput('resume', resume);
    ref.changeDetectorRef.detectChanges();
    // Wait for real readiness instead of a blind delay: every <img> the fresh
    // off-screen template mounted (photos, icons) finishes decoding, then two
    // animation frames elapse so the browser has committed an actual layout +
    // paint before we clone the DOM for upload.
    await this._waitForImages(wrapper);
    await this._waitForPaint();
    ref.changeDetectorRef.detectChanges();

    try {
      return await this._downloadWithFallback(wrapper, filename, isPro);
    } finally {
      ref.destroy();
      try { document.body.removeChild(wrapper); } catch {}
    }
  }

  /** Resolves after the browser has committed a real layout + paint (two animation frames). */
  private _waitForPaint(): Promise<void> {
    return new Promise<void>(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  }

  /** Waits for every <img> under `root` to finish decoding (or error), so captured/uploaded
   *  DOM never contains an image mid-load. `decode()` resolves immediately for already-loaded
   *  images, so this is cheap when nothing is pending. */
  private _waitForImages(root: HTMLElement): Promise<void[]> {
    const imgs = Array.from(root.querySelectorAll('img'));
    return Promise.all(imgs.map(img => img.decode().catch(() => {})));
  }
}
