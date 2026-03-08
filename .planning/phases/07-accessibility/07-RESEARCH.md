# Phase 7: Accessibility - Research

**Researched:** 2026-03-08
**Domain:** Web Accessibility (WCAG 2.1 AA), GSAP reduced motion, semantic HTML
**Confidence:** HIGH

## Summary

Phase 7 retrofits accessibility across the existing portfolio site. The work divides cleanly into two plans: (1) structural/semantic fixes (landmarks, heading hierarchy, ARIA attributes, skip-to-content, focus styles, keyboard navigation) and (2) motion/contrast fixes (GSAP reduced-motion branches, Lenis disable, contrast color adjustments). No new libraries are needed -- all work uses native CSS, HTML semantics, and GSAP's built-in `gsap.matchMedia()`.

Contrast analysis reveals the light theme has several failing color combinations. `--text-secondary` (#8a7d96) fails 4.5:1 against both gradient backgrounds (2.88:1 and 2.52:1). The accent colors (#a78bcd, #c9a4b2, #b8a9c9) all fail as text in light theme. The dark theme passes everywhere. White text on project header accent colors (#a78bcd, #c9a4b2, #8bb4d4) also fails -- but these are large/bold text (14px bold uppercase) so only need 3:1 and are borderline.

The GSAP reduced-motion strategy is straightforward: `gsap.matchMedia()` supports a `"(prefers-reduced-motion: reduce)"` condition natively, auto-reverts animations when the condition changes, and is the documented approach in GSAP's official docs. For Lenis, the SmoothScrollProvider needs a conditional check to skip mounting ReactLenis entirely when reduced motion is preferred.

**Primary recommendation:** Use `gsap.matchMedia()` with a shared `"(prefers-reduced-motion: reduce)"` condition in each section's `useGSAP` scope. Fix contrast by darkening `--text-secondary` in light theme to ~#6d6080 and adjusting accent text colors per-context.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Focus ring: 2px solid outline using `var(--accent-purple)` with 2px offset, `:focus-visible` only, applied globally via CSS with inherited border-radius
- Skip-to-content: hidden until first Tab press, slides in at top, styled as glass panel (GlassPanel aesthetic)
- Reduced-motion: disables all GSAP scroll-triggered animations, content revealed via instant opacity fade (0->1), gradient animation frozen, Lenis disabled, banana cursor stays active, hover transforms removed but color/opacity kept, each section's useGSAP scope checks reduced-motion
- Contrast: darken `--text-secondary` values until 4.5:1 passes, light and dark themes may have different values, audit text only (decorative exempt), accent colors audited only where used as readable text
- Screen reader: project cards use `<button>` with `aria-expanded`, FloatingNav dots get `aria-label="Navigate to {Section} section"`, DarkModeToggle gets dynamic `aria-label`, use semantic HTML landmarks (`<main>`, `<nav>`, `<footer>`, `<section aria-label="...">`) instead of ARIA role attributes
- Heading hierarchy: h1 (Hero name), h2 (section titles via NeoBrutalHeading), h3 (subsections), no level skips

### Claude's Discretion
- Exact skip-to-content animation/transition details
- How to structure the reduced-motion check (matchMedia vs CSS media query vs both)
- Exact darkened hex values for --text-secondary (as long as they pass 4.5:1)
- Whether to add aria-live regions for any dynamic content
- Tab order adjustments if needed beyond natural DOM order

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| A11Y-01 | Semantic HTML structure with proper heading hierarchy (h1 > h2 > h3) | Heading audit complete -- h1 in Hero, h2 via NeoBrutalHeading + About custom h2, h3 in About/Skills/Experience/Projects. Add `<main>`, `<footer>`, `<section aria-label>` landmarks |
| A11Y-02 | Keyboard navigation works for all interactive elements | Project cards need `<button>` wrapper (currently `<div onClick>`). All other interactive elements already use `<button>` or `<a>`. Tab order follows DOM order which is logical |
| A11Y-03 | Focus indicators visible on all focusable elements | Global `:focus-visible` outline style in globals.css. Use `--accent-purple` 2px solid with 2px offset |
| A11Y-04 | prefers-reduced-motion replaces animations with instant reveals | `gsap.matchMedia()` in each useGSAP scope. Lenis conditional disable. CSS `@media (prefers-reduced-motion: reduce)` for CSS transitions. Gradient animation freeze |
| A11Y-05 | Color contrast meets WCAG AA (4.5:1 text, 3:1 large text) | Contrast audit complete -- light theme `--text-secondary` fails (2.88:1), accent colors fail as text in light theme. Dark theme passes. Fix with darkened color values |
| A11Y-06 | Skip-to-content link for keyboard users | New component in page.tsx, glass panel styled, targets `<main id="main-content">`, visible on `:focus` |
| A11Y-07 | ARIA labels on interactive elements | FloatingNav dots already have `aria-label` (update wording). DarkModeToggle already has dynamic `aria-label`. Project cards need `aria-expanded`. Section elements need `aria-label` |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| GSAP | 3.14.x | `gsap.matchMedia()` for reduced-motion conditional animations | Already in project, native reduced-motion support |
| Tailwind CSS | 4.x | Utility classes for focus styles, motion-reduce variants | Already in project, has `motion-reduce:` variant |
| Next.js | 16.1.6 | App Router, layout.tsx for landmarks | Already in project |

### Supporting
No additional libraries needed. All accessibility work uses native HTML, CSS, and existing GSAP APIs.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Manual contrast checking | @axe-core/react | Adds dev dependency for automated checking, but manual audit is sufficient for 7 color values |
| gsap.matchMedia() | window.matchMedia() directly | gsap.matchMedia auto-reverts animations on condition change; manual matchMedia requires manual cleanup |

## Architecture Patterns

### Reduced-Motion Pattern (per-section useGSAP)
**What:** Each section wraps its GSAP animations in `gsap.matchMedia()` conditions
**When to use:** Every section component with `useGSAP`
**Example:**
```typescript
// Source: GSAP official docs - gsap.matchMedia()
useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // Full animations (existing code moves here)
    gsap.fromTo(".element", { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8,
      scrollTrigger: { trigger: containerRef.current, start: "top 85%" }
    });
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    // Instant opacity reveal only -- no spatial motion
    gsap.fromTo(".element", { opacity: 0 }, {
      opacity: 1, duration: 0,
      scrollTrigger: { trigger: containerRef.current, start: "top 85%" }
    });
  });
}, { scope: containerRef });
```

### SplitText + Reduced Motion
**What:** SplitText instances should only be created in the no-preference branch
**When to use:** Hero, Experience, Skills, Projects, Contact sections
**Example:**
```typescript
mm.add("(prefers-reduced-motion: no-preference)", () => {
  const split = new SplitText(heading, { type: "words" });
  // SplitText cleanup is automatic when mm reverts
  gsap.fromTo(split.words, { y: 40, opacity: 0 }, { ... });
});

mm.add("(prefers-reduced-motion: reduce)", () => {
  // No SplitText, just instant reveal on the element itself
  gsap.set(heading, { opacity: 1 });
});
```

### Lenis Conditional Disable
**What:** Check `prefers-reduced-motion` before mounting Lenis
**Example:**
```typescript
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return <>{children}</>;

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false }}>
      {children}
    </ReactLenis>
  );
}
```

### Project Card Button Pattern
**What:** Replace `<div onClick>` with `<button>` + `aria-expanded`
**Example:**
```tsx
<button
  onClick={() => toggleProject(index)}
  aria-expanded={expandedProject === index}
  className="w-full text-left"
>
  {/* Card header + description content */}
</button>
```

### Skip-to-Content Pattern
**What:** Visually hidden link that appears on first Tab press
**Example:**
```tsx
<a
  href="#main-content"
  className="skip-to-content"
>
  Skip to content
</a>
```
```css
.skip-to-content {
  position: fixed;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  transition: top 0.2s ease;
}
.skip-to-content:focus {
  top: 1rem;
}
```

### Anti-Patterns to Avoid
- **Using `role="button"` on divs:** Use actual `<button>` elements instead -- they get keyboard events for free
- **Adding `tabindex` everywhere:** Natural DOM order is correct; only add `tabindex="-1"` to the skip target (`<main>`)
- **`aria-label` on elements with visible text:** Only use aria-label when there is no visible text label (like icon-only buttons and nav dots)
- **Removing `outline` globally:** Only hide on `:focus` (mouse), keep on `:focus-visible` (keyboard)

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reduced-motion detection | Custom matchMedia wrapper with state | `gsap.matchMedia()` | Auto-reverts all animations created in its scope when condition changes |
| Focus ring styling | Per-component focus styles | Global `:focus-visible` CSS rule | Consistency, single source of truth, works on all focusable elements |
| Contrast ratio calculation | Runtime JS contrast checker | Pre-computed hex values verified with WCAG tools | Static colors, no need for runtime calculation |
| Skip-to-content visibility | JavaScript show/hide logic | CSS `:focus` positioning | Pure CSS is simpler and works without JS |

## Common Pitfalls

### Pitfall 1: GSAP matchMedia Cleanup with SplitText
**What goes wrong:** SplitText instances created outside `gsap.matchMedia()` don't get auto-reverted
**Why it happens:** `gsap.matchMedia()` only auto-reverts GSAP tweens/timelines created inside its callback, but SplitText revert requires explicit handling
**How to avoid:** Create SplitText instances inside the `mm.add()` callback for `no-preference`. The matchMedia revert will handle cleanup. Alternatively, manually track and revert in the useGSAP cleanup.
**Warning signs:** Text stays split (individual character divs) when switching to reduced-motion

### Pitfall 2: Focus Ring on GlassPanel Tilt
**What goes wrong:** GlassPanel's tilt effect uses `gsap.to()` to rotate the element, which can fight with CSS outline offset
**Why it happens:** The outline follows the element's transform, and 3D transforms can make outlines look strange
**How to avoid:** In reduced-motion mode, tilt is disabled anyway. In normal mode, the focus ring appears on the button/link inside the GlassPanel, not on the panel itself
**Warning signs:** Outline appears distorted or clipped on hover-tilted elements

### Pitfall 3: Skip-to-Content and Lenis Scroll
**What goes wrong:** Skip-to-content `href="#main-content"` triggers native anchor scroll, but Lenis intercepts scroll behavior
**Why it happens:** Lenis overrides native scroll
**How to avoid:** Use `lenis.scrollTo("#main-content")` via onClick in addition to the href, or ensure the native anchor jump works correctly with Lenis
**Warning signs:** Clicking skip-to-content doesn't scroll to main content

### Pitfall 4: Project Card Button Styling Reset
**What goes wrong:** Changing `<div onClick>` to `<button>` adds default button styling (border, background, padding)
**Why it happens:** Browsers apply default button styles
**How to avoid:** Reset button styles: `background: none; border: none; padding: 0; text-align: left; width: 100%; cursor: pointer; font: inherit; color: inherit;`
**Warning signs:** Card layout breaks after changing to button element

### Pitfall 5: Gradient Animation Freeze Timing
**What goes wrong:** Gradient animation in page.tsx starts before reduced-motion check can run
**Why it happens:** The `useEffect` that starts the gradient fires immediately, before matchMedia state is resolved
**How to avoid:** Check `window.matchMedia("(prefers-reduced-motion: reduce)").matches` synchronously before starting the gradient tween
**Warning signs:** Brief flash of animated gradient before it freezes

### Pitfall 6: Light Theme Accent Colors as Text
**What goes wrong:** Accent purple (#a78bcd) used for job titles in ExperienceSection only gets 2.18:1 against light bg
**Why it happens:** Accent colors designed for visual pop, not text contrast
**How to avoid:** Per CONTEXT.md, accent colors are audited only where used as readable text. In light theme, darken accent-purple for text contexts or switch to `--text-body` for those labels
**Warning signs:** Lighthouse or axe flags low contrast on experience job titles

## Code Examples

### Global Focus-Visible Style (globals.css)
```css
/* Focus ring -- keyboard only, brand-colored */
:focus-visible {
  outline: 2px solid var(--accent-purple);
  outline-offset: 2px;
  border-radius: inherit;
}

/* Remove default outline on mouse click */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Reduced-Motion CSS Fallbacks (globals.css)
```css
@media (prefers-reduced-motion: reduce) {
  /* Disable CSS transitions that involve motion */
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }

  /* Keep color/opacity transitions */
  html {
    transition: background-color 0.35s ease, color 0.35s ease;
  }
}
```

### Semantic Landmarks (page.tsx)
```tsx
<div className="...">
  <FloatingNav />
  <MobileNav />

  {/* Skip-to-content link */}
  <a href="#main-content" className="skip-to-content">
    Skip to content
  </a>

  <main id="main-content" tabIndex={-1}>
    <HeroSection />
    <AboutSection />
    <ExperienceSection />
    <SkillsSection />
    <ProjectsSection />
    <ContactSection />
  </main>
</div>
```

### Section with aria-label
```tsx
<section ref={containerRef} id="about" aria-label="About Me" className="...">
```

## Contrast Audit Results

### Light Theme (MUST FIX)

| Color | Hex | vs bg-start | vs bg-end | Status | Action |
|-------|-----|-------------|-----------|--------|--------|
| text-primary | #3d3248 | 9.00:1 | 7.86:1 | PASS | None |
| text-body | #5a4d66 | 5.85:1 | 5.11:1 | PASS | None |
| text-secondary | #8a7d96 | 2.88:1 | 2.52:1 | FAIL | Darken to ~#6d6080 (target 4.5:1+) |
| accent-purple (as text) | #a78bcd | 2.18:1 | 1.90:1 | FAIL | Darken to ~#7d65a8 for text use in light theme |
| hero greeting | #b8a9c9 | 1.65:1 | 1.44:1 | FAIL | Darken to ~#7d6fa0 or use text-secondary |

### Dark Theme (ALL PASS)

| Color | Hex | vs bg-start | vs bg-end | Status |
|-------|-----|-------------|-----------|--------|
| text-primary | #e8ddd5 | 13.42:1 | 12.06:1 | PASS |
| text-body | #c4b8d0 | 9.48:1 | 8.52:1 | PASS |
| text-secondary | #9a8daa | 5.77:1 | 5.19:1 | PASS |

### White Text on Colored Backgrounds

| Background | Ratio | Status | Note |
|------------|-------|--------|------|
| #3d3248 (heading bg) | 12.01:1 | PASS | NeoBrutalHeading white text |
| #a78bcd (project header) | 2.91:1 | FAIL (barely under 3:1 for large) | White text at 14px bold |
| #c9a4b2 (project header) | 2.23:1 | FAIL | White text |
| #8bb4d4 (project header) | 2.19:1 | FAIL | White text |

**Note on project headers:** The white text on colored header bars is bold uppercase at ~14px. WCAG defines "large text" as 14pt bold (18.67px) or 18pt normal (24px). At 14px, these don't qualify as large text and need 4.5:1. The project header colors need darkening for text, or the text needs to change to a dark color.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `ScrollTrigger.matchMedia()` | `gsap.matchMedia()` | GSAP 3.11 (2022) | gsap.matchMedia is the successor, auto-reverts all GSAP objects in scope |
| `outline: none` globally | `:focus-visible` only | Wide browser support since 2022 | Keyboard users see focus rings, mouse users don't |
| `role="navigation"` on `<div>` | `<nav>` element | HTML5 | Semantic elements preferred over ARIA roles |

## Open Questions

1. **Exact darkened hex values for light theme text-secondary**
   - What we know: Current #8a7d96 fails at 2.88:1, need 4.5:1+
   - What's unclear: Exact hex that preserves the purple hue while passing
   - Recommendation: Compute values during implementation; target ~#6d6080 range. Verify with contrast checker before committing

2. **Project header white text fix strategy**
   - What we know: White on accent colors fails even for large text (2.2-2.9:1 vs 3:1 needed)
   - What's unclear: Whether to darken header backgrounds or switch to dark text
   - Recommendation: Darken each header color by ~20-30% to get white text to 4.5:1, since these are small text (14px bold uppercase, below WCAG "large text" threshold)

3. **Hero greeting color in light theme**
   - What we know: #b8a9c9 on light bg is 1.65:1 -- severely failing
   - What's unclear: This is decorative/secondary text ("HEY THERE, I'M") -- does it count for WCAG?
   - Recommendation: Treat as real text, darken to pass 4.5:1. It conveys meaning (greeting)

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed -- manual UAT |
| Config file | None |
| Quick run command | `npm run build` (catches type errors) |
| Full suite command | Manual UAT checklist |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| A11Y-01 | Semantic HTML landmarks and heading hierarchy | manual | Inspect DOM in browser devtools | N/A |
| A11Y-02 | Keyboard navigation (Tab through all interactive elements) | manual | Tab through page in browser | N/A |
| A11Y-03 | Focus indicators visible on keyboard focus | manual | Tab through page, verify rings | N/A |
| A11Y-04 | Reduced motion disables animations | manual | Enable reduced-motion in OS, reload page | N/A |
| A11Y-05 | Color contrast WCAG AA | manual | Lighthouse audit or axe devtools | N/A |
| A11Y-06 | Skip-to-content link | manual | Press Tab on page load, verify skip link appears | N/A |
| A11Y-07 | ARIA labels on interactive elements | manual | Screen reader test or DOM inspection | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` (ensures no type/syntax errors)
- **Per wave merge:** Manual UAT checklist (Tab navigation, screen reader, reduced-motion toggle)
- **Phase gate:** Full Lighthouse accessibility audit before `/gsd:verify-work`

### Wave 0 Gaps
None -- accessibility testing is inherently manual for this project scope. No test framework installation needed. Build command catches structural errors.

## Sources

### Primary (HIGH confidence)
- [GSAP gsap.matchMedia() docs](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()) - matchMedia API, conditions, auto-revert behavior
- [GSAP matchMedia + reduced-motion forum](https://gsap.com/community/forums/topic/27141-scrolltriggermatchmedia-and-prefers-reduced-motion/) - community patterns
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - WCAG AA contrast ratio tool
- Codebase audit - direct inspection of all 8 section components, 4 UI components, globals.css, layout.tsx, page.tsx

### Secondary (MEDIUM confidence)
- [Lenis GitHub](https://github.com/darkroomengineering/lenis) - configuration options for disabling smooth scroll
- [Smashing Magazine - Respecting Motion Preferences](https://www.smashingmagazine.com/2021/10/respecting-users-motion-preferences/) - reduced-motion best practices

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new libraries, all native CSS + existing GSAP APIs
- Architecture: HIGH - gsap.matchMedia() is well-documented, patterns verified against official docs
- Contrast audit: HIGH - computed contrast ratios using WCAG 2.x relative luminance formula
- Pitfalls: MEDIUM - SplitText + matchMedia interaction needs validation during implementation

**Research date:** 2026-03-08
**Valid until:** 2026-04-08 (stable domain, WCAG 2.1 AA requirements don't change)
