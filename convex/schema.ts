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
    imageUrl: v.optional(v.string()), // Path to spirit panel art (optional for aspects without unique art)
    expansionId: v.id("expansions"),
    elements: v.array(v.string()), // ["Sun", "Water"] (primary elements)
    // For aspects: link to base spirit
    baseSpirit: v.optional(v.id("spirits")),
    aspectName: v.optional(v.string()), // "Sunshine", "Travel", etc.
    // Aspect complexity modifier relative to base spirit (for display arrows)
    complexityModifier: v.optional(
      v.union(v.literal("easier"), v.literal("same"), v.literal("harder")),
    ),
    // Detailed playstyle description for detail page
    description: v.optional(v.string()),
    // Board data fields
    strengths: v.optional(v.array(v.string())),
    weaknesses: v.optional(v.array(v.string())),
    powerRatings: v.optional(
      v.object({
        offense: v.number(),
        defense: v.number(),
        control: v.number(),
        fear: v.number(),
        utility: v.number(),
      }),
    ),
    wikiUrl: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_expansion", ["expansionId"])
    .index("by_base_spirit", ["baseSpirit"])
    .index("by_complexity", ["complexity"]),

  // Openings table - text-based turn-by-turn opening guides
  openings: defineTable({
    spiritId: v.id("spirits"), // Link to spirit (base or aspect)
    slug: v.string(), // URL-friendly identifier: "standard-opening"
    name: v.string(), // Display name: "Standard Opening"
    description: v.optional(v.string()), // Brief summary of the strategy
    difficulty: v.optional(
      v.union(
        v.literal("Beginner"),
        v.literal("Intermediate"),
        v.literal("Advanced"),
      ),
    ), // Optional difficulty rating
    turns: v.array(
      // Turn-by-turn text instructions
      v.object({
        turn: v.number(), // Turn 1, 2, 3, etc.
        title: v.optional(v.string()), // "Setup" or "Turn 1: Establishing Presence"
        instructions: v.string(), // Main text content for this turn
        notes: v.optional(v.string()), // Additional context/tips
      }),
    ),
    author: v.optional(v.string()), // Attribution
    sourceUrl: v.optional(v.string()), // Link to original guide
  })
    .index("by_spirit", ["spiritId"])
    .index("by_slug", ["slug"]),
});
