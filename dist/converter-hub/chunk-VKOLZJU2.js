import {
  RouterLink
} from "./chunk-WRRIZNNP.js";
import {
  CommonModule,
  NgForOf,
  NgIf,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassMapInterpolate1,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-ZFM7PJ4E.js";
import "./chunk-SHAOKUVO.js";

// src/app/shared/components/tool-card/tool-card.component.ts
function ToolCardComponent_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(1);
    \u0275\u0275textInterpolate1(" ", ctx_r0.tool.badge, " ");
  }
}
var ToolCardComponent = /* @__PURE__ */ (() => {
  class ToolCardComponent2 {
    static {
      this.\u0275fac = function ToolCardComponent_Factory(t) {
        return new (t || ToolCardComponent2)();
      };
    }
    static {
      this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
        type: ToolCardComponent2,
        selectors: [["app-tool-card"]],
        inputs: {
          tool: "tool"
        },
        standalone: true,
        features: [\u0275\u0275StandaloneFeature],
        decls: 13,
        vars: 8,
        consts: [[1, "card-hover", "flex", "flex-col", "p-6", "group", "animate-fade-in", 3, "routerLink"], ["class", "inline-block mb-2 badge bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 w-fit", 4, "ngIf"], [1, "font-semibold", "text-slate-800", "dark:text-white", "text-base", "mb-1.5", "group-hover:text-primary-600", "transition-colors"], [1, "text-sm", "text-slate-500", "dark:text-slate-400", "leading-relaxed", "flex-1"], [1, "mt-4", "flex", "items-center", "gap-1", "text-xs", "font-medium", "text-primary-600", "dark:text-primary-400", "opacity-0", "group-hover:opacity-100", "transition-opacity"], ["fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", 1, "w-3.5", "h-3.5", "group-hover:translate-x-0.5", "transition-transform"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 5l7 7-7 7"], [1, "inline-block", "mb-2", "badge", "bg-primary-100", "dark:bg-primary-900", "text-primary-700", "dark:text-primary-300", "w-fit"]],
        template: function ToolCardComponent_Template(rf, ctx) {
          if (rf & 1) {
            \u0275\u0275elementStart(0, "a", 0)(1, "div");
            \u0275\u0275text(2);
            \u0275\u0275elementEnd();
            \u0275\u0275template(3, ToolCardComponent_span_3_Template, 2, 1, "span", 1);
            \u0275\u0275elementStart(4, "h3", 2);
            \u0275\u0275text(5);
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(6, "p", 3);
            \u0275\u0275text(7);
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(8, "div", 4)(9, "span");
            \u0275\u0275text(10, "Use tool");
            \u0275\u0275elementEnd();
            \u0275\u0275namespaceSVG();
            \u0275\u0275elementStart(11, "svg", 5);
            \u0275\u0275element(12, "path", 6);
            \u0275\u0275elementEnd()()();
          }
          if (rf & 2) {
            \u0275\u0275property("routerLink", ctx.tool.route);
            \u0275\u0275advance(1);
            \u0275\u0275classMapInterpolate1("w-14 h-14 rounded-2xl bg-gradient-to-br ", ctx.tool.color, " flex items-center justify-center text-2xl mb-4 shadow-md\n                  group-hover:scale-110 transition-transform duration-200");
            \u0275\u0275advance(1);
            \u0275\u0275textInterpolate1(" ", ctx.tool.icon, " ");
            \u0275\u0275advance(1);
            \u0275\u0275property("ngIf", ctx.tool.badge);
            \u0275\u0275advance(2);
            \u0275\u0275textInterpolate1(" ", ctx.tool.title, " ");
            \u0275\u0275advance(2);
            \u0275\u0275textInterpolate1(" ", ctx.tool.description, " ");
          }
        },
        dependencies: [CommonModule, NgIf, RouterLink],
        encapsulation: 2,
        changeDetection: 0
      });
    }
  }
  return ToolCardComponent2;
})();

// src/app/core/models/tool.model.ts
var TOOLS = [{
  id: "image-to-pdf",
  title: "Image to PDF",
  description: "Convert JPG, PNG, or WebP images into a single PDF document.",
  icon: "\u{1F5BC}\uFE0F",
  route: "/image-to-pdf",
  category: "pdf",
  acceptedFormats: [".jpg", ".jpeg", ".png", ".webp", ".bmp"],
  outputFormat: "PDF",
  color: "from-blue-500 to-cyan-500",
  badge: "Popular"
}, {
  id: "pdf-to-word",
  title: "PDF to Word",
  description: "Extract content from a PDF and save it as an editable .docx file.",
  icon: "\u{1F4C4}",
  route: "/pdf-to-word",
  category: "document",
  acceptedFormats: [".pdf"],
  outputFormat: "DOCX",
  color: "from-violet-500 to-purple-600"
}, {
  id: "word-to-pdf",
  title: "Word to PDF",
  description: "Convert your .docx Word documents into a professional PDF.",
  icon: "\u{1F4DD}",
  route: "/word-to-pdf",
  category: "pdf",
  acceptedFormats: [".doc", ".docx"],
  outputFormat: "PDF",
  color: "from-indigo-500 to-blue-600"
}, {
  id: "pdf-editor",
  title: "PDF Editor",
  description: "Merge, split, compress and reorder pages inside PDFs.",
  icon: "\u{1F527}",
  route: "/pdf-editor",
  category: "pdf",
  acceptedFormats: [".pdf"],
  outputFormat: "PDF",
  color: "from-orange-500 to-red-500",
  badge: "New"
}, {
  id: "image-editor",
  title: "Image Editor",
  description: "Resize, crop, compress, or convert your images.",
  icon: "\u{1F3A8}",
  route: "/image-editor",
  category: "image",
  acceptedFormats: [".jpg", ".jpeg", ".png", ".webp"],
  outputFormat: "JPG / PNG / WebP",
  color: "from-pink-500 to-rose-500"
}, {
  id: "compress",
  title: "File Compressor",
  description: "Compress images and bundle multiple files into a ZIP archive.",
  icon: "\u{1F5DC}\uFE0F",
  route: "/compress",
  category: "archive",
  acceptedFormats: [".jpg", ".jpeg", ".png", ".pdf"],
  outputFormat: "ZIP / Compressed",
  color: "from-emerald-500 to-teal-500"
}, {
  id: "text-to-pdf",
  title: "Text to PDF",
  description: "Turn plain text or notes into a clean, formatted PDF.",
  icon: "\u{1F4C3}",
  route: "/text-to-pdf",
  category: "pdf",
  acceptedFormats: [".txt"],
  outputFormat: "PDF",
  color: "from-amber-400 to-orange-500"
}];

// src/app/features/home/home.component.ts
function HomeComponent_div_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "p", 33);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 34);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const stat_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(stat_r3.value);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(stat_r3.label);
  }
}
function HomeComponent_app_tool_card_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-tool-card", 35);
  }
  if (rf & 2) {
    const tool_r4 = ctx.$implicit;
    \u0275\u0275property("tool", tool_r4);
  }
}
function HomeComponent_div_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36)(1, "div", 37);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3", 38);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 39);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r5 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", f_r5.icon, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r5.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r5.desc);
  }
}
var HomeComponent = /* @__PURE__ */ (() => {
  class HomeComponent2 {
    constructor() {
      this.tools = TOOLS;
      this.stats = [{
        value: "10M+",
        label: "Files Converted"
      }, {
        value: "50MB",
        label: "Max File Size"
      }, {
        value: "100%",
        label: "Free to Use"
      }, {
        value: "SSL",
        label: "Secure & Private"
      }];
      this.features = [{
        icon: "\u26A1",
        title: "Lightning Fast",
        desc: "Optimised processing pipeline \u2014 results in seconds."
      }, {
        icon: "\u{1F512}",
        title: "Secure & Private",
        desc: "Files are deleted automatically after 2 hours."
      }, {
        icon: "\u{1F4F1}",
        title: "Works Everywhere",
        desc: "Fully responsive \u2014 desktop, tablet, and mobile."
      }, {
        icon: "\u{1F3AF}",
        title: "Easy to Use",
        desc: "Drag, drop, convert, download. That's it."
      }];
    }
    static {
      this.\u0275fac = function HomeComponent_Factory(t) {
        return new (t || HomeComponent2)();
      };
    }
    static {
      this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
        type: HomeComponent2,
        selectors: [["app-home"]],
        standalone: true,
        features: [\u0275\u0275StandaloneFeature],
        decls: 48,
        vars: 3,
        consts: [[1, "relative", "overflow-hidden", "bg-gradient-to-br", "from-primary-600", "via-primary-700", "to-indigo-800", "text-white"], [1, "absolute", "-top-40", "-right-40", "w-96", "h-96", "bg-white/5", "rounded-full", "blur-3xl", "pointer-events-none"], [1, "absolute", "-bottom-20", "-left-20", "w-80", "h-80", "bg-indigo-500/20", "rounded-full", "blur-3xl", "pointer-events-none"], [1, "container-app", "py-24", "md:py-32", "relative"], [1, "max-w-3xl", "mx-auto", "text-center", "animate-slide-up"], [1, "inline-block", "mb-4", "px-4", "py-1.5", "bg-white/10", "backdrop-blur", "rounded-full", "text-sm", "font-medium"], [1, "text-4xl", "sm:text-5xl", "md:text-6xl", "font-extrabold", "leading-tight", "tracking-tight", "mb-6"], [1, "text-primary-200"], [1, "text-lg", "sm:text-xl", "text-primary-100", "max-w-xl", "mx-auto", "mb-10", "leading-relaxed"], [1, "flex", "flex-col", "sm:flex-row", "gap-3", "justify-center"], ["routerLink", "/image-to-pdf", 1, "btn", "btn-lg", "bg-white", "text-primary-700", "hover:bg-primary-50", "shadow-xl"], ["href", "#tools", 1, "btn", "btn-lg", "border-2", "border-white/40", "text-white", "hover:bg-white/10"], [1, "bg-slate-50", "dark:bg-slate-800/50", "border-y", "border-slate-200", "dark:border-slate-700"], [1, "container-app", "py-10"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-6", "text-center"], ["class", "animate-fade-in", 4, "ngFor", "ngForOf"], ["id", "tools", 1, "container-app", "py-20"], [1, "text-center", "mb-14"], [1, "text-3xl", "sm:text-4xl", "font-extrabold", "text-slate-900", "dark:text-white", "mb-4"], [1, "text-slate-500", "dark:text-slate-400", "text-lg", "max-w-xl", "mx-auto"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4", "gap-5"], [3, "tool", 4, "ngFor", "ngForOf"], [1, "bg-slate-50", "dark:bg-slate-800/30", "py-20"], [1, "container-app"], [1, "text-3xl", "font-extrabold", "text-slate-900", "dark:text-white", "mb-4"], [1, "text-slate-500", "dark:text-slate-400", "text-lg"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-4", "gap-8"], ["class", "text-center animate-slide-up", 4, "ngFor", "ngForOf"], [1, "container-app", "py-20", "text-center"], [1, "max-w-2xl", "mx-auto"], [1, "text-slate-500", "dark:text-slate-400", "mb-8", "text-lg"], ["routerLink", "/image-to-pdf", 1, "btn", "btn-primary", "btn-lg"], [1, "animate-fade-in"], [1, "text-3xl", "font-extrabold", "text-primary-600", "dark:text-primary-400"], [1, "text-sm", "text-slate-500", "dark:text-slate-400", "mt-1"], [3, "tool"], [1, "text-center", "animate-slide-up"], [1, "w-14", "h-14", "bg-primary-100", "dark:bg-primary-950/50", "rounded-2xl", "text-2xl", "flex", "items-center", "justify-center", "mx-auto", "mb-4"], [1, "font-semibold", "text-slate-800", "dark:text-white", "mb-2"], [1, "text-sm", "text-slate-500", "dark:text-slate-400", "leading-relaxed"]],
        template: function HomeComponent_Template(rf, ctx) {
          if (rf & 1) {
            \u0275\u0275elementStart(0, "section", 0);
            \u0275\u0275element(1, "div", 1)(2, "div", 2);
            \u0275\u0275elementStart(3, "div", 3)(4, "div", 4)(5, "span", 5);
            \u0275\u0275text(6, " \u{1F389} 100% Free \xB7 No Sign-up Required ");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(7, "h1", 6);
            \u0275\u0275text(8, " Convert Any File");
            \u0275\u0275element(9, "br");
            \u0275\u0275elementStart(10, "span", 7);
            \u0275\u0275text(11, "In Seconds");
            \u0275\u0275elementEnd()();
            \u0275\u0275elementStart(12, "p", 8);
            \u0275\u0275text(13, " Powerful online tools for images, PDFs and documents \u2014 fast, secure and beautifully simple. ");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(14, "div", 9)(15, "a", 10);
            \u0275\u0275text(16, " \u{1F5BC}\uFE0F Start Converting ");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(17, "a", 11);
            \u0275\u0275text(18, " Browse All Tools ");
            \u0275\u0275elementEnd()()()()();
            \u0275\u0275elementStart(19, "section", 12)(20, "div", 13)(21, "div", 14);
            \u0275\u0275template(22, HomeComponent_div_22_Template, 5, 2, "div", 15);
            \u0275\u0275elementEnd()()();
            \u0275\u0275elementStart(23, "section", 16)(24, "div", 17)(25, "h2", 18);
            \u0275\u0275text(26, " All Conversion Tools ");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(27, "p", 19);
            \u0275\u0275text(28, " Pick a tool and start converting \u2014 no registration needed. ");
            \u0275\u0275elementEnd()();
            \u0275\u0275elementStart(29, "div", 20);
            \u0275\u0275template(30, HomeComponent_app_tool_card_30_Template, 1, 1, "app-tool-card", 21);
            \u0275\u0275elementEnd()();
            \u0275\u0275elementStart(31, "section", 22)(32, "div", 23)(33, "div", 17)(34, "h2", 24);
            \u0275\u0275text(35, "Why ConverterHub?");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(36, "p", 25);
            \u0275\u0275text(37, "Built for speed, simplicity, and security.");
            \u0275\u0275elementEnd()();
            \u0275\u0275elementStart(38, "div", 26);
            \u0275\u0275template(39, HomeComponent_div_39_Template, 7, 3, "div", 27);
            \u0275\u0275elementEnd()()();
            \u0275\u0275elementStart(40, "section", 28)(41, "div", 29)(42, "h2", 24);
            \u0275\u0275text(43, " Ready to convert your files? ");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(44, "p", 30);
            \u0275\u0275text(45, "Free, fast, and no account required.");
            \u0275\u0275elementEnd();
            \u0275\u0275elementStart(46, "a", 31);
            \u0275\u0275text(47, " Get Started \u2014 It's Free ");
            \u0275\u0275elementEnd()()();
          }
          if (rf & 2) {
            \u0275\u0275advance(22);
            \u0275\u0275property("ngForOf", ctx.stats);
            \u0275\u0275advance(8);
            \u0275\u0275property("ngForOf", ctx.tools);
            \u0275\u0275advance(9);
            \u0275\u0275property("ngForOf", ctx.features);
          }
        },
        dependencies: [CommonModule, NgForOf, RouterLink, ToolCardComponent],
        encapsulation: 2
      });
    }
  }
  return HomeComponent2;
})();
export {
  HomeComponent
};
//# sourceMappingURL=chunk-VKOLZJU2.js.map
