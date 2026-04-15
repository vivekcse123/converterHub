import {
  AuthService
} from "./chunk-5HGKPEKX.js";
import {
  RouterLink
} from "./chunk-WRRIZNNP.js";
import {
  ApiService,
  NotificationService
} from "./chunk-RTBSWPYX.js";
import {
  CommonModule,
  DatePipe,
  NgForOf,
  NgIf,
  TitleCasePipe,
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
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-ZFM7PJ4E.js";
import "./chunk-SHAOKUVO.js";

// src/app/features/dashboard/dashboard.component.ts
function DashboardComponent_div_42_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 21);
  }
}
var _c0 = function() {
  return [1, 2, 3, 4, 5];
};
function DashboardComponent_div_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275template(1, DashboardComponent_div_42_div_1_Template, 1, 0, "div", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(1);
    \u0275\u0275property("ngForOf", \u0275\u0275pureFunction0(1, _c0));
  }
}
function DashboardComponent_div_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "p", 23);
    \u0275\u0275text(2, "\u{1F4ED}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 24);
    \u0275\u0275text(4, "No conversions yet");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "a", 25);
    \u0275\u0275text(6, "Start Converting");
    \u0275\u0275elementEnd()();
  }
}
function DashboardComponent_div_44_tr_14_span_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 44);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const entry_r6 = \u0275\u0275nextContext().$implicit;
    let tmp_0_0;
    \u0275\u0275advance(1);
    \u0275\u0275textInterpolate1(" +", ((tmp_0_0 = entry_r6.inputFiles == null ? null : entry_r6.inputFiles.length) !== null && tmp_0_0 !== void 0 ? tmp_0_0 : 0) - 1, " more ");
  }
}
function DashboardComponent_div_44_tr_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 33)(1, "td", 34);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 35);
    \u0275\u0275text(4);
    \u0275\u0275template(5, DashboardComponent_div_44_tr_14_span_5_Template, 2, 1, "span", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td", 37)(7, "span", 38);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "td", 39);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 40)(12, "button", 41);
    \u0275\u0275listener("click", function DashboardComponent_div_44_tr_14_Template_button_click_12_listener() {
      const restoredCtx = \u0275\u0275restoreView(_r10);
      const entry_r6 = restoredCtx.$implicit;
      const ctx_r9 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r9.deleteEntry(entry_r6._id));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(13, "svg", 42);
    \u0275\u0275element(14, "path", 43);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const entry_r6 = ctx.$implicit;
    const ctx_r5 = \u0275\u0275nextContext(2);
    let tmp_2_0;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r5.toolLabel(entry_r6.tool), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", (entry_r6.inputFiles == null ? null : entry_r6.inputFiles[0] == null ? null : entry_r6.inputFiles[0].originalName) || "\u2014", " ");
    \u0275\u0275advance(1);
    \u0275\u0275property("ngIf", ((tmp_2_0 = entry_r6.inputFiles == null ? null : entry_r6.inputFiles.length) !== null && tmp_2_0 !== void 0 ? tmp_2_0 : 0) > 1);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r5.statusClass(entry_r6.status));
    \u0275\u0275advance(1);
    \u0275\u0275textInterpolate(entry_r6.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r5.formatDate(entry_r6.createdAt), " ");
  }
}
function DashboardComponent_div_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26)(1, "table", 27)(2, "thead", 28)(3, "tr")(4, "th", 29);
    \u0275\u0275text(5, "Tool");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 29);
    \u0275\u0275text(7, "Files");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 29);
    \u0275\u0275text(9, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 29);
    \u0275\u0275text(11, "Date");
    \u0275\u0275elementEnd();
    \u0275\u0275element(12, "th", 30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "tbody", 31);
    \u0275\u0275template(14, DashboardComponent_div_44_tr_14_Template, 15, 7, "tr", 32);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(14);
    \u0275\u0275property("ngForOf", ctx_r2.history());
  }
}
var DashboardComponent = /* @__PURE__ */ (() => {
  class DashboardComponent2 {
    constructor(auth, api, notify) {
      this.auth = auth;
      this.api = api;
      this.notify = notify;
      this.history = signal([]);
      this.loading = signal(true);
      this.total = signal(0);
      this.page = 1;
    }
    ngOnInit() {
      this.loadHistory();
    }
    loadHistory() {
      this.loading.set(true);
      this.api.get(`history?page=${this.page}&limit=20`).subscribe({
        next: (res) => {
          this.history.set(res.data);
          this.total.set(res.pagination.total);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
    deleteEntry(id) {
      this.api.delete(`history/${id}`).subscribe({
        next: () => {
          this.history.update((h) => h.filter((e) => e._id !== id));
          this.notify.success("Deleted");
        },
        error: () => this.notify.error("Failed to delete")
      });
    }
    toolLabel(tool) {
      const map = {
        "image-to-pdf": "Image \u2192 PDF",
        "pdf-to-word": "PDF \u2192 Word",
        "word-to-pdf": "Word \u2192 PDF",
        "pdf-merge": "PDF Merge",
        "pdf-split": "PDF Split",
        "pdf-compress": "PDF Compress",
        "image-resize": "Image Resize",
        "image-compress": "Image Compress",
        "image-convert": "Image Convert",
        "text-to-pdf": "Text \u2192 PDF",
        "create-zip": "Create ZIP"
      };
      return map[tool] ?? tool;
    }
    statusClass(status) {
      const c = {
        completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        pending: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
      };
      return c[status] ?? c["pending"];
    }
    formatDate(iso) {
      return new Date(iso).toLocaleString();
    }
    static {
      this.\u0275fac = function DashboardComponent_Factory(t) {
        return new (t || DashboardComponent2)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(NotificationService));
      };
    }
    static {
      this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
        type: DashboardComponent2,
        selectors: [["app-dashboard"]],
        standalone: true,
        features: [\u0275\u0275StandaloneFeature],
        decls: 45,
        vars: 12,
        consts: [[1, "container-app", "py-10"], [1, "flex", "flex-col", "sm:flex-row", "sm:items-center", "justify-between", "gap-4", "mb-10"], [1, "text-2xl", "font-bold", "text-slate-900", "dark:text-white"], [1, "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "font-medium", "text-slate-700", "dark:text-slate-200"], ["routerLink", "/", 1, "btn", "btn-primary"], [1, "grid", "grid-cols-1", "sm:grid-cols-3", "gap-5", "mb-10"], [1, "card", "p-5", "flex", "items-center", "gap-4"], [1, "w-12", "h-12", "bg-primary-100", "dark:bg-primary-950/50", "rounded-xl", "flex", "items-center", "justify-center", "text-xl"], [1, "text-2xl", "font-bold", "text-slate-800", "dark:text-white"], [1, "text-sm", "text-slate-500", "dark:text-slate-400"], [1, "w-12", "h-12", "bg-emerald-100", "dark:bg-emerald-950/50", "rounded-xl", "flex", "items-center", "justify-center", "text-xl"], [1, "w-12", "h-12", "bg-amber-100", "dark:bg-amber-950/50", "rounded-xl", "flex", "items-center", "justify-center", "text-xl"], [1, "card", "overflow-hidden"], [1, "px-6", "py-4", "border-b", "border-slate-100", "dark:border-slate-700"], [1, "font-semibold", "text-slate-800", "dark:text-white"], ["class", "p-6 space-y-3", 4, "ngIf"], ["class", "py-16 text-center text-slate-400", 4, "ngIf"], ["class", "overflow-x-auto", 4, "ngIf"], [1, "p-6", "space-y-3"], ["class", "skeleton h-12 rounded-xl", 4, "ngFor", "ngForOf"], [1, "skeleton", "h-12", "rounded-xl"], [1, "py-16", "text-center", "text-slate-400"], [1, "text-4xl", "mb-3"], [1, "font-medium"], ["routerLink", "/", 1, "btn", "btn-primary", "mt-4"], [1, "overflow-x-auto"], [1, "w-full", "text-sm"], [1, "bg-slate-50", "dark:bg-slate-800", "text-xs", "uppercase", "text-slate-500", "dark:text-slate-400"], [1, "text-left", "px-6", "py-3"], [1, "px-6", "py-3"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-700"], ["class", "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors", 4, "ngFor", "ngForOf"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-800/50", "transition-colors"], [1, "px-6", "py-3.5", "font-medium", "text-slate-700", "dark:text-slate-200"], [1, "px-6", "py-3.5", "text-slate-500", "dark:text-slate-400"], ["class", "text-xs text-slate-400", 4, "ngIf"], [1, "px-6", "py-3.5"], [1, "badge"], [1, "px-6", "py-3.5", "text-slate-400", "text-xs", "whitespace-nowrap"], [1, "px-6", "py-3.5", "text-right"], [1, "text-slate-400", "hover:text-red-500", "transition-colors", "p-1", "rounded-lg", "hover:bg-red-50", "dark:hover:bg-red-950/20", 3, "click"], ["fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", 1, "w-4", "h-4"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"], [1, "text-xs", "text-slate-400"]],
        template: function DashboardComponent_Template(rf, ctx) {
          if (rf & 1) {
            \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
            \u0275\u0275text(4, "Dashboard");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(5, "p", 3);
            \u0275\u0275text(6, " Welcome back, ");
            \u0275\u0275elementStart(7, "span", 4);
            \u0275\u0275text(8);
            \u0275\u0275elementEnd()()();
            \u0275\u0275elementStart(9, "a", 5);
            \u0275\u0275text(10, "+ Convert Files");
            \u0275\u0275elementEnd()();
            \u0275\u0275elementStart(11, "div", 6)(12, "div", 7)(13, "div", 8);
            \u0275\u0275text(14, "\u{1F4CA}");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(15, "div")(16, "p", 9);
            \u0275\u0275text(17);
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(18, "p", 10);
            \u0275\u0275text(19, "Total conversions");
            \u0275\u0275elementEnd()()();
            \u0275\u0275elementStart(20, "div", 7)(21, "div", 11);
            \u0275\u0275text(22, "\u2705");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(23, "div")(24, "p", 9);
            \u0275\u0275text(25);
            \u0275\u0275pipe(26, "date");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(27, "p", 10);
            \u0275\u0275text(28, "Member since");
            \u0275\u0275elementEnd()()();
            \u0275\u0275elementStart(29, "div", 7)(30, "div", 12);
            \u0275\u0275text(31, "\u2B50");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(32, "div")(33, "p", 9);
            \u0275\u0275text(34);
            \u0275\u0275pipe(35, "titlecase");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(36, "p", 10);
            \u0275\u0275text(37, "Account type");
            \u0275\u0275elementEnd()()()();
            \u0275\u0275elementStart(38, "div", 13)(39, "div", 14)(40, "h2", 15);
            \u0275\u0275text(41, "Conversion History");
            \u0275\u0275elementEnd()();
            \u0275\u0275template(42, DashboardComponent_div_42_Template, 2, 2, "div", 16);
            \u0275\u0275template(43, DashboardComponent_div_43_Template, 7, 0, "div", 17);
            \u0275\u0275template(44, DashboardComponent_div_44_Template, 15, 1, "div", 18);
            \u0275\u0275elementEnd()();
          }
          if (rf & 2) {
            let tmp_0_0;
            let tmp_2_0;
            let tmp_3_0;
            \u0275\u0275advance(8);
            \u0275\u0275textInterpolate((tmp_0_0 = ctx.auth.user()) == null ? null : tmp_0_0.name);
            \u0275\u0275advance(9);
            \u0275\u0275textInterpolate(ctx.total());
            \u0275\u0275advance(8);
            \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(26, 7, (tmp_2_0 = ctx.auth.user()) == null ? null : tmp_2_0.createdAt, "mediumDate"));
            \u0275\u0275advance(9);
            \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(35, 10, (tmp_3_0 = ctx.auth.user()) == null ? null : tmp_3_0.role));
            \u0275\u0275advance(8);
            \u0275\u0275property("ngIf", ctx.loading());
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", !ctx.loading() && !ctx.history().length);
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", !ctx.loading() && ctx.history().length);
          }
        },
        dependencies: [CommonModule, NgForOf, NgIf, TitleCasePipe, DatePipe, RouterLink],
        encapsulation: 2
      });
    }
  }
  return DashboardComponent2;
})();
export {
  DashboardComponent
};
//# sourceMappingURL=chunk-AC2SB2XE.js.map
