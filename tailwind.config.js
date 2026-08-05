/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class", // Safelist dynamic classes used via interpolation in tool cards so Tailwind never purges them
  safelist: [
    "from-blue-500",
    "to-cyan-500",
    "from-violet-500",
    "to-purple-600",
    "from-indigo-500",
    "to-blue-600",
    "from-orange-500",
    "to-red-500",
    "from-pink-500",
    "to-rose-500",
    "from-emerald-500",
    "to-teal-500",
    "from-amber-400",
    "to-orange-500",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        roboto:  ["Roboto", "system-ui", "sans-serif"],
        georgia: ["Georgia", "Times New Roman", "serif"],
        builder: ["Poppins", "system-ui", "sans-serif"],
      },
      colors: {
        // `rgb(var(--x) / <alpha-value>)` (not a bare var()) is required so
        // Tailwind can still synthesize opacity-modifier utilities like
        // `bg-primary-900/40` — it can't compute an alpha variant for a color
        // it can't resolve at build time, so a plain var() string makes
        // Tailwind treat e.g. `hover:bg-primary-50/50` as a nonexistent class.
        primary: {
          50:  "rgb(var(--color-primary-50) / <alpha-value>)",
          100: "rgb(var(--color-primary-100) / <alpha-value>)",
          200: "rgb(var(--color-primary-200) / <alpha-value>)",
          300: "rgb(var(--color-primary-300) / <alpha-value>)",
          400: "rgb(var(--color-primary-400) / <alpha-value>)",
          500: "rgb(var(--color-primary-500) / <alpha-value>)",
          600: "rgb(var(--color-primary-600) / <alpha-value>)",
          700: "rgb(var(--color-primary-700) / <alpha-value>)",
          800: "rgb(var(--color-primary-800) / <alpha-value>)",
          900: "rgb(var(--color-primary-900) / <alpha-value>)",
          950: "rgb(var(--color-primary-950) / <alpha-value>)",
        },
        surface: {
          light: "rgb(var(--color-bg-surface) / <alpha-value>)",
          dark:  "rgb(var(--color-bg-canvas) / <alpha-value>)",
        },
        // Semantic tokens layered on top of the primitives above — new,
        // used by the design-system component primitives.
        content: {
          primary:   "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          muted:     "rgb(var(--color-text-muted) / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(var(--color-border-default) / <alpha-value>)",
          strong:  "rgb(var(--color-border-strong) / <alpha-value>)",
        },
        elevated: "rgb(var(--color-bg-elevated) / <alpha-value>)",
        // Resume Builder reference design system — distinct, intentionally
        // neutral (not blue-tinted like the sitewide `slate` scale) tokens.
        canvas:   "#FAFAFC",
        hairline: "#ECECEC",
        lavender: "#F4F0FF",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out both",
        "slide-up": "slideUp 0.4s ease-out both",
        "slide-down": "slideDown 0.3s ease-out both",
        "bounce-in": "bounceIn 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both",
        "spin-slow": "spin 3s linear infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          from: { transform: "translateY(-10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "60%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        glow: "var(--shadow-glow)",
        popover: "var(--shadow-popover)",
      },
      // NOTE: borderRadius intentionally NOT extended here. Tailwind's stock
      // sm/md/lg/xl/2xl keys already have different pixel values than the new
      // --radius-* tokens, and are used unqualified across ~50 untouched
      // feature modules — overriding them would silently resize every
      // rounded corner sitewide. New primitives consume --radius-* tokens
      // directly via arbitrary-value classes (e.g. `rounded-[var(--radius-lg)]`)
      // instead.
      transitionDuration: {
        // DEFAULT intentionally left at Tailwind's stock 150ms (87 files use
        // bare `transition-*` utilities relying on it) — only new, uniquely
        // named keys are added here.
        fast: "var(--duration-fast)",
        slow: "var(--duration-slow)",
        slower: "var(--duration-slower)",
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
      },
    },
  },
  plugins: [],
};
