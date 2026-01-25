import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/spirits")({
  component: SpiritsLayout,
});

function SpiritsLayout() {
  return <Outlet />;
}
