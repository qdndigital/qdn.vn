/**
 * QDN — Design tokens (single source of truth), per brand guide v2.8.
 * No arbitrary values in markup; everything comes from this scale.
 */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f4f1ea",
        "paper-2": "#eae5da",
        surface: "#fbfaf6",
        ink: "#1e1e1a",
        "ink-2": "#4a4943",
        muted: "#5e5c55",
        faint: "#aba89e",
        line: "#e2ddd1",
        "line-2": "#ccc5b6",
        accent: { DEFAULT: "#e5662c", soft: "#fbe4d8", ink: "#b84c1e" },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        label: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.14em" }],
        stat: ["1.375rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h3: ["1.3125rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        h2: [
          "clamp(1.875rem, 4vw, 3.125rem)",
          { lineHeight: "1.08", letterSpacing: "-0.025em", fontWeight: "600" },
        ],
        h1: [
          "clamp(2.5rem, 5.6vw, 4.75rem)",
          { lineHeight: "1.02", letterSpacing: "-0.03em", fontWeight: "600" },
        ],
        display: [
          "clamp(2.25rem, 5.4vw, 4.5rem)",
          { lineHeight: "1.02", letterSpacing: "-0.03em", fontWeight: "600" },
        ],
      },
      letterSpacing: { tight2: "-0.02em", tightest: "-0.03em" },
      maxWidth: { wrap: "1660px" },
      boxShadow: {
        lift: "0 26px 50px -30px rgba(30,30,26,.30)",
        card: "0 1px 2px rgba(30,30,26,.04), 0 30px 60px -34px rgba(30,30,26,.30)",
      },
    },
  },
  plugins: [],
};
