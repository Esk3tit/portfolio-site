# Khai Phan Portfolio Site

## What This Is

A personal portfolio website for Khai Phan, a software engineer from Vietnam. The site showcases work experience, projects, and skills through a Liquid Glass + Neobrutalism hybrid design with scroll animations, a custom banana cursor, dark mode, and personality-driven copy -- a deliberate departure from standard portfolio layouts. Replaces the existing site at khaiphan.dev.

## Core Value

Visitors immediately get a sense of Khai's personality and technical ability through a portfolio that is as engaging to interact with as the work it showcases.

## Requirements

### Validated

- ✓ Hero section with animated intro and personality-driven copy -- v4.2
- ✓ About section with background, interests, and what Khai does -- v4.2
- ✓ Work experience section with clear timeline of past roles -- v4.2
- ✓ Skills section organized by category with visual display -- v4.2
- ✓ Projects showcase with descriptions, tech stack tags, and GitHub links -- v4.2
- ✓ Contact section with email, LinkedIn, and GitHub links -- v4.2
- ✓ Resume PDF download via git-committed file -- v4.2
- ✓ Multiple design explorations generated for browser preview before committing -- v4.2
- ✓ Creative layout with asymmetric grids, overlapping elements, unconventional flow -- v4.2
- ✓ Dark mode with system preference detection and animated toggle -- v4.2
- ✓ Noise/grain texture overlay for visual depth -- v4.2
- ✓ Gradient animations and dynamic color shifts -- v4.2
- ✓ Personality-driven copy tone throughout -- v4.2
- ✓ Scroll-triggered section reveal animations (GSAP ScrollTrigger) -- v4.2
- ✓ Custom cursor effects on desktop with magnetic pull -- v4.2
- ✓ Hover micro-interactions on buttons, links, and cards -- v4.2
- ✓ Text reveal animations with SplitText on headings -- v4.2
- ✓ Vercel deployment with static export (Next.js 16 + Tailwind v4.2 + GSAP 3.14 + Lenis) -- v4.2
- ✓ Remove explore pages and Vercel default assets -- v4.3
- ✓ Extract Exploration6.tsx into 6 independent section components -- v4.3
- ✓ Remove dead code (orphaned CSS, unused imports) -- v4.3
- ✓ Replace favicon with old portfolio favicon -- v4.3
- ✓ Responsive design across mobile, tablet, and desktop breakpoints -- v4.3
- ✓ Mobile navigation with hamburger menu and glass drawer -- v4.3
- ✓ Open Graph and Twitter Card meta tags for social previews -- v4.3
- ✓ prefers-reduced-motion support with gsap.matchMedia() branching -- v4.3
- ✓ Semantic HTML, keyboard navigation, focus-visible, skip-to-content -- v4.3
- ✓ WCAG AA color contrast in both themes -- v4.3
- ✓ ARIA labels on interactive elements -- v4.3
- ✓ Lighthouse mobile score 90+ via GSAP code-splitting -- v4.3

### Active

(None -- planning next milestone)

### Out of Scope

- Contact form with backend -- simplified to links only
- CMS or headless CMS -- content lives in code/repo
- Blog section -- not requested, can be separate platform later
- 3D WebGL scenes (Three.js) -- massive bundle, kills mobile performance
- Particle systems / heavy canvas -- battery killer on mobile
- Sound/audio effects -- universally disliked
- Template/theme usage -- portfolio itself is proof of skill
- Page-per-section routing -- single page with smooth scroll is simpler
- Chatbot / AI assistant -- gimmicky on a portfolio

## Context

Shipped v4.3 with ~8,100 lines across 70+ files.
Tech stack: Next.js 16, Tailwind v4.2, GSAP 3.14 (code-split via dynamic imports), Lenis smooth scroll.
Design: Liquid Glass + Neobrutalism hybrid -- see-through glass panels with specular rims, 3px #3d3248 borders, offset shadows, warm mid-tone gradient background.
Architecture: 6 independent section components (Hero, About, Experience, Skills, Projects, Contact) with scoped GSAP animations.
Responsive: Mobile hamburger nav with glass drawer, touch-friendly targets, fluid typography.
Accessible: Semantic HTML, keyboard nav, focus-visible, skip-to-content, WCAG AA contrast, prefers-reduced-motion.
Content data in `src/data/content.ts` with TODO markers for Khai to personalize (resume PDF, email, experience details).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| No contact form | Simplifies architecture, no backend needed | ✓ Good |
| Git-committed resume PDF | Simplest workflow -- commit and deploy | ✓ Good |
| Playful + creative direction | User wants to break from standard portfolio format | ✓ Good |
| Frontend-design skill for UI | Ensures high design quality, avoids generic look | ✓ Good |
| HYBRID design: Glass + Airy + Playful + Neobrutalism | User reviewed 5 explorations, combined best elements. Video Game (#5) dropped. | ✓ Good |
| Liquid Glass + Neobrutalism as final refined style | See-through panels, specular rims, 3px borders, warm background, no orbs | ✓ Good |
| Exploration6.tsx as main page | Single file renders at `/`, all Phase 2+ extends it | ✓ Good |
| GSAP as single animation engine (no Framer Motion) | Research reconciliation -- one engine, no conflicts | ✓ Good |
| CSS custom properties for theming (not Tailwind dark:) | Full control over theme switching with MutationObserver | ✓ Good |
| CSS banana cursor replacing GSAP dot follower | User feedback: GSAP cursor had visible lag | ✓ Good |
| SplitText word split for headings, char split for hero | Visual hierarchy -- hero gets more dramatic reveal | ✓ Good |
| BEM naming convention ({section}-section__{element}) | Clear component boundaries, replaces e6-* prefixes | ✓ Good |
| Each section owns containerRef + useGSAP scope | Independent hot-reload, scoped animations | ✓ Good |
| Visibility-hidden mount for GSAP drawer targets | Avoids conditional render breaking GSAP refs | ✓ Good |
| gsap.matchMedia() for reduced-motion branching | Full animations vs instant opacity reveals per preference | ✓ Good |
| initGSAP singleton with Promise caching | Prevents duplicate dynamic imports across 13 consumers | ✓ Good |
| 12px mobile blur threshold | Under 20px GPU cost limit for mobile performance | ✓ Good |
| metadataBase set to https://khaiphan.dev | Absolute URL resolution for OG tags | ✓ Good |

## Constraints

- **Design quality**: Must use frontend-design skill to avoid generic AI aesthetics
- **Resume workflow**: PDF must be swappable by simply committing a new file to the repo
- **Performance**: Animations and effects must not degrade performance on mid-range devices
- **Accessibility**: Creative layout must remain navigable and readable

---
*Last updated: 2026-03-09 after v4.3 milestone*
