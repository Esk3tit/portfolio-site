# Roadmap: Khai Phan Portfolio Site

## Overview

This roadmap delivers a creative, animation-heavy portfolio site for Khai Phan in four phases. It starts by standing up the tech foundation and exploring multiple design directions in the browser so the user can pick a visual identity before any content is built. Then all six content sections are assembled with the chosen design. Next, interactivity and visual effects (cursor, animations, dark mode, textures) are layered on top of complete content. Finally, responsive polish, accessibility, performance optimization, and Vercel deployment close it out.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation and Design Exploration** - Stand up the app shell and generate multiple design directions for browser preview before committing to a final look (completed 2026-03-06)
- [x] **Phase 2: Content Sections** - Build all six portfolio sections with real content, creative layout, and personality-driven copy (completed 2026-03-06)
- [ ] **Phase 3: Interactivity and Visual Effects** - Layer animations, cursor effects, dark mode, textures, and gradient polish onto complete content
- [ ] **Phase 4: Responsive, Accessibility, and Launch** - Ensure the site works across all devices, meets accessibility and performance targets, and deploy to Vercel

## Phase Details

### Phase 1: Foundation and Design Exploration
**Goal**: User can browse multiple distinct design directions in the browser and iterate toward a final visual identity, built on a working Next.js + Tailwind + GSAP + Lenis foundation
**Note**: Use the `frontend-design` skill when generating design explorations to ensure high visual quality and avoid generic AI aesthetics
**Depends on**: Nothing (first phase)
**Requirements**: INFR-06, DSGN-01
**Success Criteria** (what must be TRUE):
  1. Next.js 16 app runs locally with Tailwind v4.2, GSAP 3.14, and Lenis configured and working
  2. At least 3 distinct design explorations are viewable in the browser as separate routes or toggleable views
  3. Each design exploration demonstrates different layout philosophy, color palette, typography, and animation style
  4. User has selected a final design direction and it is documented as a decision
**Plans:** 4/4 plans complete

Plans:
- [ ] 01-01-PLAN.md — Scaffold Next.js 16 app shell with Tailwind v4.2, GSAP 3.14, Lenis, static export, and dynamic exploration routes
- [ ] 01-02-PLAN.md — Build design explorations 1-3: Light + Airy, Colorful + Playful, Glassmorphism
- [ ] 01-03-PLAN.md — Build design explorations 4-5: Neobrutalism, Video Game-Inspired
- [ ] 01-04-PLAN.md — User reviews all 5 explorations and selects a final design direction

### Phase 2: Content Sections
**Goal**: Visitors can browse a complete portfolio with all six sections populated with real content, using the chosen creative layout and personality-driven copy
**Depends on**: Phase 1
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07, DSGN-02, DSGN-06
**Success Criteria** (what must be TRUE):
  1. Hero section displays with animated intro and copy that conveys Khai's personality
  2. About, Work Experience, Skills, Projects, and Contact sections are all present with real content migrated from existing site
  3. Layout uses asymmetric grids, overlapping elements, or unconventional flow -- visibly distinct from a standard top-to-bottom portfolio
  4. Resume PDF downloads correctly when clicked and the PDF file lives in the repo for easy swapping
  5. Copy tone throughout is playful, human, and specific -- not generic corporate language
**Plans**: 3 plans

Plans:
- [ ] 02-01-PLAN.md — Extract reusable UI components (GlassPanel, buttons, tags) + content data file + resume PDF
- [ ] 02-02-PLAN.md — Refine Hero/About with real content, build Experience and Skills sections
- [ ] 02-03-PLAN.md — Build Projects expand, Contact section, and Floating Nav + visual checkpoint

### Phase 3: Interactivity and Visual Effects
**Goal**: The portfolio feels alive and memorable -- scroll animations, cursor effects, micro-interactions, dark mode, and visual textures transform it from a static site into an experience
**Depends on**: Phase 2
**Requirements**: ANIM-01, ANIM-02, ANIM-03, ANIM-04, DSGN-03, DSGN-04, DSGN-05
**Success Criteria** (what must be TRUE):
  1. Sections reveal with scroll-triggered GSAP animations as the user scrolls down
  2. Desktop shows a custom cursor that responds magnetically near interactive elements; touch devices show no cursor artifacts
  3. Buttons, links, and cards respond to hover with visible micro-interactions (scale, rotation, or morphs)
  4. Headings animate with character or word split text reveal effects
  5. Dark mode toggles with animation, detects system preference, persists across sessions, and noise/grain texture plus gradient animations are visible
**Plans:** 3 plans

Plans:
- [ ] 03-01-PLAN.md — Dark mode foundation (CSS custom properties, provider, toggle) + noise texture overlay + gradient animation
- [ ] 03-02-PLAN.md — Custom cursor with magnetic pull + hover micro-interactions (button lift, card tilt, tag wiggle, link underline)
- [ ] 03-03-PLAN.md — Text reveal animations (SplitText word/char split on headings) + scroll animation polish + visual checkpoint

### Phase 4: Responsive, Accessibility, and Launch
**Goal**: The site works flawlessly across mobile, tablet, and desktop, meets accessibility standards, hits performance targets, and is live on Vercel at khaiphan.dev
**Depends on**: Phase 3
**Requirements**: INFR-01, INFR-02, INFR-03, INFR-04, INFR-05
**Success Criteria** (what must be TRUE):
  1. Site renders correctly and is fully usable on mobile, tablet, and desktop breakpoints
  2. Sharing the site URL on LinkedIn, Twitter, or Slack shows correct Open Graph preview with title, description, and image
  3. Users with prefers-reduced-motion enabled see graceful fades/opacity instead of full animations -- nothing is removed entirely
  4. Site is navigable by keyboard, uses semantic HTML with proper heading hierarchy, has aria labels on interactive elements, and meets color contrast requirements
  5. Lighthouse mobile score is 90 or above
**Plans**: TBD

Plans:
- [ ] 04-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation and Design Exploration | 4/4 | Complete   | 2026-03-06 |
| 2. Content Sections | 3/3 | Complete   | 2026-03-06 |
| 3. Interactivity and Visual Effects | 0/3 | Planning complete | - |
| 4. Responsive, Accessibility, and Launch | 0/0 | Not started | - |
