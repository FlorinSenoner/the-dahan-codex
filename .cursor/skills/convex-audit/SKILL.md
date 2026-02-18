---
name: convex-audit
description:
  Audit Convex bandwidth and function call consumption, identify optimizations, and plan fixes
argument-hint: "[focus area: bandwidth|calls|all]"
allowed-tools:
  Bash, Read, Glob, Grep, Task, WebSearch, WebFetch, AskUserQuestion, EnterPlanMode, ExitPlanMode,
  Write, mcp__convex__status, mcp__convex__tables, mcp__convex__functionSpec, mcp__convex__logs,
  mcp__convex__data, mcp__convex__runOneoffQuery, mcp__convex__envList,
  mcp__plugin_context7_context7__resolve-library-id, mcp__plugin_context7_context7__query-docs
---

# Convex Consumption Audit

Comprehensive audit of Convex bandwidth, function call volume, and subscription density. Identifies
wasteful patterns and produces an optimization plan.

## Context

- Project: Dinochron (TanStack Router + Vite SPA, Convex backend, Clerk auth)
- Backend dir: `convex/`
- Frontend dir: `src/`
- Schema: `convex/schema.ts`
- Main queries: `convex/functions/documents/queries.ts`
- Key helpers: `convex/lib/documentFilters.ts`
- Main document page: `src/routes/_authenticated/documents.tsx`
- Review page: `src/routes/_authenticated/review.tsx`

## Steps

### Phase 1: Data Collection

1. **Check Convex deployment status and recent logs** Use MCP tools to get deployment info:
   - `mcp__convex__status` to find deployments
   - `mcp__convex__logs` to sample recent function execution logs
   - `mcp__convex__tables` to see current schema and table sizes

2. **Research current Convex best practices** Use `WebSearch` and Context7 MCP to find the latest
   guidance:
   - Search: "Convex bandwidth optimization best practices 2026"
   - Search: "Convex subscription performance queries that scale"
   - Use Context7 to look up Convex docs on query patterns, `.take()` vs `.collect()`, subscription
     behavior
   - Key resource: `stack.convex.dev/queries-that-scale`
   - Key resource: `docs.convex.dev/understanding/best-practices/`

3. **Scan for known anti-patterns in the codebase** Use `Grep` and `Task` (with Explore agent) to
   find:
   - **`.collect()` calls** in `convex/` — should use `.take(N)` (search: `\.collect\(\)`)
   - **Large return types** — queries returning full documents when only subset needed
   - **N+1 subscription patterns** — multiple `useQuery` calls in loops or per-item components
   - **Unbounded reads** — queries without `.take()` or pagination
   - **Table scans** — queries using `.filter()` instead of `.withIndex()`
   - **Missing projections** — queries that return `Doc<'documents'>` to list views
   - **Duplicate subscriptions** — same query called from multiple components with identical args

### Phase 2: Analysis

4. **Analyze subscription density on key pages** Read the main page files and count distinct
   `useQuery`/`convexQuery` subscriptions:
   - `src/routes/_authenticated/documents.tsx` — main list page
   - `src/routes/_authenticated/review.tsx` — review queue
   - `src/routes/_authenticated/document.$id.tsx` — document detail
   - All sidebar components

5. **Analyze query return sizes** For each query in `convex/functions/`, check:
   - Does the `returns` validator include large fields (content, pages, extractedDates, qrCodes)?
   - Are the consumers actually using all returned fields?
   - Calculate estimated payload: count of docs \* estimated per-doc size

6. **Check index usage** For each query using `.withIndex()`:
   - Is it using the most selective index?
   - Are there compound index opportunities being missed?
   - Check `convex/schema.ts` for available indexes

7. **Identify reactive amplification** A single document mutation triggers re-evaluation of ALL
   subscriptions whose read set includes that document.
   - Count how many subscriptions share overlapping read sets
   - Identify queries that read more data than needed (widening the read set)

### Phase 3: Report

8. **Produce findings as a structured report** Create a plan file with:

   **Summary table:** | # | Issue | Category | Severity | Estimated Impact |
   |---|-------|----------|----------|-----------------|

   **For each issue, include:**
   - File and line number
   - Current code pattern (brief snippet)
   - Recommended fix
   - Expected impact (bandwidth reduction %, function call reduction %)

   **Categories:** Bandwidth, Function Calls, Both, Maintenance

   **Severity levels:**
   - CRITICAL: >20% of total consumption
   - HIGH: 10-20%
   - MEDIUM: 5-10%
   - LOW: <5%

### Phase 4: Plan

9. **Enter plan mode** with `EnterPlanMode` to design the optimization changes. Structure the plan
   with:
   - Implementation steps in dependency order
   - Parallelizable vs sequential steps
   - Expected total impact table (before/after)
   - Verification checklist
   - Critical files list

## Key Convex Principles to Check Against

| Principle                         | Source               | What to Look For                                |
| --------------------------------- | -------------------- | ----------------------------------------------- |
| Use `.take(N)` not `.collect()`   | Best Practices       | Any `.collect()` in queries                     |
| Return only needed fields         | Queries That Scale   | Full `Doc<T>` returns to list pages             |
| Minimize read set                 | How Convex Works     | Queries reading more tables/docs than needed    |
| Use full compound indexes         | Index Docs           | Partial index usage leaving remainder to filter |
| Batch lookups                     | Relationship Helpers | N+1 `ctx.db.get()` in loops                     |
| Stabilize query args              | Queries That Scale   | Args that change order on re-sort               |
| Single subscription per data need | Best Practices       | Multiple useQuery for same logical data         |

## Output

The final deliverable is an optimization plan (written to `.claude/plans/`) that the user can
approve and execute. The plan should follow the same format as previous optimization plans in
`.planning/`.
