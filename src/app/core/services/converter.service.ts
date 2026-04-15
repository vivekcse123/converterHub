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
    this.uploadProgress.set(50);
    return this.api
      .post<{ data: ConversionResult }>('convert/text-to-pdf', { text })
      .pipe(
        map((r) => {
          this.isConverting.set(false);
          this.uploadProgress.set(100);
          return r.data;
        }),
        catchError((err) => {
          this.isConverting.set(false);
          this.uploadProgress.set(0);
          return throwError(() => err);
        })
      );
  }

  createZip(files: File[]): Observable<ConversionResult> {
    return this.doUpload('convert/create-zip', files, {}, true);
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

    this.isConverting.set(true);
    this.uploadProgress.set(0);

    return this.api.uploadWithProgress<{ data: ConversionResult }>(endpoint, fd).pipe(
      map((event: UploadEvent) => {
        this.uploadProgress.set(event.progress);
        if (event.progress === 100 && event.result) {
          this.isConverting.set(false);
          return event.result.data;
        }
        return null as unknown as ConversionResult;
      }),
      filter((v): v is ConversionResult => v !== null),
      catchError((err) => {
        this.isConverting.set(false);
        this.uploadProgress.set(0);
        return throwError(() => err);
      })
    );
  }
}
