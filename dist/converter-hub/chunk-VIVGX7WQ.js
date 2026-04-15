import {
  CommonModule,
  EventEmitter,
  NgForOf,
  NgIf,
  signal,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-ZFM7PJ4E.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-SHAOKUVO.js";

// src/app/shared/components/file-upload/file-upload.component.ts
function FileUploadComponent_p_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(1);
    \u0275\u0275textInterpolate(ctx_r1.sublabel);
  }
}
function FileUploadComponent_p_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 13);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 14);
    \u0275\u0275element(2, "path", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r2.error(), "\n");
  }
}
function FileUploadComponent_div_13_div_6_img_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 31);
  }
  if (rf & 2) {
    const uf_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", uf_r5.preview, \u0275\u0275sanitizeUrl);
  }
}
function FileUploadComponent_div_13_div_6_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 32);
    \u0275\u0275element(1, "path", 33);
    \u0275\u0275elementEnd();
  }
}
function FileUploadComponent_div_13_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 21)(1, "div", 22);
    \u0275\u0275template(2, FileUploadComponent_div_13_div_6_img_2_Template, 1, 1, "img", 23);
    \u0275\u0275template(3, FileUploadComponent_div_13_div_6_ng_template_3_Template, 2, 0, "ng-template", null, 24, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 25)(6, "p", 26);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 27);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "button", 28);
    \u0275\u0275listener("click", function FileUploadComponent_div_13_div_6_Template_button_click_10_listener($event) {
      const restoredCtx = \u0275\u0275restoreView(_r11);
      const uf_r5 = restoredCtx.$implicit;
      const ctx_r10 = \u0275\u0275nextContext(2);
      ctx_r10.removeFile(uf_r5.id);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(11, "svg", 29);
    \u0275\u0275element(12, "path", 30);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const uf_r5 = ctx.$implicit;
    const _r7 = \u0275\u0275reference(4);
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", uf_r5.preview)("ngIfElse", _r7);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(uf_r5.file.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r4.formatSize(uf_r5.file.size));
  }
}
function FileUploadComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16)(1, "div", 17)(2, "span", 18);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 19);
    \u0275\u0275listener("click", function FileUploadComponent_div_13_Template_button_click_4_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r12 = \u0275\u0275nextContext();
      ctx_r12.clearAll();
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275text(5, " Clear all ");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, FileUploadComponent_div_13_div_6_Template, 13, 4, "div", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", ctx_r3.uploadedFiles().length, " file", ctx_r3.uploadedFiles().length > 1 ? "s" : "", " selected ");
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r3.uploadedFiles());
  }
}
var FileUploadComponent = /* @__PURE__ */ (() => {
  class FileUploadComponent2 {
    constructor() {
      this.accept = "*/*";
      this.multiple = false;
      this.maxSizeMB = 50;
      this.label = "Drop files here or click to browse";
      this.sublabel = "";
      this.filesSelected = new EventEmitter();
      this.fileRemoved = new EventEmitter();
      this.isDragging = signal(false);
      this.uploadedFiles = signal([]);
      this.error = signal(null);
    }
    onDragOver(e) {
      e.preventDefault();
      this.isDragging.set(true);
    }
    onDragLeave() {
      this.isDragging.set(false);
    }
    onDrop(e) {
      e.preventDefault();
      this.isDragging.set(false);
      const files = Array.from(e.dataTransfer?.files ?? []);
      this.processFiles(files);
    }
    onFileInputChange(event) {
      const input = event.target;
      this.processFiles(Array.from(input.files ?? []));
      input.value = "";
    }
    removeFile(id) {
      this.uploadedFiles.update((files) => files.filter((f) => f.id !== id));
      this.fileRemoved.emit(id);
      this.filesSelected.emit(this.uploadedFiles().map((uf) => uf.file));
    }
    clearAll() {
      this.uploadedFiles.set([]);
      this.filesSelected.emit([]);
    }
    processFiles(files) {
      this.error.set(null);
      const maxBytes = this.maxSizeMB * 1024 * 1024;
      const valid = files.filter((f) => {
        if (f.size > maxBytes) {
          this.error.set(`"${f.name}" exceeds ${this.maxSizeMB} MB limit.`);
          return false;
        }
        return true;
      });
      if (!valid.length)
        return;
      const toAdd = valid.map((f) => ({
        file: f,
        id: `${Date.now()}-${Math.random()}`,
        preview: void 0
      }));
      if (!this.multiple) {
        this.uploadedFiles.set(toAdd.slice(0, 1));
      } else {
        this.uploadedFiles.update((cur) => [...cur, ...toAdd]);
      }
      toAdd.forEach((uf) => {
        if (uf.file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.uploadedFiles.update((list) => list.map((f) => f.id === uf.id ? __spreadProps(__spreadValues({}, f), {
              preview: e.target?.result
            }) : f));
          };
          reader.readAsDataURL(uf.file);
        }
      });
      this.filesSelected.emit(this.uploadedFiles().map((uf) => uf.file));
    }
    formatSize(bytes) {
      if (bytes < 1024)
        return `${bytes} B`;
      if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    static {
      this.\u0275fac = function FileUploadComponent_Factory(t) {
        return new (t || FileUploadComponent2)();
      };
    }
    static {
      this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
        type: FileUploadComponent2,
        selectors: [["app-file-upload"]],
        hostBindings: function FileUploadComponent_HostBindings(rf, ctx) {
          if (rf & 1) {
            \u0275\u0275listener("dragover", function FileUploadComponent_dragover_HostBindingHandler($event) {
              return ctx.onDragOver($event);
            })("dragleave", function FileUploadComponent_dragleave_HostBindingHandler() {
              return ctx.onDragLeave();
            })("drop", function FileUploadComponent_drop_HostBindingHandler($event) {
              return ctx.onDrop($event);
            });
          }
        },
        inputs: {
          accept: "accept",
          multiple: "multiple",
          maxSizeMB: "maxSizeMB",
          label: "label",
          sublabel: "sublabel"
        },
        outputs: {
          filesSelected: "filesSelected",
          fileRemoved: "fileRemoved"
        },
        standalone: true,
        features: [\u0275\u0275StandaloneFeature],
        decls: 14,
        vars: 11,
        consts: [[1, "drop-zone", "min-h-[220px]", "p-8", "relative", 3, "click"], ["type", "file", 3, "accept", "multiple", "change"], ["fileInput", ""], [1, "text-center", "pointer-events-none"], [1, "transition-transform", "duration-200"], ["fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", 1, "w-8", "h-8", "text-primary-500"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "1.5", "d", "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"], [1, "font-semibold", "text-slate-700", "dark:text-slate-200", "text-lg", "mb-1"], ["class", "text-sm text-slate-500 dark:text-slate-400 mb-2", 4, "ngIf"], [1, "text-xs", "text-slate-400", "dark:text-slate-500"], ["class", "mt-2 text-sm text-red-500 flex items-center gap-1.5", 4, "ngIf"], ["class", "mt-4 space-y-2 animate-fade-in", 4, "ngIf"], [1, "text-sm", "text-slate-500", "dark:text-slate-400", "mb-2"], [1, "mt-2", "text-sm", "text-red-500", "flex", "items-center", "gap-1.5"], ["fill", "currentColor", "viewBox", "0 0 20 20", 1, "w-4", "h-4", "flex-shrink-0"], ["fill-rule", "evenodd", "d", "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", "clip-rule", "evenodd"], [1, "mt-4", "space-y-2", "animate-fade-in"], [1, "flex", "items-center", "justify-between", "mb-2"], [1, "text-sm", "font-medium", "text-slate-600", "dark:text-slate-300"], [1, "text-xs", "text-red-500", "hover:text-red-700", "transition-colors", 3, "click"], ["class", "flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 group", 4, "ngFor", "ngForOf"], [1, "flex", "items-center", "gap-3", "p-3", "bg-slate-50", "dark:bg-slate-800", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "group"], [1, "w-10", "h-10", "rounded-lg", "overflow-hidden", "flex-shrink-0", "bg-white", "dark:bg-slate-700", "border", "border-slate-200", "dark:border-slate-600", "flex", "items-center", "justify-center"], ["alt", "", "class", "w-full h-full object-cover", 3, "src", 4, "ngIf", "ngIfElse"], ["fileIcon", ""], [1, "flex-1", "min-w-0"], [1, "text-sm", "font-medium", "text-slate-700", "dark:text-slate-200", "truncate"], [1, "text-xs", "text-slate-400"], [1, "p-1.5", "rounded-lg", "opacity-0", "group-hover:opacity-100", "hover:bg-red-50", "dark:hover:bg-red-950/30", "text-slate-400", "hover:text-red-500", "transition-all", 3, "click"], ["fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", 1, "w-4", "h-4"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M6 18L18 6M6 6l12 12"], ["alt", "", 1, "w-full", "h-full", "object-cover", 3, "src"], ["fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", 1, "w-5", "h-5", "text-slate-400"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "1.5", "d", "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"]],
        template: function FileUploadComponent_Template(rf, ctx) {
          if (rf & 1) {
            const _r14 = \u0275\u0275getCurrentView();
            \u0275\u0275elementStart(0, "div", 0);
            \u0275\u0275listener("click", function FileUploadComponent_Template_div_click_0_listener() {
              \u0275\u0275restoreView(_r14);
              const _r0 = \u0275\u0275reference(2);
              return \u0275\u0275resetView(_r0.click());
            });
            \u0275\u0275elementStart(1, "input", 1, 2);
            \u0275\u0275listener("change", function FileUploadComponent_Template_input_change_1_listener($event) {
              return ctx.onFileInputChange($event);
            });
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(3, "div", 3)(4, "div", 4);
            \u0275\u0275namespaceSVG();
            \u0275\u0275elementStart(5, "svg", 5);
            \u0275\u0275element(6, "path", 6);
            \u0275\u0275elementEnd()();
            \u0275\u0275namespaceHTML();
            \u0275\u0275elementStart(7, "p", 7);
            \u0275\u0275text(8);
            \u0275\u0275elementEnd();
            \u0275\u0275template(9, FileUploadComponent_p_9_Template, 2, 1, "p", 8);
            \u0275\u0275elementStart(10, "p", 9);
            \u0275\u0275text(11);
            \u0275\u0275elementEnd()()();
            \u0275\u0275template(12, FileUploadComponent_p_12_Template, 4, 1, "p", 10);
            \u0275\u0275template(13, FileUploadComponent_div_13_Template, 7, 3, "div", 11);
          }
          if (rf & 2) {
            \u0275\u0275classProp("drop-zone-active", ctx.isDragging());
            \u0275\u0275advance(1);
            \u0275\u0275property("accept", ctx.accept)("multiple", ctx.multiple);
            \u0275\u0275advance(3);
            \u0275\u0275classProp("scale-110", ctx.isDragging());
            \u0275\u0275advance(4);
            \u0275\u0275textInterpolate(ctx.label);
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.sublabel);
            \u0275\u0275advance(2);
            \u0275\u0275textInterpolate1("Maximum file size: ", ctx.maxSizeMB, " MB");
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.error());
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.uploadedFiles().length);
          }
        },
        dependencies: [CommonModule, NgForOf, NgIf],
        styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2FwcC9zaGFyZWQvY29tcG9uZW50cy9maWxlLXVwbG9hZC9maWxlLXVwbG9hZC5jb21wb25lbnQuY3NzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyI6aG9zdCB7IGRpc3BsYXk6IGJsb2NrOyB9XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBQTtBQUFRLFdBQVM7QUFBTzsiLAogICJuYW1lcyI6IFtdCn0K */"],
        changeDetection: 0
      });
    }
  }
  return FileUploadComponent2;
})();

// src/app/shared/components/progress-bar/progress-bar.component.ts
function ProgressBarComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 3);
    \u0275\u0275element(7, "div", 4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r0.value, "%");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r0.value, "%");
  }
}
var ProgressBarComponent = /* @__PURE__ */ (() => {
  class ProgressBarComponent2 {
    constructor() {
      this.value = 0;
      this.label = "Processing\u2026";
      this.visible = true;
    }
    static {
      this.\u0275fac = function ProgressBarComponent_Factory(t) {
        return new (t || ProgressBarComponent2)();
      };
    }
    static {
      this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
        type: ProgressBarComponent2,
        selectors: [["app-progress-bar"]],
        inputs: {
          value: "value",
          label: "label",
          visible: "visible"
        },
        standalone: true,
        features: [\u0275\u0275StandaloneFeature],
        decls: 1,
        vars: 1,
        consts: [["class", "w-full animate-fade-in", 4, "ngIf"], [1, "w-full", "animate-fade-in"], [1, "flex", "justify-between", "text-xs", "text-slate-500", "dark:text-slate-400", "mb-1.5"], [1, "w-full", "h-2.5", "bg-slate-200", "dark:bg-slate-700", "rounded-full", "overflow-hidden"], [1, "progress-bar", "h-full", "rounded-full", "bg-gradient-to-r", "from-primary-500", "to-primary-600"]],
        template: function ProgressBarComponent_Template(rf, ctx) {
          if (rf & 1) {
            \u0275\u0275template(0, ProgressBarComponent_div_0_Template, 8, 4, "div", 0);
          }
          if (rf & 2) {
            \u0275\u0275property("ngIf", ctx.visible);
          }
        },
        dependencies: [CommonModule, NgIf],
        encapsulation: 2,
        changeDetection: 0
      });
    }
  }
  return ProgressBarComponent2;
})();

export {
  FileUploadComponent,
  ProgressBarComponent
};
//# sourceMappingURL=chunk-VIVGX7WQ.js.map
