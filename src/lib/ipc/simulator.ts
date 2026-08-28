import {
  COMMERCIAL_CIRCUITS,
  DATACENTER_CIRCUITS,
  NILM_DEVICES,
  PRODUCTS,
  RESIDENTIAL_CIRCUITS,
} from "./constants";
import type {
  BreakerState,
  BreakerStatus,
  DeviceLoad,
  OpenAdrEvent,
  PhaseMetrics,
  PowerSample,
  ProductLine,
  SystemHealth,
  BatteryState,
  SolarState,
  DemandWindow,
  EdgeComputeState,
} from "./types";

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function circuitDefs(product: ProductLine) {
  const seg = PRODUCTS[product].segment;
  if (seg === "Commercial") return COMMERCIAL_CIRCUITS;
  if (seg === "Data Center") return DATACENTER_CIRCUITS;
  return RESIDENTIAL_CIRCUITS;
}

export function createBreakers(product: ProductLine): BreakerState[] {
  const defs = circuitDefs(product);
  return defs.map((d, i) => ({
    id: `br-${String(i + 1).padStart(2, "0")}`,
    label: d.label,
    pole: i + 1,
    ratingA: d.ratingA,
    status: "CLOSED" as const,
    currentA: 0,
    powerW: 0,
    critical: d.critical,
    // Deterministic for SSR/client parity
    cycleCount: 120 + ((i * 997) % 4000),
    contactTempC: 28 + ((i * 1.7) % 8),
    bimetalTempC: 32 + ((i * 0.9) % 6),
    shedCapable: d.shedCapable,
    category: d.category,
    lastFault: null,
  }));
}

export function createDevices(): DeviceLoad[] {
  return NILM_DEVICES.map((d, i) => ({
    id: d.id,
    name: d.name,
    powerW: 0,
    confidence: 0.88 + ((i * 0.013) % 0.11),
    harmonicSignature: Array.from({ length: 12 }, (_, h) => ((i + 1) * (h + 3) * 0.07) % 1),
    category: d.category,
    on: i % 3 !== 0,
  }));
}

export function createOpenAdr(): OpenAdrEvent[] {
  // Relative times set on client start to avoid SSR clock skew
  return [
    {
      id: "evt-peak-1",
      name: "Utility Peak Shed — Afternoon",
      startAt: 0,
      durationMin: 60,
      targetReductionKw: 4.5,
      status: "PENDING",
      optIn: true,
    },
    {
      id: "evt-freq-2",
      name: "Frequency Response Drill",
      startAt: 0,
      durationMin: 30,
      targetReductionKw: 2.0,
      status: "ACTIVE",
      optIn: true,
    },
    {
      id: "evt-night-3",
      name: "Overnight Arbitrage Window",
      startAt: 0,
      durationMin: 120,
      targetReductionKw: -3.0,
      status: "PENDING",
      optIn: false,
    },
  ];
}

export function hydrateOpenAdrTimes(events: OpenAdrEvent[], now = Date.now()): OpenAdrEvent[] {
  return events.map((e) => {
    if (e.id === "evt-peak-1") return { ...e, startAt: now + 8 * 60_000 };
    if (e.id === "evt-freq-2") return { ...e, startAt: now - 5 * 60_000 };
    if (e.id === "evt-night-3") return { ...e, startAt: now + 4 * 3600_000 };
    return e;
  });
}

export function createInitialHealth(product: ProductLine): SystemHealth {
  const p = PRODUCTS[product];
  return {
    gridMode: "GRID",
    frequency: 60.01,
    mainsVoltage: p.phases === 3 ? (product === "C2" ? 480 : 208) : 240,
    totalPowerW: 0,
    totalReactiveVar: 0,
    powerFactor: 0.96,
    arcFaultRisk: 0.02,
    groundFaultMa: 1.2,
    uptimeSec: 86_400 * 12 + 3600 * 4,
    lastTrip: null,
  };
}

export function createBattery(product: ProductLine): BatteryState {
  const res = PRODUCTS[product].segment === "Residential";
  return {
    soc: res ? 72 : 55,
    powerW: 0,
    capacityKwh: res ? 27 : product.startsWith("D") ? 500 : 120,
    voltage: res ? 51.2 : 380,
    health: 97.4,
  };
}

export function createSolar(product: ProductLine): SolarState {
  const res = PRODUCTS[product].segment === "Residential";
  return {
    powerW: 0,
    capacityKw: res ? 12.6 : product.startsWith("C") ? 80 : 0,
    irradiance: 0.82,
  };
}

export function createDemand(product: ProductLine): DemandWindow {
  const base = PRODUCTS[product].segment === "Commercial" ? 180 : 8;
  return {
    windowStart: 0,
    averageKw: base * 0.72,
    peakThresholdKw: base,
    forecastKw: base * 0.78,
    shedding: false,
  };
}

export function createEdge(): EdgeComputeState {
  return {
    mcuLoad: 22,
    tpuUtil: 38,
    inferenceMs: 14.2,
    samplesHz: 16000,
    safetyLoopUs: 180,
    altruisticJobs: 3,
    mode: "NILM",
  };
}

export interface TickInput {
  product: ProductLine;
  breakers: BreakerState[];
  devices: DeviceLoad[];
  battery: BatteryState;
  solar: SolarState;
  demand: DemandWindow;
  openAdr: OpenAdrEvent[];
  edge: EdgeComputeState;
  health: SystemHealth;
  history: PowerSample[];
  tick: number;
  demoHour: number;
}

export interface TickOutput {
  breakers: BreakerState[];
  devices: DeviceLoad[];
  battery: BatteryState;
  solar: SolarState;
  demand: DemandWindow;
  openAdr: OpenAdrEvent[];
  edge: EdgeComputeState;
  health: SystemHealth;
  phases: PhaseMetrics[];
  history: PowerSample[];
  meshNodes: number;
  vppRevenueUsd: number;
}

export function tickSimulation(input: TickInput, revenue: number): TickOutput {
  const rng = mulberry32(input.tick * 9973 + 42);
  const product = PRODUCTS[input.product];
  const hour = input.demoHour;
  const dayFactor = clamp(Math.sin(((hour - 6) / 24) * Math.PI * 2) * 0.5 + 0.55, 0.15, 1);
  const solarFactor = clamp(Math.sin(((hour - 6) / 12) * Math.PI), 0, 1) * input.solar.irradiance;

  const devices = input.devices.map((d) => {
    let on = d.on;
    if (rng() < 0.02) on = !on;
    const activeEvent = input.openAdr.find((e) => e.status === "ACTIVE" && e.optIn);
    if (activeEvent && (d.category === "EV" || d.category === "Thermal" || d.category === "Laundry")) {
      on = false;
    }
    const noise = 0.9 + rng() * 0.2;
    const base = NILM_DEVICES.find((x) => x.id === d.id)?.baseW ?? 100;
    const scale =
      product.segment === "Commercial" ? 4.5 : product.segment === "Data Center" ? 12 : 1;
    const powerW = on ? base * scale * noise * (0.7 + dayFactor * 0.4) : base * scale * 0.02 * noise;
    const signature = d.harmonicSignature.map((h, i) =>
      clamp(h * 0.95 + rng() * 0.1 + (i % 2 === 0 ? 0.02 : 0), 0, 1),
    );
    return {
      ...d,
      on,
      powerW,
      confidence: clamp(d.confidence + (rng() - 0.5) * 0.01, 0.75, 0.995),
      harmonicSignature: signature,
    };
  });

  const activeShed =
    input.demand.shedding ||
    input.openAdr.some((e) => e.status === "ACTIVE" && e.optIn) ||
    input.battery.soc < 30;

  const breakers = input.breakers.map((b, i) => {
    if (b.status === "OPEN" || b.status === "LOTO" || b.status === "TRIPPED") {
      return {
        ...b,
        currentA: 0,
        powerW: 0,
        contactTempC: Math.max(24, b.contactTempC - 0.05),
        bimetalTempC: Math.max(25, (b.bimetalTempC ?? 32) - 0.35),
      };
    }
    const loadFactor = activeShed && b.shedCapable && !b.critical ? 0.15 : 0.55 + dayFactor * 0.4;
    const categoryMatch = devices.find((d) => d.category === b.category && d.on);
    let powerW =
      categoryMatch != null
        ? categoryMatch.powerW * (0.4 + (i % 3) * 0.15)
        : b.ratingA * (product.phases === 3 ? 208 : 120) * 0.08 * loadFactor * (0.7 + rng() * 0.6);

    if (activeShed && b.shedCapable && !b.critical) {
      powerW *= 0.2;
    }

    const volts = product.phases === 3 ? (input.product === "C2" ? 277 : 120) : 120;
    let currentA = powerW / Math.max(volts, 1);
    let status: BreakerStatus = b.status;
    if (currentA > b.ratingA * 1.25) {
      status = "TRIPPED";
      powerW = 0;
      currentA = 0;
    }
    return {
      ...b,
      status,
      powerW: status === "CLOSED" ? powerW : 0,
      currentA: status === "CLOSED" ? currentA : 0,
      contactTempC: clamp(
        b.contactTempC + (status === "CLOSED" ? currentA * 0.01 : -0.08) + (rng() - 0.5) * 0.2,
        22,
        75,
      ),
      bimetalTempC: clamp(
        (b.bimetalTempC ?? 32) +
          (status === "CLOSED" ? currentA * currentA * 0.00008 : -0.12) +
          (rng() - 0.5) * 0.15,
        24,
        90,
      ),
    };
  });

  const totalPowerW = breakers.reduce((s, b) => s + b.powerW, 0);
  const solarPower = input.solar.capacityKw * 1000 * solarFactor * (0.9 + rng() * 0.1);

  let batteryPower = 0;
  let soc = input.battery.soc;
  const surplus = solarPower - totalPowerW * 0.3;
  if (input.health.gridMode === "ISLAND" || input.health.gridMode === "FAILOVER") {
    batteryPower = -totalPowerW * 0.6;
  } else if (surplus > 500 && soc < 95) {
    batteryPower = Math.min(surplus * 0.5, input.battery.capacityKwh * 50);
  } else if (hour >= 16 && hour <= 20 && soc > 20) {
    batteryPower = -Math.min(totalPowerW * 0.25, input.battery.capacityKwh * 40);
  }
  soc = clamp(soc + (-batteryPower / (input.battery.capacityKwh * 1000)) * 0.5, 5, 100);

  const gridPower = totalPowerW - solarPower - batteryPower;
  const reactive = totalPowerW * (0.15 + rng() * 0.08);
  const pf = totalPowerW / Math.sqrt(totalPowerW ** 2 + reactive ** 2 + 1);

  const phases: PhaseMetrics[] = (
    product.phases === 3 ? (["L1", "L2", "L3"] as const) : (["L1", "L2"] as const)
  ).map((phase, i) => {
    const share = product.phases === 3 ? 1 / 3 : 0.5;
    const imbalance = 1 + (i - 1) * 0.04 + (rng() - 0.5) * 0.03;
    const powerW = totalPowerW * share * imbalance;
    const voltage =
      product.phases === 3
        ? (input.product === "C2" ? 277 : 120) * (0.99 + rng() * 0.02)
        : 120 * (0.99 + rng() * 0.02);
    const current = powerW / voltage;
    return {
      phase,
      voltage,
      current,
      powerW,
      pf: clamp(pf + (rng() - 0.5) * 0.02, 0.85, 1),
      thd: clamp(2.5 + rng() * 2.5 + (activeShed ? 1 : 0), 1, 12),
    };
  });

  const windowStart = input.demand.windowStart || Date.now();
  const elapsed = (Date.now() - windowStart) / 60_000;
  let nextWindowStart = windowStart;
  let averageKw = input.demand.averageKw;
  if (elapsed >= 15) {
    nextWindowStart = Date.now();
    averageKw = totalPowerW / 1000;
  } else {
    averageKw = averageKw * 0.92 + (totalPowerW / 1000) * 0.08;
  }
  const forecastKw = averageKw * 1.05 + (rng() - 0.4) * 2;
  const shedding = forecastKw > input.demand.peakThresholdKw * 0.92;

  const now = Date.now();
  const openAdr = input.openAdr.map((e) => {
    if (!e.startAt) return e;
    if (e.status === "COMPLETED" || e.status === "OPTED_OUT") return e;
    if (!e.optIn && e.status === "PENDING") return { ...e, status: "OPTED_OUT" as const };
    const end = e.startAt + e.durationMin * 60_000;
    if (now >= e.startAt && now < end && e.optIn) return { ...e, status: "ACTIVE" as const };
    if (now >= end) return { ...e, status: "COMPLETED" as const };
    return e;
  });

  const mode = activeShed ? "SAFETY" : solarPower > totalPowerW * 0.5 ? "ALTRUISTIC" : "NILM";
  const edge: EdgeComputeState = {
    mcuLoad: clamp(18 + rng() * 25 + (mode === "SAFETY" ? 20 : 0), 5, 95),
    tpuUtil: clamp(mode === "ALTRUISTIC" ? 70 + rng() * 25 : 25 + rng() * 40, 5, 98),
    inferenceMs: clamp(12 + rng() * 8 + (mode === "SAFETY" ? -4 : 0), 4, 35),
    samplesHz: 16000,
    safetyLoopUs: clamp(120 + rng() * 100, 80, 400),
    altruisticJobs: mode === "ALTRUISTIC" ? 8 + Math.floor(rng() * 12) : Math.floor(rng() * 4),
    mode,
  };

  let gridMode = input.health.gridMode;
  if (rng() < 0.003) gridMode = "ISLAND";
  else if (gridMode === "ISLAND" && rng() < 0.08) gridMode = "GRID";
  if (input.product.startsWith("D") && rng() < 0.002) gridMode = "FAILOVER";
  else if (gridMode === "FAILOVER" && rng() < 0.1) gridMode = "GRID";

  const tripped = breakers.find((b) => b.status === "TRIPPED");
  const health: SystemHealth = {
    ...input.health,
    gridMode,
    frequency: clamp(60 + (rng() - 0.5) * 0.06 + (gridMode === "ISLAND" ? -0.08 : 0), 59.7, 60.3),
    mainsVoltage:
      product.phases === 3
        ? (input.product === "C2" ? 480 : 208) * (0.99 + rng() * 0.02)
        : 240 * (0.99 + rng() * 0.02),
    totalPowerW,
    totalReactiveVar: reactive,
    powerFactor: pf,
    arcFaultRisk: clamp(
      0.01 + rng() * 0.04 + (breakers.some((b) => b.contactTempC > 60) ? 0.1 : 0),
      0,
      1,
    ),
    groundFaultMa: clamp(0.8 + rng() * 1.5, 0.2, 8),
    uptimeSec: input.health.uptimeSec + 1,
    lastTrip: tripped ? `${tripped.label} trip` : input.health.lastTrip,
  };

  const sample: PowerSample = {
    t: Date.now(),
    p: totalPowerW,
    q: reactive,
    solar: solarPower,
    battery: batteryPower,
    grid: gridPower,
  };
  const history = [...input.history, sample].slice(-90);

  const meshNodes = 4 + Math.floor(rng() * 8) + (gridMode === "ISLAND" ? 3 : 0);
  const vppRevenueUsd =
    revenue +
    (openAdr.some((e) => e.status === "ACTIVE") ? 0.012 : 0) +
    (batteryPower < -500 ? 0.008 : 0) +
    (mode === "ALTRUISTIC" ? 0.003 : 0);

  return {
    breakers,
    devices,
    battery: {
      ...input.battery,
      soc,
      powerW: batteryPower,
      voltage: input.battery.voltage * (0.998 + rng() * 0.004),
    },
    solar: {
      ...input.solar,
      powerW: solarPower,
      irradiance: clamp(solarFactor + (rng() - 0.5) * 0.05, 0, 1),
    },
    demand: {
      ...input.demand,
      windowStart: nextWindowStart,
      averageKw,
      forecastKw,
      shedding,
    },
    openAdr,
    edge,
    health,
    phases,
    history,
    meshNodes,
    vppRevenueUsd,
  };
}
