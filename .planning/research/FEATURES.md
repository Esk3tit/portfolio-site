# Feature Research

**Domain:** Creative/interactive software engineer portfolio website
**Researched:** 2026-03-06
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features visitors (recruiters, hiring managers, fellow devs) assume exist. Missing these = site feels broken or amateurish.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hero/intro section with name and role | First impression; visitors need to know who you are within 2 seconds | LOW | Should convey personality immediately -- not a generic "Hi, I'm a developer" |
| About section | Visitors want to know the person behind the work -- background, interests, what drives you | LOW | Keep concise. 2-3 paragraphs max. Personality > formality |
| Work experience section | Recruiters and hiring managers look for this first; validates professional credibility | MEDIUM | Needs clear timeline/structure. Avoid wall-of-text descriptions |
| Projects showcase | Core proof of technical ability. 4-6 high-quality projects beats 15 mediocre ones | MEDIUM | Each project needs: description, tech stack, link (live/GitHub). Screenshots or demos strongly preferred |
| Skills/tech stack display | Quick scanning for tech fit. Recruiters filter by this | LOW | Organize by category (languages, frameworks, tools). Visual display preferred over plain lists |
| Contact information | Dead-end portfolios lose opportunities. Visitors need a clear next action | LOW | Email, LinkedIn, GitHub links. No form needed (per PROJECT.md) |
| Resume/CV download | Standard expectation for professional portfolios. Recruiters want a PDF to pass along | LOW | Git-committed PDF, single click download. Keep prominent |
| Responsive design (mobile + desktop) | 60%+ of portfolio views happen on mobile. Broken mobile = instant bounce | MEDIUM | All creative effects must degrade gracefully on mobile. Not optional |
| Fast load time (<3s) | Visitors bounce at 3+ seconds. Creative sites are especially at risk due to animation weight | MEDIUM | Lazy load assets, optimize images, minimize JS bundle. Performance budget matters |
| Navigation/wayfinding | Even creative layouts need clear navigation. Visitors should never feel lost | LOW | Can be unconventional but must be discoverable. Keyboard accessible |
| Semantic HTML and basic accessibility | Screen readers, keyboard navigation, and proper heading structure are baseline expectations | MEDIUM | `aria` labels, focus management, sufficient color contrast, reduced-motion support |
| Open Graph / social meta tags | Links shared on LinkedIn, Twitter, Slack need proper preview cards | LOW | Title, description, image. Often forgotten but high-impact for sharing |

### Differentiators (Competitive Advantage)

Features that make this portfolio memorable. These align with the project's core value: "as engaging to interact with as the work it showcases."

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Custom cursor effects | Creates immediate sense of interactivity and craft. Signals "this person cares about details" | MEDIUM | Magnetic cursors near interactive elements, custom cursor shape, trail effects. Must disable on touch devices |
| Scroll-triggered animations | Makes content feel alive as it reveals. Transforms passive reading into active discovery | MEDIUM | Use GSAP ScrollTrigger or Framer Motion. Staggered reveals, parallax layers, text animations. Must respect `prefers-reduced-motion` |
| Smooth page/section transitions | Eliminates the "click and jump" feel. Creates a cohesive, app-like experience | MEDIUM | GSAP FLIP transitions or Framer Motion layout animations. Smooth scroll with Lenis or similar |
| Micro-interactions on hover/click | Small delightful moments that reward exploration -- button morphs, card lifts, icon animations | LOW-MEDIUM | Hover states on cards, magnetic buttons, subtle scale/rotation on interaction. Keep consistent |
| Unexpected/non-linear layout | Breaks the "top-to-bottom sections" pattern that Khai explicitly wants to avoid | HIGH | Overlapping elements, asymmetric grids, sections that break the container. Needs careful responsive handling |
| Text reveal animations | Animated text (split by character/word/line) adds polish and directs attention | MEDIUM | SplitText-style reveals on headings. Staggered character animations. Can use CSS or GSAP |
| Dark mode with animated toggle | Shows attention to UX. The toggle animation itself becomes a micro-interaction | LOW-MEDIUM | Respect system preference via `prefers-color-scheme`. Persist choice in localStorage. Sun/moon toggle animation |
| Loading/intro animation | First-time visitors get a "curtain raise" moment that sets the creative tone | MEDIUM | Keep under 2-3 seconds. Skip on return visits (sessionStorage). Should feel intentional, not like a loading spinner |
| Personality-driven copy and tone | The writing itself differentiates. Playful, human, specific > generic corporate tone | LOW | Not a code feature but critical to the experience. "I build things that..." > "Experienced software engineer with..." |
| Interactive project cards/showcase | Projects that respond to mouse position, tilt, or have mini-previews on hover | MEDIUM | 3D tilt effect on cards, video preview on hover, expandable detail views |
| Noise/grain texture overlay | Adds depth and character vs flat design. Common in award-winning creative portfolios | LOW | CSS background with subtle noise SVG/PNG. Performance-friendly |
| Gradient animations or color shifts | Dynamic color creates energy and visual interest | LOW | CSS animated gradients or WebGL-powered color fields. Keep subtle |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem appealing but actively harm the portfolio's effectiveness.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| 3D WebGL scene as hero | "Bruno Simon's portfolio is amazing" | Massive bundle size (Three.js is 150KB+ min), kills mobile performance, accessibility nightmare, months of dev time for one section | Use 2D canvas effects, CSS 3D transforms, or subtle WebGL accents (not full scenes). Get 80% of the wow at 20% of the cost |
| Contact form with backend | Feels professional | Requires backend/serverless, spam protection, form validation -- all for something a mailto link handles. Per PROJECT.md, explicitly out of scope | Direct email link with `mailto:`, LinkedIn link, GitHub link. Simpler and higher conversion |
| Blog/CMS integration | "I should blog" | Scope creep. Adds content management complexity, SEO concerns, and maintenance burden. Most developer blogs go stale after 3 posts | Out of scope per PROJECT.md. If added later, use a separate subdomain or platform (dev.to, Hashnode) |
| Particle systems / heavy canvas backgrounds | Visually impressive in demos | Kills battery life on mobile, causes frame drops on mid-range devices, distracts from content. Performance constraint in PROJECT.md explicitly warns against this | Use CSS animations, SVG animations, or very lightweight canvas with <50 particles. Less is more |
| Sound/audio effects | "It would be so immersive" | Autoplaying audio is universally hated. Even opt-in audio adds complexity and rarely enhances a portfolio | Silent micro-interactions achieve the same delight without the annoyance |
| Page-per-section routing (SPA with routes) | Feels like a "real app" | Single-page portfolio with smooth scroll is faster, simpler, and better for this content volume. Routing adds complexity for no user benefit | Single page with scroll-based navigation. Use hash anchors for direct linking to sections |
| Analytics dashboard / visitor tracking | "I want to know who views my portfolio" | Adds privacy concerns, cookie banners, and complexity. Not in v1 scope | Add simple analytics (Plausible, Umami) later if needed. No dashboard needed |
| Chatbot / AI assistant | Trendy in 2026 | Gimmicky on a personal portfolio. Adds massive complexity. Visitors want to scan, not chat | Clear navigation and well-structured content replaces any need for a chatbot |
| Overly complex page transitions | "Like those Awwwards sites" | Route-based transitions with FLIP animations are extremely hard to get right, create accessibility issues, and are brittle. Diminishing returns on a single-page site | Smooth scroll + section reveal animations achieve 90% of the effect with 10% of the complexity |
| Template/theme usage | "Faster to launch" | Defeats the purpose. A software engineer's portfolio IS the proof of skill. Templates signal "I didn't build this" | Build from scratch. The portfolio itself is a project that demonstrates ability |

## Feature Dependencies

```
[Responsive Design]
    └──required-by──> [All other features] (everything must work mobile)

[Smooth Scroll Setup]
    └──required-by──> [Scroll-triggered Animations]
                          └──enhances──> [Text Reveal Animations]
                          └──enhances──> [Section Transitions]

[CSS Custom Properties / Design Tokens]
    └──required-by──> [Dark Mode Toggle]
    └──required-by──> [Consistent Micro-interactions]

[Layout System (grid/flex foundations)]
    └──required-by──> [Unexpected/Non-linear Layout]
    └──required-by──> [Interactive Project Cards]

[Custom Cursor Setup]
    └──enhances──> [Magnetic Buttons]
    └──enhances──> [Interactive Project Cards]
    └──conflicts──> [Touch Devices] (must disable gracefully)

[Loading Animation]
    └──must-precede──> [Hero Section Reveal]
    └──independent-of──> [Content Sections]

[prefers-reduced-motion Detection]
    └──required-by──> [All Animations] (must respect user preference)
```

### Dependency Notes

- **Smooth Scroll requires early setup:** All scroll-linked animations depend on the scroll engine (Lenis/GSAP ScrollSmoother). Set up in Phase 1.
- **CSS Custom Properties before Dark Mode:** Color system with CSS variables must exist before dark mode can toggle them.
- **Custom Cursor conflicts with Touch:** Must detect touch devices and disable custom cursor entirely. No hybrid approach works well.
- **prefers-reduced-motion is foundational:** Every animation feature must check this. Build the check once, use everywhere.
- **Layout system before creative layouts:** The grid/flex foundation must be solid before layering on unexpected/asymmetric positioning.

## MVP Definition

### Launch With (v1)

Minimum viable portfolio -- enough to replace khaiphan.dev and make a strong impression.

- [ ] Hero section with personality-driven intro and entrance animation -- first impression is everything
- [ ] About section with background and what Khai does -- builds human connection
- [ ] Work experience section with clear timeline -- validates professional credibility
- [ ] Skills display organized by category -- enables quick tech-fit scanning
- [ ] Projects showcase (4 existing projects) with descriptions and links -- core proof of ability
- [ ] Contact section with email, LinkedIn, GitHub -- enables next action
- [ ] Resume PDF download -- recruiter expectation
- [ ] Responsive design across breakpoints -- non-negotiable
- [ ] Scroll-triggered section reveal animations -- minimum "creative" bar
- [ ] Custom cursor effects (desktop only) -- immediate signal that this is a crafted experience
- [ ] Micro-interactions on buttons, links, and cards -- consistent delight layer
- [ ] Dark mode with system preference detection -- modern UX expectation
- [ ] Open Graph meta tags -- for when links are shared
- [ ] `prefers-reduced-motion` support -- accessibility baseline

### Add After Launch (v1.x)

Features to layer on once the core is solid.

- [ ] Loading/intro animation -- polish layer, not essential for first deploy
- [ ] Text reveal animations (character/word split) -- adds craft to typography
- [ ] Interactive project cards with tilt/hover previews -- elevates the showcase
- [ ] Noise/grain texture overlay -- adds visual depth
- [ ] Gradient animations or dynamic color shifts -- energy and movement
- [ ] Smooth scroll library (Lenis) -- upgrades the scroll feel

### Future Consideration (v2+)

Features to consider once the portfolio is live and validated.

- [ ] Non-linear/unexpected layout experiments -- high complexity, do after foundations are solid
- [ ] Analytics integration (Plausible/Umami) -- once you want visitor data
- [ ] Performance monitoring -- ensure animations stay smooth as features grow
- [ ] Blog or writing section -- only if Khai actively wants to write

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Hero with animation | HIGH | MEDIUM | P1 |
| About section | HIGH | LOW | P1 |
| Work experience | HIGH | MEDIUM | P1 |
| Projects showcase | HIGH | MEDIUM | P1 |
| Skills display | MEDIUM | LOW | P1 |
| Contact section | HIGH | LOW | P1 |
| Resume download | MEDIUM | LOW | P1 |
| Responsive design | HIGH | MEDIUM | P1 |
| Scroll-triggered animations | HIGH | MEDIUM | P1 |
| Custom cursor (desktop) | MEDIUM | MEDIUM | P1 |
| Hover micro-interactions | MEDIUM | LOW | P1 |
| Dark mode toggle | MEDIUM | LOW-MEDIUM | P1 |
| OG meta tags | MEDIUM | LOW | P1 |
| Reduced-motion support | MEDIUM | LOW | P1 |
| Loading animation | MEDIUM | MEDIUM | P2 |
| Text reveal animations | MEDIUM | MEDIUM | P2 |
| Interactive project cards | MEDIUM | MEDIUM | P2 |
| Noise/grain overlay | LOW | LOW | P2 |
| Gradient animations | LOW | LOW | P2 |
| Smooth scroll library | MEDIUM | LOW | P2 |
| Non-linear layout | MEDIUM | HIGH | P3 |
| Analytics | LOW | LOW | P3 |

## Competitor Feature Analysis

| Feature | Bruno Simon (3D) | Brittany Chiang (Minimal) | Joffrey Spitzer (GSAP) | Khai's Approach |
|---------|-----------------|--------------------------|------------------------|-----------------|
| Hero impact | 3D driving game -- extreme wow | Clean type + subtle animation | Minimalist reveal animations | Animated intro with personality, no 3D overhead |
| Navigation | Embedded in 3D scene | Sticky sidebar nav | Minimal, scroll-driven | Creative but discoverable nav |
| Project showcase | Objects in 3D world | Grid with hover details | FLIP transitions between views | Interactive cards with hover effects |
| Scroll experience | Not scroll-based | Standard scroll | GSAP ScrollTrigger | Smooth scroll + triggered animations |
| Cursor | Default | Default | Custom with hover states | Custom cursor with magnetic effects |
| Performance | Heavy (Three.js) | Fast (static) | Good (optimized GSAP) | Target: fast with graceful animation |
| Mobile | Degraded experience | Excellent | Good | Must be excellent |
| Personality | Very high (unique concept) | Professional, understated | Refined, craft-focused | Playful, energetic, Vietnamese engineer identity |

## Sources

- [Webflow - Microinteractions examples](https://webflow.com/blog/microinteractions)
- [Codrops - Joffrey Spitzer Portfolio (Astro + GSAP)](https://tympanus.net/codrops/2026/02/18/joffrey-spitzer-portfolio-a-minimalist-astro-gsap-build-with-reveals-flip-transitions-and-subtle-motion/)
- [Lovable - Best Interactive Websites 2026](https://lovable.dev/guides/best-interactive-websites)
- [Muzli - Top 100 Creative Portfolio Websites 2025](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/)
- [Awwwards - Portfolio Websites](https://www.awwwards.com/websites/portfolio/)
- [CareerFoundry - Software Engineer Portfolio Guide](https://careerfoundry.com/en/blog/web-development/software-engineer-portfolio/)
- [DEV Community - Frontend Developer Portfolio Tips 2025](https://dev.to/siddheshcodes/frontend-developer-portfolio-tips-for-2025-build-a-stunning-site-that-gets-you-hired-3hga)
- [Motion.dev - Scroll Animations](https://motion.dev/docs/react-scroll-animations)
- [Made With GSAP - Examples](https://madewithgsap.com/)
- [HubSpot - Custom Animated Cursors](https://blog.hubspot.com/website/animated-cursor)
- [Codrops - Custom Cursor Effects](https://tympanus.net/codrops/2019/01/31/custom-cursor-effects/)
- [Digital Upward - 2026 Web Design Trends](https://www.digitalupward.com/blog/2026-web-design-trends-glassmorphism-micro-animations-ai-magic/)

---
*Feature research for: Creative interactive software engineer portfolio*
*Researched: 2026-03-06*
