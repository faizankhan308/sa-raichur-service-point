/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0052cc',
          hover: '#003d99',
          light: '#e6f0ff',
        },
        accent: {
          DEFAULT: '#00a3c4',
          hover: '#00819c',
          light: '#e6f7fa',
        },
        dark: '#0f172a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
