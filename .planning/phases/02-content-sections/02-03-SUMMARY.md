---
phase: 02-content-sections
plan: 03
subsystem: ui
tags: [gsap, scrolltrigger, lenis, glass-morphism, neobrutalism, next.js]

requires:
  - phase: 02-content-sections/02-02
    provides: "Hero/About refinement, Experience/Skills sections, NeoBrutalHeading/NeoBrutalTag"
  - phase: 02-content-sections/02-01
    provides: "GlassPanel, NeoBrutalButton, content data (projects, contactLinks)"
provides:
  - "Complete 6-section portfolio (Hero, About, Experience, Skills, Projects, Contact)"
  - "Project cards with click-to-expand case study content via GSAP height animation"
  - "Contact section with email/GitHub/LinkedIn link cards and resume download"
  - "FloatingNav dot navigation fixed to right side, scroll-aware with active tracking"
affects: [03-polish-and-responsive, 04-deployment]

tech-stack:
  added: []
  patterns:
    - "Double-rAF ScrollTrigger.refresh(true) after mount for Next.js hydration compatibility"
    - "GSAP timeline delay:0.1 for hero entrance to avoid hydration race"
    - "useLenis scrollTo with offset for floating nav section jumping"
    - "gsap.fromTo height:auto pattern for expand/collapse animations"

key-files:
  created:
    - "src/components/sections/FloatingNav.tsx"
  modified:
    - "src/components/explorations/Exploration6.tsx"
    - "src/components/ui/NeoBrutalButton.tsx"

key-decisions:
  - "Double-rAF + ScrollTrigger.refresh(true) to fix GSAP timing on Next.js first load"
  - "Hero timeline delay:0.1 rather than rAF wrapper to fix CTA visibility on hydration"

patterns-established:
  - "GSAP + Next.js hydration: always call ScrollTrigger.refresh(true) in double-rAF after useGSAP setup"
  - "Expand/collapse: gsap.fromTo height:0->auto with overflow:hidden wrapper inside GlassPanel (not on outer)"

requirements-completed: [CONT-05, CONT-06, DSGN-02, DSGN-06]

duration: 8min
completed: 2026-03-06
---

# Phase 2 Plan 3: Projects Expand, Contact Section, and Floating Nav Summary

**Complete portfolio with 4 expandable project cards, contact link cards with resume download, floating dot nav, and GSAP hydration timing fix for Next.js**

## Performance

- **Duration:** 8 min (spread across checkpoint pause)
- **Started:** 2026-03-06T23:00:00Z
- **Completed:** 2026-03-06T23:45:00Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Projects section with 4 real projects, click-to-expand case study (problem/approach/highlights/links) using GSAP height animation
- Contact section with 3 neobrutalist link cards (Email, GitHub, LinkedIn) + resume PDF download button (second touchpoint)
- FloatingNav component with dot indicators, active section tracking, and scroll-to via Lenis
- Fixed GSAP ScrollTrigger timing issue where elements stayed invisible on first page visit due to Next.js hydration race

## Task Commits

Each task was committed atomically:

1. **Task 1: Build Projects expand and Contact section** - `20e273f` (feat)
2. **Task 2: Build Floating Navigation component** - `87118d4` (feat)
3. **Task 3: Fix GSAP animation timing on first load** - `e9cc7a3` (fix)

## Files Created/Modified
- `src/components/explorations/Exploration6.tsx` - Complete 6-section portfolio with project expand, contact, and hydration timing fix
- `src/components/sections/FloatingNav.tsx` - Floating dot nav with scroll-aware visibility and active section tracking
- `src/components/ui/NeoBrutalButton.tsx` - Extended with target/rel props for external links

## Decisions Made
- Used double-rAF + ScrollTrigger.refresh(true) pattern to fix GSAP timing after Next.js hydration -- more reliable than single rAF because the browser needs two frames to fully paint and lay out elements
- Added 0.1s delay to hero timeline rather than wrapping in rAF, keeping the animation code clean while ensuring DOM is ready
- Applied the ScrollTrigger.refresh fix to both Exploration6 and FloatingNav to prevent timing issues in either component

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] GSAP animations invisible on first page visit**
- **Found during:** Task 3 (visual verification checkpoint)
- **Issue:** Project cards and hero CTA buttons used gsap.from() which sets elements to opacity:0/scale:0 immediately, but ScrollTrigger measured positions before Next.js hydration completed, so triggers never fired and elements stayed invisible until manual refresh
- **Fix:** Added double-requestAnimationFrame + ScrollTrigger.refresh(true) after all useGSAP setups in both Exploration6.tsx and FloatingNav.tsx; added 0.1s delay to hero timeline
- **Files modified:** src/components/explorations/Exploration6.tsx, src/components/sections/FloatingNav.tsx
- **Verification:** npm run build passes
- **Committed in:** e9cc7a3

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Essential fix for correct first-load behavior. No scope creep.

## Issues Encountered
- GSAP ScrollTrigger + Next.js hydration race condition: gsap.from() immediately sets elements to invisible "from" state, but ScrollTrigger calculates trigger positions before the browser has finished laying out the page after hydration. This is a known pattern in Next.js + GSAP projects. The double-rAF refresh pattern is now established for all future ScrollTrigger usage.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 6 content sections complete and browsable
- Ready for Phase 3: Polish and Responsive (animations, mobile layouts, performance)
- FloatingNav established as the navigation pattern -- may need mobile treatment in Phase 3
- GSAP hydration pattern established -- apply to any new scroll-triggered animations

---
*Phase: 02-content-sections*
*Completed: 2026-03-06*
