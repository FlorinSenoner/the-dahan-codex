import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { routeTree } from "./routeTree.gen";

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
      },
    },
  });

  convexQueryClient.connect(queryClient);

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
