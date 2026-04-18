import { Injectable, signal } from '@angular/core';
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

  constructor(private api: ApiService) {}
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

  /** Upload a pre-built FormData with progress tracking (two-phase: upload + processing). */
  private doUploadFd(endpoint: string, fd: FormData): Observable<ConversionResult> {
    this.isConverting.set(true);
    this.uploadProgress.set(0);
    this.progressLabel.set('Uploading…');
    this.stopProcessingTicker();

    return this.api.uploadWithProgress<{ data: ConversionResult }>(endpoint, fd).pipe(
      map((event: UploadEvent) => {
        if (event.result) {
          // Response received — finalize
          this.stopProcessingTicker();
          this.uploadProgress.set(100);
          this.progressLabel.set('Done!');
          this.isConverting.set(false);
          return event.result.data;
        }

        // Map raw upload progress (0–100) → display range 0–65%
        const uploadPct = Math.min(event.progress, 100);
        const displayPct = Math.round(uploadPct * 0.65);
        this.uploadProgress.set(displayPct);

        // Once upload bytes are fully sent, start processing animation (65→95%)
        if (uploadPct >= 100 && !this.processingTicker) {
          this.progressLabel.set('Processing…');
          this.processingTicker = setInterval(() => {
            const cur = this.uploadProgress();
            if (cur < 95) this.uploadProgress.set(cur + 1);
          }, 120);
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
