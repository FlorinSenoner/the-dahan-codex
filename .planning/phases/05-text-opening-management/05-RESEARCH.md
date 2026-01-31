# Phase 5: Text Opening Management - Research

**Researched:** 2026-01-29
**Domain:** Admin CRUD, Inline Editing, Client-side Search, Role-based Access Control
**Confidence:** HIGH

## Summary

Phase 5 implements admin tools for creating and managing text-based spirit openings. The implementation uses the existing Convex backend with new mutations protected by admin role checks, inline editing on the existing spirit detail pages (no separate admin area), and client-side search filtering on the spirits list.

The key architectural decision is "edit mode as a lens" -- admins see the same pages as regular users, but with a floating edit button that transforms the view into an editable interface. This avoids route duplication and keeps the admin experience integrated with the public experience.

The tech stack is already established: Convex for backend mutations with `requireAdmin()` helper, Clerk for admin role via `user.public_metadata.isAdmin` JWT claim, TanStack Router for URL state (`?edit=true`), and existing Radix/shadcn components for UI. No new libraries are required except potentially `react-hotkeys-hook` for keyboard shortcuts.

**Primary recommendation:** Implement inline edit mode with URL state, floating toggle button, and Convex mutations protected by `requireAdmin()`. Use `useDeferredValue` for search debouncing. Keep schema changes minimal (remove `difficulty` field, add timestamps).

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Convex | 1.31.6 | Backend mutations with auth | Already in use, provides `mutation()` with `ctx.auth` |
| @clerk/clerk-react | 5.33.2 | Admin role access | Already configured, JWT template set up |
| @tanstack/react-router | 1.157.9 | URL state for edit mode | Already in use, supports search params |
| @radix-ui/react-accordion | 1.2.12 | Turn accordion (existing) | Already used in TurnAccordion component |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-hotkeys-hook | 4.5.x | Keyboard shortcuts (Ctrl+E, Ctrl+S) | Optional enhancement for power users |
| lucide-react | 0.563.0 | Icons (Edit, Save, Plus, Trash) | Already in use throughout app |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-hotkeys-hook | Native keydown event | Hook provides cleaner API, prevents defaults |
| useDeferredValue | debounce from lodash | useDeferredValue is React-native, no dep needed |
| Native confirm() | Radix Dialog | Native is simpler, matches browser UX for unsaved changes |

**Installation:**
```bash
pnpm add react-hotkeys-hook
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── components/
│   ├── admin/
│   │   ├── edit-mode-provider.tsx   # Context for edit mode state
│   │   ├── edit-fab.tsx             # Floating edit toggle button
│   │   └── editable-opening.tsx     # Inline opening editor
│   └── spirits/
│       ├── opening-section.tsx      # Updated: conditional edit UI
│       └── turn-accordion.tsx       # Updated: editable turns
├── hooks/
│   └── use-admin.ts                 # Hook to check admin status
├── routes/
│   └── spirits.index.tsx            # Updated: search bar
convex/
├── openings.ts                      # Updated: add mutations
└── lib/
    └── auth.ts                      # Existing: requireAdmin()
```

### Pattern 1: Edit Mode via URL State
**What:** Persist edit mode in URL with `?edit=true` search param
**When to use:** When edit state should survive page refresh and be shareable (for debugging)
**Example:**
```typescript
// Source: TanStack Router documentation
import { useSearch, useNavigate } from '@tanstack/react-router'

function useEditMode() {
  const { edit } = useSearch({ from: '/spirits/$slug' })
  const navigate = useNavigate()
  const isAdmin = useAdmin()

  // Only activate edit mode if user is admin
  const isEditing = isAdmin && edit === true

  const toggleEdit = () => {
    navigate({
      search: (prev) => ({ ...prev, edit: !prev.edit }),
      replace: true,
    })
  }

  return { isEditing, toggleEdit }
}
```

### Pattern 2: Convex Admin Mutations
**What:** Mutations protected by `requireAdmin()` helper
**When to use:** All data-modifying operations
**Example:**
```typescript
// Source: Existing convex/lib/auth.ts pattern
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/auth";

export const createOpening = mutation({
  args: {
    spiritId: v.id("spirits"),
    name: v.string(),
    description: v.optional(v.string()),
    turns: v.array(v.object({
      turn: v.number(),
      title: v.string(),
      instructions: v.string(),
      notes: v.optional(v.string()),
    })),
    author: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx); // Throws if not admin

    const slug = generateSlug(args.name);
    return await ctx.db.insert("openings", {
      ...args,
      slug,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
```

### Pattern 3: Inline Editable Content
**What:** Text content transforms to textarea in edit mode
**When to use:** For opening name, description, turn content
**Example:**
```typescript
// Source: React inline editing patterns
interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  multiline?: boolean;
  placeholder?: string;
}

function EditableText({ value, onChange, isEditing, multiline, placeholder }: EditableTextProps) {
  if (!isEditing) {
    return <span className="text-foreground">{value || placeholder}</span>;
  }

  const className = cn(
    "w-full bg-muted/30 border border-primary/30 rounded px-2 py-1",
    "focus:border-primary focus:ring-1 focus:ring-primary/50"
  );

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(className, "min-h-[100px] resize-y")}
        placeholder={placeholder}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      placeholder={placeholder}
    />
  );
}
```

### Pattern 4: Client-side Search with useDeferredValue
**What:** Instant filter-as-you-type with React 19 concurrent features
**When to use:** For spirits list search (small dataset, in-memory)
**Example:**
```typescript
// Source: React 19 useDeferredValue documentation
import { useDeferredValue, useMemo } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';

function SpiritsSearch() {
  const { search } = useSearch({ from: '/spirits/' });
  const navigate = useNavigate();
  const deferredSearch = useDeferredValue(search || '');

  // Filter spirits based on deferred search value
  const filteredSpirits = useMemo(() => {
    if (!deferredSearch) return spirits;
    const lower = deferredSearch.toLowerCase();
    return spirits.filter(s =>
      s.name.toLowerCase().includes(lower) ||
      s.summary?.toLowerCase().includes(lower)
    );
  }, [spirits, deferredSearch]);

  return (
    <input
      type="search"
      value={search || ''}
      onChange={(e) => navigate({
        search: (prev) => ({ ...prev, search: e.target.value || undefined }),
        replace: true,
      })}
      placeholder="Search spirits..."
      className="w-full px-3 py-2 rounded-lg border bg-background"
    />
  );
}
```

### Anti-Patterns to Avoid
- **Separate admin routes:** Don't create `/admin/spirits/:slug` -- use edit mode on existing routes
- **Storing edit state in React state only:** Use URL params for persistence and debugging
- **Optimistic updates without rollback:** Always handle mutation errors with proper UI feedback
- **Trusting client-side admin check:** Always verify admin status in Convex mutations

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Debounced search | Custom debounce timer | `useDeferredValue` | React-native, no cleanup needed |
| Keyboard shortcuts | `addEventListener('keydown')` | `react-hotkeys-hook` | Handles modifiers, scopes, cleanup |
| Unsaved changes warning | Custom beforeunload | TanStack Router `useBlocker` | Framework-integrated, handles SPA navigation |
| Confirmation dialogs | Custom modal | Browser `confirm()` | Simpler, consistent with platform |
| Slug generation | Manual string manipulation | Simple helper function | Minimal code, testable |

**Key insight:** For this phase, the complexity is in the edit mode state management and mutations, not in specialized libraries. Keep the UI simple with native browser patterns where possible.

## Common Pitfalls

### Pitfall 1: Edit UI Visible to Non-Admins
**What goes wrong:** Floating edit button or inline edit controls appear for regular users
**Why it happens:** Client-side check forgotten or race condition with auth loading
**How to avoid:**
1. Create `useAdmin()` hook that checks both auth loaded AND admin claim
2. Return `null` from edit components if not admin
3. Never assume loading state means non-admin
**Warning signs:** Flash of edit UI before disappearing on page load

### Pitfall 2: Missing Backend Permission Check
**What goes wrong:** Mutation succeeds even for non-admin users
**Why it happens:** Frontend-only check, backend mutation missing `requireAdmin()`
**How to avoid:**
1. ALWAYS call `requireAdmin(ctx)` at start of every admin mutation
2. Add E2E test that verifies non-admin mutation rejection
3. Use existing `convex/lib/auth.ts` helper consistently
**Warning signs:** Data changes work in dev but shouldn't in production

### Pitfall 3: Lost Changes on Navigation
**What goes wrong:** User navigates away with unsaved edits, data lost
**Why it happens:** No navigation blocking or beforeunload handler
**How to avoid:**
1. Track dirty state in component
2. Use TanStack Router's `useBlocker` with `enableBeforeUnload: true`
3. Show confirmation when leaving with unsaved changes
**Warning signs:** Users report losing work after editing

### Pitfall 4: Schema Migration Issues
**What goes wrong:** Removing `difficulty` field breaks existing data
**Why it happens:** Field removed from schema but old documents still have it
**How to avoid:**
1. Make field optional before removal: `difficulty: v.optional(...)`
2. Run migration to remove field from existing documents
3. Then remove from schema entirely
**Warning signs:** Convex type errors after schema change

### Pitfall 5: Edit Mode Persists Across Spirits
**What goes wrong:** Editing River, navigate to Lightning, still in edit mode
**Why it happens:** URL search param persists across route changes
**How to avoid:** This is actually the intended behavior per CONTEXT.md decisions
**Warning signs:** None - this is the correct behavior

## Code Examples

Verified patterns from official sources and existing codebase:

### Admin Check Hook
```typescript
// Source: Existing Clerk integration pattern
import { useUser } from '@clerk/clerk-react';

export function useAdmin(): boolean {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) return false;

  // Admin claim from Clerk JWT template
  return user.publicMetadata?.isAdmin === true;
}
```

### Floating Action Button
```typescript
// Source: Material UI FAB patterns + existing button.tsx
import { Pencil, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditFabProps {
  isEditing: boolean;
  onToggle: () => void;
  onSave?: () => void;
  hasChanges?: boolean;
}

export function EditFab({ isEditing, onToggle, onSave, hasChanges }: EditFabProps) {
  return (
    <div className="fixed bottom-20 right-4 z-50 flex gap-2">
      {isEditing && hasChanges && (
        <Button
          onClick={onSave}
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
        >
          <Check className="h-6 w-6" />
        </Button>
      )}
      <Button
        onClick={onToggle}
        variant={isEditing ? "secondary" : "default"}
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg"
      >
        <Pencil className="h-6 w-6" />
      </Button>
    </div>
  );
}
```

### Navigation Blocking
```typescript
// Source: TanStack Router useBlocker documentation
import { useBlocker } from '@tanstack/react-router';

function useUnsavedChanges(hasChanges: boolean) {
  useBlocker({
    shouldBlockFn: () => {
      if (!hasChanges) return false;
      return !confirm('You have unsaved changes. Are you sure you want to leave?');
    },
    enableBeforeUnload: hasChanges,
  });
}
```

### Convex Update Mutation
```typescript
// Source: Convex mutation patterns
export const updateOpening = mutation({
  args: {
    id: v.id("openings"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    turns: v.optional(v.array(v.object({
      turn: v.number(),
      title: v.string(),
      instructions: v.string(),
      notes: v.optional(v.string()),
    }))),
    author: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Opening not found");

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate admin routes | Inline edit mode on public routes | 2024+ | Simpler architecture, less duplication |
| lodash debounce | useDeferredValue | React 18+ | No external dependency, better concurrent behavior |
| Custom auth middleware | Framework auth helpers | 2023+ | Use Convex's built-in auth context |
| Complex form libraries | Simple controlled inputs + mutation | Always valid for CRUD | Less overhead for simple forms |

**Deprecated/outdated:**
- `useBlocker` was unstable until TanStack Router v1.40+ (now stable)
- Clerk v4 session claims syntax differs from v5 (project uses v5)

## Open Questions

Things that couldn't be fully resolved:

1. **Keyboard shortcut library decision**
   - What we know: `react-hotkeys-hook` is well-maintained, 4.5k stars
   - What's unclear: Whether native keydown handler would suffice
   - Recommendation: Start with native, add library only if needed

2. **Edit mode visual treatment**
   - What we know: CONTEXT.md says "subtle border/highlight"
   - What's unclear: Exact styling (border color, thickness, background)
   - Recommendation: Claude's discretion per CONTEXT.md - use `ring-1 ring-primary/30`

3. **Timestamps schema migration**
   - What we know: Need to add `createdAt`, `updatedAt` to openings
   - What's unclear: Whether to backfill existing data or leave null
   - Recommendation: Make optional, backfill with current timestamp on first edit

## Sources

### Primary (HIGH confidence)
- Convex `mutation()` API - verified against existing `convex/seed.ts` patterns
- Convex `requireAdmin()` - verified in `convex/lib/auth.ts`
- TanStack Router search params - verified against existing route implementations
- Clerk `publicMetadata` - verified in existing auth setup

### Secondary (MEDIUM confidence)
- [Convex Mutations Documentation](https://docs.convex.dev/functions/mutation-functions) - official docs
- [Clerk RBAC with Metadata](https://clerk.com/docs/guides/secure/basic-rbac) - official guide
- [TanStack Router Navigation Blocking](https://tanstack.com/router/v1/docs/framework/react/guide/navigation-blocking) - official docs
- [React useDeferredValue](https://react.dev/reference/react/useDeferredValue) - official React docs

### Tertiary (LOW confidence)
- [react-hotkeys-hook](https://github.com/JohannesKlauss/react-hotkeys-hook) - popular library, may not be needed

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries already in use
- Architecture: HIGH - follows existing patterns in codebase
- Pitfalls: HIGH - based on common patterns and codebase analysis

**Research date:** 2026-01-29
**Valid until:** 2026-02-28 (30 days - stable domain, established patterns)
