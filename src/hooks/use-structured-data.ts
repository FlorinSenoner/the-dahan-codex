import { useEffect, useMemo } from 'react'

/**
 * Inject a JSON-LD structured data script into <head> and clean up on unmount.
 * Each call is identified by a unique `id` so multiple schemas can coexist.
 */
export function useStructuredData(id: string, data: object | null) {
  const serialized = useMemo(() => (data ? JSON.stringify(data) : null), [data])

  useEffect(() => {
    if (!serialized) return

    const existing = document.getElementById(id)
    if (existing) existing.remove()

    const script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    script.textContent = serialized
    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [id, serialized])
}
