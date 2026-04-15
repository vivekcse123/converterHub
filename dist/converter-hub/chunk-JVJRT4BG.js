import {
  FormsModule
} from "./chunk-DFLTRQIA.js";
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
  NgForOf,
  NgIf,
  signal,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassMap,
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
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-ZFM7PJ4E.js";
import "./chunk-SHAOKUVO.js";

// src/app/features/pdf-editor/pdf-editor.component.ts
function PdfEditorComponent_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 13);
    \u0275\u0275listener("click", function PdfEditorComponent_button_10_Template_button_click_0_listener() {
      const restoredCtx = \u0275\u0275restoreView(_r6);
      const a_r4 = restoredCtx.$implicit;
      const ctx_r5 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r5.setAction(a_r4.id));
    });
    \u0275\u0275elementStart(1, "div", 14);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 15);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 16);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const a_r4 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r0.action() === a_r4.id ? "card p-4 text-center border-2 border-primary-500 bg-primary-50 dark:bg-primary-950/30" : "card p-4 text-center hover:border-slate-300 dark:hover:border-slate-500");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(a_r4.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(a_r4.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(a_r4.desc);
  }
}
function PdfEditorComponent_div_13_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "\u26A1 Process PDF");
    \u0275\u0275elementEnd();
  }
}
function PdfEditorComponent_div_13_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Processing\u2026");
    \u0275\u0275elementEnd();
  }
}
function PdfEditorComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17)(1, "button", 18);
    \u0275\u0275listener("click", function PdfEditorComponent_div_13_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r9 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r9.convert());
    });
    \u0275\u0275template(2, PdfEditorComponent_div_13_span_2_Template, 2, 0, "span", 19);
    \u0275\u0275template(3, PdfEditorComponent_div_13_span_3_Template, 2, 0, "span", 19);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(1);
    \u0275\u0275property("disabled", ctx_r1.converter.isConverting());
    \u0275\u0275advance(1);
    \u0275\u0275property("ngIf", !ctx_r1.converter.isConverting());
    \u0275\u0275advance(1);
    \u0275\u0275property("ngIf", ctx_r1.converter.isConverting());
  }
}
function PdfEditorComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "app-progress-bar", 21);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(1);
    \u0275\u0275property("value", ctx_r2.converter.uploadProgress());
  }
}
function PdfEditorComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 23);
    \u0275\u0275text(2, "\u2705");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h2", 24);
    \u0275\u0275text(4, "Done!");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 25)(6, "a", 26);
    \u0275\u0275text(7, "\u2B07\uFE0F Download");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 27);
    \u0275\u0275listener("click", function PdfEditorComponent_div_15_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r11 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r11.reset());
    });
    \u0275\u0275text(9, "\u{1F504} Process Another");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275property("href", ctx_r3.result().downloadUrl, \u0275\u0275sanitizeUrl)("download", ctx_r3.result().fileName);
  }
}
var PdfEditorComponent = /* @__PURE__ */ (() => {
  class PdfEditorComponent2 {
    constructor(converter, notify) {
      this.converter = converter;
      this.notify = notify;
      this.action = signal("merge");
      this.files = signal([]);
      this.result = signal(null);
      this.actions = [{
        id: "merge",
        label: "Merge PDFs",
        icon: "\u{1F517}",
        desc: "Combine multiple PDFs into one."
      }, {
        id: "split",
        label: "Split PDF",
        icon: "\u2702\uFE0F",
        desc: "Split into individual pages."
      }, {
        id: "compress",
        label: "Compress PDF",
        icon: "\u{1F5DC}\uFE0F",
        desc: "Reduce the file size."
      }];
    }
    setAction(a) {
      this.action.set(a);
      this.files.set([]);
      this.result.set(null);
    }
    onFiles(f) {
      this.files.set(f);
      this.result.set(null);
    }
    convert() {
      const fs = this.files();
      if (!fs.length)
        return;
      const a = this.action();
      const obs = a === "merge" ? this.converter.pdfMerge(fs) : a === "split" ? this.converter.pdfSplit(fs[0]) : this.converter.pdfCompress(fs[0]);
      obs.subscribe({
        next: (r) => {
          this.result.set(r);
          this.notify.success("Done!");
        },
        error: (e) => this.notify.error("Failed", e.error?.message)
      });
    }
    reset() {
      this.files.set([]);
      this.result.set(null);
      this.converter.uploadProgress.set(0);
    }
    static {
      this.\u0275fac = function PdfEditorComponent_Factory(t) {
        return new (t || PdfEditorComponent2)(\u0275\u0275directiveInject(ConverterService), \u0275\u0275directiveInject(NotificationService));
      };
    }
    static {
      this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
        type: PdfEditorComponent2,
        selectors: [["app-pdf-editor"]],
        standalone: true,
        features: [\u0275\u0275StandaloneFeature],
        decls: 16,
        vars: 7,
        consts: [[1, "bg-gradient-to-r", "from-orange-500", "to-red-500", "text-white", "py-14"], [1, "container-app", "text-center"], [1, "w-16", "h-16", "mx-auto", "mb-5", "bg-white/20", "rounded-2xl", "flex", "items-center", "justify-center", "text-3xl"], [1, "text-3xl", "md:text-4xl", "font-extrabold", "mb-3"], [1, "text-orange-100", "text-lg", "max-w-md", "mx-auto"], [1, "container-app", "py-12", "max-w-2xl"], [1, "grid", "grid-cols-3", "gap-3", "mb-8"], [3, "class", "click", 4, "ngFor", "ngForOf"], [1, "card", "p-6", "md:p-8"], ["accept", "application/pdf", 3, "multiple", "maxSizeMB", "label", "filesSelected"], ["class", "mt-6 flex justify-center", 4, "ngIf"], ["class", "mt-4", 4, "ngIf"], ["class", "card p-8 text-center mt-6 animate-bounce-in", 4, "ngIf"], [3, "click"], [1, "text-2xl", "mb-1"], [1, "text-sm", "font-semibold", "text-slate-700", "dark:text-slate-200"], [1, "text-xs", "text-slate-400", "mt-0.5"], [1, "mt-6", "flex", "justify-center"], [1, "btn", "btn-primary", "btn-lg", "min-w-[200px]", 3, "disabled", "click"], [4, "ngIf"], [1, "mt-4"], [3, "value"], [1, "card", "p-8", "text-center", "mt-6", "animate-bounce-in"], [1, "text-5xl", "mb-4"], [1, "text-xl", "font-bold", "mb-4", "text-slate-800", "dark:text-white"], [1, "flex", "gap-3", "justify-center"], [1, "btn", "btn-primary", 3, "href", "download"], [1, "btn", "btn-secondary", 3, "click"]],
        template: function PdfEditorComponent_Template(rf, ctx) {
          if (rf & 1) {
            \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
            \u0275\u0275text(3, "\u{1F527}");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(4, "h1", 3);
            \u0275\u0275text(5, "PDF Editor");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(6, "p", 4);
            \u0275\u0275text(7, "Merge, split, and compress your PDF files.");
            \u0275\u0275elementEnd()()();
            \u0275\u0275elementStart(8, "div", 5)(9, "div", 6);
            \u0275\u0275template(10, PdfEditorComponent_button_10_Template, 7, 5, "button", 7);
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(11, "div", 8)(12, "app-file-upload", 9);
            \u0275\u0275listener("filesSelected", function PdfEditorComponent_Template_app_file_upload_filesSelected_12_listener($event) {
              return ctx.onFiles($event);
            });
            \u0275\u0275elementEnd();
            \u0275\u0275template(13, PdfEditorComponent_div_13_Template, 4, 3, "div", 10);
            \u0275\u0275template(14, PdfEditorComponent_div_14_Template, 2, 1, "div", 11);
            \u0275\u0275elementEnd();
            \u0275\u0275template(15, PdfEditorComponent_div_15_Template, 10, 2, "div", 12);
            \u0275\u0275elementEnd();
          }
          if (rf & 2) {
            \u0275\u0275advance(10);
            \u0275\u0275property("ngForOf", ctx.actions);
            \u0275\u0275advance(2);
            \u0275\u0275property("multiple", ctx.action() === "merge")("maxSizeMB", 50)("label", ctx.action() === "merge" ? "Drop PDF files to merge" : "Drop a PDF file");
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.files().length);
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.converter.isConverting());
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.result());
          }
        },
        dependencies: [CommonModule, NgForOf, NgIf, FormsModule, FileUploadComponent, ProgressBarComponent],
        encapsulation: 2
      });
    }
  }
  return PdfEditorComponent2;
})();
export {
  PdfEditorComponent
};
//# sourceMappingURL=chunk-JVJRT4BG.js.map
