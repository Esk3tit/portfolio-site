# Architecture Research

**Domain:** Creative, animation-heavy portfolio website
**Researched:** 2026-03-06
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
+------------------------------------------------------------------+
|                        App Shell (Layout)                         |
|  +------------------------------------------------------------+  |
|  |  Smooth Scroll Provider (Lenis)                             |  |
|  |  +--------------------------------------------------------+|  |
|  |  |  Animation Context Provider                             ||  |
|  |  |  (scroll progress, viewport state, reduced-motion)      ||  |
|  |  |  +----------------------------------------------------+||  |
|  |  |  |  Custom Cursor Provider                             |||  |
|  |  |  |  (cursor position, cursor variant, magnetic targets)|||  |
|  |  |  |  +------------------------------------------------+|||  |
|  |  |  |  |              Page Content                        ||||  |
|  |  |  |  |                                                  ||||  |
|  |  |  |  |  +----------+  +----------+  +----------+       ||||  |
|  |  |  |  |  | Section  |  | Section  |  | Section  |       ||||  |
|  |  |  |  |  | Hero     |  | About    |  | Work     |  ...  ||||  |
|  |  |  |  |  +----------+  +----------+  +----------+       ||||  |
|  |  |  |  |       |              |              |            ||||  |
|  |  |  |  |  +---------+   +---------+   +---------+        ||||  |
|  |  |  |  |  |Animated |   |Animated |   |Animated |        ||||  |
|  |  |  |  |  |Elements |   |Elements |   |Elements |        ||||  |
|  |  |  |  |  +---------+   +---------+   +---------+        ||||  |
|  |  |  |  +------------------------------------------------+|||  |
|  |  |  +----------------------------------------------------+||  |
|  |  +--------------------------------------------------------+|  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| App Shell / Layout | Root layout, font loading, metadata, global styles | Next.js `app/layout.tsx` |
| Smooth Scroll Provider | Smooth scroll behavior, scroll position broadcasting | Lenis wrapper context provider |
| Animation Context | Scroll progress values, viewport dimensions, prefers-reduced-motion | React Context + Framer Motion `useScroll` |
| Custom Cursor Provider | Track mouse position, manage cursor variant (default/hover/magnetic), hide on mobile | React Context + `requestAnimationFrame` lerp |
| Section Components | Each portfolio section (Hero, About, Work, Skills, Projects, Contact) | Self-contained components with own animations |
| Animated Elements | Reusable animation primitives (reveal, parallax, stagger, magnetic) | Framer Motion `motion.*` components |
| Navigation | Section anchors, scroll-to behavior, active section indicator | Fixed/absolute positioned nav with scroll spy |
| Static Assets | Resume PDF, images, fonts | Next.js `public/` directory |

## Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, providers, fonts, metadata
│   ├── page.tsx                # Single page — assembles all sections
│   └── globals.css             # CSS variables, resets, base styles
├── components/
│   ├── sections/               # Major page sections
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── WorkExperience.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   └── Contact.tsx
│   ├── ui/                     # Reusable UI primitives
│   │   ├── MagneticButton.tsx
│   │   ├── TextReveal.tsx
│   │   ├── ParallaxImage.tsx
│   │   ├── StaggerContainer.tsx
│   │   ├── SectionHeading.tsx
│   │   └── ProjectCard.tsx
│   ├── cursor/                 # Custom cursor system
│   │   ├── CustomCursor.tsx
│   │   └── CursorProvider.tsx
│   ├── navigation/             # Nav components
│   │   └── Navigation.tsx
│   └── layout/                 # Layout wrappers
│       └── SmoothScroll.tsx
├── providers/                  # Context providers
│   ├── AnimationProvider.tsx
│   └── index.tsx               # Compose all providers
├── hooks/                      # Custom hooks
│   ├── useScrollProgress.ts
│   ├── useInView.ts
│   ├── useMousePosition.ts
│   ├── useMagnetic.ts
│   ├── useReducedMotion.ts
│   └── useSectionInView.ts
├── data/                       # Content data (no CMS)
│   ├── experience.ts
│   ├── projects.ts
│   ├── skills.ts
│   └── personal.ts
├── lib/                        # Utilities
│   ├── animations.ts           # Shared animation variants/configs
│   ├── utils.ts                # General helpers (cn, lerp, clamp)
│   └── constants.ts            # Breakpoints, durations, easing curves
└── styles/                     # Additional styles if needed
    └── fonts.ts                # Font configuration
public/
├── resume/
│   └── Khai_Phan_Resume.pdf    # Git-committed, swappable
├── images/                     # Project screenshots, profile photo
└── fonts/                      # Self-hosted fonts if any
```

### Structure Rationale

- **`components/sections/`:** Each portfolio section is a self-contained component. Sections own their layout, content rendering, and section-specific animations. This is the natural decomposition for a single-page portfolio.
- **`components/ui/`:** Reusable animated primitives shared across sections. A `TextReveal` used in Hero is the same component used in About. This avoids duplicating animation logic.
- **`components/cursor/`:** Isolated because the cursor system is global, always-on, and architecturally distinct from section content. It listens to mouse events at the window level and renders a fixed-position overlay.
- **`providers/`:** Context providers are separated from components because they are infrastructure, not UI. The provider composition order matters (Lenis must wrap Animation, which must wrap Cursor).
- **`hooks/`:** Animation hooks are the glue between providers and components. Extracting them keeps components declarative and testable.
- **`data/`:** Content lives in typed TypeScript files, not a CMS. This matches the project constraint (content in code) and gives type safety. Changing a job title means editing a `.ts` file and deploying.

## Architectural Patterns

### Pattern 1: Provider Composition for Animation State

**What:** Nest context providers in a specific order so animation systems can share state without prop drilling. Lenis (scroll) wraps everything, Animation Context reads from Lenis, Cursor reads mouse events independently.

**When to use:** Any site with multiple independent animation systems that need to coexist (smooth scroll + scroll-triggered animations + cursor effects).

**Trade-offs:** Adds provider nesting depth, but eliminates prop drilling entirely. The alternative (passing scroll values as props through 6+ levels) is worse.

**Example:**
```typescript
// providers/index.tsx
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <AnimationProvider>
        <CursorProvider>
          {children}
        </CursorProvider>
      </AnimationProvider>
    </SmoothScrollProvider>
  );
}
```

### Pattern 2: Animation Variants as Data

**What:** Define animation configurations (variants) as plain objects in a shared file, then reference them declaratively in components. This separates "what animates" from "how it animates."

**When to use:** When multiple components share the same animation behavior (e.g., fade-up-on-scroll used in 10+ places).

**Trade-offs:** Slightly more indirection, but massive reduction in duplicated animation code. Also makes it trivial to adjust timing globally.

**Example:**
```typescript
// lib/animations.ts
export const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

// components/sections/About.tsx
<motion.div {...fadeUp}>
  <p>Content here</p>
</motion.div>
```

### Pattern 3: Scroll-Linked Animation with useScroll

**What:** Use Framer Motion's `useScroll` hook to get `scrollYProgress` (0 to 1) for a target element, then transform that value into animation properties. No manual scroll listeners, no `requestAnimationFrame` loops for basic cases.

**When to use:** Parallax effects, progress indicators, scroll-triggered reveals, section transitions.

**Trade-offs:** Tied to Framer Motion. For very complex timeline sequences (e.g., pinned scroll with multiple stages), GSAP ScrollTrigger is more capable. But for 90% of portfolio scroll animations, `useScroll` + `useTransform` is simpler and sufficient.

**Example:**
```typescript
const ref = useRef(null);
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"],
});
const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

return (
  <motion.div ref={ref} style={{ y }}>
    {/* parallax content */}
  </motion.div>
);
```

### Pattern 4: Magnetic Element Hook

**What:** A reusable hook that makes any element "attract" toward the cursor when hovered. Uses lerp (linear interpolation) for smooth movement and resets on mouse leave.

**When to use:** Buttons, links, nav items, social icons -- any interactive element where you want a playful, tactile feel.

**Trade-offs:** Requires `requestAnimationFrame` for smooth updates outside React's render cycle. Must be disabled on touch devices (no hover on mobile).

**Example:**
```typescript
// hooks/useMagnetic.ts
export function useMagnetic(strength = 0.3) {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    setPosition({
      x: (e.clientX - centerX) * strength,
      y: (e.clientY - centerY) * strength,
    });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return { ref, position, handleMouseMove, handleMouseLeave };
}
```

## Data Flow

### Scroll Animation Flow

```
[User Scrolls]
    |
    v
[Lenis] --> normalizes scroll --> broadcasts scroll position
    |
    v
[Framer Motion useScroll] --> reads scroll progress (0-1)
    |
    v
[useTransform] --> maps progress to CSS values (opacity, y, scale)
    |
    v
[motion.div style] --> GPU-accelerated transform applied
```

### Cursor Interaction Flow

```
[Mouse Move Event (window)]
    |
    v
[CursorProvider] --> lerp smoothing (requestAnimationFrame)
    |                       |
    v                       v
[CustomCursor.tsx]    [Cursor variant state]
(renders dot/ring)    (default | hover | magnetic | hidden)
    ^                       ^
    |                       |
[Mouse enters           [onMouseEnter on
 interactive element]    MagneticButton triggers
                         variant change]
```

### Content Data Flow

```
[data/*.ts files]
    |
    v
[Section Components] --> import typed data objects
    |
    v
[Map over data] --> render animated list items
    |
    v
[Static output] --> no runtime fetching, no loading states
```

### Key Data Flows

1. **Scroll-to-animation pipeline:** Lenis normalizes browser scroll --> Framer Motion reads position via `useScroll` --> `useTransform` maps to CSS properties --> GPU renders transforms. This entire pipeline avoids React re-renders because Framer Motion's `motionValue` system updates the DOM directly.

2. **Cursor state broadcasting:** Mouse position is tracked at the window level in `CursorProvider`. Individual interactive elements (buttons, links) communicate their hover state back up to the provider by calling `setCursorVariant('hover')` on mouse enter. The `CustomCursor` component subscribes to both position and variant to render appropriately.

3. **Section visibility detection:** Each section uses `useInView` (Framer Motion) to detect when it enters the viewport. This drives two things: (a) triggering entrance animations, and (b) updating the active section in navigation for scroll-spy behavior. The `useSectionInView` hook encapsulates this.

## Scaling Considerations

This is a personal portfolio site. Scaling to millions of users is not a concern. The relevant "scaling" is content and complexity scaling.

| Concern | Now (v1) | If Content Grows | Notes |
|---------|----------|-------------------|-------|
| Page weight | Single page, ~6 sections | Still single page | More sections = more DOM, but lazy loading handles it |
| Animation performance | Framer Motion handles all | Add GSAP only if needed | GSAP is heavier; only reach for it if Framer Motion hits limits |
| Image assets | Few project screenshots | Optimize with Next/Image | Next.js Image component handles lazy loading + format optimization |
| Bundle size | ~32KB (Framer Motion) + ~5KB (Lenis) | Stays stable | Animation libs are fixed cost, not per-section |
| Build time | Seconds | Seconds | Static site, no data fetching at build time |

### Performance Priorities

1. **First concern: animation jank on scroll.** Use `will-change: transform` sparingly, prefer `transform` and `opacity` only (GPU-composited properties), avoid animating `width`/`height`/`top`/`left`. Lenis + Framer Motion handle this well by default.
2. **Second concern: initial load.** Fonts and hero images are the bottleneck. Use `next/font` for font optimization, preload hero assets, lazy-load below-fold images.
3. **Third concern: mobile performance.** Reduce animation complexity on mobile. Disable custom cursor entirely (no hover on touch). Use `prefers-reduced-motion` to disable animations for users who request it.

## Anti-Patterns

### Anti-Pattern 1: Animating Layout Properties

**What people do:** Animate `width`, `height`, `top`, `left`, `margin`, or `padding` to create movement effects.
**Why it's wrong:** These trigger browser layout recalculation (reflow) on every frame. At 60fps, that is 16ms budget per frame spent on layout instead of rendering. Results in visible jank, especially on mobile.
**Do this instead:** Animate only `transform` (translate, scale, rotate) and `opacity`. These are GPU-composited and skip layout/paint entirely. Framer Motion does this by default when you use `x`, `y`, `scale`, `rotate` props.

### Anti-Pattern 2: Scroll Listener Soup

**What people do:** Add multiple `addEventListener('scroll', ...)` across different components, each doing their own scroll position calculations.
**Why it's wrong:** Scroll events fire at high frequency. Multiple uncoordinated listeners cause redundant calculations and can block the main thread. Also creates memory leaks if listeners aren't cleaned up.
**Do this instead:** Centralize scroll handling through Lenis (which provides a single normalized scroll stream) and Framer Motion's `useScroll` (which uses IntersectionObserver internally, not scroll events). One source of truth, zero manual cleanup.

### Anti-Pattern 3: Custom Cursor Without Mobile Guard

**What people do:** Render a custom cursor on all devices, including touch screens.
**Why it's wrong:** Touch devices have no persistent cursor. The custom cursor element sits invisible in the DOM, consuming memory and processing mouse events that never fire meaningfully. Worse, some implementations hide the native cursor via CSS, breaking touch interaction.
**Do this instead:** Detect touch/pointer capabilities and disable the custom cursor entirely on touch devices. Use `window.matchMedia('(hover: hover)')` or check `navigator.maxTouchPoints`.

### Anti-Pattern 4: Over-Animating Everything

**What people do:** Add entrance animations, hover effects, parallax, and micro-interactions to every single element on the page.
**Why it's wrong:** Creates visual noise. The user's eye has no resting point. Important content gets lost in motion. Also degrades performance as dozens of simultaneous animations compete for frame budget.
**Do this instead:** Animate strategically. Hero section gets the most motion. Section transitions get subtle reveals. Interactive elements get hover feedback. Background elements get subtle parallax. Leave body text and secondary content static.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| None | N/A | No backend, no APIs, no CMS. Fully static site. |

This is a deliberate architectural choice: no contact form backend, no analytics (v1), no CMS. Content lives in `data/*.ts` files. Resume is a static PDF. This eliminates all external dependencies and keeps deployment simple.

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Sections <-> Animation System | Framer Motion props + hooks | Sections consume `useScroll`, `useInView`, animation variants |
| Sections <-> Content Data | Direct TypeScript imports | No async, no loading states. Type-safe at compile time |
| Cursor System <-> Interactive Elements | Context callbacks (`setCursorVariant`) | Elements call up to CursorProvider on hover |
| Navigation <-> Sections | Scroll-to + section ID refs | Nav triggers `lenis.scrollTo('#section-id')`, sections expose IDs |
| Smooth Scroll <-> Animations | Lenis scroll position feeds Framer Motion | Lenis normalizes, Framer Motion consumes |

## Build Order (Dependencies)

The following build order respects component dependencies:

### Phase 1: Foundation
1. **Next.js App Shell** -- layout, metadata, fonts, global styles
2. **Smooth Scroll Provider** (Lenis) -- needed before any scroll-based animations
3. **Animation utilities** (`lib/animations.ts`, shared variants, hooks)
4. **Content data files** (`data/*.ts`) -- typed content ready for sections

### Phase 2: Core Sections (static content, basic animations)
5. **Hero section** -- first impression, most animation-heavy
6. **About section** -- straightforward content
7. **Work Experience section** -- list/timeline rendering
8. **Skills section** -- visual display of tech stack
9. **Projects section** -- cards with links
10. **Contact section** -- links to email/LinkedIn/GitHub, resume download

### Phase 3: Interactivity Layer
11. **Custom Cursor system** (Provider + Component) -- depends on all sections existing to have hover targets
12. **Magnetic button effects** -- applied to interactive elements across sections
13. **Navigation** with scroll-spy -- depends on all sections having IDs
14. **Scroll-triggered entrance animations** -- polish pass across all sections

### Phase 4: Polish
15. **Responsive adjustments** -- mobile layouts, disabled cursor, reduced animations
16. **Accessibility** -- reduced-motion support, keyboard navigation, focus states
17. **Performance optimization** -- lazy loading, image optimization, bundle analysis
18. **Deployment** -- Vercel (natural fit for Next.js)

**Ordering rationale:** Foundation must come first because every component depends on the scroll provider and animation utilities. Sections come next because they are the content -- the site has no value without them. Interactivity is layered on after sections exist, because cursor effects and magnetic buttons need elements to interact with. Polish is last because responsive/a11y/perf work is most efficient when the full site is assembled.

## Sources

- [Motion (Framer Motion) official docs](https://motion.dev)
- [GSAP vs Framer Motion comparison](https://dev.to/sharoztanveer/gsap-vs-framer-motion-which-animation-library-should-you-choose-for-your-creative-web-projects-4d02)
- [React animation libraries in 2025](https://dev.to/raajaryan/react-animation-libraries-in-2025-what-companies-are-actually-using-3lik)
- [Lenis smooth scroll + Next.js integration](https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap)
- [Next.js project structure docs](https://nextjs.org/docs/app/getting-started/project-structure)
- [Magnetic cursor effect implementation](https://www.100daysofcraft.com/blog/motion-interactions/building-a-magnetic-cursor-effect)
- [Sticky cursor with Next.js tutorial](https://blog.olivierlarose.com/tutorials/sticky-cursor)
- [GSAP vs Motion detailed comparison](https://motion.dev/docs/gsap-vs-motion)
- [React scroll animations with Framer Motion](https://blog.logrocket.com/react-scroll-animations-framer-motion/)
- [Interactive portfolio examples](https://reallygooddesigns.com/18-interactive-portfolio-examples-that-engage-on-another-level/)
- [Micro-interaction design patterns](https://www.justinmind.com/web-design/micro-interactions)
- [Custom cursor in React implementation](https://medium.com/design-bootcamp/implementing-custom-cursors-in-react-51784bae3d1d)

---
*Architecture research for: Creative, animation-heavy portfolio website*
*Researched: 2026-03-06*
