"use client";

import { useTheme } from "@/components/providers/DarkModeProvider";

interface DarkModeToggleProps {
  size?: number;
}

export function DarkModeToggle({ size = 32 }: DarkModeToggleProps) {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="flex items-center justify-center rounded-full transition-all duration-200 hover:-translate-y-0.5"
      style={{
        width: size,
        height: size,
        background: "var(--glass-fill)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "2px solid var(--glass-border)",
        boxShadow: "2px 2px 0px var(--glass-border)",
        color: "var(--text-primary)",
        fontSize: Math.round(size * 14 / 32),
      }}
    >
      {isDark ? "\u2600\uFE0F" : "\u{1F319}"}
    </button>
  );
}
