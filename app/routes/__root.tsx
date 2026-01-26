import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import type { ConvexQueryClient } from "@convex-dev/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useEffect } from "react";
import { BottomNav } from "../components/layout/bottom-nav";
import { registerSW } from "../lib/sw-register";

// Router context type
interface RouterContext {
  queryClient: QueryClient;
  convexClient: ConvexReactClient;
  convexQueryClient: ConvexQueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { convexClient } = Route.useRouteContext();

  useEffect(() => {
    registerSW();
  }, []);

  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      signInUrl="/sign-in"
      signUpUrl="/sign-in"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
        <Outlet />
        <BottomNav />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
