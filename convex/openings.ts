import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

/**
 * Generate a URL-friendly slug from a name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

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

// Create a new opening (admin only)
export const createOpening = mutation({
  args: {
    spiritId: v.id("spirits"),
    name: v.string(),
    description: v.optional(v.string()),
    turns: v.array(
      v.object({
        turn: v.number(),
        title: v.optional(v.string()),
        instructions: v.string(),
      }),
    ),
    author: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const now = Date.now();
    const slug = generateSlug(args.name);

    const id = await ctx.db.insert("openings", {
      spiritId: args.spiritId,
      slug,
      name: args.name,
      description: args.description,
      turns: args.turns,
      author: args.author,
      sourceUrl: args.sourceUrl,
      createdAt: now,
      updatedAt: now,
    });

    return id;
  },
});

// Update an existing opening (admin only)
export const updateOpening = mutation({
  args: {
    id: v.id("openings"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    turns: v.optional(
      v.array(
        v.object({
          turn: v.number(),
          title: v.optional(v.string()),
          instructions: v.string(),
        }),
      ),
    ),
    author: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const { id, ...updates } = args;

    // Build patch object with only provided fields
    const patch: Record<string, unknown> = {
      updatedAt: Date.now(),
    };

    if (updates.name !== undefined) {
      patch.name = updates.name;
      patch.slug = generateSlug(updates.name);
    }
    if (updates.description !== undefined) {
      patch.description = updates.description;
    }
    if (updates.turns !== undefined) {
      patch.turns = updates.turns;
    }
    if (updates.author !== undefined) {
      patch.author = updates.author;
    }
    if (updates.sourceUrl !== undefined) {
      patch.sourceUrl = updates.sourceUrl;
    }

    await ctx.db.patch(id, patch);
  },
});

// Delete an opening (admin only)
export const deleteOpening = mutation({
  args: {
    id: v.id("openings"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
