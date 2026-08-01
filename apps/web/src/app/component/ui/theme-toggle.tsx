"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useSyncExternalStore } from "react"

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export function ThemeToggle() {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  )
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  if (!mounted) {
    return <div className="h-10 w-10" />
  }

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-feelingcare-light-text transition-all hover:bg-feelingcare-primary/10 dark:text-feelingcare-dark-text dark:hover:bg-feelingcare-primary-dark/10"
      aria-label="Basculer le mode sombre"
      type="button"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
