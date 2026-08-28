import { useMemo, useState } from "react";
import {
  CAVEATS,
  CLEARANCE_TABLE_MM,
  MATERIAL_GROUPS,
  METHOD_STEPS,
  POLLUTION_DEGREES,
  SPACING_CATEGORIES,
  WORKED_EXAMPLES,
  acRmsToPeak,
  interpolateClearanceMm,
  nearestCreepageRow,
  type SpacingCat,
} from "@/lib/ipc/ipc2221";
import { SheetFrame } from "./SheetFrame";
import { TitleBlock } from "./TitleBlock";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** PCB-001 appendix — IPC-2221 clearance + IEC creepage methods */
export function CreepageMethods() {
  const [vRms, setVRms] = useState(480);
  const [cat, setCat] = useState<SpacingCat>("B4");
  const [pd, setPd] = useState<1 | 2 | 3>(2);

  const vPeak = useMemo(() => acRmsToPeak(vRms), [vRms]);
  const clearance = useMemo(() => interpolateClearanceMm(vPeak, cat), [vPeak, cat]);
  const creepRow = useMemo(() => nearestCreepageRow(vRms), [vRms]);
  const creepage =
    pd === 1 ? creepRow.pd1 : pd === 2 ? creepRow.pd2 : creepRow.pd3;
  const adopted = Math.max(clearance, creepage);

  return (
    <div className="blueprint-sheet space-y-3">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-accent">
          PCB-001-APP · Rev A · Creepage Methods
        </div>
        <h3 className="text-sm font-semibold text-fg">
          IPC-2221 Clearance & Creepage Calculation Methods
        </h3>
        <p className="text-xs text-fg-muted">
          How spacing is derived for IPC-PCB-001 · B1–B4 categories · IEC 60664-1 creepage cross-check
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge variant="primary">IPC-2221B Table 6-1</Badge>
        <Badge variant="outline">IEC 60664-1 creepage</Badge>
        <Badge variant="warn">Not a certification tool</Badge>
      </div>

      <SheetFrame
        dwg="PCB-001-APP"
        rev="A"
        title="SPACING METHODS — CLEARANCE vs CREEPAGE"
        standard="IPC-2221B · IEC 60664-1"
      >
        <div className="overflow-x-auto">
          <svg
            viewBox="0 0 1100 420"
            className="h-auto w-full min-w-[860px]"
            role="img"
            aria-label="Clearance versus creepage diagram"
          >
            <rect width="1100" height="420" fill="rgba(5,10,16,1)" />
            <text x="40" y="32" fill="#5eb8a8" fontSize="12" fontFamily="monospace" fontWeight="700">
              CLEARANCE vs CREEPAGE (IPC + IEC CONCEPTS)
            </text>

            {/* Two pads */}
            <rect x="120" y="80" width="80" height="50" fill="rgba(212,84,74,0.3)" stroke="#d4544a" strokeWidth="1.5" />
            <text x="160" y="110" textAnchor="middle" fill="#e8eaed" fontSize="11" fontFamily="monospace">
              NET A
            </text>
            <rect x="420" y="80" width="80" height="50" fill="rgba(91,141,239,0.3)" stroke="#5b8def" strokeWidth="1.5" />
            <text x="460" y="110" textAnchor="middle" fill="#e8eaed" fontSize="11" fontFamily="monospace">
              NET B
            </text>

            {/* Clearance through air */}
            <line x1="200" y1="105" x2="420" y2="105" stroke="#c9a227" strokeWidth="2" strokeDasharray="6 3" />
            <text x="310" y="95" textAnchor="middle" fill="#c9a227" fontSize="11" fontFamily="monospace" fontWeight="700">
              CLEARANCE (through air)
            </text>
            <text x="310" y="148" textAnchor="middle" fill="#8b929e" fontSize="9" fontFamily="monospace">
              IPC-2221 Table 6-1 · f(Vpeak, B1–B4)
            </text>

            {/* Surface creepage path */}
            <path
              d="M200 130 C 260 200, 360 200, 420 130"
              fill="none"
              stroke="#5eb8a8"
              strokeWidth="2"
            />
            <text x="310" y="210" textAnchor="middle" fill="#5eb8a8" fontSize="11" fontFamily="monospace" fontWeight="700">
              CREEPAGE (along surface)
            </text>
            <text x="310" y="228" textAnchor="middle" fill="#8b929e" fontSize="9" fontFamily="monospace">
              IEC 60664-1 · f(Vrms, PD, CTI, insulation type)
            </text>

            {/* Board surface */}
            <rect x="100" y="250" width="420" height="16" fill="rgba(94,184,168,0.15)" stroke="#5eb8a8" strokeWidth="1" />
            <text x="310" y="262" textAnchor="middle" fill="#5c6370" fontSize="9" fontFamily="monospace">
              SOLDERMASK / FR4 SURFACE
            </text>

            {/* Barrier slot */}
            <rect x="290" y="250" width="40" height="16" fill="#050a10" stroke="#c9a227" strokeWidth="1" />
            <text x="310" y="290" textAnchor="middle" fill="#c9a227" fontSize="9" fontFamily="monospace">
              OPTIONAL MILLED SLOT increases creepage path
            </text>

            {/* Formula box */}
            <rect x="580" y="60" width="480" height="300" rx="4" fill="rgba(14,16,20,0.95)" stroke="#343b47" strokeWidth="1" />
            <text x="600" y="88" fill="#5eb8a8" fontSize="11" fontFamily="monospace" fontWeight="700">
              CALCULATION FLOW
            </text>
            {[
              "1  Vpeak = Vrms × √2   (sinusoidal AC)",
              "2  Pick category B1 / B2 / B3 / B4",
              "3  Clearance = Table 6-1 (Vpeak, cat)",
              "4  Pick PD + material group (CTI)",
              "5  Creepage = IEC table (Vrms, PD, CTI)",
              "6  Adopted = max(clearance, creepage,",
              "              datasheet, product std) + margin",
              "",
              "IPC-PCB-001 barrier:",
              "  Vrms = 480 V → Vpeak ≈ 679 V",
              "  B4 coated outer + reinforced path",
              "  IEC ~6.3 mm → design ≥ 8 mm (pref 10)",
            ].map((line, i) => (
              <text key={i} x="600" y={112 + i * 18} fill="#8b929e" fontSize="10" fontFamily="monospace">
                {line}
              </text>
            ))}

            <text x="40" y="340" fill="#5c6370" fontSize="9" fontFamily="monospace">
              NOTE: Clearance can be shorter than creepage; pollution and tracking force larger surface distances.
            </text>
            <text x="40" y="360" fill="#5c6370" fontSize="9" fontFamily="monospace">
              Optocouplers (SFH615A / MOC3021) provide component-level isolation; PCB barrier prevents flashover around the package.
            </text>
            <text x="40" y="400" fill="#5c6370" fontSize="9" fontFamily="monospace">
              Controlled educational appendix — verify against latest IPC-2221 / IEC 60664-1 tables before fab release.
            </text>
          </svg>
        </div>
      </SheetFrame>

      {/* Method steps */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {METHOD_STEPS.map((s) => (
          <div key={s.step} className="rounded-lg border border-border bg-surface/50 p-3">
            <div className="font-mono text-[10px] text-accent">STEP {s.step}</div>
            <div className="mt-0.5 text-sm font-medium text-fg">{s.title}</div>
            <p className="mt-1 text-[11px] leading-relaxed text-fg-muted">{s.body}</p>
          </div>
        ))}
      </div>

      {/* B1-B4 */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <div className="border-b border-border bg-surface-2 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
          IPC-2221B spacing categories
        </div>
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="font-mono text-[10px] text-fg-subtle">
            <tr>
              <th className="px-3 py-1.5">Cat</th>
              <th className="px-3 py-1.5">Name</th>
              <th className="px-3 py-1.5">Where</th>
              <th className="px-3 py-1.5">Altitude</th>
              <th className="px-3 py-1.5">Notes</th>
            </tr>
          </thead>
          <tbody>
            {SPACING_CATEGORIES.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-3 py-1.5 font-mono text-accent">{c.id}</td>
                <td className="px-3 py-1.5 text-fg">{c.name}</td>
                <td className="px-3 py-1.5 text-fg-muted">{c.where}</td>
                <td className="px-3 py-1.5 text-fg-muted">{c.altitude}</td>
                <td className="px-3 py-1.5 text-fg-muted">{c.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interactive calculator */}
      <div className="rounded-lg border border-primary/30 bg-bg-elevated p-4">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-accent">
          Interactive spacing estimator
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-xs">
            <span className="text-fg-muted">Working voltage Vrms</span>
            <input
              type="range"
              min={5}
              max={1000}
              step={5}
              value={vRms}
              onChange={(e) => setVRms(Number(e.target.value))}
              className="mt-1 w-full accent-[var(--accent)]"
            />
            <div className="mt-1 font-mono text-sm text-fg">{vRms} Vrms · peak {vPeak.toFixed(0)} V</div>
          </label>
          <label className="block text-xs">
            <span className="text-fg-muted">IPC-2221 category</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {(["B1", "B2", "B3", "B4"] as SpacingCat[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  className={cn(
                    "rounded border px-2 py-1 font-mono text-[11px]",
                    cat === c
                      ? "border-primary bg-primary-soft text-accent"
                      : "border-border text-fg-muted hover:border-border-strong",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </label>
          <label className="block text-xs">
            <span className="text-fg-muted">IEC pollution degree (creepage)</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {([1, 2, 3] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setPd(d)}
                  className={cn(
                    "rounded border px-2 py-1 font-mono text-[11px]",
                    pd === d
                      ? "border-primary bg-primary-soft text-accent"
                      : "border-border text-fg-muted hover:border-border-strong",
                  )}
                >
                  PD{d}
                </button>
              ))}
            </div>
          </label>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Metric label="IPC-2221 clearance" value={`${clearance.toFixed(2)} mm`} sub={`cat ${cat} @ ${vPeak.toFixed(0)} Vpk`} />
          <Metric
            label="IEC creepage (approx)"
            value={`${creepage.toFixed(2)} mm`}
            sub={`MG IIIa · PD${pd} · table ${creepRow.vRms} Vrms`}
          />
          <Metric
            label="Adopted min (stricter)"
            value={`${adopted.toFixed(2)} mm`}
            sub="max(clearance, creepage) before margin"
            accent
          />
        </div>
        <p className="mt-3 text-[11px] text-fg-subtle">
          For 480 Vrms barrier on IPC-PCB-001: design uses <span className="text-accent">≥ 8.0 mm</span> creepage
          (prefer 10 mm), which sits above the simplified IEC reinforced IIIa row (~6.3 mm @ 600 Vrms PD2).
        </p>
      </div>

      {/* Clearance table sample */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <div className="border-b border-border bg-surface-2 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
          Sample clearance table (mm) — interpolated breakpoints
        </div>
        <table className="w-full min-w-[520px] text-left text-xs">
          <thead className="font-mono text-[10px] text-fg-subtle">
            <tr>
              <th className="px-3 py-1.5">Vpeak</th>
              <th className="px-3 py-1.5">B1</th>
              <th className="px-3 py-1.5">B2</th>
              <th className="px-3 py-1.5">B3</th>
              <th className="px-3 py-1.5">B4</th>
            </tr>
          </thead>
          <tbody>
            {CLEARANCE_TABLE_MM.map((r) => (
              <tr key={r.vPeak} className="border-t border-border">
                <td className="px-3 py-1.5 font-mono text-accent">{r.vPeak}</td>
                <td className="px-3 py-1.5 font-mono text-fg-muted">{r.B1}</td>
                <td className="px-3 py-1.5 font-mono text-fg-muted">{r.B2}</td>
                <td className="px-3 py-1.5 font-mono text-fg-muted">{r.B3}</td>
                <td className="px-3 py-1.5 font-mono text-fg-muted">{r.B4}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="overflow-x-auto rounded-lg border border-border">
          <div className="border-b border-border bg-surface-2 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
            Pollution degrees (IEC)
          </div>
          <table className="w-full text-left text-xs">
            <tbody>
              {POLLUTION_DEGREES.map((p) => (
                <tr key={p.degree} className="border-t border-border">
                  <td className="px-3 py-1.5 font-mono text-accent">PD{p.degree}</td>
                  <td className="px-3 py-1.5 text-fg">{p.name}</td>
                  <td className="px-3 py-1.5 text-fg-muted">{p.apply}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto rounded-lg border border-border">
          <div className="border-b border-border bg-surface-2 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
            Material groups (CTI)
          </div>
          <table className="w-full text-left text-xs">
            <tbody>
              {MATERIAL_GROUPS.map((m) => (
                <tr key={m.id} className="border-t border-border">
                  <td className="px-3 py-1.5 font-mono text-accent">MG {m.id}</td>
                  <td className="px-3 py-1.5 text-fg">{m.cti}</td>
                  <td className="px-3 py-1.5 text-fg-muted">{m.fr4Note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Worked examples */}
      <div>
        <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
          Worked examples — IPC-PCB-001
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {WORKED_EXAMPLES.map((ex) => (
            <div key={ex.id} className="rounded-lg border border-border bg-surface/40 p-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-accent">{ex.id}</span>
                <span className="text-sm font-medium text-fg">{ex.title}</span>
              </div>
              <div className="mt-1 font-mono text-[10px] text-fg-muted">
                {ex.vRms} Vrms · {ex.vPeak.toFixed(0)} Vpeak
              </div>
              <ul className="mt-2 space-y-0.5 text-[11px] text-fg-muted">
                {ex.assumptions.map((a) => (
                  <li key={a}>· {a}</li>
                ))}
              </ul>
              <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                <div>
                  <div className="text-fg-subtle">IPC-2221</div>
                  <div className="font-mono text-fg">
                    {ex.ipc2221.clearanceMm.toFixed(2)} mm
                  </div>
                  <div className="text-fg-muted">{ex.ipc2221.cat}</div>
                </div>
                <div>
                  <div className="text-fg-subtle">IEC creep.</div>
                  <div className="font-mono text-fg">{ex.iec60664.creepageMm.toFixed(2)} mm</div>
                  <div className="text-fg-muted">{ex.iec60664.pollution}</div>
                </div>
                <div>
                  <div className="text-fg-subtle">IPC design</div>
                  <div className="font-mono text-accent">{ex.ipcDesign.adoptedMm.toFixed(1)} mm</div>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-fg-muted">{ex.ipcDesign.rationale}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-warn/30 bg-warn-soft/20 p-3">
        <div className="font-mono text-[10px] uppercase tracking-wider text-warn">Caveats</div>
        <ul className="mt-1 space-y-1 text-[11px] text-fg-muted">
          {CAVEATS.map((c) => (
            <li key={c}>· {c}</li>
          ))}
        </ul>
      </div>

      <TitleBlock
        dwg="PCB-001-APP"
        rev="A"
        title="IPC-2221 Clearance & Creepage Calculation Methods"
        scale="NTS"
      />
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-md border border-border bg-surface/60 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className={cn("mt-0.5 font-mono text-lg", accent ? "text-accent" : "text-fg")}>{value}</div>
      <div className="text-[10px] text-fg-muted">{sub}</div>
    </div>
  );
}
