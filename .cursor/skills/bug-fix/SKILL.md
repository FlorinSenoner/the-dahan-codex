---
name: bug-fix
description:
  Fix a GitHub bug end-to-end — triage, reproduce, plan, fix, validate, PR. Uses git worktrees to
  isolate work.
argument-hint: "[issue URL or number] [implementation guidance]"
allowed-tools:
  Bash, Read, Edit, Write, Glob, Grep, Task, AskUserQuestion, EnterPlanMode, ExitPlanMode,
  WebSearch, WebFetch, mcp__playwright__*, mcp__claude-in-chrome__*
---

# Fix GitHub Bug

End-to-end bug fixing workflow: triage → reproduce → plan → fix → validate → PR. Uses git worktrees
so ongoing work on the current branch is never disturbed.

Repo: !`gh repo view --json nameWithOwner -q '.nameWithOwner' 2>/dev/null || echo "unknown"` Current
branch: !`git branch --show-current` Repo root: !`git rev-parse --show-toplevel`

---

## Phase 1: Select the Bug

1. Parse `$ARGUMENTS` — the string may contain an issue reference AND/OR implementation guidance:
   - **Split rule**: The first token is the issue reference if it's a number or a GitHub URL
     (contains `github.com`). Everything after the first whitespace boundary past the issue
     reference is the **guidance prompt**.
   - Examples:
     - `42 focus on the error handling in upload` → issue=42, guidance="focus on the error handling
       in upload"
     - `https://github.com/org/repo/issues/42 check the R2 cleanup path` → issue=42, guidance="check
       the R2 cleanup path"
     - `42` → issue=42, guidance=none
     - `look at the debounce logic in search` → issue=none, guidance="look at the debounce logic in
       search"
     - (empty) → issue=none, guidance=none
   - Store the guidance prompt (if any) — it will be used in Phases 3, 5, and 6.

2. **Fetch open bugs** when no issue is specified:

   ```bash
   gh issue list --label "bug" --state open --limit 30 --json number,title,labels,createdAt,author
   ```

   If no issues have the `bug` label, fall back to all open issues:

   ```bash
   gh issue list --state open --limit 30 --json number,title,labels,createdAt,author
   ```

   Present the list to the user with `AskUserQuestion` — show issue numbers and titles, ask which
   one to fix.

3. Once the issue number is known, fetch full details:
   ```bash
   gh issue view <NUMBER> --json title,body,labels,comments,assignees,state
   ```
   Parse and internalize:
   - Title, description, steps to reproduce
   - Expected vs actual behavior
   - Severity, affected area
   - Any comments with additional context or workarounds

---

## Phase 2: Set Up Worktree

**Always use a git worktree** so the user's current branch is untouched.

1. Determine a branch name from the issue:
   - Format: `fix/<issue-number>-<short-slug>` (e.g., `fix/42-sidebar-crash`)
   - Derive the slug from the issue title (lowercase, hyphens, max 5 words)

2. Determine the worktree path:

   ```bash
   REPO_ROOT=$(git rev-parse --show-toplevel)
   WORKTREE_DIR="$REPO_ROOT/../dinochron-fix-<issue-number>"
   ```

3. Create the worktree from `main`:

   ```bash
   git fetch origin main
   git worktree add -b fix/<issue-number>-<slug> "$WORKTREE_DIR" origin/main
   ```

4. Install dependencies in the worktree:

   ```bash
   cd "$WORKTREE_DIR" && pnpm install
   ```

5. **From this point on, ALL file reads, edits, writes, and commands run inside the worktree
   directory (`$WORKTREE_DIR`)**. Never modify files in the original repo root.

---

## Phase 3: Understand & Research

1. **Codebase investigation** — Use the `Task` tool with `subagent_type: "Explore"` (thoroughness:
   "very thorough") to search the worktree for code related to the bug:
   - Routes, components, hooks involved
   - Convex functions (queries/mutations/actions)
   - Related test files
   - Recent git history for the affected files (`git log --oneline -10 -- <file>`)

2. **Online research** if needed — Use `WebSearch` to look for:
   - Known issues in dependencies
   - Similar bugs in library issue trackers
   - Relevant documentation or migration guides

3. **Use specialized skills** if the bug touches specific areas:
   - Convex-related → think about schema, indexes, validators
   - UI/UX → think about component structure, state management
   - Auth → think about Clerk integration, permission checks
   - PWA → think about service worker, caching

4. **Apply guidance prompt** (if provided in Phase 1): Use it to focus your research. For example,
   if the user said "check the R2 cleanup path", prioritize investigating R2-related code and
   deletion flows over other areas.

5. Summarize findings internally before proceeding.

---

## Phase 4: Reproduce the Bug

**You must reproduce the bug before planning a fix.**

1. **For UI bugs**:
   - Start the dev server in the worktree if not running:
     ```bash
     cd "$WORKTREE_DIR" && npx convex dev &
     cd "$WORKTREE_DIR" && pnpm dev &
     ```
   - Use browser automation tools (Playwright MCP / Claude-in-Chrome) to navigate to the affected
     page and follow the reproduction steps from the issue.
   - Take a screenshot documenting the broken state.

2. **For backend/logic bugs**:
   - Write a minimal failing test case if one doesn't exist, or run existing tests that cover the
     affected area:
     ```bash
     cd "$WORKTREE_DIR" && pnpm test -- --grep "<relevant pattern>"
     ```
   - Or use the Convex MCP tools to query data and verify the broken behavior.

3. **For bugs you cannot reproduce**:
   - Document what you tried and report back to the user.
   - Ask if they have additional context or environment-specific details.
   - Do NOT proceed to fix something you cannot reproduce without explicit user approval.

---

## Phase 5: Plan the Fix

1. Based on your understanding and reproduction, draft a fix plan. **If a guidance prompt was
   provided**, incorporate it as a constraint or direction for the fix approach — it represents the
   user's intent for how the fix should be shaped.
   - **Root cause**: What exactly is broken and why
   - **Fix approach**: What changes to make and where (specific files + line ranges)
   - **User guidance**: (if provided) How the guidance prompt influenced the approach
   - **Test strategy**: What tests to add or modify to prevent regression
   - **Risk assessment**: What else could break, blast radius
   - **Files to modify**: Exact list with brief description of each change

2. Present the plan to the user using `AskUserQuestion`:
   - Show the root cause analysis
   - Show the proposed fix with file-level detail
   - Ask: "Does this plan look good, or would you like to discuss changes?"

3. **Wait for user approval.** Iterate on the plan if the user has feedback. Do NOT proceed to
   implementation until the user explicitly approves.

---

## Phase 6: Implement the Fix

1. Apply the changes in the worktree (`$WORKTREE_DIR`).
   - **If a guidance prompt was provided**, keep it in mind as you implement — it may specify
     preferred approaches, areas to focus on, or constraints to respect.
   - Follow TDD: write/update tests first (RED), then implement the fix (GREEN), then refactor if
     needed.
   - Follow all project code standards (strict TypeScript, Biome, no `any`, validators on Convex
     functions, etc.)

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

## Phase 7: Validate the Fix

1. **For UI bugs**:
   - Use browser automation to navigate to the affected page again.
   - Follow the same reproduction steps — verify the bug is gone.
   - Take a screenshot documenting the fixed state.
   - Compare before/after if possible.

2. **For backend/logic bugs**:
   - Run the failing test from Phase 4 — it should now pass.
   - Run the full test suite to check for regressions:
     ```bash
     cd "$WORKTREE_DIR" && pnpm test
     ```

3. **If the fix doesn't work**: Go back to Phase 5, reassess, and try a different approach. Report
   to the user what happened.

---

## Phase 8: User Review & Ship

1. Report to the user:
   - "The fix is validated and working. Here's what changed: [summary]"
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
   fix: <concise description> (#<issue-number>)

   <longer description if needed>

   Closes #<issue-number>
   EOF
   )"
   cd "$WORKTREE_DIR" && git push -u origin fix/<issue-number>-<slug>
   cd "$WORKTREE_DIR" && gh pr create \
     --title "fix: <concise title>" \
     --body "$(cat <<'EOF'
   ## Summary
   - <what was broken>
   - <what was the root cause>
   - <what the fix does>

   ## Test plan
   - [ ] Existing tests pass
   - [ ] New regression test added
   - [ ] Manually verified fix via browser (if UI bug)

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
- **NEVER skip reproduction.** If you can't reproduce it, report back before attempting a fix.
- **NEVER implement without user-approved plan.** Always present the plan and wait for approval.
- **NEVER commit to main.** Always work on a `fix/` branch.
- Branch name format: `fix/<issue-number>-<short-slug>`
- Follow all project code standards from CLAUDE.md (strict TS, Biome, validators, etc.)
- Use TDD: failing test → fix → green tests
- Keep commits atomic and focused on the bug fix — no drive-by refactors
- `Closes #<number>` in the PR body to auto-close the issue on merge
