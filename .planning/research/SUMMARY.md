# Project Research Summary

**Project:** Khai Phan Portfolio v4.3 -- Cleanup and Launch
**Domain:** Animation-heavy portfolio site refactor (responsive, accessibility, performance, code cleanup)
**Researched:** 2026-03-07
**Confidence:** HIGH

## Executive Summary

The v4.3 milestone is a **zero-new-dependency refactor** that transforms an animation-heavy single-page portfolio from a working desktop prototype into a production-ready, accessible, responsive site. The existing stack (Next.js 16 static export, GSAP 3.14, Tailwind v4, Lenis) already contains every tool needed -- responsive breakpoints, `gsap.matchMedia()`, CSS media queries, and the Next.js Metadata API. The core architectural task is extracting a 787-line monolithic component (Exploration6.tsx) into 6 independent section components, each owning their own GSAP animations via scoped `useGSAP` hooks. This extraction is the critical prerequisite that unblocks all other work.

The recommended approach is a strict 5-phase sequence: cleanup dead code first, then extract components, then layer responsive design, then accessibility, then performance tuning. This order is dictated by hard dependencies -- responsive and accessibility work targets the new section components, and performance tuning requires the final DOM structure to profile accurately. The single most important pattern across all research is `gsap.matchMedia()`, which simultaneously solves responsive animations, `prefers-reduced-motion` support, and zombie ScrollTrigger prevention.

The primary risks are: (1) GSAP scope orphaning during component extraction causing memory leaks and broken animations, (2) invisible content when `prefers-reduced-motion` is partially applied (elements stuck at `opacity: 0` from-state), and (3) `backdrop-filter: blur(40px)` on 15+ GlassPanels destroying mobile scroll performance. All three have well-documented prevention strategies. The Lighthouse 90+ mobile target is the only area with MEDIUM confidence -- GSAP bundle size (~45KB gzipped) and backdrop-filter compositing will need measurement-driven tuning.

## Key Findings

### Recommended Stack

No new packages. Every v4.3 requirement maps to existing tools or built-in browser APIs. See [STACK.md](./STACK.md) for full details.

**Core technologies (already installed):**
- **Tailwind v4 breakpoints + container queries**: Responsive layout -- mobile-first with `sm:`, `md:`, `lg:` prefixes, container queries now in core
- **`gsap.matchMedia()`**: Responsive animations AND reduced-motion -- auto-reverts animations when media queries change
- **Next.js Metadata API**: OG/Twitter meta tags -- static `metadata` export in `layout.tsx`, file-convention OG image
- **eslint-plugin-jsx-a11y** (via eslint-config-next): Lint-time accessibility checks -- already active, confirmed installed
- **CSS `@media (prefers-reduced-motion: reduce)`** + Tailwind `motion-reduce:`: CSS-level motion disabling

**What NOT to install:** `@axe-core/react`, `react-aria`, `@radix-ui/*`, `framer-motion`, `next-image-export-optimizer`, `web-vitals`, `@tailwindcss/container-queries` (v3 plugin, unnecessary in v4).

### Expected Features

See [FEATURES.md](./FEATURES.md) for full feature landscape and dependency graph.

**Must have (table stakes):**
- Mobile-responsive layout (grids collapse, hero text scales, touch-friendly tap targets)
- Keyboard navigation (project cards currently use `div[onClick]` -- must become `button`)
- Visible focus indicators (`focus-visible:ring-2` on all interactive elements)
- Color contrast WCAG AA (4.5:1 body text, 3:1 large text -- current `--text-secondary` likely fails)
- `prefers-reduced-motion` support (entire GSAP animation system + Lenis + gradient + cursor)
- Semantic HTML (`<main>`, `<nav aria-label>`, heading hierarchy, `aria-expanded` on project toggles)
- OG meta tags (title, description, image for social sharing)
- Favicon replacement (swap Vercel default)
- Lighthouse mobile >= 90 (all four categories)

**Should have (differentiators):**
- Graceful reduced-motion fallback (instant opacity fades, not blank content)
- Skip-to-content link
- Designed OG image matching site aesthetic (1200x630)
- Dark mode toggle accessible on mobile (currently hidden with FloatingNav below 768px)
- `aria-expanded` on project card toggles with `aria-controls`

**Defer to future:**
- Automated OG image generation (static image sufficient)
- Service worker / PWA (no offline use case)
- Hamburger menu (single-page scroll with natural navigation)
- `next-image-export-optimizer` (only ~3 raster images)

### Architecture Approach

Extract the monolithic Exploration6.tsx into 6 section components (Hero, About, Experience, Skills, Projects, Contact), each owning their own GSAP animations scoped via `useGSAP({ scope: sectionRef })`. Page-level concerns (gradient animation, noise overlay, ScrollTrigger.refresh) stay in `page.tsx`. A shared `useReducedMotion` hook provides centralized motion preference detection. See [ARCHITECTURE.md](./ARCHITECTURE.md) for file-by-file plan.

**Major components after refactor:**
1. **`page.tsx`** -- Page wrapper (gradient bg, noise filter, section ordering), calls `useGradientAnimation`, single `ScrollTrigger.refresh()` after all sections mount
2. **6 Section components** (HeroSection through ContactSection) -- Each owns its data imports from `content.ts`, its GSAP animations, its `sectionRef` scope. No inter-section communication. No props.
3. **`useReducedMotion` hook** -- Shared boolean for `prefers-reduced-motion`, consumed by all animated components (sections, GlassPanel tilt, SmoothScroll, gradient animation)
4. **`useGradientAnimation` hook** -- Extracted gradient cycling with theme MutationObserver, called from `page.tsx` only
5. **Modified `SmoothScroll.tsx`** -- Conditional Lenis initialization (skip entirely when reduced-motion active)
6. **Modified `FloatingNav.tsx`** -- Add mobile bottom bar navigation below `md` breakpoint

**Key patterns:** Each section follows an identical template (`"use client"`, own ref, own `useGSAP`, `aria-labelledby`, no props). Rename all `e6-` class prefixes to semantic names since `useGSAP({ scope })` prevents cross-section conflicts.

### Critical Pitfalls

See [PITFALLS.md](./PITFALLS.md) for all 14 pitfalls with detailed prevention strategies.

1. **GSAP scope orphaning during extraction** -- Each section MUST own its `useGSAP` + `containerRef`. Never leave animation logic in the parent while JSX moves to children. Test with `ScrollTrigger.getAll().length` on mount/unmount.
2. **Invisible content from partial reduced-motion** -- When skipping GSAP animations, elements stay at their `fromTo` initial state (`opacity: 0`). Must use `gsap.matchMedia()` and set all elements to FINAL visible state in the reduced-motion block.
3. **backdrop-filter blur(40px) on mobile** -- 15+ GlassPanels each create a compositing layer. Reduce to `blur(12px)` or replace with solid semi-transparent bg on mobile. Profile with 4x CPU throttle.
4. **SplitText breaks on resize** -- Use `autoSplit: true` with `onSplit()` callback. Apply gradient styles via CSS class, not inline JS forEach.
5. **Lenis fights native accessibility** -- Must check `prefers-reduced-motion` before initializing Lenis. Must verify VoiceOver cursor scrolling works.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Code Cleanup
**Rationale:** Unblocks everything. Dead code removal reduces bundle and eliminates confusion during extraction. Zero risk to live functionality.
**Delivers:** Clean codebase with no dead routes, no unused explorations, no Vercel default assets. New favicon in place.
**Addresses:** Favicon replacement, dead code removal, bundle reduction
**Avoids:** Pitfall 14 (dead imports after explore page removal)
**Scope:** Delete `src/app/explore/`, Exploration1-5.tsx, Vercel SVGs. Add favicon. Verify build.

### Phase 2: Component Extraction
**Rationale:** Architectural foundation. Every subsequent phase targets the new section components. Getting scoped `useGSAP` right here prevents cascading bugs.
**Delivers:** 6 independent section components, `useReducedMotion` hook, `useGradientAnimation` hook, updated `page.tsx`. Site functions identically to before.
**Addresses:** Exploration6 monolith decomposition, `e6-` class renaming
**Avoids:** Pitfalls 1 (scope orphaning), 6 (ScrollTrigger.refresh timing), 9 (querySelector), 10 (gradient animation ownership)
**Key risk:** This phase has the most pitfalls (4 critical/moderate). Extract one section at a time and verify after each.

### Phase 3: Responsive Design
**Rationale:** Highest user impact after extraction. 60%+ of portfolio traffic is mobile. Responsive work requires settled component boundaries for `gsap.matchMedia()` integration.
**Delivers:** Full mobile/tablet responsive layout, mobile bottom bar navigation, dark mode toggle on mobile, touch-friendly tap targets.
**Addresses:** Mobile-responsive layout, touch targets, dark mode toggle mobile placement, hero text scaling, grid collapse
**Avoids:** Pitfalls 2 (SplitText resize -- use `autoSplit`), 5 (backdrop-filter mobile -- plan fallback), 7 (zombie animations -- use `gsap.matchMedia()`)

### Phase 4: Accessibility
**Rationale:** Layers on responsive foundation. Reduced-motion relies on `gsap.matchMedia()` already being in place from Phase 3. Semantic HTML and keyboard nav target the extracted components.
**Delivers:** WCAG AA compliance -- semantic HTML, keyboard navigation, focus indicators, `prefers-reduced-motion`, color contrast, skip-to-content, ARIA attributes.
**Addresses:** All accessibility table stakes and differentiators from FEATURES.md
**Avoids:** Pitfalls 3 (invisible content), 4 (Lenis a11y), 8 (keyboard focus), 11 (color contrast), 12 (emoji noise)

### Phase 5: Meta Tags and Performance
**Rationale:** Performance tuning requires the final DOM structure. OG tags are independent but grouped here as final polish before launch.
**Delivers:** OG/Twitter meta tags, OG image, Lighthouse mobile 90+ across all categories, production-ready deployment.
**Addresses:** OG meta tags, OG image, Lighthouse 90+, final a11y sweep
**Avoids:** Pitfall 5 (backdrop-filter -- measurement-driven mobile fallback), 13 (no dynamic OG image with static export)

### Phase Ordering Rationale

- **Cleanup before extraction**: Fewer files to reason about, no dead imports to trip over.
- **Extraction before responsive/a11y**: Responsive and a11y changes target the new section components. Modifying Exploration6 monolith then extracting would mean doing the work twice.
- **Responsive before accessibility**: `gsap.matchMedia()` introduced in responsive phase is reused for `prefers-reduced-motion` in accessibility phase. Mobile layout must exist before touch targets and mobile nav can be verified.
- **Performance last**: Lighthouse profiling is only meaningful against the final DOM structure. Premature optimization wastes effort on code that will change.
- **Phases 3 and 4 are partially parallelizable**: They modify different aspects of the same components (layout vs semantics/motion). Can be interleaved if needed.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Component Extraction):** Most pitfall-dense phase. The SplitText `autoSplit` pattern and `ScrollTrigger.refresh()` coordination need careful implementation. GSAP forum threads provide guidance but extraction of this specific monolith structure is not a cookbook recipe.
- **Phase 5 (Performance):** Lighthouse 90+ mobile is MEDIUM confidence. Backdrop-filter mobile fallback and GSAP TBT mitigation may need iterative measurement. No upfront research can substitute for profiling.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Cleanup):** File deletion and build verification. No research needed.
- **Phase 3 (Responsive):** Tailwind mobile-first breakpoints and `gsap.matchMedia()` are well-documented with official examples.
- **Phase 4 (Accessibility):** WCAG AA patterns (semantic HTML, ARIA, focus-visible, reduced-motion) are thoroughly documented. The `gsap.matchMedia()` reduced-motion pattern has official CodePen examples.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Zero new dependencies. All tools verified as already installed. Official docs for every recommendation. |
| Features | HIGH | Feature list derived from direct codebase analysis + WCAG standards. Clear table stakes vs differentiators. |
| Architecture | HIGH | Based on direct analysis of all source files. Extraction plan is line-number specific. Patterns verified against GSAP official docs. |
| Pitfalls | HIGH | 14 pitfalls identified from GSAP docs, forum threads, and codebase-specific analysis. Prevention strategies are concrete. |

**Overall confidence:** HIGH (with one MEDIUM exception: Lighthouse 90+ mobile target)

### Gaps to Address

- **Lighthouse mobile 90+ achievability**: GSAP bundle (~45KB gzipped) + two Google Fonts + 15+ backdrop-filter layers is a heavy baseline for mobile. Confidence is MEDIUM. Must profile with real Lighthouse after Phase 4 and budget time in Phase 5 for iterative fixes.
- **Color contrast exact values**: Research flags `--text-secondary: #8a7d96` and `#b8a9c9` greeting text as likely contrast failures, but exact ratios against gradient backgrounds need tool measurement during Phase 4.
- **SplitText `autoSplit` with gradient text**: The hero name uses `background-clip: text` on split chars with inline JS style application. Whether `autoSplit` preserves gradient styling on re-split needs validation during Phase 2/3.
- **Lenis + VoiceOver interaction**: Research indicates Lenis may interfere with screen reader scrolling, but this needs manual testing. No automated test can verify this.

## Sources

### Primary (HIGH confidence)
- [GSAP gsap.matchMedia() docs](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()) -- responsive breakpoints, reduced-motion
- [GSAP React integration docs](https://gsap.com/resources/React/) -- useGSAP, contextSafe, scope
- [GSAP SplitText docs](https://gsap.com/docs/v3/Plugins/SplitText/) -- autoSplit, onSplit, resize handling
- [GSAP matchMedia reduced-motion CodePen](https://codepen.io/GreenSock/pen/RwMQwpR) -- official example
- [Next.js Metadata and OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) -- static metadata export
- [Next.js generateMetadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) -- OG tag structure
- [Tailwind CSS v4 Responsive Design](https://tailwindcss.com/docs/responsive-design) -- breakpoints, mobile-first
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) -- confirmed installed via eslint-config-next
- [Lighthouse Performance Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring) -- metric weights
- [web.dev prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion) -- implementation patterns

### Secondary (MEDIUM confidence)
- [GSAP and accessibility (Anne Bovelett)](https://annebovelett.eu/gsap-and-accessibility-yes-you-can-have-both/) -- reduced-motion GSAP patterns
- [GSAP in Practice: Avoid the Pitfalls (Marmelab)](https://marmelab.com/blog/2024/05/30/gsap-in-practice-avoid-the-pitfalls.html) -- common GSAP mistakes
- [WCAG 2.2 Complete Guide (AllAccessible)](https://www.allaccessible.org/blog/wcag-22-complete-guide-2025) -- focus-visible, contrast
- [Tailwind CSS v4 Container Queries (SitePoint)](https://www.sitepoint.com/tailwind-css-v4-container-queries-modern-layouts/) -- v4 container query syntax
- Direct codebase analysis of all source files in current repository

---
*Research completed: 2026-03-07*
*Ready for roadmap: yes*
