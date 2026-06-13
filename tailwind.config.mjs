/**
 * QDN — Design tokens (single source of truth).
 * No arbitrary values in markup; everything comes from this scale.
 */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        paper: '#e9e7e2',
        'paper-2': '#e1ded7',
        surface: '#f5f4f0',
        ink: '#1c1b18',
        'ink-2': '#585550',
        muted: '#6b675e',
        faint: '#aeaaa0',
        line: '#d3cfc6',
        'line-2': '#bdb8ac',
        accent: { DEFAULT: '#e2622a', soft: '#f7e4d8', ink: '#ab4715' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        label: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.14em' }],
        stat: ['1.375rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h3: ['1.3125rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        h2: ['clamp(1.875rem, 4vw, 3.125rem)', { lineHeight: '1.05', letterSpacing: '-0.035em' }],
        h1: ['clamp(2.5rem, 5.6vw, 4.75rem)', { lineHeight: '1.0', letterSpacing: '-0.045em' }],
        display: ['clamp(2.25rem, 5.4vw, 4.5rem)', { lineHeight: '1.0', letterSpacing: '-0.045em' }],
      },
      letterSpacing: { tight2: '-0.02em', tightest: '-0.045em' },
      maxWidth: { wrap: '1160px' },
      boxShadow: {
        lift: '0 26px 50px -30px rgba(28,27,24,.30)',
        card: '0 1px 2px rgba(28,27,24,.04), 0 30px 60px -34px rgba(28,27,24,.30)',
      },
    },
  },
  plugins: [],
};
