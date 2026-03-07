# Feature Landscape

**Domain:** Responsive design, accessibility, performance, and cleanup for animation-heavy portfolio site
**Researched:** 2026-03-07
**Scope:** v4.3 milestone only -- responsive, a11y, perf, OG tags, reduced-motion, code cleanup

## Table Stakes

Features users (and search engines, screen readers, hiring managers on phones) expect. Missing = site feels broken or unprofessional.

| Feature | Why Expected | Complexity | Dependencies | Notes |
|---------|--------------|------------|--------------|-------|
| Mobile-responsive layout | 60%+ of portfolio traffic is mobile; recruiters browse on phones | Medium | Existing Tailwind grid classes (`md:grid-cols-2`) already in Exploration6 | Grids collapse to single column, hero text scales down, spacing reduces. Tailwind mobile-first approach means unprefixed = mobile, `md:` = tablet, `lg:` = desktop |
| Touch-friendly tap targets | WCAG 2.5.5 + basic usability -- 44x44px minimum | Low | NeoBrutalButton, NeoBrutalTag, contact links, FloatingNav dots | Current FloatingNav dots are 8-12px -- far too small for touch. Already hidden on mobile (`hidden md:flex`) so not blocking, but dark mode toggle needs mobile placement |
| Keyboard navigation | Screen reader users, power users, motor-impaired users all use Tab | Medium | All interactive elements (buttons, links, project cards, dark mode toggle) | Project expand/collapse uses `onClick` on a `div` -- needs `button` element or `role="button"` + `onKeyDown` + `tabIndex` |
| Visible focus indicators | WCAG 2.4.7 (AA) + 2.4.11 (AA, WCAG 2.2) -- users must see where focus is | Low | All focusable elements (buttons, links, toggle) | Currently no custom focus styles; browser defaults may be invisible against glass panel backgrounds. Focus indicators must have 3:1 contrast ratio per WCAG 2.4.11 |
| Color contrast (WCAG AA) | 4.5:1 for body text, 3:1 for large text and UI components | Low | CSS custom properties for both light/dark themes | Verify: `--text-secondary: #8a7d96` on warm/cool gradient backgrounds in both themes. `--text-body` and accent colors need checking too |
| Semantic HTML structure | Screen readers need landmarks, heading hierarchy, lists | Medium | Exploration6 uses sections with `id` but wrapping `div` has no landmark role | Needs `<main>`, proper `<h1>`-`<h2>` hierarchy (currently h1 in hero, h2 in sections -- good), `<nav>` already on FloatingNav |
| `prefers-reduced-motion` support | Users with vestibular disorders, motion sensitivity; OS-level setting | Medium | GSAP scroll-triggered animations, Lenis smooth scroll, gradient animation, GlassPanel tilt, SplitText reveals, hero entrance timeline | Entire animation system needs `gsap.matchMedia()` wrapper with `reduceMotion` condition |
| OG meta tags | Links shared on Slack/LinkedIn/Twitter need title, description, image preview | Low | Next.js Metadata API in `layout.tsx`, static OG image asset | Currently only has basic `title` and `description` -- no `openGraph`, no `twitter`, no OG image |
| Favicon replacement | Browser tab identity; current is Vercel default | Low | Already have `src/app/favicon.ico` (untracked) | Swap in, remove Vercel defaults |
| Lighthouse mobile >= 90 | Professional credibility; proves performance skill to recruiters | High | All other optimizations feed into this score | Risks: backdrop-filter blur(40px) on many GlassPanels, GSAP+Lenis bundle size, Google Fonts network requests (mitigated by next/font) |

## Differentiators

Features that elevate the site beyond "checkbox accessible." Not expected, but signal craft and attention to detail.

| Feature | Value Proposition | Complexity | Dependencies | Notes |
|---------|-------------------|------------|--------------|-------|
| Graceful reduced-motion fallback | Animations become instant opacity fades instead of disappearing; site still feels designed even with motion off | Medium | `gsap.matchMedia()` with `reduceMotion` condition | Use `duration: 0` for instant `gsap.set()` instead of removing animations entirely. Content still reveals, just without movement. This is the GSAP-recommended pattern |
| Skip-to-content link | Screen reader and keyboard users jump past nav; signals a11y awareness to technical reviewers | Low | `<main>` element with `id` | Hidden visually via `sr-only`, visible on `:focus`, links to `#main-content` |
| Designed OG image | Branded preview when shared on social; stands out in Slack channels vs generic text-only cards | Low | Static image file in `/public/` | 1200x630px, match Liquid Glass + Neobrutalism aesthetic. Use static file -- `opengraph-image.png` file convention or explicit path in metadata |
| `aria-expanded` on project cards | Project expand/collapse announces state changes to screen readers | Low | Project card toggle already works with GSAP | Add `aria-expanded={expandedProject === index}` on trigger, `aria-controls` pointing to detail panel |
| Dark mode toggle on mobile | Currently hidden with FloatingNav on mobile -- users have no way to toggle theme | Low | DarkModeToggle component exists | Add fixed-position toggle visible on mobile, or a header bar. Don't duplicate the toggle -- move or make responsive |
| Font `display: swap` verification | Prevents FOIT (flash of invisible text) | Low | `next/font` already configured | `next/font` outputs `font-display: swap` by default -- just verify it works in production build |
| Both-theme contrast verification | Light mode may pass WCAG AA but dark mode fails (or vice versa) | Low | CSS custom properties in globals.css | Dark mode `--text-body: #c4b8d0` on `#1a1520` background and `--text-secondary: #9a8daa` both need contrast ratio checks |

## Anti-Features

Features to explicitly NOT build in v4.3. Tempting but harmful or out of scope.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Hamburger menu for mobile | Site is single-page with 6 sections and natural scroll; hamburger adds complexity for zero value | FloatingNav already hidden on mobile (`hidden md:flex`); users scroll naturally. If needed later, a simple fixed bottom bar |
| Custom animated focus rings | GSAP-animated focus rings add complexity and can interfere with a11y tooling | Use CSS `outline` with `outline-offset` -- simple, reliable, always visible. Style with theme colors via custom properties |
| Automated OG image generation | `ImageResponse` / `@vercel/og` adds server-side rendering complexity; static export may not support it | Commit a static 1200x630 PNG to `/public/og-image.png`. Design it once, done |
| Service worker / PWA | Overkill for a portfolio; adds caching bugs and update complexity | Static export on Vercel CDN is already fast. No offline use case exists |
| Lazy-loading sections with Suspense | Single-page scroll loads all content upfront; code-splitting 6 small sections adds complexity for negligible gain | Optimize asset sizes and remove dead code instead. `next/font` already handles font loading |
| `will-change` on all glass panels | Promotes every element to GPU compositor layer; too many promoted elements actually increases memory and hurts performance | Only add `will-change` before active GSAP animations, remove after. Or let GSAP handle GPU promotion internally |
| ARIA over-engineering | Adding `role`, `aria-*` to every single element creates noise for screen readers; more ARIA is not better ARIA | Only add ARIA where native HTML semantics are insufficient: project toggle (`aria-expanded`), live regions for dynamic content |
| Loading skeleton / spinner | Static export = content is in HTML at first paint; there is no data fetching | None needed; content is already in the static HTML bundle |
| `next/image` for all assets | Static export does not support Next.js Image Optimization API without `next-image-export-optimizer` | Use standard `<img>` with manually optimized assets, or add `next-image-export-optimizer` only if image count grows |

## Feature Dependencies

```
Code Cleanup (remove explores, extract sections)
    --> Responsive layout (per-section responsive work)
    --> Semantic HTML (clean component boundaries)
    --> Lighthouse (smaller bundle)

Semantic HTML (<main>, heading hierarchy, landmark roles)
    --> Keyboard navigation (Tab order makes sense)
    --> Focus indicators (styled on correct elements)
    --> Skip-to-content link (needs <main id="main-content">)
    --> aria-expanded on project cards

prefers-reduced-motion
    --> GSAP matchMedia wrapper (all scroll-triggered animations)
    --> Lenis disable or instant mode (lerp: 1)
    --> CSS transition disabling (gradient animation, theme transitions)
    --> GlassPanel tilt effect disable
    --> CustomCursor magnetic pull disable (or keep -- it's subtle)

Responsive layout
    --> Touch target sizing (44x44px minimums)
    --> Dark mode toggle mobile placement
    --> Hero text scaling (text-5xl down to text-3xl)
    --> Grid collapse (2-col to 1-col on mobile)
    --> Experience card emoji badges (absolute positioning may break)

OG meta tags
    --> OG image asset (must exist in /public/ first)
    --> metadataBase URL (https://khaiphan.dev)
    --> Metadata API expansion in layout.tsx

Lighthouse 90+ (depends on everything)
    --> Responsive layout (mobile scoring)
    --> Accessibility fixes (a11y audit portion)
    --> Font optimization (next/font -- already done)
    --> Asset optimization (favicon, cursor PNG, OG image)
    --> backdrop-filter performance (may need mobile fallback)
    --> Dead code removal (explore pages, unused explorations)
    --> GSAP tree-shaking verification
```

## MVP Recommendation

### Phase 1: Cleanup (unblocks everything else)
1. **Remove explore pages** (`/explore/[id]`, Exploration1-5, explore index) -- reduces bundle, removes dead routes
2. **Extract Exploration6 into section components** (Hero, About, Experience, Skills, Projects, Contact) -- enables per-section responsive/a11y work
3. **Remove Vercel default assets and dead code** (orphaned CSS, unused imports) -- cleaner bundle
4. **Replace favicon** -- swap `src/app/favicon.ico`, remove Vercel SVG

### Phase 2: Responsive Design (highest user impact)
5. **Mobile-first responsive layout** -- Tailwind breakpoints: base (mobile) -> `md:` (tablet 768px) -> `lg:` (desktop 1024px)
   - Hero: scale `text-5xl sm:text-6xl md:text-7xl` (already partially done), reduce padding
   - Grids: `grid-cols-1 md:grid-cols-2` for about panels, skills, projects (partially done)
   - Experience cards: full width on mobile, adjust emoji badge positioning
   - Contact: stack vertically on mobile (already `flex-col` with `sm:flex-row`)
6. **Dark mode toggle on mobile** -- add mobile-visible toggle (fixed bottom-right or top header)
7. **Touch target audit** -- ensure all interactive elements meet 44x44px minimum

### Phase 3: Accessibility (depends on clean semantic structure from Phase 1-2)
8. **Semantic HTML** -- wrap in `<main>`, verify heading hierarchy, ensure sections are landmarks
9. **Keyboard navigation** -- convert project card `div[onClick]` to `button`, verify Tab order
10. **Visible focus indicators** -- CSS `outline` with `outline-offset`, themed with custom properties
11. **`prefers-reduced-motion`** -- `gsap.matchMedia()` wrapper: `duration: 0` for all GSAP animations, disable Lenis smoothing, pause gradient, disable tilt
12. **Color contrast** -- verify all text/background combinations in both themes against WCAG AA (4.5:1 body, 3:1 large text)
13. **Skip-to-content link** -- `sr-only focus:not-sr-only` pattern
14. **`aria-expanded` on project toggles** -- semantic expand/collapse behavior

### Phase 4: Meta + Performance (polish pass)
15. **OG meta tags** -- expand Metadata API in `layout.tsx` with `openGraph` and `twitter` objects
16. **OG image** -- design and commit 1200x630px static PNG to `/public/`
17. **Lighthouse audit** -- run mobile audit, identify specific bottlenecks
18. **Performance fixes** -- address Lighthouse findings (likely: backdrop-filter on mobile, unused JS, font loading timing)
19. **Final a11y sweep** -- automated audit (axe-core or Lighthouse a11y) + manual keyboard walkthrough

### Defer to Future
- **Automated OG image generation**: Static image is sufficient; site content rarely changes
- **Service worker / PWA**: No offline use case
- **`next-image-export-optimizer`**: Only needed if image count grows significantly

## Implementation Notes

### GSAP `matchMedia()` Pattern for Reduced Motion

The recommended GSAP pattern wraps ALL animation setup in `gsap.matchMedia()`. GSAP automatically reverts animations when conditions change (HIGH confidence -- official GSAP docs).

```typescript
const mm = gsap.matchMedia();
mm.add({
  isDesktop: "(min-width: 768px)",
  isMobile: "(max-width: 767px)",
  reduceMotion: "(prefers-reduced-motion: reduce)"
}, (context) => {
  const { isDesktop, reduceMotion } = context.conditions!;

  // Content still reveals, just instantly
  gsap.fromTo(".element",
    { opacity: 0 },
    { opacity: 1, duration: reduceMotion ? 0 : 0.8 }
  );

  // SplitText: skip char/word split entirely for reduced motion
  // (SplitText DOM manipulation is unnecessary if no stagger animation)
  if (!reduceMotion) {
    const split = new SplitText(".heading", { type: "words" });
    gsap.from(split.words, { y: 40, opacity: 0, stagger: 0.08 });
  }

  return () => { /* cleanup */ };
});
```

### Lenis + Reduced Motion

Lenis should be conditionally configured. Options:
- **Option A**: Don't render `<ReactLenis>` when reduced motion is active (check with `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before mount)
- **Option B**: Pass `options={{ lerp: 1, duration: 0 }}` to make scroll instant (no smoothing effect)

Option A is cleaner -- native scroll is perfectly fine and avoids any Lenis overhead.

### backdrop-filter Performance on Mobile

The site uses `blur(40px) saturate(1.6)` on every GlassPanel. Mobile devices handle 3-5 simultaneous blur effects acceptably, but scrolling through sections with many glass panels may cause frame drops. During Lighthouse testing, if TBT (Total Blocking Time) or CLS suffers:
- Reduce blur radius to `blur(20px)` on mobile via `@media (max-width: 767px)`
- Or replace with solid semi-transparent background on low-end devices
- Monitor with Chrome DevTools Performance tab at 4x CPU throttle

### Next.js Metadata API for OG Tags

Current `layout.tsx` has minimal metadata. Required expansion (HIGH confidence -- Next.js official docs):

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://khaiphan.dev'),
  title: "Khai Phan - Software Engineer",
  description: "I build software. Sometimes it's good.",
  openGraph: {
    title: "Khai Phan - Software Engineer",
    description: "I build software. Sometimes it's good.",
    url: 'https://khaiphan.dev',
    siteName: 'Khai Phan',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Khai Phan - Software Engineer",
    description: "I build software. Sometimes it's good.",
    images: ['/og-image.png'],
  },
};
```

Key: `openGraph` and `twitter` objects need their own `title`/`description` -- they do NOT inherit from top-level fields. `metadataBase` is required for absolute URL resolution of the OG image.

### Responsive Breakpoint Strategy

Tailwind v4 mobile-first with the existing classes already in use:
- **Base** (0-767px): Single column, reduced padding, smaller typography
- **`sm:` (640px+)**: Minor adjustments (contact links row)
- **`md:` (768px+)**: Two-column grids, FloatingNav visible, larger hero text
- **`lg:` (1024px+)**: Max-width containers, full spacing

Most of the responsive work is adjusting existing classes. The site already uses `md:grid-cols-2` and `md:px-12` in several places. Main gaps: hero section sizing on small screens, experience card layout, and mobile dark mode toggle placement.

### Project Card Keyboard Accessibility

Current code: `<div onClick={() => toggleProject(index)}>` -- inaccessible to keyboard users.

Fix:
```tsx
<button
  onClick={() => toggleProject(index)}
  aria-expanded={expandedProject === index}
  aria-controls={`project-detail-${index}`}
  className="w-full text-left"
>
  {/* card content */}
</button>
```

The detail panel needs `id={`project-detail-${index}`}` to match `aria-controls`.

## Sources

- [GSAP matchMedia() docs](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/) -- HIGH confidence
- [GSAP matchMedia reduced motion CodePen](https://codepen.io/GreenSock/pen/qBoRdqp) -- HIGH confidence
- [GSAP and accessibility (Anne Bovelett)](https://annebovelett.eu/gsap-and-accessibility-yes-you-can-have-both/) -- MEDIUM confidence
- [Next.js generateMetadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) -- HIGH confidence
- [Next.js Metadata and OG images guide](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) -- HIGH confidence
- [WCAG 2.4.11 Focus Not Obscured (TestParty)](https://testparty.ai/blog/wcag-2-4-11-focus-not-obscured-minimum-2025-guide) -- MEDIUM confidence
- [WCAG 2.2 Complete Guide (AllAccessible)](https://www.allaccessible.org/blog/wcag-22-complete-guide-2025) -- MEDIUM confidence
- [Tailwind CSS responsive design docs](https://tailwindcss.com/docs/responsive-design) -- HIGH confidence
- [Lenis GitHub](https://github.com/darkroomengineering/lenis) -- HIGH confidence
- [web.dev prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion) -- HIGH confidence
- [Pope Tech accessible animation guide](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/) -- MEDIUM confidence
- [backdrop-filter performance (Chrome bug report)](https://github.com/nextcloud/spreed/issues/7896) -- MEDIUM confidence
- [Lighthouse performance scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring) -- HIGH confidence

---
*Feature research for: v4.3 Cleanup and Launch milestone (responsive, a11y, performance, OG tags)*
*Researched: 2026-03-07*
