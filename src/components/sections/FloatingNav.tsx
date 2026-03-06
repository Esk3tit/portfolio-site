"use client";

import { useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export function FloatingNav() {
  const [activeSection, setActiveSection] = useState<string>("about");
  const lenis = useLenis();

  useGSAP(() => {
    // Show/hide based on scroll past hero
    ScrollTrigger.create({
      trigger: "#about",
      start: "top 90%",
      onEnter: () =>
        gsap.to(".e6-floating-nav", {
          opacity: 1,
          pointerEvents: "auto",
          duration: 0.3,
        }),
      onLeaveBack: () =>
        gsap.to(".e6-floating-nav", {
          opacity: 0,
          pointerEvents: "none",
          duration: 0.3,
        }),
    });

    // Track active section
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: `#${section.id}`,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => setActiveSection(section.id),
        onEnterBack: () => setActiveSection(section.id),
      });
    });

    // Refresh after hydration to ensure correct trigger positions
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh(true);
      });
    });
  });

  const scrollTo = (id: string) => {
    lenis?.scrollTo(`#${id}`, { offset: -80, duration: 1.2 });
  };

  return (
    <nav
      className="e6-floating-nav fixed right-6 top-1/2 z-50 -translate-y-1/2 opacity-0 pointer-events-none hidden md:flex"
      aria-label="Section navigation"
    >
      <div className="flex flex-col items-center gap-3">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className="group relative flex items-center"
              aria-label={`Scroll to ${section.label}`}
            >
              {/* Tooltip label — appears on hover */}
              <span
                className="absolute right-full mr-3 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold opacity-0 transition-all duration-200 group-hover:opacity-100"
                style={{
                  background: "rgba(61, 50, 72, 0.85)",
                  color: "#fff",
                  backdropFilter: "blur(8px)",
                  border: "1.5px solid rgba(255,255,255,0.15)",
                }}
              >
                {section.label}
              </span>

              {/* Dot */}
              <span
                className="block rounded-full transition-all duration-200"
                style={{
                  width: isActive ? 12 : 8,
                  height: isActive ? 12 : 8,
                  background: isActive
                    ? "#a78bcd"
                    : "rgba(61, 50, 72, 0.3)",
                  backdropFilter: "blur(4px)",
                  border: isActive
                    ? "2px solid #3d3248"
                    : "1.5px solid rgba(61, 50, 72, 0.2)",
                  boxShadow: isActive
                    ? "2px 2px 0px #3d3248"
                    : "none",
                }}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
