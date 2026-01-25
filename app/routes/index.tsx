import { UserButton } from "@clerk/clerk-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useConvexAuth, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>The Dahan Codex</h1>
      <p>Spirit Island companion app</p>

      <div style={{ marginTop: "2rem" }}>
        <ConvexStatus />
      </div>

      <div style={{ marginTop: "2rem" }}>
        <AuthStatus />
      </div>
    </main>
  );
}

// Client-only component for Convex status
function ConvexStatus() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <p>
        Convex status: <span style={{ color: "gray" }}>connecting...</span>
      </p>
    );
  }

  return <ConvexStatusClient />;
}

function ConvexStatusClient() {
  const health = useQuery(api.health.ping);

  return (
    <p>
      Convex status:{" "}
      {health ? (
        <span style={{ color: "green" }}>{health.status}</span>
      ) : (
        <span style={{ color: "gray" }}>connecting...</span>
      )}
    </p>
  );
}

// Client-only component for auth status
function AuthStatus() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <p>Loading auth...</p>;
  }

  return <AuthStatusClient />;
}

function AuthStatusClient() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <p>Loading auth...</p>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <p>You are signed in!</p>
        <UserButton />
        <div style={{ marginTop: "1rem" }}>
          <Link to="/profile">Go to Profile (protected)</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p>You are not signed in.</p>
      <Link to="/sign-in/$" params={{ _splat: "" }}>
        Sign In
      </Link>
    </div>
  );
}
