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
        magenta: '#f43f5e',
        green: '#22c55e',
        red: '#ef4444',
        blue: '#3b82f6',
        pastelPink: '#fef2f2',
        pastelGreen: '#dcfce7',
        pastelBlue: '#dbeafe',
        grayDark: '#1f2937',
        grayMedium: '#6b7280',
        grayLight: '#e5e7eb',
        grayBg: '#fafafa',
        purple: '#8b5cf6',
        orange: '#f97316',
      },
    },
  },
  plugins: [],
}

