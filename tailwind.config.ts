import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Salaam Thailand — Islamic palette: deep emerald + warm gold + cream
        ink: {
          50: "#f7f8fa", 100: "#eef0f4", 150: "#e3e6ec", 200: "#d6d9e0",
          300: "#aeb3bf", 400: "#7d8493", 500: "#586070", 600: "#3d4250",
          700: "#2a2e3a", 800: "#171a22", 900: "#0a0b0e", 950: "#050608",
        },
        // Islamic green — used historically in Islamic art + flags
        islam: {
          50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7",
          400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857",
          800: "#065f46", 900: "#064e3b", 950: "#022c22",
        },
        // Warm gold (mosque dome / minaret / quran ornament)
        gold: {
          50: "#fdfbef", 100: "#fbf3d3", 200: "#f6e6a8", 300: "#efd472",
          400: "#e5be3e", 500: "#d4af37", 600: "#b88c1d", 700: "#946a18",
          800: "#7a541b", 900: "#69461d", 950: "#3d2509",
        },
        // Cream / sand — soft backgrounds (desert tone)
        sand: {
          50: "#fdfbf6", 100: "#faf4e6", 200: "#f3e6c3", 300: "#ead49a",
          400: "#dfbe6f", 500: "#d4af37",
        },
        clinic: { DEFAULT: "#0ea5e9", deep: "#0369a1", mint: "#10b981", danger: "#ef4444", violet: "#8b5cf6" },
        trust: { high: "#047857", mid: "#d4af37", low: "#ef4444" },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Noto Sans KR", "Noto Sans Thai", "Noto Sans Arabic", "sans-serif"],
        arabic: ["Noto Sans Arabic", "Amiri", "Scheherazade New", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      animation: {
        "ring-draw": "ring-draw 1.4s cubic-bezier(0.65,0,0.35,1) forwards",
        "shimmer": "shimmer 2.5s linear infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "blob": "blob 14s ease-in-out infinite",
      },
      keyframes: {
        "ring-draw": { from: { strokeDashoffset: "var(--end)" }, to: { strokeDashoffset: "var(--target)" } },
        "shimmer": { "0%": { backgroundPosition: "-1000px 0" }, "100%": { backgroundPosition: "1000px 0" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "blob": {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(20px,-30px) scale(1.1)" },
          "66%": { transform: "translate(-20px,20px) scale(0.95)" },
        },
      },
      backgroundImage: {
        "grid-light": "linear-gradient(to right, rgba(0,0,0,.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,.04) 1px, transparent 1px)",
        "grid-dark":  "linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
export default config;
