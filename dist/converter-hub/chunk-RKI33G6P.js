import {
  AuthService
} from "./chunk-5HGKPEKX.js";
import {
  Router,
  RouterLink
} from "./chunk-WRRIZNNP.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MinLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-DFLTRQIA.js";
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
  ɵɵlistener,
  ɵɵnamespaceSVG,
  ɵɵproperty,
  ɵɵreference,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-ZFM7PJ4E.js";
import "./chunk-SHAOKUVO.js";

// src/app/features/auth/register/register.component.ts
function RegisterComponent__svg_svg_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 17);
    \u0275\u0275element(1, "circle", 18)(2, "path", 19);
    \u0275\u0275elementEnd();
  }
}
var RegisterComponent = /* @__PURE__ */ (() => {
  class RegisterComponent2 {
    constructor(auth, notify, router) {
      this.auth = auth;
      this.notify = notify;
      this.router = router;
      this.name = "";
      this.email = "";
      this.password = "";
      this.loading = signal(false);
    }
    onSubmit() {
      this.loading.set(true);
      this.auth.register(this.name, this.email, this.password).subscribe({
        next: () => {
          this.notify.success("Account created!", "Welcome to ConverterHub.");
          this.router.navigate(["/dashboard"]);
        },
        error: (e) => {
          this.notify.error("Registration failed", e.error?.message ?? "Please try again.");
          this.loading.set(false);
        }
      });
    }
    static {
      this.\u0275fac = function RegisterComponent_Factory(t) {
        return new (t || RegisterComponent2)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(NotificationService), \u0275\u0275directiveInject(Router));
      };
    }
    static {
      this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
        type: RegisterComponent2,
        selectors: [["app-register"]],
        standalone: true,
        features: [\u0275\u0275StandaloneFeature],
        decls: 31,
        vars: 6,
        consts: [[1, "min-h-screen", "flex", "items-center", "justify-center", "bg-gradient-to-br", "from-slate-50", "to-blue-50", "dark:from-slate-900", "dark:to-slate-800", "px-4", "py-12"], [1, "w-full", "max-w-md"], [1, "card", "p-8", "animate-slide-up"], [1, "text-center", "mb-8"], [1, "w-14", "h-14", "bg-gradient-to-br", "from-primary-500", "to-primary-700", "rounded-2xl", "mx-auto", "mb-4", "flex", "items-center", "justify-center", "text-2xl", "shadow-md"], [1, "text-2xl", "font-bold", "text-slate-900", "dark:text-white"], [1, "text-slate-500", "dark:text-slate-400", "text-sm", "mt-1"], [1, "space-y-4", 3, "ngSubmit"], ["regForm", "ngForm"], [1, "block", "text-sm", "font-medium", "text-slate-700", "dark:text-slate-300", "mb-1.5"], ["type", "text", "name", "name", "required", "", "minlength", "2", "placeholder", "Jane Smith", "autocomplete", "name", 1, "input", 3, "ngModel", "ngModelChange"], ["type", "email", "name", "email", "required", "", "placeholder", "you@example.com", "autocomplete", "email", 1, "input", 3, "ngModel", "ngModelChange"], ["type", "password", "name", "password", "required", "", "minlength", "8", "placeholder", "At least 8 characters", "autocomplete", "new-password", 1, "input", 3, "ngModel", "ngModelChange"], ["type", "submit", 1, "btn", "btn-primary", "w-full", "py-3", "text-base", "font-semibold", "mt-2", 3, "disabled"], ["class", "w-5 h-5 animate-spin", "fill", "none", "viewBox", "0 0 24 24", 4, "ngIf"], [1, "text-center", "text-sm", "text-slate-500", "dark:text-slate-400", "mt-6"], ["routerLink", "/login", 1, "text-primary-600", "font-medium", "hover:underline", "ml-1"], ["fill", "none", "viewBox", "0 0 24 24", 1, "w-5", "h-5", "animate-spin"], ["cx", "12", "cy", "12", "r", "10", "stroke", "currentColor", "stroke-width", "4", 1, "opacity-25"], ["fill", "currentColor", "d", "M4 12a8 8 0 018-8v8H4z", 1, "opacity-75"]],
        template: function RegisterComponent_Template(rf, ctx) {
          if (rf & 1) {
            \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4);
            \u0275\u0275text(5, "\u26A1");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(6, "h1", 5);
            \u0275\u0275text(7, "Create an account");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(8, "p", 6);
            \u0275\u0275text(9, "Free forever. No credit card needed.");
            \u0275\u0275elementEnd()();
            \u0275\u0275elementStart(10, "form", 7, 8);
            \u0275\u0275listener("ngSubmit", function RegisterComponent_Template_form_ngSubmit_10_listener() {
              return ctx.onSubmit();
            });
            \u0275\u0275elementStart(12, "div")(13, "label", 9);
            \u0275\u0275text(14, "Full name");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(15, "input", 10);
            \u0275\u0275listener("ngModelChange", function RegisterComponent_Template_input_ngModelChange_15_listener($event) {
              return ctx.name = $event;
            });
            \u0275\u0275elementEnd()();
            \u0275\u0275elementStart(16, "div")(17, "label", 9);
            \u0275\u0275text(18, "Email address");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(19, "input", 11);
            \u0275\u0275listener("ngModelChange", function RegisterComponent_Template_input_ngModelChange_19_listener($event) {
              return ctx.email = $event;
            });
            \u0275\u0275elementEnd()();
            \u0275\u0275elementStart(20, "div")(21, "label", 9);
            \u0275\u0275text(22, "Password");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(23, "input", 12);
            \u0275\u0275listener("ngModelChange", function RegisterComponent_Template_input_ngModelChange_23_listener($event) {
              return ctx.password = $event;
            });
            \u0275\u0275elementEnd()();
            \u0275\u0275elementStart(24, "button", 13);
            \u0275\u0275template(25, RegisterComponent__svg_svg_25_Template, 3, 0, "svg", 14);
            \u0275\u0275text(26);
            \u0275\u0275elementEnd()();
            \u0275\u0275elementStart(27, "p", 15);
            \u0275\u0275text(28, " Already have an account? ");
            \u0275\u0275elementStart(29, "a", 16);
            \u0275\u0275text(30, "Sign in");
            \u0275\u0275elementEnd()()()()();
          }
          if (rf & 2) {
            const _r0 = \u0275\u0275reference(11);
            \u0275\u0275advance(15);
            \u0275\u0275property("ngModel", ctx.name);
            \u0275\u0275advance(4);
            \u0275\u0275property("ngModel", ctx.email);
            \u0275\u0275advance(4);
            \u0275\u0275property("ngModel", ctx.password);
            \u0275\u0275advance(1);
            \u0275\u0275property("disabled", ctx.loading() || _r0.invalid);
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.loading());
            \u0275\u0275advance(1);
            \u0275\u0275textInterpolate1(" ", ctx.loading() ? "Creating account\u2026" : "Create account", " ");
          }
        },
        dependencies: [CommonModule, NgIf, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinLengthValidator, NgModel, NgForm, RouterLink],
        encapsulation: 2
      });
    }
  }
  return RegisterComponent2;
})();
export {
  RegisterComponent
};
//# sourceMappingURL=chunk-RKI33G6P.js.map
