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

// src/app/features/compress/compress.component.ts
function CompressComponent_div_11_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "\u26A1 Create ZIP");
    \u0275\u0275elementEnd();
  }
}
function CompressComponent_div_11_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Packing\u2026");
    \u0275\u0275elementEnd();
  }
}
function CompressComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "button", 12);
    \u0275\u0275listener("click", function CompressComponent_div_11_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r5 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r5.convert());
    });
    \u0275\u0275template(2, CompressComponent_div_11_span_2_Template, 2, 0, "span", 13);
    \u0275\u0275template(3, CompressComponent_div_11_span_3_Template, 2, 0, "span", 13);
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
function CompressComponent_app_progress_bar_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-progress-bar", 14);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("value", ctx_r1.converter.uploadProgress());
  }
}
function CompressComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "div", 16);
    \u0275\u0275text(2, "\u2705");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h2", 17);
    \u0275\u0275text(4, "ZIP created!");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 18)(6, "a", 19);
    \u0275\u0275text(7, "\u2B07\uFE0F Download ZIP");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 20);
    \u0275\u0275listener("click", function CompressComponent_div_13_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r7 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r7.reset());
    });
    \u0275\u0275text(9, "\u{1F504} Create Another");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275property("href", ctx_r2.result().downloadUrl, \u0275\u0275sanitizeUrl)("download", ctx_r2.result().fileName);
  }
}
var CompressComponent = /* @__PURE__ */ (() => {
  class CompressComponent2 {
    constructor(converter, notify) {
      this.converter = converter;
      this.notify = notify;
      this.files = signal([]);
      this.result = signal(null);
    }
    onFiles(f) {
      this.files.set(f);
      this.result.set(null);
    }
    convert() {
      this.converter.createZip(this.files()).subscribe({
        next: (r) => {
          this.result.set(r);
          this.notify.success("ZIP ready!");
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
      this.\u0275fac = function CompressComponent_Factory(t) {
        return new (t || CompressComponent2)(\u0275\u0275directiveInject(ConverterService), \u0275\u0275directiveInject(NotificationService));
      };
    }
    static {
      this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
        type: CompressComponent2,
        selectors: [["app-compress"]],
        standalone: true,
        features: [\u0275\u0275StandaloneFeature],
        decls: 14,
        vars: 5,
        consts: [[1, "bg-gradient-to-r", "from-emerald-500", "to-teal-500", "text-white", "py-14"], [1, "container-app", "text-center"], [1, "w-16", "h-16", "mx-auto", "mb-5", "bg-white/20", "rounded-2xl", "flex", "items-center", "justify-center", "text-3xl"], [1, "text-3xl", "md:text-4xl", "font-extrabold", "mb-3"], [1, "text-emerald-100", "text-lg", "max-w-md", "mx-auto"], [1, "container-app", "py-12", "max-w-2xl"], [1, "card", "p-6", "md:p-8"], ["accept", "image/*,application/pdf,.txt", "label", "Drop files to compress / bundle", 3, "multiple", "maxSizeMB", "filesSelected"], ["class", "mt-6 flex justify-center", 4, "ngIf"], ["class", "mt-4", 3, "value", 4, "ngIf"], ["class", "card p-8 text-center mt-6 animate-bounce-in", 4, "ngIf"], [1, "mt-6", "flex", "justify-center"], [1, "btn", "btn-primary", "btn-lg", "min-w-[200px]", 3, "disabled", "click"], [4, "ngIf"], [1, "mt-4", 3, "value"], [1, "card", "p-8", "text-center", "mt-6", "animate-bounce-in"], [1, "text-5xl", "mb-4"], [1, "text-xl", "font-bold", "mb-4", "text-slate-800", "dark:text-white"], [1, "flex", "gap-3", "justify-center"], [1, "btn", "btn-primary", 3, "href", "download"], [1, "btn", "btn-secondary", 3, "click"]],
        template: function CompressComponent_Template(rf, ctx) {
          if (rf & 1) {
            \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
            \u0275\u0275text(3, "\u{1F5DC}\uFE0F");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(4, "h1", 3);
            \u0275\u0275text(5, "File Compressor");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(6, "p", 4);
            \u0275\u0275text(7, "Bundle files into a ZIP archive.");
            \u0275\u0275elementEnd()()();
            \u0275\u0275elementStart(8, "div", 5)(9, "div", 6)(10, "app-file-upload", 7);
            \u0275\u0275listener("filesSelected", function CompressComponent_Template_app_file_upload_filesSelected_10_listener($event) {
              return ctx.onFiles($event);
            });
            \u0275\u0275elementEnd();
            \u0275\u0275template(11, CompressComponent_div_11_Template, 4, 3, "div", 8);
            \u0275\u0275template(12, CompressComponent_app_progress_bar_12_Template, 1, 1, "app-progress-bar", 9);
            \u0275\u0275elementEnd();
            \u0275\u0275template(13, CompressComponent_div_13_Template, 10, 2, "div", 10);
            \u0275\u0275elementEnd();
          }
          if (rf & 2) {
            \u0275\u0275advance(10);
            \u0275\u0275property("multiple", true)("maxSizeMB", 50);
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.files().length);
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.converter.isConverting());
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.result());
          }
        },
        dependencies: [CommonModule, NgIf, FormsModule, FileUploadComponent, ProgressBarComponent],
        encapsulation: 2
      });
    }
  }
  return CompressComponent2;
})();
export {
  CompressComponent
};
//# sourceMappingURL=chunk-TD2QJPTY.js.map
