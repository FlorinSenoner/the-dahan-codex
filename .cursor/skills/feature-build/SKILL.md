---
name: feature-build
description:
  Build a GitHub feature end-to-end — research, plan, implement, validate, PR. Uses git worktrees to
  isolate work.
argument-hint: "[issue URL or number] [implementation guidance]"
allowed-tools:
  Bash, Read, Edit, Write, Glob, Grep, Task, AskUserQuestion, EnterPlanMode, ExitPlanMode,
  WebSearch, WebFetch, mcp__playwright__*, mcp__claude-in-chrome__*
---

# Build a Feature

End-to-end feature implementation workflow: select → research → plan → implement → validate → PR.
Uses git worktrees so ongoing work on the current branch is never disturbed.

Repo: !`gh repo view --json nameWithOwner -q '.nameWithOwner' 2>/dev/null || echo "unknown"` Current
branch: !`git branch --show-current` Repo root: !`git rev-parse --show-toplevel`

---

## Phase 1: Select the Feature

1. Parse `$ARGUMENTS` — the string may contain an issue reference AND/OR implementation guidance:
   - **Split rule**: The first token is the issue reference if it's a number or a GitHub URL
     (contains `github.com`). Everything after the first whitespace boundary past the issue
     reference is the **guidance prompt**.
   - Examples:
     - `57 use the bulk action pattern from documents list` → issue=57, guidance="use the bulk
       action pattern from documents list"
     - `https://github.com/org/repo/issues/57 keep it minimal, no new dependencies` → issue=57,
       guidance="keep it minimal, no new dependencies"
     - `57` → issue=57, guidance=none
     - `reuse the tag selector component` → issue=none, guidance="reuse the tag selector component"
     - (empty) → issue=none, guidance=none
   - Store the guidance prompt (if any) — it will be used in Phases 3, 4, and 5.

2. **Fetch open feature requests** when no issue is specified:

   ```bash
   gh issue list --label "enhancement" --state open --limit 30 --json number,title,labels,createdAt,author
   ```

   If no issues have the `enhancement` label, fall back to all open issues:

   ```bash
   gh issue list --state open --limit 30 --json number,title,labels,createdAt,author
   ```

   Present the list to the user with `AskUserQuestion` — show issue numbers and titles, ask which
   one to build.

3. Once the issue number is known, fetch full details:
   ```bash
   gh issue view <NUMBER> --json title,body,labels,comments,assignees,state
   ```
   Parse and internalize:
   - Title, description, motivation
   - Proposed solution, alternatives considered
   - Scope, priority, affected area
   - Any comments with additional context or design decisions

---

## Phase 2: Set Up Worktree

**Always use a git worktree** so the user's current branch is untouched.

1. Determine a branch name from the issue:
   - Format: `feat/<issue-number>-<short-slug>` (e.g., `feat/57-bulk-tag-editor`)
   - Derive the slug from the issue title (lowercase, hyphens, max 5 words)

2. Determine the worktree path:

   ```bash
   REPO_ROOT=$(git rev-parse --show-toplevel)
   WORKTREE_DIR="$REPO_ROOT/../dinochron-feat-<issue-number>"
   ```

3. Create the worktree from `main`:

   ```bash
   git fetch origin main
   git worktree add -b feat/<issue-number>-<slug> "$WORKTREE_DIR" origin/main
   ```

4. Install dependencies in the worktree:

   ```bash
   cd "$WORKTREE_DIR" && pnpm install
   ```

5. **From this point on, ALL file reads, edits, writes, and commands run inside the worktree
   directory (`$WORKTREE_DIR`)**. Never modify files in the original repo root.

---

## Phase 3: Research & Design

1. **Codebase investigation** — Use the `Task` tool with `subagent_type: "Explore"` (thoroughness:
   "very thorough") to search the worktree for code related to the feature:
   - Existing patterns for similar features (how are similar things already built?)
   - Routes, components, hooks that will be extended or serve as reference
   - Convex schema, functions, and validators relevant to the area
   - Related test files and test patterns
   - Design system components available in `src/components/ui/`

2. **Online research** if needed — Use `WebSearch` to look for:
   - Best practices for the pattern being implemented
   - Library documentation for any new dependencies
   - UX patterns and examples for similar features

3. **Use specialized skills** if the feature touches specific areas:
   - Convex schema changes → think about indexes, validators, migrations
   - New UI components → think about design system consistency, accessibility
   - Auth/sharing → think about permission boundaries
   - PWA/offline → think about caching strategies

4. **Apply guidance prompt** (if provided in Phase 1): Use it to focus your research. For example,
   if the user said "reuse the tag selector component", prioritize investigating that component's
   API and patterns before exploring alternatives.

5. Summarize findings internally before proceeding.

---

## Phase 4: Plan the Implementation

1. Based on your research, draft an implementation plan. **If a guidance prompt was provided**,
   incorporate it as a constraint or direction for the implementation approach — it represents the
   user's intent for how the feature should be built.
   - **Summary**: One-paragraph overview of what will be built
   - **Architecture**: How the feature fits into the existing codebase
   - **User guidance**: (if provided) How the guidance prompt influenced the approach
   - **Schema changes**: New tables, fields, indexes (if any)
   - **Backend changes**: Convex functions to add or modify (queries, mutations, actions)
   - **Frontend changes**: Routes, components, hooks to add or modify
   - **Test strategy**: What unit tests and E2E tests to write
   - **Files to modify/create**: Exact list with brief description of each change
   - **Risk assessment**: What could go wrong, edge cases to handle

2. Present the plan to the user using `AskUserQuestion`:
   - Show the architecture overview
   - Show the proposed changes with file-level detail
   - Ask: "Does this plan look good, or would you like to discuss changes?"

3. **Wait for user approval.** Iterate on the plan if the user has feedback. Do NOT proceed to
   implementation until the user explicitly approves.

---

## Phase 5: Implement the Feature

1. Apply the changes in the worktree (`$WORKTREE_DIR`).
   - **If a guidance prompt was provided**, keep it in mind as you implement — it may specify
     preferred patterns, components to reuse, constraints, or implementation priorities.
   - Follow TDD: write tests first (RED), implement the feature (GREEN), then refactor if needed.
   - Follow all project code standards (strict TypeScript, Biome, no `any`, validators on Convex
     functions, etc.)
   - Build incrementally — get each layer working before moving to the next:
     1. Schema changes (if any)
     2. Backend functions (queries, mutations, actions)
     3. Frontend components and hooks
     4. Route integration
     5. Tests

2. Run type checking after edits:

   ```bash
   cd "$WORKTREE_DIR" && pnpm typecheck
   ```

3. Run relevant unit tests:

   ```bash
   cd "$WORKTREE_DIR" && pnpm test
   ```

4. Fix any issues that arise before moving to validation.

---

## Phase 6: Validate the Feature

1. **Visual verification**:
   - Start the dev server in the worktree if not running:
     ```bash
     cd "$WORKTREE_DIR" && npx convex dev &
     cd "$WORKTREE_DIR" && pnpm dev &
     ```
   - Use browser automation tools (Playwright MCP / Claude-in-Chrome) to navigate to the
     new/modified pages.
   - Walk through the feature's user flows end-to-end.
   - Take screenshots documenting the working feature.

2. **Automated verification**:
   - Run the full test suite to check for regressions:
     ```bash
     cd "$WORKTREE_DIR" && pnpm test
     ```
   - Run E2E tests if the feature touches critical user flows:
     ```bash
     cd "$WORKTREE_DIR" && pnpm test:e2e
     ```

3. **Edge case check**: Verify behavior for empty states, error states, and boundary conditions.

4. **If validation fails**: Go back to Phase 5, reassess, and fix. Report to the user what happened.

---

## Phase 7: User Review & Ship

1. Report to the user:
   - "The feature is implemented and validated. Here's what was built: [summary]"
   - Ask: "Would you like to review the changes before I commit and create a PR?"

2. **Wait for user approval.**

3. Once approved, finalize:

   ```bash
   cd "$WORKTREE_DIR" && pnpm check
   ```

   Fix any issues that `pnpm check` surfaces.

4. Commit, push, and create PR:

   ```bash
   cd "$WORKTREE_DIR" && git add <specific files>
   cd "$WORKTREE_DIR" && git commit -m "$(cat <<'EOF'
   feat: <concise description> (#<issue-number>)

   <longer description if needed>

   Closes #<issue-number>
   EOF
   )"
   cd "$WORKTREE_DIR" && git push -u origin feat/<issue-number>-<slug>
   cd "$WORKTREE_DIR" && gh pr create \
     --title "feat: <concise title>" \
     --body "$(cat <<'EOF'
   ## Summary
   - <what was built>
   - <key design decisions>
   - <scope of changes>

   ## Changes
   - **Schema**: <new tables/fields, or "No schema changes">
   - **Backend**: <new/modified Convex functions>
   - **Frontend**: <new/modified components and routes>
   - **Tests**: <tests added>

   ## Test plan
   - [ ] Unit tests pass
   - [ ] E2E tests pass (if applicable)
   - [ ] Manually verified feature via browser
   - [ ] Empty/error states handled

   Closes #<issue-number>
   EOF
   )"
   ```

5. Report the PR URL to the user.

6. **Optionally offer to clean up** the worktree:
   ```bash
   cd "$REPO_ROOT" && git worktree remove "$WORKTREE_DIR"
   ```
   Ask the user if they want to keep or remove the worktree.

---

## Rules

- **NEVER modify files outside the worktree.** The user's current working branch must remain
  untouched.
- **NEVER implement without user-approved plan.** Always present the plan and wait for approval.
- **NEVER commit to main.** Always work on a `feat/` branch.
- Branch name format: `feat/<issue-number>-<short-slug>`
- Follow all project code standards from CLAUDE.md (strict TS, Biome, validators, etc.)
- Use TDD: write tests first → implement → green tests
- Keep commits atomic and focused on the feature — no drive-by refactors
- Build incrementally: schema → backend → frontend → routes → tests
- `Closes #<number>` in the PR body to auto-close the issue on merge
- If the feature scope grows beyond what was planned, stop and re-align with the user
