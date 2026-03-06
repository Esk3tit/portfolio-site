"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Exploration5() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".hero-title", {
        y: 80,
        opacity: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
      gsap.from(".hero-desc", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        ease: "elastic.out(1, 0.5)",
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
        Video Game-Inspired
      </h1>
      <p className="hero-desc mt-6 max-w-lg text-center text-lg text-text/60">
        Animated, interactive elements evoking game UI with a HUD feel, kept
        clean and not over-the-top.
      </p>
    </section>
  );
}
