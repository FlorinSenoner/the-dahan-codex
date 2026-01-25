import { ClerkProvider, useAuth } from "@clerk/tanstack-react-start";
import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useEffect, useState } from "react";
import { convex, queryClient } from "../lib/convex";
import { registerSW } from "../lib/sw-register";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    registerSW();
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#1a1a1a" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <title>The Dahan Codex</title>
      </head>
      <body>
        {isMounted ? (
          <ClerkProvider
            publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
          >
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
              <QueryClientProvider client={queryClient}>
                <Outlet />
              </QueryClientProvider>
            </ConvexProviderWithClerk>
          </ClerkProvider>
        ) : (
          <Outlet />
        )}
      </body>
    </html>
  );
}
