import { ConvexQueryClient } from '@convex-dev/react-query'
import { type PersistedClient, persistQueryClient } from '@tanstack/query-persist-client-core'
import { dehydrate, hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { createStore, del, get, set } from 'idb-keyval'
import { routeTree } from './routeTree.gen'

export const idbStore = createStore('the-dahan-codex', 'cache')

const IDB_CACHE_KEY = 'tanstack-query-cache'
const MAX_AGE = 1000 * 60 * 60 * 24 * 7 // 7 days

// IndexedDB persister for TanStack Query
function createIDBPersister(idbKey = IDB_CACHE_KEY) {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbKey, client, idbStore)
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbKey, idbStore)
    },
    removeClient: async () => {
      await del(idbKey, idbStore)
    },
  }
}

/**
 * Restore cached queries from IndexedDB into the query client.
 * Called before router initialization to ensure offline data is available.
 */
async function restoreQueryCache(queryClient: QueryClient) {
  try {
    const persistedClient = await get<PersistedClient>(IDB_CACHE_KEY, idbStore)
    if (persistedClient) {
      // Check if cache is still valid (not expired)
      const isExpired = Date.now() - persistedClient.timestamp > MAX_AGE
      if (!isExpired && persistedClient.clientState) {
        hydrate(queryClient, persistedClient.clientState)
      }
    }
  } catch (error) {
    console.warn('Failed to restore query cache:', error)
  }
}

/**
 * Manually persist the query cache to IndexedDB.
 * Call this after bulk data fetching to ensure persistence.
 */
export async function persistQueryCache(queryClient: QueryClient) {
  const dehydratedState = dehydrate(queryClient, {
    shouldDehydrateQuery: (query) => query.state.status === 'success',
  })
  const persistedClient: PersistedClient = {
    timestamp: Date.now(),
    buster: '',
    clientState: dehydratedState,
  }
  await set(IDB_CACHE_KEY, persistedClient, idbStore)
}

function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-2xl font-bold text-foreground">404 - Page Not Found</h1>
      <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist.</p>
      <a
        className="mt-4 text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
        href="/"
      >
        Go back home
      </a>
    </div>
  )
}

export async function createRouter() {
  const convexUrl = import.meta.env.VITE_CONVEX_URL as string

  const convexClient = new ConvexReactClient(convexUrl, {
    unsavedChangesWarning: false,
  })

  const convexQueryClient = new ConvexQueryClient(convexClient)

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
        // Keep data fresh for 5 minutes
        staleTime: 1000 * 60 * 5,
        // Keep data in cache for 7 days (for offline access)
        gcTime: MAX_AGE,
      },
    },
  })

  convexQueryClient.connect(queryClient)

  // Restore cached queries from IndexedDB BEFORE router starts
  // This ensures offline data is available for initial navigation
  await restoreQueryCache(queryClient)

  // Setup ongoing IndexedDB persistence for future changes
  const persister = createIDBPersister()
  persistQueryClient({
    queryClient,
    persister,
    maxAge: MAX_AGE,
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => {
        // Only persist successful queries
        return query.state.status === 'success'
      },
    },
  })

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultNotFoundComponent: NotFound,
    defaultViewTransition: true,
    context: {
      queryClient,
      convexClient,
      convexQueryClient,
    },
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <ConvexProvider client={convexQueryClient.convexClient}>{children}</ConvexProvider>
      </QueryClientProvider>
    ),
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: Awaited<ReturnType<typeof createRouter>>
  }
}
