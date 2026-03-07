# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v4.2 -- Foundation through Interactivity

**Shipped:** 2026-03-07
**Phases:** 3 | **Plans:** 10 | **Commits:** 52

### What Was Built
- Complete Next.js 16 portfolio with 6 content sections, Liquid Glass + Neobrutalism design
- Dark mode with animated toggle, system preference detection, noise texture, gradient animations
- Custom banana cursor with magnetic pull, hover micro-interactions, SplitText heading reveals
- 5 design explorations generated and reviewed before locking final direction

### What Worked
- Design exploration phase (5 directions in browser) led to a strong hybrid direction the user was excited about
- Frontend-design skill produced high-quality, non-generic UI from the start
- GSAP as single animation engine eliminated conflicts -- no Framer Motion overlap
- Fast velocity: 10 plans across 3 phases completed in ~1 day (avg 2-5min per plan)
- Iterative cursor approach: started with GSAP dot follower, user flagged lag, pivoted to CSS banana cursor quickly

### What Was Inefficient
- Cursor implementation went through 3 iterations (GSAP dot -> banana image fixes -> CSS cursor) -- could have validated approach earlier
- Multiple commits fixing banana cursor image (cleaning, renaming, hotspot adjustment) -- should batch image prep
- Double-rAF + ScrollTrigger.refresh(true) pattern for GSAP hydration timing was discovered reactively, not proactively

### Patterns Established
- CSS custom properties on :root/.dark for theming (not Tailwind dark: variant)
- data-magnetic attribute pattern for cursor-interactive elements
- GlassPanel tilt opt-in via prop (default false) to avoid tilting full-width sections
- Content data in src/data/content.ts with TODO markers for user personalization
- Double-rAF + ScrollTrigger.refresh(true) for GSAP in Next.js hydration

### Key Lessons
1. Design exploration before content build is high-value -- prevents rework and gives the user agency over creative direction
2. User feedback loops on interaction feel (cursor, animations) catch issues that code review can't -- prioritize early tactile testing
3. CSS cursor: url() is simpler and more performant than GSAP-driven cursor followers for custom cursor images
4. GSAP + Next.js hydration timing needs explicit handling -- build the double-rAF pattern into Phase 1 boilerplate next time

### Cost Observations
- Model mix: 100% opus
- Sessions: ~4 sessions across 1 day
- Notable: High velocity due to single-file main component (Exploration6.tsx) -- no routing overhead

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Commits | Phases | Key Change |
|-----------|---------|--------|------------|
| v4.2 | 52 | 3 | Design exploration phase before content build |

### Top Lessons (Verified Across Milestones)

1. Design exploration before committing to a direction saves rework
2. User feedback on interaction feel (cursor, hover) is essential -- automate less, test more
