import { useIpcStore, getProductSpec } from "@/lib/ipc/store";
import { formatKw, formatPct, formatPower } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function LoadPanel() {
  const demand = useIpcStore((s) => s.demand);
  const battery = useIpcStore((s) => s.battery);
  const solar = useIpcStore((s) => s.solar);
  const health = useIpcStore((s) => s.health);
  const breakers = useIpcStore((s) => s.breakers);
  const product = useIpcStore((s) => s.product);
  const simulateBlackout = useIpcStore((s) => s.simulateBlackout);
  const restoreGrid = useIpcStore((s) => s.restoreGrid);
  const triggerDemandEvent = useIpcStore((s) => s.triggerDemandEvent);
  const toggleBreaker = useIpcStore((s) => s.toggleBreaker);
  const spec = getProductSpec(product);

  const windowElapsed = Math.min(15, (Date.now() - demand.windowStart) / 60_000);
  const shedBreakers = breakers.filter((b) => b.shedCapable && !b.critical);
  const headroom = demand.peakThresholdKw - demand.forecastKw;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Predictive Load Management</h1>
          <p className="text-sm text-fg-muted">
            GBRT load forecasts · ToU pre-cool · virtual subpanels · ALMS (NEC 220.70)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={triggerDemandEvent}>
            Cap Demand Window
          </Button>
          {health.gridMode === "GRID" ? (
            <Button variant="warn" size="sm" onClick={simulateBlackout}>
              Island / Blackout
            </Button>
          ) : (
            <Button size="sm" onClick={restoreGrid}>
              Restore Mains
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-fg-subtle">15-min average</div>
            <div className="mt-1 tabular text-2xl font-semibold">{demand.averageKw.toFixed(2)}</div>
            <div className="text-xs text-fg-muted">kW · window {windowElapsed.toFixed(1)} / 15 min</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-fg-subtle">Forecast peak</div>
            <div
              className={cn(
                "mt-1 tabular text-2xl font-semibold",
                demand.shedding ? "text-warn" : "text-fg",
              )}
            >
              {demand.forecastKw.toFixed(2)}
            </div>
            <div className="text-xs text-fg-muted">Threshold {demand.peakThresholdKw.toFixed(0)} kW</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-fg-subtle">Headroom</div>
            <div
              className={cn(
                "mt-1 tabular text-2xl font-semibold",
                headroom < 0 ? "text-danger" : "text-ok",
              )}
            >
              {headroom.toFixed(2)}
            </div>
            <div className="text-xs text-fg-muted">kW before demand charge</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-fg-subtle">Shedding</div>
            <div className="mt-1 text-2xl font-semibold">
              {demand.shedding || health.gridMode !== "GRID" ? (
                <Badge variant="warn">Active</Badge>
              ) : (
                <Badge variant="ok">Idle</Badge>
              )}
            </div>
            <div className="mt-1 text-xs text-fg-muted">
              {spec.segment === "Commercial" ? "Peak demand shave" : "Virtual subpanel"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demand Window Tracker</CardTitle>
          <CardDescription>
            Commercial utilities bill the highest 15-minute average. IPC forecasts the window and sheds
            non-critical load before the threshold.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex justify-between text-xs text-fg-muted">
            <span>0 kW</span>
            <span>Threshold {demand.peakThresholdKw.toFixed(0)} kW</span>
          </div>
          <div className="relative h-4 overflow-hidden rounded-full bg-surface-3">
            <div
              className={cn(
                "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                demand.forecastKw > demand.peakThresholdKw * 0.92 ? "bg-warn" : "bg-primary",
              )}
              style={{
                width: `${Math.min(100, (demand.forecastKw / demand.peakThresholdKw) * 100)}%`,
              }}
            />
            <div
              className="absolute inset-y-0 w-0.5 bg-danger"
              style={{ left: "92%" }}
              title="Shed trigger"
            />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Mini label="Facility load" value={`${formatKw(health.totalPowerW)} kW`} />
            <Mini label="Solar offset" value={`${formatKw(solar.powerW)} kW`} />
            <Mini
              label="Battery"
              value={`${formatPct(battery.soc, 0)} · ${battery.powerW >= 0 ? "+" : ""}${formatKw(battery.powerW)} kW`}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Virtual Subpanel</CardTitle>
            <CardDescription>
              On blackout or low SoC (under 30%), shed-capable branches open automatically — no rewiring
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {shedBreakers.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-md border border-border bg-surface-2 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{b.label}</div>
                  <div className="text-[11px] text-fg-muted">
                    {b.ratingA}A · {formatPower(b.powerW)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      b.status === "CLOSED" ? "ok" : b.status === "OPEN" ? "default" : "danger"
                    }
                  >
                    {b.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={b.status === "LOTO" || b.status === "TRIPPED"}
                    onClick={() => toggleBreaker(b.id)}
                  >
                    Toggle
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pre-cool / Smart Throttle</CardTitle>
            <CardDescription>Thermodynamic + ToU optimizer on the NPU</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Strategy
              title="Thermal pre-cool"
              body="Shifts HVAC run-time ahead of peak ToU windows using weather + occupancy forecasts."
              status="Armed"
            />
            <Strategy
              title="EV charger PWM"
              body="Matter / Home Assistant API modulates EVSE current to hold panel under ALMS limit."
              status={demand.shedding ? "Throttling" : "Standby"}
            />
            <Strategy
              title="Water heater delay"
              body="Defers resistive DHW during OpenADR events and high LMP price intervals."
              status={health.gridMode !== "GRID" ? "Shed" : "Standby"}
            />
            <Strategy
              title="Generator soft-start"
              body="Sequences branch close on genset restore to prevent inrush stall."
              status={health.gridMode === "GENERATOR" ? "Sequencing" : "Ready"}
            />
            {battery.soc < 30 && (
              <div className="rounded-md border border-warn/30 bg-warn-soft px-3 py-2 text-xs text-warn">
                Battery SoC below 30% — high-draw shed loads are being dropped per virtual subpanel policy.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-bg-elevated px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="tabular text-sm font-medium">{value}</div>
    </div>
  );
}

function Strategy({ title, body, status }: { title: string; status: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-3">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{title}</span>
        <Badge variant={status === "Standby" || status === "Ready" || status === "Armed" ? "primary" : "warn"}>
          {status}
        </Badge>
      </div>
      <p className="text-xs leading-relaxed text-fg-muted">{body}</p>
    </div>
  );
}
