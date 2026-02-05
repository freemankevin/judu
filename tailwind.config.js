/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      colors: {
        paper: {
          50: '#fdfbf7',
          100: '#f7f3e9',
          200: '#efe5d0',
          300: '#e6d2b3',
          400: '#d9b88a',
          500: '#cc9c66',
        },
        ink: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#2d2d2d',
          950: '#1a1a1a',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'hover': '0 12px 40px -8px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 40px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'inkSpread': 'inkSpread 2s ease-out',
        'blink': 'blink 1s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        inkSpread: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '0.1' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      }
    },
  },
  plugins: [],
}
