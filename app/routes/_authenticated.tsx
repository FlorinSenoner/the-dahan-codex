import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { getAuthData } from "../lib/auth";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const auth = await getAuthData();

    if (!auth.userId) {
      throw redirect({
        to: "/sign-in/$",
        params: { _splat: "" },
      });
    }

    return { userId: auth.userId };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return <Outlet />;
}
