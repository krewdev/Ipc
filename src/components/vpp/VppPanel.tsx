import { useIpcStore } from "@/lib/ipc/store";
import { formatPower } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function VppPanel() {
  const openAdr = useIpcStore((s) => s.openAdr);
  const vppRevenueUsd = useIpcStore((s) => s.vppRevenueUsd);
  const battery = useIpcStore((s) => s.battery);
  const health = useIpcStore((s) => s.health);
  const meshNodes = useIpcStore((s) => s.meshNodes);
  const edge = useIpcStore((s) => s.edge);
  const setOpenAdrOptIn = useIpcStore((s) => s.setOpenAdrOptIn);
  const triggerDemandEvent = useIpcStore((s) => s.triggerDemandEvent);

  const freqDroop = -12 * (health.frequency - 60);
  const active = openAdr.filter((e) => e.status === "ACTIVE");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">VPP & OpenADR</h1>
          <p className="text-sm text-fg-muted">
            Virtual End Node (VEN) · OpenADR 2.0b · frequency droop · wholesale LMP arbitrage
          </p>
        </div>
        <Button size="sm" onClick={triggerDemandEvent}>
          Inject DR Event
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-fg-subtle">VPP revenue (sim)</div>
            <div className="mt-1 tabular text-2xl font-semibold text-accent">
              ${vppRevenueUsd.toFixed(2)}
            </div>
            <div className="text-xs text-fg-muted">Session cumulative</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-fg-subtle">Freq droop ΔP</div>
            <div className="mt-1 tabular text-2xl font-semibold">{freqDroop.toFixed(2)}</div>
            <div className="text-xs text-fg-muted">kW · f={health.frequency.toFixed(3)} Hz</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-fg-subtle">Mesh peers</div>
            <div className="mt-1 tabular text-2xl font-semibold">{meshNodes}</div>
            <div className="text-xs text-fg-muted">5G mmWave / mTLS</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-fg-subtle">Active events</div>
            <div className="mt-1 tabular text-2xl font-semibold">{active.length}</div>
            <div className="text-xs text-fg-muted">OpenADR opt-in</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>OpenADR Event Queue</CardTitle>
            <CardDescription>
              VTN → oadrDistributeEvent · local constraint check · oadrCreatedEvent opt-in/out
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {openAdr.map((e) => {
              const start = new Date(e.startAt);
              return (
                <div
                  key={e.id}
                  className={cn(
                    "rounded-xl border p-4",
                    e.status === "ACTIVE"
                      ? "border-primary/40 bg-primary-soft/30"
                      : "border-border bg-surface-2",
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium">{e.name}</div>
                      <div className="mt-0.5 text-xs text-fg-muted">
                        {start.toLocaleString()} · {e.durationMin} min · target{" "}
                        {e.targetReductionKw > 0 ? "−" : "+"}
                        {Math.abs(e.targetReductionKw).toFixed(1)} kW
                      </div>
                    </div>
                    <Badge
                      variant={
                        e.status === "ACTIVE"
                          ? "ok"
                          : e.status === "PENDING"
                            ? "info"
                            : e.status === "OPTED_OUT"
                              ? "default"
                              : "primary"
                      }
                    >
                      {e.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-fg-muted">Opt-in as VEN</span>
                    <Switch
                      checked={e.optIn}
                      disabled={e.status === "COMPLETED" || e.status === "ACTIVE"}
                      onCheckedChange={(v) => setOpenAdrOptIn(e.id, v)}
                    />
                  </div>
                  {e.status === "ACTIVE" && (
                    <div className="mt-3 rounded-md border border-border bg-bg-elevated px-3 py-2 text-xs text-fg-muted">
                      Operational phase: PWM solar/storage · EV current limit · non-essential SSR open.
                      Telemetry every 10s via oadrReportDistribute (P/Q).
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Local VPP Simulator</CardTitle>
            <CardDescription>Frequency response & LMP arbitrage loops</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-surface-2 p-3">
              <div className="text-xs font-medium text-fg-muted">Droop equation</div>
              <div className="mt-1 font-mono text-sm text-accent">
                ΔP = −f_droop · (f − f_nom)
              </div>
              <div className="mt-2 tabular text-xs text-fg-muted">
                f_droop = 12 kW/Hz · ΔP = {freqDroop.toFixed(3)} kW
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <Row label="Battery SoC" value={`${battery.soc.toFixed(1)}%`} />
              <Row
                label="Battery power"
                value={`${battery.powerW >= 0 ? "+" : ""}${formatPower(battery.powerW)}`}
              />
              <Row label="Grid mode" value={health.gridMode} />
              <Row label="Edge mode" value={edge.mode} />
              <Row label="Altruistic jobs" value={String(edge.altruisticJobs)} />
            </div>

            <div className="rounded-lg border border-border bg-bg-elevated p-3 text-xs leading-relaxed text-fg-muted">
              <p className="mb-2 font-medium text-fg">Event telemetry flow</p>
              <ol className="list-decimal space-y-1 pl-4">
                <li>VTN distributes event metadata & power target</li>
                <li>IPC checks occupancy, SoC, critical circuits</li>
                <li>VEN replies opt-in / opt-out</li>
                <li>SSR + PWM execute during interval</li>
                <li>P/Q reported every 10 seconds</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-fg-muted">{label}</span>
      <span className="tabular font-medium">{value}</span>
    </div>
  );
}
