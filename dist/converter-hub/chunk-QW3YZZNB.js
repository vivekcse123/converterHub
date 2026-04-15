import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-DFLTRQIA.js";
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
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-ZFM7PJ4E.js";
import "./chunk-SHAOKUVO.js";

// src/app/features/text-to-pdf/text-to-pdf.component.ts
function TextToPdfComponent_span_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "\u26A1 Convert to PDF");
    \u0275\u0275elementEnd();
  }
}
function TextToPdfComponent_span_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 14);
    \u0275\u0275element(2, "circle", 15)(3, "path", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, "Converting\u2026 ");
    \u0275\u0275elementEnd();
  }
}
function TextToPdfComponent_div_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17)(1, "div", 18);
    \u0275\u0275text(2, "\u2705");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h2", 19);
    \u0275\u0275text(4, "PDF ready!");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 20)(6, "a", 21);
    \u0275\u0275text(7, "\u2B07\uFE0F Download PDF");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 22);
    \u0275\u0275listener("click", function TextToPdfComponent_div_22_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.result.set(null));
    });
    \u0275\u0275text(9, "\u{1F504} New Text");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275property("href", ctx_r2.result().downloadUrl, \u0275\u0275sanitizeUrl)("download", ctx_r2.result().fileName);
  }
}
var TextToPdfComponent = /* @__PURE__ */ (() => {
  class TextToPdfComponent2 {
    constructor(converter, notify) {
      this.converter = converter;
      this.notify = notify;
      this.text = "";
      this.result = signal(null);
    }
    convert() {
      if (!this.text.trim())
        return;
      this.converter.textToPdf(this.text).subscribe({
        next: (r) => {
          this.result.set(r);
          this.notify.success("PDF ready!");
        },
        error: (e) => this.notify.error("Failed", e.error?.message)
      });
    }
    static {
      this.\u0275fac = function TextToPdfComponent_Factory(t) {
        return new (t || TextToPdfComponent2)(\u0275\u0275directiveInject(ConverterService), \u0275\u0275directiveInject(NotificationService));
      };
    }
    static {
      this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
        type: TextToPdfComponent2,
        selectors: [["app-text-to-pdf"]],
        standalone: true,
        features: [\u0275\u0275StandaloneFeature],
        decls: 23,
        vars: 6,
        consts: [[1, "bg-gradient-to-r", "from-amber-400", "to-orange-500", "text-white", "py-14"], [1, "container-app", "text-center"], [1, "w-16", "h-16", "mx-auto", "mb-5", "bg-white/20", "rounded-2xl", "flex", "items-center", "justify-center", "text-3xl"], [1, "text-3xl", "md:text-4xl", "font-extrabold", "mb-3"], [1, "text-amber-100", "text-lg", "max-w-md", "mx-auto"], [1, "container-app", "py-12", "max-w-2xl"], [1, "card", "p-6", "md:p-8"], [1, "block", "text-sm", "font-medium", "text-slate-600", "dark:text-slate-300", "mb-2"], ["rows", "12", "placeholder", "Paste or type your text here\u2026", 1, "input", "resize-none", "font-mono", "text-sm", "leading-relaxed", 3, "ngModel", "ngModelChange"], [1, "mt-2", "flex", "justify-between", "items-center", "text-xs", "text-slate-400"], [1, "hover:text-red-500", "transition-colors", 3, "click"], [1, "btn", "btn-primary", "btn-lg", "w-full", "mt-5", 3, "disabled", "click"], [4, "ngIf"], ["class", "card p-8 text-center mt-6 animate-bounce-in", 4, "ngIf"], ["fill", "none", "viewBox", "0 0 24 24", 1, "w-5", "h-5", "animate-spin", "inline", "mr-2"], ["cx", "12", "cy", "12", "r", "10", "stroke", "currentColor", "stroke-width", "4", 1, "opacity-25"], ["fill", "currentColor", "d", "M4 12a8 8 0 018-8v8H4z", 1, "opacity-75"], [1, "card", "p-8", "text-center", "mt-6", "animate-bounce-in"], [1, "text-5xl", "mb-4"], [1, "text-xl", "font-bold", "mb-4", "text-slate-800", "dark:text-white"], [1, "flex", "gap-3", "justify-center"], [1, "btn", "btn-primary", 3, "href", "download"], [1, "btn", "btn-secondary", 3, "click"]],
        template: function TextToPdfComponent_Template(rf, ctx) {
          if (rf & 1) {
            \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
            \u0275\u0275text(3, "\u{1F4C3}");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(4, "h1", 3);
            \u0275\u0275text(5, "Text to PDF");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(6, "p", 4);
            \u0275\u0275text(7, "Turn plain text into a clean, formatted PDF document.");
            \u0275\u0275elementEnd()()();
            \u0275\u0275elementStart(8, "div", 5)(9, "div", 6)(10, "label", 7);
            \u0275\u0275text(11, "Your text");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(12, "textarea", 8);
            \u0275\u0275listener("ngModelChange", function TextToPdfComponent_Template_textarea_ngModelChange_12_listener($event) {
              return ctx.text = $event;
            });
            \u0275\u0275text(13, "        ");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(14, "div", 9)(15, "span");
            \u0275\u0275text(16);
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(17, "button", 10);
            \u0275\u0275listener("click", function TextToPdfComponent_Template_button_click_17_listener() {
              return ctx.text = "";
            });
            \u0275\u0275text(18, "Clear");
            \u0275\u0275elementEnd()();
            \u0275\u0275elementStart(19, "button", 11);
            \u0275\u0275listener("click", function TextToPdfComponent_Template_button_click_19_listener() {
              return ctx.convert();
            });
            \u0275\u0275template(20, TextToPdfComponent_span_20_Template, 2, 0, "span", 12);
            \u0275\u0275template(21, TextToPdfComponent_span_21_Template, 5, 0, "span", 12);
            \u0275\u0275elementEnd()();
            \u0275\u0275template(22, TextToPdfComponent_div_22_Template, 10, 2, "div", 13);
            \u0275\u0275elementEnd();
          }
          if (rf & 2) {
            \u0275\u0275advance(12);
            \u0275\u0275property("ngModel", ctx.text);
            \u0275\u0275advance(4);
            \u0275\u0275textInterpolate1("", ctx.text.length, " characters");
            \u0275\u0275advance(3);
            \u0275\u0275property("disabled", !ctx.text.trim() || ctx.converter.isConverting());
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", !ctx.converter.isConverting());
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.converter.isConverting());
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.result());
          }
        },
        dependencies: [CommonModule, NgIf, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel],
        encapsulation: 2
      });
    }
  }
  return TextToPdfComponent2;
})();
export {
  TextToPdfComponent
};
//# sourceMappingURL=chunk-QW3YZZNB.js.map
