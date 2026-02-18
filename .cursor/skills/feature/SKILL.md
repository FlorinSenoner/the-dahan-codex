---
name: feature
description: Create a structured GitHub feature request with labels
argument-hint: "<description>"
allowed-tools: Bash, AskUserQuestion, Task, Read, Glob, Grep
---

# File a Feature Request

Creates a structured GitHub issue for a feature with consistent formatting, labels, and codebase
context.

Current branch: !`git branch --show-current` Repo:
!`gh repo view --json nameWithOwner -q '.nameWithOwner' 2>/dev/null || echo "unknown"`

## Steps

1. Parse `$ARGUMENTS` to extract whatever info is already provided (description, motivation,
   proposed solution, alternatives, scope, priority, affected area).

2. **Infer scope and priority** from the prompt context:
   - **Scope**: Infer from the breadth of changes described. Default to `medium` if unclear.
     - "button", "label", "tooltip", "tweak", "color" → small
     - "page", "form", "dialog", "filter", "sort" → medium
     - "workflow", "integration", "architecture", "migration", "system" → large
   - **Priority**: Infer from urgency and impact. Default to `should-have` if unclear.
     - "blocker", "critical", "need", "required", "must" → must-have
     - "would be nice", "eventually", "low priority", "someday" → nice-to-have
     - Otherwise → should-have

3. Use `AskUserQuestion` to batch-prompt for remaining missing fields. The fields are:
   - **Motivation**: Why is this feature needed? What problem does it solve?
   - **Proposed Solution**: How should this work? (numbered steps or description)
   - **Alternatives Considered**: Other approaches thought about (optional — skip if user says none)
   - **Affected Area**: OCR/AI, Documents, Auth, UI, Backend, Infra, PWA, Smart Collections, Tags,
     Sharing

   Skip any field the user already provided in `$ARGUMENTS`. Do NOT ask for scope or priority —
   always infer them.

4. **Codebase investigation** — Use the `Task` tool with `subagent_type: "Explore"` to scan the
   codebase for context relevant to the feature. The agent should find:
   - **Existing related code**: Components, hooks, Convex functions, or routes that already handle
     similar functionality
   - **Extension points**: Where the new feature would likely plug in (routes, schemas, UI
     components)
   - **Schema impact**: Whether new tables, fields, or indexes would be needed in `convex/schema.ts`
   - **Potential overlap**: Existing features that might conflict with or complement this request

   **Quality bar**: Only include findings that are directly relevant. Omit anything speculative.
   Prefer 3-5 precise file references over a long list. If the investigation turns up nothing useful
   beyond what the user already described, skip this section entirely.

5. Create labels idempotently (these commands are safe to re-run):

   ```bash
   gh label create "enhancement" --color "a2eeef" --description "New feature or improvement" --force
   ```

   For priority, create the matching label:
   - must-have →
     `gh label create "priority: high" --color "d93f0b" --description "High priority" --force`
   - should-have → (no priority label)
   - nice-to-have → (no priority label)

   For scope, create the matching label:
   - small → `gh label create "scope: small" --color "c5def5" --description "Small change" --force`
   - medium →
     `gh label create "scope: medium" --color "bfd4f2" --description "Medium change" --force`
   - large → `gh label create "scope: large" --color "b4a7d6" --description "Large change" --force`

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
   - Always include `enhancement`
   - Add priority label if priority is must-have
   - Add scope label
   - Add area labels for each affected area

7. Create the issue using a heredoc to preserve formatting:

   ```bash
   gh issue create --title "[Feature]: <short title>" --label "enhancement,<other labels>" --body "$(cat <<'EOF'
   ## Description

   <description>

   ## Motivation

   <motivation>

   ## Proposed Solution

   <proposed solution>

   ## Alternatives Considered

   <alternatives, or "None">

   ## Scope

   <scope>

   ## Priority

   <priority>

   ## Affected Area

   <areas as comma-separated list>

   ## Codebase Context

   **Related code**:
   - `<file>` — <one-line role>
   - ...

   **Extension points**: <where the feature would plug in>
   **Schema impact**: <new tables/fields needed, or "None — no schema changes">
   EOF
   )"
   ```

   If the codebase investigation found nothing useful, replace the "Codebase Context" section with
   just `N/A`.

8. Report the issue URL and number to the user.

## Rules

- Always create labels with `--force` so the command is idempotent
- Never skip the `enhancement` label
- Use the exact section order above to match the GitHub Issue Form template
- Keep the issue title concise — prefix with `[Feature]: `
- If the user provides a one-liner, that becomes the title and description; still ask for missing
  fields
- **Codebase context must be precise** — only include files you are confident are relevant. 3-5 file
  references max. No padding, no maybes.
- Omit the "Codebase Context" section entirely if the investigation adds no value beyond what the
  user described
