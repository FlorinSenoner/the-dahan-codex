---
name: codebase-audit
description: Comprehensive codebase audit across 8 dimensions — backend, frontend, security, code quality, Convex patterns, Tailwind/UI, performance, and testing
argument-hint: "[focus: all|backend|frontend|security|performance]"
allowed-tools: Bash, Read, Glob, Grep, Task, WebSearch, WebFetch, AskUserQuestion, EnterPlanMode, ExitPlanMode, Write, mcp__convex__status, mcp__convex__tables, mcp__convex__functionSpec, mcp__convex__logs, mcp__convex__data, mcp__convex__runOneoffQuery, mcp__plugin_context7_context7__resolve-library-id, mcp__plugin_context7_context7__query-docs
---

# Comprehensive Codebase Audit

Full-spectrum codebase review using 8 specialized parallel agents across 3 rounds.
Produces a structured findings report with severity levels and optional fix plans.

## Context

- Project: Dinochron (TanStack Router + Vite SPA, Convex backend, Clerk auth, Cloudflare R2)
- Backend dir: `convex/` (functions in `convex/functions/`, helpers in `convex/lib/`)
- Frontend dir: `src/` (routes in `src/routes/`, components in `src/components/`)
- Schema: `convex/schema.ts`
- Tests: `tests/` (unit) + `tests/e2e/` (Playwright)
- Config: `biome.json`, `tsconfig.json`, `vite.config.ts`, `lefthook.yml`

## How to Run

The audit runs in 3 rounds of parallel agents. Each round must complete before the next starts
(later rounds build on earlier findings). Use the `focus` argument to limit scope:

- `all` (default) — run all 8 agents
- `backend` — rounds 1+2 backend agents only
- `frontend` — rounds 1+3 frontend agents only
- `security` — security-focused agents only
- `performance` — performance + query pattern agents only

## Round 1: Foundation (3 agents in parallel)

Launch these 3 agents concurrently using the Task tool:

### Agent 1: Convex Backend Patterns

**Type:** `convex-specialist`

**Prompt:**
```
Audit the Convex backend for anti-patterns. Check CLAUDE.md "Convex Rules",
"Convex Query Patterns", and "Convex Security Rules" sections for the full
checklist. Focus on:

1. Missing/incomplete validators:
   - Grep for action exports missing `returns:` validator
   - Grep for `v.string()` used where `v.id('tableName')` should be
   - Grep for `v.optional()` fields that should be required (project not live)

2. Query performance:
   - Grep for `.filter()` in queries (should use `.withIndex()`)
   - Grep for `.collect()` without `.take()` bounds
   - Grep for `.take(N).length` (counting anti-pattern)
   - Check for N+1 query patterns in loops

3. Data integrity:
   - Check denormalized counts are updated in ALL mutation paths
   - Verify cascade deletes clean up junction tables
   - Check for duplicate scheduling guards

4. Return type bloat:
   - Identify queries returning full Doc<'documents'> to list views
   - Check if large fields (content, pages, qrCodes) leak to list queries

Report findings as:
| # | Severity | Finding | File:Line | Recommended Fix |
```

### Agent 2: Frontend Architecture

**Type:** `code-reviewer`

**Prompt:**
```
Audit the frontend architecture in src/. Check CLAUDE.md "Error Handling",
"React Performance", and "Code Standards" sections for the full checklist.
Focus on:

1. Error handling:
   - Grep for empty catch blocks: `catch\s*(\{|\()` followed by no console/throw
   - Grep for `duration: Infinity` in toast calls
   - Grep for fire-and-forget mutations missing `.catch()`
   - Grep for `window.confirm(` (should use AlertDialog)

2. Performance:
   - Grep for `useMutation` inside per-row/per-item components
   - Check search inputs for debounce before URL sync
   - Check for missing `loading="lazy"` on non-viewport images
   - Grep for `useEffect` with mutation calls missing cleanup

3. Code quality:
   - Grep for `'use client'` (not valid in Vite SPA)
   - Grep for hardcoded `id=` attributes (should use useId())
   - Check for duplicate utility functions (formatFileSize, formatAmount, etc.)
   - Grep for `requestAnimationFrame` used for React state sync

4. Import consistency:
   - Grep for deep relative imports `../../../` (should use @/ alias)
   - Check for re-export chains spanning 3+ files

Report findings as:
| # | Severity | Finding | File:Line | Recommended Fix |
```

### Agent 3: Testing & Config

**Type:** `testing-expert`

**Prompt:**
```
Audit tests and project configuration. Check CLAUDE.md "Testing Rules" section
for the full checklist. Focus on:

1. Test quality:
   - Grep for CSS class assertions: `toHaveClass\(` with color/bg values
   - Grep for conditional assertions: `if (.*\.length` before expect()
   - Check security tests — do they call actual functions or simulate?
   - Grep for manual type definitions in test mocks (should use Partial<InferredType>)
   - Grep for `@testing-library/jest-dom` imports (globally configured)

2. Test coverage gaps:
   - Check which Convex functions lack corresponding test files
   - Verify E2E tests cover critical user flows (upload, OCR, review, bulk ops)

3. Config issues:
   - Check biome.json: is `noExplicitAny` set to "error" or "warn"?
   - Check lefthook.yml: does pre-commit run typecheck:convex?
   - Check package.json: does `pnpm check` include test running?
   - Check package.json: are dev-only packages in devDependencies?
   - Check for missing test data required fields (documents without status)

Report findings as:
| # | Severity | Finding | File:Line | Recommended Fix |
```

## Round 2: Deep Analysis (3 agents in parallel)

Launch after Round 1 completes:

### Agent 4: Security & Auth

**Type:** `security-auth-guardian`

**Prompt:**
```
Deep security audit of the Convex backend and auth integration. Check CLAUDE.md
"Security" and "Convex Security Rules" sections. Focus on:

1. Function exposure:
   - List ALL public mutations/queries — which ones should be internalMutation?
   - Check webhook handlers: are they using internalMutation?
   - Grep for `mutation({` and check each has auth/ownership validation

2. Authorization boundaries:
   - For every mutation accepting resource IDs (tagId, documentTypeId, etc.),
     verify the ID is validated against the document owner
   - Check shared access: do shared users get consistent data?
   - Grep for `.take(20)` used for permission checks (should use index)

3. Data exposure:
   - Grep for `debugFailureDetails` or error details returned to frontend
   - Check if R2 URLs are signed/presigned or publicly accessible
   - Verify IDs are not exposed in error messages to non-owners

4. Input validation:
   - Check bulk mutation args for array length limits
   - Grep for `Math.random()` in security contexts (R2 keys, tokens)
   - Verify file size validation is server-side (not trusting client)

5. Concurrency guards:
   - Check status transitions: is current status verified before overwrite?
   - Check for duplicate action scheduling (extractWithAi, reprocess)

Report findings as:
| # | Severity | Finding | File:Line | Recommended Fix |
```

### Agent 5: Code Quality & Duplication

**Type:** `code-reviewer`

**Prompt:**
```
Audit for code duplication, type safety, and consistency. Check CLAUDE.md
"Code Standards" and "Type Inference" sections. Focus on:

1. Duplicate code:
   - Grep for `formatFileSize` — is it defined in multiple files?
   - Grep for `formatAmount` or `formatCurrency` — duplicates?
   - Check color palettes: TAG_COLORS vs COLOR_PRESETS
   - Look for copy-pasted component sections (quality metrics tables, etc.)

2. Type safety:
   - Grep for heavy `as` type assertions (bypassing type checking)
   - Check for manually defined types that should use Infer<typeof validator>
   - Grep for `DocumentStatus` imports — are they from the canonical source?

3. Consistency:
   - Check tag normalization: is there one function or multiple?
   - Check name-exists queries: are they case-sensitive or insensitive?
   - Check sort config: is sortBy/sortOrder in filters AND viewConfig?

4. Dead code / unused patterns:
   - Run conceptual knip analysis on exports
   - Check for commented-out code blocks
   - Look for TODO/FIXME/HACK comments that indicate tech debt

Report findings as:
| # | Severity | Finding | File:Line | Recommended Fix |
```

### Agent 6: Convex Deep Patterns

**Type:** `convex-specialist`

**Prompt:**
```
Deep Convex-specific pattern audit. Check CLAUDE.md "Convex Query Patterns"
and "Convex Rules" sections. Focus on:

1. Index optimization:
   - Review convex/schema.ts: are all frequently-queried paths indexed?
   - Check junction tables for compound indexes (documentId + tagId)
   - Look for permission check queries not using indexes

2. Subscription efficiency:
   - Count useQuery/convexQuery calls on main pages
   - Check for overlapping read sets across subscriptions
   - Identify queries that could be merged

3. Mutation patterns:
   - Check syncUser: does it skip patch when nothing changed?
   - Check cascade operations: do they clean up ALL related data?
   - Verify denormalized counts in merge operations (tags, correspondents)

4. Action patterns:
   - Check all actions have returns validators
   - Verify actions use ctx.runQuery/ctx.runMutation (not ctx.db)
   - Check for proper error handling in external API calls (R2, Gemini)

Report findings as:
| # | Severity | Finding | File:Line | Recommended Fix |
```

## Round 3: Polish (2 agents in parallel)

Launch after Round 2 completes:

### Agent 7: Tailwind & UI Consistency

**Type:** `code-reviewer`

**Prompt:**
```
Audit Tailwind CSS and UI component usage. Check CLAUDE.md "UI Component Rules"
and "Tailwind CSS" sections. Focus on:

1. Design system violations:
   - Grep for raw `<button` not using Button component
   - Grep for `<h[1-6]` not using Heading component
   - Grep for `rounded-md` or `rounded-lg` (should be rounded-none)
   - Grep for hardcoded colors: `text-blue-`, `bg-yellow-`, `text-red-`

2. Tailwind anti-patterns:
   - Grep for `h-N w-N` that should be `size-N`
   - Grep for `flex-shrink-0` (should be shrink-0)
   - Grep for `transition-all` (should be specific)
   - Grep for duplicate classes in same element
   - Grep for template literal classNames: className={`

3. Theme safety:
   - Grep for inline style colors: `color:.*#` or `color:.*white`
   - Grep for `text-[10px]` repeated usage (needs custom utility)
   - Check for missing dark mode variants on hardcoded colors
   - Grep for `text-yellow-500` without companion `dark:text-yellow-`

4. Component patterns:
   - Check for Loading text instead of Spinner component
   - Check for hand-rolled alert divs instead of Alert component
   - Verify status colors come from status-colors.ts, not hardcoded

Report findings as:
| # | Severity | Finding | File:Line | Recommended Fix |
```

### Agent 8: Performance & Bundle

**Type:** `performance-profiler`

**Prompt:**
```
Audit performance patterns and bundle optimization. Check CLAUDE.md
"React Performance" section. Focus on:

1. Bundle size:
   - Check for route-level code splitting (lazy imports)
   - Grep for heavy library imports not dynamically imported (qrcode, fuse.js)
   - Check vite.config.ts for manual chunks configuration
   - Verify dev-only packages aren't in production dependencies

2. Rendering performance:
   - Check document list for row virtualization (200+ rows)
   - Count useMutation hooks inside per-row components
   - Check for new object/function references created in render
   - Look for keyboard listeners on window (should scope to container)

3. Network:
   - Check image loading: are thumbnails using full-size R2 URLs?
   - Verify font preloading in index.html
   - Check service worker for offline fallback page

4. React patterns:
   - Grep for mutations called on every mount (ensureSystemViews, etc.)
   - Check for setTimeout/setInterval cleanup in useEffect
   - Look for debounce timer leaks on unmount
   - Check for useId() vs hardcoded id attributes

Report findings as:
| # | Severity | Finding | File:Line | Recommended Fix |
```

## Output Format

After all 3 rounds complete, synthesize findings into a single report:

### Summary

Write the report to `.claude/audit-reports/YYYY-MM-DD-audit.md` with this structure:

```markdown
# Codebase Audit Report — YYYY-MM-DD

## Summary
- Total findings: N
- Critical: N | High: N | Medium: N | Low: N
- Top 3 areas needing attention: ...

## Critical Findings (fix before going live)
| # | Finding | Agent | File:Line | Fix |

## High Findings (data integrity / security)
| # | Finding | Agent | File:Line | Fix |

## Medium Findings (code quality / consistency)
| # | Finding | Agent | File:Line | Fix |

## Low Findings (nice to have)
| # | Finding | Agent | File:Line | Fix |

## Positive Patterns (already done well)
- ...
```

### Severity Definitions

- **Critical**: Security vulnerability, data leak, or auth bypass — must fix before going live
- **High**: Data integrity risk, missing validation, or performance issue affecting >10% of users
- **Medium**: Code quality issue, inconsistency, or anti-pattern that increases maintenance burden
- **Low**: Style inconsistency, minor optimization, or nice-to-have improvement

### Next Steps

After presenting the report, ask the user:

> Would you like me to enter plan mode to create fix plans for these findings?
> I can group them into phases by priority (Critical first, then High, etc.)

If yes, use `EnterPlanMode` to design the fix plan, grouping related findings
into parallelizable work streams.
