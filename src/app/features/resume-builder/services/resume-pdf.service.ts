import { EnvironmentInjector, Injectable, PLATFORM_ID, createComponent, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DEFAULT_DESIGN, DesignSettings, ResumeData } from '../models/resume.model';
import { PREMIUM_TEMPLATE_IDS, getTemplateMeta } from '../data/resume-templates.data';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from 'src/environments/environment';

const FONT_FAMILIES: Record<DesignSettings['fontFamily'], string> = {
  inter:   "'Inter', Arial, Helvetica, sans-serif",
  roboto:  "'Roboto', Arial, Helvetica, sans-serif",
  georgia: "Georgia, 'Times New Roman', serif",
};
const SPACING_MAP: Record<DesignSettings['lineHeight'], string> = {
  compact: '1.3', standard: '1.5', spacious: '1.75',
};
const BASE_PT = 10.5;
const CSS_VAR_NAMES = ['--r-accent','--r-accent-12','--r-accent-25','--r-font','--r-size','--r-spacing'] as const;
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
        body: JSON.stringify({ html: clone.outerHTML, inlineStyles: allStyles, cssVarsCss, filename }),
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

  // ─── Style collection (cached per session) ───────────────────────────────────
  // CSS filenames include content hashes (Angular build), so the same URLs are
  // stable for the entire session. Cache the result to avoid re-fetching on
  // every PDF download — the payload can be 100–200 KB of Tailwind CSS.
  private _stylesCache: string | null = null;

  private async _collectStyles(): Promise<string> {
    if (this._stylesCache !== null) return this._stylesCache;

    const parts: string[] = [];
    document.querySelectorAll('style').forEach(s => { parts.push(s.textContent ?? ''); });
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
    parts.push(...await Promise.all(jobs));
    this._stylesCache = parts.join('\n');
    return this._stylesCache;
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

    const watermarkCss = isPro ? '' : `
      body::after {
        content: 'ApnaConverter.com  \\2022  Upgrade to Pro';
        position: fixed; top: 50%; left: 50%;
        transform: translate(-50%,-50%) rotate(-25deg);
        font-size: 18pt; font-family: Arial, sans-serif;
        color: rgba(0,0,0,0.07); white-space: nowrap;
        pointer-events: none; z-index: 99999;
      }`;

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

    const d     = { ...DEFAULT_DESIGN, ...resume.design } as DesignSettings;
    const hex   = (d.accentColor || '#1e293b').replace(/^#/, '').padEnd(6, '0');
    const rC    = parseInt(hex.slice(0, 2), 16) || 0;
    const gC    = parseInt(hex.slice(2, 4), 16) || 0;
    const bC    = parseInt(hex.slice(4, 6), 16) || 0;
    const scale = ((d.baseFontPt ?? BASE_PT) / BASE_PT).toFixed(4);

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:fixed;top:0;left:-9999px;width:210mm;background:#fff;z-index:2147483647';
    wrapper.style.setProperty('--r-accent',    d.accentColor ?? '#1e293b');
    wrapper.style.setProperty('--r-accent-12', `rgba(${rC},${gC},${bC},0.12)`);
    wrapper.style.setProperty('--r-accent-25', `rgba(${rC},${gC},${bC},0.25)`);
    wrapper.style.setProperty('--r-font',      FONT_FAMILIES[d.fontFamily] ?? FONT_FAMILIES['inter']);
    wrapper.style.setProperty('--r-size',      scale);
    wrapper.style.setProperty('--r-spacing',   SPACING_MAP[d.lineHeight ?? 'standard']);
    document.body.appendChild(wrapper);

    const ref = createComponent(templateMeta.component, { environmentInjector: this.envInjector, hostElement: wrapper });
    ref.setInput('resume', resume);
    ref.changeDetectorRef.detectChanges();
    await new Promise<void>(r => setTimeout(r, 500));
    ref.changeDetectorRef.detectChanges();

    try {
      return await this._downloadWithFallback(wrapper, filename, isPro);
    } finally {
      ref.destroy();
      try { document.body.removeChild(wrapper); } catch {}
    }
  }
}
