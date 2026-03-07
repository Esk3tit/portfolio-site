"use client";

import { useRef, useCallback, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

interface NeoBrutalTagProps {
  children: ReactNode;
  className?: string;
}

export function NeoBrutalTag({ children, className = "" }: NeoBrutalTagProps) {
  const tagRef = useRef<HTMLSpanElement>(null);

  const onMouseEnter = useCallback(() => {
    // Only animate on devices with hover capability
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (!tagRef.current) return;
    gsap.to(tagRef.current, {
      rotation: gsap.utils.random(-3, 3),
      scale: 1.1,
      duration: 0.2,
      ease: "power2.out",
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    if (!tagRef.current) return;
    gsap.to(tagRef.current, {
      rotation: 0,
      scale: 1,
      duration: 0.3,
      ease: "elastic.out(1, 0.4)",
    });
  }, []);

  return (
    <span
      ref={tagRef}
      className={`inline-block px-3 py-1 text-xs font-bold uppercase ${className}`}
      style={{
        background: "var(--tag-bg)",
        border: "2px solid var(--glass-border)",
        boxShadow: "2px 2px 0px var(--glass-border)",
        color: "var(--text-primary)",
        transition: "background 0.35s ease, color 0.35s ease, border-color 0.35s ease",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </span>
  );
}
