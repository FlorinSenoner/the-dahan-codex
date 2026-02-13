# Coding Conventions

**Analysis Date:** 2026-02-13

## Naming Patterns

**Files:**
- Components: kebab-case (`spirit-row.tsx`, `filter-sheet.tsx`, `page-header.tsx`)
- Routes: TanStack Router conventions (`spirits.$slug.tsx`, `spirits.index.tsx`, `__root.tsx`)
- Hooks: kebab-case with `use-` prefix (`use-page-meta.ts`, `use-online-status.ts`)
- Contexts: kebab-case with `-context` suffix (`theme-context.tsx`, `edit-mode-context.tsx`)
- Utilities: kebab-case (`spirit-colors.ts`, `utils.ts`, `offline-games.ts`)
- Convex functions: kebab-case, domain-organized (`spirits.ts`, `games.ts`, `openings.ts`)

**Functions:**
- camelCase for all functions (`getBaseSpiritBySlug`, `handleSearchChange`, `applyTheme`)
- Async functions use same convention (`signInWithClerkTestUser`)
- Event handlers: `handle` prefix (`handleSearchChange`, `handleClick`)

**Variables:**
- camelCase for local and state variables (`filteredSpirits`, `activeFilterCount`, `displayName`)
- SCREAMING_SNAKE_CASE for constants (`STORAGE_KEY`, `DARK_META_COLOR`, `PLACEHOLDER_GRADIENT`)
- Uppercase for component constants (`SITE_URL`, `DEFAULT_TITLE`)

**Types:**
- PascalCase for interfaces and types (`PageMetaOptions`, `SpiritRowProps`, `Theme`)
- Inline type unions for Convex schema (`v.literal('win')`, `v.literal('loss')`)

## Code Style

**Formatting:**
- **Tool:** Biome v2.3.14
- **Key settings:**
  - Indent: 2 spaces
  - Line width: 100 characters
  - Semicolons: as-needed (ASI mode)
  - Quotes: single quotes
  - Trailing commas: always
- **Also:** Prettier for Markdown/YAML (100 char line width, prose wrap always)

**Linting:**
- **Tool:** Biome v2.3.14
- **Key rules:**
  - `noUnusedVariables`: warn
  - `noUnusedImports`: warn
  - `useExhaustiveDependencies`: warn (React hooks)
  - `noExplicitAny`: warn
  - `noDoubleEquals`: error (must use `===`)
  - `useConst`: error (prefer const)
  - `noArrayIndexKey`: off (allowed)
  - A11y: `noStaticElementInteractions`, `useKeyWithClickEvents` off (PWA mobile patterns)

## Import Organization

**Order:**
1. External packages (React, TanStack Router, Clerk, Convex)
2. Convex generated imports (`convex/_generated/api`, `convex/_generated/dataModel`)
3. Lucide React icons
4. Local components (`@/components/...`)
5. Local UI components (`@/components/ui/...`)
6. Hooks (`@/hooks`)
7. Lib utilities (`@/lib/...`)
8. Types and constants

**Path Aliases:**
- `@/*` → `./src/*` (defined in `tsconfig.json`)
- Used consistently across codebase

**Import style:**
```typescript
import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { FilterChips } from '@/components/spirits/filter-chips'
import { Button } from '@/components/ui/button'
import { usePageMeta } from '@/hooks'
import { cn } from '@/lib/utils'
```

## Error Handling

**Patterns:**
- Try-catch for storage operations (localStorage can fail):
  ```typescript
  try {
    localStorage.setItem(STORAGE_KEY, newTheme)
  } catch {
    // localStorage unavailable
  }
  ```
- Try-catch for optional loader prefetching (offline-first):
  ```typescript
  try {
    await context.queryClient.prefetchQuery(...)
  } catch (e) {
    if (e instanceof Error && !e.message.includes('Failed to fetch'))
      console.warn('Loader error:', e)
  }
  ```
- Null checks for optional Convex data (`if (!baseSpirit) return null`)
- Type guards for user input (`isTheme(value)`)

## Logging

**Framework:** `console` (no dedicated logging library)

**Patterns:**
- `console.warn` for non-critical errors (failed prefetch, storage unavailable)
- Minimal logging in production code
- Playwright tests use explicit assertions, no console logging

## Comments

**When to Comment:**
- Complex business logic (slugification, aspect matching)
- Non-obvious behavior (ASI semicolons, offline-first patterns)
- Deprecation warnings in schema (see `convex/schema.ts` lines 54-64, 91-96)
- Test explanations (why strict mode needs `.first()`, why timeouts are 15s)

**JSDoc/TSDoc:**
- Used for exported utilities:
  ```typescript
  /**
   * Convert a string to a URL-friendly slug.
   * E.g., "Spreading Hostility" -> "spreading-hostility"
   */
  export function slugify(text: string): string
  ```
- Hook documentation:
  ```typescript
  /**
   * Update document title and meta tags for the current page.
   * Falls back to defaults when component unmounts.
   */
  export function usePageMeta(...)
  ```

## Function Design

**Size:** Single responsibility, typically 10-50 lines. Complex components (route pages) may be longer.

**Parameters:**
- Prefer destructured objects for multiple params:
  ```typescript
  export function SpiritRow({ spirit, isAspect }: SpiritRowProps)
  export function usePageMeta(optionsOrTitle?: PageMetaOptions | string, legacyDescription?: string)
  ```
- Convex queries use explicit args object:
  ```typescript
  export const listSpirits = query({
    args: {
      complexity: v.optional(v.array(v.string())),
      elements: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => { ... }
  })
  ```

**Return Values:**
- Explicit return types for exported functions
- Hooks return typed values:
  ```typescript
  export function useTheme(): ThemeContextValue
  export function usePageMeta(...): void
  ```
- Convex queries return inferred types from schema

## Module Design

**Exports:**
- Named exports preferred (no default exports except React components in route files)
- Barrel files for hooks (`src/hooks/index.ts`):
  ```typescript
  export { useAdmin } from './use-admin'
  export { useEditMode } from './use-edit-mode'
  ```

**Barrel Files:**
- Used for hooks (`src/hooks/index.ts`)
- Not used for components (direct imports preferred)
- Not used for UI components (shadcn pattern: direct imports)

## TypeScript Conventions

**Strict Mode:**
- Enabled in `tsconfig.json`
- `noUnusedLocals`: true
- `noUnusedParameters`: true
- `noFallthroughCasesInSwitch`: true
- `strict`: true

**Type Inference:**
- Prefer inference for local variables
- Explicit types for function parameters and return values
- Convex schema defines source-of-truth types via `Doc<'spirits'>`, `Id<'expansions'>`

**Type Imports:**
- Use `import type` when importing only types:
  ```typescript
  import type { Doc } from 'convex/_generated/dataModel'
  import type { Page } from '@playwright/test'
  ```

## React Patterns

**Component Structure:**
- Functional components only (no class components)
- Props interface defined inline or above component
- Hooks at top of component
- Helper functions defined outside component (for stable references)
- Return JSX

**Hooks Usage:**
- `useState` for local state
- `useEffect` for side effects (DOM manipulation, event listeners)
- `useCallback` for stable function references
- `useMemo` for expensive computations
- `useSuspenseQuery` for Convex data (TanStack Query + Convex integration)
- Custom hooks follow `use` prefix convention

**State Management:**
- Local state with `useState`
- Context for theme and edit mode (`ThemeContext`, `EditModeContext`)
- TanStack Query + Convex for server state
- IndexedDB for offline persistence (via `persistQueryClient`)

## Styling Conventions

**Framework:** Tailwind CSS v4 with shadcn/ui components

**Class Composition:**
- Use `cn()` helper for conditional classes (from `clsx` + `tailwind-merge`):
  ```typescript
  className={cn(
    'flex items-center gap-4 p-4 cursor-default',
    'hover:bg-muted/50 transition-colors',
    isAspect && 'pl-8 bg-muted/10'
  )}
  ```

**Cursor Patterns:**
- `cursor-pointer` built into `Button` component
- Small interactive elements (labels, triggers): add `cursor-pointer`
- Large clickable areas (list rows): use `cursor-default` with hover states

**Responsive Design:**
- Mobile-first (base styles for mobile, breakpoints for larger screens)
- Tailwind breakpoints: `sm:`, `md:`, `lg:`
- Conditional rendering for mobile vs desktop (drawer vs popover)

**Color System:**
- Semantic tokens: `bg-background`, `text-foreground`, `border-border`
- Custom element colors: `bg-element-sun`, `text-element-fire`
- Custom complexity colors: `bg-complexity-low`, `border-complexity-high`
- Centralized in `src/lib/spirit-colors.ts`

## Convex Conventions

**File Organization:**
- Domain-based files: `spirits.ts`, `games.ts`, `openings.ts`
- Shared utilities in `lib/` subdirectory: `auth.ts`, `validators.ts`, `scoring.ts`
- Schema in `schema.ts` (source of truth)

**Query/Mutation Pattern:**
- Export named functions with `query()` or `mutation()` wrapper
- Args validated with Convex validators (`v.string()`, `v.optional()`)
- Helper functions defined at module scope (not exported)

**Schema Patterns:**
- Use `defineTable()` and `defineSchema()`
- Add indexes for common queries (`by_slug`, `by_user_date`)
- Optional fields for backward compatibility
- Deprecation comments for fields to be removed

---

*Convention analysis: 2026-02-13*
