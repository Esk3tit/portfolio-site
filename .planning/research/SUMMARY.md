# Project Research Summary

**Project:** Khai Phan Portfolio Site
**Domain:** Creative, animation-heavy software engineer portfolio website
**Researched:** 2026-03-06
**Confidence:** HIGH

## Executive Summary

This is a single-page, animation-heavy portfolio website for a software engineer, targeting recruiters, hiring managers, and fellow developers. The expert consensus for this type of creative portfolio is clear: Next.js 15 with static export for the framework, GSAP as the primary animation engine (with ScrollTrigger and SplitText), Lenis for smooth scrolling, and Tailwind CSS v4 for styling. This stack is battle-tested across award-winning creative portfolios and avoids the complexity traps of 3D (Three.js), heavy CSS-in-JS, or islands-based frameworks like Astro where most of the page is interactive anyway.

The recommended approach is to build foundation-first: establish the app shell, smooth scroll provider, animation utilities, and accessibility primitives (reduced-motion detection, semantic HTML) before writing any section content. Then build all six content sections with basic animations. Layer interactivity (custom cursor, magnetic effects, scroll-triggered reveals) only after content is complete and functional. This order ensures the site is always usable -- a static, content-complete portfolio is infinitely better than a half-animated, half-empty one.

The primary risks are mobile animation performance (animations smooth on MacBook that stutter on phones), custom cursor effects breaking on touch devices, and "style over substance" where creative animations hide content from recruiters who spend 6-10 seconds scanning. All three are avoidable by testing on throttled hardware early, designing touch-first interactions, and ensuring content is readable before animations fire. A secondary risk is the inconsistency between GSAP (recommended by stack research) and Framer Motion (referenced in architecture patterns) -- the project should commit to GSAP as the single animation engine to avoid bundle bloat and API confusion.

## Key Findings

### Recommended Stack

The stack is straightforward and high-confidence. Every choice has strong community consensus for creative portfolio sites.

**Core technologies:**
- **Next.js 15.x** (static export): Best React framework for SSG. Use `output: 'export'` for pure static HTML/CSS/JS. No server needed, deploys anywhere.
- **GSAP 3.14.x + @gsap/react**: Primary animation engine. Timeline orchestration, ScrollTrigger for scroll-driven animations, SplitText for text reveals, `quickTo()` for cursor effects. All plugins now free.
- **Lenis 1.3.x**: Smooth scroll library. De facto standard for creative sites. Syncs with GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`.
- **Tailwind CSS 4.x**: Utility-first styling with CSS-native `@theme` directive and OKLCH colors. Design tokens as CSS custom properties.
- **TypeScript 5.x**: Non-negotiable type safety. First-class support in Next.js 15.
- **Vercel**: Zero-config deployment for Next.js. Free tier sufficient for portfolio traffic.

**What to avoid:** Three.js/R3F (overkill), Framer Motion as primary engine (weaker timeline/scroll orchestration), Locomotive Scroll (abandoned, use Lenis), styled-components (runtime overhead), Astro (friction with heavy interactivity).

### Expected Features

**Must have (table stakes):**
- Hero section with name, role, and personality-driven intro
- About section (concise, 2-3 paragraphs)
- Work experience with clear timeline structure
- Projects showcase (4-6 high-quality projects with descriptions, tech, links)
- Skills/tech stack display organized by category
- Contact section (email, LinkedIn, GitHub)
- Resume PDF download
- Responsive design across all breakpoints
- Open Graph meta tags for link sharing
- Semantic HTML and basic accessibility
- `prefers-reduced-motion` support

**Should have (differentiators for v1):**
- Custom cursor effects (desktop only, disabled on touch)
- Scroll-triggered section reveal animations
- Micro-interactions on buttons, links, and cards
- Dark mode with system preference detection
- Text reveal animations (character/word split via SplitText)

**Defer (v1.x and v2+):**
- Loading/intro animation (polish, not essential for first deploy)
- Interactive project cards with tilt/hover previews
- Noise/grain texture overlay
- Gradient animations
- Non-linear/unexpected layouts (high complexity)
- Analytics integration

### Architecture Approach

The architecture is a nested provider pattern: App Shell wraps Smooth Scroll Provider (Lenis), which wraps Animation Context, which wraps Custom Cursor Provider, which wraps page content. Each portfolio section (Hero, About, Work, Skills, Projects, Contact) is a self-contained component that consumes shared animation hooks and content from typed TypeScript data files. No backend, no CMS, no API calls -- fully static.

**Major components:**
1. **App Shell / Layout** (`app/layout.tsx`): Root layout, fonts, metadata, provider composition
2. **Smooth Scroll Provider**: Lenis wrapper that normalizes scroll and broadcasts position to GSAP ScrollTrigger
3. **Section Components** (`components/sections/`): Six self-contained sections with own layouts and animations
4. **Animation Primitives** (`components/ui/`): Reusable components (TextReveal, MagneticButton, ParallaxImage, StaggerContainer)
5. **Custom Cursor System** (`components/cursor/`): Global cursor tracking, variant states (default/hover/magnetic), disabled on touch
6. **Content Data** (`data/*.ts`): Typed TypeScript objects for experience, projects, skills -- no async loading
7. **Animation Utilities** (`lib/animations.ts`): Shared GSAP timeline configs, easing curves, duration constants

### Critical Pitfalls

1. **Mobile animation performance death**: Animations smooth on desktop stutter on phones. Prevent by only animating `transform` and `opacity`, testing on 4x CPU throttle throughout development, capping simultaneous animated elements.
2. **Custom cursor breaks on touch devices**: No cursor on mobile means cursor effects are invisible. Prevent by detecting `(pointer: fine)` and conditionally mounting cursor components. Never gate content behind hover.
3. **Recruiter abandonment (style over substance)**: Recruiters spend 6-10 seconds scanning. If animations block content discovery, they leave. Prevent by keeping entrance animations under 400ms, providing visible navigation, ensuring content is readable before animations complete.
4. **Ignoring prefers-reduced-motion**: Parallax and continuous motion cause physical harm to users with vestibular disorders. Prevent by creating a motion preference hook consumed by all animation components from day one.
5. **Scroll hijacking**: Custom scroll behavior breaks muscle memory and can trap users. Prevent by never overriding native scroll velocity, preferring scroll-triggered over scroll-linked animations for content.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation and App Shell
**Rationale:** Every component depends on the scroll provider, animation utilities, and accessibility primitives. These must exist before any section is built. The architecture research and pitfalls research both emphasize that animation patterns, performance budgets, and reduced-motion support must be established first.
**Delivers:** Working Next.js app with Tailwind, Lenis smooth scroll, GSAP setup, animation utility library, reduced-motion hook, dark mode infrastructure (CSS custom properties), responsive breakpoint system, font loading strategy.
**Features addressed:** Responsive design foundation, reduced-motion support, dark mode system preference detection.
**Pitfalls avoided:** Animation performance (patterns set early), prefers-reduced-motion (hook created before any animations), font loading flash (strategy set in layout).

### Phase 2: Content Sections
**Rationale:** The site has no value without content. Building all six sections with static content and basic scroll-triggered reveals ensures a complete, usable portfolio exists before layering creative effects. This directly prevents the "style over substance" pitfall.
**Delivers:** Hero, About, Work Experience, Skills, Projects, and Contact sections. All with typed content data, semantic HTML, proper heading hierarchy, basic GSAP scroll-triggered entrance animations. Resume PDF download. Navigation with scroll-to and active section indicator.
**Features addressed:** All table stakes features (hero, about, work, projects, skills, contact, resume, navigation, OG meta tags).
**Pitfalls avoided:** Recruiter abandonment (content-first), accessibility failures (semantic HTML from the start), scroll hijacking (natural scroll with triggered animations).

### Phase 3: Interactivity and Creative Layer
**Rationale:** Cursor effects, magnetic buttons, and advanced animations need existing content elements to interact with. This phase transforms a functional portfolio into a memorable one.
**Delivers:** Custom cursor system (desktop only), magnetic button effects on interactive elements, text reveal animations (SplitText), enhanced micro-interactions on hover/click, refined scroll-triggered animation timelines.
**Features addressed:** Custom cursor effects, micro-interactions, text reveal animations.
**Pitfalls avoided:** Touch device breakage (cursor conditionally mounted), over-animation (applied strategically to key elements, not everything).

### Phase 4: Polish, Accessibility, and Launch
**Rationale:** Responsive fine-tuning, accessibility verification, and performance optimization are most efficient when the full site is assembled. This is also where the "looks done but isn't" checklist gets addressed.
**Delivers:** Mobile-specific layouts and interaction patterns, keyboard navigation and focus management, Lighthouse performance optimization, image optimization, bundle analysis, Vercel deployment, 404 page.
**Features addressed:** Full responsive design, accessibility compliance, performance targets, deployment.
**Pitfalls avoided:** Mobile performance death (full device testing), memory leaks (cleanup verification), all "looks done but isn't" items.

### Phase Ordering Rationale

- **Foundation before content:** Lenis, GSAP, and animation hooks are infrastructure that sections consume. Building a section without the scroll provider means rebuilding its animations later.
- **Content before interactivity:** Custom cursor and magnetic effects have no targets without sections. More importantly, a content-complete static site is a working portfolio; a half-animated site with missing sections is not.
- **Interactivity before polish:** Creative effects may introduce performance issues or accessibility gaps that the polish phase needs to catch and fix.
- **This order maps to decreasing criticality:** Phase 1-2 failures mean no portfolio. Phase 3 failure means a functional but unremarkable portfolio. Phase 4 failure means a good portfolio that needs minor fixes.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Interactivity):** Custom cursor implementation with GSAP `quickTo()`, magnetic effect hook design, and SplitText integration all have nuances worth researching specific patterns. The architecture research referenced Framer Motion patterns here, but implementation should use GSAP -- research the GSAP-specific approach.

Phases with standard patterns (skip research):
- **Phase 1 (Foundation):** Next.js 15 setup, Tailwind v4, Lenis integration, and GSAP registration are all well-documented with official guides.
- **Phase 2 (Content Sections):** Standard React component composition with typed data. Scroll-triggered reveals with GSAP ScrollTrigger are extensively documented.
- **Phase 4 (Polish):** Lighthouse optimization, responsive CSS, and Vercel deployment are standard procedures.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All recommendations backed by official docs, npm data, and community consensus. GSAP's free licensing (post-Webflow acquisition) is verified. Next.js 15 vs 16 tradeoff is well-reasoned. |
| Features | HIGH | Feature set validated against competitor analysis (Bruno Simon, Brittany Chiang, Joffrey Spitzer) and recruiter survey data. Clear MVP definition with sensible v1/v1.x/v2 splits. |
| Architecture | MEDIUM-HIGH | Provider composition pattern and project structure are sound. However, architecture doc references Framer Motion patterns while stack doc recommends GSAP -- implementation details need reconciliation to use GSAP throughout. |
| Pitfalls | HIGH | Pitfalls are specific, actionable, and backed by web.dev, WCAG specs, and hiring manager surveys. Phase mappings are practical. |

**Overall confidence:** HIGH

### Gaps to Address

- **GSAP vs Framer Motion reconciliation:** The architecture research used Framer Motion examples (useScroll, useTransform, motion.div) while the stack research recommends GSAP. During phase planning, architecture patterns need to be translated to GSAP equivalents (ScrollTrigger instead of useScroll, gsap.to() instead of motion variants, useGSAP() instead of useEffect). This is straightforward but must be done deliberately.
- **Dark mode implementation specifics:** Both research files mention dark mode but neither details the toggle mechanism or persistence strategy with Next.js static export. Plan for CSS custom properties toggled via a class on `<html>`, persisted in localStorage, with system preference as default.
- **Image optimization with static export:** Next.js `next/image` has limitations with `output: 'export'` (no server-side optimization). Need to decide on build-time image optimization strategy (sharp, or pre-optimized assets).
- **GSAP + Lenis integration specifics:** The sync pattern (`lenis.on('scroll', ScrollTrigger.update)`) is documented but edge cases (resize handling, cleanup on unmount) need attention during Phase 1.

## Sources

### Primary (HIGH confidence)
- [GSAP npm package](https://www.npmjs.com/package/gsap) -- v3.14.2, free plugins
- [GSAP ScrollTrigger docs](https://gsap.com/scroll/)
- [GSAP SplitText docs](https://gsap.com/docs/v3/Plugins/SplitText/)
- [@gsap/react](https://www.npmjs.com/package/@gsap/react) -- v2.1.2, useGSAP hook
- [Next.js 15 blog post](https://nextjs.org/blog/next-15)
- [Lenis GitHub](https://github.com/darkroomengineering/lenis) -- v1.3.15
- [web.dev: prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion)
- [W3C WCAG 2.1: Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)

### Secondary (MEDIUM confidence)
- [profy.dev: Portfolio websites survey with 60+ hiring managers](https://profy.dev/article/portfolio-websites-survey)
- [Codrops: Joffrey Spitzer Portfolio](https://tympanus.net/codrops/2026/02/18/joffrey-spitzer-portfolio-a-minimalist-astro-gsap-build-with-reveals-flip-transitions-and-subtle-motion/)
- [Awwwards: Portfolio Websites](https://www.awwwards.com/websites/portfolio/)
- [Muzli: Top 100 Creative Portfolio Websites 2025](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/)
- [Motion.dev: GSAP vs Motion comparison](https://motion.dev/docs/gsap-vs-motion)
- [Vercel vs Cloudflare Pages 2026](https://www.codebrand.us/blog/vercel-vs-netlify-vs-cloudflare-2026/)

### Tertiary (LOW confidence)
- Architecture patterns referencing Framer Motion need translation to GSAP equivalents -- patterns are sound but code examples need adaptation

---
*Research completed: 2026-03-06*
*Ready for roadmap: yes*
