import {
  ApiService
} from "./chunk-RTBSWPYX.js";
import {
  catchError,
  filter,
  map,
  signal,
  throwError,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-ZFM7PJ4E.js";

// src/app/core/services/converter.service.ts
var ConverterService = /* @__PURE__ */ (() => {
  class ConverterService2 {
    constructor(api) {
      this.api = api;
      this.uploadProgress = signal(0);
      this.isConverting = signal(false);
    }
    imageToPdf(files, options = {}) {
      return this.doUpload("convert/image-to-pdf", files, options, true);
    }
    pdfToWord(file) {
      return this.doUpload("convert/pdf-to-word", [file], {}, false);
    }
    wordToPdf(file) {
      return this.doUpload("convert/word-to-pdf", [file], {}, false);
    }
    pdfMerge(files) {
      return this.doUpload("convert/pdf-merge", files, {}, true);
    }
    pdfSplit(file) {
      return this.doUpload("convert/pdf-split", [file], {}, false);
    }
    pdfCompress(file) {
      return this.doUpload("convert/pdf-compress", [file], {}, false);
    }
    imageResize(file, opts) {
      return this.doUpload("convert/image-resize", [file], opts, false);
    }
    imageCompress(file, opts) {
      return this.doUpload("convert/image-compress", [file], opts, false);
    }
    imageConvert(file, format) {
      return this.doUpload("convert/image-convert", [file], {
        format
      }, false);
    }
    textToPdf(text) {
      this.isConverting.set(true);
      this.uploadProgress.set(50);
      return this.api.post("convert/text-to-pdf", {
        text
      }).pipe(map((r) => {
        this.isConverting.set(false);
        this.uploadProgress.set(100);
        return r.data;
      }), catchError((err) => {
        this.isConverting.set(false);
        this.uploadProgress.set(0);
        return throwError(() => err);
      }));
    }
    createZip(files) {
      return this.doUpload("convert/create-zip", files, {}, true);
    }
    /** Generic upload helper with progress tracking. */
    doUpload(endpoint, files, extras, multiple) {
      const fd = new FormData();
      const fieldName = multiple ? "files" : "file";
      files.forEach((f) => fd.append(fieldName, f));
      Object.entries(extras).forEach(([k, v]) => fd.append(k, v));
      this.isConverting.set(true);
      this.uploadProgress.set(0);
      return this.api.uploadWithProgress(endpoint, fd).pipe(map((event) => {
        this.uploadProgress.set(event.progress);
        if (event.progress === 100 && event.result) {
          this.isConverting.set(false);
          return event.result.data;
        }
        return null;
      }), filter((v) => v !== null), catchError((err) => {
        this.isConverting.set(false);
        this.uploadProgress.set(0);
        return throwError(() => err);
      }));
    }
    static {
      this.\u0275fac = function ConverterService_Factory(t) {
        return new (t || ConverterService2)(\u0275\u0275inject(ApiService));
      };
    }
    static {
      this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
        token: ConverterService2,
        factory: ConverterService2.\u0275fac,
        providedIn: "root"
      });
    }
  }
  return ConverterService2;
})();

export {
  ConverterService
};
//# sourceMappingURL=chunk-IFJXXLFC.js.map
