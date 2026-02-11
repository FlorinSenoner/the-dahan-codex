import { useCallback, useEffect, useRef, useState } from 'react'
import { Workbox } from 'workbox-window'

interface UseServiceWorkerResult {
  /** Whether a new service worker is waiting to activate */
  isUpdateAvailable: boolean
  /** Trigger the waiting service worker to activate and reload */
  triggerUpdate: () => void
}

/**
 * Hook to manage service worker updates using workbox-window.
 * Detects when a new SW is waiting and provides a function to trigger the update.
 */
export function useServiceWorker(): UseServiceWorkerResult {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const wbRef = useRef<Workbox | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const wb = new Workbox(
      import.meta.env.DEV ? '/dev-sw.js?dev-sw' : '/sw.js',
      import.meta.env.DEV ? { type: 'module' } : undefined,
    )
    wbRef.current = wb

    wb.addEventListener('waiting', () => {
      setIsUpdateAvailable(true)
    })

    wb.addEventListener('controlling', () => {
      window.location.reload()
    })

    wb.register().catch((err) => {
      console.error('Service worker registration failed:', err)
    })

    // Check for updates every hour
    const interval = setInterval(
      () => {
        wb.update()
      },
      60 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [])

  const triggerUpdate = useCallback(() => {
    const wb = wbRef.current
    if (!wb) return

    wb.messageSkipWaiting()
  }, [])

  return {
    isUpdateAvailable,
    triggerUpdate,
  }
}
