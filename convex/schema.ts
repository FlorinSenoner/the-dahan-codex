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
    specialRules: v.optional(
      v.array(
        v.object({
          name: v.string(),
          description: v.string(),
        }),
      ),
    ),
    // Growth options - flat array with G1, G2, G3 ids and typed actions
    growth: v.optional(
      v.object({
        type: v.optional(v.union(v.literal("pick-one"), v.literal("pick-two"))),
        options: v.array(
          v.object({
            id: v.string(), // "G1", "G2", "G3", etc.
            cost: v.optional(v.number()), // Energy cost for "Or" options
            actions: v.array(
              v.object({
                type: v.string(), // "reclaim", "gainEnergy", "gainPowerCard", "addPresence", "push", "damage", "gainElement"
                // Type-specific fields (all optional, used based on type):
                variant: v.optional(v.string()), // reclaim: "all" | "one"
                amount: v.optional(v.number()), // gainEnergy, damage
                cardType: v.optional(v.string()), // gainPowerCard: "minor" | "major"
                range: v.optional(v.number()), // addPresence
                terrain: v.optional(v.string()), // addPresence restriction
                count: v.optional(v.number()), // push count
                pieceType: v.optional(v.string()), // push piece type
                target: v.optional(v.string()), // damage/push target description
                element: v.optional(v.string()), // gainElement
              }),
            ),
          }),
        ),
      }),
    ),
    // Presence tracks - flexible array supporting multiple track types
    presenceTracks: v.optional(
      v.object({
        tracks: v.array(
          v.object({
            type: v.string(), // "energy", "cardPlays", "absorbed", "custom"
            label: v.string(),
            color: v.optional(v.string()), // "amber", "blue", "purple"
            slots: v.array(
              v.object({
                value: v.union(v.number(), v.string()),
                elements: v.optional(v.array(v.string())),
                reclaim: v.optional(v.boolean()),
                innateUnlock: v.optional(v.string()),
                specialAbility: v.optional(v.string()),
              }),
            ),
          }),
        ),
      }),
    ),
    innates: v.optional(
      v.array(
        v.object({
          name: v.string(),
          speed: v.union(v.literal("Fast"), v.literal("Slow")),
          range: v.optional(v.string()),
          target: v.optional(v.string()),
          thresholds: v.array(
            v.object({
              elements: v.object({
                Sun: v.optional(v.number()),
                Moon: v.optional(v.number()),
                Fire: v.optional(v.number()),
                Air: v.optional(v.number()),
                Water: v.optional(v.number()),
                Earth: v.optional(v.number()),
                Plant: v.optional(v.number()),
                Animal: v.optional(v.number()),
              }),
              effect: v.string(),
            }),
          ),
        }),
      ),
    ),
    uniquePowers: v.optional(
      v.array(
        v.object({
          name: v.string(),
          cost: v.number(),
          speed: v.union(v.literal("Fast"), v.literal("Slow")),
          elements: v.array(v.string()),
          range: v.optional(v.string()), // "0", "1", "Sacred Site", etc.
          target: v.optional(v.string()), // "Any Land", "Land with Invaders", etc.
          description: v.optional(v.string()),
        }),
      ),
    ),
    wikiUrl: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_expansion", ["expansionId"])
    .index("by_base_spirit", ["baseSpirit"])
    .index("by_complexity", ["complexity"]),
});
