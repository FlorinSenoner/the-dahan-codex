---
name: watchci
description: Watch CI checks, diagnose and fix failures, then merge the PR
argument-hint: "[PR number]"
allowed-tools: Bash, Read, Edit, Write, Grep, Glob
---

# Watch CI and Merge

Automates the full CI cycle: monitor checks, diagnose failures, fix, and merge.

Current PR: !`gh pr view --json number,title,url -q '"\(.number) - \(.title)\n\(.url)"' 2>/dev/null || echo "No PR found for current branch"`
Current branch: !`git branch --show-current`

## Steps

1. Determine the PR to watch:
   - If `$ARGUMENTS` is provided, use that PR number
   - Otherwise use the current branch's PR (shown above)

2. Watch CI checks until they complete:
   ```bash
   gh pr checks $PR_NUMBER --watch
   ```

3. If any checks fail:
   - Fetch failure logs: `gh run view <run_id> --log-failed`
   - Diagnose root cause — distinguish flaky/timing issues from real regressions
   - For flaky tests: fix wait conditions (use `waitForSelector`, never `networkidle`)
   - For real regressions: read source, diagnose, fix
   - Run `pnpm test:e2e` locally before pushing to avoid unnecessary CI cycles
   - Commit fix: `fix: resolve <test_name> CI failure`
   - Push and watch CI again
   - If 5 fix rounds fail on the same test, stop and report to the user

4. Once all checks are green:
   - Ask the user for confirmation before merging
   - Merge with: `gh pr merge --squash`

## Rules

- Never use `networkidle` in test fixes
- Never use inline `timeout:` in Playwright assertions
- After modifying shared test helpers, run the full E2E suite to catch cascading regressions
