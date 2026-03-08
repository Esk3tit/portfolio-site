"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, SplitText } from "@/lib/gsap";
import { skillCategories } from "@/data/content";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeoBrutalHeading } from "@/components/ui/NeoBrutalHeading";
import { NeoBrutalTag } from "@/components/ui/NeoBrutalTag";

export function SkillsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Track SplitText instances for cleanup
      const splitInstances: InstanceType<typeof SplitText>[] = [];

      // Word-split heading animation
      const headings = containerRef.current?.querySelectorAll(".split-heading");
      headings?.forEach((heading) => {
        const split = new SplitText(heading, { type: "words" });
        splitInstances.push(split);
        gsap.fromTo(
          split.words,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: heading, start: "top 85%" },
          }
        );
      });

      // Skill categories stagger animation
      gsap.fromTo(".skills-section__category",
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: containerRef.current, start: "top 85%" }, y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" }
      );

      // Recalculate trigger positions after hydration paint
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh(true);
        });
      });

      // Cleanup: revert SplitText instances on unmount
      return () => {
        splitInstances.forEach((s) => s.revert());
      };
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} id="skills" className="skills-section relative z-[2] px-6 py-28 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <NeoBrutalHeading emoji={"\u{1F9E0}"} rotate="-1deg">
            Skills
          </NeoBrutalHeading>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {skillCategories.map((category) => (
            <GlassPanel
              key={category.name}
              className="skills-section__category px-8 py-8"
              tilt
            >
              <h3
                className="mb-4 text-sm font-bold tracking-[0.2em] uppercase"
                style={{
                  color: "var(--text-primary)",
                  fontFamily:
                    "var(--font-display, 'Space Grotesk', system-ui, sans-serif)",
                  transition: "color 0.35s ease",
                }}
              >
                {category.emoji} {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <NeoBrutalTag key={skill}>{skill}</NeoBrutalTag>
                ))}
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
}
