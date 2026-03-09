# Phase 6: Responsive Design - Context

**Gathered:** 2026-03-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the site usable and visually polished on phones (375px), tablets (640-1024px), and desktops (>1024px) with touch-friendly interaction. FloatingNav is desktop-only -- mobile needs its own navigation with dark mode toggle access. All interactive elements must meet 44px minimum touch targets on mobile.

</domain>

<decisions>
## Implementation Decisions

### Mobile navigation
- Hamburger icon + full-screen glass overlay drawer on mobile (<768px)
- Hamburger button: fixed top-right, always visible on mobile
- Hamburger button styled as 44px glass circle with frosted backdrop, 2-3px border, offset shadow -- matches Liquid Glass + Neobrutalism aesthetic
- Drawer: full-screen frosted glass overlay with section links centered vertically, dark mode toggle at bottom
- Drawer animation: fade in + scale up (from slightly scaled down), links stagger in -- matches GSAP scroll-reveal aesthetic
- Drawer closes on link tap (scrolls to section) or tap outside/X button
- FloatingNav remains desktop-only (`hidden md:flex`) -- no changes to desktop behavior

### Hero & typography scaling
- Hero glass panel: full-width with reduced padding on mobile (edge-to-edge minus page padding)
- Hero name: text-3xl on mobile (<640px), current sm:text-6xl / md:text-7xl preserved
- Hero subtitle: drops to text-sm on mobile
- Section headings (NeoBrutalHeading): scale to text-xl on mobile (currently text-2xl / md:text-3xl)
- Section vertical padding: py-16 on mobile (<640px), current py-28 on md+

### Grid & layout collapse
- Skills grid: single column on mobile, 2-col on tablet+ (current md:grid-cols-2 already handles this)
- Project cards: keep inline expand behavior on all devices -- no modal on mobile
- Experience cards: stack vertically, full-width on mobile -- all details visible, no hide/reveal
- Contact links: stack vertically below 640px, row above (current sm:flex-row already handles this)

### Touch target sizing
- DarkModeToggle: 44px in mobile nav drawer, 32px on desktop (conditional sizing)
- NeoBrutalButton: min-height 44px enforced on mobile, desktop stays as-is
- All interactive elements (project expand buttons, contact link cards, nav links): 44px minimum hit area on mobile
- Approach: use padding or min-height depending on the element, applied via responsive classes

### Claude's Discretion
- Exact animation timing/easing for mobile nav drawer
- How to structure the MobileNav component (single file or split)
- Specific responsive utility class choices (Tailwind breakpoints vs custom)
- Whether to use a portal for the drawer overlay
- Exact padding values for hero glass panel on mobile

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `GlassPanel`: Can be used for the mobile nav drawer overlay -- already has frosted glass, border, backdrop-filter
- `DarkModeToggle`: Already a standalone component, just needs conditional sizing for mobile context
- `FloatingNav`: Contains section list and scroll-to logic -- new MobileNav can reuse the same sections array and scrollTo pattern
- `NeoBrutalButton`: Already used for CTAs -- just needs min-height enforcement on mobile
- `NeoBrutalTag`: Used in Skills/Projects -- may need touch target review

### Established Patterns
- GSAP as single animation engine -- mobile nav animations should use GSAP, not CSS transitions
- CSS custom properties for theming -- mobile nav must use same `var(--glass-fill)`, `var(--glass-border)` etc.
- BEM-style class naming from Phase 5 -- new mobile nav classes should follow `mobile-nav__element` pattern
- `@media (pointer: fine)` for banana cursor -- already touch-safe, no changes needed
- Lenis smooth scroll -- mobile nav scrollTo should use `lenis.scrollTo()` like FloatingNav does

### Integration Points
- `src/app/page.tsx`: MobileNav component would be added here alongside FloatingNav
- `src/components/sections/FloatingNav.tsx`: Sections array and scrollTo logic can be shared or duplicated
- `src/components/ui/DarkModeToggle.tsx`: Needs conditional sizing (32px desktop / 44px mobile)
- Each section component: padding and typography classes need responsive updates
- `src/app/globals.css`: May need new classes for mobile nav drawer styles

</code_context>

<specifics>
## Specific Ideas

- Mobile nav drawer should feel dramatic -- full-screen glass takeover with staggered link animations, matching the site's personality
- Hamburger button should look like it belongs in the design system (glass circle, not a generic icon)
- Hero text at 3xl on mobile should still feel impactful -- the glass panel going full-width helps frame it
- Same animations on mobile, just adapted -- no separate mobile animation set (per REQUIREMENTS.md)

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 06-responsive-design*
*Context gathered: 2026-03-08*
