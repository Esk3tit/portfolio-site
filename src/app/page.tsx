import Link from "next/link";

const explorations = [
  {
    id: 1,
    name: "Light + Airy",
    description: "Generous whitespace, soft pastels, elegant minimalism",
  },
  {
    id: 2,
    name: "Colorful + Playful",
    description: "Saturated colors, fun energy, personality-forward",
  },
  {
    id: 3,
    name: "Glassmorphism",
    description:
      "Frosted glass panels, transparency layers, Apple-like polish",
  },
  {
    id: 4,
    name: "Neobrutalism",
    description: "Thick borders, raw shapes, bold colors, anti-polish",
  },
  {
    id: 5,
    name: "Video Game-Inspired",
    description: "Game UI elements, HUD feel, interactive but clean",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-20">
      <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
        Design Explorations
      </h1>
      <p className="mt-4 max-w-xl text-lg text-text/60">
        Browse each direction, then pick your favorite.
      </p>

      <nav className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {explorations.map((exp) => (
          <Link
            key={exp.id}
            href={`/explore/${exp.id}`}
            className="group rounded-xl border border-text/10 p-6 transition-colors hover:border-primary-500/40 hover:bg-primary-500/5"
          >
            <h2 className="font-display text-xl font-semibold group-hover:text-primary-500">
              {exp.name}
            </h2>
            <p className="mt-2 text-sm text-text/50">{exp.description}</p>
          </Link>
        ))}
      </nav>
    </main>
  );
}
