"use client";

import { useTheme } from "@/components/providers/DarkModeProvider";

export function DarkModeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="flex items-center justify-center rounded-full transition-all duration-200 hover:-translate-y-0.5"
      style={{
        width: 32,
        height: 32,
        background: "var(--glass-fill)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "2px solid var(--glass-border)",
        boxShadow: "2px 2px 0px var(--glass-border)",
        color: "var(--text-primary)",
        fontSize: 14,
      }}
    >
      {isDark ? "\u2600\uFE0F" : "\u{1F319}"}
    </button>
  );
}
