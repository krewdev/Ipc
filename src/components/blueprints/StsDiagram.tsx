import { STS_BOM, STS_MARGINS, STS_TIMING } from "@/lib/ipc/blueprints";
import { SheetFrame } from "./SheetFrame";
import { TitleBlock } from "./TitleBlock";

/** SCH-006 — detailed dual-rail STS power electronics */
export function StsDiagram() {
  return (
    <div className="blueprint-sheet space-y-3">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-accent">SCH-006 · Rev A · Sheet 1/1</div>
        <h3 className="text-sm font-semibold text-fg">Dual-Rail 380 V DC Static Transfer Switch</h3>
        <p className="text-xs text-fg-muted">
          IEC 62040-3 · IEEE 446 · Dual-IGBT bidirectional · DSP TMS320F28379D · blackout ≤0.40 ms
        </p>
      </div>

      <SheetFrame dwg="SCH-006" rev="A" title="380 V DC STS — POWER STAGE + SENSE" standard="IEC 62040-3">
        <div className="overflow-x-auto">
          <svg
            viewBox="0 0 1100 680"
            className="h-auto w-full min-w-[900px]"
            role="img"
            aria-label="Detailed SCH-006 STS schematic"
          >
            <defs>
              <pattern id="stsgrid" width="12" height="12" patternUnits="userSpaceOnUse">
                <path d="M 12 0 L 0 0 0 12" fill="none" stroke="rgba(139,124,240,0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1100" height="680" fill="url(#stsgrid)" />

            <text x="40" y="28" fill="#8b7cf0" fontSize="11" fontFamily="monospace" fontWeight="700">
              RAIL A — PRIMARY 380 V DC
            </text>
            <text x="40" y="320" fill="#5b8def" fontSize="11" fontFamily="monospace" fontWeight="700">
              RAIL B — STANDBY 380 V DC
            </text>

            {/* Utility / rectifier */}
            <rect x="40" y="50" width="120" height="50" rx="3" fill="rgba(14,16,20,0.95)" stroke="#8b7cf0" strokeWidth="1.25" />
            <text x="100" y="72" textAnchor="middle" fill="#e8eaed" fontSize="10" fontFamily="monospace">
              UTILITY AC
            </text>
            <text x="100" y="88" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              → RECT BANK
            </text>

            {/* F1 */}
            <path d="M160 75 H200" stroke="#8b7cf0" strokeWidth="1.5" fill="none" />
            <rect x="200" y="62" width="40" height="26" fill="none" stroke="#c9a227" strokeWidth="1.25" />
            <text x="220" y="80" textAnchor="middle" fill="#c9a227" fontSize="8" fontFamily="monospace">
              F1
            </text>
            <text x="220" y="100" textAnchor="middle" fill="#5c6370" fontSize="7" fontFamily="monospace">
              1500A DC
            </text>
            <path d="M240 75 H280" stroke="#8b7cf0" strokeWidth="1.5" fill="none" />

            {/* Rail A bus + cap */}
            <rect x="280" y="50" width="100" height="50" rx="3" fill="rgba(14,16,20,0.95)" stroke="#8b7cf0" strokeWidth="1.25" />
            <text x="330" y="72" textAnchor="middle" fill="#e8eaed" fontSize="10" fontFamily="monospace">
              RAIL A
            </text>
            <text x="330" y="88" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              380 V DC
            </text>

            {/* C1 cap */}
            <path d="M330 100 V120" stroke="#8b7cf0" strokeWidth="1" fill="none" />
            <line x1="315" y1="120" x2="345" y2="120" stroke="#c9a227" strokeWidth="2" />
            <line x1="315" y1="128" x2="345" y2="128" stroke="#c9a227" strokeWidth="2" />
            <text x="350" y="128" fill="#c9a227" fontSize="8" fontFamily="monospace">
              C1 10 000μF/450V
            </text>

            {/* Q1-Q4 IGBT half-bridge symbol block */}
            <path d="M380 75 H440" stroke="#8b7cf0" strokeWidth="1.5" fill="none" />
            <rect x="440" y="40" width="140" height="140" rx="4" fill="rgba(14,16,20,0.95)" stroke="#5eb8a8" strokeWidth="1.5" />
            <text x="510" y="60" textAnchor="middle" fill="#5eb8a8" fontSize="10" fontFamily="monospace" fontWeight="700">
              Q1–Q4 IGBT
            </text>
            <text x="510" y="76" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              FZ1200R45KL4
            </text>
            <text x="510" y="92" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              1200A / 4500V
            </text>
            {/* simplified bridge */}
            <line x1="470" y1="110" x2="550" y2="110" stroke="#5eb8a8" strokeWidth="1" />
            <line x1="470" y1="110" x2="470" y2="150" stroke="#5eb8a8" strokeWidth="1" />
            <line x1="550" y1="110" x2="550" y2="150" stroke="#5eb8a8" strokeWidth="1" />
            <line x1="470" y1="150" x2="550" y2="150" stroke="#5eb8a8" strokeWidth="1" />
            <text x="510" y="140" textAnchor="middle" fill="#5c6370" fontSize="8" fontFamily="monospace">
              bidirectional
            </text>
            <text x="510" y="168" textAnchor="middle" fill="#5c6370" fontSize="8" fontFamily="monospace">
              bridge
            </text>

            {/* Gate drivers U1 */}
            <rect x="440" y="200" width="140" height="50" rx="3" fill="rgba(14,16,20,0.95)" stroke="#c9a227" strokeWidth="1.25" />
            <text x="510" y="220" textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace">
              U1 2SP0115T
            </text>
            <text x="510" y="236" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              Gate drv 4kV · 100ns
            </text>
            <path d="M510 200 V180" stroke="#c9a227" strokeWidth="1" fill="none" />

            {/* CT1 Rogowski */}
            <circle cx="620" cy="75" r="14" fill="none" stroke="#5b8def" strokeWidth="1.25" />
            <text x="620" y="78" textAnchor="middle" fill="#5b8def" fontSize="8" fontFamily="monospace">
              CT1
            </text>
            <text x="640" y="100" fill="#5c6370" fontSize="7" fontFamily="monospace">
              Rogowski 200kHz 0.1%
            </text>
            <path d="M580 75 H606" stroke="#5eb8a8" strokeWidth="1.5" fill="none" />
            <path d="M634 75 H700" stroke="#5eb8a8" strokeWidth="1.5" fill="none" />

            {/* ===== RAIL B ===== */}
            <rect x="40" y="340" width="120" height="50" rx="3" fill="rgba(14,16,20,0.95)" stroke="#5b8def" strokeWidth="1.25" />
            <text x="100" y="362" textAnchor="middle" fill="#e8eaed" fontSize="10" fontFamily="monospace">
              UPS / BESS
            </text>
            <text x="100" y="378" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              Backup source
            </text>

            <path d="M160 365 H200" stroke="#5b8def" strokeWidth="1.5" fill="none" />
            <rect x="200" y="352" width="40" height="26" fill="none" stroke="#c9a227" strokeWidth="1.25" />
            <text x="220" y="370" textAnchor="middle" fill="#c9a227" fontSize="8" fontFamily="monospace">
              F2
            </text>
            <text x="220" y="390" textAnchor="middle" fill="#5c6370" fontSize="7" fontFamily="monospace">
              1500A DC
            </text>
            <path d="M240 365 H280" stroke="#5b8def" strokeWidth="1.5" fill="none" />

            <rect x="280" y="340" width="100" height="50" rx="3" fill="rgba(14,16,20,0.95)" stroke="#5b8def" strokeWidth="1.25" />
            <text x="330" y="362" textAnchor="middle" fill="#e8eaed" fontSize="10" fontFamily="monospace">
              RAIL B
            </text>
            <text x="330" y="378" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              380 V DC
            </text>

            <path d="M330 390 V410" stroke="#5b8def" strokeWidth="1" fill="none" />
            <line x1="315" y1="410" x2="345" y2="410" stroke="#c9a227" strokeWidth="2" />
            <line x1="315" y1="418" x2="345" y2="418" stroke="#c9a227" strokeWidth="2" />
            <text x="350" y="418" fill="#c9a227" fontSize="8" fontFamily="monospace">
              C2 10 000μF/450V
            </text>

            <path d="M380 365 H440" stroke="#5b8def" strokeWidth="1.5" fill="none" />
            <rect x="440" y="330" width="140" height="100" rx="4" fill="rgba(14,16,20,0.95)" stroke="#5eb8a8" strokeWidth="1.5" />
            <text x="510" y="360" textAnchor="middle" fill="#5eb8a8" fontSize="10" fontFamily="monospace" fontWeight="700">
              Q5–Q8 IGBT
            </text>
            <text x="510" y="378" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              FZ1200R45KL4
            </text>
            <text x="510" y="396" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              backup bridge
            </text>
            <text x="510" y="414" textAnchor="middle" fill="#5c6370" fontSize="8" fontFamily="monospace">
              1200A / 4500V
            </text>

            <rect x="440" y="450" width="140" height="50" rx="3" fill="rgba(14,16,20,0.95)" stroke="#c9a227" strokeWidth="1.25" />
            <text x="510" y="470" textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace">
              U2 2SP0115T
            </text>
            <text x="510" y="486" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              Gate drv 4kV · 100ns
            </text>
            <path d="M510 450 V430" stroke="#c9a227" strokeWidth="1" fill="none" />

            <circle cx="620" cy="365" r="14" fill="none" stroke="#5b8def" strokeWidth="1.25" />
            <text x="620" y="368" textAnchor="middle" fill="#5b8def" fontSize="8" fontFamily="monospace">
              CT2
            </text>
            <path d="M580 365 H606" stroke="#5eb8a8" strokeWidth="1.5" fill="none" />
            <path d="M634 365 H700" stroke="#5eb8a8" strokeWidth="1.5" fill="none" />

            {/* STS output node */}
            <path d="M700 75 H760 V200" stroke="#5eb8a8" strokeWidth="1.5" fill="none" />
            <path d="M700 365 H760 V280" stroke="#5eb8a8" strokeWidth="1.5" fill="none" />
            <rect x="740" y="200" width="120" height="100" rx="4" fill="rgba(14,16,20,0.95)" stroke="#5eb8a8" strokeWidth="1.75" />
            <text x="800" y="230" textAnchor="middle" fill="#5eb8a8" fontSize="11" fontFamily="monospace" fontWeight="700">
              STS OUT
            </text>
            <text x="800" y="250" textAnchor="middle" fill="#c9a227" fontSize="10" fontFamily="monospace">
              {"t ≤ 0.40 ms"}
            </text>
            <text x="800" y="270" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              {"UV < 320 V trip"}
            </text>
            <text x="800" y="286" textAnchor="middle" fill="#5c6370" fontSize="8" fontFamily="monospace">
              dead-time 200 ns
            </text>

            {/* PDUs */}
            <path d="M860 250 H900" stroke="#5eb8a8" strokeWidth="1.5" fill="none" />
            <rect x="900" y="160" width="140" height="55" rx="3" fill="rgba(14,16,20,0.95)" stroke="#5eb8a8" strokeWidth="1.25" />
            <text x="970" y="182" textAnchor="middle" fill="#e8eaed" fontSize="10" fontFamily="monospace">
              PDU-A 150A
            </text>
            <text x="970" y="200" textAnchor="middle" fill="#c9a227" fontSize="8" fontFamily="monospace">
              F3 Class J 150A
            </text>

            <path d="M860 250 H880 V360 H900" stroke="#5eb8a8" strokeWidth="1.5" fill="none" />
            <rect x="900" y="340" width="140" height="55" rx="3" fill="rgba(14,16,20,0.95)" stroke="#5eb8a8" strokeWidth="1.25" />
            <text x="970" y="362" textAnchor="middle" fill="#e8eaed" fontSize="10" fontFamily="monospace">
              PDU-B 150A
            </text>
            <text x="970" y="380" textAnchor="middle" fill="#c9a227" fontSize="8" fontFamily="monospace">
              F4 Class J 150A
            </text>

            {/* DSP + voltage sense */}
            <rect x="700" y="480" width="200" height="90" rx="4" fill="rgba(14,16,20,0.95)" stroke="#8b7cf0" strokeWidth="1.5" />
            <text x="800" y="505" textAnchor="middle" fill="#8b7cf0" fontSize="10" fontFamily="monospace" fontWeight="700">
              DSP TMS320F28379D
            </text>
            <text x="800" y="524" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              200 MHz · 200 ns dead-time
            </text>
            <text x="800" y="542" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              U3 LEM DVL 500 ±0.5%
            </text>
            <text x="800" y="558" textAnchor="middle" fill="#5c6370" fontSize="8" fontFamily="monospace">
              Vrail sense → UV detect
            </text>

            <path d="M800 480 V300" stroke="#8b7cf0" strokeWidth="1" fill="none" strokeDasharray="3 2" />
            <path d="M510 250 V280 H700" stroke="#c9a227" strokeWidth="1" fill="none" strokeDasharray="3 2" />
            <path d="M510 500 H650 V525 H700" stroke="#c9a227" strokeWidth="1" fill="none" strokeDasharray="3 2" />

            {/* Timing callout box */}
            <rect x="40" y="500" width="320" height="140" rx="4" fill="rgba(201,162,39,0.06)" stroke="#c9a227" strokeWidth="1.25" />
            <text x="56" y="522" fill="#c9a227" fontSize="10" fontFamily="monospace" fontWeight="700">
              TRANSFER TIMING
            </text>
            {STS_TIMING.map((t, i) => (
              <text key={t.event} x="56" y={542 + i * 16} fill="#8b929e" fontSize="8" fontFamily="monospace">
                {t.t.padEnd(14)} {t.event.slice(0, 42)}
              </text>
            ))}

            <text x="40" y="660" fill="#5c6370" fontSize="8" fontFamily="monospace">
              PSU ride-through {STS_MARGINS.psuRideThrough} · Safety margin {STS_MARGINS.safetyMargin} · Rail nom{" "}
              {STS_MARGINS.railNom} · UV {STS_MARGINS.undervolt}
            </text>
          </svg>
        </div>
      </SheetFrame>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[400px] text-left text-xs">
            <thead className="bg-surface-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
              <tr>
                <th className="px-3 py-2">Ref</th>
                <th className="px-3 py-2">Part</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Rating</th>
              </tr>
            </thead>
            <tbody>
              {STS_BOM.map((r) => (
                <tr key={r.ref} className="border-t border-border">
                  <td className="px-3 py-2 font-mono text-accent">{r.ref}</td>
                  <td className="px-3 py-2 text-fg">{r.part}</td>
                  <td className="px-3 py-2 text-fg-muted">{r.desc}</td>
                  <td className="px-3 py-2 tabular text-fg-muted">{r.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-lg border border-border bg-surface/40 p-3">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
            Transfer timing specification
          </div>
          <div className="space-y-2">
            {STS_TIMING.map((t) => (
              <div
                key={t.event}
                className={`flex items-start justify-between gap-3 text-xs ${
                  t.event.startsWith("Total") ? "border-t border-primary/30 pt-2 font-medium" : ""
                }`}
              >
                <span className="text-fg-muted">{t.event}</span>
                <span className="shrink-0 font-mono text-accent">{t.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TitleBlock dwg="SCH-006" rev="A" title="Datacenter Dual-Rail 380V DC Static Transfer Switch" />
    </div>
  );
}
