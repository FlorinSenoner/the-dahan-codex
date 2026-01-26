---
phase: quick
plan: 009
type: execute
wave: 1
depends_on: []
files_modified:
  - app/styles/globals.css
  - app/lib/spirit-colors.ts
autonomous: true
---

<objective>
Update element colors to match Spirit Island wiki icons and create a distinct complexity color scheme that does not overlap with element colors.

Purpose: Element colors should match the official Spirit Island iconography so users instantly recognize elements. Complexity colors need their own identity separate from elements to avoid visual confusion.

Output: Updated CSS variables for elements, new CSS variables for complexity, and updated spirit-colors.ts mappings.
</objective>

<context>
@app/styles/globals.css
@app/lib/spirit-colors.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update element colors to match wiki icons</name>
  <files>app/styles/globals.css</files>
  <action>
Update element CSS variables in both :root and .dark selectors to match the official Spirit Island wiki icon colors:

```css
/* Element colors - matching official Spirit Island wiki icons */
--element-sun: oklch(0.85 0.18 90);      /* Bright yellow (hue ~90) */
--element-moon: oklch(0.72 0.02 260);    /* Silver/gray - keep as-is */
--element-fire: oklch(0.70 0.20 50);     /* Orange (hue ~50, shifted from red-orange 25) */
--element-air: oklch(0.70 0.14 290);     /* Violet/purple (hue ~290, shifted from cyan 200) */
--element-water: oklch(0.58 0.14 230);   /* Blue - keep as-is */
--element-earth: oklch(0.55 0.02 90);    /* Grey (low chroma ~0.02, was brown 0.12) */
--element-plant: oklch(0.58 0.18 145);   /* Green - keep as-is */
--element-animal: oklch(0.58 0.22 25);   /* Red (hue ~25 like fire but more saturated) */
```

Key changes:
- Sun: Shift hue from 75 (golden) to 90 (pure yellow), increase lightness
- Fire: Shift hue from 25 (red-orange) to 50 (orange)
- Air: Shift hue from 200 (cyan) to 290 (violet/purple)
- Earth: Reduce chroma from 0.12 to 0.02 (grey instead of brown)
- Animal: Keep hue at 25 (red) but lower lightness to distinguish from orange fire
  </action>
  <verify>Run `pnpm dev` and visually inspect element badges on spirit detail page - Air should be violet, Fire should be orange, Earth should be grey, Animal should be red, Sun should be yellow</verify>
  <done>Element colors visually match Spirit Island wiki icon colors</done>
</task>

<task type="auto">
  <name>Task 2: Create separate complexity color scheme</name>
  <files>app/styles/globals.css, app/lib/spirit-colors.ts</files>
  <action>
Add new complexity CSS variables to globals.css using a neutral grayscale progression from light to dark. This creates clear visual separation from the colorful element badges.

Add to both :root and .dark in globals.css (after element colors):

```css
/* Complexity colors - neutral grayscale progression (light to dark = easy to hard) */
--complexity-low: oklch(0.85 0.02 145);      /* Light sage tint */
--complexity-moderate: oklch(0.70 0.02 90);   /* Medium warm grey */
--complexity-high: oklch(0.55 0.02 30);       /* Darker warm grey */
--complexity-very-high: oklch(0.40 0.04 15);  /* Near-black with slight warmth */
```

Add Tailwind theme mappings in @theme inline block:

```css
--color-complexity-low: var(--complexity-low);
--color-complexity-moderate: var(--complexity-moderate);
--color-complexity-high: var(--complexity-high);
--color-complexity-very-high: var(--complexity-very-high);
```

Update spirit-colors.ts complexity mappings to use new variables:

```typescript
export const complexityBadgeColors: Record<string, string> = {
  Low: "bg-complexity-low/20 text-complexity-low border-complexity-low/30",
  Moderate: "bg-complexity-moderate/20 text-complexity-moderate border-complexity-moderate/30",
  High: "bg-complexity-high/20 text-complexity-high border-complexity-high/30",
  "Very High": "bg-complexity-very-high/20 text-complexity-very-high border-complexity-very-high/30",
};

export const complexityFilterColors: Record<string, { selected: string; unselected: string }> = {
  Low: {
    selected: "bg-complexity-low/30 text-complexity-low border-complexity-low/50 hover:bg-complexity-low/40",
    unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
  },
  Moderate: {
    selected: "bg-complexity-moderate/30 text-complexity-moderate border-complexity-moderate/50 hover:bg-complexity-moderate/40",
    unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
  },
  High: {
    selected: "bg-complexity-high/30 text-complexity-high border-complexity-high/50 hover:bg-complexity-high/40",
    unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
  },
  "Very High": {
    selected: "bg-complexity-very-high/30 text-complexity-very-high border-complexity-very-high/50 hover:bg-complexity-very-high/40",
    unselected: "bg-muted/30 text-foreground border-border hover:bg-muted/50",
  },
};
```

Also update modifierColors to use complexity colors instead of element colors:

```typescript
export const modifierColors: Record<string, { color: string; label: string }> = {
  easier: { color: "text-complexity-low", label: "Easier" },
  same: { color: "text-muted-foreground", label: "Same complexity" },
  harder: { color: "text-complexity-very-high", label: "Harder" },
};
```
  </action>
  <verify>Run `pnpm dev` and check complexity badges on spirit list and detail pages - they should appear as neutral grey tones, clearly distinct from colorful element badges</verify>
  <done>Complexity colors use grayscale progression completely separate from element colors</done>
</task>

<task type="auto">
  <name>Task 3: Verify typecheck and visual consistency</name>
  <files>None (verification only)</files>
  <action>
Run typecheck to ensure all Tailwind class references are valid:
```bash
pnpm typecheck
```

Test the visual appearance:
1. Start dev server with `pnpm dev`
2. Navigate to spirits list - check complexity badges in filter chips
3. Navigate to a spirit detail page - check both element and complexity badges side by side
4. Confirm element colors are vibrant and match wiki (Air=violet, Fire=orange, etc.)
5. Confirm complexity colors are neutral grey tones that feel distinct from elements
  </action>
  <verify>`pnpm typecheck` passes with no errors</verify>
  <done>All type checks pass and visual inspection confirms distinct color schemes for elements vs complexity</done>
</task>

</tasks>

<verification>
- `pnpm typecheck` passes
- Element badges show: Sun=yellow, Fire=orange, Air=violet, Earth=grey, Animal=red
- Complexity badges show neutral grayscale progression (light to dark)
- Element and complexity badges are visually distinct color families
</verification>

<success_criteria>
- Element colors match Spirit Island wiki iconography
- Complexity colors use independent grayscale scheme
- No overlap or confusion between element and complexity visual language
- All existing functionality preserved (filters, badges, etc.)
</success_criteria>

<output>
After completion, create `.planning/quick/009-rework-element-and-complexity-colors/009-SUMMARY.md`
</output>
