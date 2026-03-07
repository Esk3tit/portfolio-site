# Architecture Patterns

**Domain:** Portfolio site refactor -- responsive design, accessibility, performance, code cleanup
**Researched:** 2026-03-07
**Confidence:** HIGH (based on direct codebase analysis, not external research)

## Current Architecture (Before Refactor)

```
src/
  app/
    layout.tsx          -- RootLayout (fonts, theme script, cursor, providers)
    page.tsx            -- HomePage renders <Exploration6 />
    globals.css         -- Tailwind v4 + CSS custom properties for theming
    explore/[id]/       -- TO BE REMOVED: dynamic routes for explorations 1-6
  components/
    cursor/
      CustomCursor.tsx  -- Magnetic pull behavior (renders null, cursor is CSS)
    explorations/
      Exploration1-5.tsx -- TO BE REMOVED: earlier design explorations
      Exploration6.tsx   -- TO BE EXTRACTED: single 787-line "use client" component
    providers/
      DarkModeProvider.tsx -- Theme context with localStorage + system detection
      SmoothScroll.tsx     -- Lenis smooth scroll + GSAP ticker sync
    sections/
      FloatingNav.tsx      -- Right-side dot nav with ScrollTrigger tracking
    ui/
      DarkModeToggle.tsx   -- Toggle button in FloatingNav
      GlassPanel.tsx       -- Glass card with tilt effect (GSAP-based)
      NeoBrutalButton.tsx  -- Button/link with neobrutalist styling
      NeoBrutalHeading.tsx -- Section heading with neobrutalist banner
      NeoBrutalTag.tsx     -- Skill/tech tag pill
  data/
    content.ts          -- All content data with TypeScript interfaces
  lib/
    gsap.ts             -- GSAP + ScrollTrigger + SplitText registration
public/
    habbycursor*.png    -- KEEP: banana cursor images (3 sizes)
    resume.pdf          -- KEEP: resume download
    file.svg, globe.svg, next.svg, vercel.svg, window.svg -- TO BE REMOVED: Vercel defaults
```

### Key Architectural Facts About Current State

1. **Exploration6.tsx is a 787-line monolith.** It contains all 6 sections inline, owns all GSAP animations in one `useGSAP` block, manages `expandedProject` state, gradient animation, and `scrollToAbout`. Every section's animation is coupled to every other section's lifecycle.

2. **Animation is 100% GSAP.** No Framer Motion. GSAP with ScrollTrigger for scroll reveals, SplitText for heading/hero text, `useGSAP` hook for React integration. All registered in `src/lib/gsap.ts`.

3. **Cursor is CSS-only.** The `CustomCursor` component renders `null` -- it only handles magnetic pull via `[data-magnetic]` attribute detection. The actual cursor image is set via inline `<style>` in `layout.tsx` using `@media (pointer: fine)`.

4. **Theme uses CSS custom properties + MutationObserver.** Not Tailwind's `dark:` variant. An inline script in `<head>` prevents FOUC. `DarkModeProvider` manages state. The gradient animation in Exploration6 watches for class changes on `<html>` to restart with new color targets.

5. **Static export.** `output: "export"` in `next.config.ts`. No server components, no API routes, no ISR. Everything is client-rendered.

6. **FloatingNav is desktop-only.** `hidden md:flex` -- completely invisible on mobile. No navigation exists below 768px.

## Recommended Architecture (After Refactor)

```
src/
  app/
    layout.tsx          -- MODIFIED: add OG meta tags, favicon link
    page.tsx            -- MODIFIED: import section components, own gradient animation
    globals.css         -- MODIFIED: add reduced-motion rules, responsive fixes
  components/
    cursor/
      CustomCursor.tsx  -- UNCHANGED (already touch-aware)
    providers/
      DarkModeProvider.tsx -- UNCHANGED
      SmoothScroll.tsx     -- MODIFIED: disable Lenis on reduced-motion
    sections/
      FloatingNav.tsx      -- MODIFIED: add mobile navigation variant
      HeroSection.tsx      -- NEW: extracted from Exploration6 lines 316-398
      AboutSection.tsx     -- NEW: extracted from Exploration6 lines 400-442
      ExperienceSection.tsx -- NEW: extracted from Exploration6 lines 444-512
      SkillsSection.tsx    -- NEW: extracted from Exploration6 lines 516-552
      ProjectsSection.tsx  -- NEW: extracted from Exploration6 lines 554-712
      ContactSection.tsx   -- NEW: extracted from Exploration6 lines 714-783
    ui/
      DarkModeToggle.tsx   -- UNCHANGED
      GlassPanel.tsx       -- MODIFIED: disable tilt on reduced-motion
      NeoBrutalButton.tsx  -- UNCHANGED
      NeoBrutalHeading.tsx -- MODIFIED: accept `as` prop for heading level
      NeoBrutalTag.tsx     -- UNCHANGED
  data/
    content.ts           -- UNCHANGED
  hooks/
    useReducedMotion.ts  -- NEW: shared prefers-reduced-motion hook
    useGradientAnimation.ts -- NEW: extracted gradient cycling logic
  lib/
    gsap.ts              -- UNCHANGED
public/
    favicon.ico          -- NEW: from old portfolio
    habbycursor*.png     -- KEEP
    resume.pdf           -- KEEP
    og-image.png         -- NEW: Open Graph social preview image
```

### Files to Delete

| File/Directory | Reason |
|----------------|--------|
| `src/app/explore/` (entire directory) | Exploration routes no longer needed |
| `src/components/explorations/Exploration1.tsx` | Superseded by Exploration6 |
| `src/components/explorations/Exploration2.tsx` | Superseded by Exploration6 |
| `src/components/explorations/Exploration3.tsx` | Superseded by Exploration6 |
| `src/components/explorations/Exploration4.tsx` | Superseded by Exploration6 |
| `src/components/explorations/Exploration5.tsx` | Superseded by Exploration6 |
| `src/components/explorations/Exploration6.tsx` | Replaced by extracted section components |
| `public/file.svg` | Vercel default asset |
| `public/globe.svg` | Vercel default asset |
| `public/next.svg` | Vercel default asset |
| `public/vercel.svg` | Vercel default asset |
| `public/window.svg` | Vercel default asset |

### New Files

| File | Purpose | Dependencies |
|------|---------|-------------|
| `src/hooks/useReducedMotion.ts` | Shared `prefers-reduced-motion` detection | None |
| `src/hooks/useGradientAnimation.ts` | Gradient background cycling with theme-awareness | `useReducedMotion`, `@/lib/gsap` |
| `src/components/sections/HeroSection.tsx` | Hero entrance animation, SplitText, CTAs | GlassPanel, NeoBrutalButton, content.ts, gsap |
| `src/components/sections/AboutSection.tsx` | About panels with scroll reveal | GlassPanel, content.ts, gsap |
| `src/components/sections/ExperienceSection.tsx` | Timeline cards with scroll reveal | GlassPanel, NeoBrutalHeading, content.ts, gsap |
| `src/components/sections/SkillsSection.tsx` | Skill categories with scroll reveal | GlassPanel, NeoBrutalHeading, NeoBrutalTag, content.ts, gsap |
| `src/components/sections/ProjectsSection.tsx` | Project cards with expand/collapse state | GlassPanel, NeoBrutalHeading, NeoBrutalButton, NeoBrutalTag, content.ts, gsap |
| `src/components/sections/ContactSection.tsx` | Contact links + resume download | GlassPanel, NeoBrutalHeading, NeoBrutalButton, content.ts, gsap |
| `public/favicon.ico` | Site favicon from old portfolio | None |
| `public/og-image.png` | Social share preview image (1200x630) | None |

### Modified Files

| File | What Changes | Why |
|------|-------------|-----|
| `src/app/layout.tsx` | Add OG/Twitter meta in `metadata` export, favicon in `icons` | Social previews, branding |
| `src/app/page.tsx` | Import section components instead of Exploration6; own the wrapper div (gradient bg, SVG noise filter, noise overlay); call `useGradientAnimation` | Component extraction |
| `src/app/globals.css` | Add `@media (prefers-reduced-motion: reduce)` block to disable/shorten transitions | Accessibility |
| `src/components/sections/FloatingNav.tsx` | Add mobile bottom bar or toggle-able nav below `md` breakpoint | Responsive -- currently invisible on mobile |
| `src/components/ui/GlassPanel.tsx` | Check `useReducedMotion()` to skip tilt effect | Accessibility |
| `src/components/ui/NeoBrutalHeading.tsx` | Accept optional `as` prop (`h2` | `h3`) for correct heading hierarchy | Accessibility |
| `src/components/providers/SmoothScroll.tsx` | Check `prefers-reduced-motion` and skip Lenis initialization when active | Accessibility |

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `RootLayout` | HTML shell, fonts, theme FOUC script, OG tags, providers, CustomCursor | DarkModeProvider, SmoothScrollProvider, CustomCursor |
| `HomePage (page.tsx)` | Page wrapper (gradient bg, noise filter SVG, noise overlay), renders sections in order, gradient animation | All section components, useGradientAnimation |
| `HeroSection` | Hero entrance timeline (GSAP), SplitText char split on name, CTAs, `scrollToAbout` | GlassPanel, NeoBrutalButton, content.ts |
| `AboutSection` | Two-panel grid, scroll-triggered stagger reveal | GlassPanel, content.ts |
| `ExperienceSection` | Stacked cards, scroll-triggered stagger reveal, emoji badges | GlassPanel, NeoBrutalHeading, content.ts |
| `SkillsSection` | Skill category grid, scroll-triggered stagger reveal | GlassPanel, NeoBrutalHeading, NeoBrutalTag, content.ts |
| `ProjectsSection` | Project card grid, expand/collapse (owns `expandedProject` state), GSAP height animation | GlassPanel, NeoBrutalHeading, NeoBrutalButton, NeoBrutalTag, content.ts |
| `ContactSection` | Contact links, resume download, scroll-triggered reveal | GlassPanel, NeoBrutalHeading, NeoBrutalButton, content.ts |
| `FloatingNav` | Section tracking via ScrollTrigger, scroll-to via Lenis, dark mode toggle, mobile variant | DarkModeToggle, ScrollTrigger, Lenis |
| `CustomCursor` | Magnetic pull on `[data-magnetic]` elements, disabled on touch | GSAP, window mousemove |
| `useReducedMotion` | Returns boolean for `prefers-reduced-motion: reduce` | Used by sections, SmoothScroll, GlassPanel |

## Data Flow

### Current Flow (Monolithic)
```
content.ts --> Exploration6.tsx (imports ALL data, renders ALL 6 sections,
               owns ALL GSAP animations in one useGSAP block,
               owns expandedProject state, gradient animation, scrollToAbout)
```

### Proposed Flow (Extracted)
```
content.ts --|-> HeroSection (heroContent)
             |-> AboutSection (aboutPanels)
             |-> ExperienceSection (experiences)
             |-> SkillsSection (skillCategories)
             |-> ProjectsSection (projects) -- owns expandedProject state
             |-> ContactSection (contactLinks)

page.tsx renders:
  <div ref={containerRef}>     // gradient bg, wrapper
    <FloatingNav />
    <svg>noise filter def</svg>
    <div>noise overlay</div>
    <HeroSection />
    <AboutSection />
    <ExperienceSection />
    <SkillsSection />
    <ProjectsSection />
    <ContactSection />
  </div>
```

### Gradient Animation Ownership

The gradient animation (Exploration6 lines 66-122) animates `--bg-gradient-start` and `--bg-gradient-end` on `document.documentElement` and watches for theme class changes via MutationObserver. This is page-level behavior.

**Decision: Extract to `src/hooks/useGradientAnimation.ts`, call from `page.tsx`.**

Rationale:
- page.tsx is already `"use client"` (must be, since it uses hooks).
- Gradient animation is visual page chrome, not section-specific.
- It observes theme changes -- logically page-level, not provider-level.
- Keeping it in DarkModeProvider would couple visual effects to state management.

### SplitText and ScrollTrigger Animation Ownership

Currently one `useGSAP` block in Exploration6 handles ALL scroll-triggered animations for ALL sections. After extraction, each section owns its own animations:

```typescript
// Each section component follows this pattern:
"use client";
export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (reducedMotion) return;

    // SplitText for headings within this section
    const splits: InstanceType<typeof SplitText>[] = [];
    const headings = sectionRef.current?.querySelectorAll(".split-heading");
    headings?.forEach((h) => {
      const split = new SplitText(h, { type: "words" });
      splits.push(split);
      gsap.fromTo(split.words,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: h, start: "top 85%" } }
      );
    });

    // Section-specific element animations
    gsap.fromTo(".about-panel", /* ... */);

    return () => splits.forEach((s) => s.revert());
  }, { scope: sectionRef });

  return <section id="about" ref={sectionRef} aria-labelledby="about-heading">...</section>;
}
```

**Key point:** The `scope: sectionRef` in `useGSAP` means CSS selectors like `.about-panel` are scoped to that section's DOM subtree. No cross-section selector conflicts.

### Class Name Renaming

Current class names use `e6-` prefix (namespaced for Exploration6). After extraction, rename to semantic names since each section is scoped by its own ref:

| Current | After |
|---------|-------|
| `e6-hero-emoji` | `hero-emoji` |
| `e6-hero-glass` | `hero-glass` |
| `e6-hero-greeting` | `hero-greeting` |
| `e6-hero-name` | `hero-name` |
| `e6-hero-name-gradient` | `hero-name-gradient` |
| `e6-hero-tagline` | `hero-tagline` |
| `e6-hero-cta` | `hero-cta` |
| `e6-about-section` | (use `id="about"` on section element) |
| `e6-about-heading` | `about-heading` |
| `e6-about-panel` | `about-panel` |
| `e6-experience-section` | (use `id="experience"` on section element) |
| `e6-experience-card` | `experience-card` |
| `e6-skills-section` | (use `id="skills"` on section element) |
| `e6-skill-category` | `skill-category` |
| `e6-projects-section` | (use `id="projects"` on section element) |
| `e6-projects-heading` | `projects-heading` |
| `e6-project-card` | `project-card` |
| `e6-project-detail-{N}` | `project-detail-{N}` |
| `e6-contact-section` | (use `id="contact"` on section element) |
| `e6-contact-card` | `contact-card` |
| `e6-split-heading` | `split-heading` |
| `e6-floating-nav` | `floating-nav` |
| `e6-link-underline` | `link-underline` (in globals.css) |

## Patterns to Follow

### Pattern 1: Reduced Motion Hook

**What:** Centralized `prefers-reduced-motion` detection reused by all animated components.
**When:** Every component that uses GSAP animations or interactive motion (tilt, magnetic pull).

```typescript
// src/hooks/useReducedMotion.ts
"use client";
import { useState, useEffect } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}
```

**Reduced motion strategy:**
1. Section animations: `if (reducedMotion) return;` at top of `useGSAP` callback -- elements render at final position with full opacity (no GSAP `fromTo` setting `opacity: 0`).
2. Lenis: Skip initialization entirely -- native browser scroll.
3. GlassPanel tilt: Skip tilt mousemove/mouseleave handlers.
4. Gradient animation: Set static gradient, no cycling.
5. SplitText: Do not instantiate -- text stays unsplit.
6. CSS transitions: Global media query shortens all `transition-duration` to near-zero.

```css
/* globals.css addition */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Pattern 2: Section Component Template

**What:** Standard structure every extracted section follows.
**When:** All 6 section components.

```typescript
"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, SplitText } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
// + section-specific UI component imports
// + section-specific data imports from content.ts

export default function XxxSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (reducedMotion) return;
    const splits: InstanceType<typeof SplitText>[] = [];

    // Heading SplitText reveal (if section has NeoBrutalHeading)
    // ...

    // Element-specific scroll-triggered animations
    // ...

    return () => splits.forEach((s) => s.revert());
  }, { scope: sectionRef });

  return (
    <section
      id="xxx"
      ref={sectionRef}
      className="relative z-[2] px-6 py-28 md:px-12"
      aria-labelledby="xxx-heading"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section content */}
      </div>
    </section>
  );
}
```

Key properties:
- `"use client"` -- required for `useRef`, `useGSAP`, `useReducedMotion`
- Own `ref` for GSAP `scope` -- prevents selector leaking
- Own `useGSAP` -- animations scoped to this section's DOM
- `aria-labelledby` -- connects section to its heading for screen readers
- No props -- each section imports its own data directly
- No inter-section communication -- sections are independent

### Pattern 3: Mobile Navigation

**What:** Navigation accessible on mobile since FloatingNav is `hidden md:flex`.
**When:** Below `md` (768px) breakpoint.

Two viable approaches:

**Option A (Recommended): Fixed bottom bar.**
- Simple row of section labels at bottom of viewport
- Always visible, minimal interaction needed
- Matches mobile UX conventions (bottom tab bars)
- Avoids hamburger menu interaction cost

**Option B: Hamburger menu.**
- More compact but requires open/close interaction
- Adds state management and animation for menu panel
- Overkill for 5 nav items

Implementation sketch for Option A:
```typescript
// Inside FloatingNav, add a second nav element:
<nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden" aria-label="Section navigation">
  <div className="flex justify-around items-center px-2 py-3"
       style={{ background: "var(--glass-fill)", backdropFilter: "blur(20px)",
                borderTop: "2px solid var(--glass-border)" }}>
    {sections.map((section) => (
      <button key={section.id} onClick={() => scrollTo(section.id)}
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: isActive ? "var(--accent-purple)" : "var(--text-secondary)" }}>
        {section.label}
      </button>
    ))}
    <DarkModeToggle />
  </div>
</nav>
```

### Pattern 4: OG Meta Tags via Next.js Metadata API

**What:** Open Graph and Twitter Card meta tags added through Next.js `metadata` export.
**When:** In `layout.tsx`, replacing the minimal existing metadata.

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
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Khai Phan - Software Engineer",
    description: "I build software. Sometimes it's good.",
    images: ["/og-image.png"],
  },
  icons: { icon: "/favicon.ico" },
};
```

### Pattern 5: Responsive Breakpoint Strategy

**What:** Mobile-first responsive layout using Tailwind v4 defaults.
**When:** All layout and typography adjustments.

Breakpoints: base (0-639), `sm` (640+), `md` (768+), `lg` (1024+).

Responsive gaps in current code and fixes:

| Section | Issue | Fix |
|---------|-------|-----|
| Hero | `text-5xl` base is fine; `px-10 py-14` may crowd small phones | Reduce to `px-6 py-10` base, `md:px-10 md:py-14` |
| About | Already has `md:grid-cols-2`, stacks on mobile | Good as-is |
| Experience | Emoji badge `absolute -top-3 -left-3` clips on narrow screens; `ml-6` assumes badge space | Add `overflow-visible` to parent, reduce badge offset on mobile |
| Skills | Already has `md:grid-cols-2`, stacks on mobile | Good as-is |
| Projects | Already has `md:grid-cols-2`, stacks on mobile | Verify touch targets on expand/close |
| Contact | Already has `sm:flex-row`, stacks on mobile | Good as-is |
| FloatingNav | `hidden md:flex` -- no nav on mobile | Add bottom bar (Pattern 3) |

## Anti-Patterns to Avoid

### Anti-Pattern 1: Lifting Animation State to Page Level
**What:** Passing GSAP refs, timelines, or animation callbacks as props from page.tsx to sections.
**Why bad:** Couples sections, makes reordering/removing fragile, defeats extraction purpose.
**Instead:** Each section owns its animations via `useGSAP({ scope })`. Only page-level visual (gradient) lives in page.tsx.

### Anti-Pattern 2: Conditional JSX for Reduced Motion
**What:** Rendering different component trees for reduced-motion vs full-motion.
**Why bad:** Doubles complexity, risks layout shifts, hard to maintain visual parity.
**Instead:** Same JSX always. Skip GSAP animations when `reducedMotion === true`. Elements render at natural final positions. CSS media query handles transition shortening globally.

### Anti-Pattern 3: Keeping `e6-` Class Prefixes
**What:** Leaving `e6-hero-glass`, `e6-about-panel` etc. after Exploration6 is deleted.
**Why bad:** Confusing naming, suggests these classes belong to something that no longer exists.
**Instead:** Rename to semantic names (`hero-glass`, `about-panel`). Safe because `useGSAP({ scope })` scopes selectors to each section's ref.

### Anti-Pattern 4: Creating a Shared Animation Provider
**What:** Building a React Context that broadcasts scroll position or animation state to all sections.
**Why bad:** Unnecessary complexity. GSAP ScrollTrigger already handles scroll-triggered animations internally. Adding a provider would duplicate what ScrollTrigger does and introduce React re-renders in the animation loop.
**Instead:** Each section uses `useGSAP` + ScrollTrigger directly. No provider needed.

## Build Order (Dependency-Aware)

The following order respects dependencies so each step can be verified independently.

### Step 1: Cleanup (no functional changes to live site)
1. Delete `src/app/explore/` directory
2. Delete `src/components/explorations/Exploration1-5.tsx`
3. Delete Vercel default SVGs from `public/` (file.svg, globe.svg, next.svg, vercel.svg, window.svg)
4. Add `public/favicon.ico` from old portfolio
5. **Verify:** Build succeeds, site works (page.tsx still imports Exploration6)

### Step 2: Create shared hooks
6. Create `src/hooks/useReducedMotion.ts`
7. Create `src/hooks/useGradientAnimation.ts` (extract from Exploration6 lines 66-122)

### Step 3: Extract section components (one at a time, verify each)
8. Extract `HeroSection.tsx` -- most complex (SplitText timeline, scrollToAbout callback)
9. Extract `AboutSection.tsx` -- simplest, good second extraction to validate pattern
10. Extract `ExperienceSection.tsx`
11. Extract `SkillsSection.tsx`
12. Extract `ProjectsSection.tsx` -- owns `expandedProject` state + `toggleProject` callback
13. Extract `ContactSection.tsx`
14. Update `page.tsx`: import all sections, add wrapper div (gradient bg, noise filter SVG, noise overlay), call `useGradientAnimation`, call `ScrollTrigger.refresh()` after mount
15. Delete `Exploration6.tsx` and `src/components/explorations/` directory
16. Rename `e6-` class prefixes to semantic names across all new section files + globals.css

### Step 4: Responsive design
17. Add mobile bottom bar navigation to FloatingNav
18. Audit Hero section padding/font sizing on small screens
19. Fix Experience section badge positioning for narrow viewports
20. Verify all grids collapse to single column, touch targets >= 44x44px

### Step 5: Accessibility
21. Wire `useReducedMotion` into all section `useGSAP` callbacks (early return)
22. Wire `useReducedMotion` into SmoothScroll.tsx (skip Lenis init)
23. Wire `useReducedMotion` into GlassPanel.tsx (skip tilt)
24. Wire `useReducedMotion` into useGradientAnimation.ts (static gradient)
25. Add `@media (prefers-reduced-motion: reduce)` to globals.css
26. Add `aria-labelledby` to all sections, add `as` prop to NeoBrutalHeading for heading hierarchy
27. Audit color contrast in both light and dark mode
28. Test keyboard navigation: tab order, focus ring visibility, skip-to-content link

### Step 6: OG tags and performance
29. Update `metadata` in layout.tsx with OG/Twitter tags
30. Create `public/og-image.png` (1200x630)
31. Run Lighthouse mobile audit, target 90+
32. Address any Lighthouse findings (likely: font preloading, CLS from animations)
33. Final build + deploy verification

**Critical dependency chain:** Step 2 (hooks) before Step 3 (extraction). Step 3 (extraction) before Steps 4/5 (responsive/a11y) because reduced-motion and responsive changes target the new section components. Step 1 (cleanup) is independent and can go first.

**Parallelizable after Step 3:** Steps 4 (responsive) and 5 (accessibility) modify different aspects of the same components and can be done concurrently or interleaved. Step 6 (OG/performance) depends on everything else being in place.

## Sources

- Direct analysis of all source files in the current codebase
- GSAP `useGSAP` hook `scope` option for React component scoping
- Next.js Metadata API for OG tags (static metadata export)
- WAI-ARIA landmark roles and heading hierarchy best practices
- Open Graph protocol: 1200x630 recommended image dimensions

---
*Architecture research for: v4.3 Cleanup and Launch milestone*
*Researched: 2026-03-07*
