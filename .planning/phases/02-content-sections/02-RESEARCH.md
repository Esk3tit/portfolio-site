# Phase 2: Content Sections - Research

**Researched:** 2026-03-06
**Domain:** React content sections with GSAP animations, glass+neobrutalism design system
**Confidence:** HIGH

## Summary

Phase 2 extends the locked Exploration6.tsx component with six content sections (Hero refinement, About refinement, Work Experience, Skills, Projects with expand, Contact) plus a floating nav and resume PDF download. The technical stack is already established -- Next.js 16, React 19, GSAP 3.14 with ScrollTrigger, Lenis smooth scroll, Tailwind v4.2. The design system (liquid glass + neobrutalism accents) is locked with documented recipes in DESIGN-DIRECTION.md.

The primary challenge is not technical but structural: Exploration6.tsx is currently ~474 lines with three sections. Adding three new sections plus expanding the projects section with click-to-expand behavior will push this file well beyond maintainable size. The glass panel recipe (8 lines of inline styles) repeats for every panel, creating massive duplication. Extracting a reusable GlassPanel component is the single most impactful architectural decision for this phase.

**Primary recommendation:** Extract a GlassPanel component and content data files FIRST, then build sections incrementally. Keep all content in a separate data file so copy can be iterated without touching layout code.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Single scrolling page -- no separate routes or multi-page nav
- Section order: Hero -> About -> Experience -> Skills -> Projects -> Contact
- Structured layouts with personality (clean grids, slight rotations, staggered cards, emoji anchors) -- NOT wild/asymmetric/overlapping
- Minimal floating nav that appears after scrolling past hero (dots or abbreviated labels on side/top)
- Hero: keep self-deprecating humor vibe, two CTAs (scroll-down + resume PDF download), neobrutalist button treatment
- About: 2-3 sentences per panel max, keep existing 2-panel glass layout
- Work Experience: concise cards per role in glass panels, company/title/dates/2-3 bullets, content from khaiphan.dev
- Skills: grouped by category in glass panels with neobrutalist skill tags
- Projects: 4 real projects (L33tC0de Tracker, AIPhone But Better, PyType, RealAssist.AI), click expands inline (modal or accordion) with case study lite (problem, approach, features, tech, links)
- Contact: glass panel with 3 neobrutalist link cards (Email, LinkedIn, GitHub) + resume download button
- Resume PDF: git-committed in repo, download button in BOTH hero and contact sections
- Links: email, GitHub (https://github.com/Esk3tit), LinkedIn (https://www.linkedin.com/in/khai-phan/)

### Claude's Discretion
- Exact hero copy refinement (within the self-deprecating humor tone)
- About section real copy (short and punchy, from existing site bio)
- Floating nav exact design (dots vs labels, positioning)
- Experience card layout details (stacking, spacing)
- Skills category groupings
- Project expanded view layout and animation
- Section transition spacing and visual rhythm

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONT-01 | Hero section with animated intro and personality-driven copy | Existing hero in Exploration6 needs refinement: add resume CTA button, refine copy. GSAP timeline already handles entrance animation. |
| CONT-02 | About section with background, interests, and what Khai does | Existing 2-panel glass layout in Exploration6. Replace placeholder text with real content. Minimal structural change. |
| CONT-03 | Work experience section with clear timeline of past roles | New section. Glass panel cards with company/title/dates/bullets. Content must be migrated from khaiphan.dev. |
| CONT-04 | Skills section organized by category with visual display | New section. Category groups in glass panels with neobrutalist tags (pattern already exists in project card tech tags). |
| CONT-05 | Projects showcase with descriptions, tech stack tags, and GitHub links | Existing project cards need real content (4 projects), click-to-expand with case study view. Most complex new feature. |
| CONT-06 | Contact section with email, LinkedIn, and GitHub links | New section. Glass panel with 3 neobrutalist link cards. Straightforward. |
| CONT-07 | Resume PDF download via git-committed file | PDF in /public, download button in hero + contact. Simple anchor tag with download attribute. |
| DSGN-02 | Creative but safe layout | Structured grids with personality (slight rotations, staggered cards, emoji anchors). NOT asymmetric/overlapping per user decision. |
| DSGN-06 | Personality-driven copy tone throughout | Playful, human, emoji-rich, self-deprecating humor. Never corporate. Applies to all section copy. |

</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | Framework, static export | Already configured, deployed to Vercel |
| React | 19.2.3 | UI rendering | Already installed |
| GSAP | 3.14.2 | All animations (entrance, scroll, expand) | Locked -- single animation engine |
| @gsap/react | 2.1.2 | useGSAP hook for React lifecycle | Already configured in src/lib/gsap.ts |
| ScrollTrigger | (bundled with GSAP) | Scroll-triggered section reveals | Already registered in src/lib/gsap.ts |
| Lenis | 1.3.18 | Smooth scroll | Already configured in SmoothScrollProvider |
| Tailwind CSS | 4.x | Utility styling | Already configured |

### No new dependencies needed
This phase requires zero new npm packages. Everything needed is already in the stack.

## Architecture Patterns

### Recommended Project Structure
```
src/
  components/
    explorations/
      Exploration6.tsx          # Main page component (extend this)
    ui/
      GlassPanel.tsx            # Reusable glass panel with specular rim + noise
      NeoBrutalButton.tsx       # Reusable neobrutalist button (download, CTA)
      NeoBrutalHeading.tsx      # Section heading banner component
      NeoBrutalTag.tsx          # Skill/tech tag component
    sections/
      FloatingNav.tsx           # Floating navigation (appears after hero)
      ProjectExpandedView.tsx   # Expanded project card content
  data/
    content.ts                  # All portfolio content (experience, skills, projects, etc.)
  lib/
    gsap.ts                     # GSAP setup (already exists)
  app/
    page.tsx                    # Renders Exploration6 (already exists)
    layout.tsx                  # Layout with fonts + SmoothScroll (already exists)
  public/
    resume.pdf                  # Git-committed resume PDF
```

### Pattern 1: GlassPanel Extraction
**What:** Extract the repeated glass panel recipe (background, backdrop-filter, border, shadow, specular rim, noise overlay) into a reusable component.
**When to use:** Every section container, every card -- anywhere the glass treatment appears.
**Why critical:** The glass recipe is 8+ lines of inline styles duplicated ~12 times in current Exploration6. Adding 3+ new sections would push this to 20+ duplications.

```typescript
// GlassPanel.tsx
interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article';
  shadow?: string; // default "4px 4px 0px #3d3248"
  rotate?: string; // optional slight rotation
}

export function GlassPanel({ children, className = '', as: Tag = 'div', shadow = '4px 4px 0px #3d3248', rotate }: GlassPanelProps) {
  return (
    <Tag
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        backdropFilter: 'blur(40px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(40px) saturate(1.6)',
        border: '3px solid #3d3248',
        boxShadow: shadow,
        transform: rotate ? `rotate(${rotate})` : undefined,
      }}
    >
      {/* Specular rim */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{
        border: '1.5px solid transparent',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0.25) 100%) border-box',
        WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
      }} />
      {/* Noise grain */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.03]"
        style={{ filter: 'url(#glass-noise)', background: 'transparent' }}
      />
      {children}
    </Tag>
  );
}
```

### Pattern 2: Content Data Separation
**What:** All portfolio content lives in a typed data file, not inline in components.
**When to use:** Experience entries, skills, projects, about text, contact links.
**Why:** Separating data from layout lets the user iterate on copy without touching component structure. Also enables easy content validation.

```typescript
// src/data/content.ts
export interface Experience {
  company: string;
  title: string;
  dates: string;
  bullets: string[];
  emoji: string;
}

export interface Project {
  emoji: string;
  title: string;
  description: string;
  tags: string[];
  headerColor: string;
  github?: string;
  liveUrl?: string;
  // Expanded view
  problem: string;
  approach: string;
  highlights: string[];
}

export interface SkillCategory {
  name: string;
  emoji: string;
  skills: string[];
}

export const experiences: Experience[] = [/* ... */];
export const projects: Project[] = [/* ... */];
export const skillCategories: SkillCategory[] = [/* ... */];
export const contactLinks = [/* ... */];
```

### Pattern 3: Project Card Expand/Collapse with GSAP
**What:** Click a project card to expand inline and show case study content. Uses GSAP for smooth height animation.
**When to use:** Projects section -- each card expands to reveal problem/approach/highlights.

```typescript
// Expand pattern using GSAP
const [expandedProject, setExpandedProject] = useState<string | null>(null);

function toggleProject(title: string) {
  if (expandedProject === title) {
    // Collapse: animate height to 0, then remove
    gsap.to(`.e6-project-detail-${title}`, {
      height: 0,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => setExpandedProject(null),
    });
  } else {
    setExpandedProject(title);
    // After state update, animate from 0 to auto
    requestAnimationFrame(() => {
      gsap.fromTo(`.e6-project-detail-${title}`,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    });
  }
}
```

### Pattern 4: Floating Navigation with ScrollTrigger
**What:** A minimal nav that appears after scrolling past the hero section.
**When to use:** Always visible after hero, allows jumping to sections.

```typescript
// Floating nav visibility controlled by ScrollTrigger
useGSAP(() => {
  ScrollTrigger.create({
    trigger: '.e6-about-section', // first section after hero
    start: 'top 90%',
    onEnter: () => gsap.to('.e6-floating-nav', { opacity: 1, duration: 0.3 }),
    onLeaveBack: () => gsap.to('.e6-floating-nav', { opacity: 0, duration: 0.3 }),
  });
});
```

### Pattern 5: Resume PDF Download
**What:** Simple anchor tag with download attribute pointing to /resume.pdf in public directory.
**When to use:** Hero section CTA and Contact section.

```typescript
<a
  href="/resume.pdf"
  download="Khai_Phan_Resume.pdf"
  className="e6-hero-cta rounded-xl px-8 py-3.5 text-sm font-bold uppercase tracking-wider"
  style={{
    background: '#a78bcd',
    color: '#ffffff',
    border: '3px solid #3d3248',
    boxShadow: '4px 4px 0px #3d3248',
    transform: 'rotate(-1deg)',
  }}
>
  Resume PDF
</a>
```

### Anti-Patterns to Avoid
- **Monolithic component:** Do NOT put all 6 sections + nav + expand logic in a single 1500+ line file. Extract reusable UI components (GlassPanel, buttons, tags) and keep section-specific logic manageable.
- **Hardcoded content in JSX:** Do NOT write experience entries, skills lists, or project details inline in JSX. Use a data file -- iterating on copy should not require navigating complex JSX.
- **CSS-only expand/collapse:** Do NOT use max-height CSS transitions for card expansion -- they require a fixed max-height value which causes timing issues. Use GSAP's `height: 'auto'` animation which handles this correctly.
- **Multiple SVG noise filters:** The SVG noise filter (`#glass-noise`) is already defined once in Exploration6. Do NOT duplicate it in extracted components. Keep it defined once at the page level and reference by ID.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Glass panel styling | Copy-paste inline styles everywhere | GlassPanel component | 8+ lines of inline styles repeated 15+ times is unmaintainable |
| Smooth scroll to section | Manual scrollTo with easing | Lenis `lenis.scrollTo('#section-id')` | Already configured, handles smooth scroll + offset correctly |
| Scroll-triggered reveals | IntersectionObserver manually | GSAP ScrollTrigger | Already registered, handles all edge cases (resize, Lenis integration) |
| Height animation | CSS max-height transitions | GSAP `height: 'auto'` | GSAP handles auto height; CSS requires fixed values |
| PDF serving | API route for file download | Static file in /public + `<a download>` | Next.js serves /public as static assets automatically |

## Common Pitfalls

### Pitfall 1: Lenis + ScrollTrigger Scroll Position Mismatch
**What goes wrong:** ScrollTrigger uses native scroll position but Lenis virtualizes scrolling, causing triggers to fire at wrong positions.
**Why it happens:** Lenis takes over scrolling from the browser. ScrollTrigger needs to know about Lenis's scroll position.
**How to avoid:** The SmoothScrollProvider already syncs Lenis with GSAP's ticker via `gsap.ticker.add(update)`. This means ScrollTrigger automatically uses the correct position. Do NOT create a second Lenis instance or bypass the provider.
**Warning signs:** Animations fire too early or too late relative to scroll position.

### Pitfall 2: GSAP Animations Not Cleaning Up on Re-render
**What goes wrong:** ScrollTrigger instances accumulate on hot reload or component re-mount, causing duplicate or stale animations.
**Why it happens:** GSAP animations created outside useGSAP or without proper cleanup persist in memory.
**How to avoid:** Always create animations inside `useGSAP(() => { ... }, { scope: containerRef })`. The useGSAP hook automatically cleans up all GSAP animations and ScrollTriggers created within its callback.
**Warning signs:** Animations appear duplicated after navigation or HMR.

### Pitfall 3: Exploration6 Growing Beyond Maintainability
**What goes wrong:** File exceeds 1000+ lines, making it hard to navigate, debug, or modify individual sections.
**Why it happens:** Adding 3 new sections + expand logic + floating nav + all content inline.
**How to avoid:** Extract reusable components (GlassPanel, buttons, tags) and content data. Keep Exploration6 as the composition root that imports and arranges sections. Individual section logic can stay inline since they share the GSAP scope.
**Warning signs:** File exceeds 600 lines, or you find yourself scrolling extensively to find a section.

### Pitfall 4: GSAP `height: 'auto'` with Overflow Hidden
**What goes wrong:** Expanding a card to `height: 'auto'` but the glass panel has `overflow-hidden`, clipping the specular rim or expanded content.
**Why it happens:** GlassPanel uses `overflow-hidden` for the noise overlay and specular rim.
**How to avoid:** Apply overflow-hidden to the decorative overlay divs, not the outer container. Or use a wrapper div inside the glass panel for expandable content.
**Warning signs:** Content visually cut off at edges during or after expansion.

### Pitfall 5: Missing Scroll-to Offset for Floating Nav
**What goes wrong:** Clicking a nav link scrolls to a section but the section heading is hidden behind the floating nav.
**Why it happens:** `scrollTo` targets the element's top edge without accounting for nav height.
**How to avoid:** Use Lenis's `scrollTo` with an offset parameter: `lenis.scrollTo('#experience', { offset: -80 })`.
**Warning signs:** Section headings partially hidden when navigating via the floating nav.

### Pitfall 6: PDF Not Included in Static Export
**What goes wrong:** Resume PDF works in dev but 404s in production.
**Why it happens:** File not committed to git, or placed outside /public.
**How to avoid:** Commit the PDF to `/public/resume.pdf`. Verify with `next build` locally. The file will be included in the static export automatically.
**Warning signs:** 404 on resume download in production.

## Code Examples

### Section Reveal Animation (established pattern)
```typescript
// Source: Existing Exploration6.tsx pattern
gsap.from('.e6-experience-card', {
  scrollTrigger: { trigger: '.e6-experience-section', start: 'top 80%' },
  y: 50,
  opacity: 0,
  scale: 0.95,
  duration: 0.8,
  stagger: 0.12,
  ease: 'power3.out',
});
```

### Neobrutalist Section Heading (established pattern)
```typescript
// Source: Existing Exploration6.tsx -- projects heading
<h2
  className="inline-block px-6 py-3 text-2xl font-bold md:text-3xl"
  style={{
    color: '#fff',
    background: '#3d3248',
    border: '3px solid #1a1220',
    boxShadow: '5px 5px 0px #1a1220',
    fontFamily: "var(--font-display, 'Space Grotesk', system-ui, sans-serif)",
    transform: 'rotate(-1deg)',
  }}
>
  Section Title
</h2>
```

### Neobrutalist Skill Tag (established pattern)
```typescript
// Source: Existing Exploration6.tsx -- project tech tags
<span
  className="px-3 py-1 text-xs font-bold uppercase"
  style={{
    background: 'rgba(255, 255, 255, 0.5)',
    border: '2px solid #3d3248',
    boxShadow: '2px 2px 0px #3d3248',
    color: '#3d3248',
  }}
>
  {tag}
</span>
```

### Smooth Scroll Navigation (Lenis)
```typescript
// Source: Lenis docs -- scrollTo with offset
import { useLenis } from 'lenis/react';

function FloatingNav() {
  const lenis = useLenis();

  const scrollTo = (target: string) => {
    lenis?.scrollTo(target, { offset: -80, duration: 1.2 });
  };

  return (
    <nav className="e6-floating-nav fixed right-6 top-1/2 -translate-y-1/2 z-50 opacity-0">
      {sections.map(s => (
        <button key={s.id} onClick={() => scrollTo(`#${s.id}`)}>
          {s.label}
        </button>
      ))}
    </nav>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Framer Motion for scroll animations | GSAP ScrollTrigger | Project decision (Phase 1) | Single animation engine, no Framer Motion |
| IntersectionObserver for reveals | GSAP ScrollTrigger with Lenis sync | GSAP 3.12+ | Better timing accuracy with smooth scroll |
| CSS max-height for expand | GSAP height: 'auto' | Always available in GSAP | Smooth, timing-accurate expansion |
| useEffect for GSAP cleanup | useGSAP hook (@gsap/react) | @gsap/react 2.0 | Automatic cleanup on unmount |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None currently installed |
| Config file | None |
| Quick run command | `npm run build` (type-check + build) |
| Full suite command | `npm run build` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONT-01 | Hero section renders with animated intro and copy | smoke / manual | `npm run build` (compile check) | N/A |
| CONT-02 | About section displays real content | smoke / manual | `npm run build` | N/A |
| CONT-03 | Work experience section with roles | smoke / manual | `npm run build` | N/A |
| CONT-04 | Skills section organized by category | smoke / manual | `npm run build` | N/A |
| CONT-05 | Projects with descriptions, tags, GitHub links | smoke / manual | `npm run build` | N/A |
| CONT-06 | Contact section with email, LinkedIn, GitHub | smoke / manual | `npm run build` | N/A |
| CONT-07 | Resume PDF downloads correctly | manual | Verify file exists: `ls public/resume.pdf` | No |
| DSGN-02 | Creative layout with personality | manual-only | Visual inspection | N/A |
| DSGN-06 | Playful, human copy tone | manual-only | Copy review | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` (catches type errors, import issues)
- **Per wave merge:** `npm run build` + manual browser check
- **Phase gate:** Full build + visual review of all 6 sections in browser

### Wave 0 Gaps
- [ ] No test framework installed -- for this phase, `npm run build` is sufficient as the primary automated check (content/layout work is inherently visual)
- [ ] Resume PDF file needs to be committed to `/public/resume.pdf`
- [ ] Content data file (`src/data/content.ts`) needs to be created with real portfolio content migrated from khaiphan.dev

## Open Questions

1. **Exact work experience content**
   - What we know: Content should be migrated from khaiphan.dev. Companies, titles, dates, bullet points needed.
   - What's unclear: Could not fetch khaiphan.dev content directly during research (tool restrictions).
   - Recommendation: During implementation, fetch and extract content from khaiphan.dev, or have Khai provide a resume/content dump. The CONTEXT.md mentions content from existing site, so it exists.

2. **Resume PDF file**
   - What we know: Must be git-committed to /public for static serving.
   - What's unclear: The PDF file doesn't exist in the repo yet.
   - Recommendation: Khai needs to provide the PDF, or it can be a placeholder initially with a TODO to replace.

3. **Project expanded view: modal vs accordion**
   - What we know: User said "expand inline (modal or accordion)" -- either is acceptable.
   - What's unclear: Which feels better in the glass+neobrutalism design.
   - Recommendation: Accordion-style inline expansion (push content below down). It maintains the scroll flow better than a modal and fits the single-page architecture. GSAP handles the height animation smoothly.

4. **Floating nav: dots vs labels**
   - What we know: User wants minimal floating nav after scrolling past hero.
   - What's unclear: Exact design -- dots, abbreviated labels, or emoji indicators.
   - Recommendation: Small dot indicators on the right side with section name tooltip on hover. Keeps it minimal while being discoverable. Use glass panel styling for consistency.

## Sources

### Primary (HIGH confidence)
- Exploration6.tsx -- existing codebase, locked reference implementation
- DESIGN-DIRECTION.md -- locked design system with component recipes
- 02-CONTEXT.md -- user decisions and constraints
- package.json -- confirmed stack versions
- src/lib/gsap.ts -- GSAP + ScrollTrigger registration
- src/components/providers/SmoothScroll.tsx -- Lenis + GSAP ticker integration

### Secondary (MEDIUM confidence)
- [GSAP ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) -- scroll-triggered animation patterns
- [Next.js public folder conventions](https://nextjs.org/docs/pages/api-reference/file-conventions/public-folder) -- static PDF serving
- [GSAP community: expanding cards](https://gsap.com/community/forums/topic/40028-expanding-card/) -- height:'auto' animation pattern

### Tertiary (LOW confidence)
- khaiphan.dev content -- could not fetch directly; content details from CONTEXT.md discussion

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all dependencies already installed and configured, zero new packages
- Architecture: HIGH - extending established patterns from Exploration6, well-understood component extraction
- Pitfalls: HIGH - based on actual code review of existing Lenis+GSAP integration and component structure
- Content: MEDIUM - project/skills/contact details specified in CONTEXT.md, but exact work experience text needs migration from existing site

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (stable -- no fast-moving dependencies)
