# Phase 3: Spirit Detail & Board - Research

**Researched:** 2026-01-26
**Domain:** Spirit detail UI, radar charts, collapsible sections, presence track visualization
**Confidence:** HIGH

## Summary

Phase 3 requires building out the spirit detail page with a variant selector, radar chart for power ratings, collapsible sections for board visualization, and external resource links. The research confirms that the existing shadcn/ui ecosystem combined with Recharts provides all necessary building blocks.

The key technical challenges are: (1) rendering a radar chart that works well on mobile with the existing dark theme, (2) building presence track visualizations that clearly communicate slot rewards, and (3) handling external links appropriately in the PWA context. The codebase already has established patterns for styling (oklch colors, Tailwind CSS v4, shadcn/ui components) that should be extended.

**Primary recommendation:** Use Recharts for the radar chart (lightweight, React-native, works with shadcn/ui chart patterns), add shadcn/ui Tabs + Accordion + Collapsible + Tooltip components, and build presence tracks as CSS Grid-based slot components with custom tooltips for touch devices.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| recharts | 3.7.0 | Radar chart for power ratings | React-native, composable, works with shadcn/ui ChartContainer |
| @radix-ui/react-tabs | latest | Variant selector tabs | Powers shadcn/ui Tabs, accessible, keyboard navigable |
| @radix-ui/react-accordion | latest | Innate powers collapsed display | Powers shadcn/ui Accordion, WAI-ARIA compliant |
| @radix-ui/react-collapsible | latest | Special rules section | Powers shadcn/ui Collapsible, controlled/uncontrolled |
| @radix-ui/react-tooltip | latest | Presence slot tooltips | Powers shadcn/ui Tooltip, hover + focus support |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | 0.563.0 | Icons for growth actions, elements | Already installed, use for iconography |
| class-variance-authority | 0.7.1 | Component variants | Already installed, use for slot state variants |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Recharts | Chart.js + react-chartjs-2 | Canvas-based (better perf), but less React-native; harder to style with Tailwind |
| Recharts | Victory | More opinionated, heavier bundle |
| Recharts | D3 directly | Full control but significant complexity |

**Installation:**
```bash
pnpm add recharts
pnpm dlx shadcn@latest add tabs accordion collapsible tooltip
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
│       ├── variant-tabs.tsx      # Horizontal tab selector
│       ├── overview-section.tsx  # Radar chart + complexity + elements
│       ├── power-radar-chart.tsx # Recharts radar with theming
│       ├── growth-panel.tsx      # Growth option cards
│       ├── presence-track.tsx    # Presence slot grid
│       ├── presence-slot.tsx     # Individual slot with tooltip
│       ├── innate-powers.tsx     # Accordion of innate power cards
│       ├── special-rules.tsx     # Collapsible special rules
│       ├── card-hand.tsx         # Row of power cards
│       └── external-links.tsx    # Wiki/FAQ/SICK links
└── lib/
    └── spirit-colors.ts          # Extend with radar chart colors
```

### Pattern 1: Variant Tabs with URL Sync
**What:** Tabs that sync with URL path parameters for shareable links
**When to use:** Variant selector where each tab has a unique URL
**Example:**
```typescript
// Source: shadcn/ui Tabs + TanStack Router
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
      <TabsList className="sticky top-[57px] z-10 w-full justify-start overflow-x-auto">
        <TabsTrigger value="base">{baseSpirit.name}</TabsTrigger>
        {aspects.map((a) => (
          <TabsTrigger key={a.aspectName} value={a.aspectName.toLowerCase()}>
            {a.aspectName}
          </TabsTrigger>
        ))}
      </TabsList>
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
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

const chartConfig = {
  rating: {
    label: "Rating",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

function PowerRadarChart({ ratings }) {
  const data = [
    { axis: "Offense", value: ratings.offense },
    { axis: "Defense", value: ratings.defense },
    { axis: "Control", value: ratings.control },
    { axis: "Fear", value: ratings.fear },
    { axis: "Utility", value: ratings.utility },
  ];

  return (
    <div className="min-h-[250px] w-full">
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="80%">
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
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

### Pattern 3: Presence Track as CSS Grid
**What:** Grid of slots representing presence track positions
**When to use:** Displaying energy/card play tracks with tooltips
**Example:**
```typescript
// Custom component for presence track
function PresenceTrack({ track, type }) {
  return (
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

### Anti-Patterns to Avoid
- **Inline chart dimensions:** Always use ResponsiveContainer; never hardcode width/height on RadarChart itself
- **Hover-only tooltips:** Touch devices need tap/click support; use Radix Tooltip which handles this
- **Separate routes for each variant:** Use a single route with tabs; the current two-route approach will be refactored
- **Canvas-based charts without fallback:** Recharts SVG renders better across devices

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Radar/spider chart | Custom SVG paths | Recharts RadarChart | Handles polar coordinates, scaling, responsive sizing |
| Accessible tabs | div + onClick handlers | shadcn/ui Tabs (Radix) | WAI-ARIA, keyboard navigation, focus management |
| Collapsible sections | CSS max-height animation | shadcn/ui Collapsible/Accordion | Handles animation, accessibility, controlled state |
| Tooltips for touch | title attribute | shadcn/ui Tooltip (Radix) | Cross-device support, positioning, keyboard accessible |
| Responsive chart container | window.innerWidth listener | Recharts ResponsiveContainer | ResizeObserver, handles SSR, proper cleanup |

**Key insight:** The combination of shadcn/ui components (built on Radix primitives) and Recharts covers all UI patterns needed for this phase. Custom solutions would require reimplementing accessibility, animation, and responsive behavior that these libraries handle correctly.

## Common Pitfalls

### Pitfall 1: ResponsiveContainer Not Rendering
**What goes wrong:** Chart appears blank or zero-height
**Why it happens:** ResponsiveContainer requires a parent with explicit height
**How to avoid:** Always wrap in a container with `min-h-[VALUE]` class
**Warning signs:** Chart renders in dev tools but invisible on page

### Pitfall 2: Radix Tooltip on Touch Devices
**What goes wrong:** Tooltips don't show on mobile tap
**Why it happens:** Radix Tooltip is hover-based by default; touch support varies by version
**How to avoid:** Test on actual touch devices; consider using Popover for critical info; add click handler fallback
**Warning signs:** Works on desktop hover, fails on mobile tap

### Pitfall 3: Tab URL Sync Race Conditions
**What goes wrong:** URL updates but content doesn't match, or vice versa
**Why it happens:** Controlled tabs with async navigation can cause state mismatches
**How to avoid:** Use URL as single source of truth; derive tab value from params, not local state
**Warning signs:** Flickering between variants, browser back button inconsistency

### Pitfall 4: View Transitions Breaking with Tabs
**What goes wrong:** View transition animates wrong elements when switching tabs
**Why it happens:** View transition names conflict across tab content
**How to avoid:** Use unique view-transition-name per variant (include aspect in name); ensure names are stable
**Warning signs:** Image "jumps" to wrong position during transition

### Pitfall 5: External Links Opening Wrong Context
**What goes wrong:** Links open in-app browser on iOS instead of Safari, or open new window on desktop
**Why it happens:** PWA standalone mode intercepts link handling differently per platform
**How to avoid:** Use `target="_blank" rel="noopener noreferrer"` for external links; test on installed PWA
**Warning signs:** Links work in browser but behave differently when installed

### Pitfall 6: Schema Changes Breaking Existing Data
**What goes wrong:** New required fields cause validation errors on existing documents
**Why it happens:** Convex schema validation is strict; existing docs don't have new fields
**How to avoid:** Add new fields as `v.optional()` first; backfill data; then make required if needed
**Warning signs:** Deploy fails with schema validation error

## Code Examples

Verified patterns from official sources:

### Adding shadcn/ui Components
```bash
# Source: shadcn/ui CLI
pnpm dlx shadcn@latest add tabs accordion collapsible tooltip
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

### Sticky Horizontal Tabs
```typescript
// Source: shadcn/ui Tabs + custom styling
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function VariantTabs({ variants, current, onChange }) {
  return (
    <Tabs value={current} onValueChange={onChange}>
      <TabsList className="sticky top-[57px] z-10 w-full justify-start overflow-x-auto bg-background/95 backdrop-blur">
        {variants.map((v) => (
          <TabsTrigger
            key={v.value}
            value={v.value}
            className="min-w-fit shrink-0"
          >
            {v.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
```

### Convex Schema Extension
```typescript
// Source: Convex schema patterns
// Add to convex/schema.ts - new optional fields for spirit detail
spirits: defineTable({
  // Existing fields...

  // New optional fields for Phase 3
  strengths: v.optional(v.array(v.string())),
  weaknesses: v.optional(v.array(v.string())),
  powerRatings: v.optional(v.object({
    offense: v.number(),
    defense: v.number(),
    control: v.number(),
    fear: v.number(),
    utility: v.number(),
  })),
  specialRules: v.optional(v.array(v.object({
    name: v.string(),
    description: v.string(),
  }))),
  growth: v.optional(v.array(v.object({
    options: v.array(v.string()),
    // Growth option details
  }))),
  presenceTracks: v.optional(v.object({
    energy: v.array(v.object({
      value: v.union(v.number(), v.string()),
      description: v.optional(v.string()),
    })),
    cardPlays: v.array(v.object({
      value: v.union(v.number(), v.string()),
      description: v.optional(v.string()),
    })),
  })),
  innates: v.optional(v.array(v.object({
    name: v.string(),
    speed: v.string(),
    thresholds: v.array(v.object({
      elements: v.array(v.string()),
      effect: v.string(),
    })),
  }))),
  wikiUrl: v.optional(v.string()),
  faqUrl: v.optional(v.string()),
})
```

### External Link Component
```typescript
// Handle external links appropriately for PWA
import { ExternalLink } from "lucide-react";

export function ResourceLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
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
| Query params for tabs | Path segments for tabs | Best practice | Better SEO, cleaner URLs, works with view transitions |
| title attribute for tooltips | Radix Tooltip | 2022+ | Accessible, positioned, works on touch |

**Deprecated/outdated:**
- `react-chartjs-2` v4 API: v5 has breaking changes; use Recharts for new projects
- `defaultChecked` for controlled tabs: Use `value` + `onValueChange` pattern

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
   - What we know: Radix Tooltip has issues on touch devices per GitHub #2589
   - What's unclear: Whether current version has fixed this; behavior varies by device
   - Recommendation: Test thoroughly on iOS/Android; consider Popover as fallback for critical info

## Sources

### Primary (HIGH confidence)
- [shadcn/ui Tabs Documentation](https://ui.shadcn.com/docs/components/tabs) - Component API and patterns
- [shadcn/ui Accordion Documentation](https://ui.shadcn.com/docs/components/accordion) - Collapsible sections
- [shadcn/ui Collapsible Documentation](https://ui.shadcn.com/docs/components/collapsible) - Single collapsible
- [shadcn/ui Tooltip Documentation](https://ui.shadcn.com/docs/components/tooltip) - Tooltip behavior
- [shadcn/ui Chart Documentation](https://ui.shadcn.com/docs/components/chart) - Recharts integration patterns
- [Convex Schema Documentation](https://docs.convex.dev/database/schemas) - Schema migration patterns

### Secondary (MEDIUM confidence)
- [Recharts RadarChart](https://recharts.org) - API patterns (verified via npm-compare and multiple sources)
- [GeeksforGeeks Recharts Radar Chart Tutorial](https://www.geeksforgeeks.org/reactjs/create-a-radar-chart-using-recharts-in-reactjs/) - Code examples
- [Recharts and Accessibility Wiki](https://github.com/recharts/recharts/wiki/Recharts-and-accessibility) - Accessibility layer
- [Convex Migrations Guide](https://stack.convex.dev/intro-to-migrations) - Schema migration strategy
- [Spirit Island Wiki](https://spiritislandwiki.com/index.php?title=Presence) - Presence track mechanics

### Tertiary (LOW confidence)
- [Radix Tooltip Touch Issue #2589](https://github.com/radix-ui/primitives/issues/2589) - Touch device behavior (needs testing)
- [PWA External Links Patterns](https://dev.to/ben/how-to-handle-outbound-links-in-desktop-pwa-3o4n) - Platform-specific behaviors

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified via official docs and npm
- Architecture: HIGH - Patterns align with existing codebase structure
- Pitfalls: MEDIUM - Some touch behavior needs validation on real devices

**Research date:** 2026-01-26
**Valid until:** 2026-02-26 (30 days - stable libraries)
