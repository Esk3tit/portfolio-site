---
phase: 01-foundation-and-design-exploration
plan: 03
subsystem: design-explorations
tags: [neobrutalism, video-game-ui, gsap, design-exploration, tailwind]

requires:
  - phase: 01-01
    provides: App shell, GSAP singleton, exploration routing

provides:
  - Exploration 4 (Neobrutalism) at /explore/4
  - Exploration 5 (Video Game-Inspired) at /explore/5
  - Complete set of 5 design directions for user evaluation

affects: [01-04]

tech-stack:
  added: []
  patterns: [neobrutalism-css, neon-glow-effects, hud-ui-decorations, gsap-character-stagger, styled-jsx-keyframes]

key-files:
  created: []
  modified:
    - src/components/explorations/Exploration4.tsx
    - src/components/explorations/Exploration5.tsx

key-decisions:
  - "Neobrutalism uses mono font stack and yellow/pink/blue flat palette with solid offset shadows"
  - "Video Game UI uses inline styles for neon glow text-shadow (not available in Tailwind defaults)"
  - "styled-jsx global for CSS keyframe animations (cursor blink, glow pulse) since Tailwind lacks native keyframe utilities"

duration: 2min
completed: 2026-03-06
---

# Phase 01 Plan 03: Design Explorations 4-5 Summary

**Neobrutalism with thick borders, solid shadows, and punk energy; Video Game-Inspired with dark HUD aesthetic, neon glows, typing animations, and game-style skill stats**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-06T21:46:48Z
- **Completed:** 2026-03-06T21:49:02Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Built Exploration 4 (Neobrutalism): yellow background, thick 4px black borders, solid offset box shadows, mono typography at massive scale, decorative geometric shapes with rotation, snappy GSAP animations (power4.out, bounce.out, back.out), project cards with colored headers and pill tag badges
- Built Exploration 5 (Video Game-Inspired): dark background with CSS grid pattern and scanline overlay, neon cyan/green/magenta accents with glow text-shadow, HUD corner decorations (L-brackets, coordinates, system status), typing animation via GSAP character stagger, blinking cursor, skills displayed as game-style stats with animated progress bars that fill from 0, level numbers that count up

## Task Commits

Each task was committed atomically:

1. **Task 1: Build Exploration 4 (Neobrutalism)** - `5507e3b` (feat)
2. **Task 2: Build Exploration 5 (Video Game-Inspired)** - `8e61b97` (feat)

## Files Created/Modified
- `src/components/explorations/Exploration4.tsx` - Neobrutalism: Hero (massive KHAI PHAN text, raw subtitle, blocky CTA) + Projects (3 cards with thick borders, solid shadows, colored headers, tech tag pills)
- `src/components/explorations/Exploration5.tsx` - Video Game-Inspired: Hero (typing title animation, code-comment subtitle, HUD decorations, status indicator) + Skills (3 category panels with neon progress bars, level counters, monospace typography)

## Decisions Made
- Neobrutalism uses font-mono throughout for raw, anti-design aesthetic with yellow-300/pink-500/blue-500/black palette
- Video Game UI uses inline styles for text-shadow neon glow effects since Tailwind doesn't expose text-shadow utilities by default
- Used styled-jsx global blocks for CSS keyframe animations (cursor blink, glow pulse) -- bundled with Next.js, avoids adding dependencies

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None.

## Next Phase Readiness
- All 5 design explorations are now complete and renderable at /explore/1 through /explore/5
- Plan 01-04 (user review checkpoint) can now proceed with the full set of design directions
- Each exploration has a distinct visual identity: (1) Minimal, (2) Kinetic Typography, (3) Bento Grid, (4) Neobrutalism, (5) Video Game-Inspired

## Self-Check: PASSED

- Both source files verified present (Exploration4.tsx: 174 lines, Exploration5.tsx: 332 lines)
- Both task commits (5507e3b, 8e61b97) verified in git log
- Build succeeds with all 5 exploration routes in static export
