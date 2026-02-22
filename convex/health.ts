import { v } from 'convex/values'
import { query } from './_generated/server'

export const ping = query({
  args: {},
  returns: v.object({
    status: v.string(),
    timestamp: v.number(),
  }),
  handler: async () => {
    return {
      status: 'connected',
      timestamp: Date.now(),
    }
  },
})
