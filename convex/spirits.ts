import { v } from "convex/values";
import { query } from "./_generated/server";

// List all spirits with optional filtering
export const listSpirits = query({
  args: {
    complexity: v.optional(v.array(v.string())),
    expansionSlug: v.optional(v.array(v.string())),
    elements: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    let spirits = await ctx.db.query("spirits").collect();

    // Filter by complexity if specified
    const complexityFilter = args.complexity;
    if (complexityFilter && complexityFilter.length > 0) {
      spirits = spirits.filter((s) => complexityFilter.includes(s.complexity));
    }

    // Filter by elements (AND logic - spirit must have ALL specified elements)
    const elementsFilter = args.elements;
    if (elementsFilter && elementsFilter.length > 0) {
      spirits = spirits.filter((s) =>
        elementsFilter.every((el) => s.elements.includes(el)),
      );
    }

    // Sort alphabetically
    spirits.sort((a, b) => a.name.localeCompare(b.name));

    // Group: base spirits first, then aspects indented under them
    const baseSpirits = spirits.filter((s) => !s.baseSpirit);
    const aspectMap = new Map<string, typeof spirits>();

    for (const spirit of spirits.filter((s) => s.baseSpirit)) {
      const baseId = spirit.baseSpirit;
      if (baseId) {
        const existing = aspectMap.get(baseId.toString());
        if (existing) {
          existing.push(spirit);
        } else {
          aspectMap.set(baseId.toString(), [spirit]);
        }
      }
    }

    // Build result with aspects after their base
    const result: Array<(typeof spirits)[0] & { isAspect: boolean }> = [];
    for (const base of baseSpirits) {
      result.push({ ...base, isAspect: false });
      const aspects = aspectMap.get(base._id.toString()) || [];
      // Sort aspects alphabetically within base
      aspects.sort((a, b) =>
        (a.aspectName || "").localeCompare(b.aspectName || ""),
      );
      for (const aspect of aspects) {
        result.push({ ...aspect, isAspect: true });
      }
    }

    return result;
  },
});

// Get a single spirit by slug
export const getSpiritBySlug = query({
  args: {
    slug: v.string(),
    aspect: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // First find the base spirit
    const baseSpirit = await ctx.db
      .query("spirits")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .filter((q) => q.eq(q.field("baseSpirit"), undefined))
      .first();

    if (!baseSpirit) return null;

    // If aspect requested, find it
    const aspectArg = args.aspect;
    if (aspectArg) {
      const aspects = await ctx.db
        .query("spirits")
        .withIndex("by_base_spirit", (q) => q.eq("baseSpirit", baseSpirit._id))
        .collect();

      const aspect = aspects.find(
        (a) => a.aspectName?.toLowerCase() === aspectArg.toLowerCase(),
      );
      return aspect || baseSpirit;
    }

    return baseSpirit;
  },
});
