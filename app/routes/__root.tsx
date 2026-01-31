import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import type { ConvexQueryClient } from "@convex-dev/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { BottomNav } from "../components/layout/bottom-nav";
import { InstallPrompt } from "../components/pwa/install-prompt";
import { OfflineIndicator } from "../components/pwa/offline-indicator";
import { UpdateBanner } from "../components/pwa/update-banner";
import { EditModeProvider } from "../contexts/edit-mode-context";
import { useServiceWorker } from "../hooks/use-service-worker";

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
  const { isUpdateAvailable, triggerUpdate } = useServiceWorker();

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
        <EditModeProvider>
          <OfflineIndicator />
          {isUpdateAvailable && <UpdateBanner onReload={triggerUpdate} />}
          <InstallPrompt />
          <Outlet />
          <BottomNav />
        </EditModeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
