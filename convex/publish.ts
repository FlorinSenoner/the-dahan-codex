import { v } from 'convex/values'
import { internal } from './_generated/api'
import { action, internalMutation, internalQuery, query } from './_generated/server'
import { isAdmin, requireAdmin } from './lib/auth'

const PUBLISH_KEY = 'public-site'

function defaultPublishState() {
  return {
    key: PUBLISH_KEY,
    hasPendingChanges: false,
    publishStatus: 'idle' as const,
    lastContentChangeAt: undefined,
    lastPublishRequestedAt: undefined,
    lastPublishRequestedBy: undefined,
    requestId: undefined,
    lastError: undefined,
    lastPublishedAt: undefined,
    lastRunUrl: undefined,
  }
}

export const getStatus = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      return null
    }

    const existing = await ctx.db
      .query('publishStates')
      .withIndex('by_key', (q) => q.eq('key', PUBLISH_KEY))
      .first()

    return existing ?? defaultPublishState()
  },
})

export const getStateInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('publishStates')
      .withIndex('by_key', (q) => q.eq('key', PUBLISH_KEY))
      .first()
  },
})

export const markContentDirtyInternal = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now()
    const existing = await ctx.db
      .query('publishStates')
      .withIndex('by_key', (q) => q.eq('key', PUBLISH_KEY))
      .first()

    if (!existing) {
      await ctx.db.insert('publishStates', {
        ...defaultPublishState(),
        hasPendingChanges: true,
        lastContentChangeAt: now,
      })
      return
    }

    await ctx.db.patch(existing._id, {
      hasPendingChanges: true,
      lastContentChangeAt: now,
    })
  },
})

export const queuePublishInternal = internalMutation({
  args: {
    requestId: v.string(),
    requestedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const existing = await ctx.db
      .query('publishStates')
      .withIndex('by_key', (q) => q.eq('key', PUBLISH_KEY))
      .first()

    if (!existing) {
      throw new Error('No pending content changes to publish')
    }

    if (existing.publishStatus === 'queued' || existing.publishStatus === 'running') {
      throw new Error('A publish request is already in progress')
    }

    if (!existing.hasPendingChanges) {
      throw new Error('No pending content changes to publish')
    }

    await ctx.db.patch(existing._id, {
      publishStatus: 'queued',
      requestId: args.requestId,
      lastPublishRequestedAt: now,
      lastPublishRequestedBy: args.requestedBy,
      lastError: undefined,
    })
  },
})

export const markPublishRunningInternal = internalMutation({
  args: {
    requestId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('publishStates')
      .withIndex('by_key', (q) => q.eq('key', PUBLISH_KEY))
      .first()

    if (!existing) {
      throw new Error('Publish state not initialized')
    }

    if (existing.requestId !== args.requestId) {
      throw new Error('Stale publish request')
    }

    await ctx.db.patch(existing._id, {
      publishStatus: 'running',
      lastError: undefined,
    })
  },
})

export const setPublishFailedInternal = internalMutation({
  args: {
    requestId: v.string(),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('publishStates')
      .withIndex('by_key', (q) => q.eq('key', PUBLISH_KEY))
      .first()

    if (!existing || existing.requestId !== args.requestId) {
      throw new Error('Stale publish request')
    }

    await ctx.db.patch(existing._id, {
      publishStatus: 'failed',
      lastError: args.error.slice(0, 500),
    })
  },
})

export const finalizePublishInternal = internalMutation({
  args: {
    requestId: v.string(),
    requestedBy: v.optional(v.string()),
    status: v.union(v.literal('succeeded'), v.literal('failed')),
    runUrl: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('publishStates')
      .withIndex('by_key', (q) => q.eq('key', PUBLISH_KEY))
      .first()

    if (!existing || existing.requestId !== args.requestId) {
      throw new Error('Stale publish callback request')
    }

    const isSuccess = args.status === 'succeeded'
    const now = Date.now()

    await ctx.db.patch(existing._id, {
      publishStatus: args.status,
      hasPendingChanges: isSuccess ? false : existing.hasPendingChanges,
      lastPublishedAt: isSuccess ? now : existing.lastPublishedAt,
      lastRunUrl: args.runUrl,
      lastError: isSuccess ? undefined : args.error?.slice(0, 500),
      lastPublishRequestedBy: args.requestedBy ?? existing.lastPublishRequestedBy,
    })
  },
})

export const requestManualPublish = action({
  args: {},
  handler: async (ctx) => {
    const identity = await requireAdmin(ctx)

    const token = process.env.GITHUB_PUBLISH_TOKEN
    const repoOwner = process.env.GITHUB_REPO_OWNER
    const repoName = process.env.GITHUB_REPO_NAME
    const workflowFile = process.env.GITHUB_PUBLISH_WORKFLOW || 'publish-public.yml'

    if (!token || !repoOwner || !repoName) {
      throw new Error('Publish action is not configured on server')
    }

    const requestId = crypto.randomUUID()
    const requestedBy = identity.subject ?? identity.tokenIdentifier ?? 'unknown-admin'

    await ctx.runMutation(internal.publish.queuePublishInternal, {
      requestId,
      requestedBy,
    })

    try {
      const dispatchResponse = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/actions/workflows/${workflowFile}/dispatches`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ref: 'main',
            inputs: {
              request_id: requestId,
              requested_by: requestedBy,
            },
          }),
        },
      )

      if (!dispatchResponse.ok) {
        const errorBody = await dispatchResponse.text()
        throw new Error(`GitHub dispatch failed (${dispatchResponse.status}): ${errorBody}`)
      }

      await ctx.runMutation(internal.publish.markPublishRunningInternal, { requestId })

      return { requestId }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to request publish'
      await ctx.runMutation(internal.publish.setPublishFailedInternal, {
        requestId,
        error: message,
      })
      throw new Error(message)
    }
  },
})
