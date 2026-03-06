# Phase 2: Content Sections - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Build all six portfolio sections with real content, creative layout, and personality-driven copy. Extends Exploration6.tsx (the locked-in main page) with real content migrated from khaiphan.dev. Sections: Hero (refine), About (refine), Work Experience (new), Skills (new), Projects (replace placeholders), Contact (new). Single scrolling page.

</domain>

<decisions>
## Implementation Decisions

### Section layout and flow
- Single scrolling page -- no separate routes or multi-page nav
- Section order: Hero -> About -> Experience -> Skills -> Projects -> Contact
- Structured layouts with personality (clean grids, slight rotations, staggered cards, emoji anchors) -- NOT wild/asymmetric/overlapping
- Minimal floating nav that appears after scrolling past hero (dots or abbreviated labels on side/top)

### Hero section
- Keep current self-deprecating humor vibe ("I'm Khai." + punchy tagline)
- Claude can refine the exact copy but maintain the tone
- Two CTAs: scroll-down button + resume PDF download button
- Resume download gets neobrutalist button treatment

### About section
- Short and punchy -- 2-3 sentences per panel max
- Quick personality snapshot: what you do + what you're into
- Keep the existing 2-panel glass layout, replace placeholder text with real content

### Work Experience section (NEW)
- Concise cards per role in glass panels
- Each card: company, title, dates, 2-3 bullet points of impact
- Content migrated from existing khaiphan.dev site

### Skills section (NEW)
- Grouped by category: Languages, Frameworks, Cloud/DevOps (or similar groupings)
- Each group in a glass panel with neobrutalist skill tags inside
- Skills from existing site: Python, C++, JavaScript, TypeScript, Go, React, AWS, Docker, etc.

### Projects section
- All 4 existing projects (L33tC0de Tracker, AIPhone But Better, PyType, RealAssist.AI) + grid designed for easy addition of future projects
- Card face shows: colored header with emoji + title, brief description, tech stack tags (current Exploration 6 format)
- Click behavior: expand inline (modal or accordion) to show case study lite
- Expanded view: problem statement, approach, key features/highlights, tech stack breakdown, links to GitHub repo + live demo
- Content migrated from existing khaiphan.dev + enriched with problem/approach framing

### Contact section (NEW)
- Glass panel containing 3 neobrutalist link cards: Email, LinkedIn, GitHub
- Each card has icon/emoji + actual link
- Resume PDF download button also present here (second touchpoint after hero)
- Links: email, GitHub (https://github.com/Esk3tit), LinkedIn (https://www.linkedin.com/in/khai-phan/)

### Resume PDF
- Git-committed PDF in repo for easy swapping
- Download button in BOTH hero section and contact section
- Neobrutalist button style consistent with other CTAs

### Claude's Discretion
- Exact hero copy refinement (within the self-deprecating humor tone)
- About section real copy (short and punchy, from existing site bio)
- Floating nav exact design (dots vs labels, positioning)
- Experience card layout details (stacking, spacing)
- Skills category groupings
- Project expanded view layout and animation
- Section transition spacing and visual rhythm

</decisions>

<specifics>
## Specific Ideas

- Hero vibe reference: current Exploration 6 ("Hey there", "I'm Khai.", "I build software. Sometimes it's good.") -- refine but don't change the DNA
- Projects should tell a mini-story when expanded (why you built it, what was interesting) -- not just a feature list
- Design system is LOCKED in DESIGN-DIRECTION.md -- all new sections use the same glass + neobrutalism treatment
- Copy tone throughout: playful, human, emoji-rich -- never corporate. Self-deprecating humor welcome.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- Exploration6.tsx: locked-in main page with Hero, About, Projects sections already built
- Glass panel recipe: near-zero fill + blur(40px) saturate(1.6) + 3px #3d3248 border + offset shadow + specular rim + noise overlay
- Neobrutalist tag style: existing in project card tech tags
- Neobrutalist heading banner: existing in "About Me" and "Things I've Built" headings
- SVG noise filter: already defined in Exploration6 for frosted grain texture
- GSAP + useGSAP hook: animation infrastructure ready
- Lenis smooth scroll: already configured via SmoothScrollProvider

### Established Patterns
- Inline styles + Tailwind for self-contained components
- e6- prefixed class selectors for GSAP targeting
- Color palette: #3d3248 (primary text/borders), #5a4d66 (body), #8a7d96 (secondary), #c9a4b2/#a78bcd/#8bb4d4 (accents)
- Font pairing: Inter (body) + Space Grotesk (display)
- Background: warm mid-tone gradient (#e8ddd5 -> #cdd0e5)

### Integration Points
- Exploration6.tsx is the single file to extend -- add new sections directly
- May need to extract reusable glass panel component if sections get repetitive
- Resume PDF: commit to /public directory for static serving
- Floating nav: new component, rendered in Exploration6 or layout

</code_context>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 02-content-sections*
*Context gathered: 2026-03-06*
