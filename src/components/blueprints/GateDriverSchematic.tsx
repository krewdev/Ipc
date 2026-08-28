import { GATE_NETS, ISOLATION } from "@/lib/ipc/blueprints";
import { SheetFrame } from "./SheetFrame";
import { TitleBlock } from "./TitleBlock";

/**
 * SCH-002 — Component-level gate driver / zero-crossing schematic
 * Traces MCU pins → optos → SCR matrix → shunt → ADC per wiring schematic.
 */
export function GateDriverSchematic() {
  return (
    <div className="blueprint-sheet space-y-3">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-accent">SCH-002 · Rev B · Sheet 1/1</div>
        <h3 className="text-sm font-semibold text-fg">Solid-State Breaker Gate Driver & Zero-Crossing Circuit</h3>
        <p className="text-xs text-fg-muted">
          IEC 60617 symbols · Line ≤480 V AC · Logic 5 V / 12 V · Isol. 4 kV RMS · Snubber R=47 Ω C=0.1 μF/630 V
        </p>
      </div>

      <SheetFrame
        dwg="SCH-002"
        rev="B"
        title="GATE DRIVER / ZERO-CROSSING — COMPONENT LEVEL"
        standard="IEC 60617"
      >
        <div className="overflow-x-auto">
          <svg
            viewBox="0 0 1100 720"
            className="h-auto w-full min-w-[900px]"
            role="img"
            aria-label="Detailed SCH-002 gate driver schematic"
          >
            <defs>
              <pattern id="g2" width="12" height="12" patternUnits="userSpaceOnUse">
                <path d="M 12 0 L 0 0 0 12" fill="none" stroke="rgba(94,184,168,0.05)" strokeWidth="1" />
              </pattern>
              <marker id="dot" markerWidth="6" markerHeight="6" refX="3" refY="3">
                <circle cx="3" cy="3" r="1.5" fill="#5eb8a8" />
              </marker>
            </defs>
            <rect width="1100" height="720" fill="url(#g2)" />

            {/* ===== ZONE LABELS ===== */}
            <text x="40" y="28" fill="#d4544a" fontSize="12" fontFamily="monospace" fontWeight="700">
              ZONE A — LINE / POWER (≤480 V AC)
            </text>
            <text x="580" y="28" fill="#5eb8a8" fontSize="12" fontFamily="monospace" fontWeight="700">
              ZONE B — LOGIC (5 V / 12 V)
            </text>
            <line x1="540" y1="40" x2="540" y2="680" stroke="#c9a227" strokeWidth="1.5" strokeDasharray="8 5" />
            <text
              x="540"
              y="400"
              fill="#c9a227"
              fontSize="10"
              fontFamily="monospace"
              transform="rotate(-90 540 400)"
              textAnchor="middle"
            >
              4 kV RMS ISOLATION BARRIER
            </text>

            {/* ===== +5V rail logic ===== */}
            <line x1="560" y1="50" x2="1060" y2="50" stroke="#d4544a" strokeWidth="1.25" />
            <text x="1060" y="46" textAnchor="end" fill="#d4544a" fontSize="10" fontFamily="monospace">
              +5V_LOGIC
            </text>
            <line x1="560" y1="680" x2="1060" y2="680" stroke="#8b929e" strokeWidth="1.25" />
            <text x="1060" y="696" textAnchor="end" fill="#8b929e" fontSize="10" fontFamily="monospace">
              GND_LOGIC
            </text>

            {/* ===== MCU block ===== */}
            <rect x="860" y="100" width="180" height="220" rx="4" fill="rgba(14,16,20,0.95)" stroke="#5eb8a8" strokeWidth="1.5" />
            <text x="950" y="122" textAnchor="middle" fill="#5eb8a8" fontSize="11" fontFamily="monospace" fontWeight="700">
              U100 STM32H7
            </text>
            <text x="950" y="138" textAnchor="middle" fill="#8b929e" fontSize="9" fontFamily="monospace">
              Cortex-M7 480–600 MHz
            </text>
            <Pin y={160} label="PIN 4  EXTI  ZC_INT" side="left" x={860} />
            <Pin y={190} label="PIN 12 PB5 TIM3_CH2 GATE_DRV" side="left" x={860} />
            <Pin y={220} label="PIN 13 LATCH_DRV" side="left" x={860} />
            <Pin y={250} label="SPI1  ADS1256 / ADC121" side="left" x={860} />
            <Pin y={280} label="I2C1  INA226 SHUNT" side="left" x={860} />
            <Pin y={310} label="ADC  THERM_ADC NTC" side="left" x={860} />

            {/* ===== GATE DRIVE path SFH615A ===== */}
            <text x="560" y="90" fill="#5eb8a8" fontSize="10" fontFamily="monospace">
              GATE DRIVE PATH
            </text>
            {/* from MCU pin 12 */}
            <path d="M860 190 H780" stroke="#5eb8a8" strokeWidth="1.25" fill="none" />
            <text x="800" y="184" fill="#5eb8a8" fontSize="8" fontFamily="monospace">
              GATE_DRV
            </text>

            {/* SFH615A optocoupler */}
            <rect x="680" y="160" width="90" height="70" rx="3" fill="rgba(14,16,20,0.95)" stroke="#5eb8a8" strokeWidth="1.25" />
            <text x="725" y="180" textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace" fontWeight="600">
              U10 SFH615A
            </text>
            <text x="725" y="196" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              Opto · 4 kV
            </text>
            <text x="725" y="212" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              LED act-low
            </text>
            {/* R1 pull-up */}
            <path d="M725 160 V90 H780 V50" stroke="#d4544a" strokeWidth="1" fill="none" />
            <Resistor x={760} y={100} label="R1 330Ω" />

            {/* Across barrier to SCR gates */}
            <path d="M680 195 H560 H500" stroke="#5eb8a8" strokeWidth="1.25" fill="none" strokeDasharray="4 2" />
            <text x="600" y="188" fill="#5eb8a8" fontSize="8" fontFamily="monospace">
              GATE+ (+15 V pulse)
            </text>

            {/* ===== LATCH path MOC3021 ===== */}
            <path d="M860 220 H780 V280 H770" stroke="#8b7cf0" strokeWidth="1.25" fill="none" />
            <rect x="680" y="250" width="90" height="70" rx="3" fill="rgba(14,16,20,0.95)" stroke="#8b7cf0" strokeWidth="1.25" />
            <text x="725" y="270" textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace" fontWeight="600">
              U11 MOC3021
            </text>
            <text x="725" y="286" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              TRIAC driver
            </text>
            <text x="725" y="302" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              4 kV isol.
            </text>
            <path d="M680 285 H560 H500 V360" stroke="#8b7cf0" strokeWidth="1.25" fill="none" strokeDasharray="4 2" />
            <text x="580" y="278" fill="#8b7cf0" fontSize="8" fontFamily="monospace">
              LATCH_DRV → 12 V SOL
            </text>

            {/* Solenoid */}
            <rect x="400" y="350" width="100" height="50" rx="3" fill="rgba(14,16,20,0.95)" stroke="#8b7cf0" strokeWidth="1.25" />
            <text x="450" y="372" textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace">
              K1 SOLENOID
            </text>
            <text x="450" y="388" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              12 V bi-stable latch
            </text>
            <text x="450" y="402" textAnchor="middle" fill="#5c6370" fontSize="8" fontFamily="monospace">
              {"t_reset < 80 ms"}
            </text>

            {/* ===== ZERO CROSS H11AA1 ===== */}
            <text x="40" y="90" fill="#c9a227" fontSize="10" fontFamily="monospace">
              ZERO-CROSS DETECT
            </text>
            {/* AC input */}
            <text x="40" y="120" fill="#d4544a" fontSize="10" fontFamily="monospace">
              L ──
            </text>
            <line x1="70" y1="116" x2="140" y2="116" stroke="#d4544a" strokeWidth="1.5" />
            <Resistor x={150} y={100} label="R10 10k" />
            <line x1="190" y1="116" x2="220" y2="116" stroke="#d4544a" strokeWidth="1.25" />

            <rect x="220" y="90" width="100" height="70" rx="3" fill="rgba(14,16,20,0.95)" stroke="#c9a227" strokeWidth="1.25" />
            <text x="270" y="112" textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace" fontWeight="600">
              U12 H11AA1
            </text>
            <text x="270" y="128" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              AC opto ZC
            </text>
            <text x="270" y="144" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              phototransistor
            </text>

            <text x="40" y="155" fill="#8b929e" fontSize="10" fontFamily="monospace">
              N ──
            </text>
            <line x1="70" y1="151" x2="220" y2="151" stroke="#8b929e" strokeWidth="1.25" />

            {/* ZC_INT to MCU */}
            <path d="M320 125 H400 V160 H560 H860" stroke="#c9a227" strokeWidth="1.25" fill="none" />
            <text x="400" y="118" fill="#c9a227" fontSize="8" fontFamily="monospace">
              ZC_INT (low pulse @ V≈0)
            </text>
            {/* R2 pull-up */}
            <path d="M400 160 V50" stroke="#d4544a" strokeWidth="1" fill="none" />
            <Resistor x={380} y={70} label="R2 10k" />

            {/* ===== SCR MATRIX detailed ===== */}
            <text x="40" y="220" fill="#d4544a" fontSize="10" fontFamily="monospace" fontWeight="600">
              THYRISTOR MATRIX U20 — 4× BT152-600R DUAL ANTI-PARALLEL
            </text>
            <rect x="40" y="230" width="340" height="100" rx="4" fill="rgba(14,16,20,0.95)" stroke="#d4544a" strokeWidth="1.5" />

            {/* SCR symbols simplified */}
            {["Q1/Q2", "Q3/Q4", "Q5/Q6", "Q7/Q8"].map((q, i) => (
              <g key={q}>
                <rect
                  x={55 + i * 80}
                  y={250}
                  width={64}
                  height={50}
                  rx="2"
                  fill="rgba(212,84,74,0.08)"
                  stroke="#d4544a"
                  strokeWidth="1"
                />
                <text x={87 + i * 80} y={272} textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace">
                  {q}
                </text>
                <text x={87 + i * 80} y={288} textAnchor="middle" fill="#8b929e" fontSize="7" fontFamily="monospace">
                  600V/12A
                </text>
              </g>
            ))}

            {/* AC Line In / Load Out */}
            <text x="40" y="360" fill="#d4544a" fontSize="10" fontFamily="monospace">
              AC LINE IN
            </text>
            <line x1="120" y1="356" x2="120" y2="330" stroke="#d4544a" strokeWidth="2" />
            <line x1="120" y1="230" x2="120" y2="210" stroke="#d4544a" strokeWidth="2" />
            <text x="130" y="205" fill="#d4544a" fontSize="9" fontFamily="monospace">
              (from bus)
            </text>

            <text x="280" y="360" fill="#5eb8a8" fontSize="10" fontFamily="monospace">
              LOAD OUT
            </text>
            <line x1="300" y1="330" x2="300" y2="370" stroke="#5eb8a8" strokeWidth="2" />

            {/* Snubber note */}
            <text x="40" y="380" fill="#5c6370" fontSize="8" fontFamily="monospace">
              SNUBBER per device: R=47Ω · C=0.1μF/630V · dv/dt 2000 V/μs · M6 Cu tabs
            </text>

            {/* ===== SHUNT + ADC ===== */}
            <text x="40" y="420" fill="#c9a227" fontSize="10" fontFamily="monospace" fontWeight="600">
              SERIES SENSE PATH
            </text>
            <line x1="300" y1="370" x2="300" y2="440" stroke="#5eb8a8" strokeWidth="2" />
            <rect x="250" y="440" width="100" height="40" rx="3" fill="rgba(14,16,20,0.95)" stroke="#c9a227" strokeWidth="1.25" />
            <text x="300" y="458" textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace">
              RSHUNT 1 mΩ
            </text>
            <text x="300" y="472" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              Kelvin 4-wire
            </text>
            <line x1="300" y1="480" x2="300" y2="520" stroke="#5eb8a8" strokeWidth="2" />
            <text x="310" y="515" fill="#5eb8a8" fontSize="9" fontFamily="monospace">
              → LOAD
            </text>

            {/* INA226 */}
            <path d="M250 460 H200 V500" stroke="#5b8def" strokeWidth="1" fill="none" />
            <path d="M350 460 H380 V500" stroke="#5b8def" strokeWidth="1" fill="none" />
            <rect x="180" y="500" width="100" height="50" rx="3" fill="rgba(14,16,20,0.95)" stroke="#5b8def" strokeWidth="1.25" />
            <text x="230" y="520" textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace">
              U30 INA226
            </text>
            <text x="230" y="536" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              I2C shunt amp
            </text>
            <path d="M280 525 H560 H860 280" stroke="#5b8def" strokeWidth="1" fill="none" strokeDasharray="3 2" />
            <text x="400" y="518" fill="#5b8def" fontSize="8" fontFamily="monospace">
              SHUNT_I2C
            </text>

            {/* ACS758 hall */}
            <rect x="40" y="500" width="110" height="50" rx="3" fill="rgba(14,16,20,0.95)" stroke="#5b8def" strokeWidth="1.25" />
            <text x="95" y="520" textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace">
              U31 ACS758
            </text>
            <text x="95" y="536" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              Hall ±200A
            </text>
            <path d="M150 525 H180" stroke="#5b8def" strokeWidth="1" fill="none" />

            {/* ADS1256 */}
            <rect x="400" y="560" width="120" height="55" rx="3" fill="rgba(14,16,20,0.95)" stroke="#5b8def" strokeWidth="1.25" />
            <text x="460" y="580" textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace">
              U32 ADS1256
            </text>
            <text x="460" y="596" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              24-bit 50 kSPS SPI
            </text>
            <path d="M95 550 V580 H400" stroke="#5b8def" strokeWidth="1" fill="none" />
            <path d="M520 585 H700 V250 H860" stroke="#5b8def" strokeWidth="1" fill="none" strokeDasharray="3 2" />
            <text x="600" y="575" fill="#5b8def" fontSize="8" fontFamily="monospace">
              I_SENSE_OUT / SPI
            </text>

            {/* ADC121S021 alternate */}
            <rect x="400" y="630" width="120" height="40" rx="3" fill="rgba(14,16,20,0.95)" stroke="#5c6370" strokeWidth="1" />
            <text x="460" y="648" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              U33 ADC121S021
            </text>
            <text x="460" y="662" textAnchor="middle" fill="#5c6370" fontSize="7" fontFamily="monospace">
              12-bit SPI branch path
            </text>

            {/* ===== LOTO ===== */}
            <rect x="720" y="400" width="160" height="100" rx="4" fill="rgba(201,162,39,0.08)" stroke="#c9a227" strokeWidth="1.5" />
            <text x="800" y="422" textAnchor="middle" fill="#c9a227" fontSize="10" fontFamily="monospace" fontWeight="700">
              S1 LOTO SHUTTER
            </text>
            <text x="800" y="440" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              IPC-LOTO-004
            </text>
            <text x="800" y="456" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              NC contact in +5V_GATE
            </text>
            <text x="800" y="472" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              Eyelet Ø12 · 6 mm shackle
            </text>
            <text x="800" y="488" textAnchor="middle" fill="#c9a227" fontSize="8" fontFamily="monospace">
              HARDWARE OVERRIDE
            </text>
            <path d="M800 400 V50" stroke="#c9a227" strokeWidth="1" fill="none" strokeDasharray="2 2" />

            {/* NTC */}
            <rect x="720" y="520" width="160" height="50" rx="3" fill="rgba(14,16,20,0.95)" stroke="#d4544a" strokeWidth="1" />
            <text x="800" y="540" textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace">
              RT1 NTC 10k @ 25°C
            </text>
            <text x="800" y="556" textAnchor="middle" fill="#8b929e" fontSize="8" fontFamily="monospace">
              β=3977K → THERM_ADC
            </text>
            <path d="M880 545 H920 V310 H860" stroke="#d4544a" strokeWidth="1" fill="none" strokeDasharray="3 2" />

            {/* Notes footer in drawing */}
            <text x="40" y="700" fill="#5c6370" fontSize="8" fontFamily="monospace">
              NOTES: 1. Gate pulse +15 V within ≤20 μs of V≈0. 2. All power pins 100 nF X7R. 3. LOTO severs +5V to U10/U11 only — thermal-magnetic path independent.
            </text>
            <text x="40" y="714" fill="#5c6370" fontSize="8" fontFamily="monospace">
              4. Isolation barrier creepage ≥8 mm. 5. Fail-safe: MCU power loss → mechanical Class 10/20 trip only.
            </text>
          </svg>
        </div>
      </SheetFrame>

      {/* Net + refdes tables */}
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="overflow-x-auto rounded-lg border border-border">
          <div className="border-b border-border bg-surface-2 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
            Net list
          </div>
          <table className="w-full min-w-[400px] text-left text-xs">
            <thead className="font-mono text-[10px] text-fg-subtle">
              <tr>
                <th className="px-3 py-1.5">Net</th>
                <th className="px-3 py-1.5">Description</th>
                <th className="px-3 py-1.5">Nodes</th>
              </tr>
            </thead>
            <tbody>
              {GATE_NETS.map((n) => (
                <tr key={n.net} className="border-t border-border">
                  <td className="px-3 py-1.5 font-mono text-accent">{n.net}</td>
                  <td className="px-3 py-1.5 text-fg">{n.desc}</td>
                  <td className="px-3 py-1.5 text-fg-muted">{n.nodes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <div className="border-b border-border bg-surface-2 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
            Reference designators
          </div>
          <table className="w-full text-left text-xs">
            <tbody>
              {[
                ["U100", "STM32H7 MCU", "Logic bay"],
                ["U10", "SFH615A optocoupler", "Gate drive isol."],
                ["U11", "MOC3021 TRIAC driver", "Solenoid isol."],
                ["U12", "H11AA1", "Zero-cross detect"],
                ["U20", "4× BT152-600R", "SCR matrix 100×60×25 mm"],
                ["U30", "INA226", "1 mΩ Kelvin shunt amp"],
                ["U31", "ACS758", "Hall CT ±200 A"],
                ["U32", "ADS1256", "24-bit 50 kSPS"],
                ["U33", "ADC121S021", "12-bit SPI branch"],
                ["R1", "330 Ω", "+5V pull-up gate LED"],
                ["R2 / R10", "10 kΩ", "ZC bias / pull-up"],
                ["RSHUNT", "1 mΩ", "Series load sense"],
                ["K1", "12 V solenoid", "Mechanical latch"],
                ["S1", "IPC-LOTO-004", "Padlock shutter"],
                ["RT1", "NTC 10k β=3977", "Contact temp"],
              ].map(([ref, part, role]) => (
                <tr key={ref} className="border-t border-border">
                  <td className="px-3 py-1.5 font-mono text-accent">{ref}</td>
                  <td className="px-3 py-1.5 text-fg">{part}</td>
                  <td className="px-3 py-1.5 text-fg-muted">{role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3 text-[11px]">
        <Note title="Logic ↔ Line" body={ISOLATION.logicLine} />
        <Note title="Measurement isol." body={ISOLATION.measurement} />
        <Note title="Decoupling" body={ISOLATION.decoupling} />
      </div>

      <TitleBlock dwg="SCH-002" rev="B" title="Gate Driver & Zero-Crossing Circuit — Component Level" />
    </div>
  );
}

function Pin({ x, y, label }: { x: number; y: number; label: string; side: "left" }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x - 8} y2={y} stroke="#5eb8a8" strokeWidth="1" />
      <circle cx={x} cy={y} r="2.5" fill="#0e1014" stroke="#5eb8a8" strokeWidth="1" />
      <text x={x + 8} y={y + 3} fill="#8b929e" fontSize="8" fontFamily="monospace">
        {label}
      </text>
    </g>
  );
}

function Resistor({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width="28" height="14" fill="none" stroke="#c9a227" strokeWidth="1" />
      <text x={x + 14} y={y - 4} textAnchor="middle" fill="#c9a227" fontSize="7" fontFamily="monospace">
        {label}
      </text>
    </g>
  );
}

function Note({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-border bg-surface/50 px-3 py-2">
      <div className="font-mono text-[10px] text-fg-subtle">{title}</div>
      <div className="mt-0.5 text-fg-muted">{body}</div>
    </div>
  );
}
