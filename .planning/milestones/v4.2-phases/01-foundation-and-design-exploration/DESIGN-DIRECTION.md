# Design Direction: Selected

**Decided:** 2026-03-06
**Plan:** 01-04 (User Review and Selection)

## Selected Direction

**HYBRID** -- Glassmorphism base + Light+Airy palette + Colorful+Playful energy/emojis + Neobrutalism accents

## Reference Implementation

**Exploration 6** (`src/components/explorations/Exploration6.tsx`) is the locked-in reference. It is now rendered as the main page (`src/app/page.tsx`). All Phase 2+ work builds on this file directly.

## Component Breakdown

### Foundation: Liquid Glass (evolved from Glassmorphism #3)
- Genuinely see-through panels -- near-zero white fill (`rgba(255,255,255,0.03-0.08)`)
- Strong `backdrop-filter: blur(40px) saturate(1.6)` so background shows through distorted
- Specular rim border using mask-composite trick (bright top edge, subtle sides, medium bottom)
- Frosted noise grain overlay via SVG feTurbulence filter at 3% opacity
- No orbs/gradient blobs -- removed for cleaner readability

### Borders and Shadows: Neobrutalism (#4)
- `3px solid #3d3248` on all glass panels, badges, buttons, tags
- Offset box-shadow `4-5px` in `#3d3248` (or `#1a1220` for dark-on-dark elements like section headings)
- Applied universally -- not sparingly. The neobrutalist frame IS the glass edge treatment
- Hover states: `6px 6px 0px #3d3248` with `-translate-y-1`

### Color Palette: Warm mid-tones (evolved from Light+Airy #1)
- Background gradient: `#e8ddd5 -> #d8cfc8 -> #d5cde0 -> #cdd0e5` (warm taupe to cool lavender)
- NOT near-white -- glass needs contrast behind it to read as glass
- Text: `#3d3248` (primary), `#5a4d66` (body), `#8a7d96` (secondary)
- Accents: `#c9a4b2` (rose), `#a78bcd` (lavender), `#8bb4d4` (blue)
- Gradient text for name: `#c9a4b2 -> #a78bcd -> #8bb4d4`

### Energy and Layout: Colorful and Playful (#2)
- Emojis as UI elements throughout (badges, section headings, project headers)
- Playful copy tone ("Sometimes it's good", "exactly as important as it sounds")
- Slight rotation transforms on badges/buttons (`rotate(-4deg)`, `rotate(1deg)`)
- Colored header bars on project cards using accent palette

### Dropped: Video Game-Inspired (#5)
- Too cheesy for this portfolio's tone
- Dark HUD and neon accents conflict with the light palette direction
- Not carried forward in any capacity

### Dropped: Floating gradient orbs
- Removed after iteration -- too distracting, competed with text readability
- Glass effect works fine against the mid-tone gradient background alone

## Design Principles (derived from selection + iteration)

1. **Glass-first surfaces** -- Default container is see-through with backdrop blur, NOT frosted white
2. **Neobrutalist framing** -- Every glass panel gets thick dark borders + offset shadows
3. **Soft palette, loud personality** -- Colors are warm mid-tones but copy, emojis, and layout are bold
4. **Background contrast matters** -- Glass needs a non-white background to read as glass
5. **Emojis are UI elements** -- Not decoration; they serve as visual anchors and personality markers
6. **Specular rim sells the glass** -- The gradient border (bright top, subtle sides) is what makes panels read as glass

## Implementation Notes for Phase 2+

- Exploration6.tsx IS the main page -- extend it directly, do not create new page components
- Glass panel recipe: near-zero fill + blur(40px) saturate(1.6) + 3px #3d3248 border + offset shadow + specular rim div + noise overlay
- All new sections must use the same glass + neobrutalism treatment
- Font pairing locked: Inter (body) + Space Grotesk (display)
- Copy tone guide: playful, human, emoji-rich -- never corporate
- Section headings use neobrutalist banner style (solid bg + dark border + offset shadow + slight rotation)
