"use client";

import { useState, useRef, useCallback } from "react";
import { initGSAP } from "@/lib/gsap";
import { useLenis } from "lenis/react";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";

const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  const openDrawer = useCallback(async () => {
    setIsOpen(true);
    const drawer = drawerRef.current;
    if (!drawer) return;

    lenis?.stop();

    await initGSAP();
    const { gsap } = await import("@/lib/gsap");
    if (!gsap) return;

    // Make visible before animating
    drawer.style.visibility = "visible";

    const tl = gsap.timeline();
    tl.fromTo(
      drawer,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
    );
    tl.fromTo(
      drawer.querySelectorAll(".mobile-nav__link"),
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.06,
        duration: 0.3,
        ease: "power3.out",
      },
      "-=0.2"
    );
  }, [lenis]);

  const closeDrawer = useCallback(async () => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    await initGSAP();
    const { gsap } = await import("@/lib/gsap");
    if (!gsap) return;

    gsap.to(drawer, {
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        drawer.style.visibility = "hidden";
        setIsOpen(false);
        lenis?.start();
      },
    });
  }, [lenis]);

  const scrollTo = useCallback(
    (id: string) => {
      closeDrawer();
      setTimeout(() => {
        lenis?.scrollTo(`#${id}`, { offset: -80, duration: 1.2 });
      }, 350);
    },
    [closeDrawer, lenis]
  );

  return (
    <>
      {/* Hamburger button */}
      <button
        className="mobile-nav__hamburger fixed right-4 top-4 z-[60] flex items-center justify-center rounded-full md:hidden"
        style={{
          width: 44,
          height: 44,
          background: "var(--glass-fill)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "2px solid var(--glass-border)",
          boxShadow: "2px 2px 0px var(--glass-border)",
        }}
        onClick={() => (isOpen ? closeDrawer() : openDrawer())}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <div className="relative flex flex-col items-center justify-center" style={{ width: 20, height: 14 }}>
          <span
            className="absolute left-0 block rounded-full transition-all duration-300"
            style={{
              width: 20,
              height: 2,
              background: "var(--text-primary)",
              top: isOpen ? 6 : 0,
              transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            }}
          />
          <span
            className="absolute left-0 block rounded-full transition-all duration-300"
            style={{
              width: 20,
              height: 2,
              background: "var(--text-primary)",
              top: 6,
              opacity: isOpen ? 0 : 1,
            }}
          />
          <span
            className="absolute left-0 block rounded-full transition-all duration-300"
            style={{
              width: 20,
              height: 2,
              background: "var(--text-primary)",
              top: isOpen ? 6 : 12,
              transform: isOpen ? "rotate(-45deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </button>

      {/* Drawer overlay */}
      <div
        ref={drawerRef}
        className="fixed inset-0 z-[55] flex flex-col items-center justify-center"
        style={{
          visibility: "hidden",
          opacity: 0,
          background:
            "linear-gradient(160deg, var(--glass-fill) 0%, var(--glass-fill-end, var(--glass-fill)) 100%)",
          backdropFilter: "blur(40px) saturate(1.6)",
          WebkitBackdropFilter: "blur(40px) saturate(1.6)",
        }}
        onClick={closeDrawer}
      >
        <nav
          className="flex flex-col items-center gap-6"
          onClick={(e) => e.stopPropagation()}
          aria-label="Mobile navigation"
        >
          {sections.map((section) => (
            <button
              key={section.id}
              className="mobile-nav__link text-2xl font-bold transition-colors duration-200"
              style={{
                color: "var(--text-primary)",
                fontFamily: "var(--font-display)",
                minHeight: 44,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => scrollTo(section.id)}
            >
              {section.label}
            </button>
          ))}

          <div className="mt-8">
            <DarkModeToggle size={44} />
          </div>
        </nav>
      </div>
    </>
  );
}
