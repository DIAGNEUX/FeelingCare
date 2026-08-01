import { FEELINGCARE_COLORS } from './colors'

export const THEME_CONFIG = {
  defaultTheme: 'light',
  storageKey: 'feelingcare-theme',
  themes: ['light', 'dark'],
  colors: FEELINGCARE_COLORS,
}

export const getThemeClasses = (theme: 'light' | 'dark') => {
  return {
    bg: {
      primary: theme === 'light' ? 'bg-feelingcare-light-bg' : 'dark:bg-feelingcare-dark-bg',
      secondary: theme === 'light' ? 'bg-white' : 'dark:bg-feelingcare-dark-bg-secondary',
    },
    text: {
      primary: theme === 'light' ? 'text-feelingcare-light-text' : 'dark:text-feelingcare-dark-text',
      secondary: theme === 'light' ? 'text-feelingcare-light-text-secondary' : 'dark:text-feelingcare-dark-text-secondary',
    },
    border: theme === 'light' ? 'border-feelingcare-light-border' : 'dark:border-feelingcare-dark-border',
  }
}
