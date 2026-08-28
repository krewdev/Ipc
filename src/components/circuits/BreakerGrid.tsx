import { AlertTriangle, Lock, Power, RotateCcw } from "lucide-react";
import { useIpcStore } from "@/lib/ipc/store";
import type { BreakerState } from "@/lib/ipc/types";
import { cn, formatA, formatPower } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function BreakerGrid() {
  const breakers = useIpcStore((s) => s.breakers);
  const selectedId = useIpcStore((s) => s.selectedBreakerId);
  const selectBreaker = useIpcStore((s) => s.selectBreaker);
  const toggleBreaker = useIpcStore((s) => s.toggleBreaker);
  const tripBreaker = useIpcStore((s) => s.tripBreaker);
  const resetBreaker = useIpcStore((s) => s.resetBreaker);
  const setLoto = useIpcStore((s) => s.setLoto);
  const selected = breakers.find((b) => b.id === selectedId) ?? breakers[0];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Circuit Panel</h1>
        <p className="text-sm text-fg-muted">
          Hybrid SSR + motorized breakers · zero-cross switching · fail-safe thermal-magnetic backup
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Branch Actuators</CardTitle>
            <CardDescription>Tap a pole to inspect · toggle for remote open/close</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {breakers.map((b) => (
                <BreakerTile
                  key={b.id}
                  breaker={b}
                  selected={selected?.id === b.id}
                  onSelect={() => selectBreaker(b.id)}
                  onToggle={() => toggleBreaker(b.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {selected && (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle>{selected.label}</CardTitle>
                  <CardDescription>
                    Pole {selected.pole} · {selected.ratingA}A · {selected.category}
                  </CardDescription>
                </div>
                <StatusBadge status={selected.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Info label="Current" value={formatA(selected.currentA)} />
                <Info label="Power" value={formatPower(selected.powerW)} />
                <Info label="Contact temp" value={`${selected.contactTempC.toFixed(1)} °C`} />
                <Info label="Cycles" value={selected.cycleCount.toLocaleString()} />
              </div>

              <div className="space-y-2 rounded-lg border border-border bg-surface-2 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-fg-muted">Critical circuit</span>
                  <span>{selected.critical ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fg-muted">Shed-capable</span>
                  <span>{selected.shedCapable ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fg-muted">Load share</span>
                  <span className="tabular">
                    {selected.ratingA > 0
                      ? `${((selected.currentA / selected.ratingA) * 100).toFixed(0)}%`
                      : "—"}
                  </span>
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-surface-3">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    selected.currentA / selected.ratingA > 0.9
                      ? "bg-danger"
                      : selected.currentA / selected.ratingA > 0.7
                        ? "bg-warn"
                        : "bg-primary",
                  )}
                  style={{
                    width: `${Math.min(100, (selected.currentA / selected.ratingA) * 100)}%`,
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                  <span className="text-sm">Remote close</span>
                  <Switch
                    checked={selected.status === "CLOSED"}
                    disabled={selected.status === "LOTO" || selected.status === "TRIPPED"}
                    onCheckedChange={() => toggleBreaker(selected.id)}
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={selected.status === "LOTO"}
                  onClick={() =>
                    selected.status === "TRIPPED"
                      ? resetBreaker(selected.id)
                      : tripBreaker(selected.id, `${selected.label} manual trip`)
                  }
                >
                  {selected.status === "TRIPPED" ? (
                    <>
                      <RotateCcw className="size-3.5" /> Reset trip
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="size-3.5" /> Software trip
                    </>
                  )}
                </Button>
                <Button
                  variant={selected.status === "LOTO" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLoto(selected.id, selected.status !== "LOTO")}
                >
                  <Lock className="size-3.5" />
                  {selected.status === "LOTO" ? "Release LOTO" : "Engage LOTO"}
                </Button>
              </div>

              <p className="text-[11px] leading-relaxed text-fg-subtle">
                Mechanical latch remains independent of firmware. LOTO overrides all software signals
                for lockout/tagout compliance. SSR handles zero-cross; motorized MCB provides isolation
                in 50–80 ms.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function BreakerTile({
  breaker,
  selected,
  onSelect,
  onToggle,
}: {
  breaker: BreakerState;
  selected: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) {
  const load = breaker.ratingA > 0 ? breaker.currentA / breaker.ratingA : 0;
  const canToggle = breaker.status !== "LOTO" && breaker.status !== "TRIPPED";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "group relative flex flex-col rounded-lg border p-2.5 text-left transition-colors duration-150",
        selected
          ? "border-primary/50 bg-primary-soft/40"
          : "border-border bg-surface-2 hover:border-border-strong hover:bg-surface-3",
        breaker.status === "TRIPPED" && "glow-danger",
        breaker.status === "LOTO" && "opacity-80",
      )}
    >
      <div className="mb-1 flex items-center justify-between gap-1">
        <span className="font-mono text-[10px] text-fg-subtle">
          {String(breaker.pole).padStart(2, "0")}
        </span>
        <span
          className={cn(
            "size-2 rounded-full",
            breaker.status === "CLOSED" && "bg-ok",
            breaker.status === "OPEN" && "bg-fg-subtle",
            breaker.status === "TRIPPED" && "bg-danger animate-pulse",
            breaker.status === "LOTO" && "bg-warn",
          )}
        />
      </div>
      <div className="line-clamp-2 min-h-8 text-xs font-medium leading-snug">{breaker.label}</div>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <div className="tabular text-sm font-semibold">{formatPower(breaker.powerW)}</div>
          <div className="tabular text-[10px] text-fg-muted">{formatA(breaker.currentA)}</div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (canToggle) onToggle();
          }}
          disabled={!canToggle}
          className={cn(
            "flex size-8 items-center justify-center rounded-md border transition-colors",
            breaker.status === "CLOSED"
              ? "border-ok/40 bg-ok-soft text-ok"
              : "border-border bg-surface text-fg-muted",
            !canToggle && "opacity-50",
          )}
          aria-label={`Toggle ${breaker.label}`}
        >
          <Power className="size-3.5" />
        </button>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-bg">
        <div
          className={cn(
            "h-full rounded-full",
            load > 0.9 ? "bg-danger" : load > 0.7 ? "bg-warn" : "bg-primary",
          )}
          style={{ width: `${Math.min(100, load * 100)}%` }}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: BreakerState["status"] }) {
  const map = {
    CLOSED: "ok" as const,
    OPEN: "default" as const,
    TRIPPED: "danger" as const,
    LOTO: "warn" as const,
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-bg-elevated px-2.5 py-2">
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="tabular text-sm font-medium">{value}</div>
    </div>
  );
}
