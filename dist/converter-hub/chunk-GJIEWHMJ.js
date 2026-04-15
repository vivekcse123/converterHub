import {
  RouterLink
} from "./chunk-WRRIZNNP.js";
import {
  ɵɵStandaloneFeature,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-ZFM7PJ4E.js";
import "./chunk-SHAOKUVO.js";

// src/app/features/not-found/not-found.component.ts
var NotFoundComponent = /* @__PURE__ */ (() => {
  class NotFoundComponent2 {
    static {
      this.\u0275fac = function NotFoundComponent_Factory(t) {
        return new (t || NotFoundComponent2)();
      };
    }
    static {
      this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
        type: NotFoundComponent2,
        selectors: [["app-not-found"]],
        standalone: true,
        features: [\u0275\u0275StandaloneFeature],
        decls: 10,
        vars: 0,
        consts: [[1, "min-h-[70vh]", "flex", "items-center", "justify-center", "px-4"], [1, "text-center", "animate-bounce-in"], [1, "text-8xl", "font-black", "text-primary-600", "dark:text-primary-400"], [1, "text-2xl", "font-bold", "text-slate-800", "dark:text-white", "mt-4", "mb-2"], [1, "text-slate-500", "dark:text-slate-400", "mb-8"], ["routerLink", "/", 1, "btn", "btn-primary", "btn-lg"]],
        template: function NotFoundComponent_Template(rf, ctx) {
          if (rf & 1) {
            \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "p", 2);
            \u0275\u0275text(3, "404");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(4, "h1", 3);
            \u0275\u0275text(5, "Page not found");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(6, "p", 4);
            \u0275\u0275text(7, "The page you're looking for doesn't exist.");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(8, "a", 5);
            \u0275\u0275text(9, "\u2190 Back to Home");
            \u0275\u0275elementEnd()()();
          }
        },
        dependencies: [RouterLink],
        encapsulation: 2
      });
    }
  }
  return NotFoundComponent2;
})();
export {
  NotFoundComponent
};
//# sourceMappingURL=chunk-GJIEWHMJ.js.map
