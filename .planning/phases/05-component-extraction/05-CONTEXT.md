# Phase 5: Component Extraction - Context

**Gathered:** 2026-03-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Extract Exploration6.tsx (787 lines) into 6 independent section components (Hero, About, Experience, Skills, Projects, Contact). Each section owns its own data imports, animations, and ref scope. The site must function identically to before — all scroll-triggered animations, text reveals, and hover interactions preserved. Exploration6.tsx is deleted after extraction.

</domain>

<decisions>
## Implementation Decisions

### Component boundaries
- page.tsx renders: FloatingNav + gradient background container + 6 section components
- FloatingNav stays in page.tsx (page-level navigation concern)
- Gradient background animation + noise filter SVG stay in page.tsx (shared visual wrapper)
- Exploration6.tsx is deleted entirely — no barrel export or redirect
- Section components live in `src/components/sections/` (HeroSection.tsx, AboutSection.tsx, ExperienceSection.tsx, SkillsSection.tsx, ProjectsSection.tsx, ContactSection.tsx)

### Animation ownership
- Each section has its own `useGSAP` hook with scoped `containerRef` — no central coordination
- ScrollTrigger auto-discovers triggers; each section calls `ScrollTrigger.refresh()` after its animations are set up
- Hero's char-split SplitText with gradient re-application stays inline in HeroSection (no abstraction — it's a one-off)
- Each section tracks and reverts its own SplitText instances in useGSAP cleanup (same pattern as current code)

### Shared state
- Project card expand/collapse (useState + useCallback) moves to ProjectsSection as local state
- Gradient animation logic (startGradientAnimation, gradientTweenRef, useEffect) stays in page.tsx with the outer container
- Each section imports its own data directly from `@/data/content` — no prop drilling from page.tsx

### CSS class renaming
- Rename all `e6-*` classes to BEM-style: `{section}-section__{element}` (e.g., `e6-hero-name` → `hero-section__name`, `e6-about-panel` → `about-section__panel`)
- Rename everywhere: globals.css class definitions, TSX className attributes, and GSAP animation selectors — full consistency, no legacy naming

### Claude's Discretion
- Exact order of extraction (which section to extract first)
- Whether to extract sections one-at-a-time or all-at-once
- Internal component structure (sub-components within a section if needed)
- Any helper utilities that emerge during extraction

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `GlassPanel`: Used across multiple sections for card containers
- `NeoBrutalButton`: Used in Hero (CTA) and Project cards
- `NeoBrutalHeading`: Used for section headings
- `NeoBrutalTag`: Used in Skills and Projects for tags
- `FloatingNav`: Already in `src/components/sections/` — stays as-is

### Established Patterns
- GSAP as single animation engine (no Framer Motion) — decided in PROJECT.md
- CSS custom properties for theming via MutationObserver — not Tailwind dark:
- SplitText: char split for hero name, word split for other headings
- Data lives in `src/data/content.ts` with named exports (heroContent, experiences, skills, projects, contactLinks)

### Integration Points
- `src/app/page.tsx` currently imports Exploration6 — will change to import 6 section components + FloatingNav
- `src/app/layout.tsx` handles Lenis smooth scroll — no changes needed
- `src/lib/gsap.ts` re-exports gsap, ScrollTrigger, useGSAP, SplitText — each section imports from here
- `src/app/globals.css` has all e6-* class definitions — will be renamed to BEM

</code_context>

<specifics>
## Specific Ideas

- Each section component should be fully self-contained: import its own data, set up its own animations, manage its own refs
- The extraction is a refactor — zero visual or behavioral changes to the site
- Hot-reloading a single section must not break animations in other sections (this validates proper scoping)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-component-extraction*
*Context gathered: 2026-03-07*
