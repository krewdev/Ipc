import { NETWORK_IFACES, SECURITY_STACK } from "@/lib/ipc/blueprints";
import { TitleBlock } from "./TitleBlock";

const LAYERS = [
  {
    id: "L1",
    title: "Colossus Supercomputer",
    sub: "Memphis · Grok training / orchestration",
    meta: "OC-192 · 100 Gbps · <1 ms",
    color: "#8b7cf0",
  },
  {
    id: "L2",
    title: "Starlink Backbone",
    sub: "Ku-band LEO mesh",
    meta: "12.5 Gbps · 20–40 ms",
    color: "#5b8def",
  },
  {
    id: "L3",
    title: "Commercial Mid-Tier Hubs",
    sub: "Phase balancer · regional cache",
    meta: "mmWave 27.5–29.5 GHz · <5 ms",
    color: "#c9a227",
  },
  {
    id: "L4",
    title: "Residential Edge TPU Nodes",
    sub: "NILM · altruistic INT8 compute",
    meta: "1–10 Gbps · local inference",
    color: "#5eb8a8",
  },
  {
    id: "L5",
    title: "Humanoid / V2H End Devices",
    sub: "Optimus · CAN-FD + 380 V DC umbilical",
    meta: "5 Mbps CAN-FD · <1 ms",
    color: "#4aad6a",
  },
];

export function NetworkTopology({ imageSrc }: { imageSrc?: string }) {
  return (
    <div className="blueprint-sheet space-y-3">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-accent">SYS-003 · Rev A</div>
        <h3 className="text-sm font-semibold text-fg">Planetary Intelligence Grid — Network Topology</h3>
        <p className="text-xs text-fg-muted">
          IEEE 802.1Q · 3GPP NR mmWave · Starlink API · End-to-end Memphis Colossus → residential edge
        </p>
      </div>

      {imageSrc && (
        <div className="overflow-hidden rounded-lg border border-primary/25 bg-[#071018]">
          <img src={imageSrc} alt="SYS-003 planetary grid" className="max-h-[280px] w-full object-contain" />
        </div>
      )}

      <div className="space-y-2">
        {LAYERS.map((layer, i) => (
          <div key={layer.id} className="relative">
            <div
              className="flex flex-wrap items-center gap-3 rounded-lg border bg-surface/80 px-3 py-3"
              style={{ borderColor: `${layer.color}55` }}
            >
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-md font-mono text-xs font-semibold"
                style={{ background: `${layer.color}22`, color: layer.color }}
              >
                {layer.id}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-fg">{layer.title}</div>
                <div className="text-xs text-fg-muted">{layer.sub}</div>
              </div>
              <div className="font-mono text-[11px]" style={{ color: layer.color }}>
                {layer.meta}
              </div>
            </div>
            {i < LAYERS.length - 1 && (
              <div className="mx-auto h-3 w-px bg-border-strong" aria-hidden />
            )}
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[600px] text-left text-xs">
          <thead className="bg-surface-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
            <tr>
              <th className="px-3 py-2">Interface</th>
              <th className="px-3 py-2">Protocol</th>
              <th className="px-3 py-2">Data rate</th>
              <th className="px-3 py-2">Latency</th>
            </tr>
          </thead>
          <tbody>
            {NETWORK_IFACES.map((row) => (
              <tr key={row.link} className="border-t border-border">
                <td className="px-3 py-2 text-fg">{row.link}</td>
                <td className="px-3 py-2 font-mono text-accent">{row.protocol}</td>
                <td className="px-3 py-2 tabular text-fg-muted">{row.rate}</td>
                <td className="px-3 py-2 tabular text-fg-muted">{row.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-2 sm:grid-cols-3 text-[11px]">
        <Sec title="Authentication" body={SECURITY_STACK.auth} />
        <Sec title="Root of trust" body={SECURITY_STACK.rootOfTrust} />
        <Sec title="OTA signing" body={SECURITY_STACK.ota} />
      </div>

      <TitleBlock dwg="SYS-003" rev="A" title="Planetary Intelligence Grid — Network Topology" />
    </div>
  );
}

function Sec({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-border bg-surface/50 px-3 py-2">
      <div className="font-mono text-[10px] text-fg-subtle">{title}</div>
      <div className="mt-0.5 font-mono text-fg-muted">{body}</div>
    </div>
  );
}
