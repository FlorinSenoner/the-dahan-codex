import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main>
      <h1>The Dahan Codex</h1>
      <p>Spirit Island companion app</p>
    </main>
  );
}
