import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { SpiritDetailContent } from "./spirits.$slug";

export const Route = createFileRoute("/spirits/$slug/$aspect")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.spirits.getSpiritBySlug, {
        slug: params.slug,
        aspect: params.aspect,
      }),
    );
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
