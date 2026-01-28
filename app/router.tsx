import { ConvexQueryClient } from "@convex-dev/react-query";
import {
  type PersistedClient,
  persistQueryClient,
} from "@tanstack/query-persist-client-core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { del, get, set } from "idb-keyval";
import { routeTree } from "./routeTree.gen";

// IndexedDB persister for TanStack Query
function createIDBPersister(idbKey = "tanstack-query-cache") {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbKey, client);
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbKey);
    },
    removeClient: async () => {
      await del(idbKey);
    },
  };
}

function NotFound() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/">Go back home</a>
    </div>
  );
}

export function createRouter() {
  const convexUrl = import.meta.env.VITE_CONVEX_URL as string;

  const convexClient = new ConvexReactClient(convexUrl, {
    unsavedChangesWarning: false,
  });

  const convexQueryClient = new ConvexQueryClient(convexClient);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
        // Keep data fresh for 5 minutes
        staleTime: 1000 * 60 * 5,
        // Keep data in cache for 7 days (for offline access)
        gcTime: 1000 * 60 * 60 * 24 * 7,
      },
    },
  });

  convexQueryClient.connect(queryClient);

  // Setup IndexedDB persistence for offline access
  const persister = createIDBPersister();
  persistQueryClient({
    queryClient,
    persister,
    // Max age matches gcTime (7 days)
    maxAge: 1000 * 60 * 60 * 24 * 7,
    // Dehydrate options to control what gets persisted
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => {
        // Only persist successful queries
        return query.state.status === "success";
      },
    },
  });

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
        <ConvexProvider client={convexQueryClient.convexClient}>
          {children}
        </ConvexProvider>
      </QueryClientProvider>
    ),
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
