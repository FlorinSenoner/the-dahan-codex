import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/games")({
  component: GamesLayout,
});

function GamesLayout() {
  // No wrapper here - each child route controls its own layout
  return <Outlet />;
}
