"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
  resolvedTheme: "dark",
})

export function useTheme() {
  return React.useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("dark")
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(
    "dark"
  )

  React.useEffect(() => {
    const stored = localStorage.getItem("shiro-theme") as Theme | null
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeState(stored)
    }
  }, [])

  React.useEffect(() => {
    const root = document.documentElement
    let resolved: "light" | "dark"

    if (theme === "system") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    } else {
      resolved = theme
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResolvedTheme(resolved)
    if (resolved === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("shiro-theme", newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
