import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import type { ConvexQueryClient } from '@convex-dev/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { BottomNav } from '../components/layout/bottom-nav'
import { InstallPrompt } from '../components/pwa/install-prompt'
import { OfflineIndicator } from '../components/pwa/offline-indicator'
import { UpdateBanner } from '../components/pwa/update-banner'
import { Toaster } from '../components/ui/sonner'
import { EditModeProvider } from '../contexts/edit-mode-context'
import { ThemeProvider } from '../contexts/theme-context'
import { useServiceWorker } from '../hooks/use-service-worker'

// Router context type
interface RouterContext {
  queryClient: QueryClient
  convexClient: ConvexReactClient
  convexQueryClient: ConvexQueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const { convexClient } = Route.useRouteContext()
  const { isUpdateAvailable, triggerUpdate } = useServiceWorker()

  return (
    <ClerkProvider
      afterSignOutUrl="/"
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      signInFallbackRedirectUrl="/"
      signInUrl="/sign-in"
      signUpFallbackRedirectUrl="/"
      signUpUrl="/sign-up"
    >
      <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
        <ThemeProvider>
          <EditModeProvider>
            <OfflineIndicator />
            {isUpdateAvailable && <UpdateBanner onReload={triggerUpdate} />}
            <InstallPrompt />
            <Outlet />
            <BottomNav />
            <Toaster />
          </EditModeProvider>
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}
