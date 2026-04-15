import {
  AuthService
} from "./chunk-5HGKPEKX.js";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-WRRIZNNP.js";
import {
  DefaultValueAccessor,
  FormsModule,
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

// src/app/features/auth/login/login.component.ts
function LoginComponent__svg_svg_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 16);
    \u0275\u0275element(1, "circle", 17)(2, "path", 18);
    \u0275\u0275elementEnd();
  }
}
var LoginComponent = /* @__PURE__ */ (() => {
  class LoginComponent2 {
    constructor(auth, notify, router, route) {
      this.auth = auth;
      this.notify = notify;
      this.router = router;
      this.route = route;
      this.email = "";
      this.password = "";
      this.loading = signal(false);
    }
    onSubmit() {
      if (!this.email || !this.password) {
        this.notify.warning("Missing fields", "Please fill in all fields.");
        return;
      }
      this.loading.set(true);
      this.auth.login(this.email, this.password).subscribe({
        next: () => {
          this.notify.success("Welcome back!");
          const returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/dashboard";
          this.router.navigateByUrl(returnUrl);
        },
        error: (e) => {
          this.notify.error("Login failed", e.error?.message ?? "Invalid credentials");
          this.loading.set(false);
        }
      });
    }
    static {
      this.\u0275fac = function LoginComponent_Factory(t) {
        return new (t || LoginComponent2)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(NotificationService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ActivatedRoute));
      };
    }
    static {
      this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
        type: LoginComponent2,
        selectors: [["app-login"]],
        standalone: true,
        features: [\u0275\u0275StandaloneFeature],
        decls: 27,
        vars: 5,
        consts: [[1, "min-h-screen", "flex", "items-center", "justify-center", "bg-gradient-to-br", "from-slate-50", "to-blue-50", "dark:from-slate-900", "dark:to-slate-800", "px-4", "py-12"], [1, "w-full", "max-w-md"], [1, "card", "p-8", "animate-slide-up"], [1, "text-center", "mb-8"], [1, "w-14", "h-14", "bg-gradient-to-br", "from-primary-500", "to-primary-700", "rounded-2xl", "mx-auto", "mb-4", "flex", "items-center", "justify-center", "text-2xl", "shadow-md"], [1, "text-2xl", "font-bold", "text-slate-900", "dark:text-white"], [1, "text-slate-500", "dark:text-slate-400", "text-sm", "mt-1"], [1, "space-y-4", 3, "ngSubmit"], ["loginForm", "ngForm"], [1, "block", "text-sm", "font-medium", "text-slate-700", "dark:text-slate-300", "mb-1.5"], ["type", "email", "name", "email", "required", "", "placeholder", "you@example.com", "autocomplete", "email", 1, "input", 3, "ngModel", "ngModelChange"], ["type", "password", "name", "password", "required", "", "placeholder", "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", "autocomplete", "current-password", 1, "input", 3, "ngModel", "ngModelChange"], ["type", "submit", 1, "btn", "btn-primary", "w-full", "py-3", "text-base", "font-semibold", "mt-2", 3, "disabled"], ["class", "w-5 h-5 animate-spin", "fill", "none", "viewBox", "0 0 24 24", 4, "ngIf"], [1, "text-center", "text-sm", "text-slate-500", "dark:text-slate-400", "mt-6"], ["routerLink", "/register", 1, "text-primary-600", "font-medium", "hover:underline", "ml-1"], ["fill", "none", "viewBox", "0 0 24 24", 1, "w-5", "h-5", "animate-spin"], ["cx", "12", "cy", "12", "r", "10", "stroke", "currentColor", "stroke-width", "4", 1, "opacity-25"], ["fill", "currentColor", "d", "M4 12a8 8 0 018-8v8H4z", 1, "opacity-75"]],
        template: function LoginComponent_Template(rf, ctx) {
          if (rf & 1) {
            \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4);
            \u0275\u0275text(5, "\u26A1");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(6, "h1", 5);
            \u0275\u0275text(7, "Welcome back");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(8, "p", 6);
            \u0275\u0275text(9, "Sign in to your account");
            \u0275\u0275elementEnd()();
            \u0275\u0275elementStart(10, "form", 7, 8);
            \u0275\u0275listener("ngSubmit", function LoginComponent_Template_form_ngSubmit_10_listener() {
              return ctx.onSubmit();
            });
            \u0275\u0275elementStart(12, "div")(13, "label", 9);
            \u0275\u0275text(14, "Email address");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(15, "input", 10);
            \u0275\u0275listener("ngModelChange", function LoginComponent_Template_input_ngModelChange_15_listener($event) {
              return ctx.email = $event;
            });
            \u0275\u0275elementEnd()();
            \u0275\u0275elementStart(16, "div")(17, "label", 9);
            \u0275\u0275text(18, "Password");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(19, "input", 11);
            \u0275\u0275listener("ngModelChange", function LoginComponent_Template_input_ngModelChange_19_listener($event) {
              return ctx.password = $event;
            });
            \u0275\u0275elementEnd()();
            \u0275\u0275elementStart(20, "button", 12);
            \u0275\u0275template(21, LoginComponent__svg_svg_21_Template, 3, 0, "svg", 13);
            \u0275\u0275text(22);
            \u0275\u0275elementEnd()();
            \u0275\u0275elementStart(23, "p", 14);
            \u0275\u0275text(24, " Don't have an account? ");
            \u0275\u0275elementStart(25, "a", 15);
            \u0275\u0275text(26, "Sign up free");
            \u0275\u0275elementEnd()()()()();
          }
          if (rf & 2) {
            const _r0 = \u0275\u0275reference(11);
            \u0275\u0275advance(15);
            \u0275\u0275property("ngModel", ctx.email);
            \u0275\u0275advance(4);
            \u0275\u0275property("ngModel", ctx.password);
            \u0275\u0275advance(1);
            \u0275\u0275property("disabled", ctx.loading() || _r0.invalid);
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.loading());
            \u0275\u0275advance(1);
            \u0275\u0275textInterpolate1(" ", ctx.loading() ? "Signing in\u2026" : "Sign in", " ");
          }
        },
        dependencies: [CommonModule, NgIf, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm, RouterLink],
        encapsulation: 2
      });
    }
  }
  return LoginComponent2;
})();
export {
  LoginComponent
};
//# sourceMappingURL=chunk-7HUGELBQ.js.map
