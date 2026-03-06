# Phase 3: Interactivity and Visual Effects - Research

**Researched:** 2026-03-06
**Domain:** GSAP animations, custom cursor, dark mode, micro-interactions, visual textures
**Confidence:** HIGH

## Summary

Phase 3 layers interactivity and visual polish onto the existing Phase 2 content sections. The core animation engine (GSAP 3.14 with ScrollTrigger) is already established and working. The phase introduces five distinct feature areas: (1) scroll-triggered section reveals (polish of existing), (2) custom cursor with magnetic effect, (3) hover micro-interactions on buttons/cards/tags, (4) text reveal animations using GSAP SplitText, and (5) dark mode with noise texture and gradient animation.

All required tools are already available in the installed `gsap@3.14.2` package -- including SplitText, which is now free and ships with the standard npm package (verified: `node_modules/gsap/SplitText.js` exists). Tailwind CSS v4.2 handles dark mode via `@custom-variant` CSS directive rather than the old `tailwind.config.js` approach. No new dependencies are needed.

**Primary recommendation:** Build each feature as an isolated client component (CustomCursor, DarkModeProvider, text reveal wrapper) that plugs into the existing Exploration6 page. Use GSAP for all motion (cursor, text reveals, micro-interactions) and CSS transitions for dark mode color swaps. Register SplitText in the existing `src/lib/gsap.ts` barrel.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Custom cursor: Dot follower style -- small circle that follows the mouse with slight lag/easing. Magnetic pull effect near interactive elements (buttons, links, cards) within ~50px radius. On hover: dot grows and shifts to an accent color (#c9a4b2 or #a78bcd). No trailing/afterimage effect -- clean single dot. Disabled entirely on touch devices.
- Dark mode: Deep warm dark background gradient (#1a1520 -> #1e2030). Glass panels get brighter fill in dark mode (rgba(255,255,255,0.12)). Smooth crossfade CSS transition (~300-400ms ease). System preference detection via prefers-color-scheme. Persisted in localStorage. Text colors invert to light values.
- Micro-interactions: Buttons lift up (~2px translateY) with neobrutalist offset shadow growing on hover. Glass panel cards: 3D tilt effect (perspective + rotateX/Y) following cursor position. Neobrutalist tags: slight rotation wiggle + scale pop on hover. Body text links: animated underline drawing in from left. All hover effects desktop-only; touch devices get tap feedback.
- Text reveal: Section headings word-by-word slide-up + fade-in with stagger on scroll trigger. Uses GSAP SplitText plugin or manual span wrapping.
- Noise/grain texture: Subtle page-level noise overlay at 5-8% opacity on background.
- Gradient animation: Background gradient endpoints shift slowly (20-30 second cycle) between warm tones. Same behavior in dark mode with dark palette.

### Claude's Discretion
- Dark mode toggle placement (floating nav, fixed corner, or both)
- Hero text reveal approach (character split vs word-by-word)
- Exact accent color choice for cursor hover state
- Exact gradient drift color range and easing
- Animation timing and easing curves for all effects
- Scroll-triggered section reveal refinement (already exists from Phase 2, may need polish)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ANIM-01 | Scroll-triggered section reveal animations using GSAP ScrollTrigger | Already implemented in Phase 2 using gsap.fromTo() + ScrollTrigger. Phase 3 polishes timing/easing and adds heading text reveals. |
| ANIM-02 | Custom cursor effects on desktop (magnetic near interactive elements, disabled on touch devices) | gsap.quickTo() for smooth cursor follow, gsap.to() for magnetic pull calculations. Touch detection via matchMedia or ontouchstart check. |
| ANIM-03 | Hover micro-interactions on buttons, links, and cards (scale, rotation, morphs) | GSAP for card tilt (mousemove listener + perspective transform), CSS transitions for button lift/shadow, CSS pseudo-element for link underline. |
| ANIM-04 | Text reveal animations with character/word split on headings (GSAP SplitText) | SplitText available at gsap/SplitText, register in lib/gsap.ts. Split type: "words" for headings, optionally "chars" for hero. |
| DSGN-03 | Dark mode with system preference detection and animated toggle, persisted in localStorage | Tailwind v4 @custom-variant dark directive + .dark class on html element. Script in layout.tsx head to prevent flash. |
| DSGN-04 | Noise/grain texture overlay for visual depth | SVG feTurbulence filter (already used at 3% on glass panels). Add page-level overlay at 5-8% opacity using same technique. |
| DSGN-05 | Gradient animations or dynamic color shifts | GSAP timeline animating CSS custom properties for gradient colors on a 20-30s cycle. |

</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gsap | 3.14.2 | All animations (cursor, text reveals, scroll triggers, gradient) | Already the single animation engine per project decisions |
| gsap/SplitText | 3.14.2 | Text splitting for word/char reveal animations | Included free in gsap package, no extra install needed |
| gsap/ScrollTrigger | 3.14.2 | Scroll-based animation triggers | Already registered and in use |
| @gsap/react | 2.1.2 | useGSAP hook for React lifecycle integration | Already registered and in use |
| tailwindcss | 4.2.1 | Dark mode variant via @custom-variant | Already installed, CSS-first config |
| lenis | 1.3.18 | Smooth scrolling | Already configured via SmoothScrollProvider |

### Supporting (no new installs)
No new packages required. All features are implementable with the existing stack.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GSAP SplitText | Manual span wrapping | SplitText handles line detection, resize revert, and accessibility -- manual wrapping misses these |
| GSAP quickTo for cursor | CSS transform + transition | CSS can't do magnetic pull calculations; GSAP quickTo is purpose-built for high-frequency updates |
| Tailwind dark: variant | CSS custom properties only | Tailwind dark: gives component-level control and is already in the stack |

**Installation:**
```bash
# No new installs needed -- all tools are in gsap@3.14.2
```

## Architecture Patterns

### New Components Needed
```
src/
├── lib/
│   └── gsap.ts                    # ADD: SplitText registration
├── components/
│   ├── cursor/
│   │   └── CustomCursor.tsx       # NEW: client component, cursor dot + magnetic logic
│   ├── providers/
│   │   ├── SmoothScroll.tsx       # EXISTS
│   │   └── DarkModeProvider.tsx   # NEW: client component, theme context + toggle
│   ├── ui/
│   │   ├── GlassPanel.tsx         # MODIFY: dark mode variant styles
│   │   ├── NeoBrutalButton.tsx    # MODIFY: enhanced hover with GSAP or CSS
│   │   ├── NeoBrutalTag.tsx       # MODIFY: wiggle + pop hover
│   │   ├── NeoBrutalHeading.tsx   # MODIFY: text reveal wrapper integration
│   │   └── DarkModeToggle.tsx     # NEW: toggle button UI
│   └── sections/
│       └── FloatingNav.tsx        # MODIFY: add dark mode toggle slot
├── app/
│   ├── layout.tsx                 # MODIFY: add DarkModeProvider + CustomCursor + dark mode script
│   └── globals.css                # MODIFY: add @custom-variant dark, noise overlay, gradient animation
└── components/explorations/
    └── Exploration6.tsx           # MODIFY: page-level noise overlay, gradient animation, text reveals
```

### Pattern 1: Dark Mode with Flash Prevention
**What:** Class-based dark mode using Tailwind v4 `@custom-variant` with inline script to prevent flash of wrong theme (FOUC).
**When to use:** Any server-rendered app with theme toggle.
**Example:**
```typescript
// globals.css -- Tailwind v4 dark mode setup
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

// layout.tsx -- inline script BEFORE body renders to prevent flash
<html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
  <head>
    <script dangerouslySetInnerHTML={{ __html: `
      (function() {
        var theme = localStorage.getItem('theme');
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        }
      })();
    `}} />
  </head>
  <body>...</body>
</html>

// DarkModeProvider.tsx -- React context for toggle
"use client";
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({ isDark: false, toggle: () => {} });

export function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return <ThemeContext.Provider value={{ isDark, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
```

### Pattern 2: Custom Cursor with gsap.quickTo()
**What:** High-performance cursor follower using GSAP's optimized quickTo method.
**When to use:** Custom cursor that tracks mouse position at 60fps.
**Example:**
```typescript
// Source: gsap.com/docs/v3/GSAP/gsap.quickTo()
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const cursor = cursorRef.current!;
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3.out" });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
      style={{
        width: 12, height: 12, borderRadius: "50%",
        background: "#3d3248", transform: "translate(-50%, -50%)",
        transition: "width 0.2s, height 0.2s, background 0.2s",
      }}
    />
  );
}
```

### Pattern 3: Magnetic Pull Effect
**What:** Elements attract the cursor when within a radius, creating a "sticky" feel.
**When to use:** Interactive elements (buttons, links, cards) on desktop.
**Example:**
```typescript
// Magnetic effect on interactive elements
const handleMagneticMove = (e: MouseEvent, element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const distX = e.clientX - centerX;
  const distY = e.clientY - centerY;
  const distance = Math.sqrt(distX * distX + distY * distY);
  const radius = 50; // ~50px magnetic radius

  if (distance < radius) {
    const pull = 1 - (distance / radius); // 0 at edge, 1 at center
    gsap.to(element, {
      x: distX * pull * 0.3,
      y: distY * pull * 0.3,
      duration: 0.3,
      ease: "power2.out",
    });
  }
};

// Reset on mouse leave
const handleMagneticLeave = (element: HTMLElement) => {
  gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
};
```

### Pattern 4: SplitText Word Reveal on Scroll
**What:** Split heading text into words, animate each with stagger on scroll trigger.
**When to use:** Section headings entering viewport.
**Example:**
```typescript
// Register in lib/gsap.ts
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, useGSAP, SplitText);

// In component
useGSAP(() => {
  const headings = gsap.utils.toArray(".e6-split-heading");
  headings.forEach((heading) => {
    const split = new SplitText(heading, { type: "words" });
    gsap.fromTo(split.words,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: heading, start: "top 85%" },
      }
    );
  });
}, { scope: containerRef });
```

### Pattern 5: 3D Card Tilt Effect
**What:** Cards tilt toward cursor position using perspective transform.
**When to use:** Glass panel project cards on hover.
**Example:**
```typescript
const handleTilt = (e: MouseEvent, card: HTMLElement) => {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((y - centerY) / centerY) * -8; // max 8deg
  const rotateY = ((x - centerX) / centerX) * 8;

  gsap.to(card, {
    rotateX, rotateY,
    duration: 0.4,
    ease: "power2.out",
    transformPerspective: 800,
  });
};

const handleTiltLeave = (card: HTMLElement) => {
  gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
};
```

### Anti-Patterns to Avoid
- **Using CSS `cursor: none` globally:** Breaks accessibility and confuses users. Instead, hide default cursor only when custom cursor is visible on desktop, and never on touch devices.
- **Animating dark mode with GSAP:** CSS transitions handle color crossfades more efficiently. Use GSAP only for motion-based animations (position, scale, rotation), not color swaps.
- **SplitText on server render:** SplitText manipulates DOM directly. It must run in useGSAP/useEffect on the client. Attempting server-side split will cause hydration mismatch.
- **gsap.from() with ScrollTrigger:** Already learned in Phase 2 -- always use gsap.fromTo() to prevent invisible elements when trigger position is miscalculated on first load.
- **Attaching mousemove listeners without cleanup:** Every mousemove listener must be removed on component unmount. useGSAP handles GSAP cleanup automatically, but raw event listeners need manual cleanup in useEffect return.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Text splitting into words/chars | Manual span wrapping with string.split() | GSAP SplitText | SplitText handles line detection, screen-reader accessibility, resize revert, and nested elements. Manual splitting breaks on line wraps and misses edge cases. |
| High-frequency cursor position updates | gsap.to() in every mousemove | gsap.quickTo() | quickTo is specifically optimized for repeated single-value updates. Calling gsap.to() 60x/sec creates tween overhead. |
| Dark mode flash prevention | useEffect-based theme check | Inline `<script>` in `<head>` | useEffect runs after paint, causing a visible flash. Inline script blocks render and applies class before first paint. |
| Touch device detection | User agent string parsing | `'ontouchstart' in window` + `matchMedia('(pointer: coarse)')` | UA parsing is unreliable and breaks on hybrid devices. Feature detection is accurate. |

**Key insight:** The GSAP ecosystem already solves cursor performance (quickTo), text splitting (SplitText), and scroll-triggered animation (ScrollTrigger). The only custom code needed is the wiring: event listeners, dark mode state management, and component integration.

## Common Pitfalls

### Pitfall 1: Dark Mode Flash of Unstyled Content (FOUC)
**What goes wrong:** Page renders in light mode for a frame before JavaScript applies dark class.
**Why it happens:** React hydration and useEffect run after initial paint. localStorage check happens too late.
**How to avoid:** Add inline `<script>` tag in `<head>` (via dangerouslySetInnerHTML in layout.tsx) that reads localStorage and adds `.dark` class to `<html>` before body renders.
**Warning signs:** Brief white flash when loading page in dark mode.

### Pitfall 2: SplitText Hydration Mismatch
**What goes wrong:** Next.js throws hydration error because SplitText modifies DOM structure.
**Why it happens:** Server renders "Hello World" as text node; client splits into `<div class="word">Hello</div> <div class="word">World</div>`.
**How to avoid:** Only run SplitText inside useGSAP or useEffect (client-only). The heading renders normally on server, then SplitText wraps words client-side. The brief unsplit state is invisible because the animation starts from opacity: 0.
**Warning signs:** React hydration warnings in console mentioning text content mismatch.

### Pitfall 3: Custom Cursor Visible on Touch Devices
**What goes wrong:** A stuck cursor dot appears at (0,0) on mobile/tablet or follows erratic touch positions.
**Why it happens:** Touch events fire mousemove-like events on some browsers, and there's no mouse position on initial load.
**How to avoid:** Check `'ontouchstart' in window || navigator.maxTouchPoints > 0` before initializing cursor. Additionally use CSS `hidden md:block` to hide the cursor element on mobile breakpoints as a visual safeguard.
**Warning signs:** Circle stuck in top-left corner on mobile; cursor appearing during scroll on iPad.

### Pitfall 4: Magnetic Effect Jank on Rapid Mouse Movement
**What goes wrong:** Elements snap or jump when cursor enters/leaves magnetic radius quickly.
**Why it happens:** Competing tweens from rapid enter/leave events.
**How to avoid:** Use `overwrite: true` on magnetic gsap.to() calls so new tweens kill in-progress ones. Use elastic ease on leave to create smooth snap-back.
**Warning signs:** Elements vibrating or getting stuck in offset position.

### Pitfall 5: Gradient Animation Performance
**What goes wrong:** Animating `background` property causes full repaint on every frame.
**Why it happens:** `background` and `background-image` are not GPU-compositable properties.
**How to avoid:** Animate CSS custom properties (e.g., `--grad-start`, `--grad-end`) with GSAP and reference them in the gradient. Or use two overlapping gradient layers and crossfade opacity between them. The 20-30s cycle is slow enough that repaints are negligible, but the custom property approach is cleaner.
**Warning signs:** Dropped frames during gradient animation on lower-end devices.

### Pitfall 6: GlassPanel Style Conflicts in Dark Mode
**What goes wrong:** Hardcoded inline styles (background rgba values, border colors) override dark mode Tailwind classes.
**Why it happens:** GlassPanel uses inline styles which have highest CSS specificity. Tailwind dark: classes can't override them.
**How to avoid:** Convert GlassPanel's theme-sensitive styles to CSS custom properties (e.g., `--glass-fill`, `--glass-border`) set in globals.css with light/dark values. The component references these properties in its inline styles.
**Warning signs:** Glass panels look identical in light and dark mode despite adding dark: classes.

## Code Examples

### globals.css Dark Mode + Noise Overlay Setup
```css
@import "tailwindcss";

/* Tailwind v4: class-based dark mode */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-display: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --color-surface: oklch(0.98 0 0);
  --color-text: oklch(0.15 0 0);
  --color-primary-500: oklch(0.65 0.2 250);
  --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
}

/* Theme-aware CSS custom properties for components using inline styles */
:root {
  --glass-fill: rgba(255, 255, 255, 0.08);
  --glass-fill-end: rgba(255, 255, 255, 0.03);
  --glass-border: #3d3248;
  --glass-specular-top: rgba(255, 255, 255, 0.7);
  --text-primary: #3d3248;
  --text-body: #5a4d66;
  --text-secondary: #8a7d96;
  --bg-gradient-start: #e8ddd5;
  --bg-gradient-end: #cdd0e5;
}

.dark {
  --glass-fill: rgba(255, 255, 255, 0.12);
  --glass-fill-end: rgba(255, 255, 255, 0.06);
  --glass-border: #3d3248;
  --glass-specular-top: rgba(255, 255, 255, 0.4);
  --text-primary: #e8ddd5;
  --text-body: #c4b8d0;
  --text-secondary: #9a8daa;
  --bg-gradient-start: #1a1520;
  --bg-gradient-end: #1e2030;
}

/* Smooth theme transitions */
html {
  transition: background-color 0.35s ease, color 0.35s ease;
}

/* Hide default cursor when custom cursor is active (desktop only) */
@media (pointer: fine) {
  * { cursor: none !important; }
}

body {
  background: var(--color-surface);
  color: var(--color-text);
}
```

### Page-Level Noise Overlay
```tsx
{/* Page-level noise texture overlay -- 5-8% opacity */}
<div
  className="pointer-events-none fixed inset-0 z-[1]"
  style={{
    filter: "url(#glass-noise)",
    background: "transparent",
    opacity: 0.06,
  }}
/>
```

### Gradient Animation with GSAP + CSS Custom Properties
```typescript
// Animate gradient color endpoints on a slow cycle
useGSAP(() => {
  const root = document.documentElement;

  // Light mode gradient targets
  const lightColors = {
    startA: "#e8ddd5", startB: "#eddcd2",
    endA: "#cdd0e5", endB: "#d5cbe8",
  };

  gsap.to(root, {
    "--bg-gradient-start": lightColors.startB,
    "--bg-gradient-end": lightColors.endB,
    duration: 25,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });
}, { scope: containerRef });
```

### Touch Device Detection
```typescript
function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| GSAP SplitText paid only | SplitText free in gsap npm | 2025 (Webflow acquisition) | No license needed, import from gsap/SplitText |
| tailwind.config.js darkMode: "class" | @custom-variant dark in CSS | Tailwind v4.0 (2025) | Config-free, CSS-first dark mode setup |
| gsap.to() for cursor follow | gsap.quickTo() | GSAP 3.7+ | Purpose-built for high-frequency single-value updates |
| Manual matchMedia dark mode | prefers-color-scheme + class toggle | Standard | System preference detection is expected baseline |

**Deprecated/outdated:**
- `darkMode: "class"` in tailwind.config.js: Does not exist in Tailwind v4. Use `@custom-variant dark` in CSS.
- gsap-trial package: No longer needed. All plugins ship in the standard `gsap` npm package.

## Open Questions

1. **SplitText and NeoBrutalHeading Integration**
   - What we know: NeoBrutalHeading is currently a server component (no "use client"). SplitText requires client-side DOM access.
   - What's unclear: Whether to make NeoBrutalHeading a client component or wrap it in a separate client-side text reveal component.
   - Recommendation: Create a separate `TextReveal` client component that wraps any heading. This keeps NeoBrutalHeading server-compatible and separates animation from structure.

2. **Dark Mode Toggle Placement**
   - What we know: FloatingNav already exists on the right side, is a client component, and has a clean dot-based UI.
   - What's unclear: User left this to Claude's discretion.
   - Recommendation: Add toggle to FloatingNav as a special item (sun/moon icon) at the bottom of the dot stack. Keeps UI consolidated and avoids another fixed element.

3. **Hero Text Reveal (char vs word split)**
   - What we know: User left this to Claude's discretion. Hero name "I'm Khai Phan." is short (3 words).
   - Recommendation: Character split for the hero name specifically (premium feel on short text), word-by-word for all section headings (consistency). The hero is the first impression -- char split creates a typewriter-like reveal that feels crafted.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual browser testing (no automated test framework detected) |
| Config file | none |
| Quick run command | `npm run build && npm run dev` |
| Full suite command | `npm run build` (catches TypeScript and build errors) |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ANIM-01 | Sections reveal with scroll-triggered animations | manual | Visual inspection in browser | N/A |
| ANIM-02 | Custom cursor follows mouse, magnetic pull near interactive elements, hidden on touch | manual | Inspect on desktop + mobile emulation in DevTools | N/A |
| ANIM-03 | Buttons lift, cards tilt, tags wiggle, links underline on hover | manual | Hover each element type in desktop browser | N/A |
| ANIM-04 | Headings animate with word/char split text reveal | manual | Scroll to each section, observe heading animation | N/A |
| DSGN-03 | Dark mode toggles, detects system preference, persists in localStorage | manual | Toggle dark mode, reload page, check localStorage | N/A |
| DSGN-04 | Noise/grain texture visible on background | manual | Visual inspection -- subtle grain visible at 5-8% opacity | N/A |
| DSGN-05 | Gradient animation shifts colors on 20-30s cycle | manual | Watch background for ~30s, observe color drift | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` (catches TypeScript errors, import issues)
- **Per wave merge:** Full browser test across desktop Chrome + mobile emulation
- **Phase gate:** All 7 requirements verified visually before `/gsd:verify-work`

### Wave 0 Gaps
- None -- no automated test infrastructure exists in this project. All validation is build-check + manual browser inspection, which is appropriate for a visual/animation-heavy portfolio site.

## Sources

### Primary (HIGH confidence)
- Verified `node_modules/gsap/SplitText.js` exists in installed gsap@3.14.2 -- SplitText is available
- Verified `node_modules/gsap/package.json` -- gsap 3.14.2 with all plugins included
- Existing codebase: `src/lib/gsap.ts`, `src/components/ui/GlassPanel.tsx`, `src/components/explorations/Exploration6.tsx` -- established GSAP patterns
- Tailwind v4.2.1 installed -- verified dark mode requires @custom-variant CSS directive

### Secondary (MEDIUM confidence)
- [GSAP gsap.quickTo() docs](https://gsap.com/docs/v3/GSAP/gsap.quickTo/) -- quickTo API for cursor following
- [GSAP SplitText docs](https://gsap.com/docs/v3/Plugins/SplitText/) -- SplitText API and usage
- [Tailwind CSS Dark Mode docs](https://tailwindcss.com/docs/dark-mode) -- v4 dark mode configuration
- [GSAP matchMedia docs](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()) -- reduced motion and responsive animations
- [Tailwind v4 dark mode fix](https://www.sujalvanjare.com/blog/fix-dark-class-not-applying-tailwind-css-v4) -- @custom-variant pattern for v4

### Tertiary (LOW confidence)
- [Custom cursor with GSAP and React](https://medium.com/@amilmohd155/elevate-your-ux-build-a-smooth-custom-cursor-with-gsap-and-react-b2a1bb1c01e8) -- implementation pattern reference
- [Magnetic cursor effect](https://www.100daysofcraft.com/blog/motion-interactions/building-a-magnetic-cursor-effect) -- magnetic pull calculation approach
- [CSS grainy gradients](https://css-tricks.com/grainy-gradients/) -- feTurbulence noise texture technique

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries verified installed, SplitText confirmed available
- Architecture: HIGH - patterns extend established codebase conventions (gsap.fromTo, useGSAP, class selectors)
- Pitfalls: HIGH - dark mode FOUC, SplitText hydration, and touch device issues are well-documented in community
- Dark mode implementation: MEDIUM - Tailwind v4 @custom-variant is newer pattern, but verified via multiple sources
- Gradient animation: MEDIUM - CSS custom property animation with GSAP is standard but performance on all devices needs runtime validation

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (30 days -- stable stack, no expected breaking changes)
