import {
  DefaultValueAccessor,
  FormsModule,
  MinValidator,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
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
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-ZFM7PJ4E.js";
import "./chunk-SHAOKUVO.js";

// src/app/features/image-editor/image-editor.component.ts
function ImageEditorComponent_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function ImageEditorComponent_button_10_Template_button_click_0_listener() {
      const restoredCtx = \u0275\u0275restoreView(_r5);
      const a_r3 = restoredCtx.$implicit;
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.setAction(a_r3.id));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r0.action() === a_r3.id ? "flex-1 py-2.5 px-4 rounded-xl bg-white dark:bg-slate-700 shadow text-sm font-semibold text-primary-600 transition-all" : "flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors");
    \u0275\u0275advance(1);
    \u0275\u0275textInterpolate2(" ", a_r3.icon, " ", a_r3.label, " ");
  }
}
function ImageEditorComponent_div_13_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18)(1, "div")(2, "label", 19);
    \u0275\u0275text(3, "Width (px)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 20);
    \u0275\u0275listener("ngModelChange", function ImageEditorComponent_div_13_div_1_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r12 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r12.width = $event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div")(6, "label", 19);
    \u0275\u0275text(7, "Height (px)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "input", 21);
    \u0275\u0275listener("ngModelChange", function ImageEditorComponent_div_13_div_1_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r14 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r14.height = $event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 22)(10, "label", 19);
    \u0275\u0275text(11, "Fit Mode");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "select", 23);
    \u0275\u0275listener("ngModelChange", function ImageEditorComponent_div_13_div_1_Template_select_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r15 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r15.fit = $event);
    });
    \u0275\u0275elementStart(13, "option", 24);
    \u0275\u0275text(14, "Fit inside (preserve aspect ratio)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "option", 25);
    \u0275\u0275text(16, "Cover (crop to fill)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "option", 26);
    \u0275\u0275text(18, "Stretch to fill");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r6 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", ctx_r6.width);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", ctx_r6.height);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", ctx_r6.fit);
  }
}
function ImageEditorComponent_div_13_div_2_option_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r17 = ctx.$implicit;
    \u0275\u0275property("value", f_r17);
    \u0275\u0275advance(1);
    \u0275\u0275textInterpolate(f_r17.toUpperCase());
  }
}
function ImageEditorComponent_div_13_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "label", 19);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 27);
    \u0275\u0275listener("ngModelChange", function ImageEditorComponent_div_13_div_2_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r19);
      const ctx_r18 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r18.quality = $event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "label", 19);
    \u0275\u0275text(5, "Output Format");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "select", 23);
    \u0275\u0275listener("ngModelChange", function ImageEditorComponent_div_13_div_2_Template_select_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r19);
      const ctx_r20 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r20.format = $event);
    });
    \u0275\u0275template(7, ImageEditorComponent_div_13_div_2_option_7_Template, 2, 2, "option", 28);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r7 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Quality: ", ctx_r7.quality, "% ");
    \u0275\u0275advance(1);
    \u0275\u0275property("ngModel", ctx_r7.quality);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngModel", ctx_r7.format);
    \u0275\u0275advance(1);
    \u0275\u0275property("ngForOf", ctx_r7.formats);
  }
}
function ImageEditorComponent_div_13_div_3_option_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r22 = ctx.$implicit;
    \u0275\u0275property("value", f_r22);
    \u0275\u0275advance(1);
    \u0275\u0275textInterpolate(f_r22.toUpperCase());
  }
}
function ImageEditorComponent_div_13_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "label", 19);
    \u0275\u0275text(2, "Convert to");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 23);
    \u0275\u0275listener("ngModelChange", function ImageEditorComponent_div_13_div_3_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r24);
      const ctx_r23 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r23.targetFormat = $event);
    });
    \u0275\u0275template(4, ImageEditorComponent_div_13_div_3_option_4_Template, 2, 2, "option", 28);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r8 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngModel", ctx_r8.targetFormat);
    \u0275\u0275advance(1);
    \u0275\u0275property("ngForOf", ctx_r8.formats);
  }
}
function ImageEditorComponent_div_13_span_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "\u26A1 Apply");
    \u0275\u0275elementEnd();
  }
}
function ImageEditorComponent_div_13_span_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Processing\u2026");
    \u0275\u0275elementEnd();
  }
}
function ImageEditorComponent_div_13_app_progress_bar_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-progress-bar", 29);
  }
  if (rf & 2) {
    const ctx_r11 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", ctx_r11.converter.uploadProgress());
  }
}
function ImageEditorComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275template(1, ImageEditorComponent_div_13_div_1_Template, 19, 3, "div", 14);
    \u0275\u0275template(2, ImageEditorComponent_div_13_div_2_Template, 8, 4, "div", 15);
    \u0275\u0275template(3, ImageEditorComponent_div_13_div_3_Template, 5, 2, "div", 15);
    \u0275\u0275elementStart(4, "button", 16);
    \u0275\u0275listener("click", function ImageEditorComponent_div_13_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r26);
      const ctx_r25 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r25.convert());
    });
    \u0275\u0275template(5, ImageEditorComponent_div_13_span_5_Template, 2, 0, "span", 15);
    \u0275\u0275template(6, ImageEditorComponent_div_13_span_6_Template, 2, 0, "span", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, ImageEditorComponent_div_13_app_progress_bar_7_Template, 1, 1, "app-progress-bar", 17);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(1);
    \u0275\u0275property("ngIf", ctx_r1.action() === "resize");
    \u0275\u0275advance(1);
    \u0275\u0275property("ngIf", ctx_r1.action() === "compress");
    \u0275\u0275advance(1);
    \u0275\u0275property("ngIf", ctx_r1.action() === "convert");
    \u0275\u0275advance(1);
    \u0275\u0275property("disabled", ctx_r1.converter.isConverting());
    \u0275\u0275advance(1);
    \u0275\u0275property("ngIf", !ctx_r1.converter.isConverting());
    \u0275\u0275advance(1);
    \u0275\u0275property("ngIf", ctx_r1.converter.isConverting());
    \u0275\u0275advance(1);
    \u0275\u0275property("ngIf", ctx_r1.converter.isConverting());
  }
}
function ImageEditorComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 30)(1, "div", 31);
    \u0275\u0275text(2, "\u2705");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h2", 32);
    \u0275\u0275text(4, "Image processed!");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 33)(6, "a", 34);
    \u0275\u0275text(7, "\u2B07\uFE0F Download");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 35);
    \u0275\u0275listener("click", function ImageEditorComponent_div_14_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r28);
      const ctx_r27 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r27.reset());
    });
    \u0275\u0275text(9, "\u{1F504} Edit Another");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275property("href", ctx_r2.result().downloadUrl, \u0275\u0275sanitizeUrl)("download", ctx_r2.result().fileName);
  }
}
var ImageEditorComponent = /* @__PURE__ */ (() => {
  class ImageEditorComponent2 {
    constructor(converter, notify) {
      this.converter = converter;
      this.notify = notify;
      this.action = signal("resize");
      this.file = signal(null);
      this.result = signal(null);
      this.width = "";
      this.height = "";
      this.fit = "inside";
      this.quality = 75;
      this.format = "jpeg";
      this.targetFormat = "jpeg";
      this.actions = [{
        id: "resize",
        label: "Resize",
        icon: "\u2194\uFE0F"
      }, {
        id: "compress",
        label: "Compress",
        icon: "\u{1F5DC}\uFE0F"
      }, {
        id: "convert",
        label: "Convert",
        icon: "\u{1F504}"
      }];
      this.formats = ["jpeg", "png", "webp", "bmp"];
    }
    setAction(a) {
      this.action.set(a);
      this.file.set(null);
      this.result.set(null);
    }
    onFile(files) {
      this.file.set(files[0] ?? null);
      this.result.set(null);
    }
    convert() {
      const f = this.file();
      if (!f)
        return;
      const a = this.action();
      const obs = a === "resize" ? this.converter.imageResize(f, {
        width: this.width,
        height: this.height,
        fit: this.fit
      }) : a === "compress" ? this.converter.imageCompress(f, {
        quality: String(this.quality),
        format: this.format
      }) : this.converter.imageConvert(f, this.targetFormat);
      obs.subscribe({
        next: (r) => {
          this.result.set(r);
          this.notify.success("Done!");
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
      this.\u0275fac = function ImageEditorComponent_Factory(t) {
        return new (t || ImageEditorComponent2)(\u0275\u0275directiveInject(ConverterService), \u0275\u0275directiveInject(NotificationService));
      };
    }
    static {
      this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
        type: ImageEditorComponent2,
        selectors: [["app-image-editor"]],
        standalone: true,
        features: [\u0275\u0275StandaloneFeature],
        decls: 15,
        vars: 5,
        consts: [[1, "bg-gradient-to-r", "from-pink-500", "to-rose-500", "text-white", "py-14"], [1, "container-app", "text-center"], [1, "w-16", "h-16", "mx-auto", "mb-5", "bg-white/20", "rounded-2xl", "flex", "items-center", "justify-center", "text-3xl"], [1, "text-3xl", "md:text-4xl", "font-extrabold", "mb-3"], [1, "text-pink-100", "text-lg", "max-w-md", "mx-auto"], [1, "container-app", "py-12", "max-w-2xl"], [1, "flex", "gap-2", "mb-8", "p-1", "bg-slate-100", "dark:bg-slate-800", "rounded-2xl"], [3, "class", "click", 4, "ngFor", "ngForOf"], [1, "card", "p-6", "md:p-8"], ["accept", "image/jpeg,image/png,image/webp,image/gif,image/bmp", "label", "Drop an image here", 3, "multiple", "maxSizeMB", "filesSelected"], ["class", "mt-6 space-y-4 animate-fade-in", 4, "ngIf"], ["class", "card p-8 text-center mt-6 animate-bounce-in", 4, "ngIf"], [3, "click"], [1, "mt-6", "space-y-4", "animate-fade-in"], ["class", "grid grid-cols-2 gap-4", 4, "ngIf"], [4, "ngIf"], [1, "btn", "btn-primary", "btn-lg", "w-full", "mt-2", 3, "disabled", "click"], [3, "value", 4, "ngIf"], [1, "grid", "grid-cols-2", "gap-4"], [1, "block", "text-sm", "font-medium", "text-slate-600", "dark:text-slate-300", "mb-1"], ["type", "number", "min", "1", "placeholder", "e.g. 1920", 1, "input", 3, "ngModel", "ngModelChange"], ["type", "number", "min", "1", "placeholder", "e.g. 1080", 1, "input", 3, "ngModel", "ngModelChange"], [1, "col-span-2"], [1, "input", 3, "ngModel", "ngModelChange"], ["value", "inside"], ["value", "cover"], ["value", "fill"], ["type", "range", "min", "10", "max", "100", 1, "w-full", "accent-primary-600", "mb-4", 3, "ngModel", "ngModelChange"], [3, "value", 4, "ngFor", "ngForOf"], [3, "value"], [1, "card", "p-8", "text-center", "mt-6", "animate-bounce-in"], [1, "text-5xl", "mb-4"], [1, "text-xl", "font-bold", "mb-4", "text-slate-800", "dark:text-white"], [1, "flex", "gap-3", "justify-center"], [1, "btn", "btn-primary", 3, "href", "download"], [1, "btn", "btn-secondary", 3, "click"]],
        template: function ImageEditorComponent_Template(rf, ctx) {
          if (rf & 1) {
            \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
            \u0275\u0275text(3, "\u{1F3A8}");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(4, "h1", 3);
            \u0275\u0275text(5, "Image Editor");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(6, "p", 4);
            \u0275\u0275text(7, "Resize, compress, or convert your images.");
            \u0275\u0275elementEnd()()();
            \u0275\u0275elementStart(8, "div", 5)(9, "div", 6);
            \u0275\u0275template(10, ImageEditorComponent_button_10_Template, 2, 4, "button", 7);
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(11, "div", 8)(12, "app-file-upload", 9);
            \u0275\u0275listener("filesSelected", function ImageEditorComponent_Template_app_file_upload_filesSelected_12_listener($event) {
              return ctx.onFile($event);
            });
            \u0275\u0275elementEnd();
            \u0275\u0275template(13, ImageEditorComponent_div_13_Template, 8, 7, "div", 10);
            \u0275\u0275elementEnd();
            \u0275\u0275template(14, ImageEditorComponent_div_14_Template, 10, 2, "div", 11);
            \u0275\u0275elementEnd();
          }
          if (rf & 2) {
            \u0275\u0275advance(10);
            \u0275\u0275property("ngForOf", ctx.actions);
            \u0275\u0275advance(2);
            \u0275\u0275property("multiple", false)("maxSizeMB", 50);
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.file());
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.result());
          }
        },
        dependencies: [CommonModule, NgForOf, NgIf, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, RangeValueAccessor, SelectControlValueAccessor, NgControlStatus, MinValidator, NgModel, FileUploadComponent, ProgressBarComponent],
        encapsulation: 2
      });
    }
  }
  return ImageEditorComponent2;
})();
export {
  ImageEditorComponent
};
//# sourceMappingURL=chunk-KQBGUEX5.js.map
