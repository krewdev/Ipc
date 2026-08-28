import { PRODUCTS } from "@/lib/ipc/constants";
import { PROTOTYPES } from "@/lib/ipc/prototypes";
import { useIpcStore } from "@/lib/ipc/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ArchitecturePanel() {
  const product = useIpcStore((s) => s.product);
  const edge = useIpcStore((s) => s.edge);
  const health = useIpcStore((s) => s.health);
  const meshNodes = useIpcStore((s) => s.meshNodes);
  const setView = useIpcStore((s) => s.setView);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">System Architecture</h1>
        <p className="text-sm text-fg-muted">
          Hardware topology · software modules · product line matrix from the IPC white paper
        </p>
      </div>

      {/* Prototype strip */}
      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
          <div>
            <CardTitle>Hardware Prototypes</CardTitle>
            <CardDescription>Concept renders for panels, components, and microgrid topology</CardDescription>
          </div>
          <Button size="sm" variant="secondary" onClick={() => setView("prototypes")}>
            Open Gallery
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
            {PROTOTYPES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setView("prototypes")}
                className="w-40 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-2 text-left transition-colors hover:border-border-strong"
              >
                <div className="aspect-[4/3] overflow-hidden bg-bg">
                  <img src={p.src} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-2">
                  <div className="truncate text-xs font-medium">{p.title}</div>
                  <div className="truncate font-mono text-[10px] text-fg-subtle">{p.partNo}</div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Physical Layer</CardTitle>
          <CardDescription>
            Mains sensing → Analog front end → Edge MCU / Coral TPU → Hybrid actuation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="panel-grid overflow-x-auto rounded-xl border border-border bg-bg-elevated p-4 sm:p-6">
            <div className="mx-auto flex min-w-[640px] flex-col items-center gap-4">
              <div className="flex w-full items-center justify-center gap-3">
                <Node title="Mains Power" sub="Utility feed" tone="warn" />
                <Arrow />
                <Node title="Revenue CT/PT" sub="0.2% class" tone="info" />
                <Arrow />
                <Node title="Mains Actuator" sub="MCCB / Contactor" tone="danger" />
              </div>
              <div className="h-6 w-px bg-border-strong" />
              <div className="flex w-full items-center justify-center gap-3">
                <Node title="ADS131M08" sub="24-bit ΔΣ · 16–50 kHz" tone="primary" />
                <Arrow />
                <Node
                  title="STM32H7 MCU"
                  sub={`${edge.mcuLoad.toFixed(0)}% · ${edge.safetyLoopUs.toFixed(0)} µs loop`}
                  tone="primary"
                  active
                />
                <Arrow />
                <Node
                  title="Coral Edge TPU"
                  sub={`${edge.tpuUtil.toFixed(0)}% · ${edge.mode}`}
                  tone="ok"
                  active
                />
              </div>
              <div className="h-6 w-px bg-border-strong" />
              <div className="flex w-full items-center justify-center gap-3">
                <Node title="Branch CT Matrix" sub="Per-circuit sensing" tone="info" />
                <Arrow />
                <Node title="SSR + Motor Breaker" sub="under 1 ms / 50–80 ms" tone="warn" />
                <Arrow />
                <Node title="Branch Loads" sub={health.gridMode} tone="default" />
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-2 text-xs text-fg-muted sm:grid-cols-3">
            <p>
              <span className="font-medium text-fg">Fail-safe:</span> thermal-magnetic trip remains
              independent of MCU power.
            </p>
            <p>
              <span className="font-medium text-fg">Comms:</span> dual GbE (PTP 1588), Wi-Fi 6E WPA3,
              private LTE/5G, RS-485 / BACnet.
            </p>
            <p>
              <span className="font-medium text-fg">Mesh:</span> {meshNodes} peers on mmWave / mTLS for
              microgrid islanding.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Software Modules</CardTitle>
          <CardDescription>Mapped from IPC design layout — simulated edge stack</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Module
              path="src/core/"
              items={["CoreController", "NILMEngine", "MotorizedBreaker"]}
              desc="Realtime loop, safety Class 10/20, FFT + TPU inference"
            />
            <Module
              path="src/models/residential/"
              items={["ResidentialIPC", "MatterController", "HA Bridge"]}
              desc="EV PWM, solar bus, Matter / Home Assistant"
            />
            <Module
              path="src/models/commercial/"
              items={["CommercialIPC", "PhaseBalancer", "BmsGateway"]}
              desc="15-min peak shave, BACnet/IP, Modbus TCP"
            />
            <Module
              path="src/models/datacenter/"
              items={["DataCenterIPC", "RedundancyManager"]}
              desc="Sub-ms STS failover, HVDC arc suppression"
            />
            <Module
              path="src/mesh_network/"
              items={["MeshNetworkManager"]}
              desc="mTLS tunnels, private 5G, mmWave diagnostics"
            />
            <Module
              path="src/api/"
              items={["ApiGateway", "OpenAdrVEN", "VppSimulator"]}
              desc="Dashboard WS, OpenADR 2.0b VEN, droop sim"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Line Matrix</CardTitle>
          <CardDescription>Select a model from the sidebar to reconfigure the live demo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Object.values(PRODUCTS).map((p) => (
              <div
                key={p.id}
                className={cn(
                  "rounded-xl border p-4 transition-colors",
                  product === p.id
                    ? "border-primary/50 bg-primary-soft/25"
                    : "border-border bg-surface-2",
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold">{p.name}</span>
                  <Badge variant={product === p.id ? "primary" : "outline"}>{p.segment}</Badge>
                </div>
                <div className="mb-3 space-y-1 text-xs text-fg-muted">
                  <div>{p.voltage}</div>
                  <div>
                    {p.maxAmps}A · up to {p.maxBranches} branches ·{" "}
                    {p.phases === 3 ? "3-phase" : "split-phase"}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.features.map((f) => (
                    <Badge key={f} variant="default">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <Compliance title="UL 67" body="Panelboards — busbar spacing, SCCR up to 65 kA, enclosure strength" />
            <Compliance title="UL 916" body="Energy management — algorithms cannot override thermal safety" />
            <Compliance title="UL 1699" body="AFCI — series/parallel arc detect under 100 ms at 2.5 A" />
            <Compliance title="NEC 705" body="Interconnected sources — 120% busbar rule for solar/storage" />
            <Compliance title="NEC 220.70" body="ALMS — dynamic EV/appliance limits without service upgrade" />
            <Compliance title="OpenADR 2.0b" body="Containerized VEN client on the communications module" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Node({
  title,
  sub,
  tone,
  active,
}: {
  title: string;
  sub: string;
  tone: "primary" | "ok" | "warn" | "danger" | "info" | "default";
  active?: boolean;
}) {
  const ring =
    tone === "primary"
      ? "border-primary/40"
      : tone === "ok"
        ? "border-ok/40"
        : tone === "warn"
          ? "border-warn/40"
          : tone === "danger"
            ? "border-danger/40"
            : tone === "info"
              ? "border-info/40"
              : "border-border";
  return (
    <div
      className={cn(
        "min-w-[140px] rounded-lg border bg-surface px-3 py-2.5 text-center shadow-[var(--shadow-border)]",
        ring,
        active && "glow-ok",
      )}
    >
      <div className="text-xs font-semibold">{title}</div>
      <div className="mt-0.5 text-[10px] text-fg-muted">{sub}</div>
    </div>
  );
}

function Arrow() {
  return <div className="h-px w-8 shrink-0 bg-border-strong sm:w-12" />;
}

function Module({ path, items, desc }: { path: string; items: string[]; desc: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-3">
      <div className="font-mono text-[11px] text-accent">{path}</div>
      <div className="mt-2 flex flex-wrap gap-1">
        {items.map((i) => (
          <Badge key={i} variant="outline">
            {i}
          </Badge>
        ))}
      </div>
      <p className="mt-2 text-xs text-fg-muted">{desc}</p>
    </div>
  );
}

function Compliance({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-3">
      <div className="text-sm font-medium">{title}</div>
      <p className="mt-1 text-xs leading-relaxed text-fg-muted">{body}</p>
    </div>
  );
}
