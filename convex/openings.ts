import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

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

// List all openings with spirit info (for admin and search)
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const openings = await ctx.db.query("openings").collect();

    // Enrich with spirit name
    const enriched = await Promise.all(
      openings.map(async (opening) => {
        const spirit = await ctx.db.get(opening.spiritId);
        return {
          ...opening,
          spiritName: spirit
            ? spirit.aspectName
              ? `${spirit.name} (${spirit.aspectName})`
              : spirit.name
            : "Unknown Spirit",
          spiritSlug: spirit?.slug,
        };
      }),
    );

    // Sort by spirit name, then opening name
    enriched.sort((a, b) => {
      const spiritCompare = a.spiritName.localeCompare(b.spiritName);
      if (spiritCompare !== 0) return spiritCompare;
      return a.name.localeCompare(b.name);
    });

    return enriched;
  },
});

// Turn object shape for validation
const turnValidator = v.object({
  turn: v.number(),
  title: v.optional(v.string()),
  instructions: v.string(),
  notes: v.optional(v.string()),
});

// Create a new opening (admin only)
export const create = mutation({
  args: {
    spiritId: v.id("spirits"),
    slug: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    difficulty: v.optional(
      v.union(
        v.literal("Beginner"),
        v.literal("Intermediate"),
        v.literal("Advanced"),
      ),
    ),
    turns: v.array(turnValidator),
    author: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    // Check slug uniqueness
    const existing = await ctx.db
      .query("openings")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) {
      throw new Error(`Opening with slug "${args.slug}" already exists`);
    }

    // Insert the opening
    const id = await ctx.db.insert("openings", {
      spiritId: args.spiritId,
      slug: args.slug,
      name: args.name,
      description: args.description,
      difficulty: args.difficulty,
      turns: args.turns,
      author: args.author,
      sourceUrl: args.sourceUrl,
    });

    return id;
  },
});

// Update an existing opening (admin only)
export const update = mutation({
  args: {
    id: v.id("openings"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    difficulty: v.optional(
      v.union(
        v.literal("Beginner"),
        v.literal("Intermediate"),
        v.literal("Advanced"),
      ),
    ),
    turns: v.optional(v.array(turnValidator)),
    author: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const { id, ...updates } = args;

    // If slug is being changed, check uniqueness
    if (updates.slug !== undefined) {
      const newSlug = updates.slug;
      const existing = await ctx.db
        .query("openings")
        .withIndex("by_slug", (q) => q.eq("slug", newSlug))
        .first();
      if (existing && existing._id !== id) {
        throw new Error(`Opening with slug "${newSlug}" already exists`);
      }
    }

    // Remove undefined values from updates
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined),
    );

    await ctx.db.patch(id, cleanUpdates);
  },
});

// Remove an opening (admin only)
export const remove = mutation({
  args: {
    id: v.id("openings"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
