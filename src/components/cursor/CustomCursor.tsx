"use client";

import { useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * MagneticPull -- invisible component that adds magnetic pull behavior
 * to elements with [data-magnetic]. The actual cursor is handled via
 * CSS `cursor: url(...)` in globals.css.
 */
export function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    // Magnetic pull on nearby [data-magnetic] elements
    const onMouseMove = (e: MouseEvent) => {
      const magneticEls = document.querySelectorAll<HTMLElement>("[data-magnetic]");
      magneticEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < 50) {
          const pull = 1 - dist / 50;
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

    // Snap-back on mouseleave for magnetic elements
    const onMagneticLeave = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      gsap.to(target, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    };

    const attachMagneticListeners = () => {
      const magneticEls = document.querySelectorAll<HTMLElement>("[data-magnetic]");
      magneticEls.forEach((el) => {
        el.addEventListener("mouseleave", onMagneticLeave);
      });
      return magneticEls;
    };

    let magneticEls = attachMagneticListeners();

    // Re-attach on DOM changes
    const observer = new MutationObserver(() => {
      magneticEls.forEach((el) => {
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
        el.removeEventListener("mouseleave", onMagneticLeave);
      });
    };
  }, [isTouchDevice]);

  // No DOM element needed -- cursor is CSS-based, this only handles magnetic pull
  return null;
}
