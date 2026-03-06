import Exploration1 from "@/components/explorations/Exploration1";
import Exploration2 from "@/components/explorations/Exploration2";
import Exploration3 from "@/components/explorations/Exploration3";
import Exploration4 from "@/components/explorations/Exploration4";
import Exploration5 from "@/components/explorations/Exploration5";

const explorations: Record<string, React.ComponentType> = {
  "1": Exploration1,
  "2": Exploration2,
  "3": Exploration3,
  "4": Exploration4,
  "5": Exploration5,
};

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }];
}

export default async function ExplorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ExplorationComponent = explorations[id];

  if (!ExplorationComponent) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <h1 className="font-display text-3xl font-bold">Design not found</h1>
      </main>
    );
  }

  return <ExplorationComponent />;
}
