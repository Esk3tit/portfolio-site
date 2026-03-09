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

## Milestone: v4.3 -- Cleanup and Launch

**Shipped:** 2026-03-09
**Phases:** 5 | **Plans:** 10 | **Commits:** 41

### What Was Built
- Cleaned codebase: removed explore routes, Vercel defaults, dead code, replaced favicon
- Extracted Exploration6 monolith into 6 independent section components with scoped GSAP animations
- Responsive design: mobile hamburger nav with glass drawer, fluid typography, 44px touch targets
- Full accessibility: semantic HTML, keyboard nav, focus-visible, skip-to-content, WCAG AA contrast
- prefers-reduced-motion support with gsap.matchMedia() branching across all animation scopes
- OG/Twitter meta tags, static OG image, GSAP code-split via dynamic imports for Lighthouse 90+

### What Worked
- Component extraction preserved all animations perfectly -- scoped containerRef + useGSAP pattern was clean
- BEM naming convention ({section}-section__{element}) made CSS organization immediately clear
- gsap.matchMedia() was the right abstraction for reduced-motion -- one pattern covered all 7 animation scopes
- Audit milestone before completion caught zero gaps -- requirements were well-tracked throughout
- Yolo mode + coarse granularity kept velocity high: 10 plans in ~2 days

### What Was Inefficient
- Roadmap progress table got out of sync during execution (missing v4.3 labels, wrong completion status)
- Summary files used structured YAML format without one_liner field -- broke summary-extract tooling
- Phase 4 marked as "not started" in roadmap even after completion -- state tracking lag

### Patterns Established
- Visibility-hidden mount pattern for GSAP drawer targets (not conditional render)
- initGSAP() singleton with Promise caching for dynamic imports across 13 consumers
- Async IIFE inside useGSAP callbacks for dynamic import pattern
- Touch target pattern: min-h-[44px] sm:min-h-0 for interactive mobile elements
- :focus-visible with 2px accent-purple outline, mouse clicks suppressed
- CSS custom property --mobile-blur for GPU-budget-aware backdrop-filter

### Key Lessons
1. Component extraction should happen early (Phase 2-3 range) -- working with a monolith through 3 phases of v4.2 created unnecessary coupling
2. gsap.matchMedia() is the correct pattern for accessibility branches -- avoid manual window.matchMedia checks
3. Dynamic import singletons prevent duplicate loads -- essential for GSAP which registers plugins globally
4. Structured SUMMARY.md files need a consistent one_liner field for tooling compatibility
5. 12px mobile blur threshold is the sweet spot under 20px GPU cost limit

### Cost Observations
- Model mix: 100% opus
- Sessions: ~5 sessions across 2 days
- Notable: Parallel phase execution not needed -- phases were sequential dependencies (cleanup -> extract -> responsive -> a11y -> perf)

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Commits | Phases | Key Change |
|-----------|---------|--------|------------|
| v4.2 | 52 | 3 | Design exploration phase before content build |
| v4.3 | 41 | 5 | Component extraction + accessibility-first approach |

### Top Lessons (Verified Across Milestones)

1. Design exploration before committing to a direction saves rework
2. User feedback on interaction feel (cursor, hover) is essential -- automate less, test more
3. Component extraction should happen as early as possible -- monoliths accumulate coupling fast (v4.2 monolith -> v4.3 extraction)
4. GSAP scoped animations (containerRef + useGSAP) are the correct pattern for component isolation -- verified across both milestones
