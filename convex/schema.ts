import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Minimal table for health check / connectivity test
  healthCheck: defineTable({
    message: v.string(),
    timestamp: v.number(),
  }),

  // Expansions table - Spirit Island game expansions
  expansions: defineTable({
    name: v.string(), // "Base Game", "Branch & Claw", etc.
    slug: v.string(), // "base-game", "branch-and-claw"
    releaseYear: v.number(), // 2017, 2018, etc.
  }).index("by_slug", ["slug"]),

  // Spirits table - spirits and their aspects
  spirits: defineTable({
    name: v.string(), // "River Surges in Sunlight"
    slug: v.string(), // "river-surges-in-sunlight"
    complexity: v.union(
      v.literal("Low"),
      v.literal("Moderate"),
      v.literal("High"),
      v.literal("Very High"),
    ),
    summary: v.string(), // 1-line playstyle description
    imageUrl: v.string(), // Path to spirit panel art
    expansionId: v.id("expansions"),
    elements: v.array(v.string()), // ["Sun", "Water"] (primary elements)
    // For aspects: link to base spirit
    baseSpirit: v.optional(v.id("spirits")),
    aspectName: v.optional(v.string()), // "Sunshine", "Travel", etc.
  })
    .index("by_slug", ["slug"])
    .index("by_expansion", ["expansionId"])
    .index("by_base_spirit", ["baseSpirit"])
    .index("by_complexity", ["complexity"]),
});
