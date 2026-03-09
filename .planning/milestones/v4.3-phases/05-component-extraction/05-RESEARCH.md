# Phase 5: Component Extraction - Research

**Researched:** 2026-03-07
**Domain:** React component architecture, GSAP animation scoping, Next.js App Router
**Confidence:** HIGH

## Summary

Phase 5 is a pure refactor: decompose the 787-line `Exploration6.tsx` monolith into 6 independent section components (Hero, About, Experience, Skills, Projects, Contact) in `src/components/sections/`. Each section owns its data imports, animations via its own `useGSAP` hook with scoped `containerRef`, and all refs/state. The site must function identically before and after -- zero visual or behavioral changes.

The extraction is mechanically straightforward. The critical risk is animation breakage: the current code uses a single `useGSAP` scope for all GSAP selectors (`.e6-hero-emoji`, `.e6-about-panel`, etc.). Splitting into 6 independent `useGSAP` hooks means each section's selectors must be scoped to its own `containerRef`, not the page-level container. The `e6-*` class names are renamed to BEM-style `{section}-section__{element}` during extraction.

**Primary recommendation:** Extract one section at a time (Hero first, Contact last), verifying animations work after each extraction. This limits blast radius per change.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- page.tsx renders: FloatingNav + gradient background container + 6 section components
- FloatingNav stays in page.tsx (page-level navigation concern)
- Gradient background animation + noise filter SVG stay in page.tsx (shared visual wrapper)
- Exploration6.tsx is deleted entirely -- no barrel export or redirect
- Section components live in `src/components/sections/` (HeroSection.tsx, AboutSection.tsx, ExperienceSection.tsx, SkillsSection.tsx, ProjectsSection.tsx, ContactSection.tsx)
- Each section has its own `useGSAP` hook with scoped `containerRef` -- no central coordination
- ScrollTrigger auto-discovers triggers; each section calls `ScrollTrigger.refresh()` after its animations are set up
- Hero's char-split SplitText with gradient re-application stays inline in HeroSection (no abstraction)
- Each section tracks and reverts its own SplitText instances in useGSAP cleanup
- Project card expand/collapse moves to ProjectsSection as local state
- Gradient animation logic stays in page.tsx with the outer container
- Each section imports its own data directly from `@/data/content`
- Rename all `e6-*` classes to BEM-style: `{section}-section__{element}`
- Rename everywhere: globals.css class definitions, TSX className attributes, and GSAP animation selectors

### Claude's Discretion
- Exact order of extraction (which section to extract first)
- Whether to extract sections one-at-a-time or all-at-once
- Internal component structure (sub-components within a section if needed)
- Any helper utilities that emerge during extraction

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CLEAN-02 | Extract Exploration6.tsx into separate section components (Hero, About, Experience, Skills, Projects, Contact) | Full extraction plan: 6 components in `src/components/sections/`, each with own useGSAP scope, BEM class naming, data imports from `@/data/content` |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.3 | Component architecture | Already in use |
| Next.js | 16.1.6 | App Router, page rendering | Already in use |
| GSAP | 3.14.2 | All animations (scroll, entrance, hover) | Project decision -- single animation engine |
| @gsap/react | 2.1.2 | `useGSAP` hook for React lifecycle | Official GSAP React integration |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| SplitText (GSAP plugin) | bundled | Character/word text splitting | Hero name chars, section heading words |
| ScrollTrigger (GSAP plugin) | bundled | Scroll-based animation triggers | Every section's entrance animations |

### Alternatives Considered
None -- this is a refactor within the existing stack. No new dependencies needed.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── page.tsx              # FloatingNav + gradient wrapper + 6 section imports
│   ├── globals.css           # Theme custom properties (NO e6-* classes exist here)
│   └── layout.tsx            # Lenis smooth scroll (unchanged)
├── components/
│   ├── sections/
│   │   ├── FloatingNav.tsx   # Already exists (unchanged)
│   │   ├── HeroSection.tsx   # NEW
│   │   ├── AboutSection.tsx  # NEW
│   │   ├── ExperienceSection.tsx  # NEW
│   │   ├── SkillsSection.tsx      # NEW
│   │   ├── ProjectsSection.tsx    # NEW
│   │   └── ContactSection.tsx     # NEW
│   └── ui/
│       ├── GlassPanel.tsx         # Unchanged
│       ├── NeoBrutalButton.tsx    # Unchanged
│       ├── NeoBrutalHeading.tsx   # MODIFIED: rename e6-split-heading to split-heading
│       └── NeoBrutalTag.tsx       # Unchanged
├── data/
│   └── content.ts            # Named exports per section (unchanged)
├── lib/
│   └── gsap.ts               # Re-exports gsap, ScrollTrigger, useGSAP, SplitText (unchanged)
└── (Exploration6.tsx DELETED)
```

### Pattern 1: Self-Contained Section Component
**What:** Each section component is a `"use client"` component that owns its containerRef, useGSAP hook, data imports, and all JSX.
**When to use:** Every section component follows this pattern.
**Example:**
```typescript
"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, SplitText } from "@/lib/gsap";
import { experiences } from "@/data/content";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeoBrutalHeading } from "@/components/ui/NeoBrutalHeading";

export function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const splitInstances: InstanceType<typeof SplitText>[] = [];

      // Word-split heading animation (NeoBrutalHeading adds .split-heading class)
      const headings = containerRef.current?.querySelectorAll(".split-heading");
      headings?.forEach((heading) => {
        const split = new SplitText(heading, { type: "words" });
        splitInstances.push(split);
        gsap.fromTo(
          split.words,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out",
            scrollTrigger: { trigger: heading, start: "top 85%" },
          }
        );
      });

      // Section-specific animations
      gsap.fromTo(
        ".experience-section__card",
        { y: 50, opacity: 0, scale: 0.95 },
        {
          scrollTrigger: { trigger: ".experience-section", start: "top 85%" },
          y: 0, opacity: 1, scale: 1,
          duration: 0.8, stagger: 0.12, ease: "power3.out",
        }
      );

      requestAnimationFrame(() => {
        requestAnimationFrame(() => ScrollTrigger.refresh(true));
      });

      return () => {
        splitInstances.forEach((s) => s.revert());
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="experience"
      className="experience-section relative z-[2] px-6 py-28 md:px-12"
    >
      {/* ... section content ... */}
    </section>
  );
}
```

### Pattern 2: useGSAP Scoped Container
**What:** The `useGSAP` hook's `scope` option limits GSAP selector queries to within the component's container ref. This is what ensures animation isolation between sections.
**When to use:** Every section's useGSAP call.
**Critical detail:** When `{ scope: containerRef }` is set, GSAP's selector engine (used by `.fromTo(".class-name", ...)`) automatically scopes queries to `containerRef.current.querySelectorAll(".class-name")`. This means:
- Class names can safely overlap between sections (they won't in practice due to BEM naming)
- Animations in one section cannot accidentally target elements in another
- Hot-reloading a section only re-runs that section's useGSAP cleanup/setup

### Pattern 3: SplitText Cleanup
**What:** Track all SplitText instances in an array and revert them in the useGSAP cleanup return.
**When to use:** HeroSection (char split on name) and Experience, Skills, Projects, Contact (word split on NeoBrutalHeading).
**Note:** About section uses a manual heading (not NeoBrutalHeading), so it does NOT need SplitText word-split -- but it does have its own heading animation via `.about-section__heading`.

### Pattern 4: Gradient Animation in page.tsx
**What:** The gradient background animation (CSS custom properties tween + MutationObserver for theme changes) stays in page.tsx as it wraps all sections.
**When to use:** Only in page.tsx.
**What moves:** The `startGradientAnimation` callback, `gradientTweenRef`, and the `useEffect` with MutationObserver all stay in page.tsx. page.tsx becomes a `"use client"` component.

### Anti-Patterns to Avoid
- **Passing animation refs as props:** Each section owns its own animation logic. No prop drilling of refs or animation state.
- **Shared useGSAP context:** Do NOT create a shared animation context or provider. Each section is independent.
- **Class-string GSAP selectors without scope:** Never use `gsap.to(".my-class", ...)` outside a scoped `useGSAP`. The `{ scope: containerRef }` option is mandatory.
- **Using `document.querySelector` for GSAP targets in sections:** The scoped useGSAP handles this automatically. Exception: `scrollToAbout` in HeroSection and project detail expand in ProjectsSection (both are event-handler-driven, not useGSAP-scoped).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| GSAP React lifecycle | Manual useEffect + cleanup | `useGSAP` from `@gsap/react` | Handles cleanup, prevents memory leaks, supports scope |
| Scroll trigger management | Manual IntersectionObserver | `ScrollTrigger` plugin | Already integrated, handles resize/refresh automatically |
| Text splitting | Manual DOM manipulation | `SplitText` GSAP plugin | Handles revert, works with GSAP timelines |
| Animation scoping | Manual querySelectorAll | `useGSAP({ scope: containerRef })` | Automatic selector scoping within container |

## Common Pitfalls

### Pitfall 1: ScrollTrigger.refresh() Timing
**What goes wrong:** ScrollTrigger calculates trigger positions based on element positions at setup time. If elements haven't painted yet (React hydration), triggers fire at wrong scroll positions or not at all.
**Why it happens:** React renders to DOM but the browser hasn't painted yet when useGSAP runs.
**How to avoid:** Each section should call `requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh(true)))` at the end of its useGSAP callback. The double-rAF ensures paint has occurred.
**Warning signs:** Animations triggering too early, too late, or not at all on initial page load.

### Pitfall 2: SplitText Gradient Re-application (Hero Only)
**What goes wrong:** SplitText wraps each character in a `<div>`. The parent `<span>` that had `background: linear-gradient(...)` + `background-clip: text` loses its gradient because the text is now in child elements.
**Why it happens:** CSS `background-clip: text` only clips to the element's own text content, not child elements' text.
**How to avoid:** After SplitText splits, re-apply the gradient CSS to each generated char `<div>`. This is already done in the current code (lines 161-168 of Exploration6.tsx) -- must be preserved exactly in HeroSection.
**Warning signs:** Hero name text appears as solid color instead of gradient after split.

### Pitfall 3: SplitText Class Selector After BEM Rename
**What goes wrong:** The current code uses `new SplitText(".e6-hero-name", { type: "chars" })` with a string selector. After renaming to `.hero-section__name`, the SplitText call must use the new selector.
**Why it happens:** Easy to rename the className in JSX but forget to update the corresponding GSAP/SplitText selector strings.
**How to avoid:** When renaming a class, search for ALL occurrences: (1) JSX className, (2) GSAP selector strings in `.to()/.fromTo()/.set()`, (3) SplitText constructor, (4) `containerRef.current?.querySelector()` calls. Since there are no CSS definitions for e6-* classes, that dimension is safe.
**Warning signs:** Animations don't play, SplitText doesn't split, no error in console (just silently fails to find elements).

### Pitfall 4: Project Card Expand Detail Selector
**What goes wrong:** The project card expand/collapse uses dynamic class selectors: `.e6-project-detail-${index}`. These are constructed at runtime via `document.querySelector()`.
**Why it happens:** The GSAP animation for expand/collapse targets elements by dynamically generated class names.
**How to avoid:** In ProjectsSection, keep using `document.querySelector()` for this specific case (it's outside useGSAP scope, called from an event handler). Rename to `.projects-section__detail-${index}`. Alternatively, use refs for each detail element (array of refs), which is more React-idiomatic, but the current pattern works and the user wants minimal behavioral change.
**Warning signs:** Clicking a project card does nothing (expand/collapse fails silently).

### Pitfall 5: Hero scrollToAbout Function
**What goes wrong:** The `scrollToAbout` function uses `document.getElementById("about")` to scroll to the About section. This crosses section boundaries by design.
**Why it happens:** It's a navigation action, not an animation scope concern.
**How to avoid:** Keep `scrollToAbout` in HeroSection using `document.getElementById("about")`. This is correct -- it needs to reach outside its own scope. Do NOT try to scope this with containerRef.
**Warning signs:** "See my work" CTA button doesn't scroll anywhere.

### Pitfall 6: NeoBrutalHeading Word-Split Fragmentation (RESOLVED)
**What goes wrong:** The current code has a centralized loop (lines 200-216) that finds ALL `.e6-split-heading` elements and applies word-split animation with ScrollTrigger. After extraction, this central loop disappears.
**Why it happens:** `NeoBrutalHeading` component (line 18 of NeoBrutalHeading.tsx) hardcodes `e6-split-heading` as a CSS class. The centralized loop in Exploration6.tsx then animates all instances. After extraction, each section must replicate this.
**Confirmed:** NeoBrutalHeading adds the class. Sections using it: Experience, Skills, Projects, Contact. About section uses a manual heading (NOT NeoBrutalHeading).
**How to avoid:** (1) Rename `e6-split-heading` to `split-heading` in NeoBrutalHeading.tsx. (2) Each section that renders NeoBrutalHeading must include the word-split SplitText animation in its useGSAP hook, querying `.split-heading` within its containerRef scope.

### Pitfall 7: NeoBrutalHeading Class Rename Is Cross-Cutting
**What goes wrong:** `e6-split-heading` lives in the shared `NeoBrutalHeading` UI component, not in Exploration6.tsx. Renaming it must happen in NeoBrutalHeading.tsx AND in every section's useGSAP that queries it.
**Why it happens:** It's the only `e6-*` class that lives in a shared UI component rather than the monolith.
**How to avoid:** Rename `e6-split-heading` to `split-heading` in NeoBrutalHeading.tsx early (first task). All new section components then use `.split-heading` from the start.

## Code Examples

### page.tsx After Extraction
```typescript
"use client";

import { useRef, useCallback, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { FloatingNav } from "@/components/sections/FloatingNav";

export default function HomePage() {
  const gradientTweenRef = useRef<gsap.core.Tween | null>(null);

  const startGradientAnimation = useCallback(() => {
    if (gradientTweenRef.current) gradientTweenRef.current.kill();
    const isDark = document.documentElement.classList.contains("dark");
    const root = document.documentElement;
    const startBase = isDark ? "#1a1520" : "#e8ddd5";
    const endBase = isDark ? "#1e2030" : "#cdd0e5";
    const startTarget = isDark ? "#1e1828" : "#eddcd2";
    const endTarget = isDark ? "#222438" : "#d5cbe8";
    root.style.setProperty("--bg-gradient-start", startBase);
    root.style.setProperty("--bg-gradient-end", endBase);
    gradientTweenRef.current = gsap.to(root, {
      "--bg-gradient-start": startTarget,
      "--bg-gradient-end": endTarget,
      duration: 25, ease: "sine.inOut", yoyo: true, repeat: -1,
    });
  }, []);

  useEffect(() => {
    startGradientAnimation();
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          requestAnimationFrame(() => startGradientAnimation());
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      observer.disconnect();
      if (gradientTweenRef.current) gradientTweenRef.current.kill();
    };
  }, [startGradientAnimation]);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--bg-gradient-start) 0%, color-mix(in srgb, var(--bg-gradient-start) 60%, var(--bg-gradient-end)) 30%, color-mix(in srgb, var(--bg-gradient-end) 70%, var(--bg-gradient-start)) 60%, var(--bg-gradient-end) 100%)",
        fontFamily: "var(--font-body, 'Inter', system-ui, sans-serif)",
        transition: "background 0.35s ease",
      }}
    >
      <FloatingNav />
      <svg className="absolute h-0 w-0">
        <filter id="glass-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{ filter: "url(#glass-noise)", opacity: 0.06 }}
      />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}
```

### BEM Class Name Mapping
Complete mapping of all `e6-*` classes to new BEM names:

| Current (e6-*) | New (BEM) | Location |
|-----------------|-----------|----------|
| `e6-hero-emoji` | `hero-section__emoji` | HeroSection JSX + GSAP selector |
| `e6-hero-glass` | `hero-section__glass` | HeroSection JSX + GSAP selector |
| `e6-hero-greeting` | `hero-section__greeting` | HeroSection JSX + GSAP selector |
| `e6-hero-name` | `hero-section__name` | HeroSection JSX + GSAP + SplitText selector |
| `e6-hero-name-gradient` | `hero-section__name-gradient` | HeroSection JSX + querySelector |
| `e6-hero-tagline` | `hero-section__tagline` | HeroSection JSX + GSAP selector |
| `e6-hero-cta` | `hero-section__cta` | HeroSection JSX + GSAP selector |
| `e6-about-section` | `about-section` | AboutSection JSX + ScrollTrigger trigger |
| `e6-about-heading` | `about-section__heading` | AboutSection JSX + GSAP selector |
| `e6-about-panel` | `about-section__panel` | AboutSection JSX + GSAP selector |
| `e6-experience-section` | `experience-section` | ExperienceSection JSX + ScrollTrigger trigger |
| `e6-experience-card` | `experience-section__card` | ExperienceSection JSX + GSAP selector |
| `e6-skills-section` | `skills-section` | SkillsSection JSX + ScrollTrigger trigger |
| `e6-skill-category` | `skills-section__category` | SkillsSection JSX + GSAP selector |
| `e6-projects-section` | `projects-section` | ProjectsSection JSX + ScrollTrigger trigger |
| `e6-projects-heading` | `projects-section__heading` | ProjectsSection JSX + GSAP selector |
| `e6-project-card` | `projects-section__card` | ProjectsSection JSX + GSAP selector |
| `e6-project-detail-${i}` | `projects-section__detail-${i}` | ProjectsSection JSX + document.querySelector |
| `e6-contact-section` | `contact-section` | ContactSection JSX + ScrollTrigger trigger |
| `e6-contact-card` | `contact-section__card` | ContactSection JSX + GSAP selector |
| `e6-split-heading` | `split-heading` | NeoBrutalHeading.tsx (shared UI component) |

**Key findings:**
1. NONE of these classes have CSS definitions in globals.css. They are purely GSAP selectors and JSX className identifiers. The rename is TSX-only.
2. `e6-split-heading` is the only `e6-*` class in a shared UI component (NeoBrutalHeading.tsx). All others are local to Exploration6.tsx.

### Section-to-Animation Mapping
Which animations belong to which section component:

| Section | Entrance Animations | SplitText | Special |
|---------|--------------------:|:---------:|:--------|
| **HeroSection** | emoji (scale+rotate), glass (scale+opacity+y), greeting (y+opacity), name chars (y+opacity stagger), tagline (y+opacity), CTA (scale+rotate+opacity) | char split on name, gradient re-apply | `scrollToAbout` function, hero timeline with delays |
| **AboutSection** | heading (y+opacity), panels (scale+opacity+y stagger) | none (manual heading, not NeoBrutalHeading) | -- |
| **ExperienceSection** | cards (y+opacity+scale stagger) | word split via NeoBrutalHeading | -- |
| **SkillsSection** | categories (y+opacity stagger) | word split via NeoBrutalHeading | -- |
| **ProjectsSection** | heading (x+opacity), cards (y+opacity+scale stagger) | word split via NeoBrutalHeading | `toggleProject` expand/collapse with useState |
| **ContactSection** | cards (y+opacity stagger) | word split via NeoBrutalHeading | Resume download button |

### Data Import Mapping
Which data each section imports from `@/data/content`:

| Section | Imports |
|---------|---------|
| HeroSection | `heroContent` |
| AboutSection | `aboutPanels` |
| ExperienceSection | `experiences` |
| SkillsSection | `skillCategories` |
| ProjectsSection | `projects` |
| ContactSection | `contactLinks` |

### UI Component Usage Mapping
Which shared UI components each section uses:

| Section | GlassPanel | NeoBrutalButton | NeoBrutalHeading | NeoBrutalTag |
|---------|:----------:|:---------------:|:----------------:|:------------:|
| HeroSection | yes | yes | no | no |
| AboutSection | yes | no | no | no |
| ExperienceSection | yes | no | yes | no |
| SkillsSection | yes | no | yes | yes |
| ProjectsSection | yes | yes | yes | yes |
| ContactSection | yes | yes | yes | no |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `useEffect` + manual GSAP cleanup | `useGSAP` hook from `@gsap/react` | @gsap/react 2.0 (2024) | Automatic cleanup, scope support, prevents memory leaks |
| Global GSAP selectors | `useGSAP({ scope: ref })` | @gsap/react 2.0 | Selectors auto-scoped to container, enables component isolation |
| Manual ScrollTrigger.kill() | useGSAP auto-cleanup | @gsap/react 2.0 | ScrollTriggers cleaned up with component unmount |

## Open Questions

1. **ScrollTrigger.refresh() per section vs once**
   - What we know: Currently called once at the end of the single useGSAP. After extraction, each section calls it independently.
   - What's unclear: Whether 6 separate `ScrollTrigger.refresh(true)` calls cause performance issues or visual jank.
   - Recommendation: Likely fine -- ScrollTrigger.refresh() is debounced internally. If issues arise, remove per-section refresh calls and add a single refresh in page.tsx via useEffect.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed |
| Config file | none -- see Wave 0 |
| Quick run command | `npm run build` (type-check + build) |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CLEAN-02a | Exploration6.tsx deleted | smoke | `test ! -f src/components/explorations/Exploration6.tsx` | N/A -- shell check |
| CLEAN-02b | 6 section components exist | smoke | `ls src/components/sections/{Hero,About,Experience,Skills,Projects,Contact}Section.tsx` | N/A -- shell check |
| CLEAN-02c | page.tsx imports 6 sections | smoke | `grep -c "Section" src/app/page.tsx` (expect 6+) | N/A -- shell check |
| CLEAN-02d | Build succeeds (no broken imports) | build | `npm run build` | N/A |
| CLEAN-02e | No e6-* classes remain | smoke | `grep -r "e6-" src/ --include="*.tsx" --include="*.css"` (expect 0) | N/A -- shell check |
| CLEAN-02f | Animations work identically | manual-only | Visual inspection in browser -- scroll through all sections | Manual -- no browser testing framework installed |
| CLEAN-02g | Hot-reload isolation | manual-only | Edit one section, verify others don't break | Manual -- requires dev server |

### Sampling Rate
- **Per task commit:** `npm run build`
- **Per wave merge:** `npm run build && npm run lint`
- **Phase gate:** Build green + manual visual verification + no e6-* remnants

### Wave 0 Gaps
- No test framework installed -- validation relies on build checks and shell commands
- No E2E framework for automated visual/animation testing
- Manual browser verification required for animation fidelity (CLEAN-02f, CLEAN-02g)

## Sources

### Primary (HIGH confidence)
- Direct source code analysis: `src/components/explorations/Exploration6.tsx` (787 lines, full read)
- Direct source code analysis: `src/components/ui/NeoBrutalHeading.tsx` (confirmed `e6-split-heading` class on line 18)
- Direct source code analysis: `src/app/page.tsx`, `src/lib/gsap.ts`, `src/data/content.ts`
- Direct source code analysis: `src/app/globals.css` (confirmed no e6-* CSS definitions, 57 lines total)
- Grep verification: zero `e6-` matches in globals.css
- CONTEXT.md user decisions (locked implementation choices)

### Secondary (MEDIUM confidence)
- GSAP `useGSAP` scope behavior based on @gsap/react documented patterns
- ScrollTrigger.refresh() debouncing behavior from GSAP documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries, pure refactor within existing stack
- Architecture: HIGH -- extraction pattern is well-defined, all source code analyzed line-by-line
- Pitfalls: HIGH -- identified from direct code analysis, NeoBrutalHeading confirmed
- BEM mapping: HIGH -- exhaustive grep of all e6-* usage across entire src/

**Research date:** 2026-03-07
**Valid until:** 2026-04-07 (stable -- no external dependencies changing)
