"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Exploration2() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".hero-title", {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)",
      });
      gsap.from(".hero-desc", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "back.out(1.7)",
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="flex min-h-screen flex-col items-center justify-center px-6"
    >
      <h1 className="hero-title font-display text-5xl font-bold tracking-tight md:text-7xl">
        Colorful + Playful
      </h1>
      <p className="hero-desc mt-6 max-w-lg text-center text-lg text-text/60">
        Saturated colors, unexpected color combinations, fun energy, and a
        personality-forward design.
      </p>
    </section>
  );
}
