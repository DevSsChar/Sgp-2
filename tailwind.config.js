/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cx: {
          bg: 'var(--background)',
          fg: 'var(--foreground)',
          surface: 'var(--surface)',
          'surface-dim': 'var(--surface-dim)',
          'surface-bright': 'var(--surface-bright)',
          'surface-container': 'var(--surface-container)',
          'surface-container-lowest': 'var(--surface-container-lowest)',
          'surface-container-low': 'var(--surface-container-low)',
          'surface-container-high': 'var(--surface-container-high)',
          'surface-container-highest': 'var(--surface-container-highest)',
          'on-surface': 'var(--on-surface)',
          'on-surface-variant': 'var(--on-surface-variant)',
          outline: 'var(--outline)',
          'outline-variant': 'var(--outline-variant)',
          primary: 'var(--primary)',
          'on-primary': 'var(--on-primary)',
          'primary-container': 'var(--primary-container)',
          'on-primary-container': 'var(--on-primary-container)',
          secondary: 'var(--secondary)',
          'secondary-container': 'var(--secondary-container)',
          tertiary: 'var(--tertiary)',
          'tertiary-container': 'var(--tertiary-container)',
          'tertiary-accent': 'var(--tertiary-accent)',
          error: 'var(--error)',
          'error-container': 'var(--error-container)',
          'on-error': 'var(--on-error)',
          'on-error-container': 'var(--on-error-container)',
        },
        /* Legacy aliases */
        'ag-primary': 'var(--primary-container)',
        'ag-bright-cyan': 'var(--tertiary)',
      },
      fontFamily: {
        display: ['var(--font-sora)', 'Sora', 'sans-serif'],
        body: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
        poppins: ['var(--font-sora)', 'Sora', 'sans-serif'],
        roboto: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(to bottom right, #016764, #001717)',
        'gradient-cx-primary': 'linear-gradient(180deg, var(--primary-container) 0%, var(--secondary-container) 100%)',
        'gradient-cx-progress': 'linear-gradient(90deg, var(--tertiary) 0%, var(--tertiary-accent) 100%)',
      },
      boxShadow: {
        'cx-glow': '0 4px 20px var(--glow-primary)',
        'cx-glow-accent': '0 0 12px var(--glow-accent)',
      },
      borderRadius: {
        cx: '0.25rem',
        'cx-lg': '0.75rem',
      },
    },
  },
  plugins: [],
};
