# Technology Stack

**Project:** Khai Phan Portfolio Site
**Researched:** 2026-03-06
**Overall confidence:** HIGH

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Next.js | 15.x (latest 15.5.x) | Framework / SSG | Best React framework for static export. Stick with 15.x over 16.x for a greenfield portfolio -- 15 is battle-tested, 16 has breaking async API changes that add complexity with zero benefit for a static site. Use `output: 'export'` for pure static HTML/CSS/JS. | HIGH |
| React | 19.x | UI library | Ships with Next.js 15 App Router. React 19 is stable and default. | HIGH |
| TypeScript | 5.x | Type safety | Non-negotiable for any modern project. Next.js 15 has first-class TS support with typed routes. | HIGH |

**Why Next.js over Astro:** Astro ships less JS by default, but this project is animation-heavy with cursor effects and micro-interactions throughout -- nearly every section needs client-side JS. Astro's islands architecture adds friction when most of the page is interactive. Next.js gives a unified React component model where GSAP and scroll animations work naturally without hydration boundaries. For a single-page portfolio with heavy interactivity, the Astro JS savings are negligible while the DX cost is real.

**Why Next.js 15 over 16:** Next.js 16 makes Turbopack default and removes synchronous API access entirely. For a new static portfolio site, these changes add migration risk with no meaningful benefit. Next.js 15.5.x is stable, well-documented, and fully supported. Upgrade to 16 later if needed.

### Styling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | 4.x | Utility-first CSS | v4 uses CSS-native `@theme` directive, OKLCH colors, faster builds via Oxide engine. Perfect for rapid layout iteration on creative designs. Pairs well with custom CSS for animation keyframes. | HIGH |

### Animation (Primary)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| GSAP | 3.14.x | Core animation engine | Industry standard for creative web. Now 100% free (all plugins) thanks to Webflow acquisition. Unmatched timeline system for orchestrating complex sequences. GPU-accelerated transforms. ~23KB gzipped. | HIGH |
| @gsap/react | 2.1.x | React integration | `useGSAP()` hook handles cleanup automatically via `gsap.context()`. SSR-safe (uses `useIsomorphicLayoutEffect`). Drop-in replacement for useEffect in animation code. | HIGH |
| GSAP ScrollTrigger | (included in gsap) | Scroll-driven animations | Free plugin for scroll-triggered animations, pinning, parallax. Essential for the scroll-heavy portfolio sections. | HIGH |
| GSAP SplitText | (included in gsap) | Text reveal animations | Now free and included in the standard GSAP package (v3.13+). Splits text into chars/words/lines for staggered reveals. Major overhaul with smaller bundle and accessibility improvements. | HIGH |

**Why GSAP over Motion (Framer Motion):** Both are excellent, but GSAP wins for this project:
1. **Timeline orchestration** -- GSAP's timeline system is purpose-built for sequencing complex animations across sections. Motion's stagger/orchestration is more limited.
2. **ScrollTrigger** -- First-class scroll-driven animations with pinning, scrubbing, and snap. Motion has scroll-linked animations but ScrollTrigger is more powerful.
3. **SplitText** -- Now free. No equivalent in Motion without a third-party library.
4. **Cursor effects** -- `gsap.quickTo()` is purpose-built for smooth cursor-following animations with configurable easing.
5. **Creative web ecosystem** -- Awwwards/FWA-level portfolio sites overwhelmingly use GSAP. More tutorials, examples, and patterns for exactly this use case.

Motion (~32KB) is better for simple component enter/exit animations. If specific components need declarative AnimatePresence-style mount/unmount animations, Motion can complement GSAP -- but it should not be the primary engine.

### Smooth Scrolling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Lenis | 1.3.x | Smooth scroll | De facto standard for creative sites. Lightweight, performant, works with GSAP ScrollTrigger. Used by Darkroom Engineering (top creative agency). Active maintenance. | HIGH |

### Deployment

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Vercel | - | Hosting & CDN | Zero-config Next.js deployment (same team). Free tier is generous for a portfolio. Automatic preview deployments, edge CDN, custom domain support. Static export means no serverless function costs. | HIGH |

**Why Vercel over Cloudflare Pages:** Cloudflare has unlimited bandwidth and a larger edge network, but for a personal portfolio the traffic won't hit Vercel's free tier limits. Vercel's Next.js integration is seamless -- deploy via `git push`, zero config. Cloudflare Pages requires adapters and has Next.js compatibility gaps. Not worth the friction for this use case.

### Supporting Libraries

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| clsx | 2.x | Conditional classnames | Composing Tailwind classes conditionally | HIGH |
| tailwind-merge | 2.x | Merge Tailwind classes | Resolving conflicting Tailwind classes in component props | HIGH |

## What NOT to Use

| Technology | Why Not |
|------------|---------|
| Three.js / React Three Fiber | Massive bundle, steep learning curve, not needed. 2D animations with GSAP achieve the creative effect without 3D overhead. Only add if a specific section demands 3D. |
| Anime.js | Smaller community, less ecosystem support than GSAP. GSAP is free now so the old cost advantage is gone. |
| Motion (Framer Motion) as primary | Declarative model adds overhead for timeline-heavy orchestration. Good as a complement for mount/unmount animations, but GSAP should drive the creative animations. |
| Locomotive Scroll | Abandoned in favor of Lenis by the same team (Darkroom Engineering). Use Lenis instead. |
| styled-components / Emotion | CSS-in-JS adds runtime overhead. Tailwind v4 with CSS custom properties covers all styling needs. |
| Astro | Islands architecture adds friction when most content is interactive. See rationale above. |
| React Spring | Physics-based but API is verbose and less intuitive than either GSAP or Motion for this use case. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Next.js 15 | Astro | Too much interactivity for islands model |
| Framework | Next.js 15 | Vite + React | Lose SSG, image optimization, file-based routing |
| Animation | GSAP | Motion (Framer Motion) | Weaker timeline/scroll orchestration for creative sites |
| Animation | GSAP | Anime.js | Smaller ecosystem, no ScrollTrigger equivalent |
| Smooth scroll | Lenis | GSAP ScrollSmoother | ScrollSmoother is heavier; Lenis is lighter and more widely adopted |
| Styling | Tailwind CSS 4 | CSS Modules | Slower iteration, no design token system |
| Hosting | Vercel | Cloudflare Pages | Next.js compatibility gaps, unnecessary complexity |

## Installation

```bash
# Core framework
npx create-next-app@latest portfolio-site --typescript --tailwind --eslint --app --src-dir

# Animation
npm install gsap @gsap/react

# Smooth scrolling
npm install lenis

# Utilities
npm install clsx tailwind-merge
```

## Key Configuration Notes

1. **Next.js static export** -- Set `output: 'export'` in `next.config.ts` for pure static site generation. No server required.
2. **GSAP + React** -- Always use `useGSAP()` hook (not raw `useEffect`) for automatic cleanup. Scope animations to component refs.
3. **GSAP + Lenis** -- Sync Lenis scroll position with GSAP's ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`.
4. **SplitText** -- Import from `gsap/SplitText`. Register plugin with `gsap.registerPlugin(SplitText)`.
5. **Tailwind v4** -- Uses `@theme` directive in CSS instead of `tailwind.config.js`. Design tokens defined as CSS custom properties.

## Sources

- [GSAP npm package](https://www.npmjs.com/package/gsap) -- v3.14.2, free including all plugins
- [@gsap/react npm package](https://www.npmjs.com/package/@gsap/react) -- v2.1.2, useGSAP hook
- [GSAP ScrollTrigger docs](https://gsap.com/scroll/)
- [GSAP SplitText docs](https://gsap.com/docs/v3/Plugins/SplitText/)
- [Motion (Framer Motion) docs](https://motion.dev/docs/react) -- v12.35.0
- [GSAP vs Motion comparison](https://motion.dev/docs/gsap-vs-motion)
- [Lenis GitHub](https://github.com/darkroomengineering/lenis) -- v1.3.15
- [Next.js 15 blog post](https://nextjs.org/blog/next-15)
- [Next.js 15 vs 16 comparison](https://www.descope.com/blog/post/nextjs15-vs-nextjs16)
- [Tailwind CSS v4 guide](https://blog.logrocket.com/tailwind-css-guide/)
- [Vercel vs Cloudflare Pages 2026](https://www.codebrand.us/blog/vercel-vs-netlify-vs-cloudflare-2026/)
- [GSAP + React cursor effects](https://medium.com/@amilmohd155/elevate-your-ux-build-a-smooth-custom-cursor-with-gsap-and-react-b2a1bb1c01e8)
- [Astro vs Next.js 2026](https://pagepro.co/blog/astro-nextjs/)
- [Setting up GSAP with Next.js 2025](https://javascript.plainenglish.io/setting-up-gsap-with-next-js-2025-edition-bcb86e48eab6)
