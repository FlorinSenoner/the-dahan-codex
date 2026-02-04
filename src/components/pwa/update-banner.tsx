import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UpdateBannerProps {
  onReload: () => void
}

/**
 * Subtle pill-style update notification shown when a new service worker is waiting.
 * Positioned bottom-right to be accessible but unobtrusive.
 * Entire pill is clickable - no nested button.
 */
export function UpdateBanner({ onReload }: UpdateBannerProps) {
  return (
    <div aria-live="polite" className="fixed bottom-20 right-4 z-50">
      <Button
        className="h-auto rounded-full border border-zinc-700 bg-zinc-800/90 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700/90 hover:text-zinc-100 animate-in fade-in"
        onClick={onReload}
        variant="ghost"
      >
        <RefreshCw aria-hidden="true" className="h-3.5 w-3.5 mr-2" />
        Update
      </Button>
    </div>
  )
}
