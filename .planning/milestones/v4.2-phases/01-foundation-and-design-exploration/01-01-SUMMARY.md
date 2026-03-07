---
phase: 01-foundation-and-design-exploration
plan: 01
subsystem: infra
tags: [nextjs, tailwind, gsap, lenis, static-export, smooth-scroll]

requires:
  - phase: none
    provides: greenfield project

provides:
  - Next.js 16 app shell with static export
  - GSAP plugin registration singleton
  - Lenis smooth scroll provider synced to GSAP ticker
  - Tailwind v4 @theme design tokens
  - Dynamic exploration routes /explore/1-5
  - Index page with exploration navigation

affects: [01-02, 01-03, 01-04, all-future-plans]

tech-stack:
  added: [next@16.1.6, react@19.2.3, tailwindcss@4, gsap@3.14.2, "@gsap/react@2.1.2", lenis@1.3.18]
  patterns: [gsap-singleton-registration, lenis-gsap-ticker-sync, tailwind-v4-theme-tokens, static-export-dynamic-routes]

key-files:
  created:
    - next.config.ts
    - src/lib/gsap.ts
    - src/components/providers/SmoothScroll.tsx
    - src/app/explore/[id]/page.tsx
    - src/components/explorations/Exploration1.tsx
    - src/components/explorations/Exploration2.tsx
    - src/components/explorations/Exploration3.tsx
    - src/components/explorations/Exploration4.tsx
    - src/components/explorations/Exploration5.tsx
  modified:
    - src/app/layout.tsx
    - src/app/globals.css
    - src/app/page.tsx
    - package.json

key-decisions:
  - "Used Inter (body) + Space Grotesk (display) as baseline font pairing"
  - "Exploration components use static imports with record-based routing (not dynamic import)"
  - "Tailwind v4 @theme with oklch color tokens for perceptually uniform color manipulation"

patterns-established:
  - "GSAP singleton: all plugins registered in src/lib/gsap.ts, components import from @/lib/gsap"
  - "Lenis+GSAP sync: SmoothScrollProvider wraps app, uses autoRaf:false with gsap.ticker.add"
  - "Exploration routing: /explore/[id] with generateStaticParams for static export"

requirements-completed: [INFR-06]

duration: 3min
completed: 2026-03-06
---

# Phase 01 Plan 01: App Shell Summary

**Next.js 16 app shell with Tailwind v4 @theme tokens, GSAP singleton registration, Lenis smooth scroll, and 5 dynamic exploration routes for static export**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-06T21:40:35Z
- **Completed:** 2026-03-06T21:44:00Z
- **Tasks:** 2
- **Files modified:** 18

## Accomplishments
- Scaffolded Next.js 16.1.6 project with Turbopack, Tailwind v4, and static export configuration
- Created GSAP plugin registration singleton and Lenis smooth scroll provider with ticker synchronization
- Built 5 placeholder exploration components with GSAP entrance animations and dynamic routing via generateStaticParams
- Index page with responsive grid of exploration cards

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Next.js 16 project and configure static export with GSAP + Lenis** - `855eaa1` (feat)
2. **Task 2: Create dynamic exploration routes with placeholder components and index page** - `7f89780` (feat)

## Files Created/Modified
- `next.config.ts` - Static export configuration (output: 'export', images unoptimized)
- `src/lib/gsap.ts` - GSAP plugin registration singleton (gsap, ScrollTrigger, useGSAP)
- `src/components/providers/SmoothScroll.tsx` - Lenis + GSAP ticker wiring provider
- `src/app/globals.css` - Tailwind v4 @theme tokens (fonts, colors, easing)
- `src/app/layout.tsx` - Root layout with Inter/Space Grotesk fonts and SmoothScrollProvider
- `src/app/page.tsx` - Exploration index with responsive card grid
- `src/app/explore/[id]/page.tsx` - Dynamic route with generateStaticParams for ids 1-5
- `src/components/explorations/Exploration[1-5].tsx` - Placeholder components with GSAP animations

## Decisions Made
- Used Inter (body) + Space Grotesk (display) as baseline font pairing -- clean, modern, good contrast between geometric display and humanist body
- Static imports with record-based routing instead of dynamic imports -- simpler, tree-shaking handles unused code per route
- oklch color space for theme tokens -- perceptually uniform, better for systematic palette generation in design explorations

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Reinstalled node_modules after scaffold copy**
- **Found during:** Task 1 (build verification)
- **Issue:** Copying node_modules from temp scaffold directory corrupted binary symlinks, causing "Cannot find module '../server/require-hook'" error
- **Fix:** Deleted node_modules and ran `npm install` fresh
- **Files modified:** node_modules/ (not tracked)
- **Verification:** `npm run build` succeeded after reinstall
- **Committed in:** 855eaa1 (part of Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Standard scaffolding issue, no scope impact.

## Issues Encountered
None beyond the node_modules copy issue documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- App shell is fully operational with dev server and static export
- All 5 exploration routes exist as placeholders ready for Plans 02 and 03 to replace with full creative designs
- GSAP and Lenis are wired and functional -- design explorations can use animations immediately
- Tailwind v4 @theme tokens provide a base design system that explorations can override locally

## Self-Check: PASSED

- All 12 source files verified present
- Both task commits (855eaa1, 7f89780) verified in git log
- Build produces all 5 exploration routes in out/explore/

---
*Phase: 01-foundation-and-design-exploration*
*Completed: 2026-03-06*
