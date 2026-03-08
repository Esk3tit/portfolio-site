# Phase 6: Responsive Design - Research

**Researched:** 2026-03-08
**Domain:** Responsive CSS, mobile navigation, touch interaction, Tailwind v4 responsive utilities
**Confidence:** HIGH

## Summary

This phase makes the existing single-page portfolio usable on mobile (375px+), tablet (640-1024px), and desktop (>1024px). The codebase already uses Tailwind v4 responsive prefixes in many places (`md:px-12`, `md:grid-cols-2`, `sm:flex-row`, `sm:text-6xl`, `md:text-7xl`) so much of the grid collapse work is partially done. The primary new work is: (1) building a MobileNav component with hamburger button and full-screen glass drawer, (2) adjusting typography and padding scales for mobile, (3) enforcing 44px touch targets, and (4) making the DarkModeToggle conditionally sized.

The stack is already locked -- Tailwind v4 for responsive utilities, GSAP for drawer animations, existing CSS custom properties for theming. No new libraries are needed. The main risk is GSAP drawer animations conflicting with scroll lock and Lenis smooth scroll on mobile.

**Primary recommendation:** Build MobileNav as a single new component using GlassPanel for the drawer, GSAP timeline for open/close animations, and the same sections array and Lenis scrollTo pattern from FloatingNav. Apply responsive class updates to existing sections in a separate pass.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Mobile navigation: Hamburger icon + full-screen glass overlay drawer on mobile (<768px)
- Hamburger button: fixed top-right, always visible on mobile, styled as 44px glass circle with frosted backdrop, 2-3px border, offset shadow
- Drawer: full-screen frosted glass overlay with section links centered vertically, dark mode toggle at bottom
- Drawer animation: fade in + scale up (from slightly scaled down), links stagger in -- GSAP, not CSS transitions
- Drawer closes on link tap (scrolls to section) or tap outside/X button
- FloatingNav remains desktop-only (`hidden md:flex`) -- no changes to desktop behavior
- Hero glass panel: full-width with reduced padding on mobile (edge-to-edge minus page padding)
- Hero name: text-3xl on mobile (<640px), current sm:text-6xl / md:text-7xl preserved
- Hero subtitle: drops to text-sm on mobile
- Section headings (NeoBrutalHeading): scale to text-xl on mobile (currently text-2xl / md:text-3xl)
- Section vertical padding: py-16 on mobile (<640px), current py-28 on md+
- Skills grid: single column on mobile, 2-col on tablet+ (current md:grid-cols-2 already handles this)
- Project cards: keep inline expand behavior on all devices -- no modal on mobile
- Experience cards: stack vertically, full-width on mobile -- all details visible, no hide/reveal
- Contact links: stack vertically below 640px, row above (current sm:flex-row already handles this)
- DarkModeToggle: 44px in mobile nav drawer, 32px on desktop (conditional sizing)
- NeoBrutalButton: min-height 44px enforced on mobile, desktop stays as-is
- All interactive elements: 44px minimum hit area on mobile via padding or min-height
- Same animations on mobile, just adapted -- no separate mobile animation set

### Claude's Discretion
- Exact animation timing/easing for mobile nav drawer
- How to structure the MobileNav component (single file or split)
- Specific responsive utility class choices (Tailwind breakpoints vs custom)
- Whether to use a portal for the drawer overlay
- Exact padding values for hero glass panel on mobile

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| RESP-01 | Site renders correctly on mobile (<640px), tablet (640-1024px), and desktop (>1024px) breakpoints | Tailwind v4 responsive prefixes (sm:, md:, lg:) handle all breakpoints; audit of each section identifies specific class changes needed |
| RESP-02 | Mobile navigation bar visible on small screens (FloatingNav is hidden on mobile) | New MobileNav component with hamburger + drawer; FloatingNav already has `hidden md:flex` |
| RESP-03 | Dark mode toggle accessible on mobile (currently hidden with FloatingNav) | DarkModeToggle placed in mobile drawer with conditional 44px sizing via props |
| RESP-04 | Touch targets meet 44px minimum on mobile | NeoBrutalButton min-height, DarkModeToggle size prop, padding adjustments on interactive elements |

</phase_requirements>

## Standard Stack

### Core (Already Installed -- No New Dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | v4 | Responsive utility classes, breakpoints | Already used throughout; CSS-based config via `@theme` in globals.css |
| GSAP | ^3.14.2 | Mobile nav drawer animations, stagger effects | Project decision: single animation engine, no Framer Motion |
| Lenis | ^1.3.18 | Smooth scroll for mobile nav link taps | Already used by FloatingNav for scrollTo |
| Next.js | 16.1.6 | App Router, SSR | Already the framework |
| React | 19.2.3 | Component model | Already the runtime |

### Supporting (Already Installed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| GlassPanel | (internal) | Drawer overlay, hamburger button styling | Reuse for consistent glass aesthetic |
| DarkModeToggle | (internal) | Theme switching in drawer | Reuse with size prop |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GSAP for drawer | CSS transitions | Locked decision: GSAP only. CSS transitions would be simpler but break the "single animation engine" rule |
| React portal for drawer | Inline rendering | Portal avoids z-index conflicts but adds complexity; inline is fine since drawer is z-50+ and full-screen |

**Installation:**
```bash
# No new packages needed
```

## Architecture Patterns

### New Component Location
```
src/
├── components/
│   ├── sections/
│   │   ├── FloatingNav.tsx    # Desktop only (unchanged)
│   │   └── MobileNav.tsx      # NEW: hamburger + drawer for <768px
│   └── ui/
│       ├── DarkModeToggle.tsx  # MODIFIED: accept size prop
│       ├── GlassPanel.tsx      # Unchanged, reused for drawer
│       ├── NeoBrutalButton.tsx  # MODIFIED: min-h-[44px] on mobile
│       ├── NeoBrutalHeading.tsx # MODIFIED: text-xl on mobile
│       └── NeoBrutalTag.tsx     # Review touch target sizing
├── app/
│   └── page.tsx                # Add MobileNav alongside FloatingNav
```

### Pattern 1: MobileNav Component Structure
**What:** Single file component with hamburger button + full-screen drawer overlay
**When to use:** Renders on all viewports but hamburger is `md:hidden` (visible only <768px)

```typescript
// src/components/sections/MobileNav.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLenis } from "lenis/react";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";

const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  const openDrawer = useCallback(() => {
    setIsOpen(true);
    // Prevent body scroll while drawer is open
    lenis?.stop();
    // GSAP timeline: fade in overlay, scale up drawer, stagger links
    const tl = gsap.timeline();
    tl.fromTo(drawerRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
    );
    tl.fromTo(".mobile-nav__link",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.3, ease: "power3.out" },
      "-=0.2"
    );
  }, [lenis]);

  const closeDrawer = useCallback(() => {
    gsap.to(drawerRef.current, {
      opacity: 0, scale: 0.95, duration: 0.3, ease: "power2.in",
      onComplete: () => {
        setIsOpen(false);
        lenis?.start();
      }
    });
  }, [lenis]);

  const scrollTo = useCallback((id: string) => {
    closeDrawer();
    // Small delay to let drawer close before scroll
    setTimeout(() => {
      lenis?.scrollTo(`#${id}`, { offset: -80, duration: 1.2 });
    }, 350);
  }, [lenis, closeDrawer]);

  return (
    <>
      {/* Hamburger button -- fixed top-right, visible only on mobile */}
      <button
        className="mobile-nav__hamburger fixed top-4 right-4 z-[60] flex md:hidden items-center justify-center"
        onClick={isOpen ? closeDrawer : openDrawer}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        style={{
          width: 44, height: 44,
          borderRadius: "50%",
          background: "var(--glass-fill)",
          backdropFilter: "blur(12px)",
          border: "2px solid var(--glass-border)",
          boxShadow: "2px 2px 0px var(--glass-border)",
        }}
      >
        {/* Hamburger icon or X */}
      </button>

      {/* Full-screen drawer overlay */}
      {isOpen && (
        <div ref={drawerRef} className="fixed inset-0 z-[55] flex flex-col items-center justify-center"
          style={{
            background: "linear-gradient(160deg, var(--glass-fill) 0%, var(--glass-fill-end) 100%)",
            backdropFilter: "blur(40px) saturate(1.6)",
          }}
        >
          <nav className="flex flex-col items-center gap-6">
            {sections.map((section) => (
              <button key={section.id} className="mobile-nav__link" onClick={() => scrollTo(section.id)}>
                {section.label}
              </button>
            ))}
          </nav>
          <div className="mt-8">
            <DarkModeToggle size={44} />
          </div>
        </div>
      )}
    </>
  );
}
```

### Pattern 2: Conditional DarkModeToggle Sizing
**What:** Add optional `size` prop to DarkModeToggle, defaulting to 32
**When to use:** 32px in FloatingNav (desktop), 44px in MobileNav drawer

```typescript
interface DarkModeToggleProps {
  size?: number;
}

export function DarkModeToggle({ size = 32 }: DarkModeToggleProps) {
  // ... existing logic
  // Use size prop for width, height, and fontSize scaling
}
```

### Pattern 3: Responsive Section Padding
**What:** Change section padding from `py-28` to `py-16 sm:py-28` across all sections
**When to use:** Every section component's root element

```typescript
// Before:
className="px-6 py-28 md:px-12"

// After:
className="px-6 py-16 sm:py-28 md:px-12"
```

### Pattern 4: Body Scroll Lock During Drawer
**What:** Use Lenis stop/start to prevent background scrolling when drawer is open
**When to use:** When mobile drawer opens/closes

```typescript
// Open: lenis?.stop()  -- freezes scroll
// Close: lenis?.start() -- re-enables scroll
```

### Anti-Patterns to Avoid
- **Separate mobile animation system:** Requirements explicitly prohibit this. Same GSAP animations, just adapted via responsive classes.
- **CSS transitions for drawer:** Locked decision says GSAP. Mixing animation engines breaks consistency.
- **Fixed pixel breakpoints in JS:** Use Tailwind's responsive prefixes (`md:hidden`, `md:flex`) instead of JS `window.innerWidth` checks.
- **Removing tilt on mobile via JS matchMedia:** GlassPanel already guards tilt with `(hover: hover)` check -- no additional work needed.
- **Z-index conflicts:** Hamburger must be z-[60] (above drawer z-[55]) so it remains tappable when drawer is open. FloatingNav is z-50.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll lock | Custom `overflow: hidden` on body | `lenis.stop()` / `lenis.start()` | Lenis manages scroll; fighting it causes janky behavior |
| Glass panel styling | New CSS for drawer panel | `GlassPanel` component or same CSS custom properties | Consistency with existing design system |
| Section scroll navigation | Custom scroll math | `lenis.scrollTo()` with offset | Already proven in FloatingNav, handles smooth scroll correctly |
| Responsive breakpoints | Custom CSS media queries | Tailwind v4 responsive prefixes (sm:, md:, lg:) | Project already uses Tailwind throughout; consistency |

**Key insight:** This phase is mostly about applying responsive Tailwind classes to existing components and creating one new component (MobileNav) that reuses existing patterns. No new architectural concepts needed.

## Common Pitfalls

### Pitfall 1: Drawer Opens but Body Still Scrolls
**What goes wrong:** Mobile drawer overlay is visible but user can still scroll the page behind it
**Why it happens:** Lenis controls scroll, so CSS `overflow: hidden` on body alone doesn't work
**How to avoid:** Call `lenis.stop()` on open, `lenis.start()` on close. This is the Lenis-native way to pause scrolling.
**Warning signs:** Content moves behind the drawer when swiping

### Pitfall 2: GSAP Drawer Animation on Unmounted Element
**What goes wrong:** React unmounts the drawer div before GSAP's close animation finishes
**Why it happens:** Setting `isOpen = false` removes the DOM element mid-animation
**How to avoid:** Use GSAP's `onComplete` callback to set state AFTER animation finishes. Keep the element mounted during close animation.
**Warning signs:** Console errors about animating null targets, drawer disappears abruptly

### Pitfall 3: Hero Text Too Large on Small Phones
**What goes wrong:** "I'm Khai Phan." at text-5xl overflows on 375px screens
**Why it happens:** Current hero h1 is `text-5xl sm:text-6xl md:text-7xl` -- text-5xl is still 3rem (48px) which is large for 375px
**How to avoid:** Change to `text-3xl sm:text-6xl md:text-7xl` per user decision. 3xl = 1.875rem (30px), comfortable on 375px.
**Warning signs:** Horizontal scroll appearing, text clipped at edges

### Pitfall 4: SplitText Reflow on Responsive Font Size Changes
**What goes wrong:** SplitText splits text at one size, then responsive classes change font size, causing misaligned character positions
**Why it happens:** SplitText calculates positions once at init; CSS-only responsive changes don't trigger resplit
**How to avoid:** SplitText's `autoSplit` option (GSAP 3.14+) should handle resize events. Verify this works. If not, use ScrollTrigger.refresh() on resize.
**Warning signs:** Characters overlap or have wrong spacing after viewport resize

### Pitfall 5: 44px Touch Targets Breaking Visual Design
**What goes wrong:** Enforcing min-height 44px makes buttons look awkwardly tall or disproportionate
**Why it happens:** Naive min-height without adjusting padding
**How to avoid:** Use `min-h-[44px]` with existing padding -- NeoBrutalButton's `py-3.5` (14px * 2 = 28px padding + text height) is close to 44px already. Just add the min-height as a floor on mobile only.
**Warning signs:** Buttons look stretched compared to desktop

### Pitfall 6: Hamburger z-index Under Drawer
**What goes wrong:** Hamburger button disappears behind the drawer overlay when drawer opens
**Why it happens:** Both are fixed position; if drawer z-index >= hamburger z-index, button is hidden
**How to avoid:** Hamburger z-[60], drawer z-[55]. Hamburger stays above drawer.
**Warning signs:** Cannot close drawer because X/hamburger button is not visible

## Code Examples

### Responsive Section Root (Standard Pattern)
```typescript
// Source: Current codebase pattern, adapted for responsive
// Apply to: AboutSection, ExperienceSection, SkillsSection, ProjectsSection, ContactSection

// Before:
<section className="relative z-[2] px-6 py-28 md:px-12">

// After:
<section className="relative z-[2] px-6 py-16 sm:py-28 md:px-12">
```

### NeoBrutalHeading Responsive Text
```typescript
// Source: CONTEXT.md decision -- text-xl on mobile
// Before:
className={`split-heading inline-block px-6 py-3 text-2xl font-bold md:text-3xl ${className}`}

// After:
className={`split-heading inline-block px-4 py-2.5 text-xl font-bold sm:px-6 sm:py-3 sm:text-2xl md:text-3xl ${className}`}
```

### Hero Name Responsive Text
```typescript
// Source: CONTEXT.md decision -- text-3xl on mobile
// Before:
className="hero-section__name mt-5 text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl"

// After:
className="hero-section__name mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl"
```

### Hero Glass Panel Mobile Padding
```typescript
// Source: CONTEXT.md decision -- reduced padding on mobile
// Before:
className="hero-section__glass px-10 py-14 md:px-16 md:py-18"

// After:
className="hero-section__glass px-6 py-10 sm:px-10 sm:py-14 md:px-16 md:py-18"
```

### NeoBrutalButton Touch Target
```typescript
// Source: CONTEXT.md decision -- min-height 44px on mobile
// Before:
const baseClassName = `rounded-xl px-8 py-3.5 text-sm font-bold uppercase tracking-wider ${className}`;

// After:
const baseClassName = `rounded-xl px-8 py-3.5 min-h-[44px] sm:min-h-0 text-sm font-bold uppercase tracking-wider ${className}`;
```

### Experience Card Mobile Padding
```typescript
// Source: CONTEXT.md -- full-width, reduced padding on mobile
// Before:
className={`experience-section__card px-8 py-8`}

// After:
className={`experience-section__card px-5 py-6 sm:px-8 sm:py-8`}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v3 JS config + `screens` | Tailwind v4 CSS-based `@theme` + default breakpoints | Tailwind v4 (2024) | No tailwind.config.js needed; breakpoints are sm:640, md:768, lg:1024 by default |
| `@media (max-width)` mobile-first | Tailwind responsive prefixes (sm:, md:, lg:) | Always | Write mobile-first styles, add prefixed overrides for larger screens |
| Separate mobile components | Same components with responsive classes | Modern practice | Less code duplication, easier maintenance |

**Tailwind v4 default breakpoints (no customization needed):**
- `sm:` = 640px+
- `md:` = 768px+
- `lg:` = 1024px+

These align perfectly with the project's mobile (<640px), tablet (640-1024px), desktop (>1024px) requirements.

## Open Questions

1. **SplitText autoSplit behavior on resize**
   - What we know: GSAP 3.14+ SplitText has `autoSplit` which should resplit on resize
   - What's unclear: Whether gradient re-application in HeroSection survives autoSplit's resplit
   - Recommendation: Test manually after implementation. If gradient breaks on resize, add a resize handler that re-applies gradient styles to split chars.

2. **Lenis scroll behavior on iOS Safari**
   - What we know: Lenis works on mobile browsers generally
   - What's unclear: Whether `lenis.stop()` fully prevents scroll on iOS Safari (which has its own scroll physics)
   - Recommendation: Test on real iOS device. If `lenis.stop()` is insufficient, add `document.body.style.overflow = 'hidden'` as a fallback alongside it.

3. **Portal vs inline for drawer overlay**
   - What we know: Both work; portal avoids z-index stacking context issues
   - Recommendation: Use inline rendering (no portal). The drawer is z-[55] with no parent stacking contexts that would clip it. Portal adds unnecessary complexity for this case.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None currently installed |
| Config file | none -- see Wave 0 |
| Quick run command | Manual browser testing (dev server) |
| Full suite command | N/A |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| RESP-01 | All content readable at 375px, no horizontal scroll, grids collapse | manual-only | Visual inspection at 375px, 768px, 1024px+ in DevTools | N/A |
| RESP-02 | Mobile nav hamburger visible <768px, drawer opens/closes | manual-only | Tap hamburger, verify drawer appears with links | N/A |
| RESP-03 | Dark mode toggle in mobile drawer, functional | manual-only | Open drawer, tap toggle, verify theme changes | N/A |
| RESP-04 | All interactive elements >= 44px touch target on mobile | manual-only | DevTools element inspector measuring computed height/width | N/A |

**Justification for manual-only:** Responsive design verification requires visual confirmation of layout, spacing, and touch target sizing. Automated pixel-perfect tests are brittle and slow. Playwright MCP has been used informally (`.playwright-mcp/` directory exists with screenshots) and can supplement manual testing via screenshots at different viewport sizes.

### Sampling Rate
- **Per task commit:** Visual check in browser DevTools at 375px (iPhone SE) and 768px (tablet)
- **Per wave merge:** Full walkthrough at 375px, 414px (iPhone), 768px, 1024px, 1440px
- **Phase gate:** All 4 success criteria verified visually before `/gsd:verify-work`

### Wave 0 Gaps
None -- responsive design testing is inherently visual/manual. Playwright MCP can be used ad-hoc for viewport screenshots if needed, but formal test setup is not required for this phase.

## Sources

### Primary (HIGH confidence)
- **Codebase audit** -- Direct reading of all 7 section components, 4 UI components, page.tsx, layout.tsx, globals.css
- **Tailwind v4** -- CSS-based config confirmed via `@import "tailwindcss"` and `@theme` block in globals.css; default breakpoints sm:640/md:768/lg:1024

### Secondary (MEDIUM confidence)
- **GSAP SplitText autoSplit** -- Known feature in GSAP 3.14+, but exact behavior with gradient text needs runtime validation
- **Lenis stop/start** -- Standard API for scroll lock, documented in Lenis README

### Tertiary (LOW confidence)
- **iOS Safari scroll lock** -- `lenis.stop()` may need supplementary `overflow: hidden` on iOS; needs device testing

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies, all existing tools
- Architecture: HIGH - MobileNav follows established FloatingNav patterns exactly
- Pitfalls: HIGH - all pitfalls derived from direct codebase analysis (z-index, GSAP unmount, scroll lock)
- Responsive class changes: HIGH - every section audited, exact class changes documented

**Research date:** 2026-03-08
**Valid until:** 2026-04-08 (stable -- no fast-moving dependencies)
