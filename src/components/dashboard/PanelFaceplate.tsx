import { useIpcStore, getProductSpec } from "@/lib/ipc/store";
import { formatKw, formatPct, formatPower } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { PROTOTYPES } from "@/lib/ipc/prototypes";

/** Live HMI faceplate inspired by the residential prototype render */
export function PanelFaceplate() {
  const product = useIpcStore((s) => s.product);
  const health = useIpcStore((s) => s.health);
  const solar = useIpcStore((s) => s.solar);
  const battery = useIpcStore((s) => s.battery);
  const edge = useIpcStore((s) => s.edge);
  const breakers = useIpcStore((s) => s.breakers);
  const demoHour = useIpcStore((s) => s.demoHour);
  const history = useIpcStore((s) => s.history);
  const setView = useIpcStore((s) => s.setView);
  const spec = getProductSpec(product);

  const closed = breakers.filter((b) => b.status === "CLOSED").length;
  const spark = history.slice(-24).map((h) => h.p);
  const maxSpark = Math.max(...spark, 1);
  const hourLabel = `${String(Math.floor(demoHour)).padStart(2, "0")}:${String(
    Math.floor((demoHour % 1) * 60),
  ).padStart(2, "0")}`;

  const thumb =
    product.startsWith("C") || product.startsWith("D")
      ? PROTOTYPES.find((p) => p.id === "commercial")!.src
      : PROTOTYPES.find((p) => p.id === "res-panel")!.src;

  return (
    <div className="grid overflow-hidden rounded-2xl border border-border bg-surface lg:grid-cols-5">
      <button
        type="button"
        onClick={() => setView("prototypes")}
        className="relative min-h-[200px] overflow-hidden bg-bg-elevated lg:col-span-2 lg:min-h-[300px]"
      >
        <img src={thumb} alt={`${spec.name} prototype`} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-accent">{spec.name}</div>
          <div className="text-sm font-medium text-fg">Hardware reference</div>
        </div>
      </button>

      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:col-span-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-fg-subtle">
              HMI Faceplate · Live
            </div>
            <div className="mt-0.5 text-lg font-semibold tracking-tight">Energy Overview</div>
            <div className="text-xs text-fg-muted">
              Demo clock {hourLabel} · {spec.voltage}
            </div>
          </div>
          <div
            className={cn(
              "rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider",
              health.gridMode === "GRID" ? "bg-ok-soft text-ok" : "bg-warn-soft text-warn",
            )}
          >
            {health.gridMode}
          </div>
        </div>

        {/* Main ring metric */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1 flex flex-col items-center justify-center rounded-xl border border-border bg-bg-elevated p-3">
            <div className="relative flex size-24 items-center justify-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#3d9e8f"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${Math.min(264, (health.totalPowerW / (spec.maxAmps * 120)) * 264)} 264`}
                />
              </svg>
              <div className="text-center">
                <div className="tabular text-lg font-semibold text-accent">
                  {formatKw(health.totalPowerW)}
                </div>
                <div className="text-[10px] text-fg-muted">kW</div>
              </div>
            </div>
            <div className="mt-1 text-[10px] text-fg-subtle">Facility load</div>
          </div>

          <div className="col-span-2 space-y-2">
            <Row label="Solar" value={`${formatKw(solar.powerW)} kW`} bar={solar.irradiance} tone="warn" />
            <Row
              label="Battery"
              value={`${formatPct(battery.soc, 0)} · ${formatPower(battery.powerW)}`}
              bar={battery.soc / 100}
              tone="info"
            />
            <Row
              label="Breakers"
              value={`${closed}/${breakers.length} closed`}
              bar={closed / Math.max(1, breakers.length)}
              tone="ok"
            />
            <Row
              label="Edge TPU"
              value={`${edge.mode} · ${edge.inferenceMs.toFixed(0)} ms`}
              bar={edge.tpuUtil / 100}
              tone="primary"
            />
          </div>
        </div>

        {/* Sparkline */}
        <div className="rounded-lg border border-border bg-bg-elevated px-3 py-2">
          <div className="mb-1 flex justify-between text-[10px] text-fg-subtle">
            <span>Load sparkline</span>
            <span className="tabular">{formatPower(health.totalPowerW)}</span>
          </div>
          <div className="flex h-10 items-end gap-px">
            {spark.length < 2
              ? Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-surface-3" style={{ height: "20%" }} />
                ))
              : spark.map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-primary/80"
                    style={{ height: `${Math.max(8, (v / maxSpark) * 100)}%` }}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bar,
  tone,
}: {
  label: string;
  value: string;
  bar: number;
  tone: "warn" | "info" | "ok" | "primary";
}) {
  const color =
    tone === "warn"
      ? "bg-warn"
      : tone === "info"
        ? "bg-info"
        : tone === "ok"
          ? "bg-ok"
          : "bg-primary";
  return (
    <div>
      <div className="mb-0.5 flex justify-between text-[11px]">
        <span className="text-fg-muted">{label}</span>
        <span className="tabular text-fg">{value}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-surface-3">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${Math.min(100, Math.max(0, bar * 100))}%` }}
        />
      </div>
    </div>
  );
}
