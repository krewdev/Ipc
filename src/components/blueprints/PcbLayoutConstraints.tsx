import {
  CLEARANCES,
  DRC_CHECKLIST,
  FAB_NOTES,
  KEEPOUTS,
  PCB_IDENTITY,
  PLACEMENT,
  ROUTING,
  STACKUP,
} from "@/lib/ipc/pcbConstraints";
import { SheetFrame } from "./SheetFrame";
import { TitleBlock } from "./TitleBlock";
import { Badge } from "@/components/ui/badge";
import { CreepageMethods } from "./CreepageMethods";

const P = PCB_IDENTITY;

/** PCB-001 — layout constraint drawing for Edge AI logic board */
export function PcbLayoutConstraints() {
  return (
    <div className="blueprint-sheet space-y-6">
      <div className="space-y-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-accent">
            PCB-001 · Rev {P.rev} · Sheet 1/1
          </div>
          <h3 className="text-sm font-semibold text-fg">{P.title}</h3>
          <p className="text-xs text-fg-muted">
            {P.partNo} · {P.size.L}×{P.size.W}×{P.size.T} mm · {P.stackup} · {P.finish}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant="primary">{P.partNo}</Badge>
          <Badge variant="outline">{P.mcu.split("·")[0]!.trim()}</Badge>
          <Badge variant="outline">4 kV isol.</Badge>
          <Badge variant="warn">Creepage ≥8 mm</Badge>
          <Badge variant="outline">{P.operating}</Badge>
        </div>

        <SheetFrame
          dwg="PCB-001"
          rev={P.rev}
          title="EDGE AI LOGIC BOARD — FLOORPLAN + CONSTRAINTS"
          standard="IPC-2221 / UL isolation"
          units="MM"
          scale="2:1 NTS"
        >
          <div className="overflow-x-auto">
            <svg
              viewBox="0 0 1100 640"
              className="h-auto w-full min-w-[900px]"
              role="img"
              aria-label="PCB-001 layout constraint floorplan"
            >
              <defs>
                <pattern id="pcbgrid" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(94,184,168,0.06)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="1100" height="640" fill="url(#pcbgrid)" />

              <text x="40" y="24" fill="#5eb8a8" fontSize="11" fontFamily="monospace" fontWeight="700">
                COMPONENT FLOORPLAN (SCALE 5:1 VISUAL) · OUTLINE 120 × 80 mm
              </text>
              <rect x="40" y="40" width="600" height="400" fill="rgba(14,16,20,0.9)" stroke="#5eb8a8" strokeWidth="2" />

              <line x1="40" y1="455" x2="640" y2="455" stroke="#8b929e" strokeWidth="1" />
              <text x="340" y="470" textAnchor="middle" fill="#e8eaed" fontSize="10" fontFamily="monospace">
                120.0 mm
              </text>
              <line x1="30" y1="40" x2="30" y2="440" stroke="#8b929e" strokeWidth="1" />
              <text
                x="18"
                y="240"
                fill="#e8eaed"
                fontSize="10"
                fontFamily="monospace"
                transform="rotate(-90 18 240)"
              >
                80.0 mm
              </text>

              <rect
                x="300"
                y="40"
                width="50"
                height="400"
                fill="rgba(201,162,39,0.12)"
                stroke="#c9a227"
                strokeWidth="1.5"
                strokeDasharray="6 3"
              />
              <text
                x="325"
                y="240"
                textAnchor="middle"
                fill="#c9a227"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="700"
                transform="rotate(-90 325 240)"
              >
                KZ-1 ISOLATION ≥8 mm CREEPAGE
              </text>

              <text x="50" y="60" fill="#5eb8a8" fontSize="10" fontFamily="monospace" fontWeight="700">
                ZONE B — LOGIC / SELV
              </text>

              <rect x="70" y="90" width="120" height="80" fill="rgba(94,184,168,0.1)" stroke="#5eb8a8" strokeWidth="1.25" />
              <text x="130" y="120" textAnchor="middle" fill="#e8eaed" fontSize="11" fontFamily="monospace">
                U100 MCU
              </text>
              <text x="130" y="138" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
                LQFP-144
              </text>
              <text x="130" y="154" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
                480–600 MHz
              </text>

              <rect x="210" y="90" width="80" height="80" fill="rgba(139,124,240,0.12)" stroke="#8b7cf0" strokeWidth="1.25" />
              <text x="250" y="120" textAnchor="middle" fill="#e8eaed" fontSize="10" fontFamily="monospace">
                TPU
              </text>
              <text x="250" y="138" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
                4 TOPS
              </text>
              <text x="250" y="154" textAnchor="middle" fill="#8b7cf0" fontSize="7" fontFamily="monospace">
                KZ-3 thermal
              </text>
              {[0, 1, 2].map((r) =>
                [0, 1, 2].map((c) => (
                  <circle key={`${r}${c}`} cx={230 + c * 14} cy={148 + r * 8} r="1.5" fill="#8b7cf0" />
                )),
              )}

              <rect x="70" y="190" width="50" height="36" fill="rgba(201,162,39,0.1)" stroke="#c9a227" strokeWidth="1" />
              <text x="95" y="212" textAnchor="middle" fill="#c9a227" fontSize="8" fontFamily="monospace">
                ATECC
              </text>

              <rect x="130" y="190" width="40" height="36" fill="none" stroke="#5b8def" strokeWidth="1" />
              <text x="150" y="212" textAnchor="middle" fill="#5b8def" fontSize="8" fontFamily="monospace">
                Y1
              </text>

              <rect
                x="70"
                y="250"
                width="160"
                height="70"
                fill="rgba(91,141,239,0.1)"
                stroke="#5b8def"
                strokeWidth="1.25"
                strokeDasharray="4 2"
              />
              <text x="150" y="272" textAnchor="middle" fill="#5b8def" fontSize="10" fontFamily="monospace">
                KZ-2 ANALOG ISLAND
              </text>
              <text x="150" y="290" textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace">
                U32 ADS1256
              </text>
              <text x="150" y="306" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
                24-bit · 50 kSPS · star AGND
              </text>

              <rect x="280" y="100" width="90" height="40" fill="rgba(94,184,168,0.15)" stroke="#5eb8a8" strokeWidth="1.25" />
              <text x="325" y="118" textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace">
                U10 SFH615A
              </text>
              <text x="325" y="132" textAnchor="middle" fill="#8b929e" fontSize="7" fontFamily="monospace">
                straddles barrier
              </text>

              <rect x="280" y="160" width="90" height="40" fill="rgba(139,124,240,0.12)" stroke="#8b7cf0" strokeWidth="1.25" />
              <text x="325" y="178" textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace">
                U11 MOC3021
              </text>
              <text x="325" y="192" textAnchor="middle" fill="#8b929e" fontSize="7" fontFamily="monospace">
                latch isol.
              </text>

              <rect x="70" y="360" width="90" height="50" fill="rgba(201,162,39,0.12)" stroke="#c9a227" strokeWidth="1.25" />
              <text x="115" y="382" textAnchor="middle" fill="#c9a227" fontSize="9" fontFamily="monospace">
                J_LOTO
              </text>
              <text x="115" y="398" textAnchor="middle" fill="#8b929e" fontSize="7" fontFamily="monospace">
                KZ-5 +5V_GATE
              </text>

              <text x="370" y="60" fill="#d4544a" fontSize="10" fontFamily="monospace" fontWeight="700">
                ZONE A — LINE ≤480 V
              </text>

              <rect x="380" y="90" width="100" height="50" fill="rgba(212,84,74,0.1)" stroke="#d4544a" strokeWidth="1.25" />
              <text x="430" y="112" textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace">
                U12 H11AA1
              </text>
              <text x="430" y="128" textAnchor="middle" fill="#8b929e" fontSize="7" fontFamily="monospace">
                ZC detect
              </text>

              <rect x="500" y="90" width="120" height="50" fill="rgba(212,84,74,0.1)" stroke="#d4544a" strokeWidth="1.25" />
              <text x="560" y="112" textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace">
                SCR IF / GATE+
              </text>
              <text x="560" y="128" textAnchor="middle" fill="#8b929e" fontSize="7" fontFamily="monospace">
                to IPC-SCR-002
              </text>

              <rect x="380" y="170" width="100" height="50" fill="rgba(91,141,239,0.1)" stroke="#5b8def" strokeWidth="1.25" />
              <text x="430" y="192" textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace">
                U31 ACS758
              </text>
              <text x="430" y="208" textAnchor="middle" fill="#8b929e" fontSize="7" fontFamily="monospace">
                Hall ±200 A
              </text>

              <rect x="500" y="170" width="120" height="50" fill="rgba(201,162,39,0.1)" stroke="#c9a227" strokeWidth="1.25" />
              <text x="560" y="192" textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace">
                U30 INA226
              </text>
              <text x="560" y="208" textAnchor="middle" fill="#8b929e" fontSize="7" fontFamily="monospace">
                1 mΩ Kelvin
              </text>

              <rect x="380" y="250" width="240" height="50" fill="none" stroke="#d4544a" strokeWidth="1" strokeDasharray="3 2" />
              <text x="500" y="272" textAnchor="middle" fill="#d4544a" fontSize="9" fontFamily="monospace">
                L / N / LOAD HEADERS
              </text>
              <text x="500" y="288" textAnchor="middle" fill="#5c6370" fontSize="7" fontFamily="monospace">
                HV spacing · no logic copper
              </text>

              <rect
                x="500"
                y="340"
                width="120"
                height="70"
                fill="rgba(91,141,239,0.08)"
                stroke="#5b8def"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              <text x="560" y="370" textAnchor="middle" fill="#5b8def" fontSize="9" fontFamily="monospace">
                KZ-6 RF
              </text>
              <text x="560" y="388" textAnchor="middle" fill="#8b929e" fontSize="7" fontFamily="monospace">
                5 mm metal free
              </text>

              {[
                [50, 50],
                [630, 50],
                [50, 430],
                [630, 430],
              ].map(([cx, cy], i) => (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="6" fill="none" stroke="#8b929e" strokeWidth="1" />
                  <circle cx={cx} cy={cy} r="2" fill="#8b929e" />
                </g>
              ))}

              <text x="680" y="50" fill="#5eb8a8" fontSize="11" fontFamily="monospace" fontWeight="700">
                4-LAYER STACKUP
              </text>
              {STACKUP.map((s, i) => (
                <g key={s.layer}>
                  <rect
                    x={680}
                    y={65 + i * 52}
                    width={380}
                    height={46}
                    fill="rgba(14,16,20,0.95)"
                    stroke={i === 1 ? "#5eb8a8" : "#343b47"}
                    strokeWidth="1"
                  />
                  <text x={692} y={83 + i * 52} fill="#5eb8a8" fontSize="10" fontFamily="monospace">
                    {s.layer} {s.name}
                  </text>
                  <text x={692} y={98 + i * 52} fill="#e8eaed" fontSize="8" fontFamily="monospace">
                    {s.role}
                  </text>
                  <text x={1045} y={90 + i * 52} textAnchor="end" fill="#8b929e" fontSize="8" fontFamily="monospace">
                    {s.copper}
                  </text>
                </g>
              ))}

              <text x="680" y="290" fill="#c9a227" fontSize="11" fontFamily="monospace" fontWeight="700">
                CRITICAL RULES (SUMMARY)
              </text>
              {[
                "1. Creepage logic↔line ≥8 mm (prefer 10 mm)",
                "2. Optos U10/U11 must straddle barrier",
                "3. +5V_GATE only via LOTO (no bypass)",
                "4. 100 nF X7R every power pin <3 mm",
                "5. ADC star-ground · no digital under U32",
                "6. TPU ≥9 thermal vias · 2 W class",
                "7. SPI ADC length ≤40 mm",
                "8. Kelvin shunt equal-length ≤25 mm",
                "9. Red conformal coat on sense nets",
                "10. Hi-pot 4 kV RMS logic↔line 1 s",
              ].map((line, i) => (
                <text key={line} x="680" y={312 + i * 16} fill="#8b929e" fontSize="9" fontFamily="monospace">
                  {line}
                </text>
              ))}

              <text x="40" y="520" fill="#5c6370" fontSize="9" fontFamily="monospace">
                NOTE: Floorplan is constraint guidance (NTS). Exact placement in CAD must satisfy DRC checklist PCB-001.
                Controlled: xAI Engineering.
              </text>
              <text x="40" y="540" fill="#5c6370" fontSize="9" fontFamily="monospace">
                Related: SCH-002 gate nets · DWG-001 stack · UL 1699 / IEC 60947-2 · tech manual −40…+85 °C.
              </text>
            </svg>
          </div>
        </SheetFrame>

        <div className="grid gap-3 lg:grid-cols-2">
          <Table
            title="Keepout zones"
            headers={["ID", "Zone", "Rule"]}
            rows={KEEPOUTS.map((k) => [k.id, k.name, k.rule])}
          />
          <Table
            title="Clearance / creepage"
            headers={["Net A", "Net B", "Clr mm", "Crp mm"]}
            rows={CLEARANCES.map((c) => [
              c.netA,
              c.netB,
              c.clearanceMm.toFixed(1),
              c.creepageMm.toFixed(1),
            ])}
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <div className="border-b border-border bg-surface-2 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
            Placement priority
          </div>
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="font-mono text-[10px] text-fg-subtle">
              <tr>
                <th className="px-3 py-1.5">Pri</th>
                <th className="px-3 py-1.5">Ref</th>
                <th className="px-3 py-1.5">Part</th>
                <th className="px-3 py-1.5">Placement</th>
                <th className="px-3 py-1.5">Orientation / notes</th>
              </tr>
            </thead>
            <tbody>
              {PLACEMENT.map((p) => (
                <tr key={p.ref} className="border-t border-border">
                  <td className="px-3 py-1.5 font-mono text-accent">{p.priority}</td>
                  <td className="px-3 py-1.5 font-mono text-fg">{p.ref}</td>
                  <td className="px-3 py-1.5 text-fg">{p.part}</td>
                  <td className="px-3 py-1.5 text-fg-muted">{p.placement}</td>
                  <td className="px-3 py-1.5 text-fg-muted">{p.orientation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <div className="border-b border-border bg-surface-2 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
            Routing constraints
          </div>
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="font-mono text-[10px] text-fg-subtle">
              <tr>
                <th className="px-3 py-1.5">Net</th>
                <th className="px-3 py-1.5">Topology</th>
                <th className="px-3 py-1.5">Max length</th>
                <th className="px-3 py-1.5">Impedance</th>
                <th className="px-3 py-1.5">Notes</th>
              </tr>
            </thead>
            <tbody>
              {ROUTING.map((r) => (
                <tr key={r.net} className="border-t border-border">
                  <td className="px-3 py-1.5 font-mono text-accent">{r.net}</td>
                  <td className="px-3 py-1.5 text-fg">{r.topology}</td>
                  <td className="px-3 py-1.5 font-mono text-fg-muted">{r.maxLenMm}</td>
                  <td className="px-3 py-1.5 text-fg-muted">{r.impedance}</td>
                  <td className="px-3 py-1.5 text-fg-muted">{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <div className="border-b border-border bg-surface-2 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
            DRC release checklist
          </div>
          <table className="w-full min-w-[520px] text-left text-xs">
            <thead className="font-mono text-[10px] text-fg-subtle">
              <tr>
                <th className="px-3 py-1.5">ID</th>
                <th className="px-3 py-1.5">Check</th>
                <th className="px-3 py-1.5">Severity</th>
              </tr>
            </thead>
            <tbody>
              {DRC_CHECKLIST.map((d) => (
                <tr key={d.id} className="border-t border-border">
                  <td className="px-3 py-1.5 font-mono text-accent">{d.id}</td>
                  <td className="px-3 py-1.5 text-fg">{d.check}</td>
                  <td className="px-3 py-1.5">
                    <span
                      className={
                        d.severity === "Critical"
                          ? "text-danger"
                          : d.severity === "Major"
                            ? "text-warn"
                            : "text-fg-muted"
                      }
                    >
                      {d.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-border bg-surface/40 p-3">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">Fab & test notes</div>
          <ul className="space-y-1 text-[11px] text-fg-muted">
            {FAB_NOTES.map((n) => (
              <li key={n} className="font-mono leading-relaxed">
                · {n}
              </li>
            ))}
          </ul>
        </div>

        <TitleBlock dwg="PCB-001" rev={P.rev} title={P.title} scale="NTS" />
      </div>

      {/* IPC-2221 methods appendix */}
      <div className="border-t border-primary/20 pt-6">
        <CreepageMethods />
      </div>
    </div>
  );
}

function Table({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <div className="border-b border-border bg-surface-2 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
        {title}
      </div>
      <table className="w-full text-left text-xs">
        <thead className="font-mono text-[10px] text-fg-subtle">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-1.5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border align-top">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={j === 0 ? "px-3 py-1.5 font-mono text-accent" : "px-3 py-1.5 text-fg-muted"}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
