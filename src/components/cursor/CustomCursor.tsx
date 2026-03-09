"use client";

import { useEffect, useState, useRef } from "react";
import { initGSAP } from "@/lib/gsap";

/**
 * MagneticPull -- invisible component that adds magnetic pull behavior
 * to elements with [data-magnetic]. The actual cursor is handled via
 * CSS `cursor: url(...)` in globals.css.
 */
export function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    let cancelled = false;

    (async () => {
      await initGSAP();
      if (cancelled) return;
      const { gsap } = await import("@/lib/gsap");
      if (!gsap || cancelled) return;

      // Magnetic pull on nearby [data-magnetic] elements
      const PULL_RADIUS = 60; // px from element edge
      const activeEls = new Set<HTMLElement>();

      const onMouseMove = (e: MouseEvent) => {
        const magneticEls = document.querySelectorAll<HTMLElement>("[data-magnetic]");
        magneticEls.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distX = e.clientX - centerX;
          const distY = e.clientY - centerY;
          // Distance from edge of element, not center
          const edgeDistX = Math.max(0, Math.abs(distX) - rect.width / 2);
          const edgeDistY = Math.max(0, Math.abs(distY) - rect.height / 2);
          const edgeDist = Math.sqrt(edgeDistX * edgeDistX + edgeDistY * edgeDistY);

          if (edgeDist < PULL_RADIUS) {
            const pull = 1 - edgeDist / PULL_RADIUS;
            gsap.to(el, {
              x: distX * pull * 0.12,
              y: distY * pull * 0.12,
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
            activeEls.add(el);
          } else if (activeEls.has(el)) {
            // Snap back when leaving pull zone
            gsap.to(el, {
              x: 0,
              y: 0,
              duration: 0.5,
              ease: "elastic.out(1, 0.3)",
              overwrite: "auto",
            });
            activeEls.delete(el);
          }
        });
      };

      window.addEventListener("mousemove", onMouseMove);

      cleanupRef.current = () => {
        window.removeEventListener("mousemove", onMouseMove);
        activeEls.forEach((el) => {
          gsap.set(el, { x: 0, y: 0 });
        });
        activeEls.clear();
      };
    })();

    return () => {
      cancelled = true;
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [isTouchDevice]);

  // No DOM element needed -- cursor is CSS-based, this only handles magnetic pull
  return null;
}
