# Design Direction: Selected

**Decided:** 2026-03-06
**Plan:** 01-04 (User Review and Selection)

## Selected Direction

**HYBRID** -- Glassmorphism base + Light+Airy palette + Colorful+Playful energy/emojis + Neobrutalism accents

## Component Breakdown

### Foundation: Glassmorphism (#3)
- Frosted glass panels, backdrop blur, translucent surfaces
- Layered depth with glass-like card components
- Apple-inspired polish and spatial hierarchy

### Color Palette: Light and Airy (#1)
- Soft pastels, whitespace-forward
- Gentle, muted tones as the primary color system
- oklch color tokens tuned for warmth and softness

### Energy and Layout: Colorful and Playful (#2)
- Bold, playful layout decisions and spacing
- Emojis as design elements throughout
- Hype imagery, energetic copy tone
- Fun, personality-driven section transitions
- Saturated accent pops within the soft palette framework

### Accents: Neobrutalism (#4)
- Thick borders on select elements (CTAs, highlight cards)
- Raw offset shadows as punctuation
- Intentional "roughness" to contrast the glass polish
- Used sparingly -- accent, not foundation

### Dropped: Video Game-Inspired (#5)
- Too cheesy for this portfolio's tone
- Dark HUD and neon accents conflict with the light palette direction
- Not carried forward in any capacity

## Design Principles (derived from selection)

1. **Glass-first surfaces** -- Default container treatment is frosted glass with backdrop blur
2. **Soft palette, loud personality** -- Colors are gentle but copy, emojis, and layout are bold
3. **Polish with punk edges** -- Glassmorphism smoothness interrupted by neobrutalist accents
4. **Whitespace is intentional** -- Light+Airy spacing philosophy even in energetic layouts
5. **Emojis are UI elements** -- Not decoration; they serve as visual anchors and personality markers

## Implementation Notes for Phase 2

- Build a design token system based on Light+Airy's oklch palette
- Glass card component as the primary container primitive
- Neobrutalist variant styles (thick border, offset shadow) as utility classes
- Copy tone guide: playful, hype, emoji-rich (Colorful+Playful voice)
- Font pairing carries forward: Inter (body) + Space Grotesk (display)
