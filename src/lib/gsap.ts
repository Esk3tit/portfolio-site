"use client";

import { useGSAP } from "@gsap/react";

// Re-export useGSAP synchronously (it's tiny, no perf concern)
export { useGSAP };

// Lazy-loaded GSAP instances
let gsapInstance: typeof import("gsap").gsap | undefined;
let ScrollTriggerPlugin: typeof import("gsap/ScrollTrigger").ScrollTrigger | undefined;
let SplitTextPlugin: typeof import("gsap/SplitText").SplitText | undefined;
let initPromise: Promise<void> | null = null;

export async function initGSAP() {
  if (gsapInstance) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const [gsapModule, stModule, splitModule] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/SplitText"),
    ]);
    gsapInstance = gsapModule.gsap;
    ScrollTriggerPlugin = stModule.ScrollTrigger;
    SplitTextPlugin = splitModule.SplitText;
    gsapInstance.registerPlugin(ScrollTriggerPlugin, SplitTextPlugin, useGSAP);
  })();

  return initPromise;
}

// Getter exports that throw if accessed before init (development safety)
export function getGSAP() {
  if (!gsapInstance) throw new Error("Call initGSAP() first");
  return gsapInstance;
}

export function getScrollTrigger() {
  if (!ScrollTriggerPlugin) throw new Error("Call initGSAP() first");
  return ScrollTriggerPlugin;
}

export function getSplitText() {
  if (!SplitTextPlugin) throw new Error("Call initGSAP() first");
  return SplitTextPlugin;
}

// For backward compat: proxy exports (will be undefined until initGSAP resolves)
export { gsapInstance as gsap, ScrollTriggerPlugin as ScrollTrigger, SplitTextPlugin as SplitText };
