import { useUser } from "@clerk/clerk-react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  // Check admin role from Clerk publicMetadata
  const isAdmin = user?.publicMetadata?.isAdmin === true;

  useEffect(() => {
    if (isLoaded && !isAdmin) {
      navigate({ to: "/" });
    }
  }, [isLoaded, isAdmin, navigate]);

  if (!isLoaded) {
    return <div style={{ padding: "2rem" }}>Loading...</div>;
  }

  if (!isAdmin) {
    return <div style={{ padding: "2rem" }}>Access denied</div>;
  }

  return <Outlet />;
}
