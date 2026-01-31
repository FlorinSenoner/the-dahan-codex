import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";

export const Route = createFileRoute("/_authenticated/games")({
  component: GamesLayout,
});

function GamesLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Games" />
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
    </div>
  );
}
