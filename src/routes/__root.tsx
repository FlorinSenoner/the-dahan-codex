import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import type { ConvexQueryClient } from '@convex-dev/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, useRouter } from '@tanstack/react-router'
import type { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ErrorBoundary } from '../components/error-boundary'
import { BottomNav } from '../components/layout/bottom-nav'
import { InstallPrompt } from '../components/pwa/install-prompt'
import { OfflineIndicator } from '../components/pwa/offline-indicator'
import { UpdateBanner } from '../components/pwa/update-banner'
import { Button } from '../components/ui/button'
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
  errorComponent: RootErrorComponent,
})

function RootErrorComponent({ error }: { error: Error }) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-serif font-semibold text-foreground mb-2">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mb-6">
          An unexpected error occurred. Try again or reload the page.
        </p>
        {import.meta.env.DEV && error?.message && (
          <pre className="text-xs text-left bg-muted p-3 rounded-md mb-6 overflow-auto max-h-32">
            {error.message}
          </pre>
        )}
        <div className="flex gap-3 justify-center">
          <Button onClick={() => router.invalidate()} variant="outline">
            Try Again
          </Button>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    </div>
  )
}

function RootComponent() {
  const { convexClient } = Route.useRouteContext()
  const { isUpdateAvailable, triggerUpdate } = useServiceWorker()

  return (
    <ErrorBoundary>
      <ClerkProvider
        afterSignOutUrl="/"
        appearance={{
          variables: {
            colorPrimary: 'var(--primary)',
            colorBackground: 'var(--card)',
            colorText: 'var(--foreground)',
            colorInputBackground: 'var(--input)',
            colorInputText: 'var(--foreground)',
            colorDanger: 'var(--destructive)',
            colorNeutral: 'var(--muted-foreground)',
            fontFamily: '"Lora", serif',
            borderRadius: '0.75rem',
          },
        }}
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
    </ErrorBoundary>
  )
}
