# Phase 1: Foundation and Design Exploration - Research

**Researched:** 2026-03-06
**Domain:** Next.js 16 + Tailwind CSS v4 + GSAP + Lenis app shell, design exploration routing
**Confidence:** HIGH

## Summary

This phase establishes the technical foundation (Next.js 16, Tailwind CSS v4.2, GSAP 3.14, Lenis) and creates 5 distinct design explorations as browsable routes. The stack is well-documented and stable. Next.js 16 ships with Turbopack by default, uses React 19.2, and has first-class Tailwind CSS v4 support via `create-next-app`. GSAP is now fully free (including SplitText, ScrollSmoother, etc.) thanks to Webflow sponsorship. Lenis provides smooth scrolling with a dedicated React integration (`lenis/react`).

The key technical challenge is properly wiring Lenis into GSAP's ticker for scroll synchronization, and ensuring dynamic routes (`/explore/[id]`) work with `output: 'export'` via `generateStaticParams`. Both are well-documented patterns.

**Primary recommendation:** Use `create-next-app` with `--typescript --tailwind --app --src-dir` defaults, then add GSAP + Lenis. Structure design explorations as dynamic route `/explore/[id]` with `generateStaticParams` for static export compatibility.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Generate exactly 5 distinct design directions, each as a separate route (`/explore/1` through `/explore/5`)
- Each exploration shows Hero section + one additional section (About or Projects) -- enough to feel the vibe without over-investing
- Use the `frontend-design` skill for each design to ensure high visual quality and avoid generic AI aesthetics
- After user reviews all 5, iterate on the favorite(s) until a final direction is selected and documented as a key decision
- Design directions (5 vibes):
  1. Light + airy -- Generous whitespace, soft pastel tones, elegant minimalism, clean typography
  2. Colorful + playful -- Saturated colors, unexpected color combinations, fun energy, personality-forward
  3. Glassmorphism -- Frosted glass panels with backdrop-blur, transparency layers, scroll animations, premium Apple-like polish
  4. Neobrutalism -- Thick borders, raw geometric shapes, bold colors, intentionally anti-polish aesthetic
  5. Video game-inspired -- Animated, interactive elements evoking game UI (HUD, level-up feel) but kept clean and not over-the-top

### Claude's Discretion
- Typography pairings for each design direction (pick what fits the mood)
- Color palette specifics per direction (guided by the mood descriptions above)
- Which "one additional section" to show alongside Hero in each exploration
- Animation details per exploration (keep lightweight -- this is a preview, not final implementation)
- Exact layout choices per direction

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFR-06 | Vercel deployment with static export (Next.js 16 + Tailwind v4.2 + GSAP 3.14 + Lenis) | Stack versions confirmed, `output: 'export'` config documented, `images: { unoptimized: true }` for static export, all packages current on npm |
| DSGN-01 | Multiple distinct design explorations generated for browser preview and user iteration before committing to a final direction | 5 routes via `/explore/[id]` dynamic route with `generateStaticParams`, each exploration as isolated client component with own theme tokens |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.x (latest) | React framework with App Router, Turbopack | Default bundler is Turbopack (5-10x faster HMR), React 19.2 built-in, `output: 'export'` for static deploy |
| react / react-dom | 19.2.x | UI library | Ships with Next.js 16, includes View Transitions API |
| tailwindcss | 4.2.x | CSS utility framework | CSS-first config via `@theme`, no `tailwind.config.js`, 70% smaller output than v3 |
| @tailwindcss/postcss | 4.x | PostCSS plugin for Tailwind v4 | Required integration path for Next.js |
| gsap | 3.14.x | Animation engine | All plugins now free (SplitText, ScrollSmoother, MorphSVG). Single animation library per project decision |
| @gsap/react | 2.x | React hooks for GSAP | `useGSAP()` hook with automatic cleanup, SSR-safe via `useIsomorphicLayoutEffect` |
| lenis | 1.3.x | Smooth scroll | Lightweight, integrates with GSAP ticker, has `lenis/react` subpackage |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next/font/google | (built-in) | Self-hosted Google Fonts | Every exploration needs typography -- zero external requests, no GDPR issues |
| typescript | 5.x | Type safety | Ships with `create-next-app` defaults |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Lenis | GSAP ScrollSmoother | ScrollSmoother is GSAP-native but heavier; Lenis is lighter and more community-standard for this pattern |
| Tailwind v4 @theme | tailwind.config.js (v3 style) | v4 CSS-first is the current standard; JS config is legacy |

**Installation:**
```bash
npx create-next-app@latest portfolio-site --typescript --tailwind --eslint --app --src-dir
cd portfolio-site
npm install gsap @gsap/react lenis
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── layout.tsx           # Root layout with font loading + Lenis provider
│   ├── page.tsx             # Landing / index with links to explorations
│   ├── globals.css          # Tailwind @import + @theme tokens
│   └── explore/
│       └── [id]/
│           └── page.tsx     # Dynamic route for design explorations
├── components/
│   ├── providers/
│   │   └── SmoothScroll.tsx # Lenis + GSAP ticker wiring ("use client")
│   └── explorations/
│       ├── Exploration1.tsx # Light + airy
│       ├── Exploration2.tsx # Colorful + playful
│       ├── Exploration3.tsx # Glassmorphism
│       ├── Exploration4.tsx # Neobrutalism
│       └── Exploration5.tsx # Video game-inspired
└── lib/
    └── gsap.ts              # GSAP plugin registration (single file)
```

### Pattern 1: Dynamic Route with Static Export
**What:** Use `/explore/[id]` with `generateStaticParams` to pre-render all 5 exploration routes at build time.
**When to use:** Required for `output: 'export'` to work with dynamic segments.
**Example:**
```typescript
// src/app/explore/[id]/page.tsx
export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }]
}

export default async function ExplorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // Render the appropriate exploration component
}
```

### Pattern 2: GSAP Plugin Registration (Single Entry Point)
**What:** Register all GSAP plugins once in a shared module, import that module in client components.
**When to use:** Always -- prevents duplicate registration and ensures plugins are available.
**Example:**
```typescript
// src/lib/gsap.ts
"use client"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export { gsap, ScrollTrigger, useGSAP }
```

### Pattern 3: Lenis + GSAP Ticker Synchronization
**What:** Wire Lenis scroll into GSAP's internal ticker so ScrollTrigger animations sync with smooth scroll position.
**When to use:** Any page using both Lenis smooth scroll and GSAP ScrollTrigger.
**Example:**
```typescript
// src/components/providers/SmoothScroll.tsx
"use client"
import { ReactLenis, type LenisRef } from "lenis/react"
import { useEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false }}>
      {children}
    </ReactLenis>
  )
}
```

### Pattern 4: Tailwind v4 CSS-First Theme Configuration
**What:** Define design tokens in CSS using `@theme` directive instead of JavaScript config.
**When to use:** All Tailwind v4 projects -- this is the standard approach.
**Example:**
```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  --font-display: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --color-primary-500: oklch(0.65 0.2 250);
  --color-surface: oklch(0.98 0 0);
  --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Pattern 5: Client Component Boundary for Animations
**What:** Mark components using GSAP/Lenis with `"use client"` directive. Keep server components for layout/data.
**When to use:** Every component that uses `useGSAP`, `useRef`, or browser APIs.

### Anti-Patterns to Avoid
- **Registering GSAP plugins in every component:** Register once in a shared module, import from there
- **Using Lenis autoRaf with GSAP ticker:** Set `autoRaf: false` when GSAP drives the animation loop -- double RAF causes jank
- **Creating tailwind.config.js with Tailwind v4:** Use CSS-first `@theme` configuration; JS config is legacy
- **Using `next export` CLI command:** Removed in Next.js 14+; use `output: 'export'` in next.config.ts
- **Forgetting generateStaticParams with output: 'export':** Dynamic routes without it will fail at build time

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Smooth scrolling | Custom RAF scroll interpolation | Lenis | Handles edge cases: focus management, anchor links, reduced motion, iOS momentum |
| Animation lifecycle in React | Manual useEffect cleanup | `useGSAP()` from `@gsap/react` | Auto-reverts all animations/ScrollTriggers on unmount, handles SSR |
| Font loading/optimization | Manual @font-face + preload | `next/font/google` | Self-hosts at build time, eliminates layout shift, zero config |
| CSS utility framework config | Custom CSS variables system | Tailwind v4 `@theme` | Automatic utility generation, tree-shaking, IDE support |
| Scroll-triggered animations | IntersectionObserver + manual state | GSAP ScrollTrigger | Handles pin, scrub, snap, responsive breakpoints, cleanup |

**Key insight:** Every "simple" scroll or animation solution becomes complex when handling resize, unmount, reduced motion, SSR, and mobile. The stack handles all of these.

## Common Pitfalls

### Pitfall 1: Lenis + ScrollTrigger Desync
**What goes wrong:** ScrollTrigger triggers fire at wrong positions or not at all when using Lenis smooth scroll.
**Why it happens:** Lenis overrides native scroll behavior; ScrollTrigger needs to read Lenis's virtual scroll position, not the browser's.
**How to avoid:** Wire Lenis into GSAP ticker with `autoRaf: false`, add `lenis.on('scroll', ScrollTrigger.update)` pattern.
**Warning signs:** Animations triggering at wrong scroll positions, or not triggering on first scroll.

### Pitfall 2: GSAP ScrollTrigger Accumulation on Resize
**What goes wrong:** ScrollTrigger instances multiply when browser resizes or components re-render, causing memory leaks and jank.
**Why it happens:** React re-renders create new ScrollTrigger instances without killing old ones.
**How to avoid:** Use `useGSAP()` hook (auto-cleanup). For resize-dependent triggers, use `revertOnUpdate: true` option. Always use `contextSafe` for event handlers that create animations.
**Warning signs:** Performance degrading over time, multiple animation instances firing simultaneously.

### Pitfall 3: Static Export + Dynamic Routes Build Failure
**What goes wrong:** Build fails with "Page with dynamic path requires generateStaticParams" error.
**Why it happens:** `output: 'export'` needs all routes known at build time.
**How to avoid:** Always export `generateStaticParams` from dynamic route pages.
**Warning signs:** Build errors mentioning dynamic params or static export.

### Pitfall 4: next/image with Static Export
**What goes wrong:** Build fails because Image Optimization API requires a server.
**Why it happens:** `next/image` default loader needs server-side processing, incompatible with `output: 'export'`.
**How to avoid:** Set `images: { unoptimized: true }` in `next.config.ts`. For this phase, use standard `<img>` tags or CSS backgrounds -- no heavy image assets yet.
**Warning signs:** Build error about Image Optimization API.

### Pitfall 5: "use client" Missing on Animation Components
**What goes wrong:** Server-side rendering errors: "useRef is not a function" or similar React hook errors.
**Why it happens:** GSAP hooks use browser APIs that don't exist in server components.
**How to avoid:** Add `"use client"` to every component file that imports from `@gsap/react`, `lenis/react`, or uses `useRef`/`useEffect`.
**Warning signs:** Hydration errors, "window is not defined" errors.

## Code Examples

### Next.js Config for Static Export
```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

### Root Layout with Fonts + Smooth Scroll
```typescript
// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { SmoothScrollProvider } from "@/components/providers/SmoothScroll"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "Khai Phan - Portfolio",
  description: "Software engineer portfolio",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-body antialiased">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
```

### Exploration Index Page
```typescript
// src/app/page.tsx
import Link from "next/link"

const explorations = [
  { id: 1, name: "Light + Airy", description: "Generous whitespace, soft pastels, elegant minimalism" },
  { id: 2, name: "Colorful + Playful", description: "Saturated colors, fun energy, personality-forward" },
  { id: 3, name: "Glassmorphism", description: "Frosted glass panels, transparency layers, Apple-like polish" },
  { id: 4, name: "Neobrutalism", description: "Thick borders, raw shapes, bold colors, anti-polish" },
  { id: 5, name: "Video Game-Inspired", description: "Game UI elements, HUD feel, interactive but clean" },
]

export default function HomePage() {
  return (
    <main>
      <h1>Design Explorations</h1>
      <nav>
        {explorations.map((exp) => (
          <Link key={exp.id} href={`/explore/${exp.id}`}>
            <h2>{exp.name}</h2>
            <p>{exp.description}</p>
          </Link>
        ))}
      </nav>
    </main>
  )
}
```

### Basic useGSAP Animation Pattern
```typescript
// Example animation in an exploration component
"use client"
import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap"

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from(".hero-title", {
      y: 80,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef}>
      <h1 className="hero-title">Hello</h1>
    </section>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` (JS) | `@theme` in CSS | Tailwind v4.0, Jan 2025 | No JS config file needed |
| `next export` CLI | `output: 'export'` in config | Next.js 14, Oct 2023 | CLI command removed entirely |
| Webpack bundler | Turbopack (default) | Next.js 16, Oct 2025 | 5-10x faster HMR |
| GSAP paid plugins | All plugins free | GSAP 3.12+, 2024 | SplitText, ScrollSmoother, MorphSVG all included |
| `@studio-freight/lenis` | `lenis` | 2024 | Old package name deprecated, use `lenis` |
| `useEffect` for GSAP | `useGSAP()` hook | @gsap/react 2.x | Auto-cleanup, SSR-safe, context-safe |
| React 18 | React 19.2 | Next.js 16 | View Transitions, Activity, useEffectEvent |

**Deprecated/outdated:**
- `@studio-freight/lenis`: Use `lenis` package instead
- `tailwind.config.js`: Use CSS `@theme` with Tailwind v4
- `next export`: Use `output: 'export'` in next.config.ts
- `gsap-trial`: No longer needed, all plugins are free in `gsap` package
- Manual `useEffect`/`useLayoutEffect` for GSAP: Use `useGSAP()` hook

## Open Questions

1. **`frontend-design` skill availability**
   - What we know: CONTEXT.md references using this skill for design generation. No `.claude/skills/` or `.agents/skills/` directory exists in the project yet.
   - What's unclear: Whether this skill is installed globally or needs to be created/installed before implementation.
   - Recommendation: Planner should note that the skill must be available before design exploration tasks execute. If it is a prompt-engineering skill for Claude, document the expected usage pattern.

2. **Tailwind v4.2 specific features vs v4.0**
   - What we know: v4.2.1 is the latest release. The user specified "v4.2" in requirements.
   - What's unclear: v4.2-specific features beyond v4.0/v4.1 are not well-documented yet.
   - Recommendation: Install latest (`npm install tailwindcss`) which will resolve to 4.2.x. Core `@theme` API is stable across v4.x.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected -- greenfield project |
| Config file | None -- see Wave 0 |
| Quick run command | `npm run build` (static export validates all routes compile) |
| Full suite command | `npm run build && npx serve out -l 3001` (build + serve to verify) |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INFR-06 | Next.js 16 app builds with static export, all dependencies working | smoke | `npm run build` (output: 'export' produces `out/` dir) | N/A -- build system |
| INFR-06 | GSAP + Lenis initialize without errors | smoke | `npm run dev` + manual browser check | N/A -- runtime |
| DSGN-01 | 5 design explorations render at `/explore/1` through `/explore/5` | smoke | `npm run build` (generateStaticParams produces 5 routes) | N/A -- build validates |
| DSGN-01 | Each exploration has distinct visual identity | manual-only | Visual browser review by user | N/A -- subjective |

### Sampling Rate
- **Per task commit:** `npm run build` (confirms static export succeeds)
- **Per wave merge:** `npm run build && ls out/explore/` (verify all 5 routes exist in output)
- **Phase gate:** Full build green + user visual review of all 5 explorations

### Wave 0 Gaps
- [ ] Project scaffolding via `create-next-app` -- no existing project structure
- [ ] `next.config.ts` with `output: 'export'` and `images: { unoptimized: true }`
- [ ] Formal test framework not required for this phase (build success = primary validation)

## Sources

### Primary (HIGH confidence)
- [Next.js 16 blog post](https://nextjs.org/blog/next-16) -- Turbopack default, React 19.2, create-next-app defaults
- [Next.js static exports guide](https://nextjs.org/docs/app/guides/static-exports) -- `output: 'export'` config
- [Next.js generateStaticParams docs](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) -- dynamic routes with static export
- [Tailwind CSS v4.0 blog](https://tailwindcss.com/blog/tailwindcss-v4) -- CSS-first `@theme` configuration
- [Tailwind CSS theme docs](https://tailwindcss.com/docs/theme) -- `@theme` directive reference
- [GSAP React docs](https://gsap.com/resources/React/) -- `useGSAP()` hook, cleanup, contextSafe
- [Lenis GitHub](https://github.com/darkroomengineering/lenis) -- React integration, GSAP sync pattern

### Secondary (MEDIUM confidence)
- [GSAP npm page](https://www.npmjs.com/package/gsap) -- version 3.14.2 confirmed
- [Lenis npm page](https://www.npmjs.com/package/lenis) -- version 1.3.16 confirmed
- [Tailwind CSS npm](https://www.npmjs.com/package/tailwindcss) -- version 4.2.1 confirmed
- [Next.js font optimization docs](https://nextjs.org/docs/app/getting-started/fonts) -- next/font/google self-hosting

### Tertiary (LOW confidence)
- [GSAP resize bug deep-dive](https://sdust.dev/posts/2024-06-24_we-spent-six-days-on-this-gsap-resize-bug) -- ScrollTrigger accumulation issue (single source, but matches official docs on cleanup)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all versions confirmed on npm, official docs current
- Architecture: HIGH -- patterns verified against official Next.js 16 and GSAP React docs
- Pitfalls: HIGH -- documented in official GSAP forums and Next.js docs, multiple sources confirm

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (30 days -- stable stack, no expected breaking changes)
