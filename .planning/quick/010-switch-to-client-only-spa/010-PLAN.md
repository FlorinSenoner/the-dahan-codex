---
id: quick-010
title: Switch to Client-Only SPA with Cloudflare Pages
type: quick
status: planned
priority: high
files_modified:
  - package.json
  - vite.config.ts
  - app/client.tsx
  - app/router.tsx
  - app/routes/__root.tsx
  - index.html
  - .github/workflows/ci.yml
  - .github/workflows/deploy.yml
  - scripts/generate-sw.ts
files_deleted:
  - app/start.ts
  - app/lib/convex.ts
---

<objective>
Convert The Dahan Codex from TanStack Start (SSR on Cloudflare Workers) to a pure client-side SPA deployed on Cloudflare Pages.

Purpose: Simplify architecture by removing SSR complexity, eliminate Clerk/Convex hydration issues, reduce hosting costs (Pages is cheaper than Workers).

Output: A client-only React SPA with:
- Standard Vite build (no SSR)
- TanStack Router (client-side only)
- Cloudflare Pages deployment
- Simpler auth flow (no server-side token fetching)
</objective>

<context>
@./CLAUDE.md
@./package.json
@./vite.config.ts
@./app/router.tsx
@./app/routes/__root.tsx
@./app/client.tsx
@./app/start.ts
@./.github/workflows/deploy.yml
</context>

<tasks>

<task type="auto">
  <name>Task 1: Convert to Pure Client SPA</name>
  <files>
    - package.json
    - vite.config.ts
    - index.html (create)
    - app/client.tsx
    - app/router.tsx
    - app/routes/__root.tsx
    - app/start.ts (delete)
    - app/lib/convex.ts (delete if exists)
  </files>
  <action>
    **1. Create index.html at project root:**
    ```html
    <!DOCTYPE html>
    <html lang="en" class="dark">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#1a1a1a" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <title>The Dahan Codex</title>
      </head>
      <body class="min-h-screen bg-background font-body antialiased">
        <div id="root"></div>
        <script type="module" src="/app/client.tsx"></script>
      </body>
    </html>
    ```

    **2. Update app/client.tsx for standard React mount:**
    - Change from `hydrateRoot` to `createRoot` (no hydration needed)
    - Import and render router directly instead of StartClient
    - Import the CSS file here

    **3. Update app/router.tsx:**
    - Remove `routerWithQueryClient` wrapper (SSR feature)
    - Use plain `createTanStackRouter` with QueryClientProvider in Wrap
    - Keep Convex setup as-is (works great client-side)

    **4. Update app/routes/__root.tsx:**
    - DELETE the `fetchClerkAuth` server function entirely
    - DELETE the `beforeLoad` that fetches auth (client handles this)
    - Remove `auth` import from @clerk/tanstack-react-start/server
    - Remove `createServerFn` import
    - Remove `HeadContent` and `Scripts` components (using index.html now)
    - Keep ClerkProvider, ConvexProviderWithClerk setup
    - RootDocument should just return children with the BottomNav (no html/head/body)

    **5. Update vite.config.ts:**
    - Remove `cloudflare` plugin import and usage
    - Remove `tanstackStart` plugin import and usage
    - Keep: tailwindcss, tsConfigPaths, viteReact
    - Set `build.outDir: 'dist'`
    - Add `base: '/'` for proper asset paths

    **6. Update package.json:**
    - Remove dependencies: `@clerk/tanstack-react-start`, `@tanstack/react-start`, `@cloudflare/vite-plugin`, `wrangler`
    - Keep: `@clerk/clerk-react`, `@tanstack/react-router`, `@tanstack/react-router-with-query`, all Convex deps
    - Update scripts:
      - `"dev": "vite"`
      - `"build": "vite build && pnpm generate-sw"`
      - `"preview": "vite preview"`
      - Remove `"deploy"` script (Pages handles this)

    **7. Delete SSR files:**
    - Delete `app/start.ts` (server entry point)
    - Delete `app/lib/convex.ts` if it exists (SSR helper)

    **8. Update scripts/generate-sw.ts:**
    - Change `outputDir` from `dist/client` to `dist`
  </action>
  <verify>
    - `pnpm install` succeeds
    - `pnpm dev` starts Vite dev server
    - App loads at http://localhost:3000 (or 5173)
    - No SSR-related errors in console
    - Clerk auth still works (sign in flow)
    - Convex queries still work (spirits list loads)
  </verify>
  <done>
    App runs as pure client-side SPA with working auth and data fetching.
  </done>
</task>

<task type="auto">
  <name>Task 2: Update CI/CD for Cloudflare Pages</name>
  <files>
    - .github/workflows/ci.yml
    - .github/workflows/deploy.yml
  </files>
  <action>
    **1. Update .github/workflows/ci.yml:**
    - Change service worker path check from `dist/client/sw.js` to `dist/sw.js`
    - Everything else stays the same

    **2. Rewrite .github/workflows/deploy.yml for Cloudflare Pages:**
    - Remove CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID from validation (Pages uses different auth)
    - Remove wrangler-action usage
    - Use `cloudflare/pages-action@v1` instead:
      ```yaml
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: the-dahan-codex
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
      ```
    - For preview deployments, Pages automatically creates preview URLs for PRs
    - Remove the manual "Comment Preview URL on PR" step (Pages does this automatically)
    - Update preview URL format in any remaining comments to use `*.pages.dev` pattern
    - Keep Convex deploy step as-is

    **3. Handle SPA routing:**
    - Create `public/_redirects` file with content: `/* /index.html 200`
    - This tells Cloudflare Pages to serve index.html for all routes (SPA catch-all)
  </action>
  <verify>
    - CI workflow syntax is valid: `act -n` or push to branch
    - Local build produces `dist/sw.js` and `dist/index.html`
    - `dist/_redirects` exists with SPA catch-all rule
  </verify>
  <done>
    CI validates build correctly, deploy workflow configured for Cloudflare Pages with SPA routing.
  </done>
</task>

<task type="auto">
  <name>Task 3: Final Verification and Cleanup</name>
  <files>
    - tsconfig.json (if needed)
    - CLAUDE.md
    - Any remaining SSR references
  </files>
  <action>
    **1. Run full verification:**
    ```bash
    pnpm lint:fix
    pnpm typecheck
    pnpm build
    pnpm preview
    ```

    **2. Test locally:**
    - Navigate to spirits list
    - Navigate to spirit detail
    - Test back navigation
    - Test filter functionality
    - Verify service worker registration (check DevTools > Application > Service Workers)

    **3. Update CLAUDE.md:**
    - Update tech stack section: "Cloudflare Pages" instead of "Cloudflare Workers"
    - Update commands section: Remove wrangler-related commands
    - Update deploy command or remove it (Pages auto-deploys from GitHub)

    **4. Clean up any remaining SSR references:**
    - Search for `createServerFn` - should not exist
    - Search for `@clerk/tanstack-react-start` - should not exist
    - Search for `@tanstack/react-start` - should not exist
    - Search for `wrangler` - should not exist (except maybe in docs)

    **5. Run knip to find dead code:**
    ```bash
    pnpm knip
    ```
  </action>
  <verify>
    - `pnpm ci` passes completely
    - No TypeScript errors
    - No unused dependencies flagged by knip
    - Preview server serves app correctly with client-side routing
  </verify>
  <done>
    Clean, working client-only SPA ready for Cloudflare Pages deployment.
  </done>
</task>

</tasks>

<verification>
- [ ] `pnpm install` - no missing dependencies
- [ ] `pnpm lint` - no lint errors
- [ ] `pnpm typecheck` - no type errors
- [ ] `pnpm build` - produces `dist/` with index.html and sw.js
- [ ] `pnpm preview` - app loads and works
- [ ] Client-side routing works (navigate between pages, refresh works)
- [ ] Clerk auth works (can sign in/out)
- [ ] Convex data loads (spirits list and detail)
- [ ] Service worker registers (check DevTools)
- [ ] No SSR-related code remains
</verification>

<success_criteria>
1. App is 100% client-rendered (no SSR)
2. All features work: spirits list, detail, filters, auth
3. CI passes with new build output paths
4. Deploy workflow uses cloudflare/pages-action
5. No @tanstack/react-start or @clerk/tanstack-react-start dependencies
6. Service worker generates at dist/sw.js
</success_criteria>
