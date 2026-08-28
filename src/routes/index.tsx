import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Overview } from "@/components/dashboard/Overview";
import { BreakerGrid } from "@/components/circuits/BreakerGrid";
import { NilmPanel } from "@/components/nilm/NilmPanel";
import { LoadPanel } from "@/components/load/LoadPanel";
import { VppPanel } from "@/components/vpp/VppPanel";
import { ArchitecturePanel } from "@/components/architecture/ArchitecturePanel";
import { PrototypeGallery } from "@/components/prototypes/PrototypeGallery";
import { BlueprintsPanel } from "@/components/blueprints/BlueprintsPanel";
import { TechPanel } from "@/components/tech/TechPanel";
import { useIpcStore } from "@/lib/ipc/store";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const view = useIpcStore((s) => s.view);

  return (
    <AppShell>
      {view === "overview" && <Overview />}
      {view === "circuits" && <BreakerGrid />}
      {view === "nilm" && <NilmPanel />}
      {view === "load" && <LoadPanel />}
      {view === "vpp" && <VppPanel />}
      {view === "tech" && <TechPanel />}
      {view === "prototypes" && <PrototypeGallery />}
      {view === "blueprints" && <BlueprintsPanel />}
      {view === "architecture" && <ArchitecturePanel />}
    </AppShell>
  );
}
