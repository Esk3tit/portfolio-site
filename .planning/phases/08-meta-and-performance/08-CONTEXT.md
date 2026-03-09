# Phase 8: Meta and Performance - Context

**Gathered:** 2026-03-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Add Open Graph and Twitter Card meta tags for rich link previews on social platforms, create and commit a static OG image (1200x630), and optimize the site to score 90+ on Lighthouse mobile across all categories. The site deploys as a static export to Vercel at khaiphan.dev.

</domain>

<decisions>
## Implementation Decisions

### OG image design
- Claude's discretion on exact approach (stylized name card, screenshot, or logo-based) — pick what works best for portfolio sites
- Use the same warm mid-tone gradient background as the site for visual continuity
- Include the banana cursor somewhere in the image as a fun personality detail
- Static PNG/JPG file committed to public/ — no runtime generation (static export)
- Dimensions: 1200x630

### Social preview copy
- OG title: "Khai Phan" (name only, clean and simple)
- OG description: "I build software. Sometimes it's good." (keep current playful tone)
- og:url and canonical: https://khaiphan.dev
- Twitter card type: summary_large_image

### Performance — GSAP
- Code-split GSAP via dynamic import so it doesn't block initial paint
- Animations still work but load slightly later — best balance of speed and experience

### Performance — Glass panels
- Reduce backdrop-filter blur radius on mobile to lower GPU work
- Desktop keeps full glass effect
- Mobile should still look glass-like (semi-transparent) but with less computational cost

### Performance — Fonts
- Preload both Inter (body) and Space Grotesk (display) fonts
- Reduces layout shift and improves LCP

### Performance — Images
- Claude's discretion on WebP conversion based on actual file sizes and impact

### Claude's Discretion
- Exact OG image visual design and composition
- Whether to convert cursor/OG images to WebP or keep PNG
- Specific GSAP code-splitting strategy (dynamic import pattern)
- Exact mobile blur radius value for glass panels
- Any additional Lighthouse optimizations needed to hit 90+

</decisions>

<specifics>
## Specific Ideas

- "I build software. Sometimes it's good." is the personality anchor — keep it in both the page meta and OG description
- Banana cursor in OG image adds a distinctive detail that hints at the site's playful personality
- The gradient background creates visual continuity between the social preview and the actual site experience

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `public/logo.png`: Existing logo file, could be used in OG image
- `public/habbycursor*.png`: Three sizes of banana cursor images — source for OG image detail
- Existing `metadata` export in `layout.tsx` — extend with OG/Twitter fields

### Established Patterns
- Next.js Metadata API in layout.tsx — already has title and description
- Static export (`output: "export"`) — no server-side image generation
- `images: { unoptimized: true }` in next.config.ts — no Next.js image optimization
- CSS custom properties for theming — gradient colors available as variables
- GSAP loaded as a regular import currently — needs dynamic import refactor

### Integration Points
- `src/app/layout.tsx` — extend metadata export with OG/Twitter tags
- `next.config.ts` — may need adjustments for performance
- `src/app/globals.css` — mobile-specific backdrop-filter reduction
- `src/app/page.tsx` — GSAP dynamic import for gradient animation
- Section components — GSAP dynamic imports for scroll animations

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-meta-and-performance*
*Context gathered: 2026-03-08*
