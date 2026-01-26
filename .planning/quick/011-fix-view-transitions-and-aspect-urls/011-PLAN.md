---
phase: quick
plan: 011
type: execute
wave: 1
depends_on: []
files_modified:
  - app/routes/spirits.$slug.tsx
  - app/routes/spirits.index.tsx
  - app/components/spirits/spirit-row.tsx
autonomous: true

must_haves:
  truths:
    - "Spirit titles animate smoothly between list and detail views"
    - "Aspect titles animate smoothly between list and detail views"
    - "URLs remain clean without ?returning= params after back navigation"
    - "Aspect URLs use path format /spirits/{base-slug}/{aspect-name}"
  artifacts:
    - path: "app/routes/spirits.$slug.tsx"
      provides: "Aspect URL path param handling, clean back navigation"
    - path: "app/routes/spirits.index.tsx"
      provides: "No returning/returningAspect search params"
    - path: "app/components/spirits/spirit-row.tsx"
      provides: "Aspect links with path-based URLs"
  key_links:
    - from: "spirit-row.tsx"
      to: "spirits.$slug.tsx"
      via: "viewTransitionName matching"
      pattern: "spirit-name-|spirit-aspect-"
---

<objective>
Fix view transitions for spirit/aspect titles, remove ?returning= URL params, and change aspect URL structure to path-based format.

Purpose: Improve UX with smooth title animations and clean URLs
Output: Working view transitions for titles and clean aspect URLs like /spirits/lightnings-swift-strike/immense
</objective>

<execution_context>
@./.claude/get-shit-done/workflows/execute-plan.md
@./.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@app/routes/spirits.$slug.tsx
@app/routes/spirits.index.tsx
@app/components/spirits/spirit-row.tsx
@app/styles/globals.css (view transition CSS)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix view transitions for titles and change aspect URL structure</name>
  <files>
    - app/routes/spirits.$slug.tsx
    - app/components/spirits/spirit-row.tsx
  </files>
  <action>
**Problem 1: Title view transitions not working for aspects**

Current issue: In spirit-row.tsx, aspects use `spirit-aspect-${aspectName}` but this doesn't match anything on the detail page. The detail page only sets `spirit-name-${slug}` for base spirits (line 160), not for aspects.

Fix in spirit-row.tsx:
- Change aspect name transition from `spirit-aspect-${spirit.aspectName?.toLowerCase()}` to `spirit-name-${spirit.aspectSlug || spirit.aspectName?.toLowerCase().replace(/\s+/g, '-')}`
- Need consistent naming between list and detail for aspects

Actually, the cleaner fix is:
- In spirit-row.tsx: For aspects, set viewTransitionName on the h3 title element to `spirit-name-${spirit.slug}-${spirit.aspectName?.toLowerCase().replace(/\s+/g, '-')}`
- In spirits.$slug.tsx: For aspects, set viewTransitionName on the Heading to match `spirit-name-${slug}-${aspect}`

**Problem 2: Change aspect URL structure**

Current: `/spirits/lightnings-swift-strike?aspect=immense`
Target: `/spirits/lightnings-swift-strike/immense`

This requires a NEW route file. TanStack Router uses file-based routing, so:
1. Create `app/routes/spirits.$slug.$aspect.tsx` - this catches `/spirits/{slug}/{aspect}`
2. Keep `app/routes/spirits.$slug.tsx` for base spirits only (no aspect param)

Simpler approach: Use optional splat param in existing route. Actually, TanStack Router doesn't support optional path segments directly.

Best approach: Keep the single `spirits.$slug.tsx` file but add aspect as optional path segment using the `$` suffix convention. Check TanStack Router docs - actually the pattern is to use a separate route file.

Simplest working approach:
1. In spirit-row.tsx, change aspect href to `/spirits/${spirit.slug}/${spirit.aspectName?.toLowerCase().replace(/\s+/g, '-')}`
2. Create new route file `app/routes/spirits_.$slug.$aspect.tsx` that handles aspect URLs (the underscore prevents nesting)

Wait - looking at TanStack Router file-based routing more carefully:
- `spirits.$slug.tsx` handles `/spirits/{slug}`
- `spirits.$slug.$aspect.tsx` would handle `/spirits/{slug}/{aspect}` BUT this creates a nested layout

For flat routes (not nested), use `spirits_.$slug.$aspect.tsx` OR handle both in one file with logic.

Actually the easiest approach: Modify `spirits.$slug.tsx` to also handle aspect as second path segment by creating a duplicate route OR update the route definition.

Let me reconsider - the cleanest is to just create `spirits.$slug_.$aspect.tsx` which gives us a flat route for `/spirits/:slug/:aspect`.

**Implementation:**

1. Create `app/routes/spirits.$slug_.$aspect.tsx`:
   - Copy most of the logic from spirits.$slug.tsx
   - Use `$aspect` param instead of `?aspect=` search param
   - Set back navigation to `/spirits/${slug}` (base spirit) without any search params

2. Update `app/routes/spirits.$slug.tsx`:
   - Remove `aspect` search param validation
   - Simplify to only handle base spirits
   - Back button navigates to `/spirits` (no returning params)

3. Update `app/components/spirits/spirit-row.tsx`:
   - Change aspect href from `/spirits/${spirit.slug}?aspect=${aspectName}` to `/spirits/${spirit.slug}/${aspectName}`
   - Update viewTransitionName for aspect titles to match detail page

**View transition name consistency:**

For base spirits:
- List: `spirit-name-${spirit.slug}` on h3
- Detail: `spirit-name-${slug}` on Heading
- Already works!

For aspects - need to add:
- List: `spirit-name-${spirit.slug}-${aspectName}` on h3 (new)
- Detail: `spirit-name-${slug}-${aspect}` on Heading (new)
  </action>
  <verify>
    1. `pnpm typecheck` passes
    2. Navigate to spirit list, click base spirit - title should morph smoothly
    3. Navigate to spirit list, click aspect - title should morph smoothly
    4. Check URL shows `/spirits/lightnings-swift-strike/immense` for aspects
    5. Click back button - URL should be `/spirits` with no `?returning=` params
  </verify>
  <done>
    - View transitions work for both base spirit and aspect titles
    - Aspect URLs are path-based: /spirits/{slug}/{aspect}
    - Back navigation produces clean URLs without returning params
  </done>
</task>

<task type="auto">
  <name>Task 2: Remove returning search params from spirits.index.tsx</name>
  <files>app/routes/spirits.index.tsx</files>
  <action>
Remove the `returning` and `returningAspect` search params from the schema since they're no longer needed.

In spirits.index.tsx:
1. Remove lines 16-17 from spiritFilterSchema:
   ```typescript
   returning: z.string().optional(),
   returningAspect: z.string().optional(),
   ```

The returning params were used to preserve scroll position or highlight the returning spirit, but they're not actually being used for anything currently - they just pollute the URL. Simply remove them.
  </action>
  <verify>`pnpm typecheck` passes and navigating back from spirit detail shows clean URL `/spirits` or `/spirits?complexity=...` (only filter params)</verify>
  <done>URL search params schema only contains filter-related params (complexity, elements, expansion, sort)</done>
</task>

</tasks>

<verification>
1. `pnpm typecheck` - no type errors
2. `pnpm lint:fix` - no lint errors
3. Manual verification:
   - Click "Lightning's Swift Strike" - title morphs, URL is `/spirits/lightnings-swift-strike`
   - Click back - URL is `/spirits` (no returning params)
   - Click "Immense" aspect - title morphs, URL is `/spirits/lightnings-swift-strike/immense`
   - Click back - URL is `/spirits/lightnings-swift-strike` (base spirit) then `/spirits`
</verification>

<success_criteria>
- Spirit and aspect titles animate with view transitions between list and detail
- Aspect URLs use path structure: /spirits/{base-slug}/{aspect-name}
- Back navigation produces clean URLs without ?returning= params
- All type checks and lint checks pass
</success_criteria>

<output>
After completion, create `.planning/quick/011-fix-view-transitions-and-aspect-urls/011-SUMMARY.md`
</output>
