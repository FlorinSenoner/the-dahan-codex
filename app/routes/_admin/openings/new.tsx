import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";

import { OpeningForm } from "@/components/admin/opening-form";
import { PageHeader } from "@/components/ui/page-header";
import type { OpeningFormData } from "@/lib/schemas/opening";

export const Route = createFileRoute("/_admin/openings/new")({
  component: NewOpeningPage,
});

/**
 * Generate a URL-friendly slug from a name.
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
}

/**
 * Admin page for creating a new opening.
 * Includes slug auto-generation from name on blur.
 */
function NewOpeningPage() {
  const { data: spirits, isPending: spiritsPending } = useQuery(
    convexQuery(api.spirits.listAllSpirits, {}),
  );
  const createMutation = useMutation(api.openings.create);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: OpeningFormData) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await createMutation({
        spiritId: data.spiritId as Id<"spirits">,
        slug: data.slug,
        name: data.name,
        description: data.description || undefined,
        difficulty: data.difficulty || undefined,
        turns: data.turns,
        author: data.author || undefined,
        sourceUrl: data.sourceUrl || undefined,
      });
      navigate({ to: "/openings" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create opening");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Opening" backHref="/openings" />

      <main className="p-4 max-w-2xl">
        {/* Loading state */}
        {spiritsPending && (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/50 rounded-md text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        {!spiritsPending && spirits && (
          <OpeningForm
            spirits={spirits}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onSlugGenerate={generateSlug}
          />
        )}
      </main>
    </>
  );
}
