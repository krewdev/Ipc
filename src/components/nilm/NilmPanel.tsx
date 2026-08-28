import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useIpcStore } from "@/lib/ipc/store";
import { formatPower } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#3d9e8f", "#5b8def", "#c9a227", "#d4544a", "#8b7cf0", "#5eb8a8", "#a78bfa", "#f59e0b"];

export function NilmPanel() {
  const devices = useIpcStore((s) => s.devices);
  const edge = useIpcStore((s) => s.edge);
  const total = devices.reduce((s, d) => s + d.powerW, 0);
  const sorted = [...devices].sort((a, b) => b.powerW - a.powerW);

  const harmonicAvg =
    devices[0]?.harmonicSignature.map((_, i) => ({
      k: i === 0 ? "1" : String(i % 2 === 0 ? i : i * 2 + 1),
      mag: devices.reduce((s, d) => s + d.harmonicSignature[i]!, 0) / devices.length,
    })) ?? [];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">NILM Engine</h1>
        <p className="text-sm text-fg-muted">
          Non-intrusive load monitoring · 1D CNN + Bi-LSTM Seq2Seq · Edge TPU int8 inference
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-fg-subtle">Disaggregated</div>
            <div className="mt-1 tabular text-2xl font-semibold text-accent">{formatPower(total)}</div>
            <div className="text-xs text-fg-muted">{devices.filter((d) => d.on).length} active signatures</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-fg-subtle">Inference latency</div>
            <div className="mt-1 tabular text-2xl font-semibold">{edge.inferenceMs.toFixed(1)} ms</div>
            <div className="text-xs text-fg-muted">Target under 20 ms on Coral TPU</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-fg-subtle">TPU mode</div>
            <div className="mt-1 text-2xl font-semibold">{edge.mode}</div>
            <div className="text-xs text-fg-muted">
              {edge.mode === "ALTRUISTIC"
                ? `${edge.altruisticJobs} public-good jobs`
                : edge.mode === "SAFETY"
                  ? "AFCI FFT priority"
                  : "Device state decode"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Device Power Map</CardTitle>
            <CardDescription>V-I trajectory + harmonic fingerprints → device states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {sorted.map((d, i) => {
              const pct = total > 0 ? (d.powerW / total) * 100 : 0;
              return (
                <div key={d.id} className="rounded-lg border border-border bg-surface-2 p-3">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{ background: COLORS[i % COLORS.length] }}
                      />
                      <span className="truncate text-sm font-medium">{d.name}</span>
                      <Badge variant={d.on ? "ok" : "default"}>{d.on ? "ON" : "OFF"}</Badge>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="tabular text-sm font-semibold">{formatPower(d.powerW)}</div>
                      <div className="tabular text-[10px] text-fg-muted">
                        conf {(d.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-bg">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(d.on ? 2 : 0, pct)}%`,
                        background: COLORS[i % COLORS.length],
                      }}
                    />
                  </div>
                  <div className="mt-2 flex gap-0.5">
                    {d.harmonicSignature.slice(0, 10).map((h, hi) => (
                      <div
                        key={hi}
                        className="flex-1 rounded-sm bg-primary/20"
                        style={{ height: 4 + h * 16, opacity: 0.4 + h * 0.6 }}
                        title={`H${hi + 1}: ${h.toFixed(2)}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Harmonic Spectrum</CardTitle>
            <CardDescription>Average odd/even harmonic magnitudes</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={harmonicAvg} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="k" tick={{ fill: "#5c6370", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#5c6370", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#14171c",
                    border: "1px solid #252a33",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="mag" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                  {harmonicAvg.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
          <CardContent className="border-t border-border pt-3 text-xs leading-relaxed text-fg-muted">
            <p>
              Feature pipeline: windowed V/I → FFT harmonics (k=2…49) → ΔP/ΔQ event features → Edge
              TPU 1D-CNN + Bi-LSTM decoder. Models quantized float32→int8 via Edge TPU compiler.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
