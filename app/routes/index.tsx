import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const health = useQuery(api.health.ping);

  return (
    <main>
      <h1>The Dahan Codex</h1>
      <p>Spirit Island companion app</p>
      <div>
        <p>
          Convex status:{" "}
          {health ? (
            <span style={{ color: "green" }}>{health.status}</span>
          ) : (
            <span style={{ color: "gray" }}>connecting...</span>
          )}
        </p>
      </div>
    </main>
  );
}
