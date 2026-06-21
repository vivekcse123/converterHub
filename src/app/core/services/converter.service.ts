import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map, filter, catchError, throwError, retry, timer } from 'rxjs';
import { ApiService } from './api.service';
import { ConversionResult } from '../models/conversion.model';

interface UploadEvent { progress: number; result?: { data: ConversionResult } }

/** Maximum ms before we show the "still processing" notice */
const STUCK_THRESHOLD_MS = 15_000;

/** Status codes that should NOT be retried (user error, not transient) */
const NO_RETRY_STATUSES = new Set([400, 401, 403, 404, 409, 413, 415]);

@Injectable({ providedIn: 'root' })
export class ConverterService {
  /** Global loading/progress state */
  readonly uploadProgress = signal<number>(0);
  readonly isConverting   = signal<boolean>(false);
  /** Phase label shown in the progress bar */
  readonly progressLabel  = signal<string>('Uploading…');
  /** True when a conversion has been running for > STUCK_THRESHOLD_MS */
  readonly isStuck        = signal<boolean>(false);

  private processingTicker?: ReturnType<typeof setInterval>;
  private stuckTimer?: ReturnType<typeof setTimeout>;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private api: ApiService) {}

  downloadResult(res: ConversionResult): void {
    if (!this.isBrowser) return;
    this.api.downloadBlob(res.downloadUrl).subscribe({
      next: (blob) => {
        if (blob.size === 0) {
          // Empty blob — file has expired or is missing
          this._notifyDownloadExpired(res.downloadUrl);
          return;
        }
        const url = URL.createObjectURL(blob);
        const a   = document.createElement('a');
        a.href     = url;
        a.download = res.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
      },
      error: (err) => {
        const status = err?.status ?? 0;
        if (status === 404) {
          this._notifyDownloadExpired(res.downloadUrl);
        } else {
          // Fallback to direct tab open for non-404 errors
          window.open(res.downloadUrl, '_blank');
        }
      },
    });
  }

  private _notifyDownloadExpired(url: string): void {
    // Open the URL anyway — browser will show a proper 404 page, and users
    // can share the error to support.  A more complete implementation would
    // dispatch a toast notification via NotificationService.
    console.warn('[ConverterService] Download URL expired or file missing:', url);
    window.open(url, '_blank');
  }

  imageToPdf(files: File[], options: Record<string, string> = {}): Observable<ConversionResult> {
    return this.doUpload('convert/image-to-pdf', files, options, true);
  }

  pdfToWord(file: File): Observable<ConversionResult> {
    return this.doUpload('convert/pdf-to-word', [file], {}, false);
  }

  wordToPdf(file: File): Observable<ConversionResult> {
    return this.doUpload('convert/word-to-pdf', [file], {}, false);
  }

  pdfMerge(files: File[]): Observable<ConversionResult> {
    return this.doUpload('convert/pdf-merge', files, {}, true);
  }

  pdfSplit(file: File): Observable<ConversionResult> {
    return this.doUpload('convert/pdf-split', [file], {}, false);
  }

  pdfCompress(file: File): Observable<ConversionResult> {
    return this.doUpload('convert/pdf-compress', [file], {}, false);
  }

  imageResize(file: File, opts: Record<string, string>): Observable<ConversionResult> {
    return this.doUpload('convert/image-resize', [file], opts, false);
  }

  imageCompress(file: File, opts: Record<string, string>): Observable<ConversionResult> {
    return this.doUpload('convert/image-compress', [file], opts, false);
  }

  imageConvert(file: File, format: string): Observable<ConversionResult> {
    return this.doUpload('convert/image-convert', [file], { format }, false);
  }

  textToPdf(text: string): Observable<ConversionResult> {
    this.isConverting.set(true);
    this.uploadProgress.set(20);
    this.progressLabel.set('Processing…');
    this.isStuck.set(false);
    this.stopProcessingTicker();
    this.scheduleStuckTimer();
    this.processingTicker = setInterval(() => {
      const cur = this.uploadProgress();
      if (cur < 90) this.uploadProgress.set(cur + 2);
    }, 100);

    return this.api
      .post<{ data: ConversionResult }>('convert/text-to-pdf', { text })
      .pipe(
        map((r) => {
          this.clearTimers();
          this.isConverting.set(false);
          this.isStuck.set(false);
          this.uploadProgress.set(100);
          this.progressLabel.set('Done!');
          return r.data;
        }),
        catchError((err) => {
          this.clearTimers();
          this.isConverting.set(false);
          this.isStuck.set(false);
          this.uploadProgress.set(0);
          this.progressLabel.set('Uploading…');
          return throwError(() => err);
        })
      );
  }

  createZip(files: File[]): Observable<ConversionResult> {
    return this.doUpload('convert/create-zip', files, {}, true);
  }

  // ── Advanced PDF ──────────────────────────────────────────────

  pdfToJpg(file: File, opts: Record<string, string> = {}): Observable<ConversionResult> {
    return this.doUpload('convert/pdf-to-jpg', [file], opts, false);
  }

  watermarkPdf(file: File, opts: Record<string, string>): Observable<ConversionResult> {
    return this.doUpload('convert/watermark-pdf', [file], opts, false);
  }

  redactPdf(file: File, opts: Record<string, string>): Observable<ConversionResult> {
    return this.doUpload('convert/redact-pdf', [file], opts, false);
  }

  signPdf(file: File, signatureFile: File | null, opts: Record<string, string>): Observable<ConversionResult> {
    const fd = new FormData();
    fd.append('file', file);
    if (signatureFile) fd.append('signatureImage', signatureFile);
    Object.entries(opts).forEach(([k, v]) => fd.append(k, v));
    return this.doUploadFd('convert/sign-pdf', fd);
  }

  addPageNumbers(file: File, opts: Record<string, string> = {}): Observable<ConversionResult> {
    return this.doUpload('convert/add-page-numbers', [file], opts, false);
  }

  pdfToPdfa(file: File): Observable<ConversionResult> {
    return this.doUpload('convert/pdf-to-pdfa', [file], {}, false);
  }

  comparePdfs(file1: File, file2: File): Observable<ConversionResult> {
    const fd = new FormData();
    fd.append('files', file1);
    fd.append('files', file2);
    return this.doUploadFd('convert/compare-pdfs', fd);
  }

  performOCR(file: File, opts: Record<string, string> = {}): Observable<ConversionResult> {
    return this.doUpload('convert/ocr', [file], opts, false);
  }

  // ── Extended Converters ───────────────────────────────────────

  pdfToTxt(file: File): Observable<ConversionResult> {
    return this.doUpload('convert/pdf-to-txt', [file], {}, false);
  }

  pdfToMarkdown(file: File): Observable<ConversionResult> {
    return this.doUpload('convert/pdf-to-markdown', [file], {}, false);
  }

  pdfToJson(file: File): Observable<ConversionResult> {
    return this.doUpload('convert/pdf-to-json', [file], {}, false);
  }

  pdfToXml(file: File): Observable<ConversionResult> {
    return this.doUpload('convert/pdf-to-xml', [file], {}, false);
  }

  pdfToCsv(file: File): Observable<ConversionResult> {
    return this.doUpload('convert/pdf-to-csv', [file], {}, false);
  }

  pdfToEpub(file: File, opts: Record<string, string> = {}): Observable<ConversionResult> {
    return this.doUpload('convert/pdf-to-epub', [file], opts, false);
  }

  pdfToPptx(file: File): Observable<ConversionResult> {
    return this.doUpload('convert/pdf-to-pptx', [file], {}, false);
  }

  pdfToExcel(file: File): Observable<ConversionResult> {
    return this.doUpload('convert/pdf-to-excel', [file], {}, false);
  }

  heicToJpg(file: File): Observable<ConversionResult> {
    return this.doUpload('convert/heic-to-jpg', [file], {}, false);
  }

  gifToPdf(files: File[]): Observable<ConversionResult> {
    return this.doUpload('convert/gif-to-pdf', files, {}, true);
  }

  markdownToPdf(file: File): Observable<ConversionResult> {
    return this.doUpload('convert/markdown-to-pdf', [file], {}, false);
  }

  csvToPdf(file: File): Observable<ConversionResult> {
    return this.doUpload('convert/csv-to-pdf', [file], {}, false);
  }

  htmlToPdf(file: File): Observable<ConversionResult> {
    return this.doUpload('convert/html-to-pdf', [file], {}, false);
  }

  svgToPdf(file: File): Observable<ConversionResult> {
    return this.doUpload('convert/svg-to-pdf', [file], {}, false);
  }

  // ── New PDF Security / Organisation ──────────────────────────────────────────

  unlockPdf(file: File, password = ''): Observable<ConversionResult> {
    return this.doUpload('convert/unlock-pdf', [file], { password }, false);
  }

  protectPdf(file: File, userPassword: string, ownerPassword?: string): Observable<ConversionResult> {
    const opts: Record<string, string> = { userPassword };
    if (ownerPassword) opts['ownerPassword'] = ownerPassword;
    return this.doUpload('convert/protect-pdf', [file], opts, false);
  }

  organizePdf(file: File, pageOrder: number[]): Observable<ConversionResult> {
    return this.doUpload('convert/organize-pdf', [file], { pageOrder: JSON.stringify(pageOrder) }, false);
  }

  /** Generic upload helper with progress tracking. */
  private doUpload(
    endpoint: string,
    files: File[],
    extras: Record<string, string>,
    multiple: boolean
  ): Observable<ConversionResult> {
    const fd = new FormData();
    const fieldName = multiple ? 'files' : 'file';
    files.forEach((f) => fd.append(fieldName, f));
    Object.entries(extras).forEach(([k, v]) => fd.append(k, v));
    return this.doUploadFd(endpoint, fd);
  }

  /**
   * Upload FormData with:
   * - Animated progress feedback (upload + processing phases)
   * - Automatic retry on transient errors (network, 429, 500-503) up to 3 times
   * - Stuck-state detection after STUCK_THRESHOLD_MS with user-facing label
   */
  private doUploadFd(endpoint: string, fd: FormData): Observable<ConversionResult> {
    this.isConverting.set(true);
    this.uploadProgress.set(0);
    this.progressLabel.set('Uploading…');
    this.isStuck.set(false);
    this.stopProcessingTicker();
    this.scheduleStuckTimer();

    let fakeProgress = 0;
    this.processingTicker = setInterval(() => {
      fakeProgress += 1;
      if (fakeProgress <= 30) {
        this.uploadProgress.set(fakeProgress);
        this.progressLabel.set('Uploading…');
      } else if (fakeProgress <= 88) {
        this.uploadProgress.set(fakeProgress);
        this.progressLabel.set('Processing…');
      }
      // Hold at 88 until the response arrives — 89/90 reserved so the user
      // notices it hasn't jumped straight to 100 (fake completion).
    }, 150);

    return this.api.uploadWithProgress<{ data: ConversionResult }>(endpoint, fd).pipe(
      map((event: UploadEvent) => {
        if (event.result) {
          this.clearTimers();
          this.uploadProgress.set(100);
          this.progressLabel.set('Done!');
          this.isConverting.set(false);
          this.isStuck.set(false);
          return event.result.data;
        }
        return null as unknown as ConversionResult;
      }),
      filter((v): v is ConversionResult => v !== null),
      // Retry transient server/network errors with exponential backoff
      retry({
        count: 3,
        delay: (err, retryCount) => {
          const status: number = (err as any)?.status ?? 0;
          // Don't retry deterministic client errors
          if (NO_RETRY_STATUSES.has(status)) {
            return throwError(() => err);
          }
          const delayMs = Math.min(1_000 * Math.pow(2, retryCount - 1), 8_000);
          // Reset progress and show retry label
          fakeProgress = 0;
          this.uploadProgress.set(5);
          this.progressLabel.set(`Retrying… (attempt ${retryCount + 1}/3)`);
          this.isStuck.set(false);
          this.rescheduleStuckTimer();
          return timer(delayMs);
        },
      }),
      catchError((err) => {
        this.clearTimers();
        this.isConverting.set(false);
        this.isStuck.set(false);
        this.uploadProgress.set(0);
        this.progressLabel.set('Uploading…');
        return throwError(() => err);
      })
    );
  }

  /** Show "still processing" notice after STUCK_THRESHOLD_MS of no response. */
  private scheduleStuckTimer(): void {
    if (!this.isBrowser) return;
    this.stuckTimer = setTimeout(() => {
      if (this.isConverting()) {
        this.isStuck.set(true);
        this.progressLabel.set('Still processing — please wait…');
      }
    }, STUCK_THRESHOLD_MS);
  }

  private rescheduleStuckTimer(): void {
    if (this.stuckTimer) clearTimeout(this.stuckTimer);
    this.scheduleStuckTimer();
  }

  private stopProcessingTicker(): void {
    if (this.processingTicker) {
      clearInterval(this.processingTicker);
      this.processingTicker = undefined;
    }
  }

  private clearTimers(): void {
    this.stopProcessingTicker();
    if (this.stuckTimer) {
      clearTimeout(this.stuckTimer);
      this.stuckTimer = undefined;
    }
  }
}
