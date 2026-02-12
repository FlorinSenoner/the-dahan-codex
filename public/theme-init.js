;(() => {
  const STORAGE_KEY = 'theme'
  const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'
  const DARK_META_COLOR = '#1f1510'
  const LIGHT_META_COLOR = '#ece4d4'
  const VALID_THEMES = { light: true, dark: true, system: true }

  const root = document.documentElement

  function readTheme() {
    let value = null
    try {
      value = window.localStorage.getItem(STORAGE_KEY)
      return typeof value === 'string' && VALID_THEMES[value] ? value : null
    } catch {
      return null
    }
  }

  function resolveTheme(theme) {
    if (theme === 'system') {
      return window.matchMedia(DARK_MEDIA_QUERY).matches ? 'dark' : 'light'
    }
    return theme
  }

  function resolveEnvVariant() {
    const host = window.location.hostname
    const isLocalHost = host === '127.0.0.1' || host === 'localhost'
    if (isLocalHost) return 'dev'

    const isBranchPreviewHost =
      host.endsWith('.the-dahan-codex.pages.dev') && host !== 'the-dahan-codex.pages.dev'
    if (isBranchPreviewHost) return 'branch'

    return 'main'
  }

  function updateFavicon(resolvedTheme, variant) {
    const suffix = variant === 'main' ? '' : `-${variant}`
    const link = document.querySelector('#app-favicon-svg')
    if (link) {
      link.setAttribute('href', `/favicon-${resolvedTheme}${suffix}.svg`)
    }
  }

  const mode = readTheme() || 'system'
  const resolvedTheme = resolveTheme(mode)
  const isDark = resolvedTheme === 'dark'

  if (isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }

  const meta = document.querySelector("meta[name='theme-color']")
  if (meta) {
    meta.setAttribute('content', isDark ? DARK_META_COLOR : LIGHT_META_COLOR)
  }

  const variant = resolveEnvVariant()
  root.setAttribute('data-env-variant', variant)
  updateFavicon(resolvedTheme, variant)
})()
