export type ProductLine = "R1" | "R1+" | "C1" | "C2" | "D1" | "D2";
export type BreakerStatus = "OPEN" | "CLOSED" | "TRIPPED" | "LOTO";
export type GridMode = "GRID" | "ISLAND" | "GENERATOR" | "FAILOVER";
export type ViewId =
  | "overview"
  | "circuits"
  | "nilm"
  | "load"
  | "vpp"
  | "architecture"
  | "prototypes"
  | "blueprints"
  | "tech";

export type ActivityLevel = "info" | "ok" | "warn" | "danger";

export interface ActivityEvent {
  id: string;
  t: number;
  level: ActivityLevel;
  source: string;
  message: string;
}

export interface ProductSpec {
  id: ProductLine;
  name: string;
  segment: "Residential" | "Commercial" | "Data Center";
  voltage: string;
  phases: 1 | 3;
  maxAmps: number;
  maxBranches: number;
  features: string[];
}

export interface BreakerState {
  id: string;
  label: string;
  pole: number;
  ratingA: number;
  status: BreakerStatus;
  currentA: number;
  powerW: number;
  critical: boolean;
  cycleCount: number;
  contactTempC: number;
  bimetalTempC: number;
  shedCapable: boolean;
  category: string;
  lastFault: string | null;
}

export interface DeviceLoad {
  id: string;
  name: string;
  powerW: number;
  confidence: number;
  harmonicSignature: number[];
  category: string;
  on: boolean;
}

export interface PowerSample {
  t: number;
  p: number;
  q: number;
  solar: number;
  battery: number;
  grid: number;
}

export interface PhaseMetrics {
  phase: "L1" | "L2" | "L3";
  voltage: number;
  current: number;
  powerW: number;
  pf: number;
  thd: number;
}

export interface BatteryState {
  soc: number;
  powerW: number;
  capacityKwh: number;
  voltage: number;
  health: number;
}

export interface SolarState {
  powerW: number;
  capacityKw: number;
  irradiance: number;
}

export interface DemandWindow {
  windowStart: number;
  averageKw: number;
  peakThresholdKw: number;
  forecastKw: number;
  shedding: boolean;
}

export interface OpenAdrEvent {
  id: string;
  name: string;
  startAt: number;
  durationMin: number;
  targetReductionKw: number;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "OPTED_OUT";
  optIn: boolean;
}

export interface EdgeComputeState {
  mcuLoad: number;
  tpuUtil: number;
  inferenceMs: number;
  samplesHz: number;
  safetyLoopUs: number;
  altruisticJobs: number;
  mode: "SAFETY" | "NILM" | "ALTRUISTIC";
}

export interface SystemHealth {
  gridMode: GridMode;
  frequency: number;
  mainsVoltage: number;
  totalPowerW: number;
  totalReactiveVar: number;
  powerFactor: number;
  arcFaultRisk: number;
  groundFaultMa: number;
  uptimeSec: number;
  lastTrip: string | null;
}

export type PostStatus = "idle" | "running" | "pass" | "fail";

export interface PostCheckState {
  id: string;
  label: string;
  status: "pending" | "pass" | "fail";
}

export interface FaultRecord {
  id: string;
  code: string;
  sub: string;
  type: string;
  condition: string;
  action: string;
  breakerId: string | null;
  breakerLabel: string | null;
  t: number;
  active: boolean;
}

export interface IpcState {
  product: ProductLine;
  view: ViewId;
  running: boolean;
  health: SystemHealth;
  phases: PhaseMetrics[];
  breakers: BreakerState[];
  devices: DeviceLoad[];
  battery: BatteryState;
  solar: SolarState;
  demand: DemandWindow;
  openAdr: OpenAdrEvent[];
  edge: EdgeComputeState;
  history: PowerSample[];
  meshNodes: number;
  vppRevenueUsd: number;
  selectedBreakerId: string | null;
  activity: ActivityEvent[];
  demoHour: number;
  commandOpen: boolean;
  commissioned: boolean;
  postStatus: PostStatus;
  postChecks: PostCheckState[];
  faults: FaultRecord[];
}

