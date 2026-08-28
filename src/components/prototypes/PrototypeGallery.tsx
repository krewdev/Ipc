import { useMemo, useState } from "react";
import { PROTOTYPES, SHARE_CARDS, type PrototypeImage } from "@/lib/ipc/prototypes";
import { useIpcStore } from "@/lib/ipc/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, DraftingCompass, Share2, X } from "lucide-react";

const FILTERS = ["All", "Panel", "Component", "System"] as const;

export function PrototypeGallery() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [active, setActive] = useState<PrototypeImage | null>(null);
  const [shareOpen, setShareOpen] = useState<string | null>(null);
  const setView = useIpcStore((s) => s.setView);
  const shareCard = SHARE_CARDS.find((c) => c.id === shareOpen) ?? null;

  const items = useMemo(
    () => (filter === "All" ? PROTOTYPES : PROTOTYPES.filter((p) => p.category === filter)),
    [filter],
  );

  const activeIndex = active ? items.findIndex((p) => p.id === active.id) : -1;

  function step(delta: number) {
    if (!items.length || activeIndex < 0) return;
    const next = items[(activeIndex + delta + items.length) % items.length]!;
    setActive(next);
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[240px] bg-bg-elevated sm:min-h-[320px]">
            <img
              src={PROTOTYPES[0]!.src}
              alt={PROTOTYPES[0]!.title}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-bg/40 lg:to-bg" />
          </div>
          <div className="relative flex flex-col justify-center gap-4 p-5 sm:p-8">
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">Hardware Presentation</Badge>
              <Badge variant="outline">8 concept renders</Badge>
              <Badge variant="outline">2 share cards</Badge>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                IPC Prototype Gallery
              </h1>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-fg-muted">
                Production-intent visualizations for residential and commercial panels, edge compute
                boards, hybrid actuators, bus assemblies, and autonomous microgrid topology.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setActive(PROTOTYPES[0]!)}>
                Open Hero Render
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setView("blueprints")}>
                <DraftingCompass className="size-3.5" />
                Engineering Blueprints
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-border pt-4">
              {[
                { k: "Panels", v: String(PROTOTYPES.filter((p) => p.category === "Panel").length) },
                {
                  k: "Components",
                  v: String(PROTOTYPES.filter((p) => p.category === "Component").length),
                },
                { k: "Systems", v: String(PROTOTYPES.filter((p) => p.category === "System").length) },
              ].map((s) => (
                <div key={s.k} className="rounded-md border border-border bg-bg-elevated px-2 py-2 text-center">
                  <div className="tabular text-lg font-semibold text-accent">{s.v}</div>
                  <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{s.k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Card className="border-primary/25">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="size-4 text-accent" />
            Share cards
          </CardTitle>
          <CardDescription>
            Official link preview and X feed art — served from the document head as{" "}
            <span className="font-mono text-accent">og:image</span> and{" "}
            <span className="font-mono text-accent">x:game:image</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-2">
          {SHARE_CARDS.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => setShareOpen(card.id)}
              className="overflow-hidden rounded-xl border border-border bg-bg-elevated text-left transition-colors hover:border-border-strong"
            >
              <div
                className={cn(
                  "overflow-hidden bg-bg",
                  card.id === "og" ? "aspect-[1200/630]" : "aspect-[50/11]",
                )}
              >
                <img src={card.src} alt={card.title} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-1 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-medium">{card.title}</div>
                  <Badge variant="primary">{card.spec}</Badge>
                </div>
                <div className="font-mono text-[11px] text-fg-muted">
                  {card.size} · {card.ratio}
                </div>
                <p className="text-[11px] text-fg-subtle">{card.usedAs}</p>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-fg-muted">Filter by category · click any tile for full-screen review</p>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "secondary"}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PROTOTYPES.filter((p) => p.category === "Panel").map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActive(p)}
            className="group overflow-hidden rounded-xl border border-border bg-surface text-left shadow-[var(--shadow-border)] transition-colors hover:border-border-strong"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-bg-elevated">
              <img
                src={p.src}
                alt={p.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute left-2 top-2">
                <Badge variant="primary" className="bg-bg/80 backdrop-blur-sm">
                  {String(i + 1).padStart(2, "0")}
                </Badge>
              </div>
            </div>
            <div className="space-y-1 p-3">
              <div className="text-sm font-medium">{p.title}</div>
              <div className="font-mono text-[11px] text-accent">{p.partNo}</div>
              <p className="line-clamp-2 text-[11px] leading-relaxed text-fg-muted">{p.description}</p>
            </div>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complete Library</CardTitle>
          <CardDescription>
            {items.length} render{items.length === 1 ? "" : "s"} · concept art for design review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(p)}
                className="group overflow-hidden rounded-xl border border-border bg-surface-2 text-left transition-colors hover:border-border-strong"
              >
                <div
                  className={cn(
                    "overflow-hidden bg-bg",
                    p.aspect === "portrait" ? "aspect-[4/5]" : "aspect-[3/2]",
                  )}
                >
                  <img
                    src={p.src}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-2 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium">{p.title}</div>
                      <div className="font-mono text-[11px] text-accent">{p.partNo}</div>
                    </div>
                    <Badge variant="outline">{p.category}</Badge>
                  </div>
                  <p className="line-clamp-2 text-xs leading-relaxed text-fg-muted">{p.description}</p>
                  <div className="text-[11px] text-fg-subtle">{p.segment}</div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
            aria-label="Close lightbox"
            onClick={() => setActive(null)}
          />
          <div className="relative z-10 flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-elevated)]">
            <div className="flex items-start justify-between gap-3 border-b border-border p-4">
              <div>
                <div className="text-base font-semibold">{active.title}</div>
                <div className="font-mono text-xs text-accent">{active.partNo}</div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => step(-1)} aria-label="Previous">
                  <ChevronLeft className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => step(1)} aria-label="Next">
                  <ChevronRight className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => setActive(null)} aria-label="Close">
                  <X className="size-4" />
                </Button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-bg p-3 sm:p-4">
              <img
                src={active.src}
                alt={active.title}
                className="mx-auto max-h-[65dvh] w-auto max-w-full rounded-lg object-contain"
              />
            </div>
            <div className="space-y-2 border-t border-border p-4">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="primary">{active.category}</Badge>
                <Badge variant="outline">{active.segment}</Badge>
                {activeIndex >= 0 && (
                  <Badge variant="default">
                    {activeIndex + 1} / {items.length}
                  </Badge>
                )}
              </div>
              <p className="text-sm leading-relaxed text-fg-muted">{active.description}</p>
            </div>
          </div>
        </div>
      )}

      {shareCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
            aria-label="Close share card"
            onClick={() => setShareOpen(null)}
          />
          <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-elevated)]">
            <div className="flex items-start justify-between gap-3 border-b border-border p-4">
              <div>
                <div className="text-base font-semibold">{shareCard.title}</div>
                <div className="font-mono text-xs text-accent">
                  {shareCard.spec} · {shareCard.size}
                </div>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => setShareOpen(null)} aria-label="Close">
                <X className="size-4" />
              </Button>
            </div>
            <div className="bg-bg p-3 sm:p-4">
              <img
                src={shareCard.src}
                alt={shareCard.title}
                className="mx-auto w-full rounded-lg object-contain"
              />
            </div>
            <p className="border-t border-border p-4 text-sm text-fg-muted">{shareCard.usedAs}</p>
          </div>
        </div>
      )}
    </div>
  );
}
