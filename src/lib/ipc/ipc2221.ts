/**
 * IPC-2221 electrical spacing methodology (reference implementation).
 * Clearance tables follow IPC-2221B Table 6-1 conductor spacing categories.
 * Creepage methodology cross-references IEC 60664-1 (industry safety practice)
 * because IPC-2221 alone does not fully treat pollution degree × CTI creepage.
 *
 * Values are engineering references for the IPC demo — not a certified calculator.
 */

/** IPC-2221B conductor spacing categories (Table 6-1) */
export const SPACING_CATEGORIES = [
  {
    id: "B1",
    name: "Internal conductors",
    where: "Inner layers only",
    coating: "N/A (embedded)",
    altitude: "Any",
    notes: "Most lenient — dielectric is laminate, not air/surface.",
  },
  {
    id: "B2",
    name: "External, uncoated",
    where: "Outer layers bare copper/solder",
    coating: "None",
    altitude: "Sea level → 3050 m",
    notes: "Default for uncoated top/bottom at normal altitude.",
  },
  {
    id: "B3",
    name: "External, uncoated (high altitude)",
    where: "Outer layers bare",
    coating: "None",
    altitude: "> 3050 m",
    notes: "Air density drops → larger clearances required.",
  },
  {
    id: "B4",
    name: "External, polymer coated",
    where: "Outer layers with permanent polymer (solder mask / conformal)",
    coating: "Permanent polymer",
    altitude: "Any",
    notes: "Coating reduces required external spacing vs bare B2/B3.",
  },
] as const;

/**
 * Interpolated IPC-2221B Table 6-1 electrical conductor spacing (mm).
 * Voltage is peak DC or AC peak between conductors.
 * Source rows are standard table breakpoints; linear interpolation between.
 */
export const CLEARANCE_TABLE_MM: {
  vPeak: number;
  B1: number;
  B2: number;
  B3: number;
  B4: number;
}[] = [
  { vPeak: 15, B1: 0.05, B2: 0.1, B3: 0.1, B4: 0.05 },
  { vPeak: 30, B1: 0.05, B2: 0.1, B3: 0.1, B4: 0.05 },
  { vPeak: 50, B1: 0.1, B2: 0.6, B3: 0.6, B4: 0.13 },
  { vPeak: 100, B1: 0.1, B2: 0.6, B3: 1.5, B4: 0.13 },
  { vPeak: 150, B1: 0.2, B2: 0.6, B3: 3.2, B4: 0.4 },
  { vPeak: 170, B1: 0.2, B2: 1.25, B3: 3.2, B4: 0.4 },
  { vPeak: 250, B1: 0.2, B2: 1.25, B3: 6.4, B4: 0.4 },
  { vPeak: 300, B1: 0.2, B2: 1.25, B3: 12.5, B4: 0.4 },
  { vPeak: 500, B1: 0.25, B2: 2.5, B3: 12.5, B4: 0.8 },
  // Extended high-voltage guidance (assembly / reinforced paths often use product std)
  { vPeak: 1000, B1: 0.8, B2: 5.0, B3: 25, B4: 1.5 },
  { vPeak: 2000, B1: 1.5, B2: 10, B3: 40, B4: 3.0 },
  { vPeak: 4000, B1: 2.5, B2: 15, B3: 50, B4: 5.0 },
];

export type SpacingCat = "B1" | "B2" | "B3" | "B4";

export function interpolateClearanceMm(vPeak: number, cat: SpacingCat): number {
  const t = CLEARANCE_TABLE_MM;
  if (vPeak <= t[0]!.vPeak) return t[0]![cat];
  if (vPeak >= t[t.length - 1]!.vPeak) return t[t.length - 1]![cat];
  for (let i = 0; i < t.length - 1; i++) {
    const a = t[i]!;
    const b = t[i + 1]!;
    if (vPeak >= a.vPeak && vPeak <= b.vPeak) {
      const u = (vPeak - a.vPeak) / (b.vPeak - a.vPeak);
      return a[cat] + u * (b[cat] - a[cat]);
    }
  }
  return t[t.length - 1]![cat];
}

/** AC rms → peak for sinusoidal (×√2). Use peak for IPC-2221 table entry. */
export function acRmsToPeak(vRms: number): number {
  return vRms * Math.SQRT2;
}

/**
 * IEC 60664-1 material groups by Comparative Tracking Index (CTI).
 * Used for creepage dimensioning (not pure IPC-2221).
 */
export const MATERIAL_GROUPS = [
  { id: "I", cti: "CTI ≥ 600", fr4Note: "High-CTI laminates / ceramics" },
  { id: "II", cti: "400 ≤ CTI < 600", fr4Note: "Some improved FR4" },
  { id: "IIIa", cti: "175 ≤ CTI < 400", fr4Note: "Typical FR4 (common default)" },
  { id: "IIIb", cti: "100 ≤ CTI < 175", fr4Note: "Lower grade organics — avoid for HV" },
] as const;

export const POLLUTION_DEGREES = [
  {
    degree: 1,
    name: "PD1 — no pollution / sealed",
    apply: "Sealed, controlled environment; no condensation",
  },
  {
    degree: 2,
    name: "PD2 — non-conductive pollution",
    apply: "Office/home equipment; only temporary condensation",
  },
  {
    degree: 3,
    name: "PD3 — conductive pollution expected",
    apply: "Industrial panels, dust, moisture possible",
  },
  {
    degree: 4,
    name: "PD4 — persistent conductivity",
    apply: "Outdoor conductive dust/rain — rarely on bare PCB",
  },
] as const;

/**
 * Simplified IEC 60664-1 creepage (mm) for reinforced insulation,
 * Material Group IIIa (typical FR4), selected RMS working voltages.
 * For education / cross-check — certify against full standard tables.
 */
export const CREEPAGE_REINFORCED_MG_IIIA_MM: Record<
  number,
  { pd1: number; pd2: number; pd3: number }
> = {
  // Vrms keys
  50: { pd1: 0.6, pd2: 1.2, pd3: 1.5 },
  100: { pd1: 1.0, pd2: 1.4, pd3: 2.0 },
  150: { pd1: 1.6, pd2: 1.6, pd3: 2.5 },
  300: { pd1: 3.2, pd2: 3.2, pd3: 5.0 },
  600: { pd1: 6.3, pd2: 6.3, pd3: 10.0 },
  // Functional/basic at higher system voltages often use larger reinforced paths
  1000: { pd1: 10, pd2: 12.5, pd3: 16 },
};

export function nearestCreepageRow(vRms: number): {
  vRms: number;
  pd1: number;
  pd2: number;
  pd3: number;
} {
  const keys = Object.keys(CREEPAGE_REINFORCED_MG_IIIA_MM)
    .map(Number)
    .sort((a, b) => a - b);
  let best = keys[0]!;
  for (const k of keys) {
    if (k <= vRms) best = k;
    if (k >= vRms) {
      // pick closer
      const lo = best;
      const hi = k;
      best = Math.abs(vRms - lo) <= Math.abs(hi - vRms) ? lo : hi;
      break;
    }
  }
  const row = CREEPAGE_REINFORCED_MG_IIIA_MM[best]!;
  return { vRms: best, ...row };
}

export interface CreepageWorkedExample {
  id: string;
  title: string;
  vRms: number;
  vPeak: number;
  assumptions: string[];
  ipc2221: { cat: SpacingCat; clearanceMm: number; note: string };
  iec60664: { material: string; pollution: string; creepageMm: number; note: string };
  ipcDesign: { adoptedMm: number; rationale: string };
}

/** Worked examples for xAI IPC-PCB-001 */
export const WORKED_EXAMPLES: CreepageWorkedExample[] = [
  {
    id: "EX-1",
    title: "Logic SELV nets (+5 V ↔ GND)",
    vRms: 5,
    vPeak: 5,
    assumptions: ["Functional insulation only", "Same potential domain", "Coated outer (B4)"],
    ipc2221: {
      cat: "B4",
      clearanceMm: interpolateClearanceMm(15, "B4"),
      note: "Table floor ~0.05 mm — fab min (0.1 mm) governs",
    },
    iec60664: {
      material: "IIIa",
      pollution: "PD2",
      creepageMm: 0.2,
      note: "Functional; fab design rules dominate",
    },
    ipcDesign: {
      adoptedMm: 0.2,
      rationale: "PCB-001 SELV internal rule 0.2 mm clearance/creepage",
    },
  },
  {
    id: "EX-2",
    title: "Line 480 V AC peak across barrier (functional path)",
    vRms: 480,
    vPeak: acRmsToPeak(480),
    assumptions: [
      "Vpeak = 480 × √2 ≈ 679 V",
      "Outer conductors, permanent polymer (B4)",
      "Optocoupler provides primary isolation component",
    ],
    ipc2221: {
      cat: "B4",
      clearanceMm: interpolateClearanceMm(acRmsToPeak(480), "B4"),
      note: "IPC-2221 conductor spacing ~0.8–1.5 mm class at this peak (coated)",
    },
    iec60664: {
      material: "IIIa FR4",
      pollution: "PD2 industrial panel interior → treat as PD2/PD3",
      creepageMm: 6.3,
      note: "Reinforced-looking path: use ≥600 Vrms reinforced row (~6.3 mm PD2)",
    },
    ipcDesign: {
      adoptedMm: 8.0,
      rationale: "≥8 mm creepage (prefer 10 mm) — exceeds IEC row + process margin",
    },
  },
  {
    id: "EX-3",
    title: "Hi-pot 4 kV RMS isolation channel test",
    vRms: 4000,
    vPeak: acRmsToPeak(4000),
    assumptions: [
      "Production dielectric withstand (not continuous working voltage)",
      "Path through opto package + PCB barrier",
      "B2 bare external worst-case during fixture test",
    ],
    ipc2221: {
      cat: "B2",
      clearanceMm: interpolateClearanceMm(acRmsToPeak(4000), "B2"),
      note: "High peak → large air clearance if uncoated bare pads exposed",
    },
    iec60664: {
      material: "IIIa",
      pollution: "PD1 during sealed test preferred",
      creepageMm: 8.0,
      note: "Working design still sized for 480 V continuous; 4 kV is withstand",
    },
    ipcDesign: {
      adoptedMm: 8.0,
      rationale: "Board barrier 8 mm + component isolation rating 4 kV RMS",
    },
  },
  {
    id: "EX-4",
    title: "Uncoated external at altitude (B3) — mesh radio board edge",
    vRms: 48,
    vPeak: acRmsToPeak(48),
    assumptions: ["48 V bus near RF keepout", "Uncoated pads", "Altitude > 3050 m option"],
    ipc2221: {
      cat: "B3",
      clearanceMm: interpolateClearanceMm(acRmsToPeak(48), "B3"),
      note: "B3 larger than B2 at same voltage",
    },
    iec60664: {
      material: "IIIa",
      pollution: "PD2",
      creepageMm: 1.2,
      note: "Low voltage functional",
    },
    ipcDesign: {
      adoptedMm: 0.5,
      rationale: "SELV-adjacent; KZ-6 RF keepout 5 mm is EMI not creepage",
    },
  },
];

export const METHOD_STEPS = [
  {
    step: 1,
    title: "Define voltages",
    body: "Identify continuous working voltage (RMS and peak), temporary overvoltage, and production hi-pot. IPC-2221 tables use peak; IEC creepage tables use RMS working voltage.",
  },
  {
    step: 2,
    title: "Separate clearance vs creepage",
    body: "Clearance = shortest distance through air (or internal dielectric for B1). Creepage = shortest distance along an insulating surface (soldermask, FR4 surface, slot edge).",
  },
  {
    step: 3,
    title: "Select IPC-2221 category B1–B4",
    body: "Inner layer → B1. Outer bare, ≤3050 m → B2. Outer bare, >3050 m → B3. Outer with permanent polymer coating → B4. Apply Table 6-1 (or interpolate) at Vpeak.",
  },
  {
    step: 4,
    title: "Apply IEC 60664-1 for safety creepage",
    body: "Choose pollution degree (PD1–PD4), material group from CTI, and insulation type (functional / basic / supplementary / reinforced). Look up creepage; reinforced ≈ 2× basic for many rows.",
  },
  {
    step: 5,
    title: "Take the stricter result + process margin",
    body: "Adopt max(IPC clearance, IEC creepage, component datasheet, product standard UL/IEC). Add manufacturing tolerance (etch, registration). Document in DRC.",
  },
  {
    step: 6,
    title: "Geometry tricks that count",
    body: "Milled slots increase creepage path length. Ribs/barriers help. Conformal coat may allow B4 for clearance but does not always reduce creepage for safety standards — check product standard.",
  },
] as const;

export const CAVEATS = [
  "IPC-2221 is a design standard for board geometry; product safety certification usually requires IEC 60664-1 / UL 62368-1 / IEC 60947 spacing as applicable.",
  "Soldermask alone is not always accepted as reducing creepage for reinforced insulation — many agencies require physical distance or recognized components (optos, transformers).",
  "Reinforced insulation between LINE and SELV for a 480 V panel typically cannot rely on bare FR4 2 mm spacing; use certified isolators + barrier.",
  "Altitude, humidity, and pollution degree can dominate over raw voltage at high elevation or dirty industrial installs.",
  "This demo calculator interpolates published table breakpoints and simplified IEC rows — use official IPC/IEC tables for release.",
] as const;
