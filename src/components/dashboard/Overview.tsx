import { Battery, Sun, Thermometer, Shield, Cpu, Waves } from "lucide-react";
import { useIpcStore, getProductSpec } from "@/lib/ipc/store";
import { formatA, formatKw, formatPct, formatPower, formatV } from "@/lib/utils";
import { MetricCard } from "./MetricCard";
import { PowerChart } from "./PowerChart";
import { PanelFaceplate } from "./PanelFaceplate";
import { ActivityFeed } from "./ActivityFeed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Overview() {
  const health = useIpcStore((s) => s.health);
  const phases = useIpcStore((s) => s.phases);
  const battery = useIpcStore((s) => s.battery);
  const solar = useIpcStore((s) => s.solar);
  const edge = useIpcStore((s) => s.edge);
  const breakers = useIpcStore((s) => s.breakers);
  const product = useIpcStore((s) => s.product);
  const meshNodes = useIpcStore((s) => s.meshNodes);
  const demoHour = useIpcStore((s) => s.demoHour);
  const simulateBlackout = useIpcStore((s) => s.simulateBlackout);
  const restoreGrid = useIpcStore((s) => s.restoreGrid);
  const triggerDemandEvent = useIpcStore((s) => s.triggerDemandEvent);
  const setView = useIpcStore((s) => s.setView);
  const setCommandOpen = useIpcStore((s) => s.setCommandOpen);
  const spec = getProductSpec(product);

  const closed = breakers.filter((b) => b.status === "CLOSED").length;
  const tripped = breakers.filter((b) => b.status === "TRIPPED").length;
  const pf = health.powerFactor;
  const hourLabel = `${String(Math.floor(demoHour)).padStart(2, "0")}:${String(
    Math.floor((demoHour % 1) * 60),
  ).padStart(2, "0")}`;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Panel Overview</h1>
          <p className="text-sm text-fg-muted">
            {spec.name} · {spec.voltage} · {spec.maxAmps}A · demo {hourLabel}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setCommandOpen(true)}>
            Command ⌘K
          </Button>
          <Button variant="secondary" size="sm" onClick={triggerDemandEvent}>
            Fire DR Event
          </Button>
          {health.gridMode === "GRID" ? (
            <Button variant="warn" size="sm" onClick={simulateBlackout}>
              Simulate Blackout
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={restoreGrid}>
              Restore Grid
            </Button>
          )}
        </div>
      </div>

      <PanelFaceplate />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Facility Load"
          value={formatKw(health.totalPowerW)}
          unit="kW"
          hint={`PF ${pf.toFixed(3)} · ${formatPower(health.totalReactiveVar)} VAR`}
          accent="primary"
        />
        <MetricCard
          label="Grid Exchange"
          value={formatKw(health.totalPowerW - solar.powerW - battery.powerW)}
          unit="kW"
          hint={health.gridMode === "GRID" ? "Import / export" : "Islanded"}
          accent={health.gridMode === "GRID" ? "default" : "warn"}
        />
        <MetricCard
          label="Solar Production"
          value={formatKw(solar.powerW)}
          unit="kW"
          hint={`${formatPct(Math.max(0, solar.irradiance) * 100)} irradiance`}
          accent="warn"
        />
        <MetricCard
          label="Battery SoC"
          value={formatPct(battery.soc, 1)}
          hint={`${battery.powerW >= 0 ? "Charging" : "Discharging"} ${formatPower(Math.abs(battery.powerW))}`}
          accent={battery.soc < 30 ? "danger" : battery.soc > 70 ? "ok" : "default"}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PowerChart />
        </div>
        <ActivityFeed compact />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Phase Metrics</CardTitle>
            <CardDescription>
              Simultaneous sampling · ADS131M08 · 24-bit · {edge.samplesHz / 1000} kHz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {phases.map((p) => (
                <div key={p.phase} className="rounded-lg border border-border bg-surface-2 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-fg-muted">{p.phase}</span>
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        p.phase === "L1"
                          ? "bg-phase-a"
                          : p.phase === "L2"
                            ? "bg-phase-b"
                            : "bg-phase-c",
                      )}
                    />
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-fg-muted">Voltage</span>
                      <span className="tabular">{formatV(p.voltage)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-fg-muted">Current</span>
                      <span className="tabular">{formatA(p.current)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-fg-muted">Power</span>
                      <span className="tabular">{formatPower(p.powerW)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-fg-muted">THD</span>
                      <span className="tabular">{p.thd.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
              {phases.length === 0 && (
                <div className="col-span-full py-8 text-center text-sm text-fg-muted">
                  Waiting for phase telemetry…
                </div>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat icon={Waves} label="Frequency" value={`${health.frequency.toFixed(3)} Hz`} />
              <Stat icon={Shield} label="Arc risk" value={formatPct(health.arcFaultRisk * 100, 1)} />
              <Stat icon={Thermometer} label="GF current" value={`${health.groundFaultMa.toFixed(1)} mA`} />
              <Stat icon={Cpu} label="Edge mode" value={edge.mode} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Safety loop · mesh · breakers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border bg-surface-2 p-3">
              <div className="flex items-center gap-2">
                <Sun className="size-4 text-warn" />
                <span className="text-sm">Solar bus</span>
              </div>
              <span className="tabular text-sm">{formatKw(solar.powerW)} kW</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-surface-2 p-3">
              <div className="flex items-center gap-2">
                <Battery className="size-4 text-info" />
                <span className="text-sm">Battery</span>
              </div>
              <span className="tabular text-sm">
                {formatPct(battery.soc, 0)} · {battery.capacityKwh} kWh
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <Row label="Breakers closed" value={`${closed} / ${breakers.length}`} />
              <Row label="Tripped" value={String(tripped)} danger={tripped > 0} />
              <Row label="Mesh nodes" value={String(meshNodes)} />
              <Row label="Safety loop" value={`${edge.safetyLoopUs.toFixed(0)} µs`} />
              <Row label="MCU load" value={`${edge.mcuLoad.toFixed(0)}%`} />
              <Row
                label="Uptime"
                value={`${Math.floor(health.uptimeSec / 86400)}d ${Math.floor((health.uptimeSec % 86400) / 3600)}h`}
              />
            </div>
            {health.lastTrip && (
              <div className="rounded-md border border-danger/30 bg-danger-soft px-3 py-2 text-xs text-danger">
                Last trip: {health.lastTrip}
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              {spec.features.map((f) => (
                <Badge key={f} variant="outline">
                  {f}
                </Badge>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => setView("circuits")}>
                Circuits
              </Button>
              <Button variant="outline" onClick={() => setView("blueprints")}>
                Blueprints
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-border bg-bg-elevated px-3 py-2">
      <div className="flex items-center gap-1.5 text-[11px] text-fg-subtle">
        <Icon className="size-3" />
        {label}
      </div>
      <div className="mt-0.5 tabular text-sm font-medium">{value}</div>
    </div>
  );
}

function Row({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-fg-muted">{label}</span>
      <span className={cn("tabular font-medium", danger ? "text-danger" : "text-fg")}>{value}</span>
    </div>
  );
}
