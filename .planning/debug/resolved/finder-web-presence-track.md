---
status: resolved
trigger: "Finder's Web/Diamond Presence Track Structure"
created: 2026-01-27T00:00:00Z
updated: 2026-01-27T00:35:00Z
---

## Current Focus

hypothesis: Current seed.ts 2-row structure is INCOMPLETE - missing +Energy/+CardPlays modifier slots mentioned in Wiki FAQ
test: Verify if Finder's energy calculation rule requires separate modifier nodes
expecting: If Wiki says "highest base + modifiers", there must be +N modifier slots not represented in current 2-row seed data
next_action: Determine minimum required structure to support Finder's special mechanics

## Symptoms

expected: Node-Edge Graph DSL should represent any presence track structure
actual: Current DSL assumes CSS Grid with two parallel rows (row: 0 or 1)
errors: None yet - preventive investigation before implementation
reproduction: Review Finder of Paths Unseen presence track requirements
started: Discovered during phase 03.4-06 planning

## Eliminated

- hypothesis: Finder has a complex web/diamond-shaped presence track
  evidence: Seed data shows 2 parallel linear tracks with ONE cross-connection edge (e3→c3). Plan 03.4-06 Task 2 explicitly models this as "rows: 2, cols: 6" with single cross-track edge. Wiki confirms bidirectional traversal but not complex branching.
  timestamp: 2026-01-27T00:15:00Z

## Evidence

- timestamp: 2026-01-27T00:05:00Z
  checked: Spirit Island Wiki search results
  found: Finder has "unusually-shaped Presence Track" with special Energy/Plays calculation rule (highest base + all modifiers). Can move presence "any paths from starting spaces, including backwards". No mention of web/diamond shape.
  implication: "Unusual" refers to traversal rules (bidirectional), not visual structure

- timestamp: 2026-01-27T00:10:00Z
  checked: convex/seed.ts lines 1052-1081 (Finder presenceTracks)
  found: Already uses Node-Edge Graph format with rows:2, cols:6, bidirectional:true, and edges:[{from:"e3",to:"c3"}]
  implication: Current data model represents 2 parallel tracks with 1 cross-connection

- timestamp: 2026-01-27T00:12:00Z
  checked: 03.4-06-PLAN.md Task 2 requirements
  found: Plan explicitly models Finder as "Grid layout: 2 rows x 6 cols, with cross-row edges". Only ONE cross-track edge specified (e4→c4, but seed has e3→c3).
  implication: Plan author understood Finder as two-linear-tracks, not web/diamond

- timestamp: 2026-01-27T00:14:00Z
  checked: convex/schema.ts presenceTracks definition
  found: Node-Edge Graph format supports arbitrary row/col coordinates, bidirectional edges, and any edge connectivity. No constraints on structure.
  implication: Schema is already flexible enough for complex layouts

- timestamp: 2026-01-27T00:20:00Z
  checked: .planning/phases/03.4-presence-track-graph-dsl/03.4-RESEARCH.md lines 203-270
  found: Research document shows Finder with 3 ROWS forming web structure: Row 0 (energy path with start1, range1, e1-e6), Row 1 (middle modifier path with m1-m4), Row 2 (card plays path with start2, c1-c6). Multiple cross-path connections creating web topology.
  implication: Research describes complex web structure with 3 interconnected paths

- timestamp: 2026-01-27T00:22:00Z
  checked: Comparison of RESEARCH vs SEED data
  found: CONFLICT - Research shows 3 rows with modifier path and multiple cross-connections. Seed.ts shows 2 rows with single cross-connection at col 3. Plan 03.4-06 Task 2 follows seed.ts structure (2 rows).
  implication: Data inconsistency - need to determine which represents actual game card

- timestamp: 2026-01-27T00:25:00Z
  checked: 03.4-RESEARCH.md line 460 "Open Questions"
  found: "**Exact Finder layout**: The research found general principles but not the precise slot-by-slot layout. Need to verify against actual game board image."
  implication: Research author explicitly acknowledged uncertainty about Finder's exact layout. The 3-row web structure in RESEARCH was speculative/illustrative, not verified.

- timestamp: 2026-01-27T00:28:00Z
  checked: convex/seed.ts lines 1014-1019 (Finder specialRules)
  found: Rule "Paths From Here to There" says: "You may move Presence along your presence tracks in either direction during Growth. Moving presence backward is how you 'regain' track bonuses." Also: Starts with "2 starting spaces" (start1, start2 in research; e0, c0 in seed).
  implication: Special rule confirms bidirectional traversal and multiple starting points. Does NOT specify web/diamond structure.

- timestamp: 2026-01-27T00:30:00Z
  checked: Spirit Island Wiki search result description
  found: "You may move Presence along your presence tracks...from the starting 2 spaces, including traveling backwards." Wiki FAQ confirms energy calculation: "use highest single base number, then ADD any + bonuses."
  implication: Track structure allows starting from 2 positions, bidirectional travel. Energy calculation rule suggests +Energy modifiers exist separate from base Energy values.

- timestamp: 2026-01-27T00:32:00Z
  checked: Wiki FAQ example calculation
  found: "5 Energy/turn (2 + 2 + 1, ignoring the Moon space because the Water space grants a higher base amount)"
  implication: Example shows THREE energy nodes revealed (2, 2, 1) but uses highest base (2) + other revealed bonuses. This arithmetic doesn't match current seed.ts energy track (0,1,1,2,2,3).

- timestamp: 2026-01-27T00:35:00Z
  checked: Analyzed Wiki example: "2 + 2 + 1 = 5"
  found: If calculation is "highest base + modifiers", then example must be: base 2, +2 modifier, +1 modifier = 5 total. Or it could be base 1 + base 2 + modifier +2. The phrasing is ambiguous.
  implication: Cannot definitively determine track structure from Wiki FAQ alone. Need actual card image or more explicit source.

## Resolution

root_cause: INSUFFICIENT CANONICAL DATA - Cannot determine Finder's exact presence track structure from available sources. Three data sources conflict:

1. **RESEARCH (03.4-RESEARCH.md)**: Shows 3-row web with modifier path - BUT research author explicitly flagged this as unverified (line 460: "Need to verify against actual game board image")

2. **SEED DATA (convex/seed.ts)**: Shows 2 parallel linear tracks (energy + card plays) with single cross-connection at col 3 - BUT energy values (0,1,1,2,2,3) don't align with Wiki FAQ calculation example

3. **WIKI FAQ**: Describes energy calculation rule ("highest base + modifiers") and gives example "2+2+1=5" - BUT doesn't provide visual layout

**What we know for certain:**
- Finder has bidirectional traversal (confirmed by special rules)
- Finder has 2 starting spaces (confirmed by special rules and Wiki)
- Finder has cross-track connection(s) allowing paths to merge/branch
- Energy calculation uses "highest base + modifiers" logic
- Current Node-Edge Graph DSL schema supports any structure (no schema changes needed)

**What we DON'T know:**
- Exact number of rows (2 vs 3)
- Whether there's a separate modifier path or if modifiers are inline
- Exact slot values and positioning
- Number and location of cross-track connections

fix: NO FIX APPLIED - This is a data verification issue, not a technical bug. The Node-Edge Graph DSL schema is already flexible enough to represent any structure once the canonical layout is determined.

verification: N/A - Investigation complete, root cause identified as data uncertainty

files_changed: []

**Recommended next steps:**
1. Obtain physical Finder of Paths Unseen spirit panel card or high-quality photo
2. Transcribe exact slot layout (row/col positions, values, track types)
3. Update seed.ts with verified data
4. If 3-row web structure is correct, update Plan 03.4-06 Task 2 accordingly
5. If 2-row structure is correct, verify energy values match game card
