import { v } from 'convex/values'
import { internal } from './_generated/api'
import { internalAction, internalMutation, internalQuery } from './_generated/server'

const PUBLISH_KEY = 'public-site'
const DEBOUNCE_MS = 5 * 60 * 1000
const RETRY_MS = 5 * 60 * 1000

export const getStateInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('sitePublishStates')
      .withIndex('by_key', (q) => q.eq('key', PUBLISH_KEY))
      .first()
  },
})

export const markDirtyInternal = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now()
    const scheduledFor = now + DEBOUNCE_MS
    const existing = await ctx.db
      .query('sitePublishStates')
      .withIndex('by_key', (q) => q.eq('key', PUBLISH_KEY))
      .first()

    if (!existing) {
      await ctx.db.insert('sitePublishStates', {
        key: PUBLISH_KEY,
        dirty: true,
        lastContentChangeAt: now,
        nextDispatchAt: scheduledFor,
      })
    } else {
      await ctx.db.patch(existing._id, {
        dirty: true,
        lastContentChangeAt: now,
        nextDispatchAt: scheduledFor,
      })
    }

    await ctx.scheduler.runAfter(DEBOUNCE_MS, internal.publishAuto.flushInternal, { scheduledFor })
  },
})

export const markDispatchSucceededInternal = internalMutation({
  args: {
    scheduledFor: v.number(),
  },
  handler: async (ctx, args) => {
    const state = await ctx.db
      .query('sitePublishStates')
      .withIndex('by_key', (q) => q.eq('key', PUBLISH_KEY))
      .first()

    if (!state || state.nextDispatchAt !== args.scheduledFor) {
      return
    }

    await ctx.db.patch(state._id, {
      dirty: false,
      nextDispatchAt: undefined,
      lastDispatchedAt: Date.now(),
      lastError: undefined,
    })
  },
})

export const markDispatchFailedInternal = internalMutation({
  args: {
    scheduledFor: v.number(),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    const state = await ctx.db
      .query('sitePublishStates')
      .withIndex('by_key', (q) => q.eq('key', PUBLISH_KEY))
      .first()

    if (!state || state.nextDispatchAt !== args.scheduledFor) {
      return
    }

    const retryAt = Date.now() + RETRY_MS

    await ctx.db.patch(state._id, {
      dirty: true,
      nextDispatchAt: retryAt,
      lastError: args.error.slice(0, 500),
    })

    await ctx.scheduler.runAfter(RETRY_MS, internal.publishAuto.flushInternal, {
      scheduledFor: retryAt,
    })
  },
})

export const flushInternal = internalAction({
  args: {
    scheduledFor: v.number(),
  },
  handler: async (ctx, args) => {
    const state = await ctx.runQuery(internal.publishAuto.getStateInternal, {})

    if (!state || !state.dirty || state.nextDispatchAt !== args.scheduledFor) {
      return { skipped: true, reason: 'stale-or-clean' as const }
    }

    const token = process.env.GITHUB_PUBLISH_TOKEN
    const repoOwner = process.env.GITHUB_REPO_OWNER
    const repoName = process.env.GITHUB_REPO_NAME
    const workflowFile = process.env.GITHUB_PUBLISH_WORKFLOW || 'publish-public.yml'

    if (!token || !repoOwner || !repoName) {
      await ctx.runMutation(internal.publishAuto.markDispatchFailedInternal, {
        scheduledFor: args.scheduledFor,
        error: 'Missing GitHub publish environment configuration',
      })
      return { skipped: true, reason: 'missing-config' as const }
    }

    try {
      const response = await fetch(
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
              source: 'convex-auto',
              scheduled_for: String(args.scheduledFor),
            },
          }),
        },
      )

      if (!response.ok) {
        const body = await response.text()
        throw new Error(`GitHub dispatch failed (${response.status}): ${body}`)
      }

      await ctx.runMutation(internal.publishAuto.markDispatchSucceededInternal, {
        scheduledFor: args.scheduledFor,
      })

      return { dispatched: true as const }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to dispatch publish workflow'
      await ctx.runMutation(internal.publishAuto.markDispatchFailedInternal, {
        scheduledFor: args.scheduledFor,
        error: message,
      })
      return { dispatched: false as const, error: message }
    }
  },
})
