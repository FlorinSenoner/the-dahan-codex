# Research: Graph-Based Presence Track DSL

## Problem Statement

The current presence track implementation uses separate linear tracks with a simple `connectsTo` property. This fundamentally misrepresents spirits like **Finder of Paths Unseen** whose presence track is actually a **web/graph structure** where:

1. Players can traverse in **either direction** (backwards to regain bonuses)
2. The track has **three interconnected paths** (top, middle, bottom)
3. Multiple paths can converge at shared nodes
4. Energy/plays calculation uses: **highest single base value + all modifiers**

## Research Findings

### Source Analysis

Based on research from:
- [Spirit Island FAQ - Presence Track](https://querki.net/raw/darker/spirit-island-faq/Presence+track)
- [Spirit Island FAQ - Finder of Paths Unseen](https://querki.net/raw/darker/spirit-island-faq/Finder+of+Paths+Unseen)
- [spirit-island-template](https://github.com/Gudradain/spirit-island-template/blob/master/_docs/board_front.md)
- [spirit-island-renderer](https://github.com/LokiMidgard/spirit-island-renderer)
- [Red Blob Games - Grids and Graphs](https://www.redblobgames.com/pathfinding/grids/graphs.html)

### Key Insights

1. **Finder's Track Structure**: "Finder basically has a top path, a bottom path, and a middle path" with bidirectional traversal
2. **Energy Calculation**: "Use the highest single Energy number and Plays number, then add any +Energy and +Plays from other spaces"
3. **spirit-island-template Solution**: Uses `<presence-table>` HTML structure for complex layouts - essentially a 2D grid with arbitrary cell positioning
4. **Graph Theory**: Game boards with branching paths are best represented as graphs with nodes (slots) and edges (connections)

### Current DSL (Broken)

```typescript
presenceTracks: {
  layout: "branching",
  tracks: [
    {
      type: "energy",
      label: "Energy Track",
      connectsTo: "cardPlays",  // Too simplistic!
      connectionPoint: 3,
      slots: [...linear array...]
    },
    {
      type: "cardPlays",
      slots: [...linear array...]
    }
  ]
}
```

**Problems**:
- Treats tracks as separate linear structures
- `connectsTo` only captures one connection point
- Cannot represent bidirectional traversal
- Cannot represent convergent/divergent paths
- Cannot represent the true topology

## Proposed Solution: Graph-Based DSL

### Option A: Node-Edge Graph Model

Model presence tracks as a directed graph where:
- **Nodes** have unique IDs, values, and metadata
- **Edges** define connections between nodes
- **Starting positions** mark where presence begins

```typescript
presenceTracks: {
  type: "graph",
  nodes: {
    "start1": { value: null, isStart: true, position: { row: 0, col: 0 } },
    "start2": { value: null, isStart: true, position: { row: 2, col: 0 } },
    "e1": { value: 1, trackType: "energy", position: { row: 0, col: 1 } },
    "e2": { value: 2, trackType: "energy", elements: ["Moon"], position: { row: 0, col: 2 } },
    "mid1": { value: "+1", modifier: "energy", elements: ["Water"], position: { row: 1, col: 2 } },
    "c1": { value: 1, trackType: "cardPlays", position: { row: 2, col: 1 } },
    "c2": { value: 2, trackType: "cardPlays", position: { row: 2, col: 2 } },
    // ... more nodes
  },
  edges: [
    { from: "start1", to: "e1", bidirectional: true },
    { from: "e1", to: "e2", bidirectional: true },
    { from: "e2", to: "mid1", bidirectional: true },
    { from: "start2", to: "c1", bidirectional: true },
    { from: "c1", to: "c2", bidirectional: true },
    { from: "c2", to: "mid1", bidirectional: true },  // Convergent point!
    // ... more edges
  ],
  layout: {
    rows: 3,
    cols: 8
  }
}
```

**Pros**:
- Accurately represents any topology
- Supports bidirectional traversal
- Supports convergent/divergent paths
- Explicit positioning for rendering

**Cons**:
- More verbose for simple linear tracks
- Requires graph traversal logic in UI
- More complex to seed data

### Option B: Adjacency List Model

Similar to A but uses adjacency lists instead of explicit edges:

```typescript
presenceTracks: {
  type: "graph",
  nodes: [
    { id: "start1", value: null, isStart: true, adjacent: ["e1"], position: [0, 0] },
    { id: "e1", value: 1, trackType: "energy", adjacent: ["start1", "e2"], position: [0, 1] },
    { id: "e2", value: 2, trackType: "energy", elements: ["Moon"], adjacent: ["e1", "mid1"], position: [0, 2] },
    // ...
  ]
}
```

**Pros**:
- More compact than explicit edges
- Still fully represents topology
- Adjacency is implicit in node definition

**Cons**:
- Duplication (each edge appears twice)
- Harder to validate consistency

### Option C: Grid + Connections Hybrid

Use a 2D grid with explicit connections for non-adjacent cells:

```typescript
presenceTracks: {
  type: "grid",
  rows: [
    // Row 0 (top path)
    [
      { id: "S1", isStart: true },
      { value: 1, trackType: "energy" },
      { value: 2, trackType: "energy", elements: ["Moon"] },
      { value: 3, trackType: "energy", elements: ["Air"] },
      // ...
    ],
    // Row 1 (middle path)
    [
      null,  // empty cell
      null,
      { value: "+2", modifier: "energy", elements: ["Water"] },
      // ...
    ],
    // Row 2 (bottom path)
    [
      { id: "S2", isStart: true },
      { value: 1, trackType: "cardPlays" },
      { value: 2, trackType: "cardPlays" },
      // ...
    ]
  ],
  connections: [
    // Non-adjacent connections only
    { from: [0, 3], to: [1, 2] },  // Top path connects to middle
    { from: [2, 3], to: [1, 2] },  // Bottom path connects to middle
  ],
  bidirectional: true  // All connections are bidirectional for Finder
}
```

**Pros**:
- Intuitive 2D grid matches visual appearance
- Only need to specify non-adjacent connections
- Simpler for spirits that ARE mostly linear
- Position is implicit from grid location

**Cons**:
- `null` cells for empty spaces
- Connection syntax is positional (fragile)

## Recommendation

**Option C (Grid + Connections Hybrid)** is recommended because:

1. **Matches Visual Layout**: Spirit boards are inherently 2D grids with rows
2. **Simpler for Common Case**: Most spirits have linear tracks (just rows with no special connections)
3. **Explicit for Complex Case**: Non-adjacent connections only when needed
4. **Easier to Seed**: Grid format is more intuitive to enter from looking at physical board
5. **Backward Compatible**: Current linear tracks can be represented as single-row grids

### Schema Changes Required

```typescript
// Add to schema.ts
presenceTracks: v.optional(
  v.union(
    // Legacy linear format (keep for backward compatibility)
    v.object({
      layout: v.optional(v.literal("linear")),
      tracks: v.array(v.object({ /* existing structure */ }))
    }),
    // New graph format for complex spirits
    v.object({
      layout: v.literal("grid"),
      bidirectional: v.optional(v.boolean()),  // default false
      rows: v.array(
        v.array(
          v.union(
            v.null(),  // empty cell
            v.object({
              id: v.optional(v.string()),  // for connections reference
              isStart: v.optional(v.boolean()),
              value: v.optional(v.union(v.number(), v.string())),  // 1, 2, "+1", etc.
              trackType: v.optional(v.string()),  // "energy", "cardPlays"
              modifier: v.optional(v.string()),  // "energy" for +Energy modifiers
              elements: v.optional(v.array(v.string())),
              reclaim: v.optional(v.boolean()),
              specialAbility: v.optional(v.string()),
              presenceCap: v.optional(v.number()),
            })
          )
        )
      ),
      connections: v.optional(
        v.array(
          v.object({
            from: v.union(
              v.array(v.number()),  // [row, col] position
              v.string()  // node ID
            ),
            to: v.union(
              v.array(v.number()),
              v.string()
            ),
            bidirectional: v.optional(v.boolean()),  // override default
          })
        )
      ),
      startPositions: v.optional(v.array(v.array(v.number()))),  // [[row, col], ...]
    })
  )
)
```

### Finder of Paths Unseen Example Data

```typescript
presenceTracks: {
  layout: "grid",
  bidirectional: true,
  rows: [
    // Row 0: Top energy path
    [
      { id: "S1", isStart: true },
      { value: "+1", modifier: "range" },  // +1 Range on everything
      { value: 1, trackType: "energy", elements: ["Sun"] },
      { value: 1, trackType: "energy", elements: ["Moon"] },
      { value: 2, trackType: "energy", elements: ["Water"] },
      { value: 2, trackType: "energy", elements: ["Air"] },
      { value: 3, trackType: "energy", elements: ["Earth"] },
    ],
    // Row 1: Middle modifier path
    [
      null,
      null,
      null,
      { value: "+2", modifier: "energy" },
      { id: "M1", value: "+1", modifier: "energy", elements: ["Air"] },
      { value: "+1", modifier: "cardPlays" },
      { value: "+1", modifier: "range" },
    ],
    // Row 2: Bottom card plays path
    [
      { id: "S2", isStart: true },
      { value: 1, trackType: "cardPlays" },
      { value: 2, trackType: "cardPlays" },
      { value: 2, trackType: "cardPlays", reclaim: true },
      { value: 3, trackType: "cardPlays" },
      { value: 3, trackType: "cardPlays", elements: ["Plant"] },
      { value: 4, trackType: "cardPlays" },
    ],
  ],
  connections: [
    // Top to middle convergence
    { from: [0, 4], to: [1, 3] },  // Water → +2 Energy
    // Middle to bottom convergence
    { from: [1, 4], to: [2, 3] },  // M1 → Reclaim slot
    // Additional cross-path connections (verify against actual board)
    { from: [0, 5], to: [1, 5] },
    { from: [1, 5], to: [2, 4] },
  ]
}
```

## Implementation Steps

1. **Update Schema**: Add `v.union` for legacy + new grid format
2. **Create Grid Renderer**: New component to render grid-based tracks
3. **Port Linear to Grid**: Migration for existing spirits (trivial - single row)
4. **Research Actual Layouts**: Need images of Finder, Starlight, Serpent boards
5. **Seed Complex Spirits**: Enter accurate grid data
6. **Run Reseed**: Update database with new data

## Open Questions

1. **Need actual board images** for Finder, Starlight, Serpent to verify exact topology
2. **Energy/cardPlays calculation logic** needs to be implemented in UI
3. **Animation for traversal** - how to show which paths are valid?
4. **Mobile rendering** - grid might need responsive layout

## Next Steps

1. Get user approval on Option C approach
2. Find/request actual spirit board images for reference
3. Implement schema changes
4. Build grid renderer component
5. Reseed Finder, Starlight, Serpent with accurate data
