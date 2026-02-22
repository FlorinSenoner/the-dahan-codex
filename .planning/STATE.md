# Project State

## Project Reference

See: .planning/PROJECT.md

**Core value:** Text-based opening guides for Spirit Island spirits
**Current focus:** All planned phases complete (except Phase 7 on hold)

## Current Position

Phase: 8 (Spirit & Aspect Data Scraping)
Plan: 6 of 6 Complete
Status: Complete
Last activity: 2026-02-04 - Verified DB matches seed data, docs cleanup

Progress: [##################################################] 100% (105/105 plans complete, excl. abandoned 3.4)

## Performance Metrics

**Velocity (Phases 1–6.1, tracked during execution):**

| Phase | Plans | Total  | Avg/Plan |
| ----- | ----- | ------ | -------- |
| 01    | 7     | 81 min | 11.6 min |
| 02    | 7     | 20 min | 2.9 min  |
| 02.1  | 6     | 28 min | 4.7 min  |
| 03    | 5     | 20 min | 4.0 min  |
| 03.1  | 5     | 38 min | 7.6 min  |
| 03.2  | 6     | 18 min | 3.0 min  |
| 03.3  | 2     | 4 min  | 2.0 min  |
| 03.4  | 7     | 22 min | 3.1 min  |
| 03.6  | 8     | 23 min | 2.9 min  |
| 04    | 9     | 26 min | 2.9 min  |
| 05    | 9     | 31 min | 3.4 min  |
| 06    | 10    | 50 min | 5.0 min  |
| 06.1  | 3     | 16 min | 5.3 min  |

_Note: Phases 6.2 (7 plans) and 8 (6 plans) completed but timing not tracked._

## Key Architecture Decisions

These are the important architectural decisions that deviate from the original research
or have significant implications. For detailed per-phase decisions, see phase SUMMARY files.

- **Client-only SPA** (quick-010): Removed TanStack Start SSR. No SEO benefit, SSR added Clerk/Convex
  hydration complexity. Deploy to Cloudflare Pages (not Workers).
- **vite-plugin-pwa with injectManifest**: Uses `src/sw.ts` as service worker source.
  vite-plugin-pwa generates SW from TypeScript (not manual Workbox scripts).
- **idb-keyval for offline persistence** (not Dexie.js): Simpler key-value storage sufficient for
  TanStack Query cache persistence.
- **Text-based openings** (Phase 3.6): Abandoned graphical board visualization (growth panels,
  presence tracks, innate powers, cards). Too complex for all spirit patterns. Simple text-based
  turn-by-turn guides serve users better.
- **Outbox pattern for offline writes**: Pending games stored in IndexedDB, synced when online.
- **Auth cache isolation**: Clear persisted query cache on user identity change to prevent data leaks.
- **Game routes use Clerk `useAuth()`** for cache-first rendering; `_authenticated` layout uses
  `useConvexAuth()` where Convex auth is required.

## Data Status

- 37 base spirits seeded from wiki scrape
- 31 aspects seeded from wiki scrape
- 68 spirit images downloaded
- 85 opening guides from 7+ community sources
- Raw opening source datasets preserved under `scripts/data/*openings*.json`
- Consolidated raw opening lookup archive at `scripts/data/openings-raw-by-source.json`
- 7 expansions (Base Game through Nature Incarnate)


## Pending Todos

None yet.

## Quick Tasks Completed

| #   | Description                                | Date       | Commit  |
| --- | ------------------------------------------ | ---------- | ------- |
| 001 | Add knip and dependabot for git workflows  | 2026-01-25 | 04652f7 |
| 002 | Fix deprecated afterSignOutUrl property    | 2026-01-25 | e1c7a8c |
| 003 | Wire Clerk routing env vars                | 2026-01-25 | b00528b |
| 004 | Improve deployment workflow                | 2026-01-25 | 23c1c3e |
| 005 | Fix Clerk sign-in e2e test selector        | 2026-01-25 | 8a054ec |
| 006 | Create README.md and update CLAUDE.md      | 2026-01-25 | 8bf08bd |
| 007 | Add typography and reusable UI components  | 2026-01-26 | 187fc2a |
| 009 | Rework element and complexity colors       | 2026-01-26 | 8843491 |
| 010 | Switch to client-only SPA                  | 2026-01-26 | 32bf3ed |
| 011 | Fix view transitions and aspect URLs       | 2026-01-26 | 5a25c3e |
| 012 | Fix Cloudflare CI auth error               | 2026-01-26 | 8b3f308 |
| 013 | Game tracker UI polish and CSV import fix  | 2026-02-01 | 67b32cf |

## Roadmap Evolution

- Phase 2.1 inserted: Spirit Library Polish
- Phase 3.1 inserted: Spirit Board Polish
- Phase 3.2 inserted: Spirit Board Refinements
- Phase 3.3 inserted: Spirit Board Final Polish
- Phase 3.4 ABANDONED: Graph DSL approach too complex
- Phase 3.6 inserted: Simplify Spirit Board + Text Openings (PIVOT)
- Phase 5 changed: "Opening Scrubber" → "Text Opening Management"
- Phase 6.1 inserted: Cleanup TheDahanCodex (SSR removal, dead code)
- Phase 6.2 inserted: Fix Code Duplication (jscpd clones)
- Phase 7 marked "On Hold" - seed data admin UI deferred
- Phase 8 added: Spirit & Aspect Data Scraping

## Blockers/Concerns

- iOS PWA testing needed (cache purging behavior)
- Placeholder icons need replacement with branded artwork (low priority)

## Session Continuity

Last session: 2026-02-13
Stopped at: Documentation cleanup - removed .planning/research/, updated all docs, resolved debug files.
Resume file: None

---

_Updated: 2026-02-22_
