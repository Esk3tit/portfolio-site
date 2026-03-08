"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, SplitText } from "@/lib/gsap";
import { contactLinks } from "@/data/content";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeoBrutalButton } from "@/components/ui/NeoBrutalButton";
import { NeoBrutalHeading } from "@/components/ui/NeoBrutalHeading";

export function ContactSection() {
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

      // Contact cards stagger animation
      gsap.fromTo(".contact-section__card",
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: containerRef.current, start: "top 85%" }, y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out" }
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
    <section ref={containerRef} id="contact" className="contact-section relative z-[2] px-6 py-28 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <NeoBrutalHeading emoji={"\u{1F4AC}"} rotate="1deg">
            Get In Touch
          </NeoBrutalHeading>
        </div>

        <GlassPanel className="px-8 py-10 md:px-12" tilt>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            {contactLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.name !== "Email" ? "_blank" : undefined}
                rel={link.name !== "Email" ? "noopener noreferrer" : undefined}
                className="contact-section__card group w-full sm:w-auto"
                data-magnetic
              >
                <GlassPanel
                  className="flex flex-col items-center gap-2 px-8 py-6 text-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_#3d3248]"
                  tilt
                >
                  <span className="text-3xl">{link.emoji}</span>
                  <p
                    className="text-sm font-bold uppercase tracking-wider"
                    style={{
                      color: "var(--text-primary)",
                      fontFamily:
                        "var(--font-display, 'Space Grotesk', system-ui, sans-serif)",
                      transition: "color 0.35s ease",
                    }}
                  >
                    {link.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-secondary)", transition: "color 0.35s ease" }}
                  >
                    {link.label}
                  </p>
                </GlassPanel>
              </a>
            ))}
          </div>

          {/* Resume download -- second touchpoint */}
          <div className="mt-8 flex justify-center">
            <NeoBrutalButton
              href="/resume.pdf"
              download="Khai_Phan_Resume.pdf"
              color="#a78bcd"
              rotate="-1deg"
            >
              Download Resume {"\u{1F4C4}"}
            </NeoBrutalButton>
          </div>

          {/* Warm closing copy */}
          <p
            className="mt-8 text-center text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)", transition: "color 0.35s ease" }}
          >
            Whether it&apos;s a project idea, a job opportunity, or you just want to talk
            about animation easing curves -- I&apos;m always down to chat. Don&apos;t be a stranger.
          </p>
        </GlassPanel>
      </div>
    </section>
  );
}
