/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#a100ff',
          50: '#f5f0ff',
          100: '#ede5ff',
          200: '#deccff',
          300: '#c699ff',
          400: '#b366ff',
          500: '#a100ff',
          600: '#8500d1',
          700: '#6600a3',
          800: '#4d007a',
          900: '#330052',
        },
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgb(16 24 40 / 0.06), 0 4px 16px -4px rgb(16 24 40 / 0.08)',
        elevated: '0 8px 24px -4px rgb(16 24 40 / 0.10), 0 4px 8px -4px rgb(16 24 40 / 0.06)',
        glow: '0 0 0 1px rgb(161 0 255 / 0.08), 0 8px 32px -8px rgb(161 0 255 / 0.25)',
      },
    },
  },
  plugins: [],
};