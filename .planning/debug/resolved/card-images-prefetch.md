---
status: resolved
trigger: "card-images-prefetch-on-load - All card images downloaded on app load instead of on demand"
created: 2026-02-14T00:00:00Z
updated: 2026-02-14T00:00:02Z
---

## Current Focus

hypothesis: CONFIRMED AND FIXED
test: N/A
expecting: N/A
next_action: Archive session

## Symptoms

expected: Card images in public/cards should only be downloaded when the user navigates to a page that needs them
actual: All card images in public/cards are downloaded on initial app load
errors: No errors, just excessive network traffic
reproduction: Load the app and observe network requests
started: Likely related to service worker precaching or build config

## Eliminated

## Evidence

- timestamp: 2026-02-14T00:00:00Z
  checked: vite.config.ts PWA config
  found: globPatterns is '**/*.{js,css,html,ico,png,svg,webp,woff,woff2}' which matches .webp files; globIgnores only excluded 'spirits/*.png' (ineffective - no png files exist in spirits/)
  implication: All webp files in public/cards/ are included in precache manifest

- timestamp: 2026-02-14T00:00:00Z
  checked: public/cards/ directory
  found: 473 card images across 4 subdirectories (blights, events, fears, powers), totaling 19MB
  implication: All 473 images are being downloaded on first load

- timestamp: 2026-02-14T00:00:00Z
  checked: Production build output (dist/sw.js)
  found: 589 total precache entries (29.6MB), 473 of which are card images; confirmed by extracting URLs from minified SW
  implication: Card images are definitively in the precache manifest

- timestamp: 2026-02-14T00:00:00Z
  checked: src/sw.ts runtime caching
  found: Already has StaleWhileRevalidate strategy for images (request.destination === 'image'), maxEntries 60, 30 days
  implication: Card images will still be cached on-demand when accessed, even without precaching

- timestamp: 2026-02-14T00:00:01Z
  checked: Rebuild after fix
  found: Precache reduced from 589 entries (29.6MB) to 116 entries (11.1MB). Zero card images in manifest.
  implication: Fix is working correctly

- timestamp: 2026-02-14T00:00:01Z
  checked: Typecheck after fix
  found: Clean - no type errors
  implication: Fix does not introduce regressions

## Resolution

root_cause: The globPatterns config in vite.config.ts injectManifest section ('**/*.{js,css,html,ico,png,svg,webp,woff,woff2}') matched all .webp files including the 473 card images in public/cards/ (19MB). The globIgnores array only had 'spirits/*.png' which was ineffective since spirit images are .webp, not .png. This caused the service worker to precache all card images on initial app load, resulting in 29.6MB of downloads.
fix: Added 'cards/**' to globIgnores in the injectManifest config. Also cleaned up the dead 'spirits/*.png' ignore rule (done by linter). Card images are still cached on-demand via the existing StaleWhileRevalidate runtime caching strategy in sw.ts.
verification: Rebuild confirmed precache entries dropped from 589 (29.6MB) to 116 (11.1MB) with zero card images in the manifest. Typecheck passes clean.
files_changed: [vite.config.ts]
