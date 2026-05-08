/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          soft: '#E8C547',
          deep: '#B8941F',
        },
        ink: {
          DEFAULT: '#0A0806',
          soft: '#14100B',
        },
        cream: '#F5EDD6',
        sand: '#C4A882',
        rust: '#B84A2A',
        bg: {
          DEFAULT: '#07060A',
          light: '#F5EDD6',
        },
        fg: {
          DEFAULT: '#F4ECD8',
          dark: '#06040A',
        },
        line: 'rgba(212, 175, 55, 0.18)',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Bebas Neue"', 'sans-serif'],
      },
      transitionTimingFunction: {
        cinema: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'out-soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-deep': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      backgroundImage: {
        'welcome-dark': 'radial-gradient(ellipse at 25% 60%, rgba(120, 70, 25, .55) 0%, transparent 55%), radial-gradient(ellipse at 80% 30%, rgba(212, 175, 55, .18) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(184, 74, 42, .15) 0%, transparent 60%), linear-gradient(160deg, #14100B 0%, #0a0805 50%, #1a1208 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #E8C547 50%, #B8941F 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2.4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
