# Phase 6: User Data - Research

**Researched:** 2026-01-31
**Domain:** Convex user data, forms, CSV import/export, mobile UX patterns
**Confidence:** HIGH

## Summary

Phase 6 implements game tracking for logged-in users with CSV export/import capability. The existing codebase already has authentication infrastructure (Clerk + Convex), auth helpers (`requireAuth`, `requireAdmin`), and established UI patterns (shadcn/ui components, Radix primitives, Tailwind). The core challenge is designing a robust game data model that captures Spirit Island's complex scoring formula while keeping the form UI simple.

The research confirms PapaParse as the standard CSV library for browser-based parsing/generation, Sonner as the recommended toast library for undo patterns, and cmdk for searchable spirit selection. The game deletion pattern should use swipe-to-delete on mobile with an undo toast rather than confirmation dialogs, following the CONTEXT.md decisions.

**Primary recommendation:** Use existing Convex auth patterns, add a `games` table with user scoping via `tokenIdentifier`, use PapaParse for CSV operations, and add Sonner for toast notifications with undo capability.

## Standard Stack

The established libraries/tools for this domain:

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| convex | ^1.31.6 | Backend + real-time | Already the project's backend |
| @clerk/clerk-react | ^5.33.2 | Authentication | Already integrated |
| zod | ^4.3.6 | Schema validation | Already in project, validates form data |
| @tanstack/react-query | ^5.90.20 | Query caching | Already integrated with Convex |

### New Dependencies
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|-------------|
| papaparse | ^5.5.0 | CSV parsing/generation | 8M weekly downloads, works in browser, handles edge cases (quoted fields, escapes) |
| sonner | ^1.7.0 | Toast notifications | Recommended by shadcn/ui, 8M weekly downloads, built-in undo action support |
| cmdk | ^1.0.0 | Searchable dropdown | Powers shadcn/ui Command, composable with Radix, accessible |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| papaparse | csv-parse | csv-parse is Node-focused; papaparse is browser-optimized |
| cmdk | Ariakit Combobox | cmdk integrates better with existing Radix primitives |
| sonner | react-hot-toast | Sonner has better undo action API and shadcn/ui integration |

**Installation:**
```bash
pnpm add papaparse sonner cmdk
pnpm add -D @types/papaparse
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── routes/
│   ├── _authenticated/
│   │   ├── games.tsx           # Game list page (layout)
│   │   ├── games.index.tsx     # Game list content
│   │   ├── games.new.tsx       # New game form
│   │   ├── games.$id.tsx       # Game detail + inline edit
│   │   └── games.import.tsx    # CSV import page with preview
│   └── games/
│       └── export.tsx          # CSV export (public route, redirect to auth)
├── components/
│   ├── games/
│   │   ├── game-form.tsx       # Shared form for create/edit
│   │   ├── game-row.tsx        # Compact list row
│   │   ├── spirit-picker.tsx   # Searchable spirit dropdown
│   │   ├── adversary-picker.tsx
│   │   ├── score-calculator.tsx
│   │   └── csv-preview.tsx     # Import preview table
│   └── ui/
│       ├── sonner.tsx          # Toast provider
│       └── command.tsx         # cmdk wrapper
convex/
├── games.ts                    # Game CRUD mutations/queries
├── schema.ts                   # Add games table
└── lib/
    └── scoring.ts              # Spirit Island score calculation
```

### Pattern 1: User-Scoped Data with tokenIdentifier
**What:** All user data is scoped by the user's Clerk tokenIdentifier
**When to use:** Any table that stores user-specific data
**Example:**
```typescript
// Source: Existing pattern in convex/lib/auth.ts + Convex docs
import { requireAuth } from "./lib/auth";

export const listGames = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireAuth(ctx);
    return await ctx.db
      .query("games")
      .withIndex("by_user", (q) =>
        q.eq("userId", identity.tokenIdentifier)
      )
      .collect();
  },
});

export const createGame = mutation({
  args: { /* game fields */ },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    return await ctx.db.insert("games", {
      ...args,
      userId: identity.tokenIdentifier,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
```

### Pattern 2: Soft Delete with Undo Toast
**What:** Delete marks record as deleted, toast allows undo, background job purges after timeout
**When to use:** User-facing delete operations where undo improves UX
**Example:**
```typescript
// Mutation: soft delete
export const deleteGame = mutation({
  args: { id: v.id("games") },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    const game = await ctx.db.get(args.id);
    if (!game || game.userId !== identity.tokenIdentifier) {
      throw new Error("Game not found");
    }
    await ctx.db.patch(args.id, {
      deletedAt: Date.now()
    });
  },
});

// Mutation: restore (undo)
export const restoreGame = mutation({
  args: { id: v.id("games") },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    const game = await ctx.db.get(args.id);
    if (!game || game.userId !== identity.tokenIdentifier) {
      throw new Error("Game not found");
    }
    await ctx.db.patch(args.id, {
      deletedAt: undefined
    });
  },
});

// Client: toast with undo
import { toast } from "sonner";

function handleDelete(gameId: Id<"games">) {
  deleteGame({ id: gameId });
  toast("Game deleted", {
    action: {
      label: "Undo",
      onClick: () => restoreGame({ id: gameId }),
    },
    duration: 5000,
  });
}
```

### Pattern 3: Shared Form Component for Create/Edit
**What:** Single form component handles both creation and editing
**When to use:** When create and edit have identical fields
**Example:**
```typescript
// Source: Existing pattern in editable-opening.tsx
interface GameFormProps {
  initialData?: GameFormData;
  onSubmit: (data: GameFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function GameForm({ initialData, onSubmit, isSubmitting }: GameFormProps) {
  const [formData, setFormData] = useState<GameFormData>(
    initialData ?? defaultGameFormData
  );

  // Form renders same fields for create/edit
  // Only difference is initialData being populated or empty
}
```

### Pattern 4: CSV Export with Browser Download
**What:** Generate CSV string client-side, trigger download via blob URL
**When to use:** Exporting user data to local file
**Example:**
```typescript
// Source: PapaParse docs
import Papa from "papaparse";

function exportGamesToCSV(games: Game[]) {
  const rows = games.map(game => ({
    id: game._id,
    date: game.date,
    result: game.result,
    spirit1: game.spirits[0]?.name ?? "",
    spirit2: game.spirits[1]?.name ?? "",
    // ... spirit3-6
    adversary: game.adversary?.name ?? "",
    adversaryLevel: game.adversary?.level ?? "",
    scenario: game.scenario?.name ?? "",
    score: game.score,
    notes: game.notes ?? "",
  }));

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `spirit-island-games-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}
```

### Pattern 5: CSV Import with Preview
**What:** Parse CSV, show preview table, confirm before applying
**When to use:** Any bulk import operation
**Example:**
```typescript
// Source: PapaParse docs
import Papa from "papaparse";

function handleFileUpload(file: File) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      // Validate each row
      const validated = results.data.map(row => ({
        ...row,
        isValid: validateGameRow(row),
        errors: getRowErrors(row),
      }));
      setPreviewData(validated);
    },
    error: (error) => {
      toast.error(`CSV parse error: ${error.message}`);
    },
  });
}
```

### Anti-Patterns to Avoid
- **Storing user data without userId field:** Always include userId in table schema and index by it
- **Hard delete without undo:** Use soft delete + undo toast for better UX
- **Generating CSV on server:** For user data export, generate client-side to reduce server load
- **Confirmation dialogs for delete:** Use undo toast pattern instead (per CONTEXT.md decision)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSV parsing | Custom string splitting | PapaParse | Handles quoted fields, escapes, multi-line values, encodings |
| Toast notifications | Custom div positioning | Sonner | Accessible, stacking, animations, action buttons |
| Searchable dropdown | Filter + native select | cmdk | Keyboard navigation, accessibility, composable |
| Score calculation | Inline math | Shared utility function | Formula is complex, needs testing, reused in multiple places |
| Form validation | Manual checks | Zod schemas | Type-safe, reusable, consistent error messages |
| Swipe gestures | Touch event handling | react-swipe-to-delete-component | Edge cases (velocity, threshold, cancel) |

**Key insight:** CSV parsing looks trivial until you hit quoted fields with embedded commas, line breaks within cells, or UTF-8 encoding issues. Use PapaParse.

## Common Pitfalls

### Pitfall 1: Unscoped User Queries
**What goes wrong:** Query returns all games instead of just current user's
**Why it happens:** Forgetting to filter by userId or using wrong index
**How to avoid:** Always use `requireAuth` and filter by `identity.tokenIdentifier`
**Warning signs:** Other users' data appearing in lists, data leaking in network tab

### Pitfall 2: Mutation Without Ownership Check
**What goes wrong:** User can modify/delete another user's games
**Why it happens:** Only checking auth, not ownership of specific record
**How to avoid:** Always verify `game.userId === identity.tokenIdentifier` before modify/delete
**Warning signs:** Missing ownership check in mutation handler

### Pitfall 3: CSV Import Replacing All Data
**What goes wrong:** Import deletes games not in CSV file
**Why it happens:** Misunderstanding "ID-based sync" requirement
**How to avoid:** Import only creates/updates records with matching IDs, never deletes
**Warning signs:** Games disappearing after import

### Pitfall 4: Missing Optimistic Updates
**What goes wrong:** UI feels sluggish, shows stale data
**Why it happens:** Waiting for server round-trip before updating UI
**How to avoid:** Use Convex's real-time updates + optimistic UI patterns with TanStack Query
**Warning signs:** UI lagging behind user actions

### Pitfall 5: Swipe Delete Without Undo
**What goes wrong:** Accidental data loss, frustrated users
**Why it happens:** Implementing swipe without undo mechanism
**How to avoid:** Always pair swipe-to-delete with undo toast (5 second window)
**Warning signs:** No undo option after delete action

### Pitfall 6: Spirit Name Mismatch in CSV
**What goes wrong:** Import fails to link spirits, creates orphaned records
**Why it happens:** CSV uses display names but DB uses IDs or slugs
**How to avoid:** Export includes spirit slug, import looks up by slug
**Warning signs:** "Unknown spirit" errors during import

## Code Examples

Verified patterns from official sources:

### Games Table Schema
```typescript
// Source: Existing schema.ts pattern + Convex docs
games: defineTable({
  // User ownership
  userId: v.string(), // Clerk tokenIdentifier

  // Core game info
  date: v.string(), // ISO 8601 date string "2026-01-31"
  result: v.union(v.literal("win"), v.literal("loss")),

  // Spirits (1-6, stored as array)
  spirits: v.array(v.object({
    spiritId: v.id("spirits"),
    name: v.string(), // Denormalized for CSV export
    variant: v.optional(v.string()), // Aspect name if applicable
    player: v.optional(v.string()), // Player name
  })),

  // Optional adversary
  adversary: v.optional(v.object({
    name: v.string(),
    level: v.number(), // 0-6
  })),

  // Optional secondary adversary
  secondaryAdversary: v.optional(v.object({
    name: v.string(),
    level: v.number(),
  })),

  // Optional scenario
  scenario: v.optional(v.object({
    name: v.string(),
    difficulty: v.optional(v.number()),
  })),

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
  .index("by_user", ["userId"])
  .index("by_user_date", ["userId", "date"])
  .index("by_user_deleted", ["userId", "deletedAt"]),
```

### Spirit Island Score Calculation
```typescript
// Source: Official Spirit Island rules (Dized)
interface ScoreParams {
  result: "win" | "loss";
  difficulty: number;
  cardsRemaining: number; // Cards left in invader deck
  cardsUsed: number; // Cards in discard + face-up
  dahanCount: number;
  blightCount: number;
  playerCount: number;
}

export function calculateScore(params: ScoreParams): number {
  const { result, difficulty, cardsRemaining, cardsUsed, dahanCount, blightCount, playerCount } = params;

  // Dahan and blight are divided by player count
  const dahanScore = Math.floor(dahanCount / playerCount);
  const blightPenalty = Math.floor(blightCount / playerCount);

  if (result === "win") {
    // Victory: 5x Difficulty + 10 bonus + 2 per card remaining + dahan/players - blight/players
    return (5 * difficulty) + 10 + (2 * cardsRemaining) + dahanScore - blightPenalty;
  } else {
    // Defeat: 2x Difficulty + 1 per card used + dahan/players - blight/players
    return (2 * difficulty) + cardsUsed + dahanScore - blightPenalty;
  }
}
```

### Sonner Toast Setup
```typescript
// app/components/ui/sonner.tsx
// Source: shadcn/ui Sonner docs
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast: "bg-background border-border",
          title: "text-foreground",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
        },
      }}
    />
  );
}

// Usage with undo action
import { toast } from "sonner";

toast("Game deleted", {
  action: {
    label: "Undo",
    onClick: () => restoreGame({ id: gameId }),
  },
  duration: 5000,
});
```

### Searchable Spirit Picker with cmdk
```typescript
// app/components/games/spirit-picker.tsx
// Source: shadcn/ui Command docs + cmdk docs
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SpiritPickerProps {
  value: string | null;
  onChange: (spiritId: string) => void;
  spirits: Array<{ _id: string; name: string; aspectName?: string }>;
}

export function SpiritPicker({ value, onChange, spirits }: SpiritPickerProps) {
  const [open, setOpen] = useState(false);
  const selected = spirits.find(s => s._id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open}>
          {selected ? (selected.aspectName ?? selected.name) : "Select spirit..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search spirits..." />
          <CommandList>
            <CommandEmpty>No spirit found.</CommandEmpty>
            <CommandGroup>
              {spirits.map((spirit) => (
                <CommandItem
                  key={spirit._id}
                  value={spirit.aspectName ?? spirit.name}
                  onSelect={() => {
                    onChange(spirit._id);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === spirit._id ? "opacity-100" : "opacity-0")} />
                  {spirit.aspectName ? `${spirit.name} (${spirit.aspectName})` : spirit.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
```

### PapaParse CSV Operations
```typescript
// Source: PapaParse official docs (papaparse.com)
import Papa from "papaparse";

// Export games to CSV
export function exportGames(games: Game[]): void {
  const rows = games.map(game => ({
    id: game._id,
    date: game.date,
    result: game.result,
    spirit1: game.spirits[0]?.name ?? "",
    spirit1_variant: game.spirits[0]?.variant ?? "",
    spirit1_player: game.spirits[0]?.player ?? "",
    // ... repeat for spirits 2-6
    adversary: game.adversary?.name ?? "",
    adversary_level: game.adversary?.level ?? "",
    secondary_adversary: game.secondaryAdversary?.name ?? "",
    secondary_adversary_level: game.secondaryAdversary?.level ?? "",
    scenario: game.scenario?.name ?? "",
    win_type: game.winType ?? "",
    score: game.score ?? "",
    notes: game.notes ?? "",
  }));

  const csv = Papa.unparse(rows, {
    quotes: true, // Quote all fields for Excel compatibility
    header: true,
  });

  downloadCSV(csv, `spirit-island-games-${new Date().toISOString().split("T")[0]}.csv`);
}

// Parse uploaded CSV
export function parseGamesCSV(file: File): Promise<ParsedGame[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Convert numbers
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`Parse errors: ${results.errors.map(e => e.message).join(", ")}`));
          return;
        }
        resolve(results.data as ParsedGame[]);
      },
      error: reject,
    });
  });
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-toastify | Sonner | 2023 | Better API, smaller bundle, native action support |
| react-select | cmdk + Popover | 2022 | Composable, accessible, unstyled by default |
| confirmation dialogs | Undo toasts | Ongoing | Better UX, fewer interruptions |
| server-side CSV | Client-side CSV | N/A | Reduces server load, works offline |

**Deprecated/outdated:**
- react-toastify: Still works but Sonner is preferred in shadcn/ui ecosystem
- Native select for searchable: Use cmdk/Combobox for better UX

## Open Questions

Things that couldn't be fully resolved:

1. **Swipe-to-delete library choice**
   - What we know: react-swipe-to-delete-component exists, works with React 18
   - What's unclear: Whether it integrates well with existing Radix/Tailwind styling, mobile Safari behavior
   - Recommendation: Start with the library, fall back to custom implementation if needed

2. **Adversary/Scenario reference data source**
   - What we know: Spirit Island Wiki has authoritative lists
   - What's unclear: Whether to hardcode in frontend, seed in Convex, or fetch dynamically
   - Recommendation: Start with hardcoded constants (like element badges), add to Convex later if needed

3. **Offline game creation**
   - What we know: Phase 4 established offline-first architecture for read
   - What's unclear: Whether to support offline game creation with queue & sync (marked as v2 in PROJECT.md)
   - Recommendation: Phase 6 implements online-only writes per PROJECT.md scope

## Sources

### Primary (HIGH confidence)
- Convex auth docs (https://docs.convex.dev/auth) - User identity and mutation patterns
- Convex database-auth docs (https://docs.convex.dev/auth/database-auth) - Storing user data patterns
- PapaParse official site (https://www.papaparse.com/) - CSV parsing/generation API
- Existing codebase patterns (convex/lib/auth.ts, convex/openings.ts) - Auth helper usage
- shadcn/ui Sonner docs (https://ui.shadcn.com/docs/components/sonner) - Toast implementation

### Secondary (MEDIUM confidence)
- Convex + Clerk best practices (https://stack.convex.dev/authentication-best-practices-convex-clerk-and-nextjs) - Integration patterns
- Spirit Island rules (Dized) - Score calculation formula
- cmdk GitHub (https://cmdk.paco.me/) - Searchable command menu

### Tertiary (LOW confidence)
- react-swipe-to-delete-component GitHub - Swipe gesture library (needs testing)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Libraries are established, documented, and widely used
- Architecture: HIGH - Patterns follow existing codebase conventions + official Convex docs
- Pitfalls: HIGH - Based on common Convex/auth patterns and explicit CONTEXT.md decisions

**Research date:** 2026-01-31
**Valid until:** 2026-03-01 (30 days - stack is stable)
