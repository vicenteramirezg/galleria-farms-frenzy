/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'flower-pink': '#FF69B4',
        'flower-yellow': '#FFD700',
        'leaf-green': '#228B22',
        'soil-brown': '#8B4513',
        'weed-dark': '#2F4F2F'
      },
      fontFamily: {
        'game': ['Courier New', 'monospace']
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
} 