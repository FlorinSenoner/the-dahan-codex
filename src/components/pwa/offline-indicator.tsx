import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '@/hooks'

/**
 * Subtle offline status indicator pill.
 * Positioned at bottom-right above BottomNav.
 * Only renders when the user is offline.
 * Uses accessible attributes for screen readers.
 */
export function OfflineIndicator() {
  const isOnline = useOnlineStatus()

  // Only show when offline
  if (isOnline) {
    return null
  }

  return (
    <output
      aria-live="polite"
      className="fixed bottom-20 right-4 z-40 inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/90 px-3 py-1.5 text-sm text-zinc-300 animate-in fade-in"
    >
      <WifiOff aria-hidden="true" className="h-3.5 w-3.5" />
      <span>Offline</span>
    </output>
  )
}
