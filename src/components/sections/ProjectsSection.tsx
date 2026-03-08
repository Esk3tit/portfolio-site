"use client";

import { useRef, useState, useCallback } from "react";
import { gsap, ScrollTrigger, useGSAP, SplitText } from "@/lib/gsap";
import { projects } from "@/data/content";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeoBrutalButton } from "@/components/ui/NeoBrutalButton";
import { NeoBrutalHeading } from "@/components/ui/NeoBrutalHeading";
import { NeoBrutalTag } from "@/components/ui/NeoBrutalTag";

export function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  const toggleProject = useCallback(
    (index: number) => {
      const detailEl = document.querySelector(`.projects-section__detail-${index}`);
      if (!detailEl) return;

      if (expandedProject === index) {
        // Collapse
        gsap.to(detailEl, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => setExpandedProject(null),
        });
      } else {
        // Collapse previous if any
        if (expandedProject !== null) {
          const prevEl = document.querySelector(
            `.projects-section__detail-${expandedProject}`
          );
          if (prevEl) {
            gsap.to(prevEl, {
              height: 0,
              opacity: 0,
              duration: 0.3,
              ease: "power2.inOut",
            });
          }
        }
        // Expand new
        setExpandedProject(index);
        gsap.fromTo(
          detailEl,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" }
        );
      }
    },
    [expandedProject]
  );

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

      // Projects heading slide-in
      gsap.fromTo(".projects-section__heading",
        { x: -50, opacity: 0 },
        { scrollTrigger: { trigger: ".projects-section", start: "top 85%" }, x: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
      );

      // Project cards stagger
      gsap.fromTo(".projects-section__card",
        { y: 60, opacity: 0, scale: 0.95 },
        { scrollTrigger: { trigger: ".projects-section", start: "top 85%" }, y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: "power3.out" }
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
    <section ref={containerRef} id="projects" className="projects-section relative z-[2] px-6 py-28 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="projects-section__heading mb-14">
          <NeoBrutalHeading emoji={"\u{1F6E0}\uFE0F"} rotate="-1deg">
            Things I&apos;ve Built
          </NeoBrutalHeading>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project, index) => (
            <GlassPanel
              key={project.title}
              className="projects-section__card group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#3d3248]"
              style={{ overflow: "visible" }}
              tilt
            >
              {/* Clickable card face */}
              <div onClick={() => toggleProject(index)}>
                {/* Neobrutalist colored header bar */}
                <div
                  className="flex items-center justify-between gap-3 overflow-hidden px-6 py-3"
                  style={{
                    background: project.headerColor,
                    borderBottom: "3px solid var(--glass-border)",
                    borderRadius: "1rem 1rem 0 0",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{project.emoji}</span>
                    <h3
                      className="text-sm font-bold uppercase tracking-wider text-white"
                      style={{
                        fontFamily:
                          "var(--font-display, 'Space Grotesk', system-ui, sans-serif)",
                      }}
                    >
                      {project.title}
                    </h3>
                  </div>
                  <span
                    className="text-xs font-semibold uppercase tracking-wide text-white/80 transition-colors group-hover:text-white"
                  >
                    {expandedProject === index ? "Close" : "View Details"}
                  </span>
                </div>

                <div className="px-6 py-6">
                  <p
                    className="mb-5 text-sm leading-relaxed"
                    style={{ color: "var(--text-body)", transition: "color 0.35s ease" }}
                  >
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <NeoBrutalTag key={tag}>{tag}</NeoBrutalTag>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expandable case study detail */}
              <div
                className={`projects-section__detail-${index}`}
                style={{ height: 0, opacity: 0, overflow: "hidden" }}
              >
                <div
                  className="border-t-2 px-6 pb-6 pt-5"
                  style={{ borderColor: "rgba(61, 50, 72, 0.2)" }}
                >
                  <div className="mb-4">
                    <p
                      className="mb-1 text-xs font-bold uppercase tracking-wider"
                      style={{ color: project.headerColor }}
                    >
                      The Problem
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-body)", transition: "color 0.35s ease" }}
                    >
                      {project.problem}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p
                      className="mb-1 text-xs font-bold uppercase tracking-wider"
                      style={{ color: project.headerColor }}
                    >
                      My Approach
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-body)", transition: "color 0.35s ease" }}
                    >
                      {project.approach}
                    </p>
                  </div>

                  <div className="mb-5">
                    <p
                      className="mb-2 text-xs font-bold uppercase tracking-wider"
                      style={{ color: project.headerColor }}
                    >
                      Key Highlights
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {project.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2 text-sm leading-relaxed"
                          style={{ color: "var(--text-body)", transition: "color 0.35s ease" }}
                        >
                          <span
                            className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: project.headerColor }}
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {project.github && (
                      <NeoBrutalButton
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        color={project.headerColor}
                        rotate="0deg"
                        className="text-xs"
                      >
                        GitHub {"\u{1F431}"}
                      </NeoBrutalButton>
                    )}
                    {project.liveUrl && (
                      <NeoBrutalButton
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="#8bb4d4"
                        rotate="0deg"
                        className="text-xs"
                      >
                        Live Demo {"\u{1F680}"}
                      </NeoBrutalButton>
                    )}
                  </div>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
}
