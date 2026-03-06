# Requirements: Khai Phan Portfolio Site

**Defined:** 2026-03-06
**Core Value:** Visitors immediately get a sense of Khai's personality and technical ability through a portfolio that is as engaging to interact with as the work it showcases.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Content

- [x] **CONT-01**: Hero section with animated intro and personality-driven copy
- [x] **CONT-02**: About section with background, interests, and what Khai does
- [x] **CONT-03**: Work experience section with clear timeline of past roles
- [x] **CONT-04**: Skills section organized by category with visual display
- [ ] **CONT-05**: Projects showcase with descriptions, tech stack tags, and GitHub links
- [ ] **CONT-06**: Contact section with email, LinkedIn, and GitHub links
- [x] **CONT-07**: Resume PDF download via git-committed file (easy to swap by replacing file in repo)

### Design

- [x] **DSGN-01**: Multiple distinct design explorations generated for browser preview and user iteration before committing to a final direction
- [x] **DSGN-02**: Creative but safe layout — asymmetric grids, overlapping elements, unconventional flow while maintaining readability
- [ ] **DSGN-03**: Dark mode with system preference detection and animated toggle, persisted in localStorage
- [ ] **DSGN-04**: Noise/grain texture overlay for visual depth
- [ ] **DSGN-05**: Gradient animations or dynamic color shifts
- [x] **DSGN-06**: Personality-driven copy tone throughout (playful, human, specific — not generic corporate)

### Animation

- [ ] **ANIM-01**: Scroll-triggered section reveal animations using GSAP ScrollTrigger
- [ ] **ANIM-02**: Custom cursor effects on desktop (magnetic near interactive elements, disabled on touch devices)
- [ ] **ANIM-03**: Hover micro-interactions on buttons, links, and cards (scale, rotation, morphs)
- [ ] **ANIM-04**: Text reveal animations with character/word split on headings (GSAP SplitText)

### Infrastructure

- [ ] **INFR-01**: Responsive design across mobile, tablet, and desktop breakpoints
- [ ] **INFR-02**: Open Graph and social meta tags for proper link preview on LinkedIn, Twitter, Slack
- [ ] **INFR-03**: `prefers-reduced-motion` support — replace animations with fades/opacity, never remove entirely
- [ ] **INFR-04**: Semantic HTML structure and keyboard accessibility (aria labels, focus management, color contrast)
- [ ] **INFR-05**: Performance budget — Lighthouse mobile score >= 90
- [x] **INFR-06**: Vercel deployment with static export (Next.js 16 + Tailwind v4.2 + GSAP 3.14 + Lenis)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Polish

- **POLSH-01**: Loading/intro animation — 2-3 second curtain raise on first visit, skip on return
- **POLSH-02**: Interactive project cards with 3D tilt effect and video preview on hover
- **POLSH-03**: Non-linear/experimental layout — break conventional section flow entirely
- **POLSH-04**: Analytics integration (Plausible or Umami) for visitor tracking

## Out of Scope

| Feature | Reason |
|---------|--------|
| Contact form with backend | Simplified to direct links — no backend/serverless needed |
| Blog/CMS integration | Scope creep — content lives in code. Blog can be separate platform later |
| 3D WebGL scenes (Three.js) | Massive bundle, kills mobile performance, months of dev for one section |
| Particle systems / heavy canvas | Battery killer on mobile, frame drops on mid-range devices |
| Sound/audio effects | Universally disliked — micro-interactions provide delight without annoyance |
| Chatbot / AI assistant | Gimmicky on a portfolio — clear navigation replaces the need |
| Template/theme usage | Portfolio itself is proof of skill — templates signal "I didn't build this" |
| Page-per-section routing | Single page with smooth scroll is faster and simpler for this content volume |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CONT-01 | Phase 2 | Complete |
| CONT-02 | Phase 2 | Complete |
| CONT-03 | Phase 2 | Complete |
| CONT-04 | Phase 2 | Complete |
| CONT-05 | Phase 2 | Pending |
| CONT-06 | Phase 2 | Pending |
| CONT-07 | Phase 2 | Complete |
| DSGN-01 | Phase 1 | Complete |
| DSGN-02 | Phase 2 | Complete |
| DSGN-03 | Phase 3 | Pending |
| DSGN-04 | Phase 3 | Pending |
| DSGN-05 | Phase 3 | Pending |
| DSGN-06 | Phase 2 | Complete |
| ANIM-01 | Phase 3 | Pending |
| ANIM-02 | Phase 3 | Pending |
| ANIM-03 | Phase 3 | Pending |
| ANIM-04 | Phase 3 | Pending |
| INFR-01 | Phase 4 | Pending |
| INFR-02 | Phase 4 | Pending |
| INFR-03 | Phase 4 | Pending |
| INFR-04 | Phase 4 | Pending |
| INFR-05 | Phase 4 | Pending |
| INFR-06 | Phase 1 | Complete |

**Coverage:**
- v1 requirements: 23 total
- Mapped to phases: 23
- Unmapped: 0

---
*Requirements defined: 2026-03-06*
*Last updated: 2026-03-06 after roadmap creation*
