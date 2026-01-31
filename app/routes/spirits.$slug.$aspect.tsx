import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { SpiritDetailContent } from "./spirits.$slug";

/**
 * Spirit detail page
 *
 * Offline behavior: This page works offline for spirits that have been
 * synced via Settings > Sync Data. Without prior sync, the page will
 * show a loading state while waiting for Convex connection.
 */
export const Route = createFileRoute("/spirits/$slug/$aspect")({
  loader: async ({ context, params }) => {
    // Use prefetchQuery to avoid blocking when offline
    // The component's useSuspenseQuery will use cached data if available
    try {
      await context.queryClient.prefetchQuery(
        convexQuery(api.spirits.getSpiritBySlug, {
          slug: params.slug,
          aspect: params.aspect,
        }),
      );
    } catch {
      // Ignore fetch errors - component will use cached data or show error state
    }
  },
  component: AspectDetailPage,
});

function AspectDetailPage() {
  const { slug, aspect } = Route.useParams();

  const { data: spirit } = useSuspenseQuery(
    convexQuery(api.spirits.getSpiritBySlug, { slug, aspect }),
  );

  // Not found state - aspect doesn't exist
  if (spirit === null || (spirit && !spirit.aspectName)) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
        <p className="text-xl font-serif text-foreground mb-2">
          Aspect Not Found
        </p>
        <p className="text-muted-foreground mb-4">
          The aspect "{aspect}" of "{slug}" doesn't exist.
        </p>
        <Link
          to="/spirits/$slug"
          params={{ slug }}
          search={{ opening: undefined }}
          viewTransition
          className="text-primary hover:underline cursor-pointer"
        >
          Back to Base Spirit
        </Link>
      </div>
    );
  }

  return <SpiritDetailContent spirit={spirit} slug={slug} aspect={aspect} />;
}
