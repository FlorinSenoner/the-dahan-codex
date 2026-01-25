---
type: quick
plan: 001
files_modified:
  - package.json
  - knip.json
  - lefthook.yml
  - .github/dependabot.yml
autonomous: true

must_haves:
  truths:
    - "Knip detects unused dependencies and exports"
    - "Pre-commit hook runs knip check"
    - "Dependabot opens PRs for outdated dependencies"
  artifacts:
    - path: "knip.json"
      provides: "Knip configuration for project structure"
    - path: ".github/dependabot.yml"
      provides: "Dependabot configuration for npm updates"
  key_links:
    - from: "lefthook.yml"
      to: "knip"
      via: "pre-commit hook"
      pattern: "pnpm knip"
---

<objective>
Add Knip for unused dependency/export detection and Dependabot for automated dependency updates.

Purpose: Maintain clean dependencies and stay current with security patches automatically.
Output: Knip config, Dependabot config, updated pre-commit hooks, new npm scripts.
</objective>

<context>
@package.json (current dependencies and scripts)
@lefthook.yml (current pre-commit hooks: biome, typecheck)
@tsconfig.json (project structure: app/**, *.config.ts)
@.github/workflows/ci.yml (existing CI pipeline)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add Knip with configuration and pre-commit hook</name>
  <files>package.json, knip.json, lefthook.yml</files>
  <action>
    1. Install knip as dev dependency: `pnpm add -D knip`

    2. Create knip.json with project-aware config:
       - Entry points: app/routes/*.tsx, app/client.tsx, app/router.tsx
       - Project files: app/**/*.{ts,tsx}, convex/**/*.ts, scripts/*.ts, *.config.ts
       - Ignore patterns: .planning/**, dist/**, .tanstack/**, .wrangler/**
       - Workspaces: false (single package)
       - Include compilers for tsx/ts
       - Ignore dependencies that are runtime-only or framework-managed:
         - @clerk/tanstack-react-start (used via import in routes)
         - workbox-* packages (used in scripts/generate-sw.ts)
         - convex (has generated files)

    3. Add npm scripts to package.json:
       - "knip": "knip"
       - "knip:fix": "knip --fix"

    4. Add knip to lefthook.yml pre-commit (after biome, before typecheck):
       ```yaml
       knip:
         glob: "*.{js,ts,jsx,tsx,json}"
         run: pnpm knip
       ```

    Note: Knip should run AFTER biome (formatting) but can run parallel with typecheck since both are read-only checks.
  </action>
  <verify>
    - `pnpm knip` runs without errors (may show issues - that's expected for initial run)
    - `cat knip.json` shows valid configuration
    - `cat lefthook.yml` shows knip in pre-commit
  </verify>
  <done>Knip installed, configured for project structure, integrated into pre-commit hooks</done>
</task>

<task type="auto">
  <name>Task 2: Add Dependabot configuration</name>
  <files>.github/dependabot.yml</files>
  <action>
    Create .github/dependabot.yml with:

    ```yaml
    version: 2
    updates:
      - package-ecosystem: "npm"
        directory: "/"
        schedule:
          interval: "weekly"
          day: "monday"
          time: "09:00"
          timezone: "UTC"
        open-pull-requests-limit: 10
        commit-message:
          prefix: "deps"
        groups:
          # Group minor/patch updates to reduce PR noise
          minor-and-patch:
            patterns:
              - "*"
            update-types:
              - "minor"
              - "patch"
        # Ignore major updates for framework packages (require manual review)
        ignore:
          - dependency-name: "react"
            update-types: ["version-update:semver-major"]
          - dependency-name: "react-dom"
            update-types: ["version-update:semver-major"]
          - dependency-name: "@tanstack/*"
            update-types: ["version-update:semver-major"]

      - package-ecosystem: "github-actions"
        directory: "/"
        schedule:
          interval: "weekly"
          day: "monday"
        commit-message:
          prefix: "ci"
    ```

    Configuration rationale:
    - Weekly schedule: balances freshness with PR noise
    - Grouped minor/patch: single PR for non-breaking updates
    - Major version ignores for React/TanStack: breaking changes need manual review
    - GitHub Actions updates: keep CI actions current for security
  </action>
  <verify>
    - `cat .github/dependabot.yml` shows valid YAML
    - GitHub will validate on push (syntax errors show in Settings > Code security)
  </verify>
  <done>Dependabot configured for npm and GitHub Actions with sensible grouping</done>
</task>

<task type="auto">
  <name>Task 3: Run initial Knip check and fix any issues</name>
  <files>package.json (if fixes needed)</files>
  <action>
    1. Run `pnpm knip` to see current state

    2. If unused dependencies found:
       - Review each one - some may be false positives due to framework magic
       - Add legitimate false positives to knip.json ignoreDependencies
       - Remove genuinely unused dependencies with `pnpm remove <pkg>`

    3. If unused exports found:
       - Review and either remove or add to knip.json ignoreExportsUsedInFile

    4. Run `pnpm knip` again to confirm clean state

    5. Test pre-commit hook: `pnpm lefthook run pre-commit`
  </action>
  <verify>
    - `pnpm knip` exits with code 0 (no issues)
    - `pnpm lefthook run pre-commit` completes successfully
  </verify>
  <done>Knip runs clean, pre-commit hook works, project ready for ongoing maintenance</done>
</task>

</tasks>

<verification>
- `pnpm knip` exits cleanly with no unused dependencies or exports
- `pnpm lefthook run pre-commit` runs biome, knip, and typecheck
- `.github/dependabot.yml` exists and is valid YAML
- All new scripts work: `pnpm knip`, `pnpm knip:fix`
</verification>

<success_criteria>
- Knip detects unused code (proven by clean run after fixing any issues)
- Pre-commit prevents committing with unused dependencies
- Dependabot will create weekly PRs for dependency updates
- CI continues to pass (no breaking changes to existing workflow)
</success_criteria>

<output>
After completion, create `.planning/quick/001-add-knip-and-dependabot-for-git-workflow/001-SUMMARY.md`
</output>
