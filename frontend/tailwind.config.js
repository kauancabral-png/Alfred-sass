/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000', // Preto Brilhante / Absoluto
          light: '#1C1C1E',   // Preto Grafite Apple
          dark: '#000000',    // Preto Puro
        }
      }
    },
  },
  plugins: [],
}
