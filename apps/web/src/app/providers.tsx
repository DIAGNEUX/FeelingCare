'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { AuthProvider } from './component/auth/AuthProvider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      storageKey="feelingcare-theme"
    >
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  )
}
