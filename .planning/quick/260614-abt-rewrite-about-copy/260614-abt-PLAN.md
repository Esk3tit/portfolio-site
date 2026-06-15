---
quick_id: 260614-abt
slug: rewrite-about-copy
date: 2026-06-14
status: complete
---

# Quick Task 260614-abt: Rewrite "About Me" copy

## Description

The "What I Do" and "When I'm Not Coding" panels (the entire "About Me" section)
read as overwrought designer-speak ("obsessed with the intersection of
engineering and design", "typography rabbit holes"). Rewrite both in the user's
actual voice: short, straight to the point, a little dry/sarcastic.

User-provided voice anchors:
- "I'm a developer who builds cool and interesting things, learning new tech and
  building useful stuff for me and my friends, all that jazz."
- Off-hours: gaming, chill-mode YouTube, movies, foodie, gym + hike, "all that jazz."

## Scope

- `src/data/content.ts` — `aboutPanels[]` only. Both panels are the single source
  of truth for the section; `AboutSection.tsx` renders them with no other copy.

## Tasks

1. Rewrite `aboutPanels[0].content` ("What I Do") in the new voice — punchy,
   self-deprecating, ends on "All that jazz."
2. Rewrite `aboutPanels[1].content` ("When I'm Not Coding") covering gaming,
   YouTube, movies, food, gym/hiking — same tone.

## Verify

- Both panel strings are short (1 short paragraph each), conversational, and
  carry a touch of sarcasm.
- No structural/type changes; `AboutPanel` shape untouched.
- `npm run lint` / typecheck still pass.

## Done

About section renders the new, less-cringe copy.
