import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  RangeValueAccessor,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
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
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-ZFM7PJ4E.js";
import "./chunk-SHAOKUVO.js";

// src/app/features/image-to-pdf/image-to-pdf.component.ts
function ImageToPdfComponent_ng_container_9_div_5_option_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r8 = ctx.$implicit;
    \u0275\u0275property("value", s_r8);
    \u0275\u0275advance(1);
    \u0275\u0275textInterpolate(s_r8);
  }
}
function ImageToPdfComponent_ng_container_9_div_5_option_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const o_r9 = ctx.$implicit;
    \u0275\u0275property("value", o_r9.value);
    \u0275\u0275advance(1);
    \u0275\u0275textInterpolate(o_r9.label);
  }
}
function ImageToPdfComponent_ng_container_9_div_5_span_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "\u26A1 Convert to PDF");
    \u0275\u0275elementEnd();
  }
}
function ImageToPdfComponent_ng_container_9_div_5_span_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 24);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 25);
    \u0275\u0275element(2, "circle", 26)(3, "path", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Converting\u2026 ");
    \u0275\u0275elementEnd();
  }
}
function ImageToPdfComponent_ng_container_9_div_5_div_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28);
    \u0275\u0275element(1, "app-progress-bar", 29);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r7 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(1);
    \u0275\u0275property("value", ctx_r7.converter.uploadProgress());
  }
}
function ImageToPdfComponent_ng_container_9_div_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12)(1, "h2", 13);
    \u0275\u0275text(2, "2. PDF Options");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 14)(4, "div")(5, "label", 15);
    \u0275\u0275text(6, "Page Size");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "select", 16);
    \u0275\u0275listener("ngModelChange", function ImageToPdfComponent_ng_container_9_div_5_Template_select_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r10 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r10.pageSize = $event);
    });
    \u0275\u0275template(8, ImageToPdfComponent_ng_container_9_div_5_option_8_Template, 2, 2, "option", 17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div")(10, "label", 15);
    \u0275\u0275text(11, "Orientation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "select", 16);
    \u0275\u0275listener("ngModelChange", function ImageToPdfComponent_ng_container_9_div_5_Template_select_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r12 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r12.orientation = $event);
    });
    \u0275\u0275template(13, ImageToPdfComponent_ng_container_9_div_5_option_13_Template, 2, 2, "option", 17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div")(15, "label", 15);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "input", 18);
    \u0275\u0275listener("ngModelChange", function ImageToPdfComponent_ng_container_9_div_5_Template_input_ngModelChange_17_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r13 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r13.margin = $event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "div", 19)(19, "button", 20);
    \u0275\u0275listener("click", function ImageToPdfComponent_ng_container_9_div_5_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r14 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r14.convert());
    });
    \u0275\u0275template(20, ImageToPdfComponent_ng_container_9_div_5_span_20_Template, 2, 0, "span", 6);
    \u0275\u0275template(21, ImageToPdfComponent_ng_container_9_div_5_span_21_Template, 5, 0, "span", 21);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(22, ImageToPdfComponent_ng_container_9_div_5_div_22_Template, 2, 1, "div", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275property("ngModel", ctx_r2.pageSize);
    \u0275\u0275advance(1);
    \u0275\u0275property("ngForOf", ctx_r2.pageSizes);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", ctx_r2.orientation);
    \u0275\u0275advance(1);
    \u0275\u0275property("ngForOf", ctx_r2.orientations);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" Margin (px) \u2014 ", ctx_r2.margin, " ");
    \u0275\u0275advance(1);
    \u0275\u0275property("ngModel", ctx_r2.margin);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.converter.isConverting());
    \u0275\u0275advance(1);
    \u0275\u0275property("ngIf", !ctx_r2.converter.isConverting());
    \u0275\u0275advance(1);
    \u0275\u0275property("ngIf", ctx_r2.converter.isConverting());
    \u0275\u0275advance(1);
    \u0275\u0275property("ngIf", ctx_r2.converter.isConverting());
  }
}
function ImageToPdfComponent_ng_container_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 8)(2, "h2", 9);
    \u0275\u0275text(3, "1. Select Images");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "app-file-upload", 10);
    \u0275\u0275listener("filesSelected", function ImageToPdfComponent_ng_container_9_Template_app_file_upload_filesSelected_4_listener($event) {
      \u0275\u0275restoreView(_r16);
      const ctx_r15 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r15.onFilesSelected($event));
    })("fileRemoved", function ImageToPdfComponent_ng_container_9_Template_app_file_upload_fileRemoved_4_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r17 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r17.onFileRemoved());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275template(5, ImageToPdfComponent_ng_container_9_div_5_Template, 23, 10, "div", 11);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("multiple", true)("maxSizeMB", 50);
    \u0275\u0275advance(1);
    \u0275\u0275property("ngIf", ctx_r0.step() === "options");
  }
}
function ImageToPdfComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 30)(1, "div", 31);
    \u0275\u0275text(2, " \u2705 ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h2", 32);
    \u0275\u0275text(4, "Your PDF is ready!");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 33);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 34);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 35)(10, "button", 36);
    \u0275\u0275listener("click", function ImageToPdfComponent_div_10_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r18 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r18.downloadFile());
    });
    \u0275\u0275text(11, " \u2B07\uFE0F Download PDF ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "button", 37);
    \u0275\u0275listener("click", function ImageToPdfComponent_div_10_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r20 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r20.reset());
    });
    \u0275\u0275text(13, " \u{1F504} Convert More ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "p", 38);
    \u0275\u0275text(15, " \u23F0 This file will be deleted automatically after 2 hours. ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2(" ", ctx_r1.files().length, " image", ctx_r1.files().length > 1 ? "s" : "", " converted successfully ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("File size: ", ctx_r1.formatSize(ctx_r1.result().size), "");
  }
}
var ImageToPdfComponent = /* @__PURE__ */ (() => {
  class ImageToPdfComponent2 {
    constructor(converter, notify) {
      this.converter = converter;
      this.notify = notify;
      this.files = signal([]);
      this.result = signal(null);
      this.step = signal("upload");
      this.pageSize = "A4";
      this.orientation = "portrait";
      this.margin = 20;
      this.pageSizes = ["A4", "LETTER", "LEGAL", "A3"];
      this.orientations = [{
        value: "portrait",
        label: "Portrait"
      }, {
        value: "landscape",
        label: "Landscape"
      }];
    }
    onFilesSelected(selected) {
      this.files.set(selected);
      this.result.set(null);
      if (selected.length) {
        this.step.set("options");
      } else {
        this.step.set("upload");
      }
    }
    onFileRemoved() {
      if (!this.files().length)
        this.step.set("upload");
    }
    convert() {
      const currentFiles = this.files();
      if (!currentFiles.length) {
        this.notify.warning("No files selected", "Please add at least one image.");
        return;
      }
      this.converter.imageToPdf(currentFiles, {
        pageSize: this.pageSize,
        orientation: this.orientation,
        margin: String(this.margin)
      }).subscribe({
        next: (res) => {
          this.result.set(res);
          this.step.set("done");
          this.notify.success("Conversion complete!", "Your PDF is ready to download.");
        },
        error: (err) => {
          this.notify.error("Conversion failed", err.error?.message ?? "Please try again.");
          this.converter.isConverting.set(false);
        }
      });
    }
    downloadFile() {
      const res = this.result();
      if (!res)
        return;
      const a = document.createElement("a");
      a.href = res.downloadUrl;
      a.download = res.fileName;
      a.click();
    }
    reset() {
      this.files.set([]);
      this.result.set(null);
      this.step.set("upload");
      this.converter.uploadProgress.set(0);
      this.converter.isConverting.set(false);
    }
    formatSize(bytes) {
      if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    static {
      this.\u0275fac = function ImageToPdfComponent_Factory(t) {
        return new (t || ImageToPdfComponent2)(\u0275\u0275directiveInject(ConverterService), \u0275\u0275directiveInject(NotificationService));
      };
    }
    static {
      this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
        type: ImageToPdfComponent2,
        selectors: [["app-image-to-pdf"]],
        standalone: true,
        features: [\u0275\u0275StandaloneFeature],
        decls: 11,
        vars: 2,
        consts: [[1, "bg-gradient-to-r", "from-blue-600", "to-cyan-500", "text-white", "py-14"], [1, "container-app", "text-center"], [1, "w-16", "h-16", "mx-auto", "mb-5", "bg-white/20", "rounded-2xl", "flex", "items-center", "justify-center", "text-3xl"], [1, "text-3xl", "md:text-4xl", "font-extrabold", "mb-3"], [1, "text-blue-100", "text-lg", "max-w-md", "mx-auto"], [1, "container-app", "py-12", "max-w-3xl"], [4, "ngIf"], ["class", "card p-8 text-center animate-bounce-in", 4, "ngIf"], [1, "card", "p-6", "md:p-8", "mb-6"], [1, "font-semibold", "text-slate-700", "dark:text-slate-200", "mb-4"], ["accept", "image/jpeg,image/png,image/webp,image/gif,image/bmp", "label", "Drop images here or click to browse", "sublabel", "JPG, PNG, WebP, GIF, BMP supported", 3, "multiple", "maxSizeMB", "filesSelected", "fileRemoved"], ["class", "card p-6 md:p-8 mb-6 animate-slide-up", 4, "ngIf"], [1, "card", "p-6", "md:p-8", "mb-6", "animate-slide-up"], [1, "font-semibold", "text-slate-700", "dark:text-slate-200", "mb-5"], [1, "grid", "grid-cols-1", "sm:grid-cols-3", "gap-4"], [1, "block", "text-sm", "font-medium", "text-slate-600", "dark:text-slate-300", "mb-1.5"], [1, "input", 3, "ngModel", "ngModelChange"], [3, "value", 4, "ngFor", "ngForOf"], ["type", "range", "min", "0", "max", "80", "step", "5", 1, "w-full", "accent-primary-600", 3, "ngModel", "ngModelChange"], [1, "mt-8", "flex", "justify-center"], [1, "btn", "btn-primary", "btn-lg", "gap-3", "min-w-[200px]", 3, "disabled", "click"], ["class", "flex items-center gap-2", 4, "ngIf"], ["class", "mt-6", 4, "ngIf"], [3, "value"], [1, "flex", "items-center", "gap-2"], ["fill", "none", "viewBox", "0 0 24 24", 1, "w-5", "h-5", "animate-spin"], ["cx", "12", "cy", "12", "r", "10", "stroke", "currentColor", "stroke-width", "4", 1, "opacity-25"], ["fill", "currentColor", "d", "M4 12a8 8 0 018-8v8H4z", 1, "opacity-75"], [1, "mt-6"], ["label", "Uploading and converting\u2026", 3, "value"], [1, "card", "p-8", "text-center", "animate-bounce-in"], [1, "w-20", "h-20", "bg-emerald-100", "dark:bg-emerald-900/40", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-5", "text-4xl"], [1, "text-2xl", "font-bold", "text-slate-800", "dark:text-white", "mb-2"], [1, "text-slate-500", "dark:text-slate-400", "mb-2"], [1, "text-sm", "text-slate-400", "mb-8"], [1, "flex", "flex-col", "sm:flex-row", "gap-3", "justify-center"], [1, "btn", "btn-primary", "btn-lg", 3, "click"], [1, "btn", "btn-secondary", "btn-lg", 3, "click"], [1, "text-xs", "text-slate-400", "mt-6"]],
        template: function ImageToPdfComponent_Template(rf, ctx) {
          if (rf & 1) {
            \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
            \u0275\u0275text(3, "\u{1F5BC}\uFE0F");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(4, "h1", 3);
            \u0275\u0275text(5, "Image to PDF");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(6, "p", 4);
            \u0275\u0275text(7, " Convert JPG, PNG, or WebP images into a single, polished PDF document. ");
            \u0275\u0275elementEnd()()();
            \u0275\u0275elementStart(8, "div", 5);
            \u0275\u0275template(9, ImageToPdfComponent_ng_container_9_Template, 6, 3, "ng-container", 6);
            \u0275\u0275template(10, ImageToPdfComponent_div_10_Template, 16, 3, "div", 7);
            \u0275\u0275elementEnd();
          }
          if (rf & 2) {
            \u0275\u0275advance(9);
            \u0275\u0275property("ngIf", ctx.step() === "upload" || ctx.step() === "options");
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.step() === "done" && ctx.result());
          }
        },
        dependencies: [CommonModule, NgForOf, NgIf, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, RangeValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, FileUploadComponent, ProgressBarComponent],
        styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2FwcC9mZWF0dXJlcy9pbWFnZS10by1wZGYvaW1hZ2UtdG8tcGRmLmNvbXBvbmVudC5jc3MiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIjpob3N0IHsgZGlzcGxheTogYmxvY2s7IH1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFBO0FBQVEsV0FBUztBQUFPOyIsCiAgIm5hbWVzIjogW10KfQo= */"],
        changeDetection: 0
      });
    }
  }
  return ImageToPdfComponent2;
})();
export {
  ImageToPdfComponent
};
//# sourceMappingURL=chunk-LJ7QKYFB.js.map
