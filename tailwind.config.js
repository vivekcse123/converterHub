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
      },
      colors: {
        primary: {
          50:  "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        surface: {
          light: "#f8fafc",
          dark:  "#0f172a",
        },
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
        card: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
        "card-hover":
          "0 4px 6px rgba(0,0,0,0.07), 0 12px 28px rgba(0,0,0,0.10)",
        glow: "0 0 20px rgba(124,58,237,0.35)",
      },
    },
  },
  plugins: [],
};
