/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#09090b",
        crimson: {
          DEFAULT: "#f92f35",
          hover: "#e02228",
          dark: "#b91c1c",
          light: "#fee2e2",
          tint: "rgba(249, 47, 53, 0.08)",
        },
        slateDark: {
          900: "#09090b",
          800: "#18181b",
          700: "#27272a",
        },
        gold: {
          DEFAULT: "#d97706",
          light: "#fef3c7",
          dark: "#b45309",
        }
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "Orbitron", "sans-serif"],
        rajdhani: ["var(--font-rajdhani)", "Rajdhani", "sans-serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        crimson: "0 12px 30px -6px rgba(249, 47, 53, 0.45)",
        crimsonSm: "0 6px 18px -4px rgba(249, 47, 53, 0.35)",
        clean: "0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 0 1px 1px rgba(0, 0, 0, 0.05)",
        cleanLg: "0 20px 45px -10px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.06)",
        cardHover: "0 25px 50px -12px rgba(15, 23, 42, 0.12), 0 0 1px 1px rgba(249, 47, 53, 0.2)",
      },
    },
  },
  plugins: [],
}
