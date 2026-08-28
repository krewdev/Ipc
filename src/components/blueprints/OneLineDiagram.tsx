import { ONELINE } from "@/lib/ipc/blueprints";
import { SheetFrame } from "./SheetFrame";
import { TitleBlock } from "./TitleBlock";

/** OL-004 — dense multi-environment one-line with IEEE-style symbols */
export function OneLineDiagram() {
  const U = ONELINE.utility;
  const R = ONELINE.residential;
  const C = ONELINE.commercial;
  const D = ONELINE.datacenter;

  return (
    <div className="blueprint-sheet space-y-3">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-accent">OL-004 · Rev A · Sheet 1/1</div>
        <h3 className="text-sm font-semibold text-fg">Multi-Environment Power Distribution One-Line</h3>
        <p className="text-xs text-fg-muted">
          {U.voltage} · {U.service} · {U.standard} · Symbology ANSI/IEEE C37
        </p>
      </div>

      <SheetFrame dwg="OL-004" rev="A" title="POWER ONE-LINE — R1+ / C1 / D2" standard="NFPA 70 / IEEE C37">
        <div className="overflow-x-auto">
          <svg
            viewBox="0 0 1100 700"
            className="h-auto w-full min-w-[920px]"
            role="img"
            aria-label="Detailed OL-004 one-line diagram"
          >
            <defs>
              <pattern id="olgrid" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(94,184,168,0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1100" height="700" fill="url(#olgrid)" />

            {/* Legend */}
            <g>
              <text x="40" y="24" fill="#5eb8a8" fontSize="10" fontFamily="monospace" fontWeight="700">
                LEGEND
              </text>
              <rect x="40" y="32" width="18" height="12" fill="none" stroke="#5eb8a8" strokeWidth="1.25" />
              <text x="64" y="42" fill="#8b929e" fontSize="8" fontFamily="monospace">
                MCCB
              </text>
              <circle cx="120" cy="38" r="7" fill="none" stroke="#c9a227" strokeWidth="1.25" />
              <text x="132" y="42" fill="#8b929e" fontSize="8" fontFamily="monospace">
                Source
              </text>
              <line x1="190" y1="38" x2="220" y2="38" stroke="#5eb8a8" strokeWidth="2" />
              <text x="226" y="42" fill="#8b929e" fontSize="8" fontFamily="monospace">
                Bus
              </text>
              <path d="M290 32 L300 44 L310 32" fill="none" stroke="#5b8def" strokeWidth="1.25" />
              <text x="318" y="42" fill="#8b929e" fontSize="8" fontFamily="monospace">
                XFMR
              </text>
              <circle cx="380" cy="38" r="5" fill="none" stroke="#8b7cf0" strokeWidth="1" />
              <text x="390" y="42" fill="#8b929e" fontSize="8" fontFamily="monospace">
                CT
              </text>
            </g>

            {/* Utility */}
            <circle cx="550" cy="70" r="18" fill="none" stroke="#c9a227" strokeWidth="1.75" />
            <text x="550" y="74" textAnchor="middle" fill="#c9a227" fontSize="12" fontFamily="monospace">
              G
            </text>
            <text x="550" y="104" textAnchor="middle" fill="#8b929e" fontSize="10" fontFamily="monospace">
              UTILITY 480Y/277 V 3Φ4W
            </text>
            <text x="550" y="118" textAnchor="middle" fill="#5c6370" fontSize="9" fontFamily="monospace">
              SERVICE ENTRANCE 800 A · AIC per utility
            </text>

            <line x1="550" y1="88" x2="550" y2="130" stroke="#5eb8a8" strokeWidth="2" />
            {/* Main MCCB */}
            <rect x="515" y="130" width="70" height="28" fill="none" stroke="#5eb8a8" strokeWidth="1.75" />
            <text x="550" y="148" textAnchor="middle" fill="#e8eaed" fontSize="10" fontFamily="monospace">
              800A 3P
            </text>
            <text x="590" y="148" fill="#5c6370" fontSize="8" fontFamily="monospace">
              MAIN
            </text>
            {/* CT on main */}
            <circle cx="550" cy="172" r="6" fill="none" stroke="#8b7cf0" strokeWidth="1" />
            <text x="562" y="176" fill="#8b7cf0" fontSize="8" fontFamily="monospace">
              CT 800:5
            </text>
            <line x1="550" y1="158" x2="550" y2="166" stroke="#5eb8a8" strokeWidth="2" />
            <line x1="550" y1="178" x2="550" y2="200" stroke="#5eb8a8" strokeWidth="2" />

            {/* Main bus */}
            <line x1="80" y1="200" x2="1020" y2="200" stroke="#5eb8a8" strokeWidth="3" />
            <text x="80" y="192" fill="#5eb8a8" fontSize="10" fontFamily="monospace">
              MAIN DISTRIBUTION BUS · 480 V 3Φ · Cu 250 kcmil EQUIV.
            </text>

            {/* Droppers */}
            <line x1="220" y1="200" x2="220" y2="230" stroke="#5eb8a8" strokeWidth="1.75" />
            <line x1="550" y1="200" x2="550" y2="230" stroke="#5b8def" strokeWidth="1.75" />
            <line x1="880" y1="200" x2="880" y2="230" stroke="#8b7cf0" strokeWidth="1.75" />

            {/* RESIDENTIAL FEEDER */}
            <FeederPanel
              x={80}
              color="#5eb8a8"
              title="RESIDENTIAL R1+"
              subtitle="XFMR 480–240 V · 120/240 V SPLIT"
              mainLabel="200A 2P"
              icu="Icu 100 kA @ 240 V"
              items={[
                { t: "PV DC-COUPLED", r: "40A", note: "NEC 705 120%" },
                { t: "BATTERY BESS", r: "40A", note: "bidirectional" },
                { t: "EVSE L2", r: "50A", note: "PWM / ALMS" },
                { t: "V2H OPTIMUS", r: "50A", note: "CAN-FD + DC" },
                { t: "WATER HEATER", r: "30A", note: "Matter" },
                { t: "GENERAL BR", r: "20A", note: "×N poles" },
              ]}
            />

            {/* COMMERCIAL */}
            <FeederPanel
              x={410}
              color="#5b8def"
              title="COMMERCIAL C1"
              subtitle="480 V 3Φ WYE · PSR PHASE BALANCER"
              mainLabel="600A 3P"
              icu="Icu 250 kA @ 480 V"
              items={[
                { t: "PSR MATRIX", r: "—", note: "L1/L2/L3" },
                { t: "HVAC COMP", r: "40A 3Φ", note: "staged shed" },
                { t: "LIGHTING", r: "20A", note: "warehouse" },
                { t: "SERVER UPS", r: "100A 3Φ", note: "critical" },
                { t: "GENERAL BR", r: "var", note: "to 60 poles" },
                { t: "15-MIN DEMAND", r: "—", note: "peak cap" },
              ]}
            />

            {/* DATACENTER */}
            <FeederPanel
              x={740}
              color="#8b7cf0"
              title="DATACENTER D2"
              subtitle="380 V DC DUAL-RAIL · STS ≤0.40 ms"
              mainLabel="1200A"
              icu="Icu 500 kA @ 380 V DC"
              items={[
                { t: "RECTIFIER BANK", r: "—", note: "AC→380VDC" },
                { t: "RAIL A / RAIL B", r: "380V", note: "N+1" },
                { t: "STS CORE", r: "—", note: "IGBT bridge" },
                { t: "RACK PDU-A", r: "150A", note: "F3 Class J" },
                { t: "RACK PDU-B", r: "150A", note: "F4 Class J" },
                { t: "84-POLE MON", r: "—", note: "branch CT" },
              ]}
            />

            {/* Ground symbol */}
            <g transform="translate(550,640)">
              <line x1="0" y1="0" x2="0" y2="12" stroke="#8b929e" strokeWidth="1.25" />
              <line x1="-12" y1="12" x2="12" y2="12" stroke="#8b929e" strokeWidth="1.25" />
              <line x1="-8" y1="18" x2="8" y2="18" stroke="#8b929e" strokeWidth="1.25" />
              <line x1="-4" y1="24" x2="4" y2="24" stroke="#8b929e" strokeWidth="1.25" />
              <text x="20" y="18" fill="#8b929e" fontSize="8" fontFamily="monospace">
                EQUIPMENT GROUND
              </text>
            </g>

            <text x="40" y="670" fill="#5c6370" fontSize="8" fontFamily="monospace">
              NOTES: 1. Fail-safe thermal-magnetic path independent of MCU. 2. SSR zero-cross + MCB isolation on each branch.
            </text>
            <text x="40" y="686" fill="#5c6370" fontSize="8" fontFamily="monospace">
              3. NEC 705 120% busbar rule for PV/storage. 4. ALMS per NEC 220.70. 5. Revenue CT/PT 0.2% class on service.
            </text>
          </svg>
        </div>
      </SheetFrame>

      <div className="grid gap-3 lg:grid-cols-3">
        <BranchTable title="Residential R1+" color="text-accent" rows={R.loads} bus={R.bus} icu={R.icu} />
        <BranchTable title="Commercial C1" color="text-info" rows={C.loads} bus={C.bus} icu={C.icu} />
        <BranchTable title="Datacenter D2" color="text-phase-c" rows={D.loads} bus={D.bus} icu={D.icu} />
      </div>

      <TitleBlock dwg="OL-004" rev="A" title="Multi-Environment Power Distribution One-Line Diagram" scale="NTS" />
    </div>
  );
}

function FeederPanel({
  x,
  color,
  title,
  subtitle,
  mainLabel,
  icu,
  items,
}: {
  x: number;
  color: string;
  title: string;
  subtitle: string;
  mainLabel: string;
  icu: string;
  items: { t: string; r: string; note: string }[];
}) {
  const w = 280;
  const h = 380;
  return (
    <g>
      <rect x={x} y={230} width={w} height={h} rx="4" fill="rgba(12,16,22,0.95)" stroke={color} strokeWidth="1.5" />
      <rect x={x} y={230} width={w} height={44} fill={color} fillOpacity={0.12} />
      <text x={x + w / 2} y={250} textAnchor="middle" fill={color} fontSize="12" fontFamily="monospace" fontWeight="700">
        {title}
      </text>
      <text x={x + w / 2} y={266} textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
        {subtitle}
      </text>

      {/* feeder MCCB */}
      <rect x={x + 100} y={286} width={80} height={22} fill="none" stroke={color} strokeWidth="1.25" />
      <text x={x + w / 2} y={301} textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace">
        {mainLabel}
      </text>
      <line x1={x + w / 2} y1={308} x2={x + w / 2} y2={330} stroke={color} strokeWidth="1.5" />
      {/* sub-bus */}
      <line x1={x + 24} y1={330} x2={x + w - 24} y2={330} stroke={color} strokeWidth="2" />

      {items.map((it, i) => {
        const y = 350 + i * 34;
        return (
          <g key={it.t}>
            <line x1={x + 40} y1={330} x2={x + 40} y2={y} stroke={color} strokeWidth="1" opacity={0.6} />
            <line x1={x + 40} y1={y} x2={x + 56} y2={y} stroke={color} strokeWidth="1.25" />
            <line x1={x + 56} y1={y - 6} x2={x + 56} y2={y + 6} stroke={color} strokeWidth="1.25" />
            <text x={x + 66} y={y + 4} fill="#e8eaed" fontSize="10" fontFamily="monospace">
              {it.t}
            </text>
            <text x={x + w - 70} y={y + 4} fill={color} fontSize="10" fontFamily="monospace">
              {it.r}
            </text>
            <text x={x + w - 12} y={y + 4} textAnchor="end" fill="#5c6370" fontSize="8" fontFamily="monospace">
              {it.note}
            </text>
          </g>
        );
      })}

      <text x={x + 12} y={230 + h - 12} fill="#5c6370" fontSize="8" fontFamily="monospace">
        {icu}
      </text>
    </g>
  );
}

function BranchTable({
  title,
  color,
  rows,
  bus,
  icu,
}: {
  title: string;
  color: string;
  rows: readonly { name: string; rating: string }[];
  bus: string;
  icu: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className={`border-b border-border bg-surface-2 px-3 py-2 font-mono text-[11px] ${color}`}>{title}</div>
      <div className="px-3 py-1.5 text-[10px] text-fg-muted">
        Bus {bus} · Icu {icu}
      </div>
      <table className="w-full text-left text-xs">
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-t border-border">
              <td className="px-3 py-1.5 text-fg">{r.name}</td>
              <td className="px-3 py-1.5 text-right font-mono text-accent">{r.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
