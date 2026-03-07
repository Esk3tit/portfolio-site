# Phase 1: Foundation and Design Exploration - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Set up the app shell (Next.js 16 + Tailwind v4.2 + GSAP 3.14 + Lenis) and generate 5 distinct design explorations for browser preview. User browses them, iterates, and selects a final visual direction. Use the `frontend-design` skill for all design generation.

</domain>

<decisions>
## Implementation Decisions

### Design exploration approach
- Generate exactly 5 distinct design directions, each as a separate route (e.g., `/explore/1` through `/explore/5`)
- Each exploration shows Hero section + one additional section (About or Projects) — enough to feel the vibe without over-investing
- Use the `frontend-design` skill for each design to ensure high visual quality and avoid generic AI aesthetics
- After user reviews all 5, iterate on the favorite(s) until a final direction is selected and documented as a key decision

### Design directions (5 vibes)
1. **Light + airy** — Generous whitespace, soft pastel tones, elegant minimalism, clean typography
2. **Colorful + playful** — Saturated colors, unexpected color combinations, fun energy, personality-forward
3. **Glassmorphism** — Frosted glass panels with backdrop-blur, transparency layers, scroll animations, premium Apple-like polish
4. **Neobrutalism** — Thick borders, raw geometric shapes, bold colors, intentionally anti-polish aesthetic
5. **Video game-inspired** — Animated, interactive elements evoking game UI (HUD, level-up feel) but kept clean and not over-the-top. Reference Bruno Simon's concept at lighter fidelity

### Inspiration references
- **joshwcomeau.com** — Whimsical personality with micro-interactions, but content remains clean and readable. The tone of fun without sacrificing usability
- **bruno-simon.com** — Video game interactivity as a concept reference only. Much lighter weight — the spirit of playful interaction, not the Three.js complexity
- **apple.com** — Frosted glass panels, scroll-triggered product animations, overall premium polish. Reference for the glassmorphism exploration specifically

### Claude's Discretion
- Typography pairings for each design direction (pick what fits the mood)
- Color palette specifics per direction (guided by the mood descriptions above)
- Which "one additional section" to show alongside Hero in each exploration
- Animation details per exploration (keep lightweight — this is a preview, not final implementation)
- Exact layout choices per direction

</decisions>

<specifics>
## Specific Ideas

- Josh Comeau's site nails the balance of whimsical personality + clean readability — that tension is what makes it work
- Video game direction should feel interactive and animated but NOT require heavy 3D/WebGL — CSS animations, GSAP, maybe subtle canvas elements at most
- Apple's glassmorphism is the reference for frosted panels — `backdrop-filter: blur()` with translucent backgrounds
- User wants to experiment and discover their style through this process — don't pre-optimize for one direction

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing code

### Established Patterns
- None yet — this phase establishes the foundational patterns

### Integration Points
- App shell created here becomes the foundation for all subsequent phases
- Design tokens (colors, typography, spacing) chosen here propagate to all future components
- GSAP + Lenis setup here is reused by Phase 3 (animations)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-and-design-exploration*
*Context gathered: 2026-03-06*
