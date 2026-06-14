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
          DEFAULT: '#00FF00', // Verde Neon Principal
          light: '#33FF33',   
          dark: '#00CC00',    
        },
        dark: {
          bg: '#080808', // Fundo profundo
          card: '#141414', // Cards
          border: '#2A2A2A',
        }
      }
    },
  },
  plugins: [],
}
