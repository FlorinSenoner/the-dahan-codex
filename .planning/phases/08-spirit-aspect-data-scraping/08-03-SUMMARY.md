---
phase: 08-spirit-aspect-data-scraping
plan: 03
subsystem: data-scraping
tags: [images, spirits, aspects, wiki, offline-first, PWA]
dependency-graph:
  requires: ["08-01", "08-02"]
  provides: ["spirit-images", "aspect-images", "download-images-script"]
  affects: ["spirit-library-ui", "offline-caching"]
tech-stack:
  added: []
  patterns: ["wiki-image-scraping", "srcset-parsing", "idempotent-downloads"]
key-files:
  created:
    - scripts/download-images.ts
    - public/spirits/*.png (68 files)
  modified: []
decisions:
  - id: img-100kb-min
    choice: "Require images > 100KB to validate download integrity"
    rationale: "Smaller files indicate broken downloads or wrong images (icons, SVGs)"
  - id: aspect-name-fallback
    choice: "Fall back to aspect name pattern (e.g., 'Lair (ni).png') when imagePattern fails"
    rationale: "Some aspects in aspects.json had wrong imagePattern values (Incarna art vs panel art)"
metrics:
  duration: 27 min
  completed: 2026-02-02
---

# Phase 08 Plan 03: Spirit & Aspect Image Downloader

**One-liner:** Download all 68 spirit/aspect images from wiki for offline-first PWA support

## What Was Built

Created an image download script that fetches all spirit and aspect panel art from the Spirit Island wiki, enabling offline access to spirit images in the PWA.

### Key Components

1. **scripts/download-images.ts** - Image downloader with:
   - Wiki page parsing to find full-resolution panel art images
   - srcset parsing to avoid thumbnails (prefer 1.5x/2x URLs)
   - Redirect handling (301/302)
   - Idempotent downloads (skip existing files)
   - Rate limiting (500ms between downloads)
   - File size validation (> 100KB)

2. **public/spirits/** - 68 PNG images:
   - 37 base spirit images
   - 31 aspect images (all aspects have unique art)

### CLI Usage

```bash
npx tsx scripts/download-images.ts              # Download all
npx tsx scripts/download-images.ts --spirits-only  # Spirits only
npx tsx scripts/download-images.ts --aspects-only  # Aspects only
npx tsx scripts/download-images.ts --force      # Re-download existing
```

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Image validation | > 100KB minimum | Detect broken downloads (SVGs, icons, partial files) |
| Image format | PNG only | Skip SVG icons, prefer panel art |
| Width threshold | >= 200px | Filter out small icons in favor of panel art |
| Rate limiting | 500ms delay | Be respectful to wiki server |
| Aspect fallback | Name pattern matching | Some aspects had wrong imagePattern in JSON data |

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 38e0883 | feat | Create image download script |
| 9bfdbf2 | feat | Download all 37 base spirit images |
| 3fdb16b | feat | Download all 31 aspect images |

## Files Changed

**Created:**
- `scripts/download-images.ts` - Image download script
- `public/spirits/*.png` - 68 spirit/aspect images

## Verification

- [x] scripts/download-images.ts compiles without errors
- [x] public/spirits/ contains 68 PNG files (37 spirits + 31 aspects)
- [x] All image files are > 100KB (valid, not broken)
- [x] Existing images preserved (River/Lightning images from earlier not corrupted)
- [x] Script is idempotent (re-running skips existing files)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed SVG icons being downloaded instead of PNG panel art**
- **Found during:** Task 2
- **Issue:** Ember-Eyed Behemoth page had SVG icon matching spirit name before PNG
- **Fix:** Added PNG extension requirement and width >= 200px check
- **Files modified:** scripts/download-images.ts
- **Commit:** 9bfdbf2

**2. [Rule 1 - Bug] Fixed wrong imagePattern for Lair and Warrior aspects**
- **Found during:** Task 3
- **Issue:** aspects.json had "Lure of the Deep Wilderness Incarna (Lair).png" but panel art is "Lair (ni).png"
- **Fix:** Added fallback to match aspect name with (ni) suffix pattern
- **Files modified:** scripts/download-images.ts
- **Commit:** 3fdb16b

## Next Phase Readiness

**Blockers:** None

**Dependencies satisfied:**
- All 37 spirit images available for UI
- All 31 aspect images available for UI
- Images bundled with app for offline support

**Ready for:**
- Spirit library UI with images
- Service worker caching of static assets
- Offline-first PWA functionality
