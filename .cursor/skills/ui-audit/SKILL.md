---
name: ui-audit
description:
  Audit UI component consistency — find design system violations, hardcoded colors, raw HTML
  elements, and one-off patterns
allowed-tools: Bash, Read, Glob, Grep, Task, AskUserQuestion, EnterPlanMode, ExitPlanMode, Write
user-invocable: true
---

# UI Component Consistency Audit

Scans the codebase for design system violations and produces a findings report.

## Context

- UI components: `src/components/ui/` (30 shadcn/ui components)
- Design tokens: `src/styles.css` (OKLch color space)
- Status colors: `src/lib/status-colors.ts`
- Typography: `Heading` + `Text` from `src/components/ui/typography.tsx`
- Icons: `@tabler/icons-react`
- Design system uses `rounded-none` (brutalist aesthetic)

## Checklist

Launch 3 parallel Explore agents to scan ALL .tsx files in `src/`:

### Agent 1: Raw HTML & Missing Components

Search for violations where design system components should be used:

- Raw `<button` elements (should be `Button` component) — `Grep: <button`
- Raw `<h[1-6]` elements (should be `Heading` component) — `Grep: <h[1-6][\s>]`
- Raw `<p className=` elements (should be `Text` component) — `Grep: <p className=`
- Raw `<details` elements (should be Button toggle pattern) — `Grep: <details`
- Raw `<hr` elements (should be `Separator`) — `Grep: <hr`
- "Loading..." text strings (should be `Spinner`) — `Grep: Loading\.\.\.`
- Card-like divs with border (should be `Card`) — `Grep: className.*rounded.*border.*p-`
- Hand-rolled alert/banner divs (should be `Alert`) — look for divs with `border-blue`,
  `border-amber`, `border-red`, `bg-blue-50`, `bg-amber-50`

**Exclude**: `src/components/ui/` (those ARE the design system), third-party component renders
(e.g., emoji picker `<button>` inside frimousse)

### Agent 2: Color & Styling Consistency

- Hardcoded Tailwind colors not in design tokens —
  `Grep: (text|bg|border)-(blue|red|green|yellow|amber|gray)-\d`
- Verify they reference `src/lib/status-colors.ts` or are justified (dynamic user colors)
- Template literal class concatenation instead of `cn()` — `Grep: className=\{\``
- Wrong border-radius (`rounded-md`, `rounded-lg`, `rounded` without `-none`) —
  `Grep: rounded-(sm|md|lg|xl|2xl)`
- Inline `style=` attributes — `Grep: style=\{`
- Arbitrary pixel sizes (`h-[`, `w-[`) that have Tailwind equivalents

**Exclude**: `src/components/ui/` (design system internals), `src/styles.css`

### Agent 3: Pattern Consistency

- Icon sizing: mixed `h-X w-X` vs `size-X` — `Grep: className.*h-\d.*w-\d` on icon elements
- Missing `cn()` import where conditional classes exist
- Hover states with hardcoded colors instead of design tokens
- Missing focus-visible rings on interactive elements
- Text hierarchy: verify `text-xs`/`text-sm`/`text-base` usage is contextually appropriate

**Exclude**: `src/components/ui/`

## Report Format

Produce findings as:

| #   | Issue | File:Line | Severity | Fix |
| --- | ----- | --------- | -------- | --- |

Severity levels:

- **HIGH**: Raw HTML where a component exists, missing accessibility attributes
- **MEDIUM**: Hardcoded colors, wrong border-radius, template literal classes
- **LOW**: Icon syntax (`h-X w-X` vs `size-X`), minor style inconsistencies

If fixes are needed, use `EnterPlanMode` to create an action plan.
