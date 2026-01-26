---
phase: quick
plan: 007
type: execute
wave: 1
depends_on: []
files_modified:
  - app/components/ui/typography.tsx
  - app/components/ui/page-header.tsx
  - app/lib/spirit-colors.ts
  - app/routes/credits.tsx
  - app/routes/spirits.$slug.tsx
  - app/routes/spirits.index.tsx
  - app/components/spirits/spirit-row.tsx
  - app/components/spirits/filter-sheet.tsx
autonomous: true

must_haves:
  truths:
    - "Typography components provide consistent text styling across pages"
    - "Page header pattern is extracted and reusable"
    - "Spirit color constants are centralized and imported from single source"
    - "No duplicated color/gradient constants across files"
  artifacts:
    - path: "app/components/ui/typography.tsx"
      provides: "Heading, Text typography components"
      exports: ["Heading", "Text"]
    - path: "app/components/ui/page-header.tsx"
      provides: "Reusable sticky page header"
      exports: ["PageHeader"]
    - path: "app/lib/spirit-colors.ts"
      provides: "Centralized element/complexity color mappings"
      exports: ["elementColors", "complexityColors", "PLACEHOLDER_GRADIENT"]
  key_links:
    - from: "app/routes/credits.tsx"
      to: "app/components/ui/typography.tsx"
      via: "import { Heading, Text }"
      pattern: "import.*Heading.*from"
    - from: "app/routes/spirits.$slug.tsx"
      to: "app/lib/spirit-colors.ts"
      via: "import { complexityColors, elementColors }"
      pattern: "import.*complexityColors.*from.*spirit-colors"
---

<objective>
Add typography and reusable UI components for design consistency.

Purpose: Reduce code duplication and ensure consistent styling patterns across the Spirit Island companion app. The codebase has repeated typography classes, header patterns, and color constants that should be centralized.

Output: Typography components, page header component, and centralized spirit color constants that can be imported across the app.
</objective>

<execution_context>
@./.claude/get-shit-done/workflows/execute-plan.md
@./.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@app/styles/globals.css
@app/components/ui/button.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create typography and page header components</name>
  <files>
    app/components/ui/typography.tsx
    app/components/ui/page-header.tsx
  </files>
  <action>
Create typography components following shadcn/ui patterns:

**typography.tsx:**
- `Heading` component with variants: `h1`, `h2`, `h3`, `h4` using cva for class variance
  - h1: `font-headline text-2xl font-bold` (spirit detail titles)
  - h2: `font-headline text-xl font-semibold` (page titles like "Credits", "Spirits")
  - h3: `font-headline text-lg font-semibold` (section headers)
  - h4: `font-headline text-base font-medium` (subsection headers)
  - Accept `as` prop for semantic element (defaults to variant)
  - Accept `className` prop for customization
- `Text` component with variants: `body`, `muted`, `small`
  - body: `text-base text-foreground`
  - muted: `text-sm text-muted-foreground`
  - small: `text-xs text-muted-foreground`
  - Accept `as` prop defaulting to `p`
  - Accept `className` prop for customization

**page-header.tsx:**
- `PageHeader` component extracting the repeated sticky header pattern
- Props: `title`, `children` (for action buttons), `viewTransitionName` (optional)
- Uses: `sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3`
- Children slot on right side for filter buttons, back buttons, etc.
- Optional `backHref` prop with Link + ArrowLeft icon
  </action>
  <verify>
Run `pnpm typecheck` - no type errors in new files.
Files exist at specified paths.
  </verify>
  <done>
Typography and PageHeader components exist with proper TypeScript types and cva variants.
  </done>
</task>

<task type="auto">
  <name>Task 2: Extract spirit color constants and refactor usages</name>
  <files>
    app/lib/spirit-colors.ts
    app/routes/spirits.$slug.tsx
    app/components/spirits/spirit-row.tsx
    app/components/spirits/filter-sheet.tsx
  </files>
  <action>
Create centralized spirit colors module and update imports:

**spirit-colors.ts:**
- Export `PLACEHOLDER_GRADIENT` constant (currently duplicated in spirit-row.tsx and spirits.$slug.tsx)
- Export `complexityColors` mapping (duplicated in spirit-row.tsx and spirits.$slug.tsx)
- Export `elementColors` mapping (exists in filter-sheet.tsx, also duplicated in spirits.$slug.tsx)
- Export `modifierConfig` (currently only in spirit-row.tsx, may be reused)

**Refactor usages:**
- `spirits.$slug.tsx`: Remove local `complexityColors` and `elementColors` constants, import from `@/lib/spirit-colors`. Remove local `PLACEHOLDER_GRADIENT`.
- `spirit-row.tsx`: Remove local `PLACEHOLDER_GRADIENT`, `complexityColors`, `modifierConfig`. Import from `@/lib/spirit-colors`.
- `filter-sheet.tsx`: Keep exporting for now (it has selected/unselected variants), but consider if spirit-colors.ts should hold the canonical mapping.

Note: filter-sheet.tsx has slightly different structure (selected/unselected classes), so it may need its own export or the spirit-colors.ts version should accommodate both use cases.
  </action>
  <verify>
Run `pnpm typecheck` - no type errors.
Run `pnpm dev` and verify spirit list and detail pages still render correctly with proper colors.
Grep for `PLACEHOLDER_GRADIENT` - should only appear in spirit-colors.ts and import statements.
  </verify>
  <done>
Single source of truth for spirit color constants. No duplicated color mappings in component files.
  </done>
</task>

<task type="auto">
  <name>Task 3: Apply typography components to existing pages</name>
  <files>
    app/routes/credits.tsx
    app/routes/spirits.index.tsx
    app/routes/spirits.$slug.tsx
  </files>
  <action>
Refactor existing pages to use the new typography components:

**credits.tsx:**
- Replace manual h1/h2 with `Heading` component
- Replace `<p className="text-sm text-muted-foreground">` with `<Text variant="muted">`
- Consider using PageHeader for the sticky header

**spirits.index.tsx:**
- Use PageHeader component for the sticky header with "Spirits" title
- Pass FilterSheet as children to PageHeader

**spirits.$slug.tsx:**
- Use Heading for spirit name title
- Use Text for summary and description paragraphs
- Consider PageHeader for the sticky header (with back button as children)

Keep changes minimal - only replace where the new components are a direct match. Don't force components where custom styling is needed.
  </action>
  <verify>
Run `pnpm dev` and visually verify:
- Credits page renders with same styling
- Spirits list page header looks the same
- Spirit detail page title and text look the same
Run `pnpm typecheck` - no errors.
  </verify>
  <done>
Typography components in use across main pages. Consistent styling maintained.
  </done>
</task>

</tasks>

<verification>
- `pnpm typecheck` passes with no errors
- `pnpm lint:fix` passes
- Visual verification: Credits, Spirits list, and Spirit detail pages render correctly
- Grep confirms no duplicated constants: `grep -r "PLACEHOLDER_GRADIENT" app/` shows only one definition + imports
</verification>

<success_criteria>
- Typography components (Heading, Text) exist and are typed correctly
- PageHeader component exists with proper props
- Spirit color constants centralized in single file
- At least 3 pages refactored to use new components
- No visual regressions
- Typecheck and lint pass
</success_criteria>

<output>
After completion, create `.planning/quick/007-add-typography-and-reusable-ui-component/007-SUMMARY.md`
</output>
