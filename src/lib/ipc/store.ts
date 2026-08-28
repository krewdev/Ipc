import { create } from "zustand";
import {
  createBattery,
  createBreakers,
  createDemand,
  createDevices,
  createEdge,
  createInitialHealth,
  createOpenAdr,
  createSolar,
  hydrateOpenAdrTimes,
  tickSimulation,
} from "./simulator";
import type {
  ActivityEvent,
  ActivityLevel,
  BreakerStatus,
  FaultRecord,
  IpcState,
  ProductLine,
  ViewId,
} from "./types";
import { PRODUCTS } from "./constants";
import { FAULT_CATALOG, POST_CHECKS, SAFETY_THRESH } from "./safety";

interface IpcActions {
  setView: (view: ViewId) => void;
  setProduct: (product: ProductLine) => void;
  toggleBreaker: (id: string) => void;
  tripBreaker: (id: string, reason: string) => void;
  resetBreaker: (id: string) => void;
  setLoto: (id: string, loto: boolean) => void;
  selectBreaker: (id: string | null) => void;
  setOpenAdrOptIn: (id: string, optIn: boolean) => void;
  simulateBlackout: () => void;
  restoreGrid: () => void;
  triggerDemandEvent: () => void;
  pushActivity: (level: ActivityLevel, source: string, message: string) => void;
  setCommandOpen: (open: boolean) => void;
  runPost: () => void;
  completeCommission: () => void;
  injectFault: (kind: "thermal" | "afci" | "short" | "contact") => void;
  coolBimetal: (id: string) => void;
  tick: () => void;
  start: () => void;
  stop: () => void;
}

let timer: ReturnType<typeof setInterval> | null = null;
let tickCount = 0;
let actSeq = 0;
let startedOnce = false;

function activity(level: ActivityLevel, source: string, message: string): ActivityEvent {
  actSeq += 1;
  return { id: `a-${Date.now()}-${actSeq}`, t: Date.now(), level, source, message };
}

function bootstrap(product: ProductLine): IpcState {
  const breakers = createBreakers(product);
  return {
    product,
    view: "overview",
    running: false,
    health: createInitialHealth(product),
    phases: [],
    breakers,
    devices: createDevices(),
    battery: createBattery(product),
    solar: createSolar(product),
    demand: createDemand(product),
    openAdr: createOpenAdr(),
    edge: createEdge(),
    history: [],
    meshNodes: 6,
    vppRevenueUsd: 128.4,
    selectedBreakerId: null,
    // Empty until client start() — avoids SSR/client Date.now mismatch
    activity: [],
    demoHour: 13.5,
    commandOpen: false,
    commissioned: false,
    postStatus: "idle",
    postChecks: POST_CHECKS.map((c) => ({ ...c, status: "pending" as const })),
    faults: [],
  };
}

export const useIpcStore = create<IpcState & IpcActions>((set, get) => ({
  ...bootstrap("R1+"),

  setView: (view) => set({ view, commandOpen: false }),

  setCommandOpen: (open) => set({ commandOpen: open }),

  setProduct: (product) => {
    const prev = get();
    const next = bootstrap(product);
    const now = Date.now();
    set({
      ...next,
      view: prev.view,
      running: prev.running,
      vppRevenueUsd: prev.vppRevenueUsd,
      openAdr: hydrateOpenAdrTimes(next.openAdr, now),
      demand: { ...next.demand, windowStart: now - 7 * 60_000 },
      activity: [
        activity("info", "System", `Product reconfigured → ${PRODUCTS[product].name}`),
        ...prev.activity,
      ].slice(0, 40),
      commandOpen: false,
    });
  },

  selectBreaker: (id) => set({ selectedBreakerId: id }),

  pushActivity: (level, source, message) => {
    set((s) => ({
      activity: [activity(level, source, message), ...s.activity].slice(0, 40),
    }));
  },

  toggleBreaker: (id) => {
    set((s) => {
      const b = s.breakers.find((x) => x.id === id);
      if (!b || b.status === "LOTO" || b.status === "TRIPPED") return s;
      const next: BreakerStatus = b.status === "CLOSED" ? "OPEN" : "CLOSED";
      return {
        breakers: s.breakers.map((x) =>
          x.id !== id
            ? x
            : {
                ...x,
                status: next,
                cycleCount: x.cycleCount + 1,
                currentA: next === "OPEN" ? 0 : x.currentA,
                powerW: next === "OPEN" ? 0 : x.powerW,
              },
        ),
        activity: [
          activity("info", "Breaker", `${b.label} → ${next}`),
          ...s.activity,
        ].slice(0, 40),
      };
    });
  },

  tripBreaker: (id, reason) => {
    set((s) => {
      const b = s.breakers.find((x) => x.id === id);
      return {
        breakers: s.breakers.map((x) =>
          x.id === id
            ? { ...x, status: "TRIPPED" as const, currentA: 0, powerW: 0, cycleCount: x.cycleCount + 1 }
            : x,
        ),
        health: { ...s.health, lastTrip: reason },
        activity: [
          activity("danger", "Trip", reason || `${b?.label ?? id} software trip`),
          ...s.activity,
        ].slice(0, 40),
      };
    });
  },

  resetBreaker: (id) => {
    set((s) => {
      const b = s.breakers.find((x) => x.id === id);
      if (!b) return s;
      if (b.status === "LOTO") {
        return {
          activity: [
            activity("warn", "LOTO", `${b.label} reset blocked — shutter severs +5V_GATE`),
            ...s.activity,
          ].slice(0, 40),
        };
      }
      if (b.status === "TRIPPED" && (b.bimetalTempC ?? 0) > SAFETY_THRESH.bimetalResetC && b.lastFault?.startsWith("E011")) {
        return {
          activity: [
            activity(
              "warn",
              "E011",
              `${b.label} hysteresis — cool below ${SAFETY_THRESH.bimetalResetC} °C (now ${b.bimetalTempC.toFixed(0)} °C)`,
            ),
            ...s.activity,
          ].slice(0, 40),
        };
      }
      return {
        breakers: s.breakers.map((x) =>
          x.id === id && (x.status === "TRIPPED" || x.status === "OPEN")
            ? { ...x, status: "CLOSED" as const, lastFault: null }
            : x,
        ),
        faults: s.faults.map((f) =>
          f.breakerId === id && f.active ? { ...f, active: false } : f,
        ),
        activity: [activity("ok", "Breaker", `${b.label} reset to CLOSED`), ...s.activity].slice(0, 40),
      };
    });
  },

  setLoto: (id, loto) => {
    set((s) => {
      const b = s.breakers.find((x) => x.id === id);
      return {
        breakers: s.breakers.map((x) => {
          if (x.id !== id) return x;
          if (loto) return { ...x, status: "LOTO" as const, currentA: 0, powerW: 0 };
          return { ...x, status: "OPEN" as const };
        }),
        activity: b
          ? [
              activity("warn", "LOTO", `${b.label} ${loto ? "engaged" : "released"}`),
              ...s.activity,
            ].slice(0, 40)
          : s.activity,
      };
    });
  },

  setOpenAdrOptIn: (id, optIn) => {
    set((s) => ({
      openAdr: s.openAdr.map((e) =>
        e.id === id
          ? {
              ...e,
              optIn,
              status:
                !optIn && e.status === "PENDING"
                  ? ("OPTED_OUT" as const)
                  : e.status === "OPTED_OUT" && optIn
                    ? ("PENDING" as const)
                    : e.status,
            }
          : e,
      ),
      activity: [
        activity("info", "OpenADR", `Event ${id} opt-${optIn ? "in" : "out"}`),
        ...s.activity,
      ].slice(0, 40),
    }));
  },

  simulateBlackout: () => {
    set((s) => ({
      health: { ...s.health, gridMode: "ISLAND" },
      breakers: s.breakers.map((b) =>
        b.shedCapable && !b.critical && b.status === "CLOSED"
          ? { ...b, status: "OPEN" as const, powerW: 0, currentA: 0, cycleCount: b.cycleCount + 1 }
          : b,
      ),
      activity: [
        activity("warn", "Grid", "Mains lost — island mode · virtual subpanel active"),
        ...s.activity,
      ].slice(0, 40),
    }));
  },

  restoreGrid: () => {
    set((s) => ({
      health: { ...s.health, gridMode: "GRID" },
      breakers: s.breakers.map((b) =>
        b.status === "OPEN" && !b.critical
          ? { ...b, status: "CLOSED" as const }
          : b,
      ),
      activity: [activity("ok", "Grid", "Utility restored — loads re-sequenced"), ...s.activity].slice(
        0,
        40,
      ),
    }));
  },

  triggerDemandEvent: () => {
    const now = Date.now();
    set((s) => ({
      openAdr: [
        {
          id: `evt-manual-${now}`,
          name: "Manual Demand Response",
          startAt: now,
          durationMin: 15,
          targetReductionKw: 3.5,
          status: "ACTIVE",
          optIn: true,
        },
        ...s.openAdr,
      ],
      demand: { ...s.demand, shedding: true },
      activity: [
        activity("warn", "VPP", "Manual DR event injected · shedding non-critical load"),
        ...s.activity,
      ].slice(0, 40),
    }));
  },

  runPost: () => {
    const lotoDown = get().breakers.some((b) => b.status === "LOTO");
    set({
      postStatus: "running",
      postChecks: POST_CHECKS.map((c) => ({ ...c, status: "pending" })),
      commissioned: false,
    });
    const order = POST_CHECKS.map((c) => c.id);
    order.forEach((id, i) => {
      window.setTimeout(() => {
        set((s) => {
          const fail = id === "loto" && lotoDown;
          const checks = s.postChecks.map((c) =>
            c.id === id ? { ...c, status: fail ? ("fail" as const) : ("pass" as const) } : c,
          );
          const done = checks.every((c) => c.status !== "pending");
          const anyFail = checks.some((c) => c.status === "fail");
          return {
            postChecks: checks,
            postStatus: done ? (anyFail ? "fail" : "pass") : "running",
            activity: [
              activity(
                fail ? "danger" : "ok",
                "POST",
                fail
                  ? "E-POST LOTO shutter not UP — will not energize downstream"
                  : `${checks.find((c) => c.id === id)?.label} OK`,
              ),
              ...s.activity,
            ].slice(0, 40),
          };
        });
      }, 280 * (i + 1));
    });
  },

  completeCommission: () => {
    const s = get();
    if (s.postStatus !== "pass") {
      set({
        activity: [
          activity("warn", "Commission", "Handshake blocked — POST must PASS first"),
          ...s.activity,
        ].slice(0, 40),
      });
      return;
    }
    set({
      commissioned: true,
      activity: [
        activity("ok", "Commission", "BLE installer handshake complete — downstream modules armed"),
        ...s.activity,
      ].slice(0, 40),
    });
  },

  injectFault: (kind) => {
    const s = get();
    const target =
      s.breakers.find((b) => b.status === "CLOSED") ??
      s.breakers.find((b) => b.status !== "LOTO") ??
      s.breakers[0];
    if (!target) return;
    const catalog =
      kind === "thermal"
        ? FAULT_CATALOG.find((f) => f.code === "E011" && f.sub === "01")
        : kind === "contact"
          ? FAULT_CATALOG.find((f) => f.code === "E011" && f.sub === "02")
          : kind === "afci"
            ? FAULT_CATALOG.find((f) => f.code === "E022")
            : FAULT_CATALOG.find((f) => f.code === "E033");
    if (!catalog) return;
    const rec: FaultRecord = {
      id: `flt-${Date.now()}-${kind}`,
      code: catalog.code,
      sub: catalog.sub,
      type: catalog.type,
      condition: catalog.condition,
      action: catalog.action,
      breakerId: target.id,
      breakerLabel: target.label,
      t: Date.now(),
      active: true,
    };
    const code = `${catalog.code}-${catalog.sub}`;
    set({
      breakers: s.breakers.map((b) =>
        b.id !== target.id
          ? b
          : {
              ...b,
              status: "TRIPPED",
              currentA: 0,
              powerW: 0,
              cycleCount: b.cycleCount + 1,
              lastFault: code,
              bimetalTempC: kind === "thermal" ? 88 : b.bimetalTempC,
              contactTempC: kind === "contact" ? 97 : b.contactTempC,
            },
      ),
      health: {
        ...s.health,
        lastTrip: `${code} ${catalog.type} · ${target.label}`,
        arcFaultRisk: kind === "afci" ? 0.92 : s.health.arcFaultRisk,
      },
      edge: { ...s.edge, mode: "SAFETY", safetyLoopUs: kind === "short" || kind === "afci" ? 9 : s.edge.safetyLoopUs },
      faults: [rec, ...s.faults].slice(0, 24),
      activity: [
        activity(
          "danger",
          code,
          `${target.label} · ${catalog.type} · gate drop < ${SAFETY_THRESH.gateUs} μs`,
        ),
        ...s.activity,
      ].slice(0, 40),
    });
  },

  coolBimetal: (id) => {
    set((s) => ({
      breakers: s.breakers.map((b) =>
        b.id === id ? { ...b, bimetalTempC: SAFETY_THRESH.bimetalResetC - 2, contactTempC: 38 } : b,
      ),
      activity: [
        activity("ok", "E011", "Forced cool-down below 45 °C hysteresis"),
        ...s.activity,
      ].slice(0, 40),
    }));
  },

  tick: () => {
    const s = get();
    tickCount += 1;
    const demoHour = (13.2 + tickCount * 0.035) % 24;
    const prevMode = s.health.gridMode;
    const prevShed = s.demand.shedding;
    const out = tickSimulation(
      {
        product: s.product,
        breakers: s.breakers,
        devices: s.devices,
        battery: s.battery,
        solar: s.solar,
        demand: s.demand,
        openAdr: s.openAdr,
        edge: s.edge,
        health: s.health,
        history: s.history,
        tick: tickCount,
        demoHour,
      },
      s.vppRevenueUsd,
    );

    const extra: ActivityEvent[] = [];
    if (out.health.gridMode !== prevMode) {
      extra.push(activity("warn", "Grid", `Mode change ${prevMode} → ${out.health.gridMode}`));
    }
    if (out.demand.shedding && !prevShed) {
      extra.push(activity("warn", "Demand", "Peak forecast breach — autonomous shed armed"));
    }
    if (out.edge.mode !== s.edge.mode) {
      extra.push(activity("info", "Edge", `TPU mode → ${out.edge.mode}`));
    }
    const newlyTripped = out.breakers.filter(
      (b) => b.status === "TRIPPED" && s.breakers.find((x) => x.id === b.id)?.status !== "TRIPPED",
    );
    for (const b of newlyTripped) {
      extra.push(activity("danger", "Trip", `${b.label} Class 10/20 overcurrent`));
    }

    set({
      breakers: out.breakers,
      devices: out.devices,
      battery: out.battery,
      solar: out.solar,
      demand: out.demand,
      openAdr: out.openAdr,
      edge: out.edge,
      health: out.health,
      phases: out.phases,
      history: out.history,
      meshNodes: out.meshNodes,
      vppRevenueUsd: out.vppRevenueUsd,
      demoHour,
      activity: extra.length ? [...extra, ...s.activity].slice(0, 40) : s.activity,
    });
  },

  start: () => {
    if (timer) return;
    const s = get();
    const now = Date.now();
    if (!startedOnce) {
      startedOnce = true;
      set({
        openAdr: hydrateOpenAdrTimes(s.openAdr, now),
        demand: { ...s.demand, windowStart: now - 7 * 60_000 },
        activity: [
          activity("ok", "Core", `${PRODUCTS[s.product].name} controller online`),
          activity("info", "NILM", "Edge TPU model loaded · int8 · Coral"),
          activity("info", "Comms", "mTLS mesh handshake complete"),
        ],
      });
    }
    set({ running: true });
    get().tick();
    timer = setInterval(() => get().tick(), 1000);
  },

  stop: () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    set({ running: false });
  },
}));

export function getProductSpec(product: ProductLine) {
  return PRODUCTS[product];
}

export const VIEW_META: { id: ViewId; label: string; hint: string }[] = [
  { id: "overview", label: "Overview", hint: "Live telemetry & panel faceplate" },
  { id: "circuits", label: "Circuits", hint: "Hybrid breakers & LOTO" },
  { id: "nilm", label: "NILM Engine", hint: "Load disaggregation" },
  { id: "load", label: "Load Mgmt", hint: "Demand window & virtual subpanel" },
  { id: "vpp", label: "VPP / OpenADR", hint: "Grid services & droop" },
  { id: "tech", label: "Technician", hint: "POST, LOTO, torque, fault codes" },
  { id: "prototypes", label: "Prototypes", hint: "Hardware concept gallery" },
  { id: "blueprints", label: "Blueprints", hint: "Engineering drawing package" },
  { id: "architecture", label: "Architecture", hint: "System topology" },
];
