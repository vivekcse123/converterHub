import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map, filter, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { ConversionResult } from '../models/conversion.model';

interface UploadEvent { progress: number; result?: { data: ConversionResult } }

@Injectable({ providedIn: 'root' })
export class ConverterService {
  /** Global loading/progress state */
  readonly uploadProgress = signal<number>(0);
  readonly isConverting   = signal<boolean>(false);
  /** Phase label shown in the progress bar */
  readonly progressLabel  = signal<string>('Uploading…');

  private processingTicker?: ReturnType<typeof setInterval>;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private api: ApiService) {}

  downloadResult(res: ConversionResult): void {
    if (!this.isBrowser) return;
    this.api.downloadBlob(res.downloadUrl).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a   = document.createElement('a');
        a.href     = url;
        a.download = res.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
      },
      error: () => {
        window.open(res.downloadUrl, '_blank');
      },
    });
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
    this.stopProcessingTicker();
    this.processingTicker = setInterval(() => {
      const cur = this.uploadProgress();
      if (cur < 90) this.uploadProgress.set(cur + 2);
    }, 100);

    return this.api
      .post<{ data: ConversionResult }>('convert/text-to-pdf', { text })
      .pipe(
        map((r) => {
          this.stopProcessingTicker();
          this.isConverting.set(false);
          this.uploadProgress.set(100);
          this.progressLabel.set('Done!');
          return r.data;
        }),
        catchError((err) => {
          this.stopProcessingTicker();
          this.isConverting.set(false);
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

  /** Upload FormData with immediate fake progress animation (works regardless of upload speed). */
  private doUploadFd(endpoint: string, fd: FormData): Observable<ConversionResult> {
    this.isConverting.set(true);
    this.uploadProgress.set(0);
    this.progressLabel.set('Uploading…');
    this.stopProcessingTicker();

    // Start fake progress immediately — small files complete upload before
    // HttpEventType.UploadProgress fires, so we animate from the start.
    let fakeProgress = 0;
    this.processingTicker = setInterval(() => {
      fakeProgress += 1;
      if (fakeProgress <= 30) {
        // Fast ramp 0→30% (upload phase)
        this.uploadProgress.set(fakeProgress);
        this.progressLabel.set('Uploading…');
      } else if (fakeProgress <= 90) {
        // Slow crawl 30→90% (processing phase)
        this.uploadProgress.set(fakeProgress);
        this.progressLabel.set('Processing…');
      }
      // Stops at 90 — finalized to 100 on response
    }, 150);

    return this.api.uploadWithProgress<{ data: ConversionResult }>(endpoint, fd).pipe(
      map((event: UploadEvent) => {
        if (event.result) {
          this.stopProcessingTicker();
          this.uploadProgress.set(100);
          this.progressLabel.set('Done!');
          this.isConverting.set(false);
          return event.result.data;
        }
        return null as unknown as ConversionResult;
      }),
      filter((v): v is ConversionResult => v !== null),
      catchError((err) => {
        this.stopProcessingTicker();
        this.isConverting.set(false);
        this.uploadProgress.set(0);
        this.progressLabel.set('Uploading…');
        return throwError(() => err);
      })
    );
  }

  private stopProcessingTicker(): void {
    if (this.processingTicker) {
      clearInterval(this.processingTicker);
      this.processingTicker = undefined;
    }
  }
}
