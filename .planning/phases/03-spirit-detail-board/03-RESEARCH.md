# Phase 3: Spirit Detail & Board - Research

**Researched:** 2026-01-26
**Domain:** Spirit detail UI, radar charts, collapsible sections, presence track visualization
**Confidence:** HIGH

## Summary

Phase 3 requires building out the spirit detail page with a variant selector, radar chart for power ratings, collapsible sections for board visualization, and external resource links. The research confirms that the existing shadcn/ui ecosystem combined with Recharts provides all necessary building blocks.

The key technical challenges are: (1) rendering a radar chart that works well on mobile with the existing dark theme, (2) building horizontal scrollable tabs for variant selection, (3) building presence track visualizations that clearly communicate slot rewards, and (4) handling external links appropriately in the PWA context. The codebase already has established patterns for styling (oklch colors, Tailwind CSS v4, shadcn/ui components) that should be extended.

**Primary recommendation:** Use Recharts for the radar chart (lightweight, React-native, works with shadcn/ui chart patterns), add shadcn/ui Tabs + ScrollArea + Accordion + Collapsible + Tooltip + Dialog components, and build presence tracks as CSS Grid-based slot components with custom tooltips for touch devices.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| recharts | 2.x/3.x | Radar chart for power ratings | React-native, composable, works with shadcn/ui ChartContainer |
| @radix-ui/react-tabs | 1.2.x | Variant selector tabs | Powers shadcn/ui Tabs, accessible, keyboard navigable |
| @radix-ui/react-scroll-area | 1.2.x | Horizontal scrolling for tabs | Native-like scrolling with custom styling, touch support |
| @radix-ui/react-accordion | 1.2.x | Innate powers collapsed display | Powers shadcn/ui Accordion, WAI-ARIA compliant |
| @radix-ui/react-collapsible | 1.1.x | Special rules section | Powers shadcn/ui Collapsible, controlled/uncontrolled |
| @radix-ui/react-tooltip | 1.2.x | Presence slot tooltips | Powers shadcn/ui Tooltip, hover + focus support |
| @radix-ui/react-dialog | 1.1.x | Card preview modals | Focus trapping, accessible modal pattern |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | 0.563.x | Icons for growth actions, elements | Already installed, use for iconography |
| class-variance-authority | 0.7.1 | Component variants | Already installed, use for slot state variants |
| vaul | 1.1.x | Mobile-friendly drawer | Already installed, use for card preview on mobile |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Recharts | Chart.js + react-chartjs-2 | Canvas-based (better perf), but less React-native; harder to style with Tailwind |
| Recharts | Victory | More opinionated, heavier bundle |
| Recharts | D3 directly | Full control but significant complexity |
| Native scroll for tabs | react-tabs-scrollable | Native CSS scroll + ScrollArea is simpler, no extra dep |
| Radix Dialog | vaul Drawer | Drawer better for mobile card preview, Dialog for desktop |

**Installation:**
```bash
pnpm add recharts
pnpm dlx shadcn@latest add tabs scroll-area accordion collapsible tooltip dialog chart
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── routes/
│   ├── spirits.$slug.tsx         # Layout with variant tabs (refactored)
│   └── spirits.$slug.$aspect.tsx # Merged into parent with shared content
├── components/
│   └── spirits/
│       ├── variant-tabs.tsx      # Horizontal scrollable tab selector
│       ├── overview-section.tsx  # Radar chart + complexity + elements
│       ├── power-radar-chart.tsx # Recharts radar with theming
│       ├── growth-panel.tsx      # Growth option cards
│       ├── presence-track.tsx    # Presence slot grid/diagram
│       ├── presence-slot.tsx     # Individual slot with tooltip
│       ├── innate-powers.tsx     # Accordion of innate power cards
│       ├── special-rules.tsx     # Collapsible special rules
│       ├── card-hand.tsx         # Row of power cards
│       ├── card-preview.tsx      # Modal/drawer for full card view
│       └── external-links.tsx    # Wiki/FAQ/SICK links
└── lib/
    └── spirit-colors.ts          # Extend with radar chart colors
```

### Pattern 1: Scrollable Variant Tabs with URL Sync
**What:** Horizontal tabs with scroll support that sync with URL path parameters
**When to use:** Variant selector where each tab has a unique URL
**Example:**
```typescript
// Source: shadcn/ui Tabs + ScrollArea + TanStack Router
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useNavigate, useParams } from "@tanstack/react-router";

function VariantTabs({ baseSpirit, aspects }) {
  const { slug, aspect } = useParams({ strict: false });
  const navigate = useNavigate();
  const currentValue = aspect || "base";

  return (
    <Tabs
      value={currentValue}
      onValueChange={(value) => {
        const path = value === "base"
          ? `/spirits/${slug}`
          : `/spirits/${slug}/${value}`;
        navigate({ to: path });
      }}
      className="w-full"
    >
      <div className="sticky top-[57px] z-10 bg-background/95 backdrop-blur border-b">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="inline-flex w-max h-auto p-1">
            <TabsTrigger value="base" className="shrink-0">
              {baseSpirit.name}
            </TabsTrigger>
            {aspects.map((a) => (
              <TabsTrigger
                key={a.aspectName}
                value={a.aspectName.toLowerCase()}
                className="shrink-0"
              >
                {a.aspectName}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </Tabs>
  );
}
```

### Pattern 2: Responsive Radar Chart with Theme Integration
**What:** Radar chart that uses CSS variables for colors and works on mobile
**When to use:** Power ratings display (Offense, Defense, Control, Fear, Utility)
**Example:**
```typescript
// Source: Recharts + shadcn/ui chart patterns
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

const POWER_AXES = ["Offense", "Defense", "Control", "Fear", "Utility"];

function PowerRadarChart({ ratings }) {
  const data = POWER_AXES.map((axis) => ({
    axis,
    value: ratings[axis.toLowerCase()],
    fullMark: 5, // 1-5 scale
  }));

  return (
    <div className="min-h-[250px] w-full">
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="80%">
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={false}
            axisLine={false}
          />
          <Radar
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### Pattern 3: Presence Track as CSS Grid with Tooltips
**What:** Grid of slots representing presence track positions with touch-friendly tooltips
**When to use:** Displaying energy/card play tracks with grant information
**Example:**
```typescript
// Source: shadcn/ui Tooltip + custom grid component
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function PresenceTrack({ track, type }) {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-7 gap-1 p-2 bg-muted/30 rounded-lg">
        {track.slots.map((slot, index) => (
          <PresenceSlot
            key={index}
            slot={slot}
            revealed={index < track.revealedCount}
            type={type}
          />
        ))}
      </div>
    </TooltipProvider>
  );
}

function PresenceSlot({ slot, revealed, type }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            "w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors",
            revealed
              ? "bg-background border-primary text-foreground"
              : "bg-muted border-border text-muted-foreground"
          )}
        >
          {slot.value}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{slot.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
```

### Pattern 4: Collapsible Sections with Default State
**What:** Sections that start collapsed but can be expanded
**When to use:** Innate powers, special rules (reference material)
**Example:**
```typescript
// Source: shadcn/ui Accordion
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function InnatePowers({ innates }) {
  return (
    <Accordion type="multiple" className="w-full">
      {innates.map((innate, index) => (
        <AccordionItem key={innate.name} value={`innate-${index}`}>
          <AccordionTrigger className="text-left">
            <div className="flex items-center gap-2">
              <span>{innate.name}</span>
              <span className="text-muted-foreground text-sm">
                ({innate.speed})
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {innate.thresholds.map((threshold, i) => (
              <div key={i} className="mb-2 p-2 bg-muted/30 rounded">
                <div className="flex gap-1 mb-1">
                  {threshold.elements.map((el) => (
                    <ElementIcon key={el} element={el} />
                  ))}
                </div>
                <p className="text-sm">{threshold.effect}</p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
```

### Pattern 5: Card Preview Modal with External Link
**What:** Tappable card that opens full-size preview in modal with link to SICK
**When to use:** Card hand section for power card details
**Example:**
```typescript
// Source: shadcn/ui Dialog + Radix patterns
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";

function CardPreview({ card }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="rounded-lg overflow-hidden border hover:ring-2 hover:ring-primary transition-shadow">
          <img
            src={card.thumbnailUrl || "/cards/placeholder.png"}
            alt={card.name}
            className="w-24 h-36 object-cover"
          />
          <span className="sr-only">View {card.name}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <img
          src={card.fullImageUrl}
          alt={card.name}
          className="w-full h-auto"
        />
        {card.sickUrl && (
          <a
            href={card.sickUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 text-sm text-primary hover:underline border-t"
          >
            View on SICK
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

### Anti-Patterns to Avoid
- **Inline chart dimensions:** Always use ResponsiveContainer; never hardcode width/height on RadarChart itself
- **Hover-only tooltips:** Touch devices need tap/click support; use Radix Tooltip which handles this
- **Nested scroll containers:** Don't put ScrollArea inside another scrollable container - causes touch confusion
- **Uncontrolled tabs with URL sync:** Always use controlled `value` prop with URL params as source of truth
- **Separate routes for each variant:** Use a single route with tabs; derive content from URL params
- **Canvas-based charts without fallback:** Recharts SVG renders better across devices

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Radar/spider chart | Custom SVG paths | Recharts RadarChart | Handles polar coordinates, scaling, responsive sizing |
| Scrollable tabs | Custom overflow detection | shadcn/ui Tabs + ScrollArea | Touch handling, scroll snap, scrollbar styling |
| Accessible tabs | div + onClick handlers | shadcn/ui Tabs (Radix) | WAI-ARIA, keyboard navigation, focus management |
| Collapsible sections | CSS max-height animation | shadcn/ui Collapsible/Accordion | Handles animation, accessibility, controlled state |
| Tooltips for touch | title attribute | shadcn/ui Tooltip (Radix) | Cross-device support, positioning, keyboard accessible |
| Modal with focus trap | Custom portal | shadcn/ui Dialog (Radix) | Escape handling, screen reader, focus management |
| Responsive chart container | window.innerWidth listener | Recharts ResponsiveContainer | ResizeObserver, handles SSR, proper cleanup |
| External link detection | Regex URL matching | `target="_blank"` + proper attrs | Security, PWA behavior |

**Key insight:** The combination of shadcn/ui components (built on Radix primitives) and Recharts covers all UI patterns needed for this phase. Custom solutions would require reimplementing accessibility, animation, and responsive behavior that these libraries handle correctly.

## Common Pitfalls

### Pitfall 1: ResponsiveContainer Not Rendering
**What goes wrong:** Chart appears blank or zero-height
**Why it happens:** ResponsiveContainer requires a parent with explicit height
**How to avoid:** Always wrap in a container with `min-h-[VALUE]` class
**Warning signs:** Chart renders in dev tools but invisible on page

### Pitfall 2: Radix Tooltip on Touch Devices
**What goes wrong:** Tooltips don't show on mobile tap
**Why it happens:** Radix Tooltip behavior varies on touch; may require user to long-press
**How to avoid:** Test on actual touch devices; wrap TooltipTrigger in focusable element (button)
**Warning signs:** Works on desktop hover, inconsistent on mobile tap

### Pitfall 3: Tab URL Sync Race Conditions
**What goes wrong:** URL updates but content doesn't match, or vice versa
**Why it happens:** Controlled tabs with async navigation can cause state mismatches
**How to avoid:** Use URL as single source of truth; derive tab value from params, not local state
**Warning signs:** Flickering between variants, browser back button inconsistency

### Pitfall 4: Horizontal Scroll Not Working on Mobile
**What goes wrong:** Tabs don't scroll horizontally on touch devices
**Why it happens:** Missing touch scroll support or conflicting overflow
**How to avoid:** Use shadcn/ui ScrollArea which handles cross-browser touch scrolling
**Warning signs:** Tabs work on desktop but not mobile

### Pitfall 5: View Transitions Breaking with Tabs
**What goes wrong:** View transition animates wrong elements when switching tabs
**Why it happens:** View transition names conflict across tab content
**How to avoid:** Use unique view-transition-name per variant (include aspect in name); ensure names are stable
**Warning signs:** Image "jumps" to wrong position during transition

### Pitfall 6: External Links Opening Wrong Context
**What goes wrong:** Links open in-app browser on iOS instead of Safari, or stay in PWA frame
**Why it happens:** PWA standalone mode intercepts link handling differently per platform
**How to avoid:** Use `target="_blank" rel="noopener noreferrer"` for external links; show offline warning
**Warning signs:** Links work in browser but behave differently when installed

### Pitfall 7: Schema Changes Breaking Existing Data
**What goes wrong:** New required fields cause validation errors on existing documents
**Why it happens:** Convex schema validation is strict; existing docs don't have new fields
**How to avoid:** Add new fields as `v.optional()` first; backfill data; then make required if needed
**Warning signs:** Deploy fails with schema validation error

## Code Examples

Verified patterns from official sources:

### Adding shadcn/ui Components
```bash
# Source: shadcn/ui CLI
pnpm dlx shadcn@latest add tabs scroll-area accordion collapsible tooltip dialog chart
```

### Recharts Radar Chart Basic Setup
```typescript
// Source: Recharts official examples + shadcn/ui chart patterns
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

const data = [
  { axis: "Offense", value: 4 },
  { axis: "Defense", value: 3 },
  { axis: "Control", value: 5 },
  { axis: "Fear", value: 2 },
  { axis: "Utility", value: 4 },
];

export function PowerRatingsChart() {
  return (
    <div className="min-h-[250px]">
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="80%">
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={false}
            axisLine={false}
          />
          <Radar
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### Convex Schema Extension for Board Data
```typescript
// Source: Convex schema patterns
// Add to convex/schema.ts - new optional fields for spirit detail

// Growth option actions
const growthActionSchema = v.object({
  type: v.union(
    v.literal("gainEnergy"),
    v.literal("addPresence"),
    v.literal("reclaimCards"),
    v.literal("gainPowerCard"),
    v.literal("gainElement"),
    v.literal("custom")
  ),
  value: v.optional(v.number()),
  description: v.optional(v.string()),
});

// Presence slot grants
const presenceGrantSchema = v.object({
  type: v.union(
    v.literal("energy"),
    v.literal("cardPlay"),
    v.literal("element"),
    v.literal("reclaim"),
    v.literal("special")
  ),
  value: v.union(v.number(), v.string()),
  element: v.optional(v.string()),
});

// Innate power thresholds
const innateThresholdSchema = v.object({
  elements: v.array(v.object({
    element: v.string(),
    count: v.number(),
  })),
  effect: v.string(),
});

// Extend spirits table
spirits: defineTable({
  // Existing fields...

  // Power ratings (1-5 scale)
  powerRatings: v.optional(v.object({
    offense: v.number(),
    defense: v.number(),
    control: v.number(),
    fear: v.number(),
    utility: v.number(),
  })),

  // Strengths and weaknesses
  strengths: v.optional(v.array(v.string())),
  weaknesses: v.optional(v.array(v.string())),

  // Growth options
  growthOptions: v.optional(v.array(v.object({
    id: v.string(),
    actions: v.array(growthActionSchema),
  }))),

  // Presence tracks
  presenceTracks: v.optional(v.object({
    energy: v.array(v.object({
      position: v.number(),
      grants: v.array(presenceGrantSchema),
    })),
    cardPlays: v.array(v.object({
      position: v.number(),
      grants: v.array(presenceGrantSchema),
    })),
  })),

  // Innate powers
  innates: v.optional(v.array(v.object({
    name: v.string(),
    speed: v.union(v.literal("fast"), v.literal("slow")),
    range: v.optional(v.string()),
    target: v.optional(v.string()),
    thresholds: v.array(innateThresholdSchema),
  }))),

  // Special rules
  specialRules: v.optional(v.array(v.object({
    name: v.string(),
    description: v.string(),
  }))),

  // Unique power cards
  uniquePowers: v.optional(v.array(v.object({
    name: v.string(),
    cost: v.number(),
    speed: v.union(v.literal("fast"), v.literal("slow")),
    elements: v.array(v.string()),
    imageUrl: v.optional(v.string()),
    sickUrl: v.optional(v.string()),
  }))),

  // External resource URLs
  wikiUrl: v.optional(v.string()),
  faqUrl: v.optional(v.string()),
})
```

### External Link Component with Offline Handling
```typescript
// Handle external links appropriately for PWA
import { ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

export function ResourceLink({ href, children }) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (isOffline) {
      e.preventDefault();
      // Show toast: "You're offline"
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="inline-flex items-center gap-1 text-primary hover:underline"
    >
      {children}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| D3.js for all charts | Recharts/Nivo composable | 2023+ | Easier React integration, smaller bundle for simple charts |
| Custom CSS transitions for collapse | Radix Collapsible with data-state | 2024+ | Better accessibility, handles animation timing |
| overflow-x: scroll for tabs | ScrollArea primitive | 2024+ | Cross-browser touch support, custom scrollbar styling |
| Query params for tabs | Path segments for tabs | Best practice | Better SEO, cleaner URLs, works with view transitions |
| title attribute for tooltips | Radix Tooltip | 2022+ | Accessible, positioned, works on touch |
| react-modal | Radix Dialog | 2023+ | Better accessibility, focus management |

**Deprecated/outdated:**
- `react-chartjs-2` v4 API: v5 has breaking changes; use Recharts for new projects
- `defaultChecked` for controlled tabs: Use `value` + `onValueChange` pattern
- Manual scroll locking for modals: Radix Dialog handles this automatically

## Open Questions

Things that couldn't be fully resolved:

1. **Presence track visualization prototype preference**
   - What we know: User wants both grid view and track diagram view prototyped
   - What's unclear: Exact visual design for "track diagram" (horizontal line vs curved vs other)
   - Recommendation: Build grid view first (simpler); add track diagram as variant later based on feedback

2. **Card hand display prototype preference**
   - What we know: User wants both full card face and mini preview prototyped
   - What's unclear: Whether card images will be bundled or loaded from SICK
   - Recommendation: Start with mini preview (text-based); add full card face when image source is finalized

3. **Touch tooltip behavior**
   - What we know: Radix Tooltip may require long-press or focus on touch devices
   - What's unclear: Exact behavior on current iOS/Android; varies by Radix version
   - Recommendation: Test thoroughly; wrap triggers in focusable buttons; consider Popover as fallback for critical info

4. **Aspect-specific power ratings**
   - What we know: Aspects may have different ratings than base spirit
   - What's unclear: How many aspects actually differ from base
   - Recommendation: Schema supports optional override; display base ratings if aspect has none

## Sources

### Primary (HIGH confidence)
- [Radix Tabs documentation](https://www.radix-ui.com/primitives/docs/components/tabs) - Component API and composition
- [Radix Tooltip documentation](https://www.radix-ui.com/primitives/docs/components/tooltip) - Tooltip behavior and positioning
- [Radix Dialog documentation](https://www.radix-ui.com/primitives/docs/components/dialog) - Modal patterns
- [Radix Collapsible documentation](https://www.radix-ui.com/primitives/docs/components/collapsible) - Disclosure pattern
- [shadcn/ui Tabs](https://ui.shadcn.com/docs/components/tabs) - Tabs implementation
- [shadcn/ui Scroll Area](https://ui.shadcn.com/docs/components/scroll-area) - Horizontal scrolling
- [shadcn/ui Chart](https://ui.shadcn.com/docs/components/chart) - Recharts integration patterns
- [Recharts RadarChart GitHub demo](https://github.com/recharts/recharts/blob/master/demo/component/RadarChart.tsx) - Code examples
- [Convex Database Types](https://docs.convex.dev/database/types) - Schema patterns for nested objects
- [TanStack Router Routing Concepts](https://tanstack.com/router/latest/docs/framework/react/routing/routing-concepts) - Dynamic route parameters

### Secondary (MEDIUM confidence)
- [shadcn/ui GitHub issue #2270 - Scroll in Tabs](https://github.com/shadcn-ui/ui/issues/2270) - ScrollArea + Tabs composition
- [PWA external link handling - DEV Community](https://dev.to/ben/how-to-handle-outbound-links-in-desktop-pwa-3o4n) - Platform-specific behaviors
- [Chrome Declarative Link Capturing](https://developer.chrome.com/docs/web-platform/declarative-link-capturing) - PWA link handling

### Tertiary (LOW confidence)
- Touch tooltip behavior on iOS/Android (needs device testing)
- ScrollArea performance with many tabs (needs testing with 5+ aspects)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified via official docs and npm
- Architecture: HIGH - Patterns align with existing codebase structure and shadcn/ui conventions
- Pitfalls: MEDIUM - Touch device behaviors and ScrollArea edge cases need validation

**Research date:** 2026-01-26
**Valid until:** 2026-02-26 (30 days - stable libraries)
