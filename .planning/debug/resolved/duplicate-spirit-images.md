---
status: resolved
trigger: "duplicate-spirit-images-png-webp"
created: 2026-02-14T00:00:00Z
updated: 2026-02-14T00:00:02Z
---

## Current Focus

hypothesis: CONFIRMED - All 68 PNGs are duplicates of 68 WebPs, no code references PNGs
test: N/A - root cause confirmed
expecting: N/A
next_action: Archive and commit

## Symptoms

expected: Only one format per image (preferably WebP for smaller file sizes)
actual: Both PNG and WebP versions of the same spirit images may exist
errors: No errors, just wasted space and potentially doubled downloads
reproduction: List files in public/spirits/ and check for filename.png + filename.webp pairs
started: Likely from Phase 8 (Spirit & Aspect Data Scraping)

## Eliminated

## Evidence

- timestamp: 2026-02-14T00:00:00Z
  checked: File listing in public/spirits/
  found: 68 PNG files and 68 WebP files. Every PNG has a corresponding WebP with identical basename.
  implication: 100% duplication confirmed

- timestamp: 2026-02-14T00:00:00Z
  checked: File sizes
  found: PNGs total 61MB, WebPs total 9.7MB. WebP is ~6x smaller.
  implication: 61MB of wasted space in the repository

- timestamp: 2026-02-14T00:00:00Z
  checked: src/ directory for .png references
  found: Zero .png references in src/. All spirit image references use .webp format.
  implication: PNGs are not used by application code

- timestamp: 2026-02-14T00:00:00Z
  checked: convex/ directory for .png references
  found: Zero .png references in convex/. All imageUrl fields use .webp format (convex/seedData/spirits.ts).
  implication: PNGs are not used by backend/seed data

- timestamp: 2026-02-14T00:00:00Z
  checked: e2e/ directory for .png references
  found: Zero .png references in e2e/.
  implication: PNGs are not referenced by tests

- timestamp: 2026-02-14T00:00:00Z
  checked: vite.config.ts globIgnores
  found: Already has `globIgnores: ['spirits/*.png']` to exclude PNGs from SW precache.
  implication: PNGs were already known to be unnecessary for the PWA. After removal, this glob can also be cleaned up.

- timestamp: 2026-02-14T00:00:00Z
  checked: scripts/ directory for .png references
  found: scripts/download-images.ts saves as .png (line 246, 283). scripts/data/aspects.json has .png imagePatterns. These are scraping scripts that download from the wiki.
  implication: Scripts download PNGs from wiki, then a separate step converts to WebP. Scripts reference wiki source format, not app format. Safe to leave scripts as-is.

- timestamp: 2026-02-14T00:00:02Z
  checked: Build verification after fix
  found: typecheck passes, build succeeds, dist/spirits/ contains 68 WebP files and 0 PNG files. SW precache has 116 entries.
  implication: Fix is clean with no regressions.

## Resolution

root_cause: Phase 8 image scraping downloaded spirit images as PNG, then converted to WebP but never cleaned up the original PNGs. All 68 PNG files (61MB total) are exact duplicates of the 68 WebP files (9.7MB total). No application code, seed data, tests, or SW config references the PNGs.
fix: Removed all 68 PNG files from public/spirits/ (saving 61MB). Removed 'spirits/*.png' from vite.config.ts globIgnores since there are no longer any PNGs to ignore.
verification: typecheck passes, production build succeeds, dist/spirits/ contains only 68 WebP files, SW precache manifest is correct.
files_changed:
  - public/spirits/*.png (68 files deleted)
  - vite.config.ts (removed 'spirits/*.png' from globIgnores)
