import { useUser } from "@clerk/clerk-react";

/**
 * Check if the current user has admin role
 * Returns true only if user.publicMetadata.role === "admin"
 *
 * Admin status is set in Clerk Dashboard under User Metadata > Public Metadata
 * The JWT template should include role in the token for server-side checks
 *
 * Role can be "admin", "moderator", "contributor", etc. for future expansion
 */
export function useAdmin(): boolean {
  const { user, isLoaded } = useUser();
  if (!isLoaded || !user) return false;
  return user.publicMetadata?.role === "admin";
}
