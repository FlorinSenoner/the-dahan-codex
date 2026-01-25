---
phase: quick-002
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - app/routes/__root.tsx
  - app/routes/index.tsx
  - app/routes/_authenticated/profile.tsx
autonomous: true

must_haves:
  truths:
    - "No deprecation warnings for afterSignOutUrl on UserButton"
    - "Sign out still redirects to / (home page)"
  artifacts:
    - path: "app/routes/__root.tsx"
      provides: "ClerkProvider with afterSignOutUrl configuration"
      contains: "afterSignOutUrl"
    - path: "app/routes/index.tsx"
      provides: "UserButton without deprecated prop"
    - path: "app/routes/_authenticated/profile.tsx"
      provides: "UserButton without deprecated prop"
  key_links:
    - from: "ClerkProvider"
      to: "UserButton"
      via: "afterSignOutUrl global config"
---

<objective>
Fix deprecated afterSignOutUrl property on UserButton component

Purpose: The afterSignOutUrl prop on UserButton is deprecated in Clerk v5.x. The prop should be moved to ClerkProvider as a global configuration.

Output: UserButton components without deprecated prop, ClerkProvider with global afterSignOutUrl config
</objective>

<execution_context>
@./.claude/get-shit-done/workflows/execute-plan.md
@./.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Move afterSignOutUrl to ClerkProvider</name>
  <files>app/routes/__root.tsx</files>
  <action>
Add afterSignOutUrl="/" prop to the ClerkProvider component.

Change from:
```tsx
<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
```

To:
```tsx
<ClerkProvider
  publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
  afterSignOutUrl="/"
>
```
  </action>
  <verify>File contains afterSignOutUrl="/" on ClerkProvider</verify>
  <done>ClerkProvider has global afterSignOutUrl configuration</done>
</task>

<task type="auto">
  <name>Task 2: Remove deprecated prop from UserButton usages</name>
  <files>app/routes/index.tsx, app/routes/_authenticated/profile.tsx</files>
  <action>
Remove the afterSignOutUrl="/" prop from both UserButton component usages.

In app/routes/index.tsx line 88, change:
```tsx
<UserButton afterSignOutUrl="/" />
```
To:
```tsx
<UserButton />
```

In app/routes/_authenticated/profile.tsx line 14, change:
```tsx
<UserButton afterSignOutUrl="/" /></div>
```
To:
```tsx
<UserButton /></div>
```
  </action>
  <verify>grep -r "afterSignOutUrl" app/routes/ returns only __root.tsx</verify>
  <done>UserButton components no longer use deprecated afterSignOutUrl prop</done>
</task>

</tasks>

<verification>
1. `pnpm exec tsc --noEmit` - TypeScript compiles without errors
2. `pnpm run dev` - App starts without console warnings about deprecated props
3. Sign out functionality still redirects to home page
</verification>

<success_criteria>
- afterSignOutUrl is configured globally on ClerkProvider
- No UserButton components use the deprecated afterSignOutUrl prop
- Sign out behavior unchanged (redirects to /)
- No TypeScript errors
</success_criteria>

<output>
After completion, create `.planning/quick/002-fix-deprecated-aftersignouturl-property-/002-SUMMARY.md`
</output>
