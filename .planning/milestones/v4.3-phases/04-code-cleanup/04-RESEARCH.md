# Phase 4: Code Cleanup - Research

**Researched:** 2026-03-07
**Domain:** Next.js static export codebase cleanup (dead routes, assets, CSS, TypeScript)
**Confidence:** HIGH

## Summary

Phase 4 is a removal-only phase -- no new features, just eliminating dead code and swapping the favicon. The codebase is small (20 TypeScript files, 72-line globals.css) which makes the cleanup straightforward and low-risk. The key areas are: deleting the explore route directory and Exploration1-5 components, removing 5 Vercel default SVGs from public/, replacing the Vercel favicon with the user's logo, removing the dead `e6-link-underline` CSS class, and doing a final dead-code sweep.

Critical finding: Exploration1-5 do NOT import any shared UI components -- they only use `@/lib/gsap`. All UI components (GlassPanel, NeoBrutalButton, NeoBrutalHeading, NeoBrutalTag, FloatingNav, DarkModeToggle) are exclusively used by Exploration6 and each other. This means deleting Exploration1-5 will NOT orphan any shared components.

**Primary recommendation:** Delete files in dependency order (explore route first, then Exploration1-5, then assets, then CSS), verify with `next build` at the end.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Delete `src/app/explore/` directory entirely (including `[id]/page.tsx`)
- Delete `src/components/explorations/Exploration[1-5].tsx` (5 prototype components)
- Exploration6.tsx stays -- it renders at `/` and is the production page
- Visiting `/explore` or `/explore/*` should return 404 (no redirect)
- Audit shared UI components after deletion -- remove any that become orphaned (only used by Exploration1-5)
- User will provide `public/logo.png` as the high-res source image (already placed)
- Generate multiple sizes from it: favicon.ico, apple-touch-icon.png, favicon-32x32.png, favicon-16x16.png
- Remove the current `src/app/favicon.ico` (not the correct one)
- Wire up favicon metadata in Next.js to reference the generated files in public/
- Delete all 5 Vercel default SVGs: file.svg, globe.svg, next.svg, vercel.svg, window.svg
- Verify via grep that none are referenced in code before deleting
- Keep: habbycursor*.png (3 sizes, used by banana cursor), resume.pdf, logo.png
- Full audit of globals.css -- remove all CSS classes not referenced in any TSX file
- Also audit and remove unused CSS custom properties (--var-name)
- Known dead: `e6-link-underline` class in globals.css
- Full sweep of unused imports and exports across .ts/.tsx files
- Remove any code that becomes orphaned after file deletions
- Run `next build` at the end -- must complete with zero unused import warnings

### Claude's Discretion
- Order of cleanup operations (what to delete first)
- How to generate favicon sizes (sharp, imagemagick, or other tool)
- Exact methodology for CSS/TS dead code detection

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CLEAN-01 | Remove explore pages (/explore/[id], explore index) and exploration components 1-5 | Explore route is self-contained in `src/app/explore/`. Exploration1-5 only import from `@/lib/gsap`. No shared component orphaning risk. |
| CLEAN-03 | Remove Vercel default assets (boilerplate images, SVGs, starter files from public/) | 5 SVGs confirmed: file.svg, globe.svg, next.svg, vercel.svg, window.svg. Grep confirms ZERO references in src/. Safe to delete. |
| CLEAN-04 | Replace favicon with old portfolio favicon | Current `src/app/favicon.ico` is 25KB Vercel default. `public/logo.png` exists (32x32 PNG). Need to generate ICO format and place in `src/app/` for Next.js auto-detection, or use metadata API. |
| CLEAN-05 | Remove dead code (orphaned CSS classes like e6-link-underline, unused imports) | `e6-link-underline` confirmed dead (only in globals.css, zero TSX references). All CSS custom properties appear actively used by Exploration6. globals.css is only 72 lines. |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | Framework (static export mode) | Already in project |
| TypeScript | ^5 | Type checking and dead code detection | Already in project |

### Supporting (for favicon generation)
| Tool | Purpose | When to Use |
|------|---------|-------------|
| sharp (npm) | Image conversion/resizing | Best option -- already a Next.js peer dep, programmatic, generates ICO |
| ImageMagick (convert) | CLI image conversion | Alternative if sharp not available |
| png-to-ico (npm) | PNG to ICO conversion | Lightweight single-purpose alternative |

### Recommendation: Favicon Generation Approach

The source `public/logo.png` is only 32x32 pixels. This is too small to generate larger sizes (apple-touch-icon needs 180x180). Options:

1. **Use the 32x32 as-is for favicon.ico** -- sufficient for browser tab display
2. **Generate only sizes <= 32px** -- favicon.ico (multi-size 16+32), favicon-16x16.png, favicon-32x32.png
3. **Skip apple-touch-icon** or use the 32x32 upscaled (will look pixelated)

**Recommendation:** Since the source is 32x32, generate favicon.ico (16x16 + 32x32 multi-size), favicon-16x16.png, and favicon-32x32.png. Skip apple-touch-icon.png (180x180 from a 32px source would look terrible). If the user wants apple-touch-icon, they need to provide a higher-res source.

**Simplest approach:** Since logo.png is already 32x32 PNG, just convert it to ICO format and place it at `src/app/favicon.ico`. Next.js auto-detects this file -- no metadata changes needed. Use `png-to-ico` or `sharp` for the conversion.

## Architecture Patterns

### File Deletion Map

```
DELETE (routes):
  src/app/explore/              # Entire directory (route + [id] subroute)

DELETE (components):
  src/components/explorations/Exploration1.tsx
  src/components/explorations/Exploration2.tsx
  src/components/explorations/Exploration3.tsx
  src/components/explorations/Exploration4.tsx
  src/components/explorations/Exploration5.tsx

DELETE (assets):
  public/file.svg
  public/globe.svg
  public/next.svg
  public/vercel.svg
  public/window.svg

REPLACE:
  src/app/favicon.ico           # Replace Vercel default with logo.png converted to ICO

KEEP (confirmed in use):
  src/components/explorations/Exploration6.tsx  # Production page
  src/components/ui/*            # All used by Exploration6
  src/components/sections/*      # FloatingNav used by Exploration6
  src/components/providers/*     # Used by layout.tsx
  src/components/cursor/*        # Used by layout.tsx
  src/data/content.ts            # Used by Exploration6
  src/lib/gsap.ts                # Used by Exploration6
  public/habbycursor*.png        # Banana cursor
  public/resume.pdf              # Resume download
  public/logo.png                # Source favicon
```

### Post-deletion File Count
After cleanup: 14 TypeScript files (down from 20), 6 public assets (down from 12).

### CSS Cleanup Map

```
globals.css (72 lines):

  REMOVE:
    Lines 58-72: .e6-link-underline class + hover media query (CONFIRMED dead - zero references)

  KEEP (all actively used by Exploration6):
    Lines 1-2: Tailwind import + dark variant
    Lines 5-12: @theme block (fonts, colors, ease)
    Lines 14-45: CSS custom properties (:root + .dark)
    Lines 47-49: html transition
    Lines 53-56: body base styles
```

### Recommended Cleanup Order

1. **Grep safety check** -- verify Vercel SVGs and e6-link-underline have zero references
2. **Delete explore route** -- `rm -rf src/app/explore/`
3. **Delete Exploration1-5** -- remove the 5 component files
4. **Delete Vercel SVGs** -- remove 5 files from public/
5. **Replace favicon** -- convert logo.png to ICO, replace src/app/favicon.ico
6. **Clean CSS** -- remove e6-link-underline from globals.css
7. **Dead code sweep** -- check for any remaining unused imports/exports
8. **Build verify** -- `next build` must pass clean

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PNG to ICO conversion | Manual binary manipulation | `sharp` or `png-to-ico` npm package | ICO is a multi-image container format with headers |
| Dead import detection | Manual file-by-file grep | `next build` TypeScript compiler warnings + ESLint | Compiler catches unused imports automatically |
| CSS dead code detection | Complex AST parsing | `grep -r` across TSX files for class names | Codebase is only 14 files post-cleanup -- grep is sufficient |

## Common Pitfalls

### Pitfall 1: Next.js Favicon Convention in App Router
**What goes wrong:** Placing favicon in `public/` but expecting App Router auto-detection
**Why it happens:** Next.js App Router auto-detects `favicon.ico` ONLY from `src/app/` (or `app/`), not from `public/`
**How to avoid:** Place the generated favicon.ico at `src/app/favicon.ico` (same location as the current Vercel default). Next.js handles the rest automatically -- no metadata export needed.
**Confidence:** HIGH -- verified from project structure (current favicon is at `src/app/favicon.ico`)

### Pitfall 2: Static Export + Deleted Routes
**What goes wrong:** Worrying about redirects or custom 404 handling for deleted routes
**Why it happens:** With `output: "export"`, Next.js generates static HTML. Deleted routes simply don't get generated.
**How to avoid:** Just delete the files. With static export, if no HTML file exists for `/explore`, the hosting platform returns 404 automatically. No need for explicit 404 handling or redirects.
**Confidence:** HIGH

### Pitfall 3: Forgetting generateStaticParams References
**What goes wrong:** Deleting Exploration6 reference from the explore route's `generateStaticParams`
**Why it happens:** The explore/[id]/page.tsx imports Exploration6 too (for route /explore/6)
**How to avoid:** Delete the entire `src/app/explore/` directory. The page.tsx there imports Exploration6 but that import only matters for the explore route -- `src/app/page.tsx` has its own independent import of Exploration6.
**Confidence:** HIGH -- verified from code

### Pitfall 4: CSS Custom Properties Appearing Unused
**What goes wrong:** Removing CSS custom properties like `--glass-fill` thinking they're dead
**Why it happens:** CSS custom properties are referenced via `var(--name)` in component styles (inline or Tailwind), not as class names
**How to avoid:** Only remove CSS custom properties if grep across ALL files (including .tsx inline styles) confirms zero references. The globals.css custom properties are actively consumed by GlassPanel and other components.
**Confidence:** HIGH

### Pitfall 5: ICO Generation from Small Source
**What goes wrong:** Generating 180x180 apple-touch-icon from a 32x32 source
**Why it happens:** Common favicon guides say "generate all sizes" but upscaling a tiny source produces blurry results
**How to avoid:** Only generate sizes <= source dimensions. The 32x32 logo.png supports favicon.ico (16+32) and that's it. Flag to user if larger sizes are needed.
**Confidence:** HIGH

## Code Examples

### Favicon Replacement (simplest approach)

Since `public/logo.png` is already 32x32 and Next.js auto-detects `src/app/favicon.ico`:

```bash
# Option A: Use sharp (likely already available as Next.js dependency)
node -e "
const sharp = require('sharp');
const { promises: fs } = require('fs');

async function convert() {
  const png32 = await sharp('public/logo.png').resize(32, 32).png().toBuffer();
  const png16 = await sharp('public/logo.png').resize(16, 16).png().toBuffer();
  // sharp can output ico with the ico plugin, or just use the PNG directly
  await sharp('public/logo.png').toFile('src/app/icon.png');
}
convert();
"

# Option B: Just copy the PNG and rename (Next.js 13+ supports icon.png)
cp public/logo.png src/app/icon.png
rm src/app/favicon.ico
```

**Next.js App Router icon convention:** In Next.js 13+, you can use `icon.png` (or `icon.svg`) in the app directory instead of `favicon.ico`. Next.js auto-generates the appropriate `<link>` tags. This avoids ICO conversion entirely.

### Vercel SVG Deletion

```bash
# Verify no references first
grep -r "file\.svg\|globe\.svg\|next\.svg\|vercel\.svg\|window\.svg" src/
# If no output, safe to delete
rm public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
```

### CSS Dead Code Removal

```css
/* REMOVE these lines from globals.css (58-72): */
.e6-link-underline {
  background-image: linear-gradient(var(--accent-purple), var(--accent-purple));
  background-size: 0% 2px;
  background-position: left bottom;
  background-repeat: no-repeat;
  transition: background-size 0.3s ease;
  text-decoration: none;
}

@media (hover: hover) {
  .e6-link-underline:hover {
    background-size: 100% 2px;
  }
}
```

### Build Verification

```bash
# Static export build -- should complete with zero warnings about missing imports
npx next build
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `favicon.ico` only | `icon.png` / `icon.svg` in app dir | Next.js 13 (2023) | No ICO conversion needed -- just place a PNG |
| Manual `<link>` tags for favicon | Auto-detection from app directory | Next.js 13 (2023) | Zero config required |

## Open Questions

1. **Source image resolution**
   - What we know: `public/logo.png` is 32x32 pixels
   - What's unclear: Is this the intended final favicon, or does the user have a higher-res version?
   - Recommendation: Use the 32x32 as-is. If the user wants apple-touch-icon (180x180), they need to provide a larger source. For now, `icon.png` at 32x32 is sufficient for browser tabs.

2. **CSS custom property audit depth**
   - What we know: User wants unused custom properties removed
   - What's unclear: Some vars like `--accent-pink` and `--accent-blue` may only be used in Exploration6 inline styles
   - Recommendation: Grep all `.tsx` files for each `--var-name` before removing. Keep any that are referenced anywhere.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected -- no test framework installed |
| Config file | None |
| Quick run command | `npx next build` (build verification) |
| Full suite command | `npx next build` (build verification) |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CLEAN-01 | No explore routes exist | smoke | `test ! -d src/app/explore && echo PASS` | N/A (shell check) |
| CLEAN-03 | No Vercel default SVGs in public/ | smoke | `test ! -f public/vercel.svg && echo PASS` | N/A (shell check) |
| CLEAN-04 | Favicon is user's logo, not Vercel triangle | smoke | `test -f src/app/icon.png && echo PASS` | N/A (shell check) |
| CLEAN-05 | No dead code, build passes clean | build | `npx next build` | N/A (build command) |

### Sampling Rate
- **Per task commit:** File existence checks + grep verification
- **Per wave merge:** `npx next build`
- **Phase gate:** Full build green + manual browser tab favicon check

### Wave 0 Gaps
None -- this phase uses file deletion verification and build checks, not unit tests. No test framework needed.

## Sources

### Primary (HIGH confidence)
- Project codebase inspection -- all file paths, imports, and references verified via grep/read
- `src/app/explore/[id]/page.tsx` -- confirmed Exploration1-5 import structure
- `src/app/globals.css` -- confirmed e6-link-underline is only CSS class, all custom properties inspected
- `public/` directory listing -- confirmed 5 Vercel SVGs, 3 cursor PNGs, resume.pdf, logo.png

### Secondary (MEDIUM confidence)
- Next.js App Router favicon convention (icon.png auto-detection) -- based on Next.js 13+ documentation patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - only deletion and one PNG placement, no complex tooling needed
- Architecture: HIGH - complete file inventory performed, all dependencies traced
- Pitfalls: HIGH - all edge cases verified against actual codebase
- Favicon approach: MEDIUM - icon.png convention verified for Next.js 13+, but Next.js 16 specifics not independently confirmed (likely unchanged)

**Research date:** 2026-03-07
**Valid until:** 2026-04-07 (stable -- this is codebase-specific, not library-dependent)
