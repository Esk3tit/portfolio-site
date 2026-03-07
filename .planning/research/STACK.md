# Technology Stack

**Project:** Khai Phan Portfolio v4.3 -- Cleanup and Launch
**Researched:** 2026-03-07
**Scope:** Stack additions for responsive design, accessibility, prefers-reduced-motion, OG meta tags, and Lighthouse 90+ performance

## Existing Stack (DO NOT CHANGE)

Already validated in v4.2, not re-researched:

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.6 | Framework, static export |
| React | 19.2.3 | UI library |
| Tailwind CSS | v4.x | Styling |
| GSAP | 3.14.2 | Animations, ScrollTrigger, SplitText |
| @gsap/react | 2.1.2 | useGSAP hook |
| Lenis | 1.3.18 | Smooth scroll |
| eslint-config-next | 16.1.6 | Linting (includes jsx-a11y) |

## Stack Additions for v4.3

### Zero new dependencies needed.

The v4.3 requirements (responsive, a11y, reduced-motion, OG tags, Lighthouse 90+) are achievable entirely with the existing stack plus built-in browser/framework APIs. Adding libraries for what CSS media queries, HTML semantics, and Next.js metadata API already handle would be over-engineering.

---

## Responsive Design

| Tool | Already Have | Purpose | How |
|------|-------------|---------|-----|
| Tailwind v4 breakpoints | Yes | Viewport-based responsive | `sm:`, `md:`, `lg:`, `xl:` prefixes |
| Tailwind v4 container queries | Yes (core in v4) | Component-level responsive | `@container` / `@md:`, `@lg:` prefixes |
| CSS `clamp()` | Built-in CSS | Fluid typography | `font-size: clamp(2rem, 5vw, 4rem)` |
| `gsap.matchMedia()` | Yes (GSAP 3.14) | Responsive animations | Different timelines per breakpoint |

**Tailwind v4 default breakpoints** (use these, do not customize):
- `sm`: 640px -- Large phones landscape
- `md`: 768px -- Tablets
- `lg`: 1024px -- Small laptops
- `xl`: 1280px -- Desktops

**Why no container query plugin:** Tailwind v4 moved container queries into core. The old `@tailwindcss/container-queries` plugin is unnecessary. Use `@container` on parent, `@md:` etc. on children.

**Responsive animation pattern with gsap.matchMedia():**

```typescript
const mm = gsap.matchMedia();

mm.add(
  {
    isDesktop: "(min-width: 1024px)",
    isMobile: "(max-width: 1023px)",
  },
  (context) => {
    const { isDesktop } = context.conditions!;

    // Desktop: full stagger and scale animations
    // Mobile: simpler fade-in, shorter distances
    gsap.fromTo(".e6-about-panel",
      { scale: isDesktop ? 0.95 : 1, opacity: 0, y: isDesktop ? 50 : 20 },
      {
        scrollTrigger: { trigger: ".e6-about-section", start: "top 85%" },
        scale: 1, opacity: 1, y: 0,
        duration: isDesktop ? 0.8 : 0.5,
        stagger: isDesktop ? 0.12 : 0.08,
        ease: "power3.out",
      }
    );
  }
);
```

Key behavior: `gsap.matchMedia()` automatically reverts all animations created inside when the media query stops matching and re-runs setup for the new match. This handles resize and orientation changes correctly.

**Confidence:** HIGH -- verified via Tailwind v4 official docs and GSAP matchMedia docs.

---

## Accessibility (WCAG AA)

| Tool | Already Have | Purpose | How |
|------|-------------|---------|-----|
| eslint-plugin-jsx-a11y | Yes (via eslint-config-next) | Lint-time a11y checks | Already active with `core-web-vitals` config |
| Semantic HTML | Built-in | Screen reader structure | `<main>`, `<nav>`, `<section>` with proper `aria-label` |
| `:focus-visible` | Built-in CSS | Keyboard focus rings | Tailwind's `focus-visible:` variant |
| `aria-*` attributes | Built-in HTML | Screen reader hints | `aria-label`, `aria-expanded`, `role` |

**Confirmed already installed:** `eslint-plugin-jsx-a11y` v6.10 ships as a dependency of `eslint-config-next` and is active through the `core-web-vitals` config. Verified in `node_modules/eslint-config-next/package.json`.

**What's already working:**
- `lang="en"` on `<html>` element
- External links have `rel="noopener noreferrer"`
- `role="img"` and `aria-label` on emoji badge in hero

**What needs adding (no new packages):**
1. `<main>` landmark wrapping page content in layout or component
2. `<nav aria-label="Section navigation">` on FloatingNav
3. `aria-label` on icon-only contact links (currently emoji-only, no text alternative for screen readers)
4. `aria-expanded={expandedProject === index}` on project card toggle buttons
5. `role="button"` + `tabIndex={0}` + `onKeyDown` handler on clickable project cards (currently `<div onClick>` -- not keyboard accessible)
6. Focus-visible ring styles: `focus-visible:ring-2 focus-visible:ring-[var(--accent-purple)] focus-visible:outline-none`
7. Skip-to-content link: visually hidden `<a href="#about">` that becomes visible on focus
8. Color contrast audit -- current `--text-secondary: #8a7d96` on light bg `#e8ddd5` may fall below 4.5:1 WCAG AA ratio for normal text. Verify and darken if needed.

**Do NOT add:**
- `@axe-core/react` -- dev-only auditing tool that adds bundle weight. Lighthouse a11y audit covers the same ground at zero cost.
- `react-aria` or `@radix-ui/*` -- overkill for a portfolio with no complex widgets (no modals, dropdowns, comboboxes, or date pickers).

**Confidence:** HIGH -- eslint-plugin-jsx-a11y confirmed installed via node_modules inspection. Accessibility requirements are standard HTML/ARIA patterns.

---

## prefers-reduced-motion

| Tool | Already Have | Purpose | How |
|------|-------------|---------|-----|
| `gsap.matchMedia()` | Yes (GSAP 3.14) | Disable/simplify GSAP animations | Conditional animation setup |
| CSS `@media` query | Built-in | Disable CSS transitions/animations | Global reduced-motion styles |
| Tailwind `motion-reduce:` | Yes (v4) | Per-utility motion control | `motion-reduce:transition-none` |

**Implementation pattern -- gsap.matchMedia() with reduced-motion:**

```typescript
const mm = gsap.matchMedia();

mm.add(
  {
    isDesktop: "(min-width: 1024px)",
    isMobile: "(max-width: 1023px)",
    reduceMotion: "(prefers-reduced-motion: reduce)",
  },
  (context) => {
    const { reduceMotion, isDesktop } = context.conditions!;

    if (reduceMotion) {
      // Set all elements to their final visible state immediately
      gsap.set(".e6-hero-emoji", { scale: 1, rotation: 0 });
      gsap.set(".e6-hero-glass", { scale: 1, opacity: 1, y: 0 });
      gsap.set(".e6-hero-greeting", { y: 0, opacity: 1 });
      gsap.set(".e6-hero-name", { opacity: 1 });
      gsap.set(".e6-hero-tagline", { y: 0, opacity: 1 });
      gsap.set(".e6-hero-cta", { scale: 1, rotation: 0, opacity: 1 });
      // ... all other animated elements
      return; // Skip all animation/ScrollTrigger setup
    }

    // Full animations for users who haven't opted out
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 });
    // ... existing animation code
  }
);
```

**Key behavior:** `gsap.matchMedia()` automatically reverts all animations created inside when the media query stops matching. If a user toggles reduced-motion in OS settings mid-session, animations clean up and recreate correctly.

**CSS layer -- add to globals.css:**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Lenis smooth scroll -- must also respect reduced-motion:**

In the SmoothScrollProvider, check the preference before initializing:

```typescript
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion) {
  // Don't initialize Lenis at all -- use native scroll
  return;
}

const lenis = new Lenis({ lerp: 0.1 });
```

**Custom cursor:** Should also be disabled for reduced-motion users since the magnetic pull and follower animations are distracting. Hide `CustomCursor` component when reduced-motion is active.

**Gradient background animation:** The `gsap.to(root, { "--bg-gradient-start": ... })` infinite yoyo tween should be killed when reduced-motion is active. Set static gradient values instead.

**Confidence:** HIGH -- verified via GSAP official docs and community examples on CodePen.

---

## Open Graph / Social Meta Tags

| Tool | Already Have | Purpose | How |
|------|-------------|---------|-----|
| Next.js Metadata API | Yes (Next.js 16) | OG tags in `<head>` | Export `metadata` object from `layout.tsx` |
| Static OG image file | File convention | Social preview image | Place `opengraph-image.png` in `src/app/` |

**Current state:** `layout.tsx` already exports a basic `metadata` object with `title` and `description`. Needs expansion for OG tags.

**Implementation -- expand existing metadata in layout.tsx:**

```typescript
export const metadata: Metadata = {
  title: "Khai Phan - Software Engineer",
  description: "I build software. Sometimes it's good.",
  metadataBase: new URL("https://khaiphan.dev"),
  openGraph: {
    title: "Khai Phan - Software Engineer",
    description: "I build software. Sometimes it's good.",
    url: "https://khaiphan.dev",
    siteName: "Khai Phan",
    locale: "en_US",
    type: "website",
    // Image auto-detected from opengraph-image.png in src/app/
  },
  twitter: {
    card: "summary_large_image",
    title: "Khai Phan - Software Engineer",
    description: "I build software. Sometimes it's good.",
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

**OG image approach:** Place a static `opengraph-image.png` (1200x630px) in `src/app/`. Next.js file-based metadata convention auto-detects it and generates the correct `<meta>` tags. Supported formats: `.png`, `.jpg`, `.gif`.

**Do NOT use** the `ImageResponse` dynamic generation API -- it requires server runtime, which is incompatible with `output: "export"`.

**Confidence:** HIGH -- Next.js metadata API is well-documented and confirmed working with static export when no dynamic behavior is introduced.

---

## Performance (Lighthouse Mobile 90+)

| Tool | Already Have | Purpose | How |
|------|-------------|---------|-----|
| Next.js static export | Yes | Pre-rendered HTML, zero server | `output: "export"` in next.config.ts |
| Tailwind v4 / LightningCSS | Yes | Minimal CSS, tree-shaking | Automatic via build pipeline |
| `next/font` | Yes | Zero-CLS font loading | Already using Inter + Space Grotesk with `display: swap` |
| React Compiler | Yes (Next.js 16) | Auto-memoization | Enabled by default in Next.js 16 |

**Key optimizations (zero new packages):**

### 1. Font loading (already optimized)
`next/font/google` with Inter and Space Grotesk handles subsetting, preloading, and `font-display: swap` automatically. No action needed.

### 2. Image optimization (manual, no build plugin)
The site uses `images: { unoptimized: true }` because of static export. The site has very few raster images:
- Favicon (`favicon.ico`) -- tiny, not a concern
- OG image (`opengraph-image.png`) -- not loaded by the page, only by social crawlers
- Cursor PNGs -- tiny (<5KB)

**Action:** Compress these files manually before committing (squoosh.app or ImageOptim). No build plugin needed.

### 3. GSAP bundle size
GSAP core + ScrollTrigger + SplitText is ~45KB gzipped. This is the largest dependency and cannot be tree-shaken since all three are used. Acceptable for a portfolio. Ensure the centralized `@/lib/gsap` barrel export is the only import path (already the case).

### 4. Eliminate render-blocking resources
- Inline `<script>` for theme detection: correct (prevents FOUC)
- Inline `<style>` for cursor: correct (prevents flash of default cursor)
- Fonts via `next/font`: already optimized with preload

### 5. Reduce CLS (Cumulative Layout Shift)
- SplitText wraps text in `<div>` elements which can cause layout shift. Set initial `opacity: 0` on split targets via CSS (not just GSAP) so there's no flash before GSAP initializes.
- Ensure all sections have stable dimensions on load.
- The SVG noise filter and fixed overlay should not cause CLS (they use `position: fixed`).

### 6. Reduce TBT (Total Blocking Time)
- GSAP initialization on mobile is the main TBT risk. Mitigate by deferring non-critical animation setup with `requestIdleCallback` or `setTimeout(..., 0)`.
- The `useGSAP` hook runs after paint. Current `requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()))` pattern is correct.

### 7. Code splitting after Exploration6 extraction
After extracting Exploration6 into separate section components, use `next/dynamic` with `ssr: false` for below-fold sections if TBT is still high. However, for a single-page site with ~3K LOC, this is likely unnecessary.

**Do NOT add:**
- `next-image-export-optimizer` -- the site has ~3 raster images total. A build plugin is overkill.
- `@next/bundle-analyzer` -- useful for debugging but not a production dependency. Run `ANALYZE=true next build` one-off if needed.
- `web-vitals` package -- Next.js dev mode reports Web Vitals. Lighthouse CLI provides the same metrics.

**Lighthouse 90+ risk assessment:**
- **Performance:** MEDIUM risk. GSAP bundle + two Google Fonts will impact TBT and LCP on slow mobile. Static export helps significantly. Target is achievable but may need measurement-driven tuning.
- **Accessibility:** LOW risk after implementing the semantic HTML and ARIA changes listed above.
- **Best Practices:** LOW risk. Static site with no mixed content or deprecated APIs.
- **SEO:** LOW risk after adding OG tags and ensuring meta descriptions are present.

**Confidence:** MEDIUM -- Lighthouse 90+ is achievable for a static site with this stack, but GSAP bundle (~45KB gzipped) and two Google Fonts will need measurement. The main risk is TBT from GSAP initialization on mobile.

---

## Alternatives Considered

| Category | Recommendation | Alternative | Why Not |
|----------|---------------|-------------|---------|
| Responsive animations | `gsap.matchMedia()` | CSS-only `@media` | GSAP animations need JS cleanup on breakpoint change; CSS cannot manage ScrollTrigger |
| Accessibility linting | eslint-plugin-jsx-a11y (already installed) | @axe-core/react | Adds dev dependency + runtime overhead; Lighthouse a11y audit covers same ground |
| OG image | Static file `opengraph-image.png` | `ImageResponse` dynamic generation | Requires server runtime, incompatible with `output: "export"` |
| Reduced motion | `gsap.matchMedia()` + CSS fallback | Framer Motion `useReducedMotion` | Project explicitly chose GSAP-only (no Framer Motion) |
| Image optimization | Manual pre-commit compression | next-image-export-optimizer | Site has ~3 images total; a build plugin is overkill |
| Performance monitoring | Lighthouse CLI / Chrome DevTools | web-vitals package | No need for runtime reporting on a static portfolio |
| Container queries | Tailwind v4 built-in `@container` | @tailwindcss/container-queries plugin | Plugin is for Tailwind v3; v4 has container queries in core |

## What NOT to Install

| Package | Why Not |
|---------|---------|
| `@axe-core/react` | Dev-only auditing tool; Lighthouse a11y audit is sufficient and free |
| `next-image-export-optimizer` | Only ~3 images in the entire site; manual optimization is simpler |
| `@radix-ui/*` or `react-aria` | No complex widgets (modals, comboboxes); semantic HTML + aria attributes suffice |
| `framer-motion` / `motion` | Project decision: GSAP is the single animation engine |
| `web-vitals` | Next.js dev mode reports these; Lighthouse covers auditing |
| `@tailwindcss/container-queries` | Built into Tailwind v4 core |
| `postcss-preset-env` | LightningCSS (via Tailwind v4) already handles modern CSS transforms |
| `clsx` / `tailwind-merge` | Previously recommended for v4.2 but never installed; not needed for v4.3 scope |

## Installation

```bash
# No new packages to install.
# All v4.3 requirements are met by the existing stack + built-in APIs.
```

## Summary

The v4.3 milestone is a **zero-dependency-addition milestone**. Every requirement maps to existing tools:

| Requirement | Solved By | Confidence |
|-------------|-----------|------------|
| Responsive design | Tailwind v4 breakpoints + `gsap.matchMedia()` | HIGH |
| Accessibility (WCAG AA) | Semantic HTML + aria attributes + eslint-plugin-jsx-a11y (already installed) | HIGH |
| prefers-reduced-motion | `gsap.matchMedia()` + CSS `@media` + Lenis conditional init + cursor disable | HIGH |
| OG meta tags | Next.js Metadata API (already using) + static `opengraph-image.png` | HIGH |
| Lighthouse 90+ | Static export + font optimization (done) + CLS prevention + manual image compression | MEDIUM |

## Sources

- [Next.js Metadata and OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) -- HIGH confidence
- [Next.js generateMetadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) -- HIGH confidence
- [Next.js File-Based Metadata Conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata) -- HIGH confidence
- [GSAP gsap.matchMedia() Docs](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) -- HIGH confidence
- [GSAP matchMedia reduced-motion CodePen](https://codepen.io/GreenSock/pen/RwMQwpR) -- HIGH confidence
- [GSAP matchMedia reduced-motion CodePen (alternate)](https://codepen.io/GreenSock/pen/qBoRdqp) -- HIGH confidence
- [Tailwind CSS v4 Responsive Design](https://tailwindcss.com/docs/responsive-design) -- HIGH confidence
- [Tailwind CSS v4.0 Release Blog](https://tailwindcss.com/blog/tailwindcss-v4) -- HIGH confidence
- [Tailwind CSS v4 Container Queries](https://www.sitepoint.com/tailwind-css-v4-container-queries-modern-layouts/) -- MEDIUM confidence
- [Next.js Accessibility Architecture](https://nextjs.org/docs/architecture/accessibility) -- HIGH confidence
- [eslint-plugin-jsx-a11y GitHub](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) -- HIGH confidence
- [Next.js Performance Tuning for Lighthouse](https://www.qed42.com/insights/next-js-performance-tuning-practical-fixes-for-better-lighthouse-scores) -- MEDIUM confidence
- [Lighthouse Performance Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring) -- HIGH confidence
- [Achieving 95+ Lighthouse in Next.js](https://medium.com/@sureshdotariya/achieving-95-lighthouse-scores-in-next-js-15-modern-web-application-part1-e2183ba25fc1) -- MEDIUM confidence
