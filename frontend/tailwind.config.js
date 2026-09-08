/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fffaf0',
          100: '#feeeed',
          400: '#ff8c00',
          500: '#ff7700',
          600: '#e65c00',
        },
        navy: {
          800: '#0a192f',
          900: '#060d1b',
          950: '#030712',
        }
      }
    },
  },
  plugins: [],
}
