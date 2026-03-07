# Phase 4: Code Cleanup - Context

**Gathered:** 2026-03-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Remove dead routes, unused assets, orphaned CSS, and dead TypeScript code so the codebase contains only production code. Exploration6 stays at `/` as the main page (extraction into section components is Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Explore route removal
- Delete `src/app/explore/` directory entirely (including `[id]/page.tsx`)
- Delete `src/components/explorations/Exploration[1-5].tsx` (5 prototype components)
- Exploration6.tsx stays -- it renders at `/` and is the production page
- Visiting `/explore` or `/explore/*` should return 404 (no redirect)
- Audit shared UI components after deletion -- remove any that become orphaned (only used by Exploration1-5)

### Favicon
- User will provide `public/logo.png` as the high-res source image (already placed)
- Generate multiple sizes from it: favicon.ico, apple-touch-icon.png, favicon-32x32.png, favicon-16x16.png
- Remove the current `src/app/favicon.ico` (not the correct one)
- Wire up favicon metadata in Next.js to reference the generated files in public/

### Public asset cleanup
- Delete all 5 Vercel default SVGs: file.svg, globe.svg, next.svg, vercel.svg, window.svg
- Verify via grep that none are referenced in code before deleting
- Keep: habbycursor*.png (3 sizes, used by banana cursor), resume.pdf, logo.png

### Dead CSS cleanup
- Full audit of globals.css -- remove all CSS classes not referenced in any TSX file
- Also audit and remove unused CSS custom properties (--var-name)
- Known dead: `e6-link-underline` class in globals.css

### Dead TypeScript cleanup
- Full sweep of unused imports and exports across .ts/.tsx files
- Remove any code that becomes orphaned after file deletions
- Not just fixing what breaks -- proactively finding and removing unused code

### Build verification
- Run `next build` at the end -- must complete with zero unused import warnings
- Visually confirm the site at `/` still looks and works correctly (all sections, animations, cursor, dark mode)

### Claude's Discretion
- Order of cleanup operations (what to delete first)
- How to generate favicon sizes (sharp, imagemagick, or other tool)
- Exact methodology for CSS/TS dead code detection

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- None specific to this phase -- this phase is about removal, not creation

### Established Patterns
- Next.js App Router: favicon can be in `src/app/` (convention) or `public/` (static)
- CSS theming via custom properties in globals.css (MutationObserver pattern)
- Tailwind v4.2 -- some classes are utility-based, not in globals.css

### Integration Points
- `src/app/page.tsx` imports Exploration6 -- this stays untouched
- `src/app/explore/[id]/page.tsx` imports Exploration1-5 -- this gets deleted
- `public/` assets referenced via absolute paths in components

</code_context>

<specifics>
## Specific Ideas

- Source favicon is `public/logo.png` -- generate all size variants from this single file
- Exploration6 is the production design -- only Exploration1-5 are dead code
- User wants a thorough cleanup: CSS classes, CSS custom properties, and TypeScript dead code

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 04-code-cleanup*
*Context gathered: 2026-03-07*
