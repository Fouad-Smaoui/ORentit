/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
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
    },
  },
  plugins: [],
};