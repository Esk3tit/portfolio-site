"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, SplitText } from "@/lib/gsap";
import { experiences } from "@/data/content";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeoBrutalHeading } from "@/components/ui/NeoBrutalHeading";

export function ExperienceSection() {
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

      // Experience cards stagger animation
      gsap.fromTo(".experience-section__card",
        { y: 50, opacity: 0, scale: 0.95 },
        { scrollTrigger: { trigger: containerRef.current, start: "top 85%" }, y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: "power3.out" }
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
    <section ref={containerRef} id="experience" className="experience-section relative z-[2] px-6 py-28 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <NeoBrutalHeading emoji={"\u{1F4BC}"} rotate="1deg">
            Experience
          </NeoBrutalHeading>
        </div>

        <div className="flex flex-col gap-8">
          {experiences.map((exp, i) => (
            <GlassPanel
              key={exp.company}
              className={`experience-section__card px-8 py-8`}
              rotate={i % 2 === 0 ? "0.5deg" : "-0.5deg"}
              tilt
            >
              {/* Emoji badge */}
              <GlassPanel
                className="absolute -top-3 -left-3 flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                rotate={`${i % 2 === 0 ? -3 : 3}deg`}
              >
                {exp.emoji}
              </GlassPanel>

              <div className="ml-6">
                <h3
                  className="text-xl font-bold"
                  style={{
                    color: "var(--text-primary)",
                    fontFamily:
                      "var(--font-display, 'Space Grotesk', system-ui, sans-serif)",
                    transition: "color 0.35s ease",
                  }}
                >
                  {exp.company}
                </h3>
                <p
                  className="mt-1 text-sm font-semibold"
                  style={{ color: "var(--accent-purple)" }}
                >
                  {exp.title}
                </p>
                <p
                  className="mt-0.5 text-xs tracking-wide uppercase"
                  style={{ color: "var(--text-secondary)", transition: "color 0.35s ease" }}
                >
                  {exp.dates}
                </p>

                <ul className="mt-4 flex flex-col gap-2">
                  {exp.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-sm leading-relaxed"
                      style={{ color: "var(--text-body)", transition: "color 0.35s ease" }}
                    >
                      <span
                        className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: "var(--accent-pink)" }}
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
}
