import { v } from "convex/values";
import { query } from "./_generated/server";

// List all openings for a specific spirit
export const listBySpirit = query({
  args: { spiritId: v.id("spirits") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("openings")
      .withIndex("by_spirit", (q) => q.eq("spiritId", args.spiritId))
      .collect();
  },
});

// Get a single opening by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("openings")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});
