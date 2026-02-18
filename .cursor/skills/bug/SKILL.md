---
name: bug
description: Create a structured GitHub bug report with labels
argument-hint: "<description>"
allowed-tools: Bash, AskUserQuestion, Task, Read, Glob, Grep
---

# File a Bug Report

Creates a structured GitHub issue for a bug with consistent formatting, labels, and codebase
context.

Current branch: !`git branch --show-current` Repo:
!`gh repo view --json nameWithOwner -q '.nameWithOwner' 2>/dev/null || echo "unknown"`

## Steps

1. Parse `$ARGUMENTS` to extract whatever info is already provided (description, severity, steps,
   expected/actual behavior, environment, affected area).

2. **Infer severity and environment** from the prompt context:
   - **Severity**: Infer from keywords and impact described. Default to `medium` if unclear.
     - "crash", "data loss", "can't login", "broken" → critical
     - "wrong result", "fails sometimes", "error" → major
     - "minor", "cosmetic", "typo", "alignment" → minor/cosmetic
   - **Environment**: Infer from context clues. Default to `local dev` if unclear.
     - "production", "prod", "deployed", "live" → production
     - "preview", "staging", "PR deploy" → preview deploy
     - Otherwise → local dev

3. Use `AskUserQuestion` to batch-prompt for remaining missing fields. The fields are:
   - **Steps to Reproduce**: numbered steps
   - **Expected Behavior**: what should happen
   - **Actual Behavior**: what actually happens
   - **Affected Area**: OCR/AI, Documents, Auth, UI, Backend, Infra, PWA, Smart Collections, Tags,
     Sharing

   Skip any field the user already provided in `$ARGUMENTS`. Do NOT ask for severity or environment
   — always infer them.

4. **Codebase investigation** — Use the `Task` tool with `subagent_type: "Explore"` to scan the
   codebase for context relevant to the bug. The agent should find:
   - **Route/URL**: Which route file handles the affected page (from `src/routes/`)
   - **Key source files**: Components, hooks, or Convex functions directly involved
   - **Related Convex functions**: Queries/mutations/actions that power the affected feature (from
     `convex/functions/`)
   - **Potential blast radius**: Other features or components that share the same code paths and
     could also be affected

   **Quality bar**: Only include findings that are directly relevant. Omit anything speculative.
   Prefer 3-5 precise file references over a long list. If the investigation turns up nothing useful
   beyond what the user already described, skip this section entirely.

5. Create labels idempotently (these commands are safe to re-run):

   ```bash
   gh label create "bug" --color "d73a4a" --description "Something isn't working" --force
   ```

   For severity, create the matching priority label:
   - critical →
     `gh label create "priority: critical" --color "b60205" --description "Critical priority" --force`
   - major →
     `gh label create "priority: high" --color "d93f0b" --description "High priority" --force`
   - (minor and cosmetic get no priority label)

   For each affected area, create the area label:
   - OCR/AI → `gh label create "area: ocr" --color "0075ca" --force`
   - Documents → `gh label create "area: documents" --color "0075ca" --force`
   - Auth → `gh label create "area: auth" --color "0075ca" --force`
   - UI → `gh label create "area: ui" --color "0075ca" --force`
   - Backend → `gh label create "area: backend" --color "0075ca" --force`
   - Infra → `gh label create "area: infra" --color "0075ca" --force`
   - PWA → `gh label create "area: pwa" --color "0075ca" --force`
   - Smart Collections → `gh label create "area: collections" --color "0075ca" --force`
   - Tags → `gh label create "area: metadata" --color "0075ca" --force`
   - Sharing → `gh label create "area: sharing" --color "0075ca" --force`

6. Build the label list for `--label` flag:
   - Always include `bug`
   - Add priority label if severity is critical or major
   - Add area labels for each affected area

7. Create the issue using a heredoc to preserve formatting:

   ```bash
   gh issue create --title "[Bug]: <short title>" --label "bug,<other labels>" --body "$(cat <<'EOF'
   ## Description

   <description>

   ## Steps to Reproduce

   <steps>

   ## Expected Behavior

   <expected>

   ## Actual Behavior

   <actual>

   ## Severity

   <severity>

   ## Environment

   <environment>

   ## Affected Area

   <areas as comma-separated list>

   ## Codebase Context

   **Route**: `<route path>` → `<route file>`
   **Key files**:
   - `<file>` — <one-line role>
   - ...

   **Potential blast radius**: <brief note on what else could be affected, or "Isolated — no shared code paths identified">
   EOF
   )"
   ```

   If the codebase investigation found nothing useful, replace the "Codebase Context" section with
   just `N/A`.

8. Report the issue URL and number to the user.

## Rules

- Always create labels with `--force` so the command is idempotent
- Never skip the `bug` label
- Use the exact section order above to match the GitHub Issue Form template
- Keep the issue title concise — prefix with `[Bug]: `
- If the user provides a one-liner, that becomes the title and description; still ask for missing
  fields
- **Codebase context must be precise** — only include files you are confident are relevant. 3-5 file
  references max. No padding, no maybes.
- Omit the "Codebase Context" section entirely if the investigation adds no value beyond what the
  user described
