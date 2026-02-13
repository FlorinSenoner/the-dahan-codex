# Codebase Concerns

**Analysis Date:** 2026-02-13

## Tech Debt

**Large Seed Data Files:**
- Issue: Seed data files are extremely large with manual entry patterns
- Files: `convex/seedData/openings.ts` (3,242 lines), `convex/seedData/spirits.ts` (1,141 lines)
- Impact: Difficult to maintain, error-prone manual editing, slow to parse during development
- Fix approach: Consider extracting to JSON files and loading at runtime, or implementing admin UI for bulk editing (Phase 7 planned)

**Missing Unit Tests:**
- Issue: No unit tests exist in codebase (only E2E tests)
- Files: Zero `*.test.ts` or `*.spec.ts` files in `src/` or `convex/`
- Impact: Cannot test individual functions, utilities, or components in isolation; slower feedback loop; potential for regression in non-E2E-covered code
- Fix approach: Add Vitest configuration (already in package.json but not configured), start with critical utilities like `src/lib/csv-import.ts` (250 lines) and `src/lib/offline-games.ts` (149 lines)

**Deprecated Schema Fields:**
- Issue: Schema fields marked deprecated but still present in database
- Files: `convex/schema.ts` (lines 54-64 specialRules, lines 91-96 difficulty)
- Impact: Data migration incomplete, fields take up storage, schema noise
- Fix approach: Run `npx convex run seed:reseedSpirits` on production to clean data, then remove deprecated fields from schema

**Console Logging:**
- Issue: Production code uses console.warn/error instead of proper logging infrastructure
- Files: `src/router.tsx` (line 44), `src/routes/settings.tsx` (lines 45, 73), `src/hooks/use-background-sync.ts` (lines 20, 28), multiple route loaders
- Impact: No structured logging, difficult to debug production issues, console noise in browser
- Fix approach: Implement proper error tracking service (e.g., Sentry) or structured logger with severity levels

**Legacy Migration Code:**
- Issue: One-time migration logic for owner-less records still runs on every read
- Files: `src/lib/offline-games.ts` (lines 37-40, 115-118)
- Impact: Unnecessary checks and deletions on every getAllPendingGames/getAllOfflineOps call
- Fix approach: Remove migration code after sufficient time has passed (track migration date in planning docs)

## Known Bugs

**No Critical Bugs Identified:**
- Codebase shows recent fixes for auth, offline, and E2E issues
- Recent commits focus on polish and stability improvements
- No blocking issues found in TODO/FIXME comments

## Security Considerations

**Admin Role via Public Metadata:**
- Risk: Admin status stored in Clerk public_metadata.role
- Files: `convex/lib/auth.ts` (line 34), `src/hooks/use-admin.ts`
- Current mitigation: Server-side validation via requireAdmin(ctx) in all admin mutations
- Recommendations: Defense-in-depth pattern already implemented (frontend AND backend checks). Consider moving to private_metadata for additional security layer, though public metadata is acceptable for non-critical admin features.

**External Links Security:**
- Risk: User-supplied URLs in opening guides (sourceUrl field)
- Files: `convex/schema.ts` (line 86)
- Current mitigation: Links open with `rel="noopener noreferrer"` per Phase 3 implementation
- Recommendations: Add URL validation/sanitization in mutations to prevent javascript: or data: URIs

**No CSP Implementation:**
- Risk: App lacks Content Security Policy headers
- Files: No CSP configuration in build or deployment
- Current mitigation: Cloudflare Pages provides some default protections
- Recommendations: Add CSP headers via `_headers` file for Cloudflare Pages deployment (restrict script-src, style-src, img-src)

**IndexedDB User Isolation:**
- Risk: Offline games stored in IndexedDB could leak between users on shared devices
- Files: `src/lib/offline-games.ts`
- Current mitigation: Owner ID checked on all read/write operations (lines 42, 52, 64, 120, 130, 142)
- Recommendations: Add cache clearing on sign-out to prevent data leakage

## Performance Bottlenecks

**Heavy Spirit Sync on Page Load:**
- Problem: Spirit/openings sync is heavy with many batched queries
- Files: `src/hooks/use-background-sync.ts` (line 23)
- Cause: 37 spirits + 86 openings + aspects = large query payload
- Improvement path: Already deferred to idle time via requestIdleCallback. Consider incremental sync or service worker pre-caching strategy.

**Large Route Tree Generation:**
- Problem: Route tree file regenerates on every dev server start
- Files: `src/routeTree.gen.ts` (359 lines, marked "You should NOT make any changes")
- Cause: TanStack Router generates full tree from file structure
- Improvement path: This is expected behavior for file-based routing. Consider route lazy loading if tree grows significantly larger.

**Client-Side Search Filtering:**
- Problem: Search filters all spirits client-side on every keystroke
- Files: `src/routes/spirits.index.tsx` (uses useDeferredValue for mitigation)
- Cause: Offline-first architecture requires client-side search
- Improvement path: Already optimized with useDeferredValue. Consider WebWorker for search if dataset grows beyond 100 spirits.

**CSV Import Parsing:**
- Problem: Large CSV files (100+ games) block UI during parse
- Files: `src/lib/csv-import.ts` (250 lines)
- Cause: Synchronous papaparse parsing in main thread
- Improvement path: Move to WebWorker or implement streaming parse with progress indicator

## Fragile Areas

**Opening Section Component:**
- Files: `src/components/spirits/opening-section.tsx` (468 lines)
- Why fragile: Complex state management (form data, tab selection, save handlers, validation), multiple mutation types (create/update/delete)
- Safe modification: Always test in edit mode AND view mode, verify tab switching, test URL state sync, check navigation warnings
- Test coverage: E2E tests in `e2e/admin.spec.ts` cover CRUD flows

**Game Form Component:**
- Files: `src/components/games/game-form.tsx` (476 lines)
- Why fragile: Large form with dynamic spirit array, score calculation, adversary/scenario pickers
- Safe modification: Update score calculation carefully (lines 78-101), test with 1-6 spirits, verify CSV import compatibility
- Test coverage: E2E tests in `e2e/games.spec.ts`

**Service Worker Registration:**
- Files: `src/router.tsx` (SW registration in root layout), `src/sw.ts` (injectManifest strategy)
- Why fragile: Timing-dependent (checks document.readyState), update flow requires user interaction
- Safe modification: Never change registration timing, test offline/online transitions thoroughly, verify update banner appears
- Test coverage: E2E tests in `e2e/pwa.spec.ts`

**E2E Test Helpers:**
- Files: No shared helpers found (removed after past regressions)
- Why fragile: Past issues with shared test utilities causing cascading failures across 15+ tests
- Safe modification: Grep all test files before modifying any test utility patterns, run full suite after changes
- Test coverage: 7 test files in `e2e/` directory

## Scaling Limits

**IndexedDB Storage:**
- Current capacity: Browser-dependent (typically 50-500 MB)
- Limit: Offline game storage could hit quota with 1000+ games per user
- Scaling path: Implement LRU eviction for offline games cache, warn user when approaching quota

**Convex Query Limits:**
- Current capacity: 37 spirits + 86 openings + 31 aspects = ~150 documents
- Limit: Convex queries have pagination limits (typically 100-1000 documents)
- Scaling path: Implement pagination in listSpirits query if spirit count exceeds 100

**Client-Side Rendering Performance:**
- Current capacity: Pure SPA with React 19
- Limit: Large spirit detail pages (opening guides with 20+ turns) could slow on low-end devices
- Scaling path: Implement virtualization for long opening guides, consider code splitting for admin routes

## Dependencies at Risk

**Zod v4:**
- Risk: Zod v4 is newer major version (codebase uses `zod@^4.3.6`)
- Impact: Breaking changes from v3, smaller community adoption, potential type issues
- Migration plan: Monitor for regressions, consider downgrade to v3 if validation issues arise

**TanStack Router v1:**
- Risk: Rapidly evolving library, file-based routing API changes frequently
- Impact: Route tree generation breaks, useBlocker API changes (already migrated from old API)
- Migration plan: Pin major version, test route generation after TanStack Router updates

**Workbox v7:**
- Risk: Manual service worker strategy requires maintenance as Workbox evolves
- Impact: Cache strategy updates needed, precaching patterns may change
- Migration plan: Monitor vite-plugin-pwa compatibility with Vite 7+, consider migration when stable

## Missing Critical Features

**Error Boundaries:**
- Problem: No React error boundaries exist in app
- Blocks: Graceful error recovery, production error tracking
- Priority: High

**Offline Mutation Queue:**
- Problem: Game updates/deletes fail silently when offline
- Blocks: True offline-first CRUD (currently only create is queued)
- Priority: Medium

**Game Data Backup:**
- Problem: No automatic backup of user game data
- Blocks: Data recovery after accidental deletion or account issues
- Priority: Medium

## Test Coverage Gaps

**Unit Test Coverage:**
- What's not tested: All utilities, helpers, and business logic
- Files: `src/lib/csv-import.ts`, `src/lib/offline-games.ts`, `src/lib/game-data.ts`, `src/lib/utils.ts`
- Risk: Regression in score calculation, CSV parsing, offline storage logic
- Priority: High

**E2E Coverage for Offline Flows:**
- What's not tested: Full offline game creation and sync flow
- Files: E2E tests exist (`e2e/pwa.spec.ts`) but may not cover all edge cases
- Risk: Offline game sync failures, data loss scenarios
- Priority: Medium

**Admin Route Protection:**
- What's not tested: Non-admin users attempting to access admin mutations directly
- Files: `convex/openings.ts` (protected by requireAdmin)
- Risk: Server-side protection exists but no E2E test verifies enforcement
- Priority: Low

---

*Concerns audit: 2026-02-13*
