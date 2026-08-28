import { AlertTriangle, Bluetooth, ClipboardCheck, Lock, Thermometer, Wrench, Zap } from "lucide-react";
import {
  FAULT_CATALOG,
  INSTALL_CLEARANCES,
  SAFETY_THRESH,
  TORQUE_TABLE,
} from "@/lib/ipc/safety";
import { useIpcStore } from "@/lib/ipc/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function TechPanel() {
  const breakers = useIpcStore((s) => s.breakers);
  const commissioned = useIpcStore((s) => s.commissioned);
  const postStatus = useIpcStore((s) => s.postStatus);
  const postChecks = useIpcStore((s) => s.postChecks);
  const faults = useIpcStore((s) => s.faults);
  const runPost = useIpcStore((s) => s.runPost);
  const completeCommission = useIpcStore((s) => s.completeCommission);
  const injectFault = useIpcStore((s) => s.injectFault);
  const coolBimetal = useIpcStore((s) => s.coolBimetal);
  const resetBreaker = useIpcStore((s) => s.resetBreaker);
  const setLoto = useIpcStore((s) => s.setLoto);
  const selectBreaker = useIpcStore((s) => s.selectBreaker);
  const setView = useIpcStore((s) => s.setView);

  const lotoCount = breakers.filter((b) => b.status === "LOTO").length;
  const activeFaults = faults.filter((f) => f.active);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Technician Console</h1>
          <p className="text-sm text-fg-muted">
            Tech manual §4–8 · Safety spec LOTO / AFCI / bimetal · RJ45 10.0.0.1
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={commissioned ? "ok" : "warn"}>
            {commissioned ? "Commissioned" : "Not commissioned"}
          </Badge>
          <Badge variant={lotoCount ? "warn" : "ok"}>
            {lotoCount ? `${lotoCount} LOTO` : "All LOTO UP"}
          </Badge>
          <Badge variant={activeFaults.length ? "danger" : "outline"}>
            {activeFaults.length} active fault{activeFaults.length === 1 ? "" : "s"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="size-4 text-accent" />
              POST · Power-On Self-Test
            </CardTitle>
            <CardDescription>
              Secure ROM boot · TPU · ADC · LOTO UP · will not energize downstream until handshake
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ol className="space-y-1.5">
              {postChecks.map((c, i) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
                >
                  <span className="text-fg-muted">
                    {i + 1}. {c.label}
                  </span>
                  <Badge
                    variant={
                      c.status === "pass" ? "ok" : c.status === "fail" ? "danger" : "outline"
                    }
                  >
                    {c.status}
                  </Badge>
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={runPost} disabled={postStatus === "running"}>
                {postStatus === "running" ? "Running POST…" : "Run POST"}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={completeCommission}
                disabled={postStatus !== "pass" || commissioned}
              >
                <Bluetooth className="size-3.5" />
                BLE installer handshake
              </Button>
            </div>
            <p className="text-[11px] text-fg-subtle">
              Engage any LOTO shutter before POST to force a fail — spec: all shutters must be UP.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-danger" />
              Inject safety event
            </CardTitle>
            <CardDescription>
              Thresholds from safety spec: T {">"} {SAFETY_THRESH.bimetalTripC} °C · I {"≥"}{" "}
              {SAFETY_THRESH.shortMult}× · THD {">"} {SAFETY_THRESH.afciThdPct}% + conf {"≥"}{" "}
              {SAFETY_THRESH.afciConfPct}%
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="warn" onClick={() => injectFault("thermal")}>
                <Thermometer className="size-3.5" />
                E011-01 Thermal
              </Button>
              <Button size="sm" variant="warn" onClick={() => injectFault("contact")}>
                E011-02 Contact
              </Button>
              <Button size="sm" variant="danger" onClick={() => injectFault("afci")}>
                E022 AFCI
              </Button>
              <Button size="sm" variant="danger" onClick={() => injectFault("short")}>
                <Zap className="size-3.5" />
                E033 Short
              </Button>
            </div>
            <p className="text-[11px] leading-relaxed text-fg-subtle">
              AFCI / short command the SiC gate off in {"<"}
              {SAFETY_THRESH.gateUs} μs. Thermal trips lock reset until virtual strip {"<"}{" "}
              {SAFETY_THRESH.bimetalResetC} °C.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active poles · LOTO / hysteresis</CardTitle>
          <CardDescription>
            Physical shutter severs +5 V gate supply — remote close and VPP cannot override
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
              <tr>
                <th className="px-2 py-1.5">Pole</th>
                <th className="px-2 py-1.5">Circuit</th>
                <th className="px-2 py-1.5">Status</th>
                <th className="px-2 py-1.5">T bimetal</th>
                <th className="px-2 py-1.5">T contact</th>
                <th className="px-2 py-1.5">Fault</th>
                <th className="px-2 py-1.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {breakers.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="px-2 py-1.5 font-mono text-accent">{String(b.pole).padStart(2, "0")}</td>
                  <td className="px-2 py-1.5 text-fg">{b.label}</td>
                  <td className="px-2 py-1.5">
                    <Badge
                      variant={
                        b.status === "CLOSED"
                          ? "ok"
                          : b.status === "TRIPPED"
                            ? "danger"
                            : b.status === "LOTO"
                              ? "warn"
                              : "outline"
                      }
                    >
                      {b.status}
                    </Badge>
                  </td>
                  <td className="px-2 py-1.5 tabular text-fg-muted">{b.bimetalTempC.toFixed(0)} °C</td>
                  <td className="px-2 py-1.5 tabular text-fg-muted">{b.contactTempC.toFixed(0)} °C</td>
                  <td className="px-2 py-1.5 font-mono text-fg-muted">{b.lastFault ?? "—"}</td>
                  <td className="px-2 py-1.5">
                    <div className="flex flex-wrap gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-[11px]"
                        onClick={() => setLoto(b.id, b.status !== "LOTO")}
                      >
                        <Lock className="size-3" />
                        {b.status === "LOTO" ? "Release" : "LOTO"}
                      </Button>
                      {b.status === "TRIPPED" && b.lastFault?.startsWith("E011") && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => coolBimetal(b.id)}
                        >
                          Cool
                        </Button>
                      )}
                      {b.status === "TRIPPED" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => resetBreaker(b.id)}
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="size-4 text-accent" />
              Terminal torque
            </CardTitle>
            <CardDescription>Tech manual §4.2 — anti-oxidant on Al conductors</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                <tr>
                  <th className="px-3 py-2">Terminal</th>
                  <th className="px-3 py-2">Gauge</th>
                  <th className="px-3 py-2">in-lbs</th>
                  <th className="px-3 py-2">N·m</th>
                </tr>
              </thead>
              <tbody>
                {TORQUE_TABLE.map((r) => (
                  <tr key={r.terminal} className="border-t border-border">
                    <td className="px-3 py-2 text-fg">{r.terminal}</td>
                    <td className="px-3 py-2 text-fg-muted">{r.gauge}</td>
                    <td className="px-3 py-2 font-mono text-accent">{r.inLbs}</td>
                    <td className="px-3 py-2 font-mono text-fg-muted">{r.nm.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mounting & clearances</CardTitle>
            <CardDescription>Tech manual §4.1 · NEC service equipment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {INSTALL_CLEARANCES.map((c) => (
              <div
                key={c.item}
                className="flex items-start justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm"
              >
                <span className="text-fg-muted">{c.item}</span>
                <span className="text-right font-mono text-xs text-fg">{c.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fault code catalog</CardTitle>
          <CardDescription>Tech manual §8 · live events listed first</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeFaults.length > 0 && (
            <div className="space-y-2">
              {activeFaults.map((f) => (
                <div
                  key={f.id}
                  className="rounded-lg border border-danger/40 bg-danger-soft/20 px-3 py-2 text-sm"
                >
                  <div className="font-mono text-danger">
                    {f.code}-{f.sub} · {f.type}
                    {f.breakerLabel ? ` · ${f.breakerLabel}` : ""}
                  </div>
                  <div className="mt-1 text-xs text-fg-muted">{f.action}</div>
                </div>
              ))}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                <tr>
                  <th className="px-2 py-1.5">Code</th>
                  <th className="px-2 py-1.5">Type</th>
                  <th className="px-2 py-1.5">Condition</th>
                  <th className="px-2 py-1.5">Corrective</th>
                </tr>
              </thead>
              <tbody>
                {FAULT_CATALOG.map((f) => (
                  <tr key={`${f.code}-${f.sub}`} className="border-t border-border align-top">
                    <td className="px-2 py-1.5 font-mono text-accent">
                      {f.code}-{f.sub}
                    </td>
                    <td className="px-2 py-1.5 text-fg">{f.type}</td>
                    <td className="px-2 py-1.5 text-fg-muted">{f.condition}</td>
                    <td className="px-2 py-1.5 text-fg-muted">{f.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <p className={cn("text-[11px] text-fg-subtle")}>
        LOTO is a hardware path (IPC-LOTO-004). Use Circuits for per-pole faceplate detail.{" "}
        <button type="button" className="text-accent underline-offset-2 hover:underline" onClick={() => { selectBreaker(breakers[0]?.id ?? null); setView("circuits"); }}>
          Open circuits
        </button>
      </p>
    </div>
  );
}
