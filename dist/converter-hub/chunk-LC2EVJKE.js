import {
  FileUploadComponent,
  ProgressBarComponent
} from "./chunk-VIVGX7WQ.js";
import {
  ConverterService
} from "./chunk-IFJXXLFC.js";
import {
  NotificationService
} from "./chunk-RTBSWPYX.js";
import {
  CommonModule,
  NgIf,
  signal,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext
} from "./chunk-ZFM7PJ4E.js";
import "./chunk-SHAOKUVO.js";

// src/app/features/pdf-to-word/pdf-to-word.component.ts
function PdfToWordComponent_div_11_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "\u26A1 Convert to Word");
    \u0275\u0275elementEnd();
  }
}
function PdfToWordComponent_div_11_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Converting\u2026");
    \u0275\u0275elementEnd();
  }
}
function PdfToWordComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "button", 12);
    \u0275\u0275listener("click", function PdfToWordComponent_div_11_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r5 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r5.convert());
    });
    \u0275\u0275template(2, PdfToWordComponent_div_11_span_2_Template, 2, 0, "span", 13);
    \u0275\u0275template(3, PdfToWordComponent_div_11_span_3_Template, 2, 0, "span", 13);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(1);
    \u0275\u0275property("disabled", ctx_r0.converter.isConverting());
    \u0275\u0275advance(1);
    \u0275\u0275property("ngIf", !ctx_r0.converter.isConverting());
    \u0275\u0275advance(1);
    \u0275\u0275property("ngIf", ctx_r0.converter.isConverting());
  }
}
function PdfToWordComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275element(1, "app-progress-bar", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(1);
    \u0275\u0275property("value", ctx_r1.converter.uploadProgress());
  }
}
function PdfToWordComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16)(1, "div", 17);
    \u0275\u0275text(2, "\u2705");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h2", 18);
    \u0275\u0275text(4, "Word document ready!");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 19)(6, "a", 20);
    \u0275\u0275text(7, "\u2B07\uFE0F Download .docx");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 21);
    \u0275\u0275listener("click", function PdfToWordComponent_div_13_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r7 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r7.reset());
    });
    \u0275\u0275text(9, "\u{1F504} Convert Another");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275property("href", ctx_r2.result().downloadUrl, \u0275\u0275sanitizeUrl)("download", ctx_r2.result().fileName);
  }
}
var PdfToWordComponent = /* @__PURE__ */ (() => {
  class PdfToWordComponent2 {
    constructor(converter, notify) {
      this.converter = converter;
      this.notify = notify;
      this.file = signal(null);
      this.result = signal(null);
    }
    onFile(files) {
      this.file.set(files[0] ?? null);
      this.result.set(null);
    }
    convert() {
      const f = this.file();
      if (!f)
        return;
      this.converter.pdfToWord(f).subscribe({
        next: (r) => {
          this.result.set(r);
          this.notify.success("Done!", "Word document ready.");
        },
        error: (e) => this.notify.error("Failed", e.error?.message)
      });
    }
    reset() {
      this.file.set(null);
      this.result.set(null);
      this.converter.uploadProgress.set(0);
    }
    static {
      this.\u0275fac = function PdfToWordComponent_Factory(t) {
        return new (t || PdfToWordComponent2)(\u0275\u0275directiveInject(ConverterService), \u0275\u0275directiveInject(NotificationService));
      };
    }
    static {
      this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
        type: PdfToWordComponent2,
        selectors: [["app-pdf-to-word"]],
        standalone: true,
        features: [\u0275\u0275StandaloneFeature],
        decls: 14,
        vars: 5,
        consts: [[1, "bg-gradient-to-r", "from-violet-600", "to-purple-600", "text-white", "py-14"], [1, "container-app", "text-center"], [1, "w-16", "h-16", "mx-auto", "mb-5", "bg-white/20", "rounded-2xl", "flex", "items-center", "justify-center", "text-3xl"], [1, "text-3xl", "md:text-4xl", "font-extrabold", "mb-3"], [1, "text-violet-100", "text-lg", "max-w-md", "mx-auto"], [1, "container-app", "py-12", "max-w-2xl"], [1, "card", "p-6", "md:p-8"], ["accept", "application/pdf", "label", "Drop your PDF here", "sublabel", "PDF files only", 3, "multiple", "maxSizeMB", "filesSelected"], ["class", "mt-6 flex justify-center", 4, "ngIf"], ["class", "mt-4", 4, "ngIf"], ["class", "card p-8 text-center mt-6 animate-bounce-in", 4, "ngIf"], [1, "mt-6", "flex", "justify-center"], [1, "btn", "btn-primary", "btn-lg", "min-w-[200px]", 3, "disabled", "click"], [4, "ngIf"], [1, "mt-4"], [3, "value"], [1, "card", "p-8", "text-center", "mt-6", "animate-bounce-in"], [1, "text-5xl", "mb-4"], [1, "text-xl", "font-bold", "mb-4", "text-slate-800", "dark:text-white"], [1, "flex", "gap-3", "justify-center"], [1, "btn", "btn-primary", 3, "href", "download"], [1, "btn", "btn-secondary", 3, "click"]],
        template: function PdfToWordComponent_Template(rf, ctx) {
          if (rf & 1) {
            \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
            \u0275\u0275text(3, "\u{1F4C4}");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(4, "h1", 3);
            \u0275\u0275text(5, "PDF to Word");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(6, "p", 4);
            \u0275\u0275text(7, "Extract content from a PDF into an editable .docx file.");
            \u0275\u0275elementEnd()()();
            \u0275\u0275elementStart(8, "div", 5)(9, "div", 6)(10, "app-file-upload", 7);
            \u0275\u0275listener("filesSelected", function PdfToWordComponent_Template_app_file_upload_filesSelected_10_listener($event) {
              return ctx.onFile($event);
            });
            \u0275\u0275elementEnd();
            \u0275\u0275template(11, PdfToWordComponent_div_11_Template, 4, 3, "div", 8);
            \u0275\u0275template(12, PdfToWordComponent_div_12_Template, 2, 1, "div", 9);
            \u0275\u0275elementEnd();
            \u0275\u0275template(13, PdfToWordComponent_div_13_Template, 10, 2, "div", 10);
            \u0275\u0275elementEnd();
          }
          if (rf & 2) {
            \u0275\u0275advance(10);
            \u0275\u0275property("multiple", false)("maxSizeMB", 50);
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.file());
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.converter.isConverting());
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.result());
          }
        },
        dependencies: [CommonModule, NgIf, FileUploadComponent, ProgressBarComponent],
        encapsulation: 2
      });
    }
  }
  return PdfToWordComponent2;
})();
export {
  PdfToWordComponent
};
//# sourceMappingURL=chunk-LC2EVJKE.js.map
