import { UserButton } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Profile</h1>
      <p>This is a protected page. You are signed in.</p>
      <div style={{ marginTop: "1rem" }}>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
