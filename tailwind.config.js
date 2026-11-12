/** @type {import('tailwindcss').Config} */

// Dark theme: the slate scale is inverted so existing page markup
// (bg-slate-50 surfaces, text-slate-900 headings, border-slate-200 lines)
// renders as a black/red UI without touching page content.
const slateDark = {
  50: "#0e0e0f",
  100: "#151516",
  200: "#262628",
  300: "#3a3a3d",
  400: "#6e6e73",
  500: "#8d8d92",
  600: "#a9a9ae",
  700: "#c9c9cd",
  800: "#e4e4e7",
  900: "#f5f5f5",
  950: "#050505",
};

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: slateDark,
        background: "#050505",
        foreground: "#f5f5f5",
        blood: {
          DEFAULT: "#e10600",
          deep: "#8f0000",
          dark: "#4a0000",
          glow: "#ff2a1f",
        },
        crimson: {
          DEFAULT: "#e10600",
          hover: "#b80000",
          dark: "#8f0000",
          light: "#2a0606",
          tint: "rgba(225, 6, 0, 0.08)",
        },
        slateDark: {
          900: "#050505",
          800: "#0e0e0f",
          700: "#1a1a1c",
        },
        gold: {
          DEFAULT: "#d97706",
          light: "#2a1d05",
          dark: "#f59e0b",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Anton", "Impact", "sans-serif"],
        gothic: ["var(--font-gothic)", "UnifrakturMaguntia", "serif"],
        orbitron: ["var(--font-grotesk)", "Space Grotesk", "sans-serif"],
        rajdhani: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        sans: ["var(--font-grotesk)", "Space Grotesk", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        crimson: "0 12px 34px -6px rgba(225, 6, 0, 0.55)",
        crimsonSm: "0 6px 18px -4px rgba(225, 6, 0, 0.45)",
        clean: "0 0 0 1px rgba(255,255,255,0.06)",
        cleanLg: "0 0 0 1px rgba(255,255,255,0.08), 0 30px 60px -20px rgba(0,0,0,0.8)",
        cardHover: "0 0 0 1px rgba(225, 6, 0, 0.5), 0 30px 60px -20px rgba(225, 6, 0, 0.35)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        flicker: {
          "0%,100%": { transform: "scaleY(1) translateY(0)" },
          "50%": { transform: "scaleY(1.08) translateY(-4px)" },
        },
        scan: { from: { transform: "translateY(-100%)" }, to: { transform: "translateY(100%)" } },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "marquee-slow": "marquee 60s linear infinite",
        flicker: "flicker 1.6s ease-in-out infinite",
        scan: "scan 3.5s linear infinite",
      },
    },
  },
  plugins: [],
};
