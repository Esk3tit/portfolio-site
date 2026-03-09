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
  metadataBase: new URL("https://khaiphan.dev"),
  title: "Khai Phan",
  description: "I build software. Sometimes it's good.",
  openGraph: {
    title: "Khai Phan",
    description: "I build software. Sometimes it's good.",
    url: "https://khaiphan.dev",
    siteName: "Khai Phan",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Khai Phan - Software Engineer",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Khai Phan",
    description: "I build software. Sometimes it's good.",
    images: ["/og-image.png"],
  },
  other: {
    "apple-mobile-web-app-title": "Khai Phan",
  },
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
        {/* Banana cursor — inline style to bypass Lightningcss stripping url() */}
        <style dangerouslySetInnerHTML={{ __html: `@media (pointer: fine) { * { cursor: url("/habbycursor.png") 38 2, auto !important; } }` }} />
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
