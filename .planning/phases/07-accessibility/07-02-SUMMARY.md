---
phase: 07-accessibility
plan: 02
subsystem: ui
tags: [gsap, reduced-motion, accessibility, lenis, matchMedia, prefers-reduced-motion]

# Dependency graph
requires:
  - phase: 07-accessibility-01
    provides: Semantic HTML, ARIA labels, focus-visible styles, contrast fixes
provides:
  - prefers-reduced-motion support across all GSAP animations
  - Conditional Lenis smooth scroll (disabled under reduced-motion)
  - Gradient animation freeze under reduced-motion
  - CSS transition clamp for reduced-motion users
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: [gsap.matchMedia for reduced-motion branching, synchronous matchMedia check for pre-render decisions]

key-files:
  created: []
  modified:
    - src/components/providers/SmoothScroll.tsx
    - src/app/page.tsx
    - src/app/globals.css
    - src/components/sections/HeroSection.tsx
    - src/components/sections/AboutSection.tsx
    - src/components/sections/ExperienceSection.tsx
    - src/components/sections/SkillsSection.tsx
    - src/components/sections/ProjectsSection.tsx
    - src/components/sections/ContactSection.tsx
    - src/components/sections/FloatingNav.tsx

key-decisions:
  - "Synchronous matchMedia check in gradient callback to avoid flash of animated gradient"
  - "SplitText only instantiated in no-preference branch; matchMedia auto-revert handles cleanup"
  - "FloatingNav ScrollTrigger section tracking preserved in both motion modes"

patterns-established:
  - "gsap.matchMedia() wrapping pattern: no-preference branch has full animations, reduce branch has instant opacity reveals"
  - "SmoothScroll conditional render: useState + useEffect for reactive Lenis mount/unmount"

requirements-completed: [A11Y-04]

# Metrics
duration: 3min
completed: 2026-03-08
---

# Phase 7 Plan 2: Reduced-Motion Support Summary

**prefers-reduced-motion support via gsap.matchMedia() across all 7 section components, conditional Lenis disable, gradient freeze, and CSS transition clamp**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-08T21:54:23Z
- **Completed:** 2026-03-08T21:57:30Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- All 7 useGSAP scopes wrapped in gsap.matchMedia() with no-preference and reduce conditions
- Lenis smooth scroll conditionally disabled when user prefers reduced motion
- Gradient animation frozen at CSS starting position under reduced-motion
- CSS transitions clamped to near-zero duration (theme color transitions preserved)
- SplitText only instantiated in no-preference branch across all sections

## Task Commits

Each task was committed atomically:

1. **Task 1: Lenis conditional disable, gradient freeze, and CSS reduced-motion fallback** - `5532a92` (feat)
2. **Task 2: GSAP matchMedia reduced-motion branches in all section components** - `a080108` (feat)

## Files Created/Modified
- `src/components/providers/SmoothScroll.tsx` - Conditional Lenis mount based on reduced-motion preference
- `src/app/page.tsx` - Synchronous reduced-motion check before gradient animation
- `src/app/globals.css` - CSS reduced-motion fallback with near-zero transition durations
- `src/components/sections/HeroSection.tsx` - matchMedia wrapping with instant reveals in reduce mode
- `src/components/sections/AboutSection.tsx` - matchMedia wrapping with ScrollTrigger opacity reveals
- `src/components/sections/ExperienceSection.tsx` - matchMedia wrapping, no SplitText in reduce mode
- `src/components/sections/SkillsSection.tsx` - matchMedia wrapping, no SplitText in reduce mode
- `src/components/sections/ProjectsSection.tsx` - matchMedia wrapping, no slide-in or SplitText in reduce mode
- `src/components/sections/ContactSection.tsx` - matchMedia wrapping, no SplitText in reduce mode
- `src/components/sections/FloatingNav.tsx` - matchMedia wrapping, ScrollTrigger tracking in both modes

## Decisions Made
- Used synchronous `window.matchMedia` check in gradient callback (not React state) to avoid flash of animated gradient before state resolves
- SplitText instances only created in no-preference branch; matchMedia auto-revert handles cleanup automatically
- FloatingNav ScrollTrigger section tracking runs in both motion modes since it drives state, not animation

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All accessibility work for Phase 7 is complete (semantic HTML, ARIA, focus styles, contrast, reduced-motion)
- Ready for Phase 8 (Performance/Lighthouse optimization)

---
*Phase: 07-accessibility*
*Completed: 2026-03-08*
