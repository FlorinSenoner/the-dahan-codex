import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";

import { OpeningForm } from "@/components/admin/opening-form";
import { TurnAccordion } from "@/components/spirits/turn-accordion";
import { PageHeader } from "@/components/ui/page-header";
import { Heading } from "@/components/ui/typography";
import type { OpeningFormData } from "@/lib/schemas/opening";

export const Route = createFileRoute("/_admin/openings/$id/edit")({
  component: EditOpeningPage,
});

/**
 * Admin page for editing an existing opening.
 * Displays form on the left and live preview with TurnAccordion on the right.
 */
function EditOpeningPage() {
  const { id } = Route.useParams();
  const { data: opening, isPending: openingPending } = useQuery(
    convexQuery(api.openings.getById, { id: id as Id<"openings"> }),
  );
  const { data: spirits, isPending: spiritsPending } = useQuery(
    convexQuery(api.spirits.listAllSpirits, {}),
  );
  const updateMutation = useMutation(api.openings.update);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: OpeningFormData) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await updateMutation({
        id: id as Id<"openings">,
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        difficulty: data.difficulty || undefined,
        turns: data.turns,
        author: data.author || undefined,
        sourceUrl: data.sourceUrl || undefined,
      });
      navigate({ to: "/openings" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update opening");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPending = openingPending || spiritsPending;

  // Loading state
  if (isPending) {
    return (
      <>
        <PageHeader title="Edit Opening" backHref="/openings" />
        <main className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </main>
      </>
    );
  }

  // Not found state
  if (!opening) {
    return (
      <>
        <PageHeader title="Edit Opening" backHref="/openings" />
        <main className="p-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Opening not found.</p>
          </div>
        </main>
      </>
    );
  }

  // Build defaultValues for the form
  const defaultValues: Partial<OpeningFormData> = {
    spiritId: opening.spiritId,
    name: opening.name,
    slug: opening.slug,
    description: opening.description ?? "",
    difficulty: opening.difficulty,
    turns: opening.turns,
    author: opening.author ?? "",
    sourceUrl: opening.sourceUrl ?? "",
  };

  return (
    <>
      <PageHeader title="Edit Opening" backHref="/openings" />

      <main className="p-4">
        {/* Error display */}
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/50 rounded-md text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Two-column layout on desktop */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left column: Form */}
          <div>
            {spirits && (
              <OpeningForm
                defaultValues={defaultValues}
                spirits={spirits}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>

          {/* Right column: Preview */}
          <div>
            <Heading variant="h3" className="mb-4">
              Preview
            </Heading>
            <TurnAccordion turns={opening.turns} />
          </div>
        </div>
      </main>
    </>
  );
}
