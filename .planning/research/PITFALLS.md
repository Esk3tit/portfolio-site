# Domain Pitfalls

**Domain:** Responsive design, accessibility, performance, and refactoring for animation-heavy portfolio site
**Researched:** 2026-03-07
**Context:** v4.3 milestone -- adding responsive/a11y/perf to existing GSAP + Lenis + GlassPanel site, extracting Exploration6.tsx into section components

## Critical Pitfalls

Mistakes that cause rewrites, broken animations, or accessibility failures.

### Pitfall 1: GSAP Scope Orphaning When Extracting Section Components

**What goes wrong:** Exploration6.tsx has a single `useGSAP({ scope: containerRef })` that targets class selectors like `.e6-hero-emoji`, `.e6-about-panel`, `.e6-experience-card` across all sections. When sections are extracted into child components (HeroSection, AboutSection, etc.), those child elements are no longer reliably scoped to the parent's `containerRef` -- or worse, the parent's scope catches elements that should be owned by the child's animation context.

**Why it happens:** GSAP's `useGSAP` scopes selector text to descendants of the container ref. When DOM moves into a child component, the parent's selectors either break (elements not found) or create orphaned ScrollTrigger instances that never clean up. The current code has ~15 ScrollTrigger instances and 2+ SplitText instances all managed from one `useGSAP` call.

**Consequences:**
- Animations silently stop working (selectors find nothing)
- Memory leaks from ScrollTriggers that never get killed
- React strict mode double-mount creates duplicate animations
- Elements flash visible then invisible as competing contexts fight

**Prevention:**
- Each extracted section component gets its OWN `useGSAP` hook with its OWN `containerRef` scope
- Move the animation code WITH the JSX -- do not leave animation logic in the parent
- Each section component is responsible for its own ScrollTrigger setup and cleanup
- Use `contextSafe()` for any event handlers (like `toggleProject`) that create animations after mount
- Test unmount/remount in React strict mode to verify no leaked ScrollTriggers

**Detection:** Log `ScrollTrigger.getAll().length` on mount and unmount. If the count grows across navigations, you have leaks.

**Phase to address:** Component extraction phase -- this is the FIRST thing to get right before any other changes.

### Pitfall 2: SplitText Breaks on Responsive Resize Without autoSplit

**What goes wrong:** The current code uses `new SplitText(".e6-hero-name", { type: "chars" })` and `new SplitText(heading, { type: "words" })`. When the viewport resizes (orientation change on mobile, desktop resize), SplitText's injected wrapper `<div>` elements do not reflow properly. Text wraps mid-character or words stack incorrectly. The hero gradient text is especially fragile -- the code already has a workaround that manually re-applies gradient styles to split chars.

**Why it happens:** SplitText replaces text nodes with nested elements calculated at the initial viewport width. On resize, the container width changes but the split elements are fixed from the original calculation. The current `revert()` only runs on unmount, not on resize.

**Consequences:**
- Text overlaps or breaks mid-word on mobile after orientation change
- Gradient text on hero name loses styling after resize
- Line breaks appear in wrong places at different breakpoints

**Prevention:**
- Use `autoSplit: true` with an `onSplit()` callback that creates the animation. SplitText automatically reverts and re-splits on container resize (debounced 200ms) and on font load
- Move animation creation INTO `onSplit()` and return the animation so SplitText can clean up the old one on re-split
- For the hero gradient text: apply gradient styles via a CSS class (not inline JS in a forEach loop) so they survive re-splits automatically

**Detection:** Rotate a phone from portrait to landscape. If heading text looks broken, SplitText did not re-split.

**Phase to address:** Responsive design phase -- must be fixed when adding breakpoints.

### Pitfall 3: prefers-reduced-motion Partially Applied = Invisible Content

**What goes wrong:** Developers add `prefers-reduced-motion` checks to SOME animations but miss others. Elements that were supposed to animate in with `opacity: 0 -> 1` via GSAP stay permanently invisible because the animation was disabled but the initial state (opacity: 0, y: 50, scale: 0.95) was still applied by the `fromTo()` call.

**Why it happens:** The current code uses `gsap.fromTo()` extensively -- every section has elements that start at `{ opacity: 0, y: 40-60, scale: 0.95 }`. These "from" values are applied IMMEDIATELY when `fromTo()` executes, before any scroll trigger fires. If you conditionally skip the animation but not the initial state setup, elements remain hidden. This is the single most common reduced-motion bug.

**Consequences:**
- Invisible content for the exact users who need accessibility support (ironic failure)
- Some sections animate, others are frozen at their "from" state
- Content is in the DOM but visually absent -- breaks both screen readers and sighted users

**Prevention:**
- Use `gsap.matchMedia()` to wrap ALL animation setup. When `(prefers-reduced-motion: reduce)` matches, provide a separate block that sets elements to their final visible state immediately (opacity: 1, y: 0, scale: 1) or applies simple opacity-only fades
- Never use `gsap.set()` or `gsap.fromTo()` for initial hidden states OUTSIDE of the matchMedia block
- The reduced-motion block should `gsap.set()` all animated elements to their FINAL visible state
- Test by toggling "Reduce motion" in macOS System Settings > Accessibility > Display

**Detection:** Enable "Reduce motion" in macOS settings. If any section content is invisible, the from-state was applied without the to-animation.

**Phase to address:** Accessibility phase -- but the architecture for this (matchMedia wrapping) should be planned during component extraction.

### Pitfall 4: Lenis Smooth Scroll Fights Native Accessibility

**What goes wrong:** Lenis overrides native scroll behavior. The current `SmoothScrollProvider` has NO reduced-motion check -- it always applies smooth scrolling regardless of user preference. This can break: (1) screen reader virtual cursor scrolling, (2) scroll position when keyboard-tabbing to off-screen elements, (3) users who get motion sick from interpolated scrolling.

**Why it happens:** The `SmoothScrollProvider` unconditionally wraps the app in `<ReactLenis root>` with `autoRaf: false` and ties it to `gsap.ticker`. There is no conditional path for users who prefer reduced motion.

**Consequences:**
- Users who get motion sick experience smooth-scroll-induced nausea
- Keyboard Tab navigation may fight with Lenis scroll interpolation
- Screen reader users may not have content scroll into view correctly

**Prevention:**
- Check `window.matchMedia('(prefers-reduced-motion: reduce)')` in `SmoothScrollProvider` -- either skip Lenis entirely or set `lerp: 1` (instant, no interpolation)
- Add a `MediaQueryList.addEventListener('change')` listener so if the user toggles reduced-motion mid-session, Lenis responds
- Verify CMD+F (find on page) and VoiceOver cursor scrolling work with Lenis active

**Detection:** Enable VoiceOver on macOS, navigate the site with VO cursor. If content doesn't scroll into view when focused, Lenis is interfering.

**Phase to address:** Accessibility phase.

### Pitfall 5: backdrop-filter: blur(40px) Destroys Mobile Performance

**What goes wrong:** Every `GlassPanel` applies `backdrop-filter: blur(40px) saturate(1.6)`. On mobile, each backdrop-filter creates a separate compositing layer. The page has 15+ GlassPanels (hero badge, hero card, 4 about panels, 3 experience cards + emoji badges, 4 skill categories, project cards, contact card + nested link cards). The GPU must blur the background behind EACH panel on every frame during scroll.

**Why it happens:** `backdrop-filter` cannot be cached like regular `filter` because it samples what is BEHIND the element, which changes on scroll. Combined with Lenis smooth scroll (repaints on every rAF), GSAP scroll-triggered animations (transform changes), and the fixed noise texture overlay (another compositing layer), the GPU is overwhelmed on mid-range phones.

**Consequences:**
- Jank during scroll on mobile (dropped frames)
- Lighthouse Performance score tanks from main thread blocked by compositing
- Battery drain on mobile devices
- Worst case: browser drops to software rendering

**Prevention:**
- Reduce blur radius on mobile: `blur(40px)` desktop, `blur(12px)` or `blur(8px)` mobile via CSS media query or `gsap.matchMedia()`
- Consider replacing `backdrop-filter` with solid semi-transparent background on mobile (no blur) if Lighthouse still struggles
- Remove or reduce the fixed noise texture overlay on mobile (the SVG filter `url(#glass-noise)` on a fixed full-screen div is an additional compositing cost)
- Use Chrome DevTools Layers panel to count compositing layers -- aim for under 30 on mobile
- Add `will-change: transform` to elements that animate, but remove it after animation completes

**Detection:** Run Lighthouse mobile audit with throttling. Profile with Chrome DevTools Performance tab on 4x CPU slowdown. Check for frames exceeding 16ms.

**Phase to address:** Performance optimization phase -- but plan the mobile fallback design during responsive design phase.

## Moderate Pitfalls

### Pitfall 6: ScrollTrigger.refresh() Timing After Component Extraction

**What goes wrong:** The current code calls `ScrollTrigger.refresh(true)` with a double `requestAnimationFrame` delay after the single component mounts. When Exploration6 is split into 6+ child components, each child mounts at slightly different times. If each child calls `ScrollTrigger.refresh()`, they fight each other -- the first refresh calculates positions before later children have rendered.

**Prevention:**
- Call `ScrollTrigger.refresh()` ONCE from the parent page component after all section children have mounted
- Use a single `useEffect` with an empty dependency array in the page-level component, with the double-rAF delay
- Do NOT call refresh inside individual section components
- Alternative: use `ScrollTrigger.config({ autoRefreshEvents: "visibilitychange,DOMContentLoaded,load" })` and let it handle refresh timing

**Phase to address:** Component extraction phase.

### Pitfall 7: Responsive Breakpoints Without gsap.matchMedia() = Zombie Animations

**What goes wrong:** Adding responsive CSS breakpoints (hiding elements, changing layouts) without wrapping GSAP animations in `gsap.matchMedia()` creates "zombie animations" -- ScrollTriggers targeting elements that are `display: none` on mobile. These zombies still calculate positions and fire callbacks, wasting CPU and causing position miscalculations for other ScrollTriggers.

**Prevention:**
- Use `gsap.matchMedia()` to create separate animation sets for mobile vs desktop
- Inside each matchMedia block, animations are automatically reverted when the media query stops matching
- Do NOT use CSS `display: none` to hide elements that have ScrollTriggers -- use matchMedia to prevent the ScrollTrigger from being created at all
- The magnetic cursor and tilt effects should only exist in the `(hover: hover)` media query block

**Phase to address:** Responsive design phase.

### Pitfall 8: Keyboard Focus Completely Missing

**What goes wrong:** The current site has no `tabIndex` management, no focus-visible styles, and no skip-navigation link. The project card expand/collapse uses `onClick` on a plain `<div>` -- not keyboard accessible. The FloatingNav has no keyboard handling.

**Prevention:**
- Add a skip-to-content link (`<a href="#main-content">`) as the first focusable element
- Make project card expand/collapse keyboard-accessible: use `<button>` for the clickable area, or add `role="button"` + `tabIndex={0}` + `onKeyDown` handler for Enter/Space
- Add visible `:focus-visible` styles matching the neobrutalist aesthetic (3px outline with offset, using `--glass-border` color)
- Ensure FloatingNav links are keyboard-reachable and have focus indicators
- Test: Tab through the entire page. Every interactive element must be reachable and visually indicated

**Phase to address:** Accessibility phase.

### Pitfall 9: document.querySelector in React = Fragile Global Selectors

**What goes wrong:** The `toggleProject` function uses `document.querySelector(`.e6-project-detail-${index}`)` to find elements. This bypasses React's ref system, creates global selectors that could match wrong elements after extraction, and breaks if class naming changes during refactor.

**Prevention:**
- Replace `document.querySelector` with React refs (use `useRef` arrays or a ref callback pattern)
- When extracting ProjectCard as its own component, use a local ref for the detail element
- This also prevents the bug where duplicate component instances would find each other's elements

**Phase to address:** Component extraction phase.

### Pitfall 10: CSS Custom Property Gradient Animation Orphaned After Extraction

**What goes wrong:** The gradient animation in Exploration6 uses `gsap.to(document.documentElement, { "--bg-gradient-start": ... })` with a MutationObserver for theme changes. When extracting components, this global animation could end up in a section component (wrong scope), get duplicated across components, or be lost entirely.

**Prevention:**
- Keep the gradient animation and MutationObserver in ONE place -- the page-level component or a dedicated provider
- Do NOT put this logic in any section component
- Section components should NEVER animate CSS custom properties on `document.documentElement`

**Phase to address:** Component extraction phase.

## Minor Pitfalls

### Pitfall 11: Color Contrast Failures in Current Palette

**What goes wrong:** The muted color palette (`#b8a9c9` greeting text on warm backgrounds, `var(--text-secondary)` in dark mode) likely fails WCAG AA contrast requirements (4.5:1 for normal text). The gradient text on the hero name is particularly risky -- `background-clip: text` with a gradient means contrast varies across the text.

**Prevention:**
- Run axe-core or Lighthouse accessibility audit on BOTH light and dark mode
- Check gradient text contrast at its WEAKEST point (lightest gradient color against the panel background)
- Adjust `--text-secondary` and `--text-body` CSS custom properties if they fail 4.5:1
- The `#b8a9c9` hero greeting text is likely the worst offender

**Phase to address:** Accessibility phase.

### Pitfall 12: Emoji as Decorative Elements = Screen Reader Noise

**What goes wrong:** The site uses emoji extensively in section headings, badges, and project cards. Screen readers announce each emoji by name ("sparkles", "rocket", "briefcase"), creating noisy, repetitive output.

**Prevention:**
- Decorative emoji: wrap in `<span aria-hidden="true">`
- The sparkles badge already has `role="img" aria-label="sparkles"` which is correct for meaningful emoji
- Section heading emoji (briefcase, brain, tools, speech bubble) should be `aria-hidden="true"` since the text label already provides meaning
- Do NOT use emoji as the only indicator of meaning

**Phase to address:** Accessibility phase.

### Pitfall 13: Static Export Cannot Use next/og for Dynamic OG Images

**What goes wrong:** The project uses `output: 'export'` (static). `next/og` for dynamic Open Graph image generation requires a server runtime and will fail at build time.

**Prevention:**
- Use a pre-generated static OG image (PNG, 1200x630) committed to `/public/og-image.png`
- Reference via static `<meta property="og:image">` tags in the root layout
- This is simpler and more reliable for a single-page portfolio

**Phase to address:** Accessibility/meta tags phase.

### Pitfall 14: Removing Explore Pages May Leave Dead Imports

**What goes wrong:** If explore page routes and components are deleted but imports referencing them linger elsewhere (in page.tsx, barrel exports, or dynamic imports), the build breaks or dead code inflates the bundle.

**Prevention:**
- Delete ALL related files: route files (`/explore/[id]/page.tsx`), component files (Exploration1-5), and any barrel exports
- Run `next build` after deletion and verify no import errors
- Check bundle size before and after to confirm dead code is eliminated
- Search the codebase for any string references to "exploration" or "explore"

**Phase to address:** Code cleanup phase (do this first, before component extraction).

## Phase-Specific Warnings

| Phase Topic | Likely Pitfalls | Key Mitigation |
|-------------|----------------|----------------|
| Code cleanup (remove explores) | #14 (dead imports) | Delete all artifacts, verify build, check bundle |
| Component extraction | #1 (scope orphaning), #6 (refresh timing), #9 (querySelector), #10 (gradient animation) | Each section owns its useGSAP + containerRef. Page-level refresh only. Replace querySelector with refs. Keep gradient in page component. |
| Responsive design | #2 (SplitText resize), #5 (backdrop-filter mobile), #7 (zombie animations) | Use SplitText autoSplit. Reduce/remove blur on mobile. Wrap all GSAP in matchMedia. |
| Accessibility | #3 (reduced-motion invisible content), #4 (Lenis a11y), #8 (keyboard), #11 (contrast), #12 (emoji noise) | gsap.matchMedia for reduced-motion with final-state fallback. Disable Lenis interpolation for reduced-motion. Add keyboard handling + focus styles. Audit contrast. |
| Performance / Lighthouse | #5 (backdrop-filter), #7 (zombie ScrollTriggers) | Profile on mobile throttling. Reduce compositing layers. Kill unused ScrollTriggers via matchMedia. |

## Recommended Phase Ordering Based on Pitfall Dependencies

1. **Code cleanup first** -- Remove explore pages and dead code (Pitfall 14). Clean slate for extraction.
2. **Component extraction second** -- Pitfalls 1, 6, 9, 10 are all refactor-specific. Get architecture right before layering features.
3. **Responsive design third** -- Pitfalls 2, 5, 7 require settled component structure so matchMedia can be applied per-section.
4. **Accessibility fourth** -- Pitfalls 3, 4, 8, 11, 12 layer on the responsive foundation. Reduced-motion relies on matchMedia already being in place from responsive.
5. **Performance tuning last** -- Pitfall 5 optimization is iterative and needs the final DOM structure to profile accurately.

## Sources

- [GSAP React Integration (official docs)](https://gsap.com/resources/React/) -- useGSAP, contextSafe, scope
- [gsap.matchMedia() (official docs)](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()) -- responsive breakpoints, reduced-motion
- [SplitText (official docs)](https://gsap.com/docs/v3/Plugins/SplitText/) -- autoSplit, onSplit, resize handling
- [SplitText responsive revert (GSAP forum)](https://gsap.com/community/forums/topic/31716-splittext-responsive-howto-revert/)
- [SplitText revert after resize (GSAP forum)](https://gsap.com/community/forums/topic/44579-splittext-revert-after-resize/)
- [GSAP and accessibility (Anne Bovelett)](https://annebovelett.eu/gsap-and-accessibility-yes-you-can-have-both/)
- [GSAP in Practice: Avoid the Pitfalls (Marmelab)](https://marmelab.com/blog/2024/05/30/gsap-in-practice-avoid-the-pitfalls.html)
- [ScrollTrigger cleanup in React (GSAP forum)](https://gsap.com/community/forums/topic/35810-scrolltrigger-and-react-component-cycle-cleanup/)
- [Lenis smooth scroll (official)](https://lenis.darkroom.engineering/)
- [Lenis GitHub](https://github.com/darkroomengineering/lenis) -- accessibility claims
- [Smooth Scrolling and Accessibility (CSS-Tricks)](https://css-tricks.com/smooth-scrolling-accessibility/)
- [Optimizing GSAP in Next.js (Thomas Augot)](https://medium.com/@thomasaugot/optimizing-gsap-animations-in-next-js-15-best-practices-for-initialization-and-cleanup-2ebaba7d0232)
- [Adventures in text splitting: GSAP SplitText rewrite (Webflow)](https://webflow.com/blog/gsap-splittext-rewrite)

---
*Pitfalls research for: v4.3 Cleanup and Launch -- responsive, accessibility, performance, refactoring*
*Researched: 2026-03-07*
