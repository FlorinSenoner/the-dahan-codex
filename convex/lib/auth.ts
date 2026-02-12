import type { ActionCtx, MutationCtx, QueryCtx } from '../_generated/server'

/**
 * Get the current user's identity from Convex auth
 * Returns null if not authenticated
 */
export async function getIdentity(ctx: QueryCtx | MutationCtx | ActionCtx) {
  return await ctx.auth.getUserIdentity()
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx | ActionCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    throw new Error('Not authenticated')
  }
  return identity
}

/**
 * Check if the current user has admin role
 * Admin claim comes from Clerk JWT template: user.public_metadata.role
 * Role can be "admin", "moderator", "contributor", etc. for future expansion
 */
export async function isAdmin(ctx: QueryCtx | MutationCtx | ActionCtx): Promise<boolean> {
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
export async function requireAdmin(ctx: QueryCtx | MutationCtx | ActionCtx) {
  const identity = await requireAuth(ctx)
  const admin = await isAdmin(ctx)
  if (!admin) {
    throw new Error('Admin access required')
  }
  return identity
}
