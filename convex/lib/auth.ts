import { ConvexError } from 'convex/values'
import type { MutationCtx, QueryCtx } from '../_generated/server'

/**
 * Get the current user's identity from Convex auth
 * Returns null if not authenticated
 */
export async function getIdentity(ctx: QueryCtx | MutationCtx) {
  return await ctx.auth.getUserIdentity()
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    throw new ConvexError({
      code: 'NOT_AUTHENTICATED',
      message: 'Not authenticated',
    })
  }
  return identity
}

/**
 * Check if the current user has admin role
 * Admin claim comes from Clerk JWT template: user.public_metadata.role
 * Role can be "admin", "moderator", "contributor", etc. for future expansion
 */
export async function isAdmin(ctx: QueryCtx | MutationCtx): Promise<boolean> {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    return false
  }
  // The role claim is set in Clerk JWT template from user.public_metadata.role
  // biome-ignore lint/suspicious/noExplicitAny: Convex identity type doesn't include custom role claim
  return (identity as any).role === 'admin'
}

/**
 * Require admin role - throws if not admin
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const identity = await requireAuth(ctx)
  // biome-ignore lint/suspicious/noExplicitAny: Convex identity type doesn't include custom role claim
  const role = (identity as any).role
  if (role !== 'admin') {
    throw new ConvexError({
      code: 'ADMIN_REQUIRED',
      message: 'Admin access required',
    })
  }
  return identity
}
