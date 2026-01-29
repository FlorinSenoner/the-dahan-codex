# Phase 5: Text Opening Management - Research

**Researched:** 2026-01-29
**Domain:** Admin CRUD, Form Management, Client-Side Search
**Confidence:** HIGH

## Summary

This phase adds admin tooling for creating/editing text-based spirit openings and implements global client-side search. The research identified that the existing infrastructure already provides most foundations: Clerk admin role detection exists in `convex/lib/auth.ts`, the openings schema and display components exist from Phase 3.6, and TanStack Router supports protected routes via layout patterns.

The standard approach uses React Hook Form with Zod validation for admin forms, Convex mutations for CRUD operations, and Fuse.js for client-side fuzzy search. The project already has Zod installed, so only react-hook-form and @hookform/resolvers need to be added.

Key architectural decisions include: using a pathless `_admin` layout route (matching existing `_authenticated` pattern), creating Convex mutations that call `requireAdmin()` before writes, and implementing search as a client-side feature that searches cached spirit/opening data.

**Primary recommendation:** Use React Hook Form with Zod for forms, Convex mutations with `requireAdmin()` for writes, Fuse.js for search, and TanStack Router `_admin` layout for route protection.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-hook-form | ^7.x | Form state management | Industry standard, minimal re-renders, excellent TypeScript support |
| @hookform/resolvers | ^3.x | Zod integration | Official resolver package for React Hook Form |
| Fuse.js | ^7.x | Client-side fuzzy search | Lightweight, works offline, good for small-medium datasets |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zod | ^4.3.6 | Schema validation | Already installed - reuse for form validation |
| @clerk/clerk-react | ^5.33.2 | Admin role checking | Already configured with isAdmin JWT claim |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Fuse.js | FlexSearch | FlexSearch is faster but heavier; Fuse.js is simpler for this dataset size |
| react-hook-form | TanStack Form | TanStack Form is newer but react-hook-form has better shadcn/ui integration |

**Installation:**
```bash
pnpm add react-hook-form @hookform/resolvers fuse.js
```

## Architecture Patterns

### Recommended Project Structure
```
app/routes/
├── _admin.tsx                    # Admin layout (auth guard)
├── _admin/
│   └── openings/
│       ├── index.tsx             # Admin openings list
│       ├── new.tsx               # Create new opening
│       └── $id.edit.tsx          # Edit existing opening
├── search.tsx                    # Global search page
convex/
├── openings.ts                   # Add mutations (create, update, delete)
├── search.ts                     # Combined search query
app/components/
├── admin/
│   └── opening-form.tsx          # Reusable opening form component
├── search/
│   └── search-results.tsx        # Search results display
```

### Pattern 1: Admin Route Protection with Layout
**What:** Use pathless `_admin` layout route that checks admin role before rendering children.
**When to use:** Any admin-only route.
**Example:**
```typescript
// app/routes/_admin.tsx
import { useUser } from "@clerk/clerk-react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const isAdmin = user?.publicMetadata?.isAdmin === true;

  useEffect(() => {
    if (isLoaded && !isAdmin) {
      navigate({ to: "/" });
    }
  }, [isLoaded, isAdmin, navigate]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!isAdmin) return <div>Access denied</div>;

  return <Outlet />;
}
```

### Pattern 2: Convex Mutation with Admin Guard
**What:** Mutations call `requireAdmin()` before any database writes.
**When to use:** All admin-only operations.
**Example:**
```typescript
// convex/openings.ts
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

export const create = mutation({
  args: {
    spiritId: v.id("spirits"),
    slug: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    difficulty: v.optional(v.union(
      v.literal("Beginner"),
      v.literal("Intermediate"),
      v.literal("Advanced"),
    )),
    turns: v.array(v.object({
      turn: v.number(),
      title: v.optional(v.string()),
      instructions: v.string(),
      notes: v.optional(v.string()),
    })),
    author: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("openings", args);
  },
});
```

### Pattern 3: React Hook Form with Zod and useFieldArray
**What:** Form handling with dynamic turn array fields.
**When to use:** Opening form with variable number of turns.
**Example:**
```typescript
// Form schema
const openingFormSchema = z.object({
  spiritId: z.string().min(1, "Spirit is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  description: z.string().optional(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  turns: z.array(z.object({
    turn: z.number().min(1),
    title: z.string().optional(),
    instructions: z.string().min(1, "Instructions required"),
    notes: z.string().optional(),
  })).min(1, "At least one turn required"),
  author: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.literal("")),
});

type OpeningFormData = z.infer<typeof openingFormSchema>;

// Component usage
const { control, register, handleSubmit, formState: { errors } } = useForm<OpeningFormData>({
  resolver: zodResolver(openingFormSchema),
  defaultValues: { turns: [{ turn: 1, instructions: "" }] },
});

const { fields, append, remove } = useFieldArray({
  control,
  name: "turns",
});
```

### Pattern 4: Fuse.js Client-Side Search
**What:** In-memory fuzzy search over cached data.
**When to use:** Global search across spirits and openings.
**Example:**
```typescript
// Search hook
import Fuse from "fuse.js";

function useSearch(spirits: Spirit[], openings: Opening[], query: string) {
  return useMemo(() => {
    if (!query.trim()) return { spirits: [], openings: [] };

    const spiritFuse = new Fuse(spirits, {
      keys: ["name", "summary", "aspectName"],
      threshold: 0.3,
      includeScore: true,
    });

    const openingFuse = new Fuse(openings, {
      keys: ["name", "description"],
      threshold: 0.3,
      includeScore: true,
    });

    return {
      spirits: spiritFuse.search(query).map(r => r.item),
      openings: openingFuse.search(query).map(r => r.item),
    };
  }, [spirits, openings, query]);
}
```

### Anti-Patterns to Avoid
- **Client-side admin check only:** Always validate admin role server-side in Convex mutations, not just in UI.
- **useFieldArray with array index as key:** Always use `field.id` from useFieldArray, never array index.
- **Flat arrays in useFieldArray:** useFieldArray requires objects, not primitives (e.g., `{ turn: 1 }` not `1`).
- **Server-side search:** For this dataset size (<50 spirits, <200 openings), client-side search is faster and works offline.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form state management | Custom useState for every field | react-hook-form | Re-render performance, validation, error handling complexity |
| Form validation | Manual validation logic | Zod + zodResolver | Type inference, consistent error messages, schema reuse |
| Dynamic form arrays | Manual array manipulation | useFieldArray | Handles add/remove/reorder with proper key management |
| Fuzzy search | Custom string matching | Fuse.js | Handles typos, threshold tuning, weighted fields |
| Admin route guard | Per-route auth checks | Layout route pattern | Centralizes auth logic, prevents forgotten checks |

**Key insight:** Form handling looks simple but has dozens of edge cases (focus management, validation timing, error display, array field identity). React Hook Form has solved all of them.

## Common Pitfalls

### Pitfall 1: Missing Server-Side Admin Check
**What goes wrong:** UI checks isAdmin but mutation doesn't; malicious users can call mutations directly.
**Why it happens:** Developers assume UI protection is sufficient.
**How to avoid:** Always call `requireAdmin(ctx)` as the first line in admin mutations.
**Warning signs:** Mutations that don't import from `./lib/auth`.

### Pitfall 2: Array Index as Key in useFieldArray
**What goes wrong:** Removing middle items causes wrong data to appear in wrong fields.
**Why it happens:** Array indexes shift when items removed; React reconciliation fails.
**How to avoid:** Always use `{fields.map((field, index) => <div key={field.id}>...)}`.
**Warning signs:** `key={index}` in field array mappings.

### Pitfall 3: Stale Search Index
**What goes wrong:** Search doesn't find newly created openings.
**Why it happens:** Fuse index created once on mount, not updated with new data.
**How to avoid:** Include data array in useMemo dependency array or recreate Fuse instance.
**Warning signs:** Search works on page load but misses recent additions.

### Pitfall 4: Empty defaultValues for Append
**What goes wrong:** `append()` adds empty objects, fields show undefined.
**Why it happens:** useFieldArray requires explicit default values for new items.
**How to avoid:** Always call `append({ turn: fields.length + 1, instructions: "" })` with full shape.
**Warning signs:** Validation errors on newly added fields before user types anything.

### Pitfall 5: Slug Collision
**What goes wrong:** Two openings have same slug, getBySlug returns wrong one.
**Why it happens:** No uniqueness validation before insert.
**How to avoid:** Check slug uniqueness in mutation before insert; add compound index.
**Warning signs:** Opening detail pages showing wrong opening.

## Code Examples

Verified patterns from official sources:

### Opening Form Component
```typescript
// app/components/admin/opening-form.tsx
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const openingSchema = z.object({
  spiritId: z.string().min(1),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  turns: z.array(z.object({
    turn: z.number(),
    title: z.string().optional(),
    instructions: z.string().min(1, "Instructions required"),
    notes: z.string().optional(),
  })).min(1),
  author: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.literal("")),
});

type FormData = z.infer<typeof openingSchema>;

interface OpeningFormProps {
  defaultValues?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  spirits: Array<{ _id: string; name: string; aspectName?: string }>;
}

export function OpeningForm({ defaultValues, onSubmit, spirits }: OpeningFormProps) {
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(openingSchema),
    defaultValues: {
      turns: [{ turn: 1, instructions: "" }],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "turns",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Spirit selector */}
      <div>
        <label className="text-sm font-medium">Spirit</label>
        <select {...register("spiritId")} className="w-full border rounded p-2">
          <option value="">Select spirit...</option>
          {spirits.map(s => (
            <option key={s._id} value={s._id}>
              {s.name}{s.aspectName ? ` (${s.aspectName})` : ""}
            </option>
          ))}
        </select>
        {errors.spiritId && <p className="text-red-500 text-sm">{errors.spiritId.message}</p>}
      </div>

      {/* Name and Slug */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input {...register("name")} className="w-full border rounded p-2" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">Slug</label>
          <input {...register("slug")} className="w-full border rounded p-2" placeholder="lowercase-with-hyphens" />
          {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
        </div>
      </div>

      {/* Turns */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Turns</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ turn: fields.length + 1, instructions: "" })}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Turn
          </Button>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="border rounded p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Turn {index + 1}</span>
              {fields.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <input
              {...register(`turns.${index}.title`)}
              className="w-full border rounded p-2"
              placeholder="Turn title (optional)"
            />
            <textarea
              {...register(`turns.${index}.instructions`)}
              className="w-full border rounded p-2 min-h-[100px]"
              placeholder="Instructions for this turn..."
            />
            {errors.turns?.[index]?.instructions && (
              <p className="text-red-500 text-sm">{errors.turns[index]?.instructions?.message}</p>
            )}
            <textarea
              {...register(`turns.${index}.notes`)}
              className="w-full border rounded p-2"
              placeholder="Additional notes (optional)"
            />
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Opening"}
      </Button>
    </form>
  );
}
```

### Convex Mutations
```typescript
// convex/openings.ts - additions to existing file
export const create = mutation({
  args: {
    spiritId: v.id("spirits"),
    slug: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    difficulty: v.optional(v.union(
      v.literal("Beginner"),
      v.literal("Intermediate"),
      v.literal("Advanced"),
    )),
    turns: v.array(v.object({
      turn: v.number(),
      title: v.optional(v.string()),
      instructions: v.string(),
      notes: v.optional(v.string()),
    })),
    author: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    // Check slug uniqueness
    const existing = await ctx.db
      .query("openings")
      .withIndex("by_slug", q => q.eq("slug", args.slug))
      .first();
    if (existing) {
      throw new Error(`Opening with slug "${args.slug}" already exists`);
    }

    return await ctx.db.insert("openings", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("openings"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    difficulty: v.optional(v.union(
      v.literal("Beginner"),
      v.literal("Intermediate"),
      v.literal("Advanced"),
    )),
    turns: v.optional(v.array(v.object({
      turn: v.number(),
      title: v.optional(v.string()),
      instructions: v.string(),
      notes: v.optional(v.string()),
    }))),
    author: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("openings") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
```

### Search Hook
```typescript
// app/hooks/use-search.ts
import Fuse from "fuse.js";
import { useMemo } from "react";
import type { Doc } from "convex/_generated/dataModel";

type Spirit = Doc<"spirits">;
type Opening = Doc<"openings">;

interface SearchResults {
  spirits: Spirit[];
  openings: Array<Opening & { spiritName: string }>;
}

export function useSearch(
  spirits: Spirit[],
  openings: Opening[],
  query: string
): SearchResults {
  // Create spirit name lookup for opening results
  const spiritMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of spirits) {
      map.set(s._id, s.aspectName ? `${s.name} (${s.aspectName})` : s.name);
    }
    return map;
  }, [spirits]);

  return useMemo(() => {
    if (!query.trim()) {
      return { spirits: [], openings: [] };
    }

    const spiritFuse = new Fuse(spirits, {
      keys: [
        { name: "name", weight: 2 },
        { name: "aspectName", weight: 1.5 },
        { name: "summary", weight: 1 },
      ],
      threshold: 0.3,
      includeScore: true,
    });

    const openingFuse = new Fuse(openings, {
      keys: [
        { name: "name", weight: 2 },
        { name: "description", weight: 1 },
      ],
      threshold: 0.3,
      includeScore: true,
    });

    const spiritResults = spiritFuse.search(query).slice(0, 10).map(r => r.item);
    const openingResults = openingFuse.search(query).slice(0, 10).map(r => ({
      ...r.item,
      spiritName: spiritMap.get(r.item.spiritId) || "Unknown Spirit",
    }));

    return { spirits: spiritResults, openings: openingResults };
  }, [spirits, openings, spiritMap, query]);
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Controlled inputs everywhere | react-hook-form uncontrolled | 2020+ | Better performance, less boilerplate |
| Yup validation | Zod validation | 2022+ | Better TypeScript inference, smaller bundle |
| Server-side search always | Client-side for small datasets | 2023+ | Works offline, faster for <1000 items |

**Deprecated/outdated:**
- react-hook-form v6 API: v7 changed `errors` location to `formState.errors`
- Fuse.js v6: v7 improved TypeScript support

## Open Questions

Things that couldn't be fully resolved:

1. **Slug auto-generation from name**
   - What we know: Common UX pattern is to auto-generate slug from name
   - What's unclear: Should this happen client-side or server-side?
   - Recommendation: Client-side auto-generation on name blur, editable by user

2. **Opening preview before save**
   - What we know: Would improve UX to see how opening looks before saving
   - What's unclear: How complex should preview be?
   - Recommendation: Use existing TurnAccordion component for preview

3. **Search results page vs command palette**
   - What we know: Both patterns are valid for global search
   - What's unclear: Which fits mobile-first PWA better?
   - Recommendation: Start with dedicated search page; command palette is v2

## Sources

### Primary (HIGH confidence)
- [Convex Mutations](https://docs.convex.dev/functions/mutation-functions) - mutation patterns, argument validation
- [Convex Best Practices](https://docs.convex.dev/understanding/best-practices/) - security, access control
- [react-hook-form useFieldArray](https://react-hook-form.com/docs/usefieldarray) - dynamic array fields
- [Fuse.js](https://www.fusejs.io/) - client-side fuzzy search API

### Secondary (MEDIUM confidence)
- [shadcn/ui Forms](https://ui.shadcn.com/docs/components/form) - React Hook Form integration
- [Clerk Basic RBAC](https://clerk.com/docs/guides/secure/basic-rbac) - publicMetadata role pattern
- [TanStack Router Auth](https://tanstack.com/router/v1/docs/framework/react/guide/authenticated-routes) - protected routes

### Tertiary (LOW confidence)
- WebSearch results for ecosystem patterns - verified against official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - verified with official docs
- Architecture: HIGH - follows existing project patterns
- Pitfalls: MEDIUM - some from community experience

**Research date:** 2026-01-29
**Valid until:** 2026-02-28 (30 days - stable domain)
