import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

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
  }).index('by_slug', ['slug']),

  // Spirits table - spirits and their aspects
  spirits: defineTable({
    name: v.string(), // "River Surges in Sunlight"
    slug: v.string(), // "river-surges-in-sunlight"
    complexity: v.union(
      v.literal('Low'),
      v.literal('Moderate'),
      v.literal('High'),
      v.literal('Very High'),
    ),
    summary: v.string(), // 1-line playstyle description
    imageUrl: v.optional(v.string()), // Path to spirit panel art (optional for aspects without unique art)
    expansionId: v.id('expansions'),
    elements: v.array(v.string()), // ["Sun", "Water"] (primary elements)
    // For aspects: link to base spirit
    baseSpirit: v.optional(v.id('spirits')),
    aspectName: v.optional(v.string()), // "Sunshine", "Travel", etc.
    // Aspect complexity modifier relative to base spirit (for display arrows)
    complexityModifier: v.optional(
      v.union(v.literal('easier'), v.literal('same'), v.literal('harder')),
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
    // DEPRECATED: specialRules field exists in production data but is no longer used.
    // Keep optional for backward compatibility until all documents are migrated.
    // Run `npx convex run seed:reseedSpirits` on production to remove this field from data.
    specialRules: v.optional(
      v.array(
        v.object({
          name: v.string(),
          description: v.string(),
        }),
      ),
    ),
  })
    .index('by_slug', ['slug'])
    .index('by_expansion', ['expansionId'])
    .index('by_base_spirit', ['baseSpirit'])
    .index('by_complexity', ['complexity']),

  // Openings table - text-based turn-by-turn opening guides
  openings: defineTable({
    spiritId: v.id('spirits'), // Link to spirit (base or aspect)
    slug: v.string(), // URL-friendly identifier: "standard-opening"
    name: v.string(), // Display name: "Standard Opening"
    description: v.optional(v.string()), // Brief summary of the strategy
    turns: v.array(
      // Turn-by-turn text instructions
      v.object({
        turn: v.number(), // Turn 1, 2, 3, etc.
        title: v.optional(v.string()), // "Setup" or "Turn 1: Establishing Presence"
        instructions: v.string(), // Main text content for this turn
      }),
    ),
    author: v.optional(v.string()), // Attribution
    sourceUrl: v.optional(v.string()), // Link to original guide
    // Timestamps - optional for backward compatibility with existing data
    // New openings should always include these via mutations
    createdAt: v.optional(v.number()), // Unix timestamp in milliseconds
    updatedAt: v.optional(v.number()), // Unix timestamp in milliseconds
    // DEPRECATED: difficulty field exists in production data but is no longer used.
    // Keep optional for backward compatibility until all documents are migrated.
    // Run `npx convex run seed:reseedSpirits` on production to remove this field from data.
    difficulty: v.optional(
      v.union(v.literal('Beginner'), v.literal('Intermediate'), v.literal('Advanced')),
    ),
  })
    .index('by_spirit', ['spiritId'])
    .index('by_slug', ['slug']),

  // Games table - user game history for tracking plays
  games: defineTable({
    // User ownership
    userId: v.string(), // Clerk tokenIdentifier

    // Core game info
    date: v.string(), // ISO 8601 date string "2026-01-31"
    result: v.union(v.literal('win'), v.literal('loss')),

    // Spirits (1-6, stored as array)
    spirits: v.array(
      v.object({
        spiritId: v.optional(v.id('spirits')), // Optional for CSV imports
        name: v.string(), // Denormalized for CSV export
        variant: v.optional(v.string()), // Aspect name if applicable
        player: v.optional(v.string()), // Player name
      }),
    ),

    // Optional adversary
    adversary: v.optional(
      v.object({
        name: v.string(),
        level: v.number(), // 0-6
      }),
    ),

    // Optional secondary adversary
    secondaryAdversary: v.optional(
      v.object({
        name: v.string(),
        level: v.number(),
      }),
    ),

    // Optional scenario
    scenario: v.optional(
      v.object({
        name: v.string(),
        difficulty: v.optional(v.number()),
      }),
    ),

    // Detailed outcome (all optional per CONTEXT.md)
    winType: v.optional(v.string()), // "fear", "blighted", etc.
    invaderStage: v.optional(v.number()),
    blightCount: v.optional(v.number()),
    dahanCount: v.optional(v.number()),
    cardsRemaining: v.optional(v.number()),

    // Calculated score (optional, can be recalculated)
    score: v.optional(v.number()),

    // Notes
    notes: v.optional(v.string()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()), // For soft delete
  })
    .index('by_user', ['userId'])
    .index('by_user_date', ['userId', 'date'])
    .index('by_user_deleted', ['userId', 'deletedAt']),
})
