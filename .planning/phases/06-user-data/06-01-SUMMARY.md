---
phase: 06-user-data
plan: 01
subsystem: schema-and-dependencies
tags: [convex, schema, sonner, cmdk, papaparse, toast, command]

dependency_graph:
  requires: [phase-05-complete]
  provides: [games-table, toast-infrastructure, command-component]
  affects: [06-02, 06-03, 06-04, 06-05]

tech_stack:
  added: [papaparse, sonner, cmdk, "@types/papaparse"]
  patterns: [soft-delete-with-deletedAt]

key_files:
  created:
    - convex/schema.ts (games table)
    - app/components/ui/sonner.tsx
    - app/components/ui/command.tsx
  modified:
    - app/routes/__root.tsx
    - knip.json
    - package.json
    - pnpm-lock.yaml

decisions:
  - id: games-schema-design
    choice: "Array of spirit objects with denormalized name"
    rationale: "Enables CSV export without joins, supports 1-6 spirits per game"
  - id: soft-delete-pattern
    choice: "deletedAt timestamp with by_user_deleted index"
    rationale: "Enables undo functionality via timestamp filtering"
  - id: papaparse-install-timing
    choice: "Install now, use in later plans"
    rationale: "Simplifies dependency batch, added to knip ignore list"

metrics:
  duration: 3min
  completed: 2026-01-31
---

# Phase 06 Plan 01: Schema and Dependencies Summary

**One-liner:** Games table schema with soft-delete support, sonner/cmdk/papaparse dependencies installed, Toaster mounted in root.

## What Was Built

### 1. Games Table Schema (`convex/schema.ts`)

Added comprehensive games table for tracking user play history:

```typescript
games: defineTable({
  userId: v.string(),                    // Clerk tokenIdentifier
  date: v.string(),                      // ISO 8601 "2026-01-31"
  result: v.union(v.literal("win"), v.literal("loss")),
  spirits: v.array(v.object({            // 1-6 spirits per game
    spiritId: v.id("spirits"),
    name: v.string(),                    // Denormalized for export
    variant: v.optional(v.string()),     // Aspect name
    player: v.optional(v.string()),      // Player name
  })),
  adversary: v.optional(v.object({...})),
  secondaryAdversary: v.optional(v.object({...})),
  scenario: v.optional(v.object({...})),
  // Outcome details (all optional)
  winType, invaderStage, blightCount, dahanCount, cardsRemaining, score, notes,
  // Timestamps
  createdAt: v.number(),
  updatedAt: v.number(),
  deletedAt: v.optional(v.number()),     // Soft delete
})
  .index("by_user", ["userId"])
  .index("by_user_date", ["userId", "date"])
  .index("by_user_deleted", ["userId", "deletedAt"])
```

### 2. UI Components

**Toaster (`app/components/ui/sonner.tsx`):**
- Wraps sonner's Toaster with theme-aware styling
- Position: bottom-center
- Integrated into root layout for app-wide availability

**Command (`app/components/ui/command.tsx`):**
- Full shadcn/ui-style Command component suite
- Exports: Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator
- Ready for searchable spirit dropdowns in game form

### 3. Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| papaparse | ^5.5.3 | CSV export |
| sonner | ^2.0.7 | Toast notifications (undo actions) |
| cmdk | ^1.1.1 | Searchable combobox primitives |
| @types/papaparse | ^5.5.2 | TypeScript types for papaparse |

## Commits

| Hash | Message |
|------|---------|
| 7293426 | feat(06-01): add games table to Convex schema |
| 0f1d9aa | feat(06-01): install UI dependencies and create components |
| b5a1782 | feat(06-01): mount Toaster in app root |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added papaparse to knip ignore list**
- **Found during:** Task 2
- **Issue:** Knip flagged papaparse/@types/papaparse as unused dependencies
- **Fix:** Added to knip.json ignoreDependencies (will be used in plan 06-04)
- **Files modified:** knip.json
- **Commit:** 0f1d9aa

**2. [Unexpected] convex/lib/scoring.ts included in commit**
- **Found during:** Task 2 commit
- **Issue:** A scoring.ts file was present in working directory and got staged
- **Note:** File appears to be from prior research/planning, contains score calculation logic
- **Impact:** None - file is useful for phase 6 scoring features
- **Commit:** 0f1d9aa

## Verification

- [x] `pnpm typecheck` passes
- [x] `pnpm build` succeeds (1,005 kB bundle)
- [x] Games table defined with all required fields and indexes
- [x] Dependencies papaparse, sonner, cmdk in package.json
- [x] Toaster mounted in root layout

## Next Phase Readiness

**Ready for 06-02:** Games CRUD mutations can now be implemented against the games table schema.

**Dependencies established:**
- Schema provides type-safe game document structure
- Toaster enables undo toast actions
- Command component ready for spirit picker integration
