import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { SmoothScrollProvider } from "@/components/providers/SmoothScroll";
import { DarkModeProvider } from "@/components/providers/DarkModeProvider";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Khai Phan - Software Engineer",
  description: "I build software. Sometimes it's good.",
};

// Inline script to prevent flash of wrong theme (FOUC).
// Runs before React hydrates so .dark class is set before first paint.
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-body antialiased">
        <CustomCursor />
        <DarkModeProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
