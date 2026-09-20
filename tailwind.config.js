/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // System preference by default; <html data-theme="light|dark"> forces a scheme.
  darkMode: [
    'variant',
    [
      '@media (prefers-color-scheme: dark) { &:not(:root[data-theme="light"] *) }',
      ':root[data-theme="dark"] &',
    ],
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#EEE4D2',
        'ivory-2': '#F6EFE2',
        walnut: '#2C2016',
        'walnut-soft': '#4A3826',
        mustard: '#C1841A',
        'mustard-deep': '#9C6812',
        sesame: '#171310',
        caution: '#9C3D24',
        good: '#4C6B3A',
        // dark-mode equivalents
        'dk-bg': '#1B140D',
        'dk-text': '#F1E7D6',
        'dk-accent': '#E0A83B',
        'dk-card': '#241C13',
      },
      fontFamily: {
        heading: ['"Fraunces Variable"', '"Fraunces"', 'Georgia', 'serif'],
        body: ['"Karla"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        heading: '-0.02em',
      },
      maxWidth: {
        site: '72rem',
      },
    },
  },
  plugins: [],
}
