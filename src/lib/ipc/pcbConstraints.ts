/**
 * IPC-PCB-001 layout constraints derived from controlled docs:
 * component_renders.md, engineering_drawings.md, white paper, technical_manual.md
 */

export const PCB_IDENTITY = {
  partNo: "IPC-PCB-001",
  title: "Edge AI Logic Board — Layout Constraints",
  rev: "A",
  size: { L: 120, W: 80, T: 1.6, unit: "mm" as const },
  stackup: "4-layer HDI FR4",
  finish: "ENIG (matte black soldermask)",
  mcu: "STM32H7 / Cortex-M7 LQFP-144 · 480–600 MHz",
  tpu: "Coral Edge TPU · INT8 · 4 TOPS · ≤2 W",
  secure: "ATECC608A hardware root of trust",
  adc: "ADS1256 24-bit · 50 kSPS SPI (primary sense path)",
  operating: "-40 °C to +85 °C",
} as const;

/** Suggested 4-layer stack (IPC Class 2/3 mixed HV isolation board) */
export const STACKUP = [
  { layer: "L1", name: "TOP", role: "Components · critical analog · opto LED side", copper: "1 oz", notes: "Sense nets + conformal coat (red)" },
  { layer: "L2", name: "GND_LOGIC", role: "Solid logic ground plane", copper: "1 oz", notes: "No splits under ADC/TPU; stitch vias 2.5 mm pitch" },
  { layer: "L3", name: "PWR / SIG", role: "+5V · +12V · SPI/I2C · TPU core rails", copper: "1 oz", notes: "Pour +5V under digital; keep 12V island for solenoid driver" },
  { layer: "L4", name: "BOT", role: "Isolation secondary · gate returns · mounting", copper: "1 oz", notes: "Line-referred nets only south of barrier" },
] as const;

export interface KeepoutZone {
  id: string;
  name: string;
  region: string;
  rule: string;
  basis: string;
}

export const KEEPOUTS: KeepoutZone[] = [
  {
    id: "KZ-1",
    name: "HV isolation barrier",
    region: "Full board width strip, min 8 mm creepage (preferred 10 mm)",
    rule: "No copper, vias, or silkscreen bridges across barrier. Slot or mill optional if CTI < 175.",
    basis: "4 kV RMS isol. (SFH615A/MOC3021/ACS758) · DWG note creepage ≥8 mm",
  },
  {
    id: "KZ-2",
    name: "ADC analog island",
    region: "ADS1256 + anti-alias RC + Vref within 15 mm of ADC",
    rule: "Star-ground to single AGND via under U32. No digital return currents under package.",
    basis: "24-bit @ 50 kSPS · simultaneous V/I · 0.2% metering class budget",
  },
  {
    id: "KZ-3",
    name: "Edge TPU thermal",
    region: "TPU footprint + 8 mm copper pour · thermal vias to L2",
    rule: "≥9 vias under package (0.3 mm drill). Keep switching regulators ≥12 mm away.",
    basis: "4 TOPS @ ~2 W continuous · passive panel cooling only",
  },
  {
    id: "KZ-4",
    name: "Secure element",
    region: "ATECC608A adjacent to MCU, away from RF/antenna pads",
    rule: "No test points on private key nets. Cover with epoxy or conformal after program.",
    basis: "mTLS / ECDSA root of trust · anti-tamper",
  },
  {
    id: "KZ-5",
    name: "LOTO +5V gate rail",
    region: "Series path from +5V_GATE through S1 shutter connector",
    rule: "Must be interruptible only by hardware. No alternate power path to opto LED anodes.",
    basis: "IPC-LOTO-004 severs +5V gate supply · NFPA 70E",
  },
  {
    id: "KZ-6",
    name: "RF / mesh keepout",
    region: "BT LE antenna / mmWave connector edge keepout 5 mm metal-free",
    rule: "No ground pour under chip antenna. 50 Ω microstrip if external U.FL used.",
    basis: "BLE 5.3 + mesh telemetry",
  },
];

export interface ClearanceRule {
  netA: string;
  netB: string;
  clearanceMm: number;
  creepageMm: number;
  notes: string;
}

/** Working clearances for ≤480 V AC line side vs SELV logic (reinforced isolation path uses opto) */
export const CLEARANCES: ClearanceRule[] = [
  { netA: "LINE_L/N (≤480 V)", netB: "GND_LOGIC / +5V", clearanceMm: 4.0, creepageMm: 8.0, notes: "Reinforced barrier zone; opto provides functional isol." },
  { netA: "GATE_LINE (SCR gate)", netB: "GND_LOGIC", clearanceMm: 4.0, creepageMm: 8.0, notes: "Across SFH615A package" },
  { netA: "LATCH_12V_LINE", netB: "GND_LOGIC", clearanceMm: 4.0, creepageMm: 8.0, notes: "Across MOC3021" },
  { netA: "I_SENSE (hall out)", netB: "SPI digital", clearanceMm: 0.5, creepageMm: 0.5, notes: "Same SELV domain after isol. CT" },
  { netA: "+5V", netB: "GND_LOGIC", clearanceMm: 0.2, creepageMm: 0.2, notes: "Internal SELV; 100 nF X7R each power pin" },
  { netA: "SHUNT Kelvin pair", netB: "Power pour", clearanceMm: 0.3, creepageMm: 0.3, notes: "Route as tight differential to INA226" },
];

export interface PlacementRule {
  ref: string;
  part: string;
  placement: string;
  orientation: string;
  priority: "P0" | "P1" | "P2";
}

export const PLACEMENT: PlacementRule[] = [
  { ref: "U100", part: "STM32H7 LQFP-144", placement: "Logic zone center-north", orientation: "Pin 1 marker toward board edge", priority: "P0" },
  { ref: "U_TPU", part: "Edge TPU BGA/module", placement: "Logic zone center · thermal pour", orientation: "Per module pinout", priority: "P0" },
  { ref: "U32", part: "ADS1256", placement: "Analog island west of barrier, near CT connector", orientation: "SPI away from crystal", priority: "P0" },
  { ref: "U10", part: "SFH615A", placement: "Straddling isolation barrier", orientation: "LED (logic) north · transistor (line) south", priority: "P0" },
  { ref: "U11", part: "MOC3021", placement: "Straddling isolation barrier · next to U10", orientation: "Same as U10", priority: "P0" },
  { ref: "U12", part: "H11AA1", placement: "Line side · near L/N input header", orientation: "AC pins to R10 10k bias", priority: "P0" },
  { ref: "U30", part: "INA226", placement: "Near shunt Kelvin connector", orientation: "Sense +/− short stubs", priority: "P1" },
  { ref: "U31", part: "ACS758 (or header)", placement: "Edge near bus clamp interface", orientation: "Hall aperture toward current path", priority: "P1" },
  { ref: "U_SEC", part: "ATECC608A", placement: "Adjacent MCU · no probe access", orientation: "I2C shared with config", priority: "P1" },
  { ref: "Y1", part: "MCU crystal", placement: "<8 mm from OSC pins", orientation: "Guard ring · no SPI under", priority: "P1" },
  { ref: "J_LOTO", part: "LOTO shutter connector", placement: "Board edge · accessible with cover open", orientation: "Keying prevents reverse", priority: "P0" },
  { ref: "C_decap", part: "100 nF X7R", placement: "Every power pin · <3 mm", orientation: "Via to plane under pad", priority: "P0" },
];

export interface RoutingConstraint {
  net: string;
  topology: string;
  maxLenMm: string;
  impedance: string;
  notes: string;
}

export const ROUTING: RoutingConstraint[] = [
  { net: "SPI1 (ADC)", topology: "Point-to-point MCU↔ADS1256", maxLenMm: "≤40", impedance: "~50 Ω SE", notes: "SCK guard; CS short; avoid parallel to XTAL" },
  { net: "I2C1 (INA226/ATECC)", topology: "Multi-drop", maxLenMm: "≤60", impedance: "RC pull-ups 2.2–4.7k", notes: "Keep off analog island interior" },
  { net: "ZC_INT", topology: "H11AA1 → MCU EXTI PIN 4", maxLenMm: "≤50", impedance: "SE + R2 10k pull-up", notes: "Schmitt input; filter ≤1 nF optional" },
  { net: "GATE_DRV", topology: "MCU PIN 12 → SFH615A LED", maxLenMm: "≤30", impedance: "SE", notes: "Series R1 330 Ω; active-low LED" },
  { net: "LATCH_DRV", topology: "MCU PIN 13 → MOC3021", maxLenMm: "≤30", impedance: "SE", notes: "12 V solenoid secondary only on line side" },
  { net: "SHUNT±", topology: "Kelvin 4-wire to INA226", maxLenMm: "≤25", impedance: "Tight pair", notes: "No via if possible; equal length" },
  { net: "TPU DDR/bus", topology: "Per module", maxLenMm: "Per Coral guide", impedance: "Diff 100 Ω where required", notes: "Length match within group" },
  { net: "LINE L/N", topology: "Header → H11AA1 / SCR interface", maxLenMm: "Short", impedance: "HV spacing", notes: "Stay south of barrier only" },
];

export const FAB_NOTES = [
  "Board outline 120.0 × 80.0 mm · thickness 1.6 mm ±10% · 4-layer HDI · min trace/space 0.1 mm (inner).",
  "Surface finish ENIG · matte black soldermask · white silkscreen · serialized QR on BOT.",
  "Isolation barrier: continuous keepout ≥8 mm creepage (prefer 10 mm). No copper bridges. Optional milled slot 1.5 mm.",
  "100 nF X7R 0402/0603 on every IC power pin to local plane via within 3 mm (SCH-002).",
  "Selective red conformal coat on sensing/analog nets after ICT (component_renders).",
  "ATECC608A provisioned in secure facility; lock config zone before conformal coat.",
  "ICT fixtures: no probes on private key nets; boundary scan on MCU where available.",
  "Hi-pot test: logic↔line 4 kV RMS 1 s per isolation channel (opto + CT paths).",
  "Operating envelope −40 °C to +85 °C; derate TPU continuous duty inside sealed NEMA panel.",
  "Panel install: logic PCB in LV isolation bay above SCR module; airflow 6 in above/below chassis (tech manual).",
] as const;

export const DRC_CHECKLIST = [
  { id: "DRC-01", check: "Barrier creepage ≥8 mm all layers", severity: "Critical" },
  { id: "DRC-02", check: "No via in isolation keepout", severity: "Critical" },
  { id: "DRC-03", check: "LOTO is sole path for +5V_GATE to opto LEDs", severity: "Critical" },
  { id: "DRC-04", check: "Decoupling ≤3 mm every power pin", severity: "Major" },
  { id: "DRC-05", check: "ADC island single-point AGND", severity: "Major" },
  { id: "DRC-06", check: "TPU thermal via array present", severity: "Major" },
  { id: "DRC-07", check: "SPI length ≤40 mm · no XTAL cross", severity: "Major" },
  { id: "DRC-08", check: "Kelvin shunt equal-length pair", severity: "Major" },
  { id: "DRC-09", check: "Crystal guard · no digital under Y1", severity: "Minor" },
  { id: "DRC-10", check: "Antenna metal keepout 5 mm", severity: "Minor" },
  { id: "DRC-11", check: "Silkscreen refdes match BOM U10–U33", severity: "Minor" },
  { id: "DRC-12", check: "Hi-pot coupon / test pads outside barrier", severity: "Major" },
] as const;
