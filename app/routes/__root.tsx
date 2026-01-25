import { ClerkProvider, useAuth } from "@clerk/tanstack-start";
import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { convex, queryClient } from "../lib/convex";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <QueryClientProvider client={queryClient}>
          <html lang="en">
            <head>
              <meta charSet="UTF-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <title>The Dahan Codex</title>
            </head>
            <body>
              <Outlet />
            </body>
          </html>
        </QueryClientProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
