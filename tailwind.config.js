/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '400px',
      },
      colors: {
        background: '#10141a',
        card: '#1c2026',
        'card-high': '#262a31',
        accent: {
          blue: '#00D1FF',
          red: '#FF3B30',
          green: '#00E676',
        },
        surface: {
          dim: '#10141a',
          low: '#181c22',
          DEFAULT: '#1c2026',
          high: '#262a31',
          highest: '#31353c'
        }
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #a4e6ff 0%, #00d1ff 100%)',
        'gradient-surface': 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
      }
    },
  },
  plugins: [],
}
