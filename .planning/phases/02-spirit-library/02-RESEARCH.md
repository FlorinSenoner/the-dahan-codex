# Phase 2: Spirit Library - Research

**Researched:** 2026-01-25
**Domain:** React UI Components, Data Modeling, List/Navigation Patterns
**Confidence:** HIGH

## Summary

This phase implements a browsable spirit list with filtering, navigation to detail pages, and attribution. The technical stack centers on **Tailwind CSS v4 + shadcn/ui** for styling, **Convex** for data storage and queries, and **TanStack Router** for navigation with View Transitions.

The standard approach involves setting up Tailwind v4 with shadcn/ui's OKLCH color system for dark mode theming, using the Drawer component (Vaul) for the filter bottom sheet, implementing search params for filter state persistence in URLs, and leveraging View Transitions API for smooth navigation animations between list and detail views.

**Primary recommendation:** Initialize shadcn/ui with Tailwind v4, define a Spirit Island-themed color palette using OKLCH variables, and implement filter state via TanStack Router's validated search params with URL persistence.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tailwindcss | 4.x | Utility-first CSS | Project constraint, CSS-first config in v4 |
| @tailwindcss/vite | 4.x | Vite integration | Required for Tailwind v4 with Vite |
| shadcn/ui | latest | Component library | Copies components into project, full control |
| vaul | 1.x | Drawer/bottom sheet | Powers shadcn/ui Drawer, physics-based gestures |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| class-variance-authority | 0.7.x | Component variants | Managing component style variants |
| clsx | 2.x | Conditional classes | Combining class names conditionally |
| tailwind-merge | 2.x | Class merging | Resolving conflicting Tailwind classes |
| lucide-react | latest | Icons | Consistent icon system |

### Fonts (Google Fonts - Claude's Discretion)
| Font | Weight Range | Purpose | Why Selected |
|------|--------------|---------|--------------|
| Fraunces | 400-700 | Headlines | Organic, expressive serif with botanical feel |
| Lora | 400-700 | Body text | Warm, literary serif excellent for readability |

**Installation:**
```bash
# Tailwind v4 with Vite
pnpm add tailwindcss @tailwindcss/vite

# shadcn/ui initialization
pnpm dlx shadcn@latest init

# Add required components
pnpm dlx shadcn@latest add button drawer badge card
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── routes/
│   ├── spirits.tsx              # Spirit list route
│   ├── spirits.$slug.tsx        # Spirit detail route (dynamic segment)
│   └── credits.tsx              # Attribution page
├── components/
│   ├── ui/                      # shadcn/ui components (auto-generated)
│   ├── spirits/                 # Spirit-specific components
│   │   ├── spirit-list.tsx      # List container with filtering
│   │   ├── spirit-row.tsx       # Individual spirit row
│   │   ├── spirit-filter-sheet.tsx  # Filter bottom sheet
│   │   └── filter-chips.tsx     # Active filter display
│   └── layout/
│       └── bottom-nav.tsx       # Bottom navigation tabs
├── lib/
│   ├── utils.ts                 # cn() helper for class merging
│   └── fonts.ts                 # Font configuration
└── styles/
    └── globals.css              # Tailwind + theme variables

convex/
├── schema.ts                    # Spirit/aspect/expansion schema
├── spirits.ts                   # Spirit queries
└── seed/                        # Seed data files
    ├── spirits.ts               # River + Lightning data
    └── expansions.ts            # Expansion metadata
```

### Pattern 1: Convex Schema with Relationships
**What:** Define spirits table with aspects as separate documents referencing their base spirit
**When to use:** For 1:many relationships (base spirit -> aspects)
**Example:**
```typescript
// Source: Convex schema documentation
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  expansions: defineTable({
    name: v.string(),
    slug: v.string(),
    releaseYear: v.number(),
  }).index("by_slug", ["slug"]),

  spirits: defineTable({
    name: v.string(),
    slug: v.string(),
    complexity: v.union(
      v.literal("Low"),
      v.literal("Moderate"),
      v.literal("High"),
      v.literal("Very High")
    ),
    summary: v.string(),
    imageUrl: v.string(),
    expansionId: v.id("expansions"),
    elements: v.array(v.string()),
    // null for base spirits, populated for aspects
    baseSpirit: v.optional(v.id("spirits")),
    aspectName: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_expansion", ["expansionId"])
    .index("by_base_spirit", ["baseSpirit"])
    .index("by_complexity", ["complexity"]),
});
```

### Pattern 2: Filter State in URL Search Params
**What:** Persist filter state in URL using TanStack Router's validated search params
**When to use:** For shareable/bookmarkable filtered views
**Example:**
```typescript
// Source: TanStack Router search params documentation
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const spiritFilterSchema = z.object({
  expansion: z.array(z.string()).optional().catch([]),
  complexity: z.array(z.string()).optional().catch([]),
  elements: z.array(z.string()).optional().catch([]),
  sort: z.enum(["alpha", "complexity"]).optional().catch("alpha"),
});

export const Route = createFileRoute("/spirits")({
  validateSearch: spiritFilterSchema,
  component: SpiritListPage,
});

function SpiritListPage() {
  const filters = Route.useSearch();
  const navigate = Route.useNavigate();

  const updateFilter = (key: string, value: string[]) => {
    navigate({
      search: (prev) => ({ ...prev, [key]: value }),
      replace: true, // Don't add to history
    });
  };
  // ...
}
```

### Pattern 3: View Transitions for Navigation
**What:** Enable View Transitions API for smooth element transitions between routes
**When to use:** For connecting visual elements across page transitions
**Example:**
```typescript
// Source: TanStack Router ViewTransitionOptions documentation
// In router.tsx
export function createRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultViewTransition: true, // Enable globally
  });
}

// In spirit-row.tsx - apply view-transition-name
<Link
  to="/spirits/$slug"
  params={{ slug: spirit.slug }}
  viewTransition
>
  <img
    src={spirit.imageUrl}
    style={{ viewTransitionName: `spirit-image-${spirit.slug}` }}
  />
  <span style={{ viewTransitionName: `spirit-name-${spirit.slug}` }}>
    {spirit.name}
  </span>
</Link>

// In CSS - define transitions
::view-transition-old(spirit-image-*),
::view-transition-new(spirit-image-*) {
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}
```

### Pattern 4: Tailwind v4 Dark Mode Theming
**What:** Define Spirit Island-themed colors using OKLCH and CSS variables
**When to use:** For establishing the visual design system
**Example:**
```css
/* Source: shadcn/ui theming + Tailwind v4 docs */
@import "tailwindcss";

@layer base {
  :root {
    /* Light mode - not used as default but defined for completeness */
    --background: oklch(0.98 0.01 90);
    --foreground: oklch(0.20 0.02 90);
    --primary: oklch(0.45 0.12 145); /* Forest green */
  }

  .dark {
    /* Dark mode - Spirit Island night forest theme */
    --background: oklch(0.15 0.02 90);      /* Deep earth */
    --foreground: oklch(0.92 0.01 90);      /* Warm white */
    --primary: oklch(0.55 0.14 145);        /* Moss green */
    --secondary: oklch(0.35 0.08 60);       /* Bark brown */
    --accent: oklch(0.60 0.15 30);          /* Ember orange */
    --muted: oklch(0.25 0.02 90);           /* Shadowed earth */
    --border: oklch(0.30 0.03 90);          /* Twilight edge */
    --card: oklch(0.18 0.02 85);            /* Deeper earth */

    /* Element colors (muted versions of official) */
    --element-sun: oklch(0.70 0.15 80);
    --element-moon: oklch(0.60 0.10 280);
    --element-fire: oklch(0.60 0.18 25);
    --element-air: oklch(0.75 0.08 220);
    --element-water: oklch(0.55 0.12 240);
    --element-earth: oklch(0.50 0.10 60);
    --element-plant: oklch(0.55 0.14 140);
    --element-animal: oklch(0.55 0.12 50);
  }
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-accent: var(--accent);
  --color-muted: var(--muted);
  --color-border: var(--border);
  --color-card: var(--card);
}
```

### Anti-Patterns to Avoid
- **Filtering in Convex `.filter()`**: Use `.withIndex()` for any filter over 1000+ documents
- **Storing filter state in React state only**: Loses state on refresh, not shareable
- **Custom bottom sheet implementation**: Use Vaul/Drawer - gesture physics are hard
- **Inline styles for view-transition-name**: Use CSS classes for maintainability
- **RGB/HSL colors with Tailwind v4**: OKLCH provides better color perception

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bottom sheet with swipe gestures | Custom touch handlers | Vaul (via shadcn Drawer) | Physics-based spring animations, snap points, accessibility |
| Class name merging | String concatenation | `cn()` with clsx + tailwind-merge | Handles Tailwind class conflicts correctly |
| Dark mode toggle | localStorage + useEffect | `class` strategy with html.dark | shadcn/ui convention, SSR-safe |
| Filter URL encoding | JSON.stringify in URL | TanStack Router search params | Type-safe, validated, auto-serialized |
| List virtualization | Custom windowing | Not needed for <100 spirits | Premature optimization |

**Key insight:** shadcn/ui + Tailwind v4 + TanStack Router provide a cohesive system. Fighting the conventions costs more than following them.

## Common Pitfalls

### Pitfall 1: Hydration Mismatch with Dark Mode
**What goes wrong:** Server renders light, client hydrates dark, causing flash
**Why it happens:** Dark mode class applied after hydration
**How to avoid:** Add `class="dark"` to `<html>` in server render or use blocking script
**Warning signs:** Flash of light theme on page load

### Pitfall 2: View Transitions Not Working
**What goes wrong:** No animation between pages despite configuration
**Why it happens:** Browser doesn't support View Transitions API, or `view-transition-name` not matching
**How to avoid:** Check browser support, ensure same `view-transition-name` on both pages
**Warning signs:** Instant page switch with no animation

### Pitfall 3: Filter State Lost on Navigation
**What goes wrong:** Clicking spirit resets filter state
**Why it happens:** Not preserving search params in Link components
**How to avoid:** Use `search: (prev) => prev` or explicitly pass current search
**Warning signs:** Filters reset when navigating back from detail page

### Pitfall 4: Drawer Closes Unexpectedly on Mobile
**What goes wrong:** Scrolling inside drawer closes it
**Why it happens:** Touch events propagating to drawer drag handler
**How to avoid:** Use Vaul's `[data-vaul-no-drag]` attribute on scrollable content
**Warning signs:** Can't scroll filter options without drawer closing

### Pitfall 5: Convex Query Returns Undefined Forever
**What goes wrong:** `useQuery` never resolves, UI stuck loading
**Why it happens:** Query function errors silently, or missing index
**How to avoid:** Check Convex dashboard for errors, ensure indexes exist
**Warning signs:** Loading state never resolves, no network errors

### Pitfall 6: Aspect Indentation Breaking Layout
**What goes wrong:** Aspects don't visually indent under base spirit
**Why it happens:** CSS not accounting for indentation in list layout
**How to avoid:** Use consistent left padding/margin system, test with aspects
**Warning signs:** Aspects appear at same level as base spirits

## Code Examples

Verified patterns from official sources:

### Drawer Component for Filters
```typescript
// Source: shadcn/ui Drawer documentation
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export function FilterSheet({
  filters,
  onFilterChange,
  activeCount,
}: FilterSheetProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Filter className="h-4 w-4" />
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs">
              {activeCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Filter Spirits</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-8 overflow-y-auto" data-vaul-no-drag>
          {/* Filter options here */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
```

### Convex Spirit Query with Filtering
```typescript
// Source: Convex reading data documentation
import { query } from "./_generated/server";
import { v } from "convex/values";

export const listSpirits = query({
  args: {
    complexity: v.optional(v.array(v.string())),
    expansionSlug: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    let spirits = await ctx.db.query("spirits").collect();

    // Filter in code for small datasets (<100 spirits)
    if (args.complexity?.length) {
      spirits = spirits.filter((s) =>
        args.complexity!.includes(s.complexity)
      );
    }

    // Sort alphabetically by default
    spirits.sort((a, b) => a.name.localeCompare(b.name));

    // Group: base spirits first, then aspects indented under them
    const baseSpirits = spirits.filter((s) => !s.baseSpirit);
    const aspectsByBase = new Map<string, typeof spirits>();

    for (const spirit of spirits.filter((s) => s.baseSpirit)) {
      const base = spirit.baseSpirit!.toString();
      if (!aspectsByBase.has(base)) aspectsByBase.set(base, []);
      aspectsByBase.get(base)!.push(spirit);
    }

    const result: typeof spirits = [];
    for (const base of baseSpirits) {
      result.push(base);
      const aspects = aspectsByBase.get(base._id.toString()) || [];
      result.push(...aspects);
    }

    return result;
  },
});
```

### Spirit Row Component
```typescript
// Example implementation following patterns
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SpiritRowProps {
  spirit: Spirit;
  isAspect: boolean;
}

export function SpiritRow({ spirit, isAspect }: SpiritRowProps) {
  const slug = spirit.slug;
  const aspectParam = spirit.aspectName
    ? `?aspect=${spirit.aspectName.toLowerCase()}`
    : "";

  return (
    <Link
      to={`/spirits/${slug}${aspectParam}`}
      className={cn(
        "flex items-center gap-4 p-4 border-b border-border",
        "active:bg-muted/50 transition-colors duration-150",
        isAspect && "pl-8" // Indent aspects
      )}
      viewTransition
    >
      <img
        src={spirit.imageUrl}
        alt={spirit.name}
        className="w-[120px] h-[120px] object-cover rounded-lg"
        style={{ viewTransitionName: `spirit-image-${slug}` }}
      />
      <div className="flex-1 min-w-0">
        <h3
          className="font-serif text-lg font-semibold truncate"
          style={{ viewTransitionName: `spirit-name-${slug}` }}
        >
          {spirit.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {spirit.summary}
        </p>
        <Badge variant="secondary" className="mt-2">
          {spirit.complexity}
        </Badge>
      </div>
    </Link>
  );
}
```

### Playwright E2E Test for Spirit List
```typescript
// Source: Playwright best practices
import { expect, test } from "@playwright/test";

test.describe("Spirit Library", () => {
  test("spirit list renders", async ({ page }) => {
    await page.goto("/spirits");

    // Wait for spirits to load
    await expect(
      page.getByRole("heading", { name: /spirits/i })
    ).toBeVisible();

    // Verify at least one spirit row exists
    await expect(
      page.getByRole("link", { name: /river surges in sunlight/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("filter button opens bottom sheet", async ({ page }) => {
    await page.goto("/spirits");

    // Click filter button
    await page.getByRole("button", { name: /filter/i }).click();

    // Verify drawer opens
    await expect(
      page.getByRole("heading", { name: /filter spirits/i })
    ).toBeVisible();
  });

  test("clicking spirit navigates to detail", async ({ page }) => {
    await page.goto("/spirits");

    await page
      .getByRole("link", { name: /river surges in sunlight/i })
      .click();

    await expect(page).toHaveURL(/\/spirits\/river-surges-in-sunlight/);
  });
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind config.js | CSS @theme directive | Tailwind v4 (2024) | Simpler config, CSS-native |
| HSL colors | OKLCH colors | Tailwind v4 / shadcn 2024 | Better color perception |
| Manual dark mode toggle | CSS media query + class | Ongoing | Simpler, respects system |
| Custom drawer components | Vaul library | 2023-2024 | Physics-based, accessible |
| Prop-based view transitions | CSS view-transition-name | Chrome 111+ (2023) | Native browser API |

**Deprecated/outdated:**
- **tailwind.config.js**: Still works but @theme in CSS is preferred for v4
- **HSL color format**: OKLCH provides perceptually uniform color scaling
- **React Router v5 style routing**: TanStack Router provides better type safety

## Open Questions

Things that couldn't be fully resolved:

1. **View Transitions API Browser Support**
   - What we know: Chrome 111+, Edge 111+, Safari 18+ support it
   - What's unclear: Exact fallback behavior in older browsers
   - Recommendation: Use `defaultViewTransition: true`, it gracefully degrades

2. **Spirit Image Assets**
   - What we know: Official panel art should be used per PROJECT.md
   - What's unclear: Where images will be stored (public folder? CDN?)
   - Recommendation: Start with `/public/spirits/` folder, migrate if needed

3. **Exact OKLCH Color Values**
   - What we know: Use muted versions of official SI element colors
   - What's unclear: Exact official Spirit Island color codes
   - Recommendation: Design iteration during implementation

## Sources

### Primary (HIGH confidence)
- [shadcn/ui Installation - Vite](https://ui.shadcn.com/docs/installation/vite) - Setup steps verified
- [shadcn/ui Drawer](https://ui.shadcn.com/docs/components/drawer) - Vaul-based component API
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming) - CSS variable conventions
- [Convex Reading Data](https://docs.convex.dev/database/reading-data/) - Query patterns
- [Convex Schemas](https://docs.convex.dev/database/schemas) - Schema definition
- [Convex Relationship Structures](https://stack.convex.dev/relationship-structures-let-s-talk-about-schemas) - 1:many patterns
- [Playwright Best Practices](https://playwright.dev/docs/best-practices) - Testing patterns

### Secondary (MEDIUM confidence)
- [TanStack Router View Transitions](https://tanstack.com/router/latest/docs/framework/react/examples/view-transitions) - Example exists but full docs had 303 redirects
- [TanStack Router Search Params](https://tanstack.com/router/v1/docs/framework/react/guide/search-params) - WebSearch + docs navigation verified
- [Tailwind v4 Theming](https://medium.com/@kevstrosky/theme-colors-with-tailwind-css-v4-0-and-next-themes-dark-light-custom-mode-36dca1e20419) - Community verified patterns
- [Vaul GitHub](https://github.com/emilkowalski/vaul) - Drawer library source

### Tertiary (LOW confidence)
- [Spirit Island Wiki - Spirits List](https://spiritislandwiki.com/index.php?title=List_of_Spirits) - Data structure reference
- [Google Fonts for Botanical Design](https://muz.li/blog/best-free-google-fonts-for-2026/) - Font recommendations

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official documentation verified via WebFetch
- Architecture: HIGH - Convex patterns from official docs, shadcn/ui from source
- Pitfalls: MEDIUM - Mix of official docs and community experience
- View Transitions: MEDIUM - TanStack docs had redirect issues, verified via GitHub examples

**Research date:** 2026-01-25
**Valid until:** 2026-02-25 (30 days - stable ecosystem)
