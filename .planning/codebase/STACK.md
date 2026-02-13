# Technology Stack

**Analysis Date:** 2026-02-13

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code (frontend, backend, scripts)

**Secondary:**
- JavaScript (ESM) - Build configuration, commit hooks
- CSS - Tailwind utilities and custom styles

## Runtime

**Environment:**
- Node.js (no specific version pinned, managed per developer)
- Browser: ES2022, DOM, Web Worker APIs

**Package Manager:**
- pnpm (workspace-aware, faster than npm)
- Lockfile: `pnpm-lock.yaml` (present and committed)
- Only build dependencies mode enabled for lefthook

**Build Target:**
- ES2022 (modern browsers only)
- Module: Preserve (native ESM)
- JSX: react-jsx (React 19 automatic runtime)

## Frameworks

**Core:**
- React 19.2.4 - UI framework (latest stable)
- TanStack Router 1.159.5 - File-based routing, client-side SPA
- Convex 1.31.7 - Backend/database, real-time data sync
- Clerk 5.60.0 - Authentication and user management

**UI Components:**
- Radix UI primitives (Accordion, AlertDialog, Collapsible, Label, Popover, RadioGroup, Select, Slot, Tabs)
- shadcn/ui pattern (components in `src/components/ui/`)
- Tailwind CSS 4.1.18 - Utility-first styling
- Lucide React 0.563.0 - Icon library
- Recharts 3.7.0 - Charting library
- Sonner 2.0.7 - Toast notifications
- Vaul 1.1.2 - Drawer component
- cmdk 1.1.1 - Command palette

**State Management:**
- TanStack Query 5.90.20 - Server state, query caching
- @convex-dev/react-query 0.1.0 - Convex + TanStack Query integration
- idb-keyval 6.2.2 - IndexedDB persistence for offline data
- @tanstack/query-persist-client-core 5.91.19 - Query cache persistence

**PWA:**
- vite-plugin-pwa 1.2.0 - Service worker generation (injectManifest strategy)
- workbox-precaching 7.4.0 - Asset precaching
- workbox-routing 7.4.0 - Request routing
- workbox-strategies 7.4.0 - Cache strategies (CacheFirst, StaleWhileRevalidate)
- workbox-expiration 7.4.0 - Cache expiration policies
- workbox-window 7.4.0 - Service worker lifecycle management

**Testing:**
- Vitest 4.0.18 - Unit test runner (Vite-native)
- Playwright 1.58.2 - E2E testing framework (Chromium only)

**Build/Dev:**
- Vite 7.3.1 - Build tool and dev server
- @vitejs/plugin-react 5.1.3 - React Fast Refresh
- @tanstack/router-plugin 1.159.5 - Route tree generation
- @tailwindcss/vite 4.1.18 - Tailwind v4 Vite integration
- vite-tsconfig-paths 6.1.0 - TypeScript path aliases (@/*)

## Key Dependencies

**Critical:**
- convex 1.31.7 - Backend runtime, real-time database, auth integration
- @clerk/clerk-react 5.60.0 - Authentication provider, user sessions
- @tanstack/react-router 1.159.5 - Client-side routing, file-based routes
- @tanstack/react-query 5.90.20 - Query caching, optimistic updates
- workbox-* 7.4.0 - PWA offline functionality

**Infrastructure:**
- zod 4.3.6 - Schema validation (Convex schema definitions)
- class-variance-authority 0.7.1 - Component variant utilities
- clsx 2.1.1 - Conditional classNames
- tailwind-merge 3.4.0 - Merge Tailwind classes without conflicts
- date-fns 4.1.0 - Date manipulation and formatting
- papaparse 5.5.3 - CSV parsing (game import/export)
- react-intersection-observer 10.0.2 - Lazy loading, scroll detection

**Development:**
- @biomejs/biome 2.3.14 - Linting, formatting, import organization
- prettier 3.8.1 - Markdown/YAML formatting (Biome handles code)
- lefthook 2.1.0 - Git hooks (pre-commit, commit-msg, pre-push)
- @commitlint/cli 20.4.1 - Commit message validation
- @commitlint/config-conventional 20.4.1 - Conventional commits standard
- knip 5.83.1 - Unused code detection
- jscpd 4.0.8 - Code duplication detection
- cheerio 1.2.0 - HTML parsing (used in scraping scripts)

## Configuration

**Environment:**
- Build-time variables via Vite (import.meta.env)
- Required for production:
  - `VITE_CONVEX_URL` - Convex backend URL (https://*.convex.cloud)
  - `VITE_CLERK_PUBLISHABLE_KEY` - Clerk public key (pk_test_* or pk_live_*)
- Convex backend requires:
  - `CLERK_JWT_ISSUER_DOMAIN` - Clerk JWT issuer for auth integration
  - `GITHUB_PUBLISH_TOKEN` - GitHub PAT for auto-publish workflow dispatch
  - `GITHUB_REPO_OWNER` - Repository owner
  - `GITHUB_REPO_NAME` - Repository name
  - `GITHUB_PUBLISH_WORKFLOW` - Workflow filename (defaults to publish-public.yml)

**Build:**
- `vite.config.ts` - Vite configuration, PWA manifest, custom plugins
- `tsconfig.json` - TypeScript strict mode, ES2022 target, path aliases
- `biome.json` - Linting rules, formatting (semicolons: asNeeded, quotes: single)
- `.prettierrc` - Markdown/YAML formatting (printWidth: 100, proseWrap: always)
- `playwright.config.ts` - E2E test configuration
- `knip.config.ts` - Unused code detection configuration
- `commitlint.config.js` - Conventional commits configuration
- `lefthook.yml` - Git hooks: pre-commit (Biome, Prettier, typecheck), commit-msg (commitlint), pre-push (knip, jscpd, tests)
- `convex/auth.config.ts` - Clerk authentication integration
- `convex/schema.ts` - Database schema (single source of truth)

## Platform Requirements

**Development:**
- Node.js (ES2022+ support, no specific version pinned)
- pnpm (workspace-aware package manager)
- Convex CLI (npx convex dev for local backend)
- Git (hooks managed by lefthook)

**Production:**
- Cloudflare Pages (static hosting, CDN, preview deployments)
- Convex Cloud (serverless backend, WebSocket connections)
- Clerk (authentication service)
- GitHub Actions (CI/CD, auto-publish workflow)

**Browser Support:**
- Modern browsers with ES2022 support
- Service Worker API for PWA features
- IndexedDB for offline data persistence
- WebSocket for Convex real-time sync

---

*Stack analysis: 2026-02-13*
