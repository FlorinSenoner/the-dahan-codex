import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/openings")({
  component: AdminOpeningsPage,
});

/**
 * Admin Openings Management Page
 *
 * TODO: Implement in Plan 05-02:
 * - Opening list with edit/delete actions
 * - Create new opening form
 * - Search and filter openings
 */
function AdminOpeningsPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Opening Management</h1>
      <p>Admin-only opening management page.</p>
    </main>
  );
}
