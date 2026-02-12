import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'
type EnvVariant = 'dev' | 'branch' | 'main'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'theme'
const DARK_META_COLOR = '#1f1510'
const LIGHT_META_COLOR = '#ece4d4'
const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system'
}

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isTheme(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_MEDIA_QUERY).matches ? 'dark' : 'light'
}

function resolveEnvVariant(hostname: string): EnvVariant {
  if (hostname === '127.0.0.1' || hostname === 'localhost') return 'dev'

  const isBranchPreviewHost =
    hostname.endsWith('.the-dahan-codex.pages.dev') && hostname !== 'the-dahan-codex.pages.dev'
  return isBranchPreviewHost ? 'branch' : 'main'
}

function getEnvVariant(): EnvVariant {
  const root = document.documentElement
  const value = root.getAttribute('data-env-variant')

  if (value === 'dev' || value === 'branch' || value === 'main') {
    return value
  }

  const variant = resolveEnvVariant(window.location.hostname)
  root.setAttribute('data-env-variant', variant)
  return variant
}

function updateFavicon(resolvedTheme: ResolvedTheme) {
  const variant = getEnvVariant()
  const suffix = variant === 'main' ? '' : `-${variant}`

  document
    .querySelector<HTMLLinkElement>('#app-favicon-svg')
    ?.setAttribute('href', `/favicon-${resolvedTheme}${suffix}.svg`)
}

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement
  if (resolved === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', resolved === 'dark' ? DARK_META_COLOR : LIGHT_META_COLOR)
  }

  updateFavicon(resolved)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme())

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem(STORAGE_KEY, newTheme)
    } catch {
      // localStorage unavailable
    }
  }, [])

  useEffect(() => {
    applyTheme(theme === 'system' ? getSystemTheme() : theme)
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia(DARK_MEDIA_QUERY)
    const handler = () => applyTheme(getSystemTheme())

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }

    mediaQuery.addListener(handler)
    return () => mediaQuery.removeListener(handler)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
