"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const projects = [
  {
    title: "REAL-TIME COLLAB ENGINE",
    description:
      "WebSocket-powered collaborative editing. Multiple cursors, conflict resolution, the whole thing.",
    tags: ["TypeScript", "WebSockets", "CRDT"],
    accent: "bg-pink-500",
    rotate: "rotate-1",
    shadowColor: "shadow-[6px_6px_0px_#ec4899]",
  },
  {
    title: "CLI TASK RUNNER",
    description:
      "A brutally fast task runner for monorepos. No config files, no YAML, just runs.",
    tags: ["Rust", "CLI", "Monorepo"],
    accent: "bg-blue-500",
    rotate: "-rotate-1",
    shadowColor: "shadow-[6px_6px_0px_#3b82f6]",
  },
  {
    title: "DESIGN SYSTEM V2",
    description:
      "Component library with zero runtime CSS. Tokens, variants, dark mode. Ships under 8kb.",
    tags: ["React", "CSS", "Tokens"],
    accent: "bg-yellow-400",
    rotate: "rotate-2",
    shadowColor: "shadow-[6px_6px_0px_#facc15]",
  },
];

export default function Exploration4() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hero animations - snappy, abrupt, slam into place
      gsap.from(".neo-title", {
        y: -120,
        opacity: 0,
        duration: 0.5,
        ease: "power4.out",
      });

      gsap.from(".neo-subtitle", {
        x: -80,
        opacity: 0,
        duration: 0.4,
        delay: 0.2,
        ease: "power4.out",
      });

      gsap.from(".neo-cta", {
        scale: 0,
        rotation: -10,
        opacity: 0,
        duration: 0.4,
        delay: 0.4,
        ease: "back.out(2)",
      });

      gsap.from(".neo-decoration", {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        delay: 0.3,
        ease: "power4.out",
        stagger: 0.1,
      });

      // Project cards - drop in with bounce
      gsap.from(".neo-card", {
        y: -60,
        opacity: 0,
        duration: 0.5,
        ease: "bounce.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".neo-projects",
          start: "top 80%",
        },
      });

      gsap.from(".neo-projects-title", {
        x: 60,
        opacity: 0,
        duration: 0.4,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".neo-projects",
          start: "top 85%",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="bg-yellow-300 text-black">
      {/* HERO SECTION */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
        {/* Decorative shapes */}
        <div className="neo-decoration absolute left-8 top-12 h-20 w-20 rotate-12 border-4 border-black bg-pink-500 shadow-[4px_4px_0px_black] md:left-16 md:h-32 md:w-32" />
        <div className="neo-decoration absolute bottom-20 right-10 h-16 w-16 -rotate-6 rounded-full border-4 border-black bg-blue-500 shadow-[4px_4px_0px_black] md:right-20 md:h-24 md:w-24" />
        <div className="neo-decoration absolute right-12 top-1/4 h-12 w-24 rotate-3 border-4 border-black bg-green-400 shadow-[4px_4px_0px_black] md:right-32" />
        <div className="neo-decoration absolute bottom-1/3 left-6 h-8 w-8 border-4 border-black bg-orange-500 shadow-[3px_3px_0px_black] md:left-24" />

        {/* Main content */}
        <div className="relative z-10 text-center">
          <h1 className="neo-title font-mono text-7xl font-black uppercase leading-none tracking-tighter md:text-[10rem]">
            KHAI
            <br />
            PHAN
          </h1>

          <p className="neo-subtitle mt-6 border-4 border-black bg-white px-6 py-3 font-mono text-lg font-bold shadow-[4px_4px_0px_black] md:text-2xl">
            I build software. Sometimes it&apos;s good.
          </p>

          <button className="neo-cta mt-10 rotate-2 border-4 border-black bg-pink-500 px-10 py-4 font-mono text-xl font-black uppercase text-white shadow-[6px_6px_0px_black] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_black]">
            SEE MY WORK &darr;
          </button>
        </div>

        {/* Bottom border bar */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-black" />
      </section>

      {/* PROJECTS SECTION */}
      <section className="neo-projects border-t-4 border-black bg-white px-6 py-20 md:px-12">
        <h2 className="neo-projects-title mb-16 border-4 border-black bg-yellow-300 px-6 py-4 font-mono text-4xl font-black uppercase shadow-[6px_6px_0px_black] md:inline-block md:text-6xl">
          PROJECTS
        </h2>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.title}
              className={`neo-card ${project.rotate} border-4 border-black bg-white p-6 ${project.shadowColor} transition-all hover:-translate-y-2 hover:shadow-[10px_10px_0px_black]`}
            >
              {/* Colored header bar */}
              <div
                className={`-mx-6 -mt-6 mb-4 border-b-4 border-black ${project.accent} px-6 py-3`}
              >
                <h3 className="font-mono text-lg font-black uppercase text-white">
                  {project.title}
                </h3>
              </div>

              <p className="mb-6 font-mono text-sm leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border-2 border-black bg-yellow-300 px-3 py-1 font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_black]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
