import { useUser } from "@clerk/clerk-react";

/**
 * Check if the current user has admin role
 * Returns true only if user.publicMetadata.isAdmin === true
 *
 * Admin status is set in Clerk Dashboard under User Metadata > Public Metadata
 * The JWT template should include isAdmin in the token for server-side checks
 */
export function useAdmin(): boolean {
  const { user, isLoaded } = useUser();
  if (!isLoaded || !user) return false;
  return user.publicMetadata?.isAdmin === true;
}
