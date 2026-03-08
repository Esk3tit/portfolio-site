# Phase 7: Accessibility - Context

**Gathered:** 2026-03-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the site navigable by keyboard, comprehensible by screen readers, and comfortable for users who prefer reduced motion. Covers semantic HTML, keyboard navigation, focus indicators, reduced-motion handling, color contrast (WCAG AA), skip-to-content, and ARIA labels. No new features or capabilities.

</domain>

<decisions>
## Implementation Decisions

### Focus ring style
- 2px solid outline using `var(--accent-purple)` with 2px offset
- `:focus-visible` only -- no ring on mouse clicks
- Applied globally via CSS, inherited border-radius
- Skip-to-content link: hidden until first Tab press, then slides in at top
- Skip-to-content styled as glass panel (frosted backdrop, border, shadow) to match site aesthetic

### Reduced-motion behavior
- `prefers-reduced-motion: reduce` disables all GSAP scroll-triggered animations
- Content revealed via instant opacity fade (0->1) when entering viewport -- no spatial motion, no delay
- Gradient background animation frozen at starting position
- Lenis smooth scroll disabled -- fall back to native scroll
- Banana cursor stays active (user-initiated motion, not automatic)
- Hover effects: remove transform (tilt, scale) but keep color/opacity changes
- Each section's `useGSAP` scope checks reduced-motion and adjusts accordingly

### Contrast adjustments
- Darken `--text-secondary` values until they pass 4.5:1 against respective backgrounds
- Light and dark themes may have different `--text-secondary` values -- both must independently pass
- Audit text contrast only -- glass panel borders and decorative elements exempt
- Accent colors (`--accent-purple`, `--accent-pink`, `--accent-blue`) audited only where used as readable text

### Screen reader announcements
- Project cards: wrap clickable area in `<button>` with `aria-expanded="true/false"` -- announces "Project Name, expanded/collapsed, button"
- FloatingNav dots: `aria-label="Navigate to {Section} section"` on each button
- Dark mode toggle: dynamic `aria-label` -- "Switch to dark mode" / "Switch to light mode" based on current state
- Semantic HTML landmarks: use `<main>`, `<nav>`, `<footer>`, `<section aria-label="...">` instead of ARIA role attributes

### Heading hierarchy
- Audit and fix heading levels: h1 (Hero name), h2 (section titles via NeoBrutalHeading), h3 (subsections)
- No heading level skips allowed

### Claude's Discretion
- Exact skip-to-content animation/transition details
- How to structure the reduced-motion check (matchMedia vs CSS media query vs both)
- Exact darkened hex values for --text-secondary (as long as they pass 4.5:1)
- Whether to add aria-live regions for any dynamic content
- Tab order adjustments if needed beyond natural DOM order

</decisions>

<specifics>
## Specific Ideas

- Focus ring should feel designed, not like a browser default -- the accent purple ties it into the brand
- Skip-to-content link should use GlassPanel aesthetic so it doesn't feel like an afterthought
- Reduced-motion should still feel intentional -- instant opacity reveals keep the progressive disclosure feel without actual motion

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `GlassPanel`: Can be used for skip-to-content link styling
- `DarkModeToggle`: Already a standalone button component, just needs aria-label
- `NeoBrutalButton`: Already a `<button>`, needs focus-visible styles
- `NeoBrutalHeading`: Renders `<h2>`, part of heading hierarchy

### Established Patterns
- GSAP as single animation engine -- reduced-motion must work within GSAP (matchMedia or gsap.matchMedia())
- Each section owns its own `useGSAP` scope with containerRef -- reduced-motion logic per-section
- CSS custom properties for theming -- contrast fixes go in globals.css `:root` and `.dark`
- Lenis smooth scroll in SmoothScroll.tsx provider -- needs conditional disable
- BEM class naming: `{section}-section__element`

### Integration Points
- `src/app/globals.css`: Focus-visible styles, contrast color fixes, reduced-motion media queries
- `src/components/providers/SmoothScroll.tsx`: Lenis disable under reduced-motion
- `src/components/sections/ProjectsSection.tsx`: div+onClick -> button+aria-expanded
- `src/components/sections/FloatingNav.tsx`: aria-labels on nav dots
- `src/components/ui/DarkModeToggle.tsx`: dynamic aria-label
- `src/app/page.tsx`: Add `<main>` landmark, skip-to-content link
- All 13 GSAP animation files: reduced-motion branches

</code_context>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 07-accessibility*
*Context gathered: 2026-03-08*
