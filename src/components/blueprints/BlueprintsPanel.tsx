import { useMemo, useState } from "react";
import { DRAWING_REGISTER, type DrawingRecord } from "@/lib/ipc/blueprints";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText, Layers, Maximize2, X } from "lucide-react";
import { OneLineDiagram } from "./OneLineDiagram";
import { GateDriverSchematic } from "./GateDriverSchematic";
import { NilmPipeline } from "./NilmPipeline";
import { StsDiagram } from "./StsDiagram";
import { BreakerBom } from "./BreakerBom";
import { NetworkTopology } from "./NetworkTopology";
import { PcbLayoutConstraints } from "./PcbLayoutConstraints";

export function BlueprintsPanel() {
  const [selectedId, setSelectedId] = useState("PCB-001");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const selected = useMemo(
    () => DRAWING_REGISTER.find((d) => d.id === selectedId) ?? DRAWING_REGISTER[0]!,
    [selectedId],
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Engineering Blueprints</h1>
          <p className="text-sm text-fg-muted">
            Controlled drawing package · PCB layout constraints · pin-accurate schematics · rated one-lines
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="warn">Controlled Document</Badge>
          <Badge variant="outline">Rev A · 2026-06-22</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-4 text-accent" />
            Drawing Register
          </CardTitle>
          <CardDescription>
            Master index — verify latest revision before fabrication. Dimensions in millimetres unless noted.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="border-y border-border bg-surface-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                <tr>
                  <th className="px-4 py-2.5">Dwg No.</th>
                  <th className="px-3 py-2.5">Rev</th>
                  <th className="px-3 py-2.5">Title</th>
                  <th className="px-3 py-2.5">Type</th>
                  <th className="px-3 py-2.5">Standard</th>
                  <th className="px-3 py-2.5">Drawn</th>
                  <th className="px-4 py-2.5">Sheet</th>
                </tr>
              </thead>
              <tbody>
                {DRAWING_REGISTER.map((d) => {
                  const active = d.id === selectedId;
                  return (
                    <tr
                      key={d.id}
                      className={cn(
                        "cursor-pointer border-b border-border transition-colors",
                        active ? "bg-primary-soft/40" : "hover:bg-surface-2",
                      )}
                      onClick={() => setSelectedId(d.id)}
                    >
                      <td className="px-4 py-2.5 font-mono font-medium text-accent">{d.id}</td>
                      <td className="px-3 py-2.5 font-mono">{d.rev}</td>
                      <td className="px-3 py-2.5 text-fg">{d.title}</td>
                      <td className="px-3 py-2.5">
                        <Badge variant={active ? "primary" : "outline"}>{d.kind}</Badge>
                      </td>
                      <td className="px-3 py-2.5 text-fg-muted">{d.standard}</td>
                      <td className="px-3 py-2.5 text-fg-muted">
                        {d.drawnBy} · {d.date}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-fg-muted">{d.sheet}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {DRAWING_REGISTER.map((d) => (
          <Button
            key={d.id}
            size="sm"
            variant={d.id === selectedId ? "default" : "secondary"}
            className="shrink-0 font-mono"
            onClick={() => setSelectedId(d.id)}
          >
            {d.id}
          </Button>
        ))}
      </div>

      <Card className="overflow-hidden border-primary/20">
        <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 border-b border-border bg-bg-elevated">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-semibold text-accent">{selected.id}</span>
              <Badge variant="outline">Rev {selected.rev}</Badge>
              <Badge variant="default">{selected.kind}</Badge>
            </div>
            <CardTitle className="mt-1 text-base">{selected.title}</CardTitle>
            <CardDescription>
              {selected.standard} · {selected.drawnBy} · {selected.date} · {selected.sheet}
            </CardDescription>
          </div>
          {selected.image && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setLightbox(selected.image!)}
              className="shrink-0"
            >
              <Maximize2 className="size-3.5" />
              Full sheet
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4 bg-[#05080c] p-3 sm:p-5">
          <DrawingBody drawing={selected} onOpenImage={setLightbox} />
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        {DRAWING_REGISTER.filter((d) => d.image).map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setSelectedId(d.id)}
            className={cn(
              "group overflow-hidden rounded-xl border text-left transition-colors",
              selectedId === d.id
                ? "border-primary/50 bg-primary-soft/20"
                : "border-border bg-surface hover:border-border-strong",
            )}
          >
            <div className="aspect-[3/2] overflow-hidden bg-bg">
              <img
                src={d.image}
                alt={d.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
            <div className="flex items-center gap-2 p-3">
              <Layers className="size-3.5 shrink-0 text-accent" />
              <div className="min-w-0">
                <div className="font-mono text-[11px] text-accent">{d.id}</div>
                <div className="truncate text-xs text-fg-muted">{d.title}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-bg/85 backdrop-blur-sm"
            aria-label="Close"
            onClick={() => setLightbox(null)}
          />
          <div className="relative z-10 max-h-[92dvh] w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-elevated)]">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-mono text-xs text-accent">Blueprint sheet</span>
              <Button variant="ghost" size="icon-sm" onClick={() => setLightbox(null)}>
                <X className="size-4" />
              </Button>
            </div>
            <div className="max-h-[80dvh] overflow-auto bg-bg p-3">
              <img src={lightbox} alt="Blueprint full sheet" className="mx-auto max-w-full rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DrawingBody({
  drawing,
  onOpenImage,
}: {
  drawing: DrawingRecord;
  onOpenImage: (src: string) => void;
}) {
  switch (drawing.interactiveId) {
    case "pcb":
      return <PcbLayoutConstraints />;
    case "oneline":
      return (
        <div className="space-y-4">
          {drawing.image && (
            <button
              type="button"
              onClick={() => onOpenImage(drawing.image!)}
              className="block w-full overflow-hidden rounded-lg border border-primary/25"
            >
              <img
                src={drawing.image}
                alt={drawing.title}
                className="max-h-[280px] w-full object-contain bg-[#0a1628]"
              />
            </button>
          )}
          <OneLineDiagram />
        </div>
      );
    case "gate":
      return <GateDriverSchematic />;
    case "nilm":
      return <NilmPipeline />;
    case "sts":
      return <StsDiagram />;
    case "breaker-bom":
      return <BreakerBom imageSrc={drawing.image} />;
    case "network":
      return <NetworkTopology imageSrc={drawing.image} />;
    default:
      return drawing.image ? (
        <button
          type="button"
          onClick={() => onOpenImage(drawing.image!)}
          className="block w-full overflow-hidden rounded-lg border border-primary/25"
        >
          <img src={drawing.image} alt={drawing.title} className="w-full object-contain" />
        </button>
      ) : null;
  }
}
