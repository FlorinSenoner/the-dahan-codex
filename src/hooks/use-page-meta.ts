import { useEffect } from 'react'

const DEFAULT_TITLE = 'The Dahan Codex'
const DEFAULT_DESCRIPTION =
  'Offline-first companion app for Spirit Island. Browse spirits, follow opening guides, and track your games.'

/**
 * Update document title and meta tags for the current page.
 * Falls back to defaults when component unmounts.
 */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${DEFAULT_TITLE}` : DEFAULT_TITLE
    document.title = fullTitle

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description || DEFAULT_DESCRIPTION)
    }

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', fullTitle)
    }

    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', description || DEFAULT_DESCRIPTION)
    }

    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (twitterTitle) {
      twitterTitle.setAttribute('content', fullTitle)
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description || DEFAULT_DESCRIPTION)
    }

    return () => {
      document.title = DEFAULT_TITLE
      metaDescription?.setAttribute('content', DEFAULT_DESCRIPTION)
      ogTitle?.setAttribute('content', DEFAULT_TITLE)
      ogDescription?.setAttribute('content', DEFAULT_DESCRIPTION)
      twitterTitle?.setAttribute('content', DEFAULT_TITLE)
      twitterDescription?.setAttribute('content', DEFAULT_DESCRIPTION)
    }
  }, [title, description])
}
