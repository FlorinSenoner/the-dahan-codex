import { useEffect } from 'react'

const SITE_URL = 'https://dahan-codex.com'
const DEFAULT_TITLE =
  'The Dahan Codex — Spirit Island Companion App | Opening Guides, Spirit Reference & Game Tracker'
const DEFAULT_DESCRIPTION =
  'Free Spirit Island companion app with turn-by-turn opening guides for all 37 spirits and 31 aspects. Complete spirit reference, game tracker, and offline support.'
const DEFAULT_CANONICAL_PATH = '/'
const DEFAULT_OG_TYPE = 'website'
const DEFAULT_ROBOTS = 'index,follow'

interface PageMetaOptions {
  title?: string
  description?: string
  canonicalPath?: string
  ogType?: 'website' | 'article'
  robots?: string
  ogImage?: string
}

function normalizeCanonicalPath(path?: string) {
  if (!path) return DEFAULT_CANONICAL_PATH
  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      const parsed = new URL(path)
      return `${parsed.pathname}${parsed.search}`
    } catch {
      return DEFAULT_CANONICAL_PATH
    }
  }
  return path.startsWith('/') ? path : `/${path}`
}

function ensureMetaTag(selector: string, attrs: Record<string, string>) {
  let tag = document.querySelector<HTMLMetaElement>(selector)
  if (!tag) {
    tag = document.createElement('meta')
    for (const [key, value] of Object.entries(attrs)) {
      tag.setAttribute(key, value)
    }
    document.head.appendChild(tag)
  }
  return tag
}

/**
 * Update document title and meta tags for the current page.
 * Falls back to defaults when component unmounts.
 */
export function usePageMeta(optionsOrTitle?: PageMetaOptions | string, legacyDescription?: string) {
  const options: PageMetaOptions =
    typeof optionsOrTitle === 'string'
      ? { title: optionsOrTitle, description: legacyDescription }
      : optionsOrTitle || {}

  useEffect(() => {
    const fullTitle = options.title ? `${options.title} — The Dahan Codex` : DEFAULT_TITLE
    const description = options.description || DEFAULT_DESCRIPTION
    const livePath = `${window.location.pathname}${window.location.search}`
    const canonicalPath = normalizeCanonicalPath(options.canonicalPath || livePath)
    const canonicalUrl = `${SITE_URL}${canonicalPath}`
    const ogType = options.ogType || DEFAULT_OG_TYPE
    const robots = options.robots || DEFAULT_ROBOTS

    document.title = fullTitle

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl)
    }

    const ogTitle = ensureMetaTag('meta[property="og:title"]', { property: 'og:title' })
    ogTitle.setAttribute('content', fullTitle)

    const ogDescription = ensureMetaTag('meta[property="og:description"]', {
      property: 'og:description',
    })
    ogDescription.setAttribute('content', description)

    const ogUrl = ensureMetaTag('meta[property="og:url"]', { property: 'og:url' })
    ogUrl.setAttribute('content', canonicalUrl)

    const ogTypeTag = ensureMetaTag('meta[property="og:type"]', { property: 'og:type' })
    ogTypeTag.setAttribute('content', ogType)

    const twitterTitle = ensureMetaTag('meta[name="twitter:title"]', { name: 'twitter:title' })
    twitterTitle.setAttribute('content', fullTitle)

    const twitterDescription = ensureMetaTag('meta[name="twitter:description"]', {
      name: 'twitter:description',
    })
    twitterDescription.setAttribute('content', description)

    const robotsTag = ensureMetaTag('meta[name="robots"]', { name: 'robots' })
    robotsTag.setAttribute('content', robots)

    if (options.ogImage) {
      const ogImage = ensureMetaTag('meta[property="og:image"]', { property: 'og:image' })
      ogImage.setAttribute('content', options.ogImage)

      const twitterImage = ensureMetaTag('meta[name="twitter:image"]', { name: 'twitter:image' })
      twitterImage.setAttribute('content', options.ogImage)
    }

    return () => {
      document.title = DEFAULT_TITLE
      metaDescription?.setAttribute('content', DEFAULT_DESCRIPTION)
      canonical?.setAttribute('href', `${SITE_URL}${DEFAULT_CANONICAL_PATH}`)
      ogTitle?.setAttribute('content', DEFAULT_TITLE)
      ogDescription?.setAttribute('content', DEFAULT_DESCRIPTION)
      ogUrl?.setAttribute('content', `${SITE_URL}${DEFAULT_CANONICAL_PATH}`)
      ogTypeTag?.setAttribute('content', DEFAULT_OG_TYPE)
      twitterTitle?.setAttribute('content', DEFAULT_TITLE)
      twitterDescription?.setAttribute('content', DEFAULT_DESCRIPTION)
      robotsTag?.setAttribute('content', DEFAULT_ROBOTS)
    }
  }, [
    options.title,
    options.description,
    options.canonicalPath,
    options.ogType,
    options.robots,
    options.ogImage,
  ])
}
