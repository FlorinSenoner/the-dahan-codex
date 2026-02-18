---
name: tailwind-audit
description: Audit Tailwind CSS classes for redundancy, inconsistency, and legacy patterns
allowed-tools: Bash, Read, Glob, Grep, Task, AskUserQuestion
user-invocable: true
---

# Tailwind CSS Audit

Scans the codebase for Tailwind class anti-patterns and produces a findings report.

## Detection Patterns

Launch 3 parallel Explore agents to scan ALL .tsx/.ts files in `src/`:

### Agent 1: Size & Shrink Patterns

1. **`h-N w-N` or `w-N h-N` should be `size-N`** (square dimensions)
   - Grep: `h-(\d+) w-(\d+)` then verify both numbers match
   - Grep: `w-(\d+) h-(\d+)` then verify both numbers match
   - Also check fractional: `h-3.5 w-3.5`, `h-0.5 w-0.5`

2. **`flex-shrink-0` should be `shrink-0`** (modern canonical form)
   - Grep: `flex-shrink-0`

3. **`absolute inset-0` with redundant `w-full h-full`**
   - Grep: `inset-0.*w-full` or `inset-0.*h-full`

4. **Wrong class ordering: `size-N mr-X`** (margin should come before size)
   - Grep: `size-\d+ mr-`

### Agent 2: Duplicate & Redundant Classes

5. **Duplicate classes in same className string**
   - Grep for common duplicates: `pointer-events-none.*pointer-events-none`
   - Grep: `overflow-y-auto.*overflow-y-auto`
   - General approach: read className strings and check for word-level duplicates

6. **Redundant responsive overrides that match base value**
   - Grep: `text-xs.*md:text-xs` or `text-sm.*md:text-sm`
   - Look for `group-data-[...]:{value}` where base already sets same value

7. **No-op flex defaults**
   - `sm:flex-row` without preceding `flex-col` (row is default)
   - `items-stretch` on flex containers (stretch is default)

8. **Consolidatable margin shorthand**
   - Grep: `-mx-(\d+) -my-` then verify both numbers match (should be `-m-N`)

### Agent 3: Transition & Legacy Patterns

9. **`transition-all` overuse** (flag for review)
   - Grep: `transition-all`
   - Check what properties actually transition — suggest specific alternatives

10. **`flex-grow` should be `grow`** (modern Tailwind)
    - Grep: `flex-grow`

11. **`flex-grow-0` should be `grow-0`**
    - Grep: `flex-grow-0`

12. **Duplicate text-size tokens in same className**
    - Look for `text-sm.*text-sm` patterns within single className strings

## Output Format

For each finding, report:
- File path and line number
- Category (from list above)
- Current class string
- Suggested fix
- Severity: `fix` (clearly wrong) or `review` (judgment call)

Group findings by category and sort by file path within each category.
