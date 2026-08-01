import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        feelingcare: {
          // Light mode
          'light-bg': '#FCFCF7',
          'light-bg-secondary': '#FFFFFF',
          'light-text': '#171717',
          'light-text-secondary': '#697066',
          'light-border': '#E8EBDD',

          // Dark mode
          'dark-bg': '#11130F',
          'dark-bg-secondary': '#191C16',
          'dark-text': '#F7F8EF',
          'dark-text-secondary': '#B8BDAF',
          'dark-border': '#343A2E',

          // Actions - Primary
          'primary': '#DDF241',
          'primary-dark': '#DDF241',

          // Accents
          'accent-rose': '#F3B6EF',
          'accent-rose-light': '#FCEBFA',
          'accent-emerald': '#BDECC8',
          'accent-emerald-light': '#ECF9EF',
          'accent-blue': '#9DD9EA',
          'accent-blue-light': '#E9F8FC',
          'accent-orange': '#FFD8A8',
          'accent-orange-light': '#FFF3E4',
        },
      },
      backgroundColor: {
        'light': '#FCFCF7',
        'dark': '#11130F',
      },
      textColor: {
        'light-primary': '#171717',
        'light-secondary': '#697066',
        'dark-primary': '#F7F8EF',
        'dark-secondary': '#B8BDAF',
      },
      borderColor: {
        'light': '#E8EBDD',
        'dark': '#343A2E',
      },
      animation: {
        'gentle-bounce': 'gentle-bounce 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'fadein': 'fadein 0.4s ease-in',
      },
      keyframes: {
        'gentle-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fadein': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
