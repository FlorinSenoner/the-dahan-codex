# Architecture Research

**Domain:** PWA companion app with Convex backend (Spirit Island
reference/tracker) **Researched:** 2026-01-24 **Confidence:** MEDIUM-HIGH

## System Overview

```
+-------------------------------------------------------------------+
|                      CLIENT LAYER (PWA)                           |
|  +-----------------------------+  +-----------------------------+ |
|  |        TanStack Start       |  |     Service Worker         | |
|  |  +--------+  +-----------+  |  |  (Serwist)                 | |
|  |  | Router |->| Routes    |  |  |  +----------+ +---------+  | |
|  |  +--------+  | + Loaders |  |  |  | Precache | | Runtime |  | |
|  |              +-----------+  |  |  | (Static) | | Cache   |  | |
|  +-----------------------------+  |  +----------+ +---------+  | |
|              |                    +-----------------------------+ |
|              v                                 |                  |
|  +-----------------------------+               v                  |
|  |   React Components          |    +------------------------+   |
|  |   +-----------+ +--------+  |    | IndexedDB              |   |
|  |   | UI (Ark/  | | Motion |  |    | (Offline Reference     |   |
|  |   | Radix)    | | (Anim) |  |    |  Data Cache)           |   |
|  |   +-----------+ +--------+  |    +------------------------+   |
|  +-----------------------------+                                  |
|              |                                                    |
|              v                                                    |
|  +-----------------------------+                                  |
|  |   TanStack Query            |                                  |
|  |   (convexQuery adapter)     |                                  |
|  |   +----------+ +----------+ |                                  |
|  |   | useQuery | | useMut.. | |                                  |
|  |   +----------+ +----------+ |                                  |
|  +-----------------------------+                                  |
|              |                                                    |
+--------------|----------------------------------------------------+
               | WebSocket (real-time subscriptions)
               v
+-------------------------------------------------------------------+
|                      BACKEND LAYER (Convex)                       |
|  +-----------------+  +----------------+  +-------------------+   |
|  | Query Functions |  | Mutations      |  | Scheduled Actions |   |
|  | (read-only)     |  | (writes)       |  | (background)      |   |
|  +-----------------+  +----------------+  +-------------------+   |
|              |               |                    |               |
|              v               v                    v               |
|  +-----------------------------+  +-----------------------------+ |
|  |         Database            |  |   File Storage              | |
|  | +----------+ +------------+ |  | (Spirit images, icons)      | |
|  | | Ref Data | | User Data  | |  +-----------------------------+ |
|  | | (Spirits)| | (Games,    | |                                  |
|  | |          | |  Notes)    | |                                  |
|  | +----------+ +------------+ |                                  |
|  +-----------------------------+                                  |
+-------------------------------------------------------------------+
               ^
               |
+-------------------------------------------------------------------+
|                      AUTH LAYER (Clerk)                           |
|  +------------------+  +----------------------------------+       |
|  | ClerkProvider    |->| JWT Token (conveyed to Convex)   |       |
|  | (wraps app)      |  | ctx.auth.getUserIdentity()       |       |
|  +------------------+  +----------------------------------+       |
+-------------------------------------------------------------------+
```

### Component Responsibilities

| Component       | Responsibility                                      | Typical Implementation                             |
| --------------- | --------------------------------------------------- | -------------------------------------------------- |
| TanStack Start  | Full-stack React framework, SSR, file-based routing | `app/routes/`, `app/router.tsx`                    |
| TanStack Router | Type-safe routing, loaders for data prefetch        | File-based routes with loaders                     |
| TanStack Query  | Data synchronization layer with Convex adapter      | `convexQuery()` + `useSuspenseQuery()`             |
| Convex Client   | WebSocket connection, reactive subscriptions        | `ConvexReactClient` + `ConvexProvider`             |
| Clerk           | Authentication, JWT token generation                | `ClerkProvider` wrapping `ConvexProviderWithClerk` |
| Serwist         | PWA service worker, caching strategies              | `@serwist/vite` with precache manifest             |
| IndexedDB       | Offline storage for reference data                  | `idb` library wrapper                              |
| Ark UI / Radix  | Headless accessible UI primitives                   | Composable component parts                         |
| Motion          | Gestures, animations, drag interactions             | `motion` components for scrubber                   |

## Recommended Project Structure

```
the-dahan-codex/
├── app/
│   ├── routes/
│   │   ├── __root.tsx              # Root layout, providers
│   │   ├── index.tsx               # Home/landing
│   │   ├── spirits/
│   │   │   ├── index.tsx           # Spirits list
│   │   │   ├── $spiritId.tsx       # Spirit detail (tabs)
│   │   │   └── -components/        # Spirit-specific components
│   │   │       ├── SpiritCard.tsx
│   │   │       ├── PresenceTrack.tsx
│   │   │       └── OpeningScrubber/
│   │   │           ├── index.tsx
│   │   │           ├── Timeline.tsx
│   │   │           ├── GrowthPanel.tsx
│   │   │           └── CardPreview.tsx
│   │   ├── games/
│   │   │   ├── index.tsx           # Games list
│   │   │   ├── new.tsx             # New game form
│   │   │   └── $gameId.tsx         # Game detail/edit
│   │   └── notes/
│   │       ├── index.tsx           # Notes list
│   │       ├── new.tsx             # New note
│   │       └── $noteId.tsx         # Note editor
│   ├── components/
│   │   ├── ui/                     # Generic UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── Slider.tsx
│   │   │   └── ...
│   │   ├── layout/                 # App shell components
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Sidebar.tsx
│   │   └── forms/                  # Form-specific components
│   │       ├── SpiritPicker.tsx
│   │       └── AdversarySelect.tsx
│   ├── lib/
│   │   ├── convex.ts               # Convex client setup
│   │   ├── clerk.ts                # Clerk configuration
│   │   ├── offline/                # Offline utilities
│   │   │   ├── db.ts               # IndexedDB wrapper
│   │   │   ├── sync.ts             # Sync queue logic
│   │   │   └── hooks.ts            # useOfflineData, etc.
│   │   └── utils.ts                # General utilities
│   ├── hooks/
│   │   ├── useSpirit.ts            # Spirit data hook
│   │   ├── useOpenings.ts          # Openings data hook
│   │   └── useOnlineStatus.ts      # Network detection
│   ├── router.tsx                  # TanStack Router config
│   ├── routeTree.gen.ts            # Generated route tree
│   └── styles/
│       └── globals.css             # Tailwind imports
├── convex/
│   ├── schema.ts                   # Database schema
│   ├── _generated/                 # Auto-generated types
│   ├── auth.config.ts              # Clerk JWT config
│   ├── spirits/
│   │   ├── validators.ts           # Spirit field validators
│   │   ├── queries.ts              # Spirit queries
│   │   └── mutations.ts            # Spirit mutations (admin)
│   ├── openings/
│   │   ├── validators.ts
│   │   ├── queries.ts
│   │   └── mutations.ts
│   ├── games/
│   │   ├── validators.ts
│   │   ├── queries.ts
│   │   └── mutations.ts
│   ├── notes/
│   │   ├── validators.ts
│   │   ├── queries.ts
│   │   └── mutations.ts
│   └── model/                      # Shared business logic
│       ├── relationships.ts        # Cross-table helpers
│       └── scoring.ts              # Game scoring logic
├── public/
│   ├── manifest.json               # PWA manifest
│   ├── icons/                      # App icons
│   └── sw.ts                       # Service worker source
├── vite.config.ts                  # Vite + Serwist config
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Structure Rationale

- **`app/routes/`**: File-based routing following TanStack Start conventions.
  The `$param` syntax denotes dynamic routes. Prefix with `-` for colocated
  components that should not become routes.
- **`app/components/ui/`**: Generic, reusable primitives built on Ark/Radix.
  These are application-agnostic.
- **`app/routes/-components/`**: Route-specific components colocated with their
  routes. The `-` prefix tells TanStack Router to ignore these folders.
- **`app/lib/offline/`**: Isolated offline logic keeps PWA concerns separate
  from core data fetching.
- **`convex/[domain]/`**: Group Convex functions by domain entity. Each domain
  gets validators, queries, and mutations.
- **`convex/model/`**: Shared business logic and relationship traversal helpers.

## Architectural Patterns

### Pattern 1: Convex + TanStack Query Reactive Subscriptions

**What:** Use `convexQuery()` adapter with TanStack Query hooks for reactive
data that auto-updates.

**When to use:** All data fetching from Convex. This is the primary data loading
pattern.

**Trade-offs:**

- Pro: Automatic real-time updates via WebSocket, no manual cache invalidation
- Pro: SSR support with `useSuspenseQuery` for initial render
- Con: Beta status of adapter (as of Jan 2026)
- Con: Additional complexity vs raw Convex hooks

**Example:**

```typescript
// app/routes/spirits/$spiritId.tsx
import { createFileRoute } from '@tanstack/react-router';
import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from '../../convex/_generated/api';

export const Route = createFileRoute('/spirits/$spiritId')({
  loader: async ({ context, params }) => {
    // Prefetch in loader for faster navigation
    await context.queryClient.ensureQueryData(
      convexQuery(api.spirits.queries.get, { id: params.spiritId })
    );
  },
  component: SpiritDetail,
});

function SpiritDetail() {
  const { spiritId } = Route.useParams();
  const { data: spirit } = useSuspenseQuery(
    convexQuery(api.spirits.queries.get, { id: spiritId })
  );
  // spirit auto-updates when database changes
  return <SpiritView spirit={spirit} />;
}
```

### Pattern 2: Provider Hierarchy for Auth + Data

**What:** Proper nesting of Clerk and Convex providers for authenticated data
access.

**When to use:** App root setup. Required for auth to flow correctly to Convex.

**Trade-offs:**

- Pro: Single source of truth for auth state
- Pro: Convex functions receive verified user identity
- Con: Provider ordering is strict and easy to get wrong

**Example:**

```typescript
// app/routes/__root.tsx
import { ClerkProvider } from '@clerk/tanstack-start';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Convex handles freshness
    },
  },
});

export const Route = createRootRoute({
  component: () => (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  ),
});
```

### Pattern 3: Reference Data vs User Data Schema Separation

**What:** Organize Convex schema to distinguish static reference data (spirits,
game components) from user-generated data (games, notes).

**When to use:** Schema design phase. Essential for offline strategy and access
control.

**Trade-offs:**

- Pro: Clear mental model for caching (reference = precache, user = sync)
- Pro: Different access patterns (reference = public read, user = authenticated)
- Con: Some data straddles both (openings can be community-contributed)

**Example:**

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // === REFERENCE DATA (static, public read) ===
  spirits: defineTable({
    name: v.string(),
    complexity: v.union(
      v.literal("low"),
      v.literal("moderate"),
      v.literal("high"),
      v.literal("very_high"),
    ),
    thematicColor: v.string(),
    baseCardCount: v.number(),
    // Growth options stored as structured data
    growthOptions: v.array(
      v.object({
        position: v.number(),
        choices: v.array(
          v.object({
            type: v.string(),
            value: v.optional(v.number()),
          }),
        ),
      }),
    ),
    // Presence track positions
    presenceTracks: v.object({
      energy: v.array(
        v.object({
          position: v.number(),
          value: v.union(v.number(), v.string()),
        }),
      ),
      plays: v.array(
        v.object({
          position: v.number(),
          value: v.union(v.number(), v.string()),
        }),
      ),
    }),
    // Innate powers
    innatePowers: v.array(
      v.object({
        name: v.string(),
        speed: v.union(v.literal("fast"), v.literal("slow")),
        thresholds: v.array(
          v.object({
            elements: v.record(v.string(), v.number()),
            effect: v.string(),
          }),
        ),
      }),
    ),
    specialRules: v.array(
      v.object({
        name: v.string(),
        text: v.string(),
      }),
    ),
  })
    .index("by_name", ["name"])
    .index("by_complexity", ["complexity"]),

  aspects: defineTable({
    spiritId: v.id("spirits"),
    name: v.string(),
    complexity: v.string(),
    setupChanges: v.string(),
    // Override fields from base spirit
    growthOverrides: v.optional(v.any()),
    presenceOverrides: v.optional(v.any()),
  }).index("by_spirit", ["spiritId"]),

  // === USER DATA (dynamic, auth required) ===
  games: defineTable({
    userId: v.string(), // Clerk user ID
    playedAt: v.number(), // timestamp
    result: v.union(
      v.literal("win"),
      v.literal("loss"),
      v.literal("incomplete"),
    ),
    playerCount: v.number(),
    // Array of spirit selections (bounded, max 6)
    spirits: v.array(
      v.object({
        spiritId: v.id("spirits"),
        aspectId: v.optional(v.id("aspects")),
        playerName: v.optional(v.string()),
      }),
    ),
    adversary: v.optional(
      v.object({
        name: v.string(),
        level: v.number(),
      }),
    ),
    scenario: v.optional(v.string()),
    board: v.optional(v.string()),
    score: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "playedAt"]),

  notes: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.string(), // Rich text (e.g., TipTap JSON)
    tags: v.array(v.string()),
    // Backlinks to other entities
    linkedSpirits: v.array(v.id("spirits")),
    linkedGames: v.array(v.id("games")),
    linkedNotes: v.array(v.id("notes")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_tag", ["tags"]),

  // === COMMUNITY/HYBRID DATA ===
  openings: defineTable({
    spiritId: v.id("spirits"),
    aspectId: v.optional(v.id("aspects")),
    authorId: v.optional(v.string()), // null for "official" openings
    name: v.string(),
    description: v.optional(v.string()),
    // Sequence of turns
    turns: v.array(
      v.object({
        turnNumber: v.number(),
        growthChoice: v.object({
          optionIndex: v.number(),
          choices: v.array(v.any()), // Specific choices made
        }),
        presenceMoves: v.array(
          v.object({
            track: v.union(v.literal("energy"), v.literal("plays")),
            fromPosition: v.number(),
            toLocation: v.string(),
          }),
        ),
        cardsPlayed: v.array(v.string()),
        energyGained: v.number(),
        energySpent: v.number(),
      }),
    ),
    isPublic: v.boolean(),
    upvotes: v.number(),
  })
    .index("by_spirit", ["spiritId"])
    .index("by_author", ["authorId"]),
});
```

### Pattern 4: Two-Tier Offline Architecture

**What:** Use service worker precaching for static assets and reference data,
with IndexedDB for user data that syncs when online.

**When to use:** PWA implementation phase. Critical for offline-first
experience.

**Trade-offs:**

- Pro: Reference data available immediately offline
- Pro: User can view spirits/openings without network
- Con: User data sync requires careful conflict resolution
- Con: Added complexity in data layer

**Example:**

```typescript
// app/lib/offline/db.ts
import { openDB, DBSchema } from "idb";

interface OfflineDB extends DBSchema {
  spirits: {
    key: string;
    value: Spirit;
    indexes: { "by-name": string };
  };
  openings: {
    key: string;
    value: Opening;
    indexes: { "by-spirit": string };
  };
  syncQueue: {
    key: number;
    value: {
      id: number;
      action: "create" | "update" | "delete";
      table: string;
      data: unknown;
      timestamp: number;
    };
  };
}

export const db = await openDB<OfflineDB>("dahan-codex", 1, {
  upgrade(db) {
    const spirits = db.createObjectStore("spirits", { keyPath: "_id" });
    spirits.createIndex("by-name", "name");

    const openings = db.createObjectStore("openings", { keyPath: "_id" });
    openings.createIndex("by-spirit", "spiritId");

    db.createObjectStore("syncQueue", { keyPath: "id", autoIncrement: true });
  },
});

// Hook to sync reference data from Convex to IndexedDB
export function useSyncReferenceData() {
  const { data: spirits } = useQuery(convexQuery(api.spirits.queries.list, {}));

  useEffect(() => {
    if (spirits) {
      const tx = db.transaction("spirits", "readwrite");
      spirits.forEach((spirit) => tx.store.put(spirit));
      tx.done;
    }
  }, [spirits]);
}
```

### Pattern 5: Component Composition for Complex Interactive UI

**What:** Break down complex UI (like opening scrubber) into composable pieces
with clear data contracts.

**When to use:** Building the opening scrubber, presence tracks, and other
interactive visualizations.

**Trade-offs:**

- Pro: Each piece testable in isolation
- Pro: Motion animations scoped to relevant components
- Con: Prop drilling or context needed for shared state

**Example:**

```typescript
// app/routes/spirits/-components/OpeningScrubber/index.tsx
import { motion } from 'motion/react';
import { Timeline } from './Timeline';
import { GrowthPanel } from './GrowthPanel';
import { PresenceTracks } from './PresenceTracks';
import { CardPreview } from './CardPreview';

interface OpeningScrubberProps {
  opening: Opening;
  spirit: Spirit;
}

export function OpeningScrubber({ opening, spirit }: OpeningScrubberProps) {
  const [currentTurn, setCurrentTurn] = useState(0);
  const turn = opening.turns[currentTurn];

  // Derive state at current turn
  const presenceState = computePresenceState(spirit, opening.turns, currentTurn);
  const energyState = computeEnergyState(spirit, opening.turns, currentTurn);

  return (
    <div className="flex flex-col gap-4">
      {/* Timeline scrubber with drag */}
      <Timeline
        turns={opening.turns}
        currentTurn={currentTurn}
        onTurnChange={setCurrentTurn}
      />

      {/* Growth choice for current turn */}
      <GrowthPanel
        growthOptions={spirit.growthOptions}
        choice={turn.growthChoice}
      />

      {/* Presence tracks showing current state */}
      <PresenceTracks
        tracks={spirit.presenceTracks}
        currentState={presenceState}
        moves={turn.presenceMoves}
      />

      {/* Cards played this turn */}
      <CardPreview
        cards={turn.cardsPlayed}
        energy={energyState}
      />
    </div>
  );
}

// Timeline.tsx - uses Motion for drag gestures
export function Timeline({ turns, currentTurn, onTurnChange }: TimelineProps) {
  const constraintsRef = useRef(null);

  return (
    <div ref={constraintsRef} className="relative h-12 bg-muted rounded">
      <motion.div
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0}
        onDrag={(_, info) => {
          const turn = Math.round(info.point.x / TURN_WIDTH);
          onTurnChange(Math.max(0, Math.min(turns.length - 1, turn)));
        }}
        className="absolute w-4 h-full bg-primary rounded cursor-grab active:cursor-grabbing"
        style={{ x: currentTurn * TURN_WIDTH }}
      />
      {turns.map((_, i) => (
        <button
          key={i}
          onClick={() => onTurnChange(i)}
          className="absolute w-2 h-2 rounded-full bg-muted-foreground"
          style={{ left: i * TURN_WIDTH + TURN_WIDTH / 2 - 4 }}
        />
      ))}
    </div>
  );
}
```

## Data Flow

### Request Flow (Online)

```
[User navigates to /spirits/river]
         |
         v
[TanStack Router]
   - Matches route /spirits/$spiritId
   - Runs loader: queryClient.ensureQueryData(convexQuery(...))
         |
         v
[TanStack Query]
   - Checks cache (staleTime: Infinity, so trusts cache)
   - If not cached: initiates Convex subscription
         |
         v
[Convex Client]
   - Sends query over WebSocket
   - Receives initial result
   - Maintains subscription for updates
         |
         v
[Component Renders]
   - useSuspenseQuery returns data
   - UI displays spirit info
         |
         v
[Database Change Occurs]
   - Another user adds opening
   - Convex pushes update via WebSocket
   - TanStack Query cache updated
   - Component re-renders automatically
```

### Offline Flow (Reference Data)

```
[User navigates to /spirits/river (offline)]
         |
         v
[Service Worker intercepts]
   - Checks cache for route HTML/JS (precached)
   - Returns cached app shell
         |
         v
[TanStack Query]
   - Checks cache (empty or stale)
   - Convex connection fails (offline)
         |
         v
[Offline Hook Fallback]
   - useSpirit detects offline status
   - Falls back to IndexedDB lookup
         |
         v
[IndexedDB]
   - Returns cached spirit data
   - (Previously synced when online)
         |
         v
[Component Renders]
   - Shows spirit from local cache
   - Indicates "offline mode" badge
```

### Mutation Flow (With Offline Queue)

```
[User creates new game (offline)]
         |
         v
[Form Submit]
   - TanStack Form validates
   - Calls mutation handler
         |
         v
[Offline-Aware Mutation]
   - Detects offline status
   - Writes to IndexedDB sync queue
   - Optimistically updates local state
         |
         v
[UI Updates]
   - Shows new game in list
   - Badge: "Pending sync"
         |
         v
[Network Restored]
   - online event fires
   - Background sync processes queue
         |
         v
[Convex Mutation]
   - Executes queued mutations in order
   - Receives server-assigned IDs
         |
         v
[Local State Updated]
   - Replace temp IDs with real IDs
   - Remove from sync queue
   - Badge removed
```

### Key Data Flows

1. **Reference Data Hydration:** On app load (online), Convex subscriptions
   populate TanStack Query cache. A background effect syncs this data to
   IndexedDB for offline access.

2. **User Data Sync:** User mutations go directly to Convex when online. When
   offline, mutations queue in IndexedDB and replay on reconnection.

3. **Real-time Updates:** All connected clients receive Convex pushes via
   WebSocket. No polling, no manual refresh needed.

## Scaling Considerations

| Scale          | Architecture Adjustments                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| 0-1k users     | Current architecture handles easily. Convex free tier sufficient. Single deployment.                           |
| 1k-10k users   | May need to optimize reference data queries (pagination, partial loading). Consider Convex Pro for bandwidth.  |
| 10k-100k users | Evaluate Convex costs. Consider CDN for static spirit images. May need to limit real-time subscriptions scope. |

### Scaling Priorities

1. **First bottleneck:** Convex bandwidth for reference data. Mitigate by
   aggressive IndexedDB caching and only subscribing to necessary data (not
   entire spirit list on every page).

2. **Second bottleneck:** Opening data size. If openings grow large, consider
   pagination or on-demand loading rather than prefetching all openings for a
   spirit.

## Anti-Patterns

### Anti-Pattern 1: Filter in Code Instead of Index

**What people do:** Use `.filter()` on Convex query results to find specific
documents. **Why it's wrong:** All filtered-out documents still count toward
bandwidth. Performance degrades with data growth. **Do this instead:** Define
indexes in schema, use `.withIndex()` in queries.

```typescript
// BAD
const games = await ctx.db.query("games").collect();
return games.filter((g) => g.userId === userId);

// GOOD
const games = await ctx.db
  .query("games")
  .withIndex("by_user", (q) => q.eq("userId", userId))
  .collect();
```

### Anti-Pattern 2: Circular Provider Dependencies

**What people do:** Nest Convex provider inside or beside Clerk provider
incorrectly. **Why it's wrong:** Auth token never reaches Convex, all
authenticated queries fail silently. **Do this instead:** Always wrap:
`ClerkProvider > ConvexProviderWithClerk > QueryClientProvider`

### Anti-Pattern 3: Unbounded Array Fields

**What people do:** Store growing lists (e.g., all game IDs a user has played)
in an array field. **Why it's wrong:** Arrays limited to 8,192 items. Cannot
index into arrays for queries. Document size grows unboundedly. **Do this
instead:** Use back-references with indexes. Query games by userId instead of
storing game IDs on user.

### Anti-Pattern 4: Manual Cache Invalidation with Convex

**What people do:** Call `queryClient.invalidateQueries()` after Convex
mutations. **Why it's wrong:** Convex already pushes updates reactively. Manual
invalidation causes unnecessary re-fetches. **Do this instead:** Trust Convex
subscriptions. Data updates automatically.

### Anti-Pattern 5: Fetching in Components Without Suspense/Loader

**What people do:** Call `useQuery` in component body without loader prefetch.
**Why it's wrong:** Creates request waterfalls. Each nested component waits for
parent data before fetching its own. **Do this instead:** Prefetch in route
loaders. Use `useSuspenseQuery` with proper Suspense boundaries.

## Integration Points

### External Services

| Service | Integration Pattern                      | Notes                                                                                          |
| ------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Convex  | WebSocket via `ConvexReactClient`        | Maintains persistent connection. Handles reconnection automatically.                           |
| Clerk   | JWT template + `ConvexProviderWithClerk` | Configure JWT template named "convex" in Clerk dashboard. Issuer URL in `auth.config.ts`.      |
| Serwist | Vite plugin + service worker source      | Precache manifest auto-generated. Runtime caching for API (limited use with Convex WebSocket). |

### Internal Boundaries

| Boundary                     | Communication                        | Notes                                                                      |
| ---------------------------- | ------------------------------------ | -------------------------------------------------------------------------- |
| Routes <-> Convex            | TanStack Query (convexQuery adapter) | All data access through query hooks. No direct Convex calls in components. |
| Components <-> Offline Layer | Custom hooks (`useOfflineSpirit`)    | Hooks check online status, fallback to IndexedDB.                          |
| Service Worker <-> App       | postMessage / Background Sync API    | SW handles precaching. App registers sync events for offline mutations.    |
| Forms <-> Mutations          | TanStack Form -> Convex mutations    | Form validation client-side, mutation handles business logic.              |

## Build Order Implications

Based on architectural dependencies, recommended build order:

1. **Foundation (Phase 1)**
   - TanStack Start project setup
   - Convex backend connection
   - Clerk authentication integration
   - Provider hierarchy in root layout
   - Basic routing structure

2. **Reference Data Core (Phase 2)**
   - Convex schema for spirits/aspects
   - Spirit queries and list display
   - Spirit detail view (basic)
   - Initial seed data

3. **Offline Foundation (Phase 3)**
   - Serwist PWA setup
   - IndexedDB wrapper
   - Reference data sync to IndexedDB
   - Offline detection hooks

4. **Interactive UI (Phase 4)**
   - Opening scrubber component
   - Presence track visualization
   - Motion animations
   - Growth panel display

5. **User Data (Phase 5)**
   - Games schema and CRUD
   - Game form with TanStack Form
   - Games list and detail views
   - Offline mutation queue

6. **Advanced Features (Phase 6)**
   - Notes with rich text
   - Backlinks implementation
   - Search functionality
   - Community openings (optional)

## Sources

### Official Documentation (HIGH confidence)

- [Convex Database Schemas](https://docs.convex.dev/database/schemas)
- [Convex with TanStack Start](https://docs.convex.dev/client/tanstack/tanstack-start/)
- [Convex with TanStack Query](https://docs.convex.dev/client/tanstack/tanstack-query/)
- [Convex & Clerk Integration](https://docs.convex.dev/auth/clerk)
- [Convex Best Practices](https://docs.convex.dev/understanding/best-practices/)
- [TanStack Start Build from Scratch](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch)
- [TanStack Router File-Based Routing](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing)
- [Clerk Convex Integration](https://clerk.com/docs/guides/development/integrations/databases/convex)
- [Serwist Documentation](https://serwist.pages.dev/docs)
- [Motion (Framer Motion) Gestures](https://www.framer.com/motion/gestures/)

### Community Resources (MEDIUM confidence)

- [Convex Relationship Structures](https://stack.convex.dev/relationship-structures-let-s-talk-about-schemas)
- [Convex Best Practices Gist](https://gist.github.com/srizvi/966e583693271d874bf65c2a95466339)
- [TanStack in 2026 Guide](https://www.codewithseb.com/blog/tanstack-ecosystem-complete-guide-2026)
- [LogRocket: Full-Stack with TanStack Start](https://blog.logrocket.com/full-stack-app-with-tanstack-start/)
- [LogRocket: Next.js 16 PWA with Offline Support](https://blog.logrocket.com/nextjs-16-pwa-offline-support)
- [Builder.io: React UI Libraries 2026](https://www.builder.io/blog/react-component-libraries-2026)

### General PWA Patterns (MEDIUM confidence)

- [web.dev: PWA Offline Data](https://web.dev/learn/pwa/offline-data)
- [MDN: PWA Service Workers](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Offline_Service_workers)
- [Offline-First PWA Architecture](https://blog.pixelfreestudio.com/best-practices-for-pwa-offline-caching-strategies/)

---

_Architecture research for: The Dahan Codex (Spirit Island companion PWA)_
_Researched: 2026-01-24_
