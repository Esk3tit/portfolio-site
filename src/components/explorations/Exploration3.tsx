"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Exploration3() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".hero-title", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
      });
      gsap.from(".hero-desc", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: "power4.out",
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
        Glassmorphism
      </h1>
      <p className="hero-desc mt-6 max-w-lg text-center text-lg text-text/60">
        Frosted glass panels with backdrop-blur, transparency layers, scroll
        animations, and premium Apple-like polish.
      </p>
    </section>
  );
}
