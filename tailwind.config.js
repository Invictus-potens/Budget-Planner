import { lightThemeColors, darkThemeColors } from './app/lib/colors';

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
        ...Object.keys(lightThemeColors).reduce((acc, key) => {
          acc[key] = `var(--color-${key})`;
          return acc;
        }, {}),
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}

