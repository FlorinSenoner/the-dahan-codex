import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

export const Route = createFileRoute("/_admin/openings")({
  component: AdminOpeningsPage,
});

/**
 * Admin Openings Management Page
 *
 * Shows all openings with edit/delete actions.
 * Delete requires confirmation before executing.
 */
function AdminOpeningsPage() {
  const { data: openings, isPending } = useQuery(
    convexQuery(api.openings.listAll, {}),
  );
  const deleteMutation = useMutation(api.openings.remove);
  const [deleteId, setDeleteId] = useState<Id<"openings"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteMutation({ id: deleteId });
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="Manage Openings">
        <a href="/openings/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New Opening
          </Button>
        </a>
      </PageHeader>

      <main className="p-4">
        {/* Loading state */}
        {isPending && (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-border rounded-lg p-4 bg-card animate-pulse"
              >
                <div className="h-4 w-24 bg-muted rounded mb-2" />
                <div className="h-5 w-48 bg-muted rounded mb-2" />
                <div className="h-4 w-32 bg-muted rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isPending && openings?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No openings yet. Create your first opening.
            </p>
            <a href="/openings/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" /> New Opening
              </Button>
            </a>
          </div>
        )}

        {/* Openings list */}
        {!isPending && openings && openings.length > 0 && (
          <div className="grid gap-4">
            {openings.map((opening) => (
              <div
                key={opening._id}
                className="border border-border rounded-lg p-4 bg-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Spirit name */}
                    <p className="text-sm text-muted-foreground mb-1">
                      {opening.spiritName}
                    </p>

                    {/* Opening name */}
                    <h3 className="font-medium text-foreground mb-2">
                      {opening.name}
                    </h3>

                    {/* Metadata row */}
                    <div className="flex items-center gap-3 text-sm">
                      {/* Difficulty badge */}
                      {opening.difficulty && (
                        <Badge variant="outline">{opening.difficulty}</Badge>
                      )}

                      {/* Turn count */}
                      <span className="text-muted-foreground">
                        {opening.turns.length} turn
                        {opening.turns.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a href={`/openings/${opening._id}/edit`}>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label={`Edit ${opening.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteId(opening._id)}
                      aria-label={`Delete ${opening.name}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {/* Delete confirmation inline */}
                {deleteId === opening._id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-foreground mb-3">
                      Delete this opening? This cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(null)}
                        disabled={isDeleting}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
