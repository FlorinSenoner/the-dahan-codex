import { UserButton } from "@clerk/tanstack-start";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const health = useQuery(api.health.ping);
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>The Dahan Codex</h1>
      <p>Spirit Island companion app</p>

      <div style={{ marginTop: "2rem" }}>
        <p>
          Convex status:{" "}
          {health ? (
            <span style={{ color: "green" }}>{health.status}</span>
          ) : (
            <span style={{ color: "gray" }}>connecting...</span>
          )}
        </p>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {isLoading ? (
          <p>Loading auth...</p>
        ) : isAuthenticated ? (
          <div>
            <p>You are signed in!</p>
            <UserButton afterSignOutUrl="/" />
            <div style={{ marginTop: "1rem" }}>
              <Link to="/profile">Go to Profile (protected)</Link>
            </div>
          </div>
        ) : (
          <div>
            <p>You are not signed in.</p>
            <Link to="/sign-in/$" params={{ _splat: "" }}>
              Sign In
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
