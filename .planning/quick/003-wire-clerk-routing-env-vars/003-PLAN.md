---
phase: quick-003
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - mise.local.toml
  - app/routes/__root.tsx
  - .github/workflows/ci.yml
autonomous: true

must_haves:
  truths:
    - "Clerk routing env vars have VITE_ prefix for browser access"
    - "ClerkProvider uses routing env vars for sign-in/sign-up URLs"
    - "GitHub Actions CI/CD has routing vars as build-time env vars"
  artifacts:
    - path: "mise.local.toml"
      provides: "VITE_CLERK_* prefixed routing variables"
      contains: "VITE_CLERK_SIGN_IN_URL"
    - path: "app/routes/__root.tsx"
      provides: "ClerkProvider with routing props"
      contains: "signInUrl"
    - path: ".github/workflows/ci.yml"
      provides: "Build-time Clerk routing env vars"
      contains: "VITE_CLERK_SIGN_IN_URL"
  key_links:
    - from: "app/routes/__root.tsx"
      to: "mise.local.toml"
      via: "import.meta.env.VITE_CLERK_*"
      pattern: "import\\.meta\\.env\\.VITE_CLERK_SIGN"
---

<objective>
Wire up Clerk routing environment variables to ClerkProvider and GitHub Actions.

Purpose: Enable Clerk to use configured sign-in/sign-up URLs instead of defaults.
Output: Working Clerk routing configuration with proper VITE_ prefixes for browser access.
</objective>

<execution_context>
@./.claude/get-shit-done/workflows/execute-plan.md
@./.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@mise.local.toml
@app/routes/__root.tsx
@.github/workflows/ci.yml
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update env vars and wire ClerkProvider</name>
  <files>mise.local.toml, app/routes/__root.tsx</files>
  <action>
    1. In `mise.local.toml`, rename Clerk routing vars to have VITE_ prefix:
       - CLERK_SIGN_IN_URL -> VITE_CLERK_SIGN_IN_URL
       - CLERK_SIGN_UP_URL -> VITE_CLERK_SIGN_UP_URL
       - CLERK_SIGN_IN_FALLBACK_REDIRECT_URL -> VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
       - CLERK_SIGN_UP_FALLBACK_REDIRECT_URL -> VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL

    2. In `app/routes/__root.tsx`, update ClerkProvider to use these env vars:
       - Add signInUrl={import.meta.env.VITE_CLERK_SIGN_IN_URL}
       - Add signUpUrl={import.meta.env.VITE_CLERK_SIGN_UP_URL}
       - Add signInFallbackRedirectUrl={import.meta.env.VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL}
       - Add signUpFallbackRedirectUrl={import.meta.env.VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL}

    Note: Keep the existing publishableKey and afterSignOutUrl props.
  </action>
  <verify>
    - `pnpm typecheck` passes
    - `grep -q "VITE_CLERK_SIGN_IN_URL" mise.local.toml` returns success
    - `grep -q "signInUrl" app/routes/__root.tsx` returns success
  </verify>
  <done>
    - mise.local.toml has 4 VITE_CLERK_* routing variables
    - ClerkProvider has signInUrl, signUpUrl, signInFallbackRedirectUrl, signUpFallbackRedirectUrl props
  </done>
</task>

<task type="auto">
  <name>Task 2: Add routing vars to GitHub Actions</name>
  <files>.github/workflows/ci.yml</files>
  <action>
    Add the 4 new VITE_CLERK_* routing env vars to GitHub Actions:

    1. In the global `env:` section (around line 9), add:
       - VITE_CLERK_SIGN_IN_URL: "/sign-in"
       - VITE_CLERK_SIGN_UP_URL: "/sign-in"
       - VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: "/"
       - VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: "/"

    Note: These are NOT secrets - they are public URL paths. Hardcode the values
    directly since they are the same across environments.

    Also add these same vars to the deploy job's Build step env section (around line 94)
    to ensure they're available during production build.
  </action>
  <verify>
    - `grep -q "VITE_CLERK_SIGN_IN_URL" .github/workflows/ci.yml` returns success
    - YAML syntax valid (no linting errors)
  </verify>
  <done>
    - CI workflow global env has 4 VITE_CLERK_* routing vars with hardcoded paths
    - Deploy job build step has 4 VITE_CLERK_* routing vars with hardcoded paths
  </done>
</task>

</tasks>

<verification>
1. `pnpm typecheck` passes
2. `pnpm lint` passes
3. All 4 VITE_CLERK_* vars present in mise.local.toml
4. ClerkProvider has all routing props
5. GitHub Actions workflow has routing vars in both CI and deploy jobs
</verification>

<success_criteria>
- Clerk routing env vars properly prefixed with VITE_ for browser access
- ClerkProvider configured with all routing URLs
- GitHub Actions CI/CD will use routing vars during build
- Typecheck and lint pass
</success_criteria>

<output>
After completion, create `.planning/quick/003-wire-clerk-routing-env-vars/003-SUMMARY.md`
</output>
