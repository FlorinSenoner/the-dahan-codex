const DEFAULT_SITE_URL = 'https://dahan-codex.com'

function normalizeSiteUrl(url: string) {
  return url.replace(/\/+$/, '')
}

export const SITE_URL = normalizeSiteUrl(
  (import.meta.env.VITE_SITE_URL as string | undefined)?.trim() || DEFAULT_SITE_URL,
)
