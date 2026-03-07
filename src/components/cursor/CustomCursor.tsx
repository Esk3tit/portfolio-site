"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(true); // default true to avoid flash
  const quickToX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickToY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    // Touch detection
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
    if (isTouch || !dotRef.current) return;

    const dot = dotRef.current;

    // Setup quickTo for smooth cursor following
    quickToX.current = gsap.quickTo(dot, "x", {
      duration: 0.3,
      ease: "power3.out",
    });
    quickToY.current = gsap.quickTo(dot, "y", {
      duration: 0.3,
      ease: "power3.out",
    });

    // Track cursor position for magnetic pull calculations
    const cursorPos = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      cursorPos.x = e.clientX;
      cursorPos.y = e.clientY;
      quickToX.current?.(e.clientX);
      quickToY.current?.(e.clientY);

      // Magnetic pull on nearby [data-magnetic] elements
      const magneticEls = document.querySelectorAll<HTMLElement>("[data-magnetic]");
      magneticEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < 50) {
          const pull = 1 - dist / 50; // 1 at center, 0 at edge
          gsap.to(el, {
            x: distX * pull * 0.3,
            y: distY * pull * 0.3,
            duration: 0.3,
            ease: "power2.out",
            overwrite: true,
          });
        }
      });
    };

    // Hover state handlers for magnetic elements
    const onMagneticEnter = () => {
      gsap.to(dot, {
        width: 32,
        height: 32,
        backgroundColor: "#a78bcd",
        duration: 0.25,
        ease: "power2.out",
      });
    };

    const onMagneticLeave = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      gsap.to(dot, {
        width: 12,
        height: 12,
        backgroundColor: "var(--text-primary)",
        duration: 0.3,
        ease: "power2.out",
      });
      // Reset magnetic pull with elastic snap-back
      gsap.to(target, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    };

    // Attach hover listeners to all magnetic elements
    const attachMagneticListeners = () => {
      const magneticEls = document.querySelectorAll<HTMLElement>("[data-magnetic]");
      magneticEls.forEach((el) => {
        el.addEventListener("mouseenter", onMagneticEnter);
        el.addEventListener("mouseleave", onMagneticLeave);
      });
      return magneticEls;
    };

    // Initial attach
    let magneticEls = attachMagneticListeners();

    // Re-attach on DOM changes (e.g., route transitions, dynamic content)
    const observer = new MutationObserver(() => {
      // Clean up old listeners
      magneticEls.forEach((el) => {
        el.removeEventListener("mouseenter", onMagneticEnter);
        el.removeEventListener("mouseleave", onMagneticLeave);
      });
      magneticEls = attachMagneticListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
      magneticEls.forEach((el) => {
        el.removeEventListener("mouseenter", onMagneticEnter);
        el.removeEventListener("mouseleave", onMagneticLeave);
      });
    };
  }, [isTouchDevice]);

  // Don't render on touch devices
  if (isTouchDevice) return null;

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
      style={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: "var(--text-primary)",
        transform: "translate(-50%, -50%)",
        transition: "background-color 0.35s ease",
      }}
    />
  );
}
