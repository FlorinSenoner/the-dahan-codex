import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { ConvexProvider } from "convex/react";
import { convex, queryClient } from "../lib/convex";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>The Dahan Codex</title>
      </head>
      <body>
        <ConvexProvider client={convex}>
          <QueryClientProvider client={queryClient}>
            <Outlet />
          </QueryClientProvider>
        </ConvexProvider>
      </body>
    </html>
  );
}
