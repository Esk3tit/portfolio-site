"use client";

import { useRef } from "react";
import { initGSAP, useGSAP } from "@/lib/gsap";
import { experiences } from "@/data/content";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeoBrutalHeading } from "@/components/ui/NeoBrutalHeading";

export function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      (async () => {
        await initGSAP();
        const { gsap, ScrollTrigger, SplitText } = await import("@/lib/gsap");
        if (!gsap || !ScrollTrigger || !SplitText) return;

        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
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

          // Cleanup: revert SplitText instances on unmount
          return () => {
            splitInstances.forEach((s) => s.revert());
          };
        });

        mm.add("(prefers-reduced-motion: reduce)", () => {
          // No SplitText -- instant heading reveal
          const headings = containerRef.current?.querySelectorAll(".split-heading");
          headings?.forEach((heading) => {
            gsap.set(heading, { opacity: 1 });
          });

          // Experience cards -- instant opacity reveal with ScrollTrigger
          gsap.fromTo(".experience-section__card",
            { opacity: 0 },
            { scrollTrigger: { trigger: containerRef.current, start: "top 85%" }, opacity: 1, duration: 0 }
          );
        });

        // Recalculate trigger positions after hydration paint
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            ScrollTrigger.refresh(true);
          });
        });
      })();
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} id="experience" aria-label="Work Experience" className="experience-section relative z-[2] px-6 py-16 sm:py-28 md:px-12">
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
              className={`experience-section__card px-5 py-6 sm:px-8 sm:py-8`}
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
                  style={{ color: "var(--accent-purple-text)" }}
                >
                  {exp.title}
                </p>
                <p
                  className="mt-0.5 text-xs tracking-wide uppercase"
                  style={{ color: "var(--text-secondary)", transition: "color 0.35s ease" }}
                >
                  {exp.dates}
                </p>

                {exp.redacted ? (
                  <>
                    <ul
                      className="mt-4 flex flex-col gap-2"
                      aria-label="Redacted experience details"
                    >
                      {exp.bullets.map((bullet, bi) => (
                        <li
                          key={bi}
                          className="group/redaction flex cursor-help items-start gap-2 text-sm leading-relaxed"
                        >
                          <span
                            className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: "var(--accent-pink)" }}
                          />
                          <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                            <span className="sr-only">
                              Redacted -- details available in resume
                            </span>
                            {/*
                              Each "word" is a solid black censor bar. The fake
                              lorem text only sets the bar width; it is rendered
                              transparent and aria-hidden so nothing meaningful
                              is exposed to readers, the DOM, or assistive tech.
                            */}
                            {bullet.split(" ").map((word, wi) => (
                              <span
                                key={wi}
                                aria-hidden="true"
                                className="select-none rounded-[3px] border border-white/10 bg-black px-1 leading-none text-transparent"
                              >
                                {word}
                              </span>
                            ))}
                            <span
                              aria-hidden="true"
                              title="Shhh..."
                              className="pointer-events-none ml-1 text-base opacity-0 transition-opacity duration-200 group-hover/redaction:opacity-100"
                            >
                              {"\u{1F92B}"}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    {exp.disclaimer && (
                      <p
                        className="mt-4 flex items-center gap-2 text-sm font-medium italic"
                        style={{ color: "var(--text-secondary)", transition: "color 0.35s ease" }}
                      >
                        <span aria-hidden="true">{"\u{1F910}"}</span>
                        {exp.disclaimer}
                      </p>
                    )}
                  </>
                ) : (
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
                )}
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
}
