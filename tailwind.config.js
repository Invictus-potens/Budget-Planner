/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',
        accent: 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        success: 'var(--color-success)',
        'success-light': 'var(--color-success-light)',
        'success-dark': 'var(--color-success-dark)',
        warning: 'var(--color-warning)',
        'warning-light': 'var(--color-warning-light)',
        danger: 'var(--color-danger)',
        'danger-light': 'var(--color-danger-light)',
        'danger-dark': 'var(--color-danger-dark)',
        info: 'var(--color-info)',
        'info-light': 'var(--color-info-light)',
        'category-emerald': 'var(--color-category-emerald)',
        'category-indigo': 'var(--color-category-indigo)',
        'category-teal': 'var(--color-category-teal)',
        'category-slate': 'var(--color-category-slate)',
        'category-gray': 'var(--color-category-gray)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}

