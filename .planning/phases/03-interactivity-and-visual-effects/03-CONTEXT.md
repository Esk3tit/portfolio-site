# Phase 3: Interactivity and Visual Effects - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Layer animations, cursor effects, micro-interactions, dark mode, textures, and gradient polish onto the complete content sections built in Phase 2. The site should feel alive and memorable -- scroll animations, cursor effects, and visual textures transform it from a static page into an experience. No new content sections or layout changes.

</domain>

<decisions>
## Implementation Decisions

### Custom cursor
- Dot follower style -- small circle that follows the mouse with slight lag/easing
- Magnetic pull effect near interactive elements (buttons, links, cards) within ~50px radius
- On hover: dot grows and shifts to an accent color (#c9a4b2 or #a78bcd)
- No trailing/afterimage effect -- clean single dot
- Disabled entirely on touch devices (no cursor artifacts on mobile/tablet)

### Dark mode
- Deep warm dark background gradient (#1a1520 -> #1e2030) mirroring the light theme's warm tone
- Glass panels get brighter fill in dark mode (rgba(255,255,255,0.12)) so they remain visible against dark bg; specular rim more prominent; borders stay #3d3248
- Smooth crossfade CSS transition (~300-400ms ease) on background, colors, and borders
- System preference detection via prefers-color-scheme on initial load
- Persisted in localStorage so choice survives across sessions
- Text colors invert to light values in dark mode

### Micro-interactions
- Buttons: lift up (~2px translateY) with neobrutalist offset shadow growing on hover -- tactile, physical feel
- Glass panel cards: 3D tilt effect (perspective + rotateX/Y) that follows cursor position within the card -- gives glass a reflective, physical quality
- Neobrutalist tags (skills, tech stack): slight rotation wiggle + scale pop on hover -- playful energy
- Body text links: animated underline that draws in from left on hover
- All hover effects desktop-only; touch devices get tap feedback instead

### Text reveal animations
- Section headings: word-by-word slide-up + fade-in with stagger on scroll trigger
- Hero intro text treatment at Claude's discretion (character split for premium feel, or word-by-word for consistency)
- Uses GSAP SplitText plugin or manual span wrapping for word splitting

### Noise/grain texture
- Subtle page-level noise overlay at 5-8% opacity on the background (in addition to existing 3% on glass panels)
- Adds visual depth and tactile quality without distracting from content

### Gradient animation
- Background gradient endpoints shift slowly (20-30 second cycle) between warm tones
- In dark mode, same slow drift behavior with the dark palette colors
- Subtle enough to feel alive without being consciously noticeable

### Claude's Discretion
- Dark mode toggle placement (floating nav, fixed corner, or both)
- Hero text reveal approach (character split vs word-by-word)
- Exact accent color choice for cursor hover state
- Exact gradient drift color range and easing
- Animation timing and easing curves for all effects
- Scroll-triggered section reveal refinement (already exists from Phase 2, may need polish)

</decisions>

<specifics>
## Specific Ideas

- Cursor magnetic pull is common on award-winning portfolio sites (e.g., Awwwards winners) -- matches the "portfolio as proof of skill" philosophy
- Glass panel tilt effect should make the panels feel like real glass catching light as you move over them
- Tag wiggle + pop gives the neobrutalist elements their own personality distinct from the glass elements
- Button lift + shadow grow mimics pressing a physical button in reverse -- fits neobrutalism's raw, tactile energy
- Gradient drift should be so slow it's almost subliminal -- visitors feel the page is alive without knowing why

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/gsap.ts`: GSAP + ScrollTrigger + useGSAP already registered and exported
- `src/components/ui/GlassPanel.tsx`: Glass panel component with specular rim + noise overlay -- needs dark mode variant styles
- `src/components/ui/NeoBrutalButton.tsx`: Button component -- needs hover animation addition
- `src/components/ui/NeoBrutalTag.tsx`: Tag component -- needs wiggle + pop hover
- `src/components/ui/NeoBrutalHeading.tsx`: Heading component -- candidate for text reveal animation
- `src/components/sections/FloatingNav.tsx`: Floating nav -- potential home for dark mode toggle
- `src/components/providers/SmoothScroll.tsx`: Lenis smooth scroll provider already configured

### Established Patterns
- `gsap.fromTo()` with ScrollTrigger for section reveals (established in Exploration6.tsx)
- Double-rAF + `ScrollTrigger.refresh(true)` for Next.js hydration timing
- `e6-` prefixed class selectors for GSAP targeting
- Inline styles + Tailwind for self-contained components
- UI components are server-compatible (no 'use client') -- cursor and dark mode will need client components
- Color palette: #3d3248 (primary), #5a4d66 (body), #8a7d96 (secondary), #c9a4b2/#a78bcd/#8bb4d4 (accents)

### Integration Points
- Exploration6.tsx: main page where all animations are orchestrated
- GlassPanel: needs CSS custom properties or class-based dark mode styles
- All NeoBrutal* components: need hover effect additions
- layout.tsx: may need dark mode class/provider at root level
- New components needed: CustomCursor (client), DarkModeProvider (client)

</code_context>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 03-interactivity-and-visual-effects*
*Context gathered: 2026-03-06*
