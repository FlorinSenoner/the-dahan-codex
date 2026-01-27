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
        type: v.optional(
          v.union(
            v.literal("pick-one"),
            v.literal("pick-two"),
            v.literal("pick-any"),
          ),
        ), // pick-any for Fractured Days choose-from-4
        options: v.array(
          v.object({
            id: v.string(), // "G1", "G2", "G3", etc.
            cost: v.optional(v.number()), // Energy cost for "Or" options
            repeat: v.optional(v.number()), // "do this N times" options
            actions: v.array(
              v.object({
                type: v.string(), // "reclaim", "gainEnergy", "gainPowerCard", "addPresence", "push", "damage", "gainElement", "gainTime"
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
            // For Fractured Days' "gain 1 Time OR 2 Card Plays" style choices
            orActions: v.optional(
              v.array(
                v.object({
                  label: v.string(),
                  actions: v.array(
                    v.object({
                      type: v.string(),
                      variant: v.optional(v.string()),
                      amount: v.optional(v.number()),
                      cardType: v.optional(v.string()),
                      range: v.optional(v.number()),
                      terrain: v.optional(v.string()),
                      count: v.optional(v.number()),
                      pieceType: v.optional(v.string()),
                      target: v.optional(v.string()),
                      element: v.optional(v.string()),
                    }),
                  ),
                }),
              ),
            ),
          }),
        ),
      }),
    ),
    // Presence tracks - unified Node-Edge Graph model
    presenceTracks: v.optional(
      v.object({
        // Grid dimensions for CSS Grid layout
        rows: v.number(),
        cols: v.number(),

        // Whether all edges are bidirectional by default (default: true)
        bidirectional: v.optional(v.boolean()),

        // Nodes represent presence slots with explicit positioning
        nodes: v.array(
          v.object({
            // Unique node identifier (required)
            id: v.string(),

            // Grid position for rendering (0-indexed)
            row: v.number(),
            col: v.number(),

            // Node content
            value: v.optional(v.union(v.number(), v.string())), // 1, 2, "+1", "+2", etc.

            // What type of bonus this provides
            trackType: v.optional(
              v.union(
                v.literal("energy"), // Base energy value
                v.literal("cardPlays"), // Base card plays value
                v.literal("energyMod"), // +N Energy modifier
                v.literal("cardPlaysMod"), // +N Card Plays modifier
                v.literal("elements"), // Element only (value 0)
                v.literal("special"), // Special ability text
                v.literal("start"), // Starting position marker
              ),
            ),

            // Optional metadata
            elements: v.optional(v.array(v.string())), // ["Moon", "Air"]
            reclaim: v.optional(v.boolean()), // Reclaim One icon
            specialAbility: v.optional(v.string()), // Custom text
            presenceCap: v.optional(v.number()), // Serpent's limit track
            unlocksGrowth: v.optional(v.boolean()), // Starlight's growth unlock
          }),
        ),

        // Edges connect nodes (explicit graph structure)
        edges: v.array(
          v.object({
            from: v.string(), // Source node ID
            to: v.string(), // Target node ID
            // Override global bidirectional setting for this edge
            bidirectional: v.optional(v.boolean()),
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
