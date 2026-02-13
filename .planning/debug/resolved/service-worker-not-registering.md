---
status: diagnosed
trigger: "Service worker (sw.js) is not being registered or served in the Dahan Codex app"
created: 2026-01-25T10:00:00Z
updated: 2026-01-25T15:58:00Z
symptoms_prefilled: true
goal: find_root_cause_only
---

## Current Focus

hypothesis: CONFIRMED - registerSW() adds a "load" event listener, but by the time useEffect runs, the window.load event has already fired
test: Analyzed code flow and timing
expecting: n/a - root cause confirmed
next_action: Return diagnosis

## Symptoms

expected: Service worker should be registered and active in all modes (dev, preview, deployed)
actual: Service worker not registered in any mode
errors: Unknown - need to investigate
reproduction:
  1. Dev mode: localhost:5173 - SW not registered (404 for sw.js - expected)
  2. Preview mode: localhost:8787 - SW not registered (sw.js returns 200)
  3. Deployed: https://the-dahan-codex.suppo-jo.workers.dev/ - SW not registered (sw.js returns 200)
started: Unknown

## Eliminated

- hypothesis: sw.js not being generated during build
  evidence: "pnpm build" generates sw.js in dist/client/ (confirmed with ls and curl)
  timestamp: 2026-01-25T15:52:00Z

- hypothesis: sw.js not being served in preview/deployed modes
  evidence: curl to localhost:8787/sw.js and deployed URL both return HTTP 200 with valid service worker content
  timestamp: 2026-01-25T15:53:00Z

- hypothesis: registerSW() code not in bundle
  evidence: grep of main bundle shows "serviceWorker" and "sw.js" strings present
  timestamp: 2026-01-25T15:54:00Z

## Evidence

- timestamp: 2026-01-25T15:52:00Z
  checked: dist/client/ directory after build
  found: sw.js exists (1854 bytes), workbox-5bcbcd19.js exists
  implication: Service worker generation is working correctly

- timestamp: 2026-01-25T15:53:00Z
  checked: HTTP response for sw.js in dev, preview, and deployed modes
  found: Dev returns 404, Preview returns 200, Deployed returns 200
  implication: Dev mode issue is separate (sw.js not in public/); preview/deployed should work

- timestamp: 2026-01-25T15:54:00Z
  checked: Registration code in sw-register.ts
  found: registerSW() adds window.addEventListener("load", ...) then navigator.serviceWorker.register()
  implication: The load event listener is added when registerSW() is called from useEffect

- timestamp: 2026-01-25T15:55:00Z
  checked: When registerSW() is called in __root.tsx
  found: Called inside useEffect with empty deps - runs AFTER React hydration
  implication: By the time useEffect runs, window.load has already fired - the listener is added too late

- timestamp: 2026-01-25T15:57:00Z
  checked: Bundle content for load event listener pattern
  found: Confirmed `"load",async()=>{try{const n=await navigator.serviceWorker.register("/sw.js"` is in the bundle
  implication: The code is present but the timing is wrong

## Resolution

root_cause: |
  PRIMARY: Race condition in service worker registration timing.

  The registerSW() function in app/lib/sw-register.ts adds a window "load" event listener.
  This function is called from a React useEffect in app/routes/__root.tsx.

  Problem: By the time React hydrates the app and useEffect runs, the window.load event
  has ALREADY fired. The event listener is attached after the event has occurred, so the
  callback containing navigator.serviceWorker.register() never executes.

  SECONDARY: In dev mode, sw.js is not available at all (returns 404) because it's only
  generated during build via "pnpm generate-sw". The public/ folder doesn't contain sw.js.

fix:
verification:
files_changed: []
