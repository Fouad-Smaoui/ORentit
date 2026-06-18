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
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
};