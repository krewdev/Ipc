export type BlueprintKind =
  | "Mechanical"
  | "Electrical Schematic"
  | "One-Line"
  | "System Block"
  | "Signal Flow"
  | "Power Electronics"
  | "PCB Layout";

export interface DrawingRecord {
  id: string;
  rev: string;
  title: string;
  kind: BlueprintKind;
  standard: string;
  sheet: string;
  drawnBy: string;
  date: string;
  image?: string;
  interactiveId?:
    | "oneline"
    | "gate"
    | "nilm"
    | "sts"
    | "breaker-bom"
    | "network"
    | "pcb";
}

/** Master register — engineering_drawings.md Rev A 2026-06-22 + PCB-001 */
export const DRAWING_REGISTER: DrawingRecord[] = [
  {
    id: "DWG-001",
    rev: "A",
    title: "Smart Breaker Module — Internal Assembly Exploded View",
    kind: "Mechanical",
    standard: "UL 1699 / IEC 60947-2",
    sheet: "1 of 1",
    drawnBy: "J. Young",
    date: "2026-06-22",
    image: "/blueprints/dwg-001-breaker.jpg",
    interactiveId: "breaker-bom",
  },
  {
    id: "PCB-001",
    rev: "A",
    title: "Edge AI Logic Board — PCB Layout Constraints",
    kind: "PCB Layout",
    standard: "IPC-2221 · Reinforced isolation",
    sheet: "1 of 1",
    drawnBy: "J. Young",
    date: "2026-06-22",
    interactiveId: "pcb",
  },
  {
    id: "SCH-002",
    rev: "B",
    title: "Solid-State Breaker Gate Driver & Zero-Crossing Circuit",
    kind: "Electrical Schematic",
    standard: "IEC 60617",
    sheet: "1 of 1",
    drawnBy: "J. Young",
    date: "2026-06-22",
    interactiveId: "gate",
  },
  {
    id: "SYS-003",
    rev: "A",
    title: "Planetary Intelligence Grid — Network Topology",
    kind: "System Block",
    standard: "IEEE 802.1Q / 3GPP NR mmWave / Starlink API",
    sheet: "1 of 1",
    drawnBy: "J. Young",
    date: "2026-06-22",
    image: "/blueprints/sys-003-grid.jpg",
    interactiveId: "network",
  },
  {
    id: "OL-004",
    rev: "A",
    title: "Multi-Environment Power Distribution One-Line Diagram",
    kind: "One-Line",
    standard: "ANSI/IEEE C37 · NFPA 70 NEC",
    sheet: "1 of 1",
    drawnBy: "J. Young",
    date: "2026-06-22",
    image: "/blueprints/ol-004-oneline.jpg",
    interactiveId: "oneline",
  },
  {
    id: "DSP-005",
    rev: "A",
    title: "NILM Engine & Edge TPU Inference Pipeline — Signal Flow",
    kind: "Signal Flow",
    standard: "IEEE 1459 · IEC 62053",
    sheet: "1 of 1",
    drawnBy: "J. Young",
    date: "2026-06-22",
    interactiveId: "nilm",
  },
  {
    id: "SCH-006",
    rev: "A",
    title: "Datacenter Dual-Rail 380V DC Static Transfer Switch (STS)",
    kind: "Power Electronics",
    standard: "IEC 62040-3 · IEEE 446",
    sheet: "1 of 1",
    drawnBy: "J. Young",
    date: "2026-06-22",
    interactiveId: "sts",
  },
];

/** Fabrication dimensions from component_renders.md + DWG-001 */
export const MODULE_DIMENSIONS = {
  envelope: {
    L: 132,
    W: 100,
    H: 98.5,
    unit: "mm" as const,
    note: "Overall module envelope (NTS callout matches CAD envelope)",
  },
  pcb: {
    partNo: "IPC-PCB-001",
    L: 120,
    W: 80,
    T: 1.6,
    layers: 4,
    unit: "mm" as const,
  },
  scr: {
    partNo: "IPC-SCR-002",
    L: 100,
    W: 60,
    H: 25,
    unit: "mm" as const,
    devices: "4× BT152-600R dual anti-parallel",
    Vblock: 600,
    Vsurge: 1200,
    Irms: 12,
    dvdt: "2000 V/μs",
    snubber: "R=47 Ω · C=0.1 μF / 630 V",
    bolt: "M6 tin-plated Cu tabs",
  },
  bus: {
    partNo: "IPC-BUS-003",
    material: "C11000 ETP Cu 99.9%",
    L: 300,
    W: 40,
    T: 8,
    unit: "mm" as const,
    mainA: 200,
    mainTorque: "250 in-lbs / 28.2 N·m",
    neutralTorque: "50 in-lbs / 5.6 N·m",
    groundTorque: "35 in-lbs / 4.0 N·m",
    standoff: "M8 stainless · ceramic bushings",
    rating: "600 V AC/DC UL",
  },
  loto: {
    partNo: "IPC-LOTO-004",
    eyeletOd: 12,
    shackle: 6,
    unit: "mm" as const,
    action: "Severs +5 V gate-driver supply (hardware)",
  },
  heatsink: {
    alloy: "6063-T5 extruded Al",
    fins: 18,
    cooling: "passive convection",
  },
} as const;

export const BREAKER_BOM = [
  {
    item: 1,
    desc: "Aluminum Heat-Sink Cover",
    spec: "6063-T5 extruded, 18 fins, passive convection",
    dim: "Envelope cover · see stack elev.",
  },
  {
    item: 2,
    desc: "ARM Cortex-M7 + Edge TPU PCB",
    spec: "IPC-PCB-001 · 4-layer HDI · 600 MHz MCU + 4 TOPS TPU",
    dim: "120 × 80 × 1.6 mm",
  },
  {
    item: 3,
    desc: "Dual Optocoupler Isolation Layer",
    spec: "SFH615A (gate) + MOC3021 (solenoid) · 4 kV RMS",
    dim: "SOIC / DIP on PCB",
  },
  {
    item: 4,
    desc: "SCR / Thyristor Parallel Matrix",
    spec: "IPC-SCR-002 · 4× BT152-600R dual anti-parallel · 600 V / 12 A",
    dim: "100 × 60 × 25 mm",
  },
  {
    item: 5,
    desc: "Zero-Crossing Detector Circuit",
    spec: "H11AA1 opto · 10 kΩ bias resistors",
    dim: "On logic bay",
  },
  {
    item: 6,
    desc: "24-bit ADC Sampling Board",
    spec: "ADC121S021 @ 50 kHz SPI (branch) · ADS1256 path for I_SENSE",
    dim: "SPI daughter / on-board",
  },
  {
    item: 7,
    desc: "Hall-Effect Current Sensor Clamp",
    spec: "ACS758 · ±200 A · 50 kHz BW · 4 kV isol.",
    dim: "Bus-mounted clamp",
  },
  {
    item: 8,
    desc: "Contact Thermistor Array",
    spec: "NTC 10 kΩ @ 25 °C · β = 3977 K",
    dim: "Contact surface",
  },
  {
    item: 9,
    desc: "LOTO Mechanical Shutter",
    spec: "IPC-LOTO-004 · padlock eyelet severs +5 V gate logic",
    dim: "Eyelet Ø12 mm · 6 mm shackle",
  },
  {
    item: 10,
    desc: "Bimetallic Shunt Resistor Assembly",
    spec: "1 mΩ Kelvin 4-wire · INA226 differential amp",
    dim: "Series load path",
  },
  {
    item: 11,
    desc: "Bottom Terminal Bus Bar (Cu)",
    spec: "250 kcmil lug capacity · torque 250 in-lbs / 28.2 N·m",
    dim: "300 × 40 × 8 mm main bar",
  },
] as const;

export const GATE_NETS = [
  {
    net: "ZC_INT",
    desc: "Zero-crossing interrupt pulse",
    nodes: "H11AA1 output → MCU PIN 4 (EXTI)",
  },
  {
    net: "GATE_DRV",
    desc: "SCR gate trigger (+15 V pulse · ≤20 μs ZC window)",
    nodes: "MCU PIN 12 (PB5/TIM3_CH2) → SFH615A → SCR gate",
  },
  {
    net: "LATCH_DRV",
    desc: "Solenoid latch actuator",
    nodes: "MCU PIN 13 → MOC3021 → TRIAC → 12 V solenoid",
  },
  {
    net: "I_SENSE_OUT",
    desc: "Analog current waveform",
    nodes: "ACS758 → differential amp → ADS1256",
  },
  {
    net: "SHUNT_I2C",
    desc: "Bimetallic shunt measurement",
    nodes: "INA226 → I2C SDA/SCL → MCU",
  },
  {
    net: "THERM_ADC",
    desc: "Contact temperature",
    nodes: "10 kΩ NTC divider → ADC channel",
  },
] as const;

export const ISOLATION = {
  logicLine: "4 kV RMS (SFH615A, MOC3021)",
  measurement: "4 kV RMS (ACS758 hall core)",
  decoupling: "100 nF X7R every power pin",
  lineClass: "≤480 V AC line / 5 V · 12 V logic",
} as const;

export const ONELINE = {
  utility: {
    voltage: "480 V 3Φ 4-Wire Wye/Delta",
    service: "800 A service entrance",
    standard: "ANSI/IEEE C37 · NFPA 70",
  },
  residential: {
    env: "Residential R1+",
    maxBreaker: "200 A",
    bus: "120/240 V split-phase",
    icu: "100 kA @ 240 V",
    loads: [
      { name: "Main", rating: "200 A 2P" },
      { name: "PV (DC-coupled)", rating: "40 A" },
      { name: "Battery", rating: "40 A" },
      { name: "EV charger", rating: "50 A" },
      { name: "V2H / Optimus", rating: "50 A" },
      { name: "Water heater", rating: "30 A" },
    ],
    xfmr: "480 V / 240 V step-down",
  },
  commercial: {
    env: "Commercial C1",
    maxBreaker: "600 A",
    bus: "480 V 3Φ Wye",
    icu: "250 kA @ 480 V",
    loads: [
      { name: "Main", rating: "600 A 3P" },
      { name: "Phase select relay", rating: "PSR matrix" },
      { name: "HVAC compressor", rating: "40 A 3Φ" },
      { name: "Warehouse lighting", rating: "20 A" },
      { name: "Server UPS", rating: "100 A 3Φ" },
    ],
  },
  datacenter: {
    env: "Datacenter D2",
    maxBreaker: "1200 A",
    bus: "380 V DC dual-rail",
    icu: "500 kA @ 380 V DC",
    loads: [
      { name: "Main / rectifier", rating: "1200 A" },
      { name: "STS handoff", rating: "≤0.40 ms" },
      { name: "Rail A / Rail B", rating: "380 V DC" },
      { name: "Rack PDU-A", rating: "150 A" },
      { name: "Rack PDU-B", rating: "150 A" },
    ],
  },
} as const;

export const NILM_LATENCY = [
  { stage: "Analog acquisition", component: "AAF + sensor propagation", latency: "~10 μs" },
  { stage: "ADC conversion", component: "ADS1256 @ 50 kSPS", latency: "20 μs / sample" },
  { stage: "DMA block fill", component: "1024-sample Hann ping-pong", latency: "~20.48 ms (1 AC cycle @ 60 Hz)" },
  { stage: "FFT computation", component: "512-pt radix-2 on Cortex-M7", latency: "~0.8 ms" },
  { stage: "Harmonic extraction", component: "8 harmonic bins (k=2…49)", latency: "~0.1 ms" },
  { stage: "Edge TPU inference", component: "NILM 1D-CNN INT8 @ 4 TOPS", latency: "<2.5 ms" },
  { stage: "Gate driver decision", component: "Zero-crossing gate window", latency: "<100 μs" },
  { stage: "Total end-to-end", component: "—", latency: "<25 ms" },
] as const;

export const NILM_CLASSES = [
  "EV_Charger",
  "HVAC_Compressor",
  "Water_Heater",
  "Lighting",
  "Arc_Fault_AFCI",
  "PV_Inverter",
  "Unknown_Load",
] as const;

export const AFCI_THRESH = {
  thd: 35,
  confidence: 80,
  accuracy: ">99.9%",
  tripUs: 10,
} as const;

export const STS_BOM = [
  { ref: "Q1–Q4", part: "Infineon FZ1200R45KL4", desc: "IGBT primary rail", rating: "1200 A / 4500 V" },
  { ref: "Q5–Q8", part: "Infineon FZ1200R45KL4", desc: "IGBT backup rail", rating: "1200 A / 4500 V" },
  { ref: "U1, U2", part: "2SP0115T", desc: "Isolated IGBT gate driver", rating: "4 kV isol. · 100 ns t_on/off" },
  { ref: "F1, F2", part: "Class J DC", desc: "Input rail current-limiting fuse", rating: "1500 A DC" },
  { ref: "F3, F4", part: "Class J DC", desc: "Output PDU fuse", rating: "150 A DC" },
  { ref: "CT1, CT2", part: "Rogowski coil", desc: "AC/DC current transducer", rating: "200 kHz BW · 0.1%" },
  { ref: "U3", part: "LEM DVL 500", desc: "Differential voltage isolator", rating: "500 V · ±0.5%" },
  { ref: "DSP", part: "TMS320F28379D", desc: "Real-time DSP controller", rating: "200 MHz · 200 ns dead-time" },
  { ref: "C1, C2", part: "Electrolytic bank", desc: "DC bus ride-through", rating: "10 000 μF / 450 V per rail" },
] as const;

export const STS_TIMING = [
  { event: "RAIL_A undervoltage detection (<320 V DC)", t: "0 ms (reference)" },
  { event: "DSP transfer decision + IGBT gate inhibit RAIL_A", t: "+0.15 ms" },
  { event: "RAIL_B IGBT gate enable (make)", t: "+0.15 ms" },
  { event: "Full RAIL_B conduction confirmed", t: "+0.40 ms" },
  { event: "Total blackout window", t: "≤0.40 ms" },
] as const;

export const STS_MARGINS = {
  psuRideThrough: "20 ms (typical server PSU)",
  safetyMargin: "50× ride-through headroom",
  railNom: "380 V DC",
  undervolt: "320 V DC",
} as const;

export const NETWORK_IFACES = [
  { link: "Colossus ↔ Starlink", protocol: "OC-192 fiber", rate: "100 Gbps", latency: "<1 ms" },
  { link: "Starlink ↔ Commercial Hub", protocol: "Ku-band satellite", rate: "12.5 Gbps", latency: "20–40 ms" },
  { link: "Commercial ↔ Residential", protocol: "5G mmWave 27.5–29.5 GHz", rate: "1–10 Gbps", latency: "<5 ms" },
  { link: "Residential IPC ↔ Optimus", protocol: "V2H CAN-FD + 380 V DC", rate: "5 Mbps CAN-FD", latency: "<1 ms" },
  { link: "All Nodes ↔ Blockchain", protocol: "EVM RPC / JSON-RPC", rate: "~100 tx/s per node", latency: "12 s finality" },
] as const;

export const SECURITY_STACK = {
  auth: "mTLS — TLS_AES_256_GCM_SHA384",
  rootOfTrust: "ATECC608A secure element (per node)",
  ota: "ECDSA P-256 · A/B partition rollback",
} as const;
