import { BREAKER_BOM, MODULE_DIMENSIONS } from "@/lib/ipc/blueprints";
import { SheetFrame } from "./SheetFrame";
import { TitleBlock } from "./TitleBlock";

const D = MODULE_DIMENSIONS;

const STACK: { y: number; h: number; color: string; label: string; dim: string }[] = [
  { y: 55, h: 22, color: "#5eb8a8", label: "1 Heatsink 6063-T5 18-fin", dim: "~12" },
  { y: 80, h: 14, color: "#5b8def", label: "2 PCB 1.6 mm FR4 HDI", dim: "1.6" },
  { y: 98, h: 18, color: "#c9a227", label: "3 Opto isol. bay + headers", dim: "~6" },
  { y: 120, h: 50, color: "#d4544a", label: "4 SCR matrix 25 mm H", dim: "25.0" },
  { y: 174, h: 20, color: "#5b8def", label: "7 ACS758 hall clamp", dim: "—" },
  { y: 198, h: 16, color: "#c9a227", label: "10 1 mΩ shunt Kelvin", dim: "—" },
  { y: 218, h: 16, color: "#c9a227", label: "11 Cu bus 8 mm T", dim: "8.0" },
  { y: 238, h: 20, color: "#8b929e", label: "Base / terminal block", dim: "—" },
];

/** DWG-001 — multi-view fabrication drawing with balloons, section, stack heights */
export function BreakerBom({ imageSrc }: { imageSrc?: string }) {
  return (
    <div className="blueprint-sheet space-y-3">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-accent">DWG-001 · Rev A · Sheet 1/1</div>
        <h3 className="text-sm font-semibold text-fg">Smart Breaker Module — Assembly, Section & BOM</h3>
        <p className="text-xs text-fg-muted">
          UL 1699 / IEC 60947-2 · Third-angle · Units mm · Tol ±0.2 unless noted · Critical torques called out
        </p>
      </div>

      <SheetFrame dwg="DWG-001" rev="A" title="SMART BREAKER MODULE — ORTHO + SECTION A-A" standard="UL 1699">
        <div className="overflow-x-auto">
          <svg
            viewBox="0 0 1100 780"
            className="h-auto w-full min-w-[900px]"
            role="img"
            aria-label="DWG-001 detailed mechanical drawing"
          >
            <defs>
              <pattern id="mgrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(94,184,168,0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1100" height="780" fill="url(#mgrid)" />

            <text x="40" y="30" fill="#5eb8a8" fontSize="12" fontFamily="monospace" fontWeight="700">
              FRONT ELEVATION
            </text>
            <rect x="60" y="50" width={264} height={197} fill="none" stroke="#5eb8a8" strokeWidth="1.75" />
            <DimH x1={60} x2={324} y={265} label="132.0" />
            <DimV x={48} y1={50} y2={247} label="98.5" />

            <rect x="68" y="58" width="248" height="28" fill="rgba(94,184,168,0.08)" stroke="#5eb8a8" strokeWidth="1" />
            <text x="80" y="76" fill="#8b929e" fontSize="9" fontFamily="monospace">
              1 HEATSINK COVER 6063-T5 · 18 FINS
            </text>
            <Balloon x={300} y={72} n="1" />

            <rect x="76" y="96" width={240} height={48} fill="rgba(91,141,239,0.12)" stroke="#5b8def" strokeWidth="1.25" />
            <text x="88" y="116" fill="#5b8def" fontSize="9" fontFamily="monospace">
              2 IPC-PCB-001 120×80×1.6
            </text>
            <text x="88" y="132" fill="#8b929e" fontSize="8" fontFamily="monospace">
              Cortex-M7 · Edge TPU 4 TOPS · ATECC608A
            </text>
            <Balloon x={300} y={120} n="2" />
            <DimH x1={76} x2={316} y={152} label="120.0" color="#5b8def" />

            <rect x="90" y="160" width="100" height="18" fill="rgba(201,162,39,0.1)" stroke="#c9a227" strokeWidth="1" />
            <text x="95" y="172" fill="#c9a227" fontSize="8" fontFamily="monospace">
              3 SFH615A+MOC3021
            </text>
            <Balloon x={200} y={169} n="3" />

            <rect x="80" y="186" width={200} height={36} fill="rgba(212,84,74,0.12)" stroke="#d4544a" strokeWidth="1.25" />
            <text x="90" y="202" fill="#d4544a" fontSize="9" fontFamily="monospace">
              4 IPC-SCR-002 100×60×25
            </text>
            <text x="90" y="216" fill="#8b929e" fontSize="8" fontFamily="monospace">
              4× BT152-600R · snubber 47Ω/0.1μF
            </text>
            <Balloon x={290} y={204} n="4" />

            <rect x="70" y="228" width={244} height={14} fill="rgba(201,162,39,0.2)" stroke="#c9a227" strokeWidth="1.25" />
            <text x="80" y="238" fill="#c9a227" fontSize="8" fontFamily="monospace">
              11 BUS Cu 300×40×8 · 250 in-lbs
            </text>
            <Balloon x={320} y={235} n="11" />

            <text x="400" y="30" fill="#5eb8a8" fontSize="12" fontFamily="monospace" fontWeight="700">
              TOP PLAN
            </text>
            <rect x="400" y="50" width={264} height={200} fill="none" stroke="#5eb8a8" strokeWidth="1.75" />
            <DimH x1={400} x2={664} y={268} label="132.0" />
            <DimV x={678} y1={50} y2={250} label="100.0" />

            <rect x="420" y="70" width={220} height={140} fill="rgba(91,141,239,0.1)" stroke="#5b8def" strokeWidth="1.25" />
            <text x="430" y="100" fill="#5b8def" fontSize="9" fontFamily="monospace">
              PCB 120 × 80
            </text>
            <DimH x1={420} x2={640} y={220} label="120.0" color="#5b8def" />
            <DimV x={650} y1={70} y2={210} label="80.0" color="#5b8def" />

            <rect
              x="430"
              y="160"
              width={180}
              height={48}
              fill="none"
              stroke="#d4544a"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <text x="440" y="188" fill="#d4544a" fontSize="8" fontFamily="monospace">
              SCR 100 × 60 (hidden)
            </text>

            {[
              [410, 60],
              [654, 60],
              [410, 240],
              [654, 240],
            ].map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r="4" fill="none" stroke="#8b929e" strokeWidth="1" />
                <circle cx={cx} cy={cy} r="1.5" fill="#8b929e" />
              </g>
            ))}
            <text x="400" y="290" fill="#5c6370" fontSize="8" fontFamily="monospace">
              4.5 THRU · 4× M4 CLEARANCE
            </text>

            <text x="720" y="30" fill="#5eb8a8" fontSize="12" fontFamily="monospace" fontWeight="700">
              SECTION A–A (STACK)
            </text>
            <line x1="740" y1="50" x2="740" y2="300" stroke="#8b929e" strokeWidth="1" />
            <line x1="1000" y1="50" x2="1000" y2="300" stroke="#8b929e" strokeWidth="1" />

            {STACK.map((s) => (
              <StackLayer key={s.label} {...s} />
            ))}

            <DimV x={1020} y1={55} y2={258} label="98.5" />
            <text x="740" y="290" fill="#5c6370" fontSize="8" fontFamily="monospace">
              CUTTING PLANE A–A · SEE FRONT
            </text>

            <text x="70" y="48" fill="#c9a227" fontSize="9" fontFamily="monospace">
              A
            </text>
            <text x="310" y="48" fill="#c9a227" fontSize="9" fontFamily="monospace">
              A
            </text>
            <line x1="80" y1="50" x2="300" y2="50" stroke="#c9a227" strokeWidth="1" strokeDasharray="3 2" />

            <text x="40" y="330" fill="#5eb8a8" fontSize="12" fontFamily="monospace" fontWeight="700">
              EXPLODED ASSEMBLY — ITEM BALLOONS
            </text>
            <rect x="40" y="345" width="1020" height="200" fill="none" stroke="rgba(94,184,168,0.25)" strokeWidth="1" />

            {[
              { n: 1, x: 80, y: 360, label: "Heatsink" },
              { n: 2, x: 200, y: 375, label: "PCB 120×80" },
              { n: 3, x: 320, y: 390, label: "Opto layer" },
              { n: 4, x: 440, y: 405, label: "SCR module" },
              { n: 5, x: 560, y: 390, label: "H11AA1 ZC" },
              { n: 6, x: 660, y: 375, label: "ADC board" },
              { n: 7, x: 760, y: 405, label: "ACS758 CT" },
              { n: 8, x: 860, y: 390, label: "NTC array" },
              { n: 9, x: 960, y: 360, label: "LOTO" },
              { n: 10, x: 500, y: 470, label: "1mΩ shunt" },
              { n: 11, x: 700, y: 485, label: "Cu bus bar" },
            ].map((p) => (
              <g key={p.n}>
                <rect
                  x={p.x}
                  y={p.y}
                  width={70}
                  height={36}
                  rx="2"
                  fill="rgba(14,16,20,0.9)"
                  stroke="#5eb8a8"
                  strokeWidth="1"
                />
                <circle cx={p.x + 12} cy={p.y + 12} r="9" fill="#0e1014" stroke="#5eb8a8" strokeWidth="1.25" />
                <text x={p.x + 12} y={p.y + 16} textAnchor="middle" fill="#5eb8a8" fontSize="9" fontFamily="monospace">
                  {p.n}
                </text>
                <text x={p.x + 26} y={p.y + 24} fill="#8b929e" fontSize="8" fontFamily="monospace">
                  {p.label}
                </text>
              </g>
            ))}

            <text x="40" y="580" fill="#5eb8a8" fontSize="11" fontFamily="monospace" fontWeight="700">
              FABRICATION NOTES
            </text>
            {[
              "1. ALL DIMENSIONS MILLIMETRES. THIRD ANGLE PROJECTION. DO NOT SCALE DRAWING.",
              "2. MAIN LUG TORQUE 250 in-lbs (28.2 N·m). NEUTRAL 50 in-lbs (5.6 N·m). GROUND 35 in-lbs (4.0 N·m).",
              "3. SCR MODULE: 600 V BLOCK / 1200 V SURGE / 12 A RMS PER PAIR / dv/dt 2000 V/μs / M6 BUS TABS.",
              "4. PCB: MATTE BLACK FR4 · ENIG · 4-LAYER HDI · CONFORMAL COAT ON SENSE NETS (RED).",
              "5. LOTO (9): Ø12 mm EYELET · 6 mm SHACKLE · SEVERS +5V GATE SUPPLY · NFPA 70E / OSHA 1910.147.",
              "6. CREEPAGE ACROSS ISOLATION BARRIER ≥8 mm. CT HALL CORE 4 kV RMS MEASUREMENT ISOLATION.",
              "7. BUS MATERIAL C11000 ETP Cu 99.9% · TIN PLATE · CERAMIC BUSHINGS · M8 STANDOFFS · 600 V AC/DC UL.",
              "8. THERMAL: PASSIVE 18-FIN HEATSINK · GRAPHITE PCM TIM UNDER SCR BASE · T_contact ALARM 75°C.",
              "9. FAIL-SAFE: BIMETALLIC / MAGNETIC TRIP PATH INDEPENDENT OF MCU POWER.",
              "10. SOLIDWORKS .SLDPRT UNDER SEPARATE COVER. ENVELOPE DIMS ON THIS SHEET ARE FAB-CRITICAL.",
            ].map((line, i) => (
              <text key={line} x="40" y={600 + i * 16} fill="#8b929e" fontSize="9" fontFamily="monospace">
                {line}
              </text>
            ))}
          </svg>
        </div>
      </SheetFrame>

      {imageSrc && (
        <div className="overflow-hidden rounded-lg border border-primary/25 bg-[#071018]">
          <img src={imageSrc} alt="DWG-001 CAD orthographic" className="max-h-[300px] w-full object-contain" />
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DimCard title="Envelope" lines={[`L ${D.envelope.L} mm`, `W ${D.envelope.W} mm`, `H ${D.envelope.H} mm`]} />
        <DimCard title="PCB" lines={[D.pcb.partNo, `${D.pcb.L}×${D.pcb.W}×${D.pcb.T} mm`, "4-layer HDI"]} />
        <DimCard title="SCR" lines={[D.scr.partNo, `${D.scr.L}×${D.scr.W}×${D.scr.H} mm`, `${D.scr.Irms}A · ${D.scr.Vblock}V`]} />
        <DimCard title="Bus" lines={[D.bus.partNo, `${D.bus.L}×${D.bus.W}×${D.bus.T} mm`, D.bus.mainTorque]} />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[700px] text-left text-xs">
          <thead className="bg-surface-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
            <tr>
              <th className="px-3 py-2">Item</th>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">Specification</th>
              <th className="px-3 py-2">Dimensions / notes</th>
            </tr>
          </thead>
          <tbody>
            {BREAKER_BOM.map((row) => (
              <tr key={row.item} className="border-t border-border align-top">
                <td className="px-3 py-2 font-mono text-accent">{row.item}</td>
                <td className="px-3 py-2 text-fg">{row.desc}</td>
                <td className="px-3 py-2 text-fg-muted">{row.spec}</td>
                <td className="px-3 py-2 font-mono text-[11px] text-fg">{row.dim}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TitleBlock dwg="DWG-001" rev="A" title="Smart Breaker Module — Assembly, Section A-A & BOM" scale="NTS" />
    </div>
  );
}

function Balloon({ x, y, n }: { x: number; y: number; n: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="10" fill="#0e1014" stroke="#5eb8a8" strokeWidth="1.25" />
      <text x={x} y={y + 3.5} textAnchor="middle" fill="#5eb8a8" fontSize="10" fontFamily="monospace">
        {n}
      </text>
    </g>
  );
}

function DimH({
  x1,
  x2,
  y,
  label,
  color = "#8b929e",
}: {
  x1: number;
  x2: number;
  y: number;
  label: string;
  color?: string;
}) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth="1" />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} stroke={color} strokeWidth="1" />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} stroke={color} strokeWidth="1" />
      <text x={(x1 + x2) / 2} y={y + 12} textAnchor="middle" fill="#e8eaed" fontSize="9" fontFamily="monospace">
        {label}
      </text>
    </g>
  );
}

function DimV({
  x,
  y1,
  y2,
  label,
  color = "#8b929e",
}: {
  x: number;
  y1: number;
  y2: number;
  label: string;
  color?: string;
}) {
  const mid = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth="1" />
      <line x1={x - 4} y1={y1} x2={x + 4} y2={y1} stroke={color} strokeWidth="1" />
      <line x1={x - 4} y1={y2} x2={x + 4} y2={y2} stroke={color} strokeWidth="1" />
      <text
        x={x + 10}
        y={mid}
        fill="#e8eaed"
        fontSize="9"
        fontFamily="monospace"
        transform={`rotate(-90 ${x + 10} ${mid})`}
      >
        {label}
      </text>
    </g>
  );
}

function StackLayer({
  y,
  h,
  color,
  label,
  dim,
}: {
  y: number;
  h: number;
  color: string;
  label: string;
  dim: string;
}) {
  return (
    <g>
      <rect x={750} y={y} width={240} height={h} fill={color} fillOpacity={0.15} stroke={color} strokeWidth="1" />
      <text x={760} y={y + h / 2 + 3} fill="#e8eaed" fontSize="9" fontFamily="monospace">
        {label}
      </text>
      <text x={980} y={y + h / 2 + 3} textAnchor="end" fill={color} fontSize="9" fontFamily="monospace">
        {dim}
      </text>
    </g>
  );
}

function DimCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-surface/60 p-3">
      <div className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{title}</div>
      {lines.map((l) => (
        <div key={l} className="mt-1 font-mono text-xs text-fg">
          {l}
        </div>
      ))}
    </div>
  );
}
