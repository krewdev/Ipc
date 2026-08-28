import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as Slot } from "../_libs/@radix-ui/react-popper+[...].mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/@radix-ui/react-switch+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { _ as Battery, a as Thermometer, c as RotateCcw, d as Network, f as Menu, g as Cpu, h as GitBranch, i as TriangleAlert, l as Radio, m as LayoutDashboard, n as X, o as Sun, p as Lock, r as Waves, s as Shield, t as Zap, u as Power, v as Activity } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as Separator$1 } from "../_libs/radix-ui__react-separator.mjs";
import { a as Area, c as Cell, d as Legend, i as XAxis, l as ResponsiveContainer, n as BarChart, o as CartesianGrid, r as YAxis, s as Bar, t as AreaChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B0XofYQj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
/** Format watts as a kW number string (always ÷1000). */
function formatKw(w, digits = 2) {
	return (w / 1e3).toFixed(digits);
}
function formatPower(w) {
	const abs = Math.abs(w);
	if (abs >= 1e6) return `${(w / 1e6).toFixed(2)} MW`;
	if (abs >= 1e3) return `${(w / 1e3).toFixed(2)} kW`;
	return `${w.toFixed(0)} W`;
}
function formatPct(n, digits = 0) {
	return `${n.toFixed(digits)}%`;
}
function formatA(a) {
	return `${a.toFixed(1)} A`;
}
function formatV(v) {
	return `${v.toFixed(1)} V`;
}
var PRODUCTS = {
	R1: {
		id: "R1",
		name: "IPC-R1",
		segment: "Residential",
		voltage: "120/240V Split-Phase",
		phases: 1,
		maxAmps: 200,
		maxBranches: 40,
		features: [
			"NILM",
			"Matter API",
			"Home Assistant",
			"Class 10/20 Trip"
		]
	},
	"R1+": {
		id: "R1+",
		name: "IPC-R1+",
		segment: "Residential",
		voltage: "120/240V + DC Multiport",
		phases: 1,
		maxAmps: 400,
		maxBranches: 40,
		features: [
			"Solar/BMS Bus",
			"EV PWM",
			"Matter",
			"Virtual Subpanels"
		]
	},
	C1: {
		id: "C1",
		name: "IPC-C1",
		segment: "Commercial",
		voltage: "120/208V 3-Phase",
		phases: 3,
		maxAmps: 800,
		maxBranches: 60,
		features: [
			"Peak Demand Shave",
			"Phase Balance",
			"BACnet/Modbus"
		]
	},
	C2: {
		id: "C2",
		name: "IPC-C2",
		segment: "Commercial",
		voltage: "277/480V 3-Phase",
		phases: 3,
		maxAmps: 2e3,
		maxBranches: 84,
		features: [
			"15-min Peak Cap",
			"BMS Gateway",
			"High SCCR 65kA"
		]
	},
	D1: {
		id: "D1",
		name: "IPC-D1",
		segment: "Data Center",
		voltage: "High-Density AC PDU",
		phases: 3,
		maxAmps: 1200,
		maxBranches: 84,
		features: [
			"Branch Telemetry",
			"N+1 Ready",
			"STS Integration"
		]
	},
	D2: {
		id: "D2",
		name: "IPC-D2",
		segment: "Data Center",
		voltage: "380V HVDC Core",
		phases: 1,
		maxAmps: 2e3,
		maxBranches: 96,
		features: [
			"<1ms Failover",
			"Arc Suppression",
			"UPS Sync"
		]
	}
};
var RESIDENTIAL_CIRCUITS = [
	{
		label: "Kitchen Range",
		ratingA: 40,
		category: "Kitchen",
		critical: false,
		shedCapable: true
	},
	{
		label: "HVAC Compressor",
		ratingA: 40,
		category: "HVAC",
		critical: false,
		shedCapable: true
	},
	{
		label: "EV Charger",
		ratingA: 50,
		category: "EV",
		critical: false,
		shedCapable: true
	},
	{
		label: "Water Heater",
		ratingA: 30,
		category: "Thermal",
		critical: false,
		shedCapable: true
	},
	{
		label: "Dryer",
		ratingA: 30,
		category: "Laundry",
		critical: false,
		shedCapable: true
	},
	{
		label: "Washer",
		ratingA: 20,
		category: "Laundry",
		critical: false,
		shedCapable: true
	},
	{
		label: "Refrigerator",
		ratingA: 20,
		category: "Kitchen",
		critical: true,
		shedCapable: false
	},
	{
		label: "Living Lights",
		ratingA: 15,
		category: "Lighting",
		critical: false,
		shedCapable: true
	},
	{
		label: "Bedroom Lights",
		ratingA: 15,
		category: "Lighting",
		critical: false,
		shedCapable: true
	},
	{
		label: "Office / Desk",
		ratingA: 20,
		category: "Office",
		critical: false,
		shedCapable: true
	},
	{
		label: "Garage / Tools",
		ratingA: 20,
		category: "Garage",
		critical: false,
		shedCapable: true
	},
	{
		label: "Pool Pump",
		ratingA: 20,
		category: "Outdoor",
		critical: false,
		shedCapable: true
	},
	{
		label: "Medical Outlet",
		ratingA: 20,
		category: "Critical",
		critical: true,
		shedCapable: false
	},
	{
		label: "Network Rack",
		ratingA: 15,
		category: "Critical",
		critical: true,
		shedCapable: false
	},
	{
		label: "Heat Pump Aux",
		ratingA: 30,
		category: "HVAC",
		critical: false,
		shedCapable: true
	},
	{
		label: "Dishwasher",
		ratingA: 20,
		category: "Kitchen",
		critical: false,
		shedCapable: true
	}
];
var COMMERCIAL_CIRCUITS = [
	{
		label: "HVAC Stage 1",
		ratingA: 60,
		category: "HVAC",
		critical: false,
		shedCapable: true
	},
	{
		label: "HVAC Stage 2",
		ratingA: 60,
		category: "HVAC",
		critical: false,
		shedCapable: true
	},
	{
		label: "Warehouse Lights A",
		ratingA: 40,
		category: "Lighting",
		critical: false,
		shedCapable: true
	},
	{
		label: "Warehouse Lights B",
		ratingA: 40,
		category: "Lighting",
		critical: false,
		shedCapable: true
	},
	{
		label: "Production Line 1",
		ratingA: 100,
		category: "Process",
		critical: true,
		shedCapable: false
	},
	{
		label: "Production Line 2",
		ratingA: 100,
		category: "Process",
		critical: true,
		shedCapable: false
	},
	{
		label: "Compressor Bank",
		ratingA: 80,
		category: "Process",
		critical: false,
		shedCapable: true
	},
	{
		label: "Office Floor 1",
		ratingA: 40,
		category: "Office",
		critical: false,
		shedCapable: true
	},
	{
		label: "Office Floor 2",
		ratingA: 40,
		category: "Office",
		critical: false,
		shedCapable: true
	},
	{
		label: "Elevator Bank",
		ratingA: 60,
		category: "Vertical",
		critical: true,
		shedCapable: false
	},
	{
		label: "Server Closet",
		ratingA: 30,
		category: "IT",
		critical: true,
		shedCapable: false
	},
	{
		label: "Dock Doors",
		ratingA: 30,
		category: "Logistics",
		critical: false,
		shedCapable: true
	},
	{
		label: "Battery Charge",
		ratingA: 50,
		category: "Storage",
		critical: false,
		shedCapable: true
	},
	{
		label: "Parking EV Array",
		ratingA: 100,
		category: "EV",
		critical: false,
		shedCapable: true
	},
	{
		label: "Kitchen / Cafe",
		ratingA: 40,
		category: "Kitchen",
		critical: false,
		shedCapable: true
	},
	{
		label: "Emergency Egress",
		ratingA: 20,
		category: "Critical",
		critical: true,
		shedCapable: false
	}
];
var DATACENTER_CIRCUITS = [
	{
		label: "Rack Row A1",
		ratingA: 60,
		category: "IT",
		critical: true,
		shedCapable: false
	},
	{
		label: "Rack Row A2",
		ratingA: 60,
		category: "IT",
		critical: true,
		shedCapable: false
	},
	{
		label: "Rack Row B1",
		ratingA: 60,
		category: "IT",
		critical: true,
		shedCapable: false
	},
	{
		label: "Rack Row B2",
		ratingA: 60,
		category: "IT",
		critical: true,
		shedCapable: false
	},
	{
		label: "Rack Row C1",
		ratingA: 60,
		category: "IT",
		critical: true,
		shedCapable: false
	},
	{
		label: "Rack Row C2",
		ratingA: 60,
		category: "IT",
		critical: true,
		shedCapable: false
	},
	{
		label: "CRAC Unit 1",
		ratingA: 80,
		category: "Cooling",
		critical: true,
		shedCapable: false
	},
	{
		label: "CRAC Unit 2",
		ratingA: 80,
		category: "Cooling",
		critical: true,
		shedCapable: false
	},
	{
		label: "CRAC Unit 3",
		ratingA: 80,
		category: "Cooling",
		critical: false,
		shedCapable: true
	},
	{
		label: "PDU A Feed",
		ratingA: 100,
		category: "Distribution",
		critical: true,
		shedCapable: false
	},
	{
		label: "PDU B Feed",
		ratingA: 100,
		category: "Distribution",
		critical: true,
		shedCapable: false
	},
	{
		label: "STS Primary",
		ratingA: 200,
		category: "STS",
		critical: true,
		shedCapable: false
	},
	{
		label: "STS Secondary",
		ratingA: 200,
		category: "STS",
		critical: true,
		shedCapable: false
	},
	{
		label: "Network Core",
		ratingA: 40,
		category: "Network",
		critical: true,
		shedCapable: false
	},
	{
		label: "Lighting / BMS",
		ratingA: 30,
		category: "Facility",
		critical: false,
		shedCapable: true
	},
	{
		label: "Spare / Test",
		ratingA: 40,
		category: "Spare",
		critical: false,
		shedCapable: true
	}
];
var NILM_DEVICES = [
	{
		id: "hvac",
		name: "HVAC Compressor",
		category: "HVAC",
		baseW: 2800
	},
	{
		id: "ev",
		name: "EV Inverter",
		category: "EV",
		baseW: 7200
	},
	{
		id: "wh",
		name: "Water Heater",
		category: "Thermal",
		baseW: 4500
	},
	{
		id: "fridge",
		name: "Refrigerator",
		category: "Kitchen",
		baseW: 180
	},
	{
		id: "dryer",
		name: "Clothes Dryer",
		category: "Laundry",
		baseW: 5200
	},
	{
		id: "washer",
		name: "Washing Machine",
		category: "Laundry",
		baseW: 600
	},
	{
		id: "lights",
		name: "LED Lighting",
		category: "Lighting",
		baseW: 420
	},
	{
		id: "oven",
		name: "Induction Range",
		category: "Kitchen",
		baseW: 3100
	},
	{
		id: "pool",
		name: "Pool Pump",
		category: "Outdoor",
		baseW: 1400
	},
	{
		id: "server",
		name: "Home Server",
		category: "IT",
		baseW: 220
	},
	{
		id: "heatpump",
		name: "Heat Pump",
		category: "HVAC",
		baseW: 1900
	},
	{
		id: "misc",
		name: "Misc Standby",
		category: "Standby",
		baseW: 95
	}
];
function mulberry32(a) {
	return function() {
		let t = a += 1831565813;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function circuitDefs(product) {
	const seg = PRODUCTS[product].segment;
	if (seg === "Commercial") return COMMERCIAL_CIRCUITS;
	if (seg === "Data Center") return DATACENTER_CIRCUITS;
	return RESIDENTIAL_CIRCUITS;
}
function createBreakers(product) {
	return circuitDefs(product).map((d, i) => ({
		id: `br-${String(i + 1).padStart(2, "0")}`,
		label: d.label,
		pole: i + 1,
		ratingA: d.ratingA,
		status: "CLOSED",
		currentA: 0,
		powerW: 0,
		critical: d.critical,
		cycleCount: 120 + Math.floor(Math.random() * 4e3),
		contactTempC: 28 + Math.random() * 8,
		shedCapable: d.shedCapable,
		category: d.category
	}));
}
function createDevices() {
	return NILM_DEVICES.map((d) => ({
		id: d.id,
		name: d.name,
		powerW: 0,
		confidence: .88 + Math.random() * .11,
		harmonicSignature: Array.from({ length: 12 }, () => Math.random()),
		category: d.category,
		on: Math.random() > .35
	}));
}
function createOpenAdr() {
	const now = Date.now();
	return [
		{
			id: "evt-peak-1",
			name: "Utility Peak Shed — Afternoon",
			startAt: now + 8 * 6e4,
			durationMin: 60,
			targetReductionKw: 4.5,
			status: "PENDING",
			optIn: true
		},
		{
			id: "evt-freq-2",
			name: "Frequency Response Drill",
			startAt: now - 5 * 6e4,
			durationMin: 30,
			targetReductionKw: 2,
			status: "ACTIVE",
			optIn: true
		},
		{
			id: "evt-night-3",
			name: "Overnight Arbitrage Window",
			startAt: now + 4 * 36e5,
			durationMin: 120,
			targetReductionKw: -3,
			status: "PENDING",
			optIn: false
		}
	];
}
function createInitialHealth(product) {
	return {
		gridMode: "GRID",
		frequency: 60.01,
		mainsVoltage: PRODUCTS[product].phases === 3 ? product === "C2" ? 480 : 208 : 240,
		totalPowerW: 0,
		totalReactiveVar: 0,
		powerFactor: .96,
		arcFaultRisk: .02,
		groundFaultMa: 1.2,
		uptimeSec: 1051200,
		lastTrip: null
	};
}
function createBattery(product) {
	const res = PRODUCTS[product].segment === "Residential";
	return {
		soc: res ? 72 : 55,
		powerW: 0,
		capacityKwh: res ? 27 : product.startsWith("D") ? 500 : 120,
		voltage: res ? 51.2 : 380,
		health: 97.4
	};
}
function createSolar(product) {
	return {
		powerW: 0,
		capacityKw: PRODUCTS[product].segment === "Residential" ? 12.6 : product.startsWith("C") ? 80 : 0,
		irradiance: .65
	};
}
function createDemand(product) {
	const base = PRODUCTS[product].segment === "Commercial" ? 180 : 8;
	return {
		windowStart: Date.now() - 7 * 6e4,
		averageKw: base * .72,
		peakThresholdKw: base,
		forecastKw: base * .78,
		shedding: false
	};
}
function createEdge() {
	return {
		mcuLoad: 22,
		tpuUtil: 38,
		inferenceMs: 14.2,
		samplesHz: 16e3,
		safetyLoopUs: 180,
		altruisticJobs: 3,
		mode: "NILM"
	};
}
function tickSimulation(input, revenue) {
	const rng = mulberry32(input.tick * 9973 + 42);
	const product = PRODUCTS[input.product];
	const hour = Date.now() / 36e5 % 24;
	const dayFactor = clamp(Math.sin((hour - 6) / 24 * Math.PI * 2) * .5 + .55, .15, 1);
	const solarFactor = clamp(Math.sin((hour - 6) / 12 * Math.PI), 0, 1) * input.solar.irradiance;
	const devices = input.devices.map((d) => {
		let on = d.on;
		if (rng() < .02) on = !on;
		if (input.openAdr.find((e) => e.status === "ACTIVE" && e.optIn) && (d.category === "EV" || d.category === "Thermal" || d.category === "Laundry")) on = false;
		const noise = .9 + rng() * .2;
		const base = NILM_DEVICES.find((x) => x.id === d.id)?.baseW ?? 100;
		const scale = product.segment === "Commercial" ? 4.5 : product.segment === "Data Center" ? 12 : 1;
		const powerW = on ? base * scale * noise * (.7 + dayFactor * .4) : base * scale * .02 * noise;
		const signature = d.harmonicSignature.map((h, i) => clamp(h * .95 + rng() * .1 + (i % 2 === 0 ? .02 : 0), 0, 1));
		return {
			...d,
			on,
			powerW,
			confidence: clamp(d.confidence + (rng() - .5) * .01, .75, .995),
			harmonicSignature: signature
		};
	});
	const activeShed = input.demand.shedding || input.openAdr.some((e) => e.status === "ACTIVE" && e.optIn) || input.battery.soc < 30;
	const breakers = input.breakers.map((b, i) => {
		if (b.status === "OPEN" || b.status === "LOTO" || b.status === "TRIPPED") return {
			...b,
			currentA: 0,
			powerW: 0,
			contactTempC: Math.max(24, b.contactTempC - .05)
		};
		const loadFactor = activeShed && b.shedCapable && !b.critical ? .15 : .55 + dayFactor * .4;
		const categoryMatch = devices.find((d) => d.category === b.category && d.on);
		let powerW = categoryMatch != null ? categoryMatch.powerW * (.4 + i % 3 * .15) : b.ratingA * (product.phases === 3 ? 208 : 120) * .08 * loadFactor * (.7 + rng() * .6);
		if (activeShed && b.shedCapable && !b.critical) powerW *= .2;
		const volts = product.phases === 3 ? input.product === "C2" ? 277 : 120 : 120;
		let currentA = powerW / Math.max(volts, 1);
		let status = b.status;
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
			contactTempC: clamp(b.contactTempC + (status === "CLOSED" ? currentA * .01 : -.08) + (rng() - .5) * .2, 22, 75)
		};
	});
	const totalPowerW = breakers.reduce((s, b) => s + b.powerW, 0);
	const solarPower = input.solar.capacityKw * 1e3 * solarFactor * (.9 + rng() * .1);
	let batteryPower = 0;
	let soc = input.battery.soc;
	const surplus = solarPower - totalPowerW * .3;
	if (input.health.gridMode === "ISLAND" || input.health.gridMode === "FAILOVER") batteryPower = -totalPowerW * .6;
	else if (surplus > 500 && soc < 95) batteryPower = Math.min(surplus * .5, input.battery.capacityKwh * 50);
	else if (hour >= 16 && hour <= 20 && soc > 20) batteryPower = -Math.min(totalPowerW * .25, input.battery.capacityKwh * 40);
	soc = clamp(soc + -batteryPower / (input.battery.capacityKwh * 1e3) * .5, 5, 100);
	const gridPower = totalPowerW - solarPower - batteryPower;
	const reactive = totalPowerW * (.15 + rng() * .08);
	const pf = totalPowerW / Math.sqrt(totalPowerW ** 2 + reactive ** 2 + 1);
	const phases = (product.phases === 3 ? [
		"L1",
		"L2",
		"L3"
	] : ["L1", "L2"]).map((phase, i) => {
		const share = product.phases === 3 ? 1 / 3 : .5;
		const imbalance = 1 + (i - 1) * .04 + (rng() - .5) * .03;
		const powerW = totalPowerW * share * imbalance;
		const voltage = product.phases === 3 ? (input.product === "C2" ? 277 : 120) * (.99 + rng() * .02) : 120 * (.99 + rng() * .02);
		return {
			phase,
			voltage,
			current: powerW / voltage,
			powerW,
			pf: clamp(pf + (rng() - .5) * .02, .85, 1),
			thd: clamp(2.5 + rng() * 2.5 + (activeShed ? 1 : 0), 1, 12)
		};
	});
	const elapsed = (Date.now() - input.demand.windowStart) / 6e4;
	let windowStart = input.demand.windowStart;
	let averageKw = input.demand.averageKw;
	if (elapsed >= 15) {
		windowStart = Date.now();
		averageKw = totalPowerW / 1e3;
	} else averageKw = averageKw * .92 + totalPowerW / 1e3 * .08;
	const forecastKw = averageKw * 1.05 + (rng() - .4) * 2;
	const shedding = forecastKw > input.demand.peakThresholdKw * .92;
	const now = Date.now();
	const openAdr = input.openAdr.map((e) => {
		if (e.status === "COMPLETED" || e.status === "OPTED_OUT") return e;
		if (!e.optIn && e.status === "PENDING") return {
			...e,
			status: "OPTED_OUT"
		};
		const end = e.startAt + e.durationMin * 6e4;
		if (now >= e.startAt && now < end && e.optIn) return {
			...e,
			status: "ACTIVE"
		};
		if (now >= end) return {
			...e,
			status: "COMPLETED"
		};
		return e;
	});
	const mode = activeShed ? "SAFETY" : solarPower > totalPowerW * .5 ? "ALTRUISTIC" : "NILM";
	const edge = {
		mcuLoad: clamp(18 + rng() * 25 + (mode === "SAFETY" ? 20 : 0), 5, 95),
		tpuUtil: clamp(mode === "ALTRUISTIC" ? 70 + rng() * 25 : 25 + rng() * 40, 5, 98),
		inferenceMs: clamp(12 + rng() * 8 + (mode === "SAFETY" ? -4 : 0), 4, 35),
		samplesHz: 16e3,
		safetyLoopUs: clamp(120 + rng() * 100, 80, 400),
		altruisticJobs: mode === "ALTRUISTIC" ? 8 + Math.floor(rng() * 12) : Math.floor(rng() * 4),
		mode
	};
	let gridMode = input.health.gridMode;
	if (rng() < .003) gridMode = "ISLAND";
	else if (gridMode === "ISLAND" && rng() < .08) gridMode = "GRID";
	if (input.product.startsWith("D") && rng() < .002) gridMode = "FAILOVER";
	else if (gridMode === "FAILOVER" && rng() < .1) gridMode = "GRID";
	const tripped = breakers.find((b) => b.status === "TRIPPED");
	const health = {
		...input.health,
		gridMode,
		frequency: clamp(60 + (rng() - .5) * .06 + (gridMode === "ISLAND" ? -.08 : 0), 59.7, 60.3),
		mainsVoltage: product.phases === 3 ? (input.product === "C2" ? 480 : 208) * (.99 + rng() * .02) : 240 * (.99 + rng() * .02),
		totalPowerW,
		totalReactiveVar: reactive,
		powerFactor: pf,
		arcFaultRisk: clamp(.01 + rng() * .04 + (breakers.some((b) => b.contactTempC > 60) ? .1 : 0), 0, 1),
		groundFaultMa: clamp(.8 + rng() * 1.5, .2, 8),
		uptimeSec: input.health.uptimeSec + 1,
		lastTrip: tripped ? `${tripped.label} trip` : input.health.lastTrip
	};
	const sample = {
		t: Date.now(),
		p: totalPowerW,
		q: reactive,
		solar: solarPower,
		battery: batteryPower,
		grid: gridPower
	};
	const history = [...input.history, sample].slice(-90);
	const meshNodes = 4 + Math.floor(rng() * 8) + (gridMode === "ISLAND" ? 3 : 0);
	const vppRevenueUsd = revenue + (openAdr.some((e) => e.status === "ACTIVE") ? .012 : 0) + (batteryPower < -500 ? .008 : 0) + (mode === "ALTRUISTIC" ? .003 : 0);
	return {
		breakers,
		devices,
		battery: {
			...input.battery,
			soc,
			powerW: batteryPower,
			voltage: input.battery.voltage * (.998 + rng() * .004)
		},
		solar: {
			...input.solar,
			powerW: solarPower,
			irradiance: clamp(solarFactor + (rng() - .5) * .05, 0, 1)
		},
		demand: {
			...input.demand,
			windowStart,
			averageKw,
			forecastKw,
			shedding
		},
		openAdr,
		edge,
		health,
		phases,
		history,
		meshNodes,
		vppRevenueUsd
	};
}
var timer = null;
var tickCount = 0;
function bootstrap(product) {
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
		selectedBreakerId: null
	};
}
var useIpcStore = create((set, get) => ({
	...bootstrap("R1+"),
	setView: (view) => set({ view }),
	setProduct: (product) => {
		const prev = get();
		set({
			...bootstrap(product),
			view: prev.view,
			running: prev.running,
			vppRevenueUsd: prev.vppRevenueUsd
		});
	},
	selectBreaker: (id) => set({ selectedBreakerId: id }),
	toggleBreaker: (id) => {
		set((s) => ({ breakers: s.breakers.map((b) => {
			if (b.id !== id) return b;
			if (b.status === "LOTO" || b.status === "TRIPPED") return b;
			const next = b.status === "CLOSED" ? "OPEN" : "CLOSED";
			return {
				...b,
				status: next,
				cycleCount: b.cycleCount + 1,
				currentA: next === "OPEN" ? 0 : b.currentA,
				powerW: next === "OPEN" ? 0 : b.powerW
			};
		}) }));
	},
	tripBreaker: (id, reason) => {
		set((s) => ({
			breakers: s.breakers.map((b) => b.id === id ? {
				...b,
				status: "TRIPPED",
				currentA: 0,
				powerW: 0,
				cycleCount: b.cycleCount + 1
			} : b),
			health: {
				...s.health,
				lastTrip: reason
			}
		}));
	},
	resetBreaker: (id) => {
		set((s) => ({ breakers: s.breakers.map((b) => b.id === id && (b.status === "TRIPPED" || b.status === "OPEN") ? {
			...b,
			status: "CLOSED"
		} : b) }));
	},
	setLoto: (id, loto) => {
		set((s) => ({ breakers: s.breakers.map((b) => {
			if (b.id !== id) return b;
			if (loto) return {
				...b,
				status: "LOTO",
				currentA: 0,
				powerW: 0
			};
			return {
				...b,
				status: "OPEN"
			};
		}) }));
	},
	setOpenAdrOptIn: (id, optIn) => {
		set((s) => ({ openAdr: s.openAdr.map((e) => e.id === id ? {
			...e,
			optIn,
			status: !optIn && e.status === "PENDING" ? "OPTED_OUT" : e.status === "OPTED_OUT" && optIn ? "PENDING" : e.status
		} : e) }));
	},
	simulateBlackout: () => {
		set((s) => ({
			health: {
				...s.health,
				gridMode: "ISLAND"
			},
			breakers: s.breakers.map((b) => b.shedCapable && !b.critical && b.status === "CLOSED" ? {
				...b,
				status: "OPEN",
				powerW: 0,
				currentA: 0,
				cycleCount: b.cycleCount + 1
			} : b)
		}));
	},
	restoreGrid: () => {
		set((s) => ({
			health: {
				...s.health,
				gridMode: "GRID"
			},
			breakers: s.breakers.map((b) => b.status === "OPEN" && !b.critical ? {
				...b,
				status: "CLOSED"
			} : b)
		}));
	},
	triggerDemandEvent: () => {
		const now = Date.now();
		set((s) => ({
			openAdr: [{
				id: `evt-manual-${now}`,
				name: "Manual Demand Response",
				startAt: now,
				durationMin: 15,
				targetReductionKw: 3.5,
				status: "ACTIVE",
				optIn: true
			}, ...s.openAdr],
			demand: {
				...s.demand,
				shedding: true
			}
		}));
	},
	tick: () => {
		const s = get();
		tickCount += 1;
		const out = tickSimulation({
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
			tick: tickCount
		}, s.vppRevenueUsd);
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
			vppRevenueUsd: out.vppRevenueUsd
		});
	},
	start: () => {
		if (timer) return;
		set({ running: true });
		get().tick();
		timer = setInterval(() => get().tick(), 1e3);
	},
	stop: () => {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		set({ running: false });
	}
}));
function getProductSpec(product) {
	return PRODUCTS[product];
}
var badgeVariants = cva("inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase", {
	variants: { variant: {
		default: "bg-surface-3 text-fg-muted",
		primary: "bg-primary-soft text-accent",
		ok: "bg-ok-soft text-ok",
		warn: "bg-warn-soft text-warn",
		danger: "bg-danger-soft text-danger",
		info: "bg-info-soft text-info",
		outline: "border border-border text-fg-muted"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:bg-accent",
			secondary: "bg-surface-2 text-fg border border-border hover:bg-surface-3 hover:border-border-strong",
			outline: "border border-border bg-transparent text-fg hover:bg-surface-2 hover:border-border-strong",
			ghost: "text-fg-muted hover:bg-surface-2 hover:text-fg",
			danger: "bg-danger text-fg hover:bg-danger/90",
			warn: "bg-warn text-primary-fg hover:bg-warn/90"
		},
		size: {
			default: "h-10 px-4 py-2",
			sm: "h-8 rounded-sm px-3 text-xs",
			lg: "h-11 rounded-md px-6",
			icon: "h-10 w-10",
			"icon-sm": "h-8 w-8"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function Separator({ className, orientation = "horizontal", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator$1, {
		orientation,
		className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className),
		...props
	});
}
var NAV = [
	{
		id: "overview",
		label: "Overview",
		icon: LayoutDashboard
	},
	{
		id: "circuits",
		label: "Circuits",
		icon: Power
	},
	{
		id: "nilm",
		label: "NILM Engine",
		icon: Activity
	},
	{
		id: "load",
		label: "Load Mgmt",
		icon: Zap
	},
	{
		id: "vpp",
		label: "VPP / OpenADR",
		icon: Radio
	},
	{
		id: "architecture",
		label: "Architecture",
		icon: GitBranch
	}
];
var PRODUCT_ORDER = [
	"R1",
	"R1+",
	"C1",
	"C2",
	"D1",
	"D2"
];
function AppShell({ children }) {
	const view = useIpcStore((s) => s.view);
	const setView = useIpcStore((s) => s.setView);
	const product = useIpcStore((s) => s.product);
	const setProduct = useIpcStore((s) => s.setProduct);
	const health = useIpcStore((s) => s.health);
	const running = useIpcStore((s) => s.running);
	const start = useIpcStore((s) => s.start);
	const edge = useIpcStore((s) => s.edge);
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const spec = getProductSpec(product);
	(0, import_react.useEffect)(() => {
		start();
	}, [start]);
	const modeBadge = health.gridMode === "GRID" ? {
		variant: "ok",
		label: "Grid Tied"
	} : health.gridMode === "ISLAND" ? {
		variant: "warn",
		label: "Island Mode"
	} : health.gridMode === "FAILOVER" ? {
		variant: "danger",
		label: "Failover"
	} : {
		variant: "info",
		label: health.gridMode
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden w-60 shrink-0 flex-col border-r border-border bg-bg-elevated lg:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 px-4 py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-9 items-center justify-center rounded-md bg-primary-soft text-accent",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold tracking-tight",
								children: "xAI IPC"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-[11px] text-fg-subtle",
								children: "Intelligent Power Core"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex flex-1 flex-col gap-0.5 p-3",
						children: NAV.map((item) => {
							const Icon = item.icon;
							const active = view === item.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setView(item.id),
								className: cn("flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150", active ? "bg-surface-2 text-fg" : "text-fg-muted hover:bg-surface hover:text-fg"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("size-4", active ? "text-accent" : "") }), item.label]
							}, item.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-surface p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-2 text-[10px] font-medium uppercase tracking-wider text-fg-subtle",
									children: "Product Line"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-3 gap-1",
									children: PRODUCT_ORDER.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setProduct(p),
										className: cn("h-8 rounded-sm text-[11px] font-medium transition-colors", product === p ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg-muted hover:text-fg"),
										children: p
									}, p))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 text-[11px] text-fg-muted",
									children: [
										spec.name,
										" · ",
										spec.segment
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-surface p-3 text-[11px] text-fg-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Edge TPU" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular text-fg",
										children: [edge.tpuUtil.toFixed(0), "%"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Inference" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular text-fg",
										children: [edge.inferenceMs.toFixed(1), " ms"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sample rate" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular text-fg",
										children: "16 kHz"
									})]
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-bg/90 px-3 backdrop-blur-md sm:px-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							className: "lg:hidden",
							onClick: () => setMobileOpen(true),
							"aria-label": "Open menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 flex-1 items-center gap-2 sm:gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden items-center gap-2 sm:flex",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "size-4 text-accent" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: spec.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-fg-subtle",
										children: "/"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-fg-muted",
										children: spec.voltage
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium sm:hidden",
								children: NAV.find((n) => n.id === view)?.label
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: modeBadge.variant,
									children: modeBadge.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: running ? "ok" : "default",
									className: "hidden sm:inline-flex",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mr-1.5 inline-block size-1.5 rounded-full", running ? "bg-ok animate-pulse" : "bg-fg-subtle") }), "Live"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "hidden tabular text-sm text-fg md:block",
									children: formatPower(health.totalPowerW)
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 overflow-auto scrollbar-thin p-3 sm:p-5",
					children
				})]
			}),
			mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute inset-0 bg-bg/70",
					"aria-label": "Close menu",
					onClick: () => setMobileOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-y-0 left-0 flex w-72 flex-col border-r border-border bg-bg-elevated shadow-[var(--shadow-elevated)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-4 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "size-5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: "xAI IPC"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon-sm",
								onClick: () => setMobileOpen(false),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "flex flex-col gap-0.5 p-3",
							children: NAV.map((item) => {
								const Icon = item.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setView(item.id);
										setMobileOpen(false);
									},
									className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm", view === item.id ? "bg-surface-2 text-fg" : "text-fg-muted"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
								}, item.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto space-y-2 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-medium uppercase tracking-wider text-fg-subtle",
									children: "Product"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-3 gap-1",
									children: PRODUCT_ORDER.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setProduct(p),
										className: cn("h-9 rounded-sm text-xs font-medium", product === p ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg-muted"),
										children: p
									}, p))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-fg-muted",
									children: Object.values(PRODUCTS).find((x) => x.id === product)?.name
								})
							]
						})
					]
				})]
			})
		]
	});
}
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl border border-border bg-surface text-fg shadow-[var(--shadow-border)]", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1 p-4 pb-2", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: cn("text-sm font-medium tracking-tight text-fg", className),
		...props
	});
}
function CardDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("text-xs text-fg-muted", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("p-4 pt-2", className),
		...props
	});
}
function MetricCard({ label, value, unit, hint, trend, accent, className }) {
	const accentClass = accent === "ok" ? "text-ok" : accent === "warn" ? "text-warn" : accent === "danger" ? "text-danger" : accent === "primary" ? "text-accent" : "text-fg";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: cn("overflow-hidden", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] font-medium uppercase tracking-wider text-fg-subtle",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1.5 flex items-baseline gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("tabular text-2xl font-semibold tracking-tight sm:text-3xl", accentClass),
						children: value
					}), unit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-fg-muted",
						children: unit
					}) : null]
				}),
				hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex items-center gap-1.5 text-xs text-fg-muted",
					children: [
						trend === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-ok",
							children: "▲"
						}),
						trend === "down" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-danger",
							children: "▼"
						}),
						hint
					]
				}) : null
			]
		})
	});
}
function PowerChart() {
	const data = useIpcStore((s) => s.history).map((h) => ({
		t: new Date(h.t).toLocaleTimeString([], {
			minute: "2-digit",
			second: "2-digit"
		}),
		Load: Math.round(h.p) / 1e3,
		Solar: Math.round(h.solar) / 1e3,
		Battery: Math.round(h.battery) / 1e3,
		Grid: Math.round(h.grid) / 1e3
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "col-span-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
			className: "flex-row items-start justify-between gap-2 space-y-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Real-time Power Flow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Load, solar, battery, and grid exchange (kW)" })] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "h-64 sm:h-72",
			children: data.length < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full items-center justify-center text-sm text-fg-muted",
				children: "Collecting samples…"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
					data,
					margin: {
						top: 8,
						right: 8,
						left: 0,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "gLoad",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "#3d9e8f",
									stopOpacity: .35
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "#3d9e8f",
									stopOpacity: 0
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "gSolar",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "#c9a227",
									stopOpacity: .3
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "#c9a227",
									stopOpacity: 0
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "gBatt",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "#5b8def",
									stopOpacity: .3
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "#5b8def",
									stopOpacity: 0
								})]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							stroke: "rgba(255,255,255,0.04)",
							vertical: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "t",
							tick: {
								fill: "#5c6370",
								fontSize: 11
							},
							axisLine: false,
							tickLine: false,
							minTickGap: 32
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							tick: {
								fill: "#5c6370",
								fontSize: 11
							},
							axisLine: false,
							tickLine: false,
							width: 40,
							unit: "k"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							contentStyle: {
								background: "#14171c",
								border: "1px solid #252a33",
								borderRadius: 8,
								fontSize: 12
							},
							labelStyle: { color: "#8b929e" }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
							wrapperStyle: {
								fontSize: 12,
								color: "#8b929e"
							},
							iconType: "circle",
							iconSize: 8
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							type: "monotone",
							dataKey: "Load",
							stroke: "#3d9e8f",
							fill: "url(#gLoad)",
							strokeWidth: 1.5,
							isAnimationActive: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							type: "monotone",
							dataKey: "Solar",
							stroke: "#c9a227",
							fill: "url(#gSolar)",
							strokeWidth: 1.5,
							isAnimationActive: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							type: "monotone",
							dataKey: "Battery",
							stroke: "#5b8def",
							fill: "url(#gBatt)",
							strokeWidth: 1.5,
							isAnimationActive: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							type: "monotone",
							dataKey: "Grid",
							stroke: "#8b7cf0",
							fill: "transparent",
							strokeWidth: 1.25,
							strokeDasharray: "4 3",
							isAnimationActive: false
						})
					]
				})
			})
		})]
	});
}
function Overview() {
	const health = useIpcStore((s) => s.health);
	const phases = useIpcStore((s) => s.phases);
	const battery = useIpcStore((s) => s.battery);
	const solar = useIpcStore((s) => s.solar);
	const edge = useIpcStore((s) => s.edge);
	const breakers = useIpcStore((s) => s.breakers);
	const product = useIpcStore((s) => s.product);
	const meshNodes = useIpcStore((s) => s.meshNodes);
	const simulateBlackout = useIpcStore((s) => s.simulateBlackout);
	const restoreGrid = useIpcStore((s) => s.restoreGrid);
	const triggerDemandEvent = useIpcStore((s) => s.triggerDemandEvent);
	const setView = useIpcStore((s) => s.setView);
	const spec = getProductSpec(product);
	const closed = breakers.filter((b) => b.status === "CLOSED").length;
	const tripped = breakers.filter((b) => b.status === "TRIPPED").length;
	const pf = health.powerFactor;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-7xl flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight sm:text-2xl",
					children: "Panel Overview"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-fg-muted",
					children: [
						spec.name,
						" · ",
						spec.voltage,
						" · ",
						spec.maxAmps,
						"A service · ",
						breakers.length,
						" branches"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						size: "sm",
						onClick: triggerDemandEvent,
						children: "Fire DR Event"
					}), health.gridMode === "GRID" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "warn",
						size: "sm",
						onClick: simulateBlackout,
						children: "Simulate Blackout"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "default",
						size: "sm",
						onClick: restoreGrid,
						children: "Restore Grid"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						label: "Facility Load",
						value: formatKw(health.totalPowerW),
						unit: "kW",
						hint: `PF ${pf.toFixed(3)} · ${formatPower(health.totalReactiveVar)} VAR`,
						accent: "primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						label: "Grid Exchange",
						value: formatKw(health.totalPowerW - solar.powerW - battery.powerW),
						unit: "kW",
						hint: health.gridMode === "GRID" ? "Import / export" : "Islanded",
						accent: health.gridMode === "GRID" ? "default" : "warn"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						label: "Solar Production",
						value: formatKw(solar.powerW),
						unit: "kW",
						hint: `${formatPct(solar.irradiance * 100)} irradiance`,
						accent: "warn"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						label: "Battery SoC",
						value: formatPct(battery.soc, 1),
						hint: `${battery.powerW >= 0 ? "Charging" : "Discharging"} ${formatPower(Math.abs(battery.powerW))}`,
						accent: battery.soc < 30 ? "danger" : battery.soc > 70 ? "ok" : "default"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PowerChart, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Phase Metrics" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
						"Simultaneous sampling · ADS131M08 · 24-bit · ",
						edge.samplesHz / 1e3,
						" kHz"
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: [phases.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-surface-2 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-fg-muted",
									children: p.phase
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 rounded-full", p.phase === "L1" ? "bg-phase-a" : p.phase === "L2" ? "bg-phase-b" : "bg-phase-c") })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-fg-muted",
											children: "Voltage"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular",
											children: formatV(p.voltage)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-fg-muted",
											children: "Current"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular",
											children: formatA(p.current)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-fg-muted",
											children: "Power"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular",
											children: formatPower(p.powerW)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-fg-muted",
											children: "THD"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "tabular",
											children: [p.thd.toFixed(1), "%"]
										})]
									})
								]
							})]
						}, p.phase)), phases.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-full py-8 text-center text-sm text-fg-muted",
							children: "Waiting for phase telemetry…"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								icon: Waves,
								label: "Frequency",
								value: `${health.frequency.toFixed(3)} Hz`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								icon: Shield,
								label: "Arc risk",
								value: formatPct(health.arcFaultRisk * 100, 1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								icon: Thermometer,
								label: "GF current",
								value: `${health.groundFaultMa.toFixed(1)} mA`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								icon: Cpu,
								label: "Edge mode",
								value: edge.mode
							})
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "System Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Safety loop · mesh · breakers" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg border border-border bg-surface-2 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4 text-warn" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: "Solar bus"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular text-sm",
								children: [formatKw(solar.powerW), " kW"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg border border-border bg-surface-2 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Battery, { className: "size-4 text-info" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: "Battery"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular text-sm",
								children: [
									formatPct(battery.soc, 0),
									" · ",
									battery.capacityKwh,
									" kWh"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
									label: "Breakers closed",
									value: `${closed} / ${breakers.length}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
									label: "Tripped",
									value: String(tripped),
									danger: tripped > 0
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
									label: "Mesh nodes",
									value: String(meshNodes)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
									label: "Safety loop",
									value: `${edge.safetyLoopUs.toFixed(0)} µs`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
									label: "MCU load",
									value: `${edge.mcuLoad.toFixed(0)}%`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
									label: "Uptime",
									value: `${Math.floor(health.uptimeSec / 86400)}d ${Math.floor(health.uptimeSec % 86400 / 3600)}h`
								})
							]
						}),
						health.lastTrip && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-danger/30 bg-danger-soft px-3 py-2 text-xs text-danger",
							children: ["Last trip: ", health.lastTrip]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: spec.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: f
							}, f))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							className: "w-full",
							onClick: () => setView("circuits"),
							children: "Open Circuit Panel"
						})
					]
				})] })]
			})
		]
	});
}
function Stat({ icon: Icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border bg-bg-elevated px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5 text-[11px] text-fg-subtle",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3" }), label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-0.5 tabular text-sm font-medium",
			children: value
		})]
	});
}
function Row$1({ label, value, danger }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-fg-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("tabular font-medium", danger ? "text-danger" : "text-fg"),
			children: value
		})]
	});
}
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 data-[state=checked]:bg-primary data-[state=unchecked]:bg-surface-3 disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block size-5 rounded-full bg-fg shadow-sm transition-transform duration-150 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5") })
	});
}
function BreakerGrid() {
	const breakers = useIpcStore((s) => s.breakers);
	const selectedId = useIpcStore((s) => s.selectedBreakerId);
	const selectBreaker = useIpcStore((s) => s.selectBreaker);
	const toggleBreaker = useIpcStore((s) => s.toggleBreaker);
	const tripBreaker = useIpcStore((s) => s.tripBreaker);
	const resetBreaker = useIpcStore((s) => s.resetBreaker);
	const setLoto = useIpcStore((s) => s.setLoto);
	const selected = breakers.find((b) => b.id === selectedId) ?? breakers[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-7xl flex-col gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl font-semibold tracking-tight sm:text-2xl",
			children: "Circuit Panel"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-fg-muted",
			children: "Hybrid SSR + motorized breakers · zero-cross switching · fail-safe thermal-magnetic backup"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Branch Actuators" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Tap a pole to inspect · toggle for remote open/close" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4",
					children: breakers.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreakerTile, {
						breaker: b,
						selected: selected?.id === b.id,
						onSelect: () => selectBreaker(b.id),
						onToggle: () => toggleBreaker(b.id)
					}, b.id))
				}) })]
			}), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: selected.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
					"Pole ",
					selected.pole,
					" · ",
					selected.ratingA,
					"A · ",
					selected.category
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: selected.status })]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Current",
								value: formatA(selected.currentA)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Power",
								value: formatPower(selected.powerW)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Contact temp",
								value: `${selected.contactTempC.toFixed(1)} °C`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Cycles",
								value: selected.cycleCount.toLocaleString()
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 rounded-lg border border-border bg-surface-2 p-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg-muted",
									children: "Critical circuit"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selected.critical ? "Yes" : "No" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg-muted",
									children: "Shed-capable"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selected.shedCapable ? "Yes" : "No" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg-muted",
									children: "Load share"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular",
									children: selected.ratingA > 0 ? `${(selected.currentA / selected.ratingA * 100).toFixed(0)}%` : "—"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 overflow-hidden rounded-full bg-surface-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("h-full rounded-full transition-all duration-300", selected.currentA / selected.ratingA > .9 ? "bg-danger" : selected.currentA / selected.ratingA > .7 ? "bg-warn" : "bg-primary"),
							style: { width: `${Math.min(100, selected.currentA / selected.ratingA * 100)}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-md border border-border px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: "Remote close"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: selected.status === "CLOSED",
									disabled: selected.status === "LOTO" || selected.status === "TRIPPED",
									onCheckedChange: () => toggleBreaker(selected.id)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								size: "sm",
								disabled: selected.status === "LOTO",
								onClick: () => selected.status === "TRIPPED" ? resetBreaker(selected.id) : tripBreaker(selected.id, `${selected.label} manual trip`),
								children: selected.status === "TRIPPED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), " Reset trip"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3.5" }), " Software trip"] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: selected.status === "LOTO" ? "default" : "outline",
								size: "sm",
								onClick: () => setLoto(selected.id, selected.status !== "LOTO"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5" }), selected.status === "LOTO" ? "Release LOTO" : "Engage LOTO"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] leading-relaxed text-fg-subtle",
						children: "Mechanical latch remains independent of firmware. LOTO overrides all software signals for lockout/tagout compliance. SSR handles zero-cross; motorized MCB provides isolation in 50–80 ms."
					})
				]
			})] })]
		})]
	});
}
function BreakerTile({ breaker, selected, onSelect, onToggle }) {
	const load = breaker.ratingA > 0 ? breaker.currentA / breaker.ratingA : 0;
	const canToggle = breaker.status !== "LOTO" && breaker.status !== "TRIPPED";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "button",
		tabIndex: 0,
		onClick: onSelect,
		onKeyDown: (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onSelect();
			}
		},
		className: cn("group relative flex flex-col rounded-lg border p-2.5 text-left transition-colors duration-150", selected ? "border-primary/50 bg-primary-soft/40" : "border-border bg-surface-2 hover:border-border-strong hover:bg-surface-3", breaker.status === "TRIPPED" && "glow-danger", breaker.status === "LOTO" && "opacity-80"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-center justify-between gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] text-fg-subtle",
					children: String(breaker.pole).padStart(2, "0")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 rounded-full", breaker.status === "CLOSED" && "bg-ok", breaker.status === "OPEN" && "bg-fg-subtle", breaker.status === "TRIPPED" && "bg-danger animate-pulse", breaker.status === "LOTO" && "bg-warn") })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "line-clamp-2 min-h-8 text-xs font-medium leading-snug",
				children: breaker.label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "tabular text-sm font-semibold",
					children: formatPower(breaker.powerW)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "tabular text-[10px] text-fg-muted",
					children: formatA(breaker.currentA)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: (e) => {
						e.stopPropagation();
						if (canToggle) onToggle();
					},
					disabled: !canToggle,
					className: cn("flex size-8 items-center justify-center rounded-md border transition-colors", breaker.status === "CLOSED" ? "border-ok/40 bg-ok-soft text-ok" : "border-border bg-surface text-fg-muted", !canToggle && "opacity-50"),
					"aria-label": `Toggle ${breaker.label}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "size-3.5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 h-1 overflow-hidden rounded-full bg-bg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("h-full rounded-full", load > .9 ? "bg-danger" : load > .7 ? "bg-warn" : "bg-primary"),
					style: { width: `${Math.min(100, load * 100)}%` }
				})
			})
		]
	});
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: {
			CLOSED: "ok",
			OPEN: "default",
			TRIPPED: "danger",
			LOTO: "warn"
		}[status],
		children: status
	});
}
function Info({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border bg-bg-elevated px-2.5 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] uppercase tracking-wider text-fg-subtle",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "tabular text-sm font-medium",
			children: value
		})]
	});
}
var COLORS = [
	"#3d9e8f",
	"#5b8def",
	"#c9a227",
	"#d4544a",
	"#8b7cf0",
	"#5eb8a8",
	"#a78bfa",
	"#f59e0b"
];
function NilmPanel() {
	const devices = useIpcStore((s) => s.devices);
	const edge = useIpcStore((s) => s.edge);
	const total = devices.reduce((s, d) => s + d.powerW, 0);
	const sorted = [...devices].sort((a, b) => b.powerW - a.powerW);
	const harmonicAvg = devices[0]?.harmonicSignature.map((_, i) => ({
		k: i === 0 ? "1" : String(i % 2 === 0 ? i : i * 2 + 1),
		mag: devices.reduce((s, d) => s + d.harmonicSignature[i], 0) / devices.length
	})) ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-7xl flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold tracking-tight sm:text-2xl",
				children: "NILM Engine"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-fg-muted",
				children: "Non-intrusive load monitoring · 1D CNN + Bi-LSTM Seq2Seq · Edge TPU int8 inference"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] uppercase tracking-wider text-fg-subtle",
								children: "Disaggregated"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 tabular text-2xl font-semibold text-accent",
								children: formatPower(total)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-fg-muted",
								children: [devices.filter((d) => d.on).length, " active signatures"]
							})
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] uppercase tracking-wider text-fg-subtle",
								children: "Inference latency"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 tabular text-2xl font-semibold",
								children: [edge.inferenceMs.toFixed(1), " ms"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-fg-muted",
								children: "Target under 20 ms on Coral TPU"
							})
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] uppercase tracking-wider text-fg-subtle",
								children: "TPU mode"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-2xl font-semibold",
								children: edge.mode
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-fg-muted",
								children: edge.mode === "ALTRUISTIC" ? `${edge.altruisticJobs} public-good jobs` : edge.mode === "SAFETY" ? "AFCI FFT priority" : "Device state decode"
							})
						]
					}) })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Device Power Map" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "V-I trajectory + harmonic fingerprints → device states" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "space-y-2",
						children: sorted.map((d, i) => {
							const pct = total > 0 ? d.powerW / total * 100 : 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border bg-surface-2 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-1.5 flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex min-w-0 items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "size-2 shrink-0 rounded-full",
													style: { background: COLORS[i % COLORS.length] }
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate text-sm font-medium",
													children: d.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: d.on ? "ok" : "default",
													children: d.on ? "ON" : "OFF"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "shrink-0 text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "tabular text-sm font-semibold",
												children: formatPower(d.powerW)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "tabular text-[10px] text-fg-muted",
												children: [
													"conf ",
													(d.confidence * 100).toFixed(1),
													"%"
												]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-1.5 overflow-hidden rounded-full bg-bg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full rounded-full transition-all duration-500",
											style: {
												width: `${Math.max(d.on ? 2 : 0, pct)}%`,
												background: COLORS[i % COLORS.length]
											}
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 flex gap-0.5",
										children: d.harmonicSignature.slice(0, 10).map((h, hi) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex-1 rounded-sm bg-primary/20",
											style: {
												height: 4 + h * 16,
												opacity: .4 + h * .6
											},
											title: `H${hi + 1}: ${h.toFixed(2)}`
										}, hi))
									})
								]
							}, d.id);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Harmonic Spectrum" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Average odd/even harmonic magnitudes" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "h-72",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: harmonicAvg,
									margin: {
										top: 4,
										right: 4,
										left: -20,
										bottom: 0
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "k",
											tick: {
												fill: "#5c6370",
												fontSize: 11
											},
											axisLine: false,
											tickLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											tick: {
												fill: "#5c6370",
												fontSize: 11
											},
											axisLine: false,
											tickLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
											background: "#14171c",
											border: "1px solid #252a33",
											borderRadius: 8,
											fontSize: 12
										} }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "mag",
											radius: [
												4,
												4,
												0,
												0
											],
											isAnimationActive: false,
											children: harmonicAvg.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
												fill: COLORS[i % COLORS.length],
												fillOpacity: .85
											}, i))
										})
									]
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "border-t border-border pt-3 text-xs leading-relaxed text-fg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Feature pipeline: windowed V/I → FFT harmonics (k=2…49) → ΔP/ΔQ event features → Edge TPU 1D-CNN + Bi-LSTM decoder. Models quantized float32→int8 via Edge TPU compiler." })
						})
					]
				})]
			})
		]
	});
}
function LoadPanel() {
	const demand = useIpcStore((s) => s.demand);
	const battery = useIpcStore((s) => s.battery);
	const solar = useIpcStore((s) => s.solar);
	const health = useIpcStore((s) => s.health);
	const breakers = useIpcStore((s) => s.breakers);
	const product = useIpcStore((s) => s.product);
	const simulateBlackout = useIpcStore((s) => s.simulateBlackout);
	const restoreGrid = useIpcStore((s) => s.restoreGrid);
	const triggerDemandEvent = useIpcStore((s) => s.triggerDemandEvent);
	const toggleBreaker = useIpcStore((s) => s.toggleBreaker);
	const spec = getProductSpec(product);
	const windowElapsed = Math.min(15, (Date.now() - demand.windowStart) / 6e4);
	const shedBreakers = breakers.filter((b) => b.shedCapable && !b.critical);
	const headroom = demand.peakThresholdKw - demand.forecastKw;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-7xl flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight sm:text-2xl",
					children: "Predictive Load Management"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg-muted",
					children: "GBRT load forecasts · ToU pre-cool · virtual subpanels · ALMS (NEC 220.70)"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						size: "sm",
						onClick: triggerDemandEvent,
						children: "Cap Demand Window"
					}), health.gridMode === "GRID" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "warn",
						size: "sm",
						onClick: simulateBlackout,
						children: "Island / Blackout"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: restoreGrid,
						children: "Restore Mains"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] uppercase tracking-wider text-fg-subtle",
								children: "15-min average"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 tabular text-2xl font-semibold",
								children: demand.averageKw.toFixed(2)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-fg-muted",
								children: [
									"kW · window ",
									windowElapsed.toFixed(1),
									" / 15 min"
								]
							})
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] uppercase tracking-wider text-fg-subtle",
								children: "Forecast peak"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("mt-1 tabular text-2xl font-semibold", demand.shedding ? "text-warn" : "text-fg"),
								children: demand.forecastKw.toFixed(2)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-fg-muted",
								children: [
									"Threshold ",
									demand.peakThresholdKw.toFixed(0),
									" kW"
								]
							})
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] uppercase tracking-wider text-fg-subtle",
								children: "Headroom"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("mt-1 tabular text-2xl font-semibold", headroom < 0 ? "text-danger" : "text-ok"),
								children: headroom.toFixed(2)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-fg-muted",
								children: "kW before demand charge"
							})
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] uppercase tracking-wider text-fg-subtle",
								children: "Shedding"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-2xl font-semibold",
								children: demand.shedding || health.gridMode !== "GRID" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "warn",
									children: "Active"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "ok",
									children: "Idle"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs text-fg-muted",
								children: spec.segment === "Commercial" ? "Peak demand shave" : "Virtual subpanel"
							})
						]
					}) })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Demand Window Tracker" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Commercial utilities bill the highest 15-minute average. IPC forecasts the window and sheds non-critical load before the threshold." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex justify-between text-xs text-fg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "0 kW" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Threshold ",
						demand.peakThresholdKw.toFixed(0),
						" kW"
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-4 overflow-hidden rounded-full bg-surface-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("absolute inset-y-0 left-0 rounded-full transition-all duration-500", demand.forecastKw > demand.peakThresholdKw * .92 ? "bg-warn" : "bg-primary"),
						style: { width: `${Math.min(100, demand.forecastKw / demand.peakThresholdKw * 100)}%` }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-y-0 w-0.5 bg-danger",
						style: { left: "92%" },
						title: "Shed trigger"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
							label: "Facility load",
							value: `${formatKw(health.totalPowerW)} kW`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
							label: "Solar offset",
							value: `${formatKw(solar.powerW)} kW`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
							label: "Battery",
							value: `${formatPct(battery.soc, 0)} · ${battery.powerW >= 0 ? "+" : ""}${formatKw(battery.powerW)} kW`
						})
					]
				})
			] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Virtual Subpanel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "On blackout or low SoC (under 30%), shed-capable branches open automatically — no rewiring" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-2",
					children: shedBreakers.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-md border border-border bg-surface-2 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm font-medium",
								children: b.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-fg-muted",
								children: [
									b.ratingA,
									"A · ",
									formatPower(b.powerW)
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: b.status === "CLOSED" ? "ok" : b.status === "OPEN" ? "default" : "danger",
								children: b.status
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								disabled: b.status === "LOTO" || b.status === "TRIPPED",
								onClick: () => toggleBreaker(b.id),
								children: "Toggle"
							})]
						})]
					}, b.id))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Pre-cool / Smart Throttle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Thermodynamic + ToU optimizer on the NPU" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Strategy, {
							title: "Thermal pre-cool",
							body: "Shifts HVAC run-time ahead of peak ToU windows using weather + occupancy forecasts.",
							status: "Armed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Strategy, {
							title: "EV charger PWM",
							body: "Matter / Home Assistant API modulates EVSE current to hold panel under ALMS limit.",
							status: demand.shedding ? "Throttling" : "Standby"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Strategy, {
							title: "Water heater delay",
							body: "Defers resistive DHW during OpenADR events and high LMP price intervals.",
							status: health.gridMode !== "GRID" ? "Shed" : "Standby"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Strategy, {
							title: "Generator soft-start",
							body: "Sequences branch close on genset restore to prevent inrush stall.",
							status: health.gridMode === "GENERATOR" ? "Sequencing" : "Ready"
						}),
						battery.soc < 30 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-md border border-warn/30 bg-warn-soft px-3 py-2 text-xs text-warn",
							children: "Battery SoC below 30% — high-draw shed loads are being dropped per virtual subpanel policy."
						})
					]
				})] })]
			})
		]
	});
}
function Mini({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border bg-bg-elevated px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] uppercase tracking-wider text-fg-subtle",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "tabular text-sm font-medium",
			children: value
		})]
	});
}
function Strategy({ title, body, status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface-2 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1 flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: status === "Standby" || status === "Ready" || status === "Armed" ? "primary" : "warn",
				children: status
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs leading-relaxed text-fg-muted",
			children: body
		})]
	});
}
function VppPanel() {
	const openAdr = useIpcStore((s) => s.openAdr);
	const vppRevenueUsd = useIpcStore((s) => s.vppRevenueUsd);
	const battery = useIpcStore((s) => s.battery);
	const health = useIpcStore((s) => s.health);
	const meshNodes = useIpcStore((s) => s.meshNodes);
	const edge = useIpcStore((s) => s.edge);
	const setOpenAdrOptIn = useIpcStore((s) => s.setOpenAdrOptIn);
	const triggerDemandEvent = useIpcStore((s) => s.triggerDemandEvent);
	const freqDroop = -12 * (health.frequency - 60);
	const active = openAdr.filter((e) => e.status === "ACTIVE");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-7xl flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight sm:text-2xl",
					children: "VPP & OpenADR"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg-muted",
					children: "Virtual End Node (VEN) · OpenADR 2.0b · frequency droop · wholesale LMP arbitrage"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: triggerDemandEvent,
					children: "Inject DR Event"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] uppercase tracking-wider text-fg-subtle",
								children: "VPP revenue (sim)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 tabular text-2xl font-semibold text-accent",
								children: ["$", vppRevenueUsd.toFixed(2)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-fg-muted",
								children: "Session cumulative"
							})
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] uppercase tracking-wider text-fg-subtle",
								children: "Freq droop ΔP"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 tabular text-2xl font-semibold",
								children: freqDroop.toFixed(2)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-fg-muted",
								children: [
									"kW · f=",
									health.frequency.toFixed(3),
									" Hz"
								]
							})
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] uppercase tracking-wider text-fg-subtle",
								children: "Mesh peers"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 tabular text-2xl font-semibold",
								children: meshNodes
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-fg-muted",
								children: "5G mmWave / mTLS"
							})
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] uppercase tracking-wider text-fg-subtle",
								children: "Active events"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 tabular text-2xl font-semibold",
								children: active.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-fg-muted",
								children: "OpenADR opt-in"
							})
						]
					}) })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "OpenADR Event Queue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "VTN → oadrDistributeEvent · local constraint check · oadrCreatedEvent opt-in/out" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "space-y-3",
						children: openAdr.map((e) => {
							const start = new Date(e.startAt);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("rounded-xl border p-4", e.status === "ACTIVE" ? "border-primary/40 bg-primary-soft/30" : "border-border bg-surface-2"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-medium",
											children: e.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-0.5 text-xs text-fg-muted",
											children: [
												start.toLocaleString(),
												" · ",
												e.durationMin,
												" min · target",
												" ",
												e.targetReductionKw > 0 ? "−" : "+",
												Math.abs(e.targetReductionKw).toFixed(1),
												" kW"
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: e.status === "ACTIVE" ? "ok" : e.status === "PENDING" ? "info" : e.status === "OPTED_OUT" ? "default" : "primary",
											children: e.status.replace("_", " ")
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-fg-muted",
											children: "Opt-in as VEN"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											checked: e.optIn,
											disabled: e.status === "COMPLETED" || e.status === "ACTIVE",
											onCheckedChange: (v) => setOpenAdrOptIn(e.id, v)
										})]
									}),
									e.status === "ACTIVE" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 rounded-md border border-border bg-bg-elevated px-3 py-2 text-xs text-fg-muted",
										children: "Operational phase: PWM solar/storage · EV current limit · non-essential SSR open. Telemetry every 10s via oadrReportDistribute (P/Q)."
									})
								]
							}, e.id);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Local VPP Simulator" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Frequency response & LMP arbitrage loops" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border bg-surface-2 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-medium text-fg-muted",
										children: "Droop equation"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 font-mono text-sm text-accent",
										children: "ΔP = −f_droop · (f − f_nom)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 tabular text-xs text-fg-muted",
										children: [
											"f_droop = 12 kW/Hz · ΔP = ",
											freqDroop.toFixed(3),
											" kW"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: "Battery SoC",
										value: `${battery.soc.toFixed(1)}%`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: "Battery power",
										value: `${battery.powerW >= 0 ? "+" : ""}${formatPower(battery.powerW)}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: "Grid mode",
										value: health.gridMode
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: "Edge mode",
										value: edge.mode
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: "Altruistic jobs",
										value: String(edge.altruisticJobs)
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border bg-bg-elevated p-3 text-xs leading-relaxed text-fg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 font-medium text-fg",
									children: "Event telemetry flow"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
									className: "list-decimal space-y-1 pl-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "VTN distributes event metadata & power target" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "IPC checks occupancy, SoC, critical circuits" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "VEN replies opt-in / opt-out" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "SSR + PWM execute during interval" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "P/Q reported every 10 seconds" })
									]
								})]
							})
						]
					})]
				})]
			})
		]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-fg-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular font-medium",
			children: value
		})]
	});
}
function ArchitecturePanel() {
	const product = useIpcStore((s) => s.product);
	const edge = useIpcStore((s) => s.edge);
	const health = useIpcStore((s) => s.health);
	const meshNodes = useIpcStore((s) => s.meshNodes);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-7xl flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold tracking-tight sm:text-2xl",
				children: "System Architecture"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-fg-muted",
				children: "Hardware topology · software modules · product line matrix from the IPC white paper"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Physical Layer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Mains sensing → Analog front end → Edge MCU / Coral TPU → Hybrid actuation" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "panel-grid overflow-x-auto rounded-xl border border-border bg-bg-elevated p-4 sm:p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex min-w-[640px] flex-col items-center gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full items-center justify-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, {
									title: "Mains Power",
									sub: "Utility feed",
									tone: "warn"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, {
									title: "Revenue CT/PT",
									sub: "0.2% class",
									tone: "info"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, {
									title: "Mains Actuator",
									sub: "MCCB / Contactor",
									tone: "danger"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-px bg-border-strong" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full items-center justify-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, {
									title: "ADS131M08",
									sub: "24-bit ΔΣ · 16–50 kHz",
									tone: "primary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, {
									title: "STM32H7 MCU",
									sub: `${edge.mcuLoad.toFixed(0)}% · ${edge.safetyLoopUs.toFixed(0)} µs loop`,
									tone: "primary",
									active: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, {
									title: "Coral Edge TPU",
									sub: `${edge.tpuUtil.toFixed(0)}% · ${edge.mode}`,
									tone: "ok",
									active: true
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-px bg-border-strong" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full items-center justify-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, {
									title: "Branch CT Matrix",
									sub: "Per-circuit sensing",
									tone: "info"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, {
									title: "SSR + Motor Breaker",
									sub: "under 1 ms / 50–80 ms",
									tone: "warn"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, {
									title: "Branch Loads",
									sub: health.gridMode,
									tone: "default"
								})
							]
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-2 text-xs text-fg-muted sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-fg",
						children: "Fail-safe:"
					}), " thermal-magnetic trip remains independent of MCU power."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-fg",
						children: "Comms:"
					}), " dual GbE (PTP 1588), Wi-Fi 6E WPA3, private LTE/5G, RS-485 / BACnet."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-fg",
							children: "Mesh:"
						}),
						" ",
						meshNodes,
						" peers on mmWave / mTLS for microgrid islanding."
					] })
				]
			})] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Software Modules" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Mapped from IPC design layout — simulated edge stack" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Module, {
						path: "src/core/",
						items: [
							"CoreController",
							"NILMEngine",
							"MotorizedBreaker"
						],
						desc: "Realtime loop, safety Class 10/20, FFT + TPU inference"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Module, {
						path: "src/models/residential/",
						items: [
							"ResidentialIPC",
							"MatterController",
							"HA Bridge"
						],
						desc: "EV PWM, solar bus, Matter / Home Assistant"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Module, {
						path: "src/models/commercial/",
						items: [
							"CommercialIPC",
							"PhaseBalancer",
							"BmsGateway"
						],
						desc: "15-min peak shave, BACnet/IP, Modbus TCP"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Module, {
						path: "src/models/datacenter/",
						items: ["DataCenterIPC", "RedundancyManager"],
						desc: "Sub-ms STS failover, HVDC arc suppression"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Module, {
						path: "src/mesh_network/",
						items: ["MeshNetworkManager"],
						desc: "mTLS tunnels, private 5G, mmWave diagnostics"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Module, {
						path: "src/api/",
						items: [
							"ApiGateway",
							"OpenAdrVEN",
							"VppSimulator"
						],
						desc: "Dashboard WS, OpenADR 2.0b VEN, droop sim"
					})
				]
			}) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Product Line Matrix" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Select a model from the sidebar to reconfigure the live demo" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
				children: Object.values(PRODUCTS).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("rounded-xl border p-4 transition-colors", product === p.id ? "border-primary/50 bg-primary-soft/25" : "border-border bg-surface-2"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: product === p.id ? "primary" : "outline",
								children: p.segment
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 space-y-1 text-xs text-fg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: p.voltage }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								p.maxAmps,
								"A · up to ",
								p.maxBranches,
								" branches ·",
								" ",
								p.phases === 3 ? "3-phase" : "split-phase"
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: p.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "default",
								children: f
							}, f))
						})
					]
				}, p.id))
			}) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Compliance Snapshot" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compliance, {
						title: "UL 67",
						body: "Panelboards — busbar spacing, SCCR up to 65 kA, enclosure strength"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compliance, {
						title: "UL 916",
						body: "Energy management — algorithms cannot override thermal safety"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compliance, {
						title: "UL 1699",
						body: "AFCI — series/parallel arc detect under 100 ms at 2.5 A"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compliance, {
						title: "NEC 705",
						body: "Interconnected sources — 120% busbar rule for solar/storage"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compliance, {
						title: "NEC 220.70",
						body: "ALMS — dynamic EV/appliance limits without service upgrade"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compliance, {
						title: "OpenADR 2.0b",
						body: "Containerized VEN client on the communications module"
					})
				]
			}) })] })
		]
	});
}
function Node({ title, sub, tone, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("min-w-[140px] rounded-lg border bg-surface px-3 py-2.5 text-center shadow-[var(--shadow-border)]", tone === "primary" ? "border-primary/40" : tone === "ok" ? "border-ok/40" : tone === "warn" ? "border-warn/40" : tone === "danger" ? "border-danger/40" : tone === "info" ? "border-info/40" : "border-border", active && "glow-ok"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs font-semibold",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-0.5 text-[10px] text-fg-muted",
			children: sub
		})]
	});
}
function Arrow() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px w-8 shrink-0 bg-border-strong sm:w-12" });
}
function Module({ path, items, desc }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface-2 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-mono text-[11px] text-accent",
				children: path
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-1",
				children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					children: i
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-fg-muted",
				children: desc
			})
		]
	});
}
function Compliance({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface-2 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-medium",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs leading-relaxed text-fg-muted",
			children: body
		})]
	});
}
function Home() {
	const view = useIpcStore((s) => s.view);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		view === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overview, {}),
		view === "circuits" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreakerGrid, {}),
		view === "nilm" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NilmPanel, {}),
		view === "load" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadPanel, {}),
		view === "vpp" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VppPanel, {}),
		view === "architecture" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArchitecturePanel, {})
	] });
}
//#endregion
export { Home as component };
