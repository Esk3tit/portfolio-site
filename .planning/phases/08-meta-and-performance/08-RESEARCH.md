# Phase 8: Meta and Performance - Research

**Researched:** 2026-03-08
**Domain:** Next.js metadata API, Open Graph/Twitter Cards, Lighthouse performance optimization
**Confidence:** HIGH

## Summary

Phase 8 covers two distinct workstreams: (1) adding Open Graph and Twitter Card meta tags with a static OG image for rich social previews, and (2) optimizing Lighthouse mobile scores to 90+ across all categories. The metadata work is straightforward -- Next.js App Router provides a typed `Metadata` export that handles OG and Twitter tags declaratively. The performance work requires targeted interventions: GSAP code-splitting via dynamic imports, reducing backdrop-filter blur on mobile, and ensuring fonts are properly preloaded (which next/font already handles).

The current site uses `output: "export"` (static export to Vercel), meaning no server-side OG image generation is possible -- the OG image must be a pre-built static file in `public/`. The existing `metadata` export in `layout.tsx` already has title and description; it needs `metadataBase`, `openGraph`, and `twitter` fields added. GSAP is imported synchronously via a centralized `src/lib/gsap.ts` barrel file used by 13 components -- code-splitting requires converting this to a lazy-loaded pattern.

**Primary recommendation:** Extend the existing metadata export with OG/Twitter fields using `metadataBase: new URL("https://khaiphan.dev")`, create a static 1200x630 OG image in `public/`, then tackle performance with GSAP dynamic imports and mobile backdrop-filter reduction.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- OG image: Static PNG/JPG committed to public/, 1200x630, warm mid-tone gradient background matching site, banana cursor detail included
- OG title: "Khai Phan"
- OG description: "I build software. Sometimes it's good."
- og:url and canonical: https://khaiphan.dev
- Twitter card type: summary_large_image
- GSAP: Code-split via dynamic import so it doesn't block initial paint
- Glass panels: Reduce backdrop-filter blur radius on mobile, keep full effect on desktop
- Fonts: Preload both Inter (body) and Space Grotesk (display) fonts

### Claude's Discretion
- Exact OG image visual design and composition
- Whether to convert cursor/OG images to WebP or keep PNG
- Specific GSAP code-splitting strategy (dynamic import pattern)
- Exact mobile blur radius value for glass panels
- Any additional Lighthouse optimizations needed to hit 90+

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| META-01 | Open Graph meta tags (title, description, image, url) for proper link previews | Next.js Metadata API `openGraph` field in layout.tsx; metadataBase resolves relative image paths |
| META-02 | Twitter card meta tags | Next.js Metadata API `twitter` field with `card: "summary_large_image"` |
| META-03 | OG image (1200x630) created and committed | Static PNG in `public/og-image.png`; referenced by metadata openGraph.images |
| PERF-01 | Lighthouse mobile score >= 90 | GSAP dynamic import, mobile backdrop-filter reduction, font preloading (already handled by next/font) |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | Metadata API for OG/Twitter tags | Built-in typed metadata export, auto-generates `<meta>` tags |
| next/font/google | (bundled) | Font optimization + preloading | Auto self-hosts, preloads, prevents CLS via size-adjust |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| gsap | 3.14.2 | Animation (code-split target) | Dynamic import to defer from critical path |
| @gsap/react | 2.1.2 | React integration | useGSAP hook, loaded with GSAP |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Static OG image | next/og (ImageResponse) | Not available with `output: "export"` -- static file is the only option |
| Manual `<meta>` tags | Next.js Metadata API | API is type-safe, handles deduplication, no reason to go manual |

**Installation:** No new packages needed. Everything is already in the project.

## Architecture Patterns

### Metadata Configuration Pattern

The metadata lives in `layout.tsx` as a static export. Key pattern:

```typescript
// Source: Next.js official docs - generateMetadata API reference
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://khaiphan.dev"),
  title: "Khai Phan",
  description: "I build software. Sometimes it's good.",
  openGraph: {
    title: "Khai Phan",
    description: "I build software. Sometimes it's good.",
    url: "https://khaiphan.dev",
    siteName: "Khai Phan",
    images: [
      {
        url: "/og-image.png",  // resolved against metadataBase
        width: 1200,
        height: 630,
        alt: "Khai Phan - Software Engineer",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Khai Phan",
    description: "I build software. Sometimes it's good.",
    images: ["/og-image.png"],  // resolved against metadataBase
  },
  other: {
    "apple-mobile-web-app-title": "Khai Phan",
  },
};
```

**Critical:** `metadataBase` must be set so relative image paths (like `/og-image.png`) resolve to absolute URLs. Without it, social platforms cannot fetch the image. Next.js will warn: "metadata.metadataBase is not set for resolving social open graph or twitter images."

### GSAP Dynamic Import Pattern

Current state: `src/lib/gsap.ts` is a synchronous barrel that imports gsap, ScrollTrigger, SplitText, and useGSAP. All 13 consumer files import from this barrel. Since the entire page is `"use client"`, GSAP is bundled into the main chunk.

**Recommended approach -- lazy initialization with preserved API:**

```typescript
// src/lib/gsap.ts -- convert to async initialization
"use client";

import { useGSAP } from "@gsap/react";

let gsapInstance: typeof import("gsap").gsap;
let ScrollTriggerPlugin: typeof import("gsap/ScrollTrigger").ScrollTrigger;
let SplitTextPlugin: typeof import("gsap/SplitText").SplitText;
let initialized = false;

export async function initGSAP() {
  if (initialized) return;
  const [gsapModule, stModule, splitModule] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("gsap/SplitText"),
  ]);
  gsapInstance = gsapModule.gsap;
  ScrollTriggerPlugin = stModule.ScrollTrigger;
  SplitTextPlugin = splitModule.SplitText;
  gsapInstance.registerPlugin(ScrollTriggerPlugin, useGSAP, SplitTextPlugin);
  initialized = true;
}

export { useGSAP };
export { gsapInstance as gsap, ScrollTriggerPlugin as ScrollTrigger, SplitTextPlugin as SplitText };
```

**Alternative simpler approach -- next/dynamic at component level:**

Since `page.tsx` is already `"use client"` and all sections are direct children, an alternative is to keep the synchronous gsap.ts but use `next/dynamic` to lazy-load the entire page component from a thin server-component wrapper. This defers ALL client JS (including GSAP) from the initial HTML payload.

**Recommendation:** The simpler approach is to use `next/dynamic` with `{ ssr: false }` on the page-level client component, since the entire page is one client boundary anyway. This keeps the gsap.ts barrel unchanged and defers the whole bundle. However, this may cause a flash of empty content. The safer approach is the async init pattern above, called inside each component's useGSAP/useEffect.

The planner should decide which approach best balances complexity vs. impact based on build analysis.

### Mobile Backdrop-Filter Reduction

Current: `GlassPanel.tsx` applies `blur(40px)` inline. 40px is very high for mobile GPUs.

**Pattern:** Use a CSS custom property with media query override:

```css
/* globals.css */
:root {
  --glass-blur: 40px;
  --glass-saturate: 1.6;
}

@media (max-width: 639px) {
  :root {
    --glass-blur: 12px;
    --glass-saturate: 1.3;
  }
}
```

```typescript
// GlassPanel.tsx -- replace hardcoded values
backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
```

**Recommended mobile blur:** 12px. This is under the 20px threshold where GPU cost grows significantly, while still producing a visible frosted-glass effect. The panel already has a gradient fill background, so reduced blur is barely noticeable.

### Font Preloading

**Already handled.** The project uses `next/font/google` for both Inter and Space Grotesk in `layout.tsx`. Next.js automatically:
- Downloads font files at build time and self-hosts them
- Injects `<link rel="preload">` tags in the `<head>`
- Uses `font-display: swap` by default
- Calculates `size-adjust` to prevent layout shift

No additional work is needed for font preloading. This is a "verify it's working" item, not a "build it" item.

### Anti-Patterns to Avoid
- **Manual `<link rel="preload">` for fonts:** next/font already handles this; adding manual preloads causes double-loading
- **Generating OG images at runtime:** Not possible with `output: "export"` -- must be static
- **Removing backdrop-filter entirely on mobile:** User wants glass effect preserved, just lighter
- **Lazy-loading above-the-fold content:** Hero section must render immediately; only defer animation library, not content

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Meta tag generation | Manual `<meta>` tags in `<head>` | Next.js Metadata API export | Type-safe, handles deduplication, correct ordering |
| Font preloading | Manual `<link rel="preload">` | next/font/google (already in use) | Auto size-adjust, self-hosting, CLS prevention |
| OG image validation | Manual checking | Online validators (opengraph.xyz, cards-dev.twitter.com) | Simulates actual social platform rendering |

## Common Pitfalls

### Pitfall 1: Missing metadataBase
**What goes wrong:** OG image URL is relative (`/og-image.png`), social platforms cannot fetch it
**Why it happens:** Developers forget that crawlers need absolute URLs
**How to avoid:** Set `metadataBase: new URL("https://khaiphan.dev")` in root layout metadata
**Warning signs:** Next.js build warning about metadataBase; image preview blank on social platforms

### Pitfall 2: OG Image Too Large
**What goes wrong:** Social platforms timeout fetching a multi-MB image, show no preview
**Why it happens:** Using uncompressed PNG at 1200x630
**How to avoid:** Keep OG image under 300KB. Use JPEG at 85% quality or optimized PNG. Current `habbycursor-full.png` is 550KB -- do NOT use it directly
**Warning signs:** Slow loading in OG validators

### Pitfall 3: GSAP Dynamic Import Breaking Animations
**What goes wrong:** Components try to use gsap before it's loaded, causing errors or no animations
**Why it happens:** Race condition between component mount and async import resolution
**How to avoid:** Initialize GSAP inside useEffect/useGSAP callbacks; guard animation code with initialization check
**Warning signs:** "gsap is not defined" errors, animations not playing on first load

### Pitfall 4: Backdrop-Filter CSS Variable in Inline Styles
**What goes wrong:** CSS custom properties in inline `style` attributes work differently than in stylesheets
**Why it happens:** `var()` in inline styles is valid CSS but some build tools/optimizers may not handle it correctly
**How to avoid:** Test in actual build output, not just dev mode. Alternatively, apply backdrop-filter via a CSS class rather than inline style
**Warning signs:** Blur not changing between mobile/desktop in production build

### Pitfall 5: Lighthouse Score Varies by Environment
**What goes wrong:** Getting 90+ locally but lower scores in CI or on actual Vercel deployment
**Why it happens:** Lighthouse scores depend on network conditions, server response time, CDN caching
**How to avoid:** Run Lighthouse on the deployed Vercel URL (not localhost). Use multiple runs and take the median
**Warning signs:** Scores fluctuating by 10+ points between runs

## Code Examples

### Complete Metadata Export
```typescript
// src/app/layout.tsx -- extend existing metadata
// Source: Next.js docs - generateMetadata API reference
export const metadata: Metadata = {
  metadataBase: new URL("https://khaiphan.dev"),
  title: "Khai Phan",
  description: "I build software. Sometimes it's good.",
  openGraph: {
    title: "Khai Phan",
    description: "I build software. Sometimes it's good.",
    url: "https://khaiphan.dev",
    siteName: "Khai Phan",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Khai Phan - Software Engineer",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Khai Phan",
    description: "I build software. Sometimes it's good.",
    images: ["/og-image.png"],
  },
  other: {
    "apple-mobile-web-app-title": "Khai Phan",
  },
};
```

### GlassPanel Mobile Optimization
```css
/* src/app/globals.css */
:root {
  --glass-blur: 40px;
  --glass-saturate: 1.6;
}

@media (max-width: 639px) {
  :root {
    --glass-blur: 12px;
    --glass-saturate: 1.3;
  }
}
```

```typescript
// src/components/ui/GlassPanel.tsx -- update inline style
backdropFilter: `blur(var(--glass-blur)) saturate(var(--glass-saturate))`,
WebkitBackdropFilter: `blur(var(--glass-blur)) saturate(var(--glass-saturate))`,
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual `<meta>` in `<Head>` | Next.js Metadata API export | Next.js 13.2+ (2023) | Type-safe, deduplicated, automatic |
| `next/head` component | File-based + config-based metadata | Next.js 13+ App Router | No client component needed for metadata |
| Manual font `<link>` tags | next/font/google with auto-preload | Next.js 13+ | Zero CLS, self-hosted, no Google requests |

## Open Questions

1. **GSAP code-splitting impact on LCP**
   - What we know: GSAP + ScrollTrigger + SplitText is a significant bundle (~220KB chunk visible in build output)
   - What's unclear: Whether deferring it actually improves Lighthouse Performance score enough, since LCP measures largest content paint (text/image), not JS execution
   - Recommendation: Implement dynamic import, measure before/after with Lighthouse. If marginal, the reduced TBT (Total Blocking Time) still helps the overall score

2. **OG image creation method**
   - What we know: Must be static PNG/JPG, 1200x630, with gradient + banana cursor
   - What's unclear: Whether to create programmatically (Canvas/SVG script) or manually design
   - Recommendation: Create with a simple HTML-to-image script or manual design tool. The image is committed once and rarely changes

3. **Additional Lighthouse optimizations**
   - What we know: GSAP dynamic import + backdrop-filter reduction are the two main interventions
   - What's unclear: Whether these alone hit 90+ or if additional work is needed (e.g., image compression, render-blocking resources)
   - Recommendation: Build and measure first; iterate if needed. The `habbycursor-full.png` (550KB) in public/ is a concern if it's being loaded

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None -- no test framework installed |
| Config file | none -- see Wave 0 |
| Quick run command | `npx next build` (build succeeds = no regressions) |
| Full suite command | `npx next build && npx next export` (static export works) |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| META-01 | OG meta tags in HTML output | smoke | `grep -c "og:title" out/index.html` | N/A -- check build output |
| META-02 | Twitter card meta tags in HTML output | smoke | `grep -c "twitter:card" out/index.html` | N/A -- check build output |
| META-03 | OG image file exists at correct path | smoke | `test -f public/og-image.png && echo "exists"` | N/A -- file check |
| PERF-01 | Lighthouse mobile >= 90 | manual-only | Run Lighthouse on deployed URL | N/A -- requires browser |

### Sampling Rate
- **Per task commit:** `npx next build` (build succeeds, no TypeScript errors)
- **Per wave merge:** Build + verify meta tags in static output HTML
- **Phase gate:** Lighthouse audit on deployed Vercel URL

### Wave 0 Gaps
- [ ] No test framework installed -- for this phase, build verification and manual Lighthouse audits are sufficient
- [ ] Post-build HTML inspection script could be added but is not strictly necessary for 4 requirements

*(Given this is the final phase focused on meta tags and perf, build verification + manual Lighthouse is the appropriate validation strategy rather than installing a test framework.)*

## Sources

### Primary (HIGH confidence)
- [Next.js generateMetadata API reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) - metadata export shape, metadataBase, openGraph, twitter fields
- [Next.js Metadata Files: opengraph-image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) - static image file conventions
- [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) - next/font auto-preload, self-hosting, size-adjust

### Secondary (MEDIUM confidence)
- [GSAP Dynamic Import forum thread](https://gsap.com/community/forums/topic/40051-dynamic-import/) - community patterns for lazy GSAP loading
- [CSS backdrop-filter performance (Mozilla bug)](https://bugzilla.mozilla.org/show_bug.cgi?id=1718471) - blur radius impact on GPU performance
- [shadcn/ui backdrop-filter issue #327](https://github.com/shadcn-ui/ui/issues/327) - real-world backdrop-filter performance reports

### Tertiary (LOW confidence)
- Build chunk analysis (220KB largest chunk) -- needs Lighthouse profiling to confirm GSAP is the bottleneck

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Next.js Metadata API is well-documented, typed, and the project already uses it
- Architecture: HIGH - Patterns are straightforward extensions of existing code
- Pitfalls: MEDIUM - Lighthouse 90+ mobile is the uncertain part; GSAP bundle + backdrop-filter may need iterative tuning (flagged in STATE.md blockers)

**Research date:** 2026-03-08
**Valid until:** 2026-04-08 (stable domain, no fast-moving dependencies)
