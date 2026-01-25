# Phase 1: Foundation & Authentication - Context

**Gathered:** 2025-01-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Validated tech stack with TanStack Start, Convex, Clerk auth, PWA generation, and Cloudflare deployment working in CI. User can sign in, see authenticated state persist, and access public routes without login. Service worker generated and validated. Pre-commit hooks and CI pipeline operational.

</domain>

<decisions>
## Implementation Decisions

### Auth UX Flow
- Dedicated `/sign-in` page (not modal) — simpler, mobile-friendly, SSR-ready
- Combined sign-in/sign-up on single page — Clerk auto-detects new vs existing
- Return to original page after successful sign-in (preserve navigation context)
- Avatar in header/nav shows signed-in state — tap for menu with sign-out
- Sign-in methods: Google + Email/Password
- App logo + name branding on sign-in page
- Reference data is public (spirits, openings) — no login required
- User-only features show inline prompt: "Sign in to track games" where feature would be

### Error Experience
- Auth errors: inline on form below the field that caused it
- Convex connection drops: subtle "reconnecting..." indicator + auto-retry (not banner)
- 404s: friendly error page with navigation back to relevant list
- Unexpected errors: friendly message only ("Something went wrong. Please try again.") — no technical details in production
- Always preserve form input on submission failure
- Loading states: nothing visible until loaded — reserve blank space to prevent layout shifts
- If loading exceeds 3 seconds: show notification banner
- Optimistic updates for actions — assume success, rollback on failure

### PWA Install Prompt
- Trigger: after engagement (e.g., viewed 2-3 spirits), not on first visit
- Style: non-intrusive bottom banner
- Message: emphasize both offline access AND quick launch
- Dismissal: respect for 30 days, then show once more

### Dev Workflow
- Local auth: real Clerk dev instance (not bypassed)
- Seed data: minimal — 2-3 spirits (River Surges, Lightning's Swift Strike, +1 TBD)
- HMR: critical — must be sub-second updates
- `pnpm dev`: single command starts app + Convex + everything needed

### GitHub Workflow
- Push to main: full CI (lint, typecheck, test, build) + auto-deploy to production
- PRs: all checks must pass before merge (enforced, no bypass)
- PR previews: yes — each PR gets preview URL on Cloudflare
- Pre-commit hooks: full checks (lint, format, typecheck) on staged files

### Deployment
- Domain: Cloudflare subdomain (*.workers.dev) for v1
- Environments: production only — PR previews serve as staging
- Secrets: GitHub Secrets for CI, Cloudflare env vars for runtime
- Failed deployments: auto-rollback to previous version

### Claude's Discretion
- Exact HMR configuration approach
- Specific pre-commit hook tooling (husky, lefthook, etc.)
- Health check implementation for rollback trigger
- Third seed spirit choice

</decisions>

<specifics>
## Specific Ideas

- "Make sure there is enough blank space to prevent layout shifts" — reserved space for loading content
- Loading notification banner only appears after 3 seconds (fast loads should feel instant)
- Console logging for errors in v1 (no external service yet)

</specifics>

<deferred>
## Deferred Ideas

- Sentry error tracking — add in v2
- Custom domain — set up after v1 validates

</deferred>

---

*Phase: 01-foundation-authentication*
*Context gathered: 2025-01-25*
