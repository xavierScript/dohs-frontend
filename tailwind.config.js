import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Poppins', 'sans-serif'],
        cursive: ['Aguafina Script', 'cursive'],
        sans: ['DM Sans'],
        sora: ['Sora'],
        manrope: ['Manrope'],
        rale: ['Raleway'],
      },

      colors: {
        steelBlue: '#527C88',
        whiteSteel: '#1BA9B5',
        cyan: '#026979',
        turquoiseBlue: '#1BA9B5',
        teal: '#38A3A5',
        darkCharcoal: '#121212',
        darkCoal: '#161C2D',
        blueGray: '#6C87AE',
        lightGray: '#AFAFAF',
        blueViolet: '#473BF0',
        'white': '#ffffff',
        'black': '#121212',
        'secondary': '#026979',
        'accent': '#1BA9B5',
        'yellow': '#f3b917bf',
        'green': '#1BA9B5',
        'darkGreen': '#28a745',
        'teal_one': '#33A11778',
        'grey': '#d9d9d956',
        'red': '#dc3545',
        'wine': '#d8000c',
        'danger': '#FF0000',
        'ash': '#F4F7FA',
        'darkGray': '#07292BC7'
      },
    },
  },

  plugins: [

  ],
}