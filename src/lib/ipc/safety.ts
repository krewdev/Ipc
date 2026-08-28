/** Safety + commissioning constants from technical_manual.md and safety_spec.md */

export const TORQUE_TABLE = [
  { terminal: "Main feed lugs (Al/Cu)", gauge: "4/0 – 250 kcmil", inLbs: 250, nm: 28.2 },
  { terminal: "Neutral bar", gauge: "4 AWG – 1/0", inLbs: 50, nm: 5.6 },
  { terminal: "Ground bar", gauge: "14 AWG – 4 AWG", inLbs: 35, nm: 4.0 },
  { terminal: "Smart module output", gauge: "14 AWG – 8 AWG", inLbs: 40, nm: 4.5 },
] as const;

export const INSTALL_CLEARANCES = [
  { item: "Front working clearance", value: "36 in" },
  { item: "Above / below heatsink airflow", value: "6 in min" },
  { item: "Stud OC keyholes", value: "16 in / 24 in" },
  { item: "Conduit", value: "Top / bottom / bottom-rear only — never side fins" },
] as const;

export const SAFETY_THRESH = {
  bimetalTripC: 85,
  bimetalResetC: 45,
  contactAlarmC: 95,
  shortMult: 8,
  gateUs: 10,
  afciThdPct: 35,
  afciConfPct: 80,
  pollHz: 100,
  rElementOhm: 0.0035,
  coolK: 0.08,
  ambientC: 25,
} as const;

export const FAULT_CATALOG = [
  {
    code: "E011",
    sub: "01",
    type: "Thermal Overload",
    condition: "Firmware bimetallic model T > 85 °C",
    action: "Cool below 45 °C before reset. Recheck load calc.",
  },
  {
    code: "E011",
    sub: "02",
    type: "Contact Temp High",
    condition: "Hardware thermistor T > 95 °C",
    action: "Loose lug. Re-torque to spec.",
  },
  {
    code: "E022",
    sub: "01",
    type: "AFCI Arc Fault",
    condition: "THD > 35% AND inference conf ≥ 80%",
    action: "Inspect downstream wiring / damaged cords.",
  },
  {
    code: "E033",
    sub: "01",
    type: "Instant Short",
    condition: "I > 8 × Inom in 10 μs",
    action: "Isolate dead short. Megger insulation. Do not force reset.",
  },
  {
    code: "E044",
    sub: "01",
    type: "RF Node Disconnect",
    condition: "Signal loss > 60 s",
    action: "Check exterior RF node, dome, PoE.",
  },
  {
    code: "E055",
    sub: "01",
    type: "Phase Swap Failed",
    condition: "Voltage during 20 ms dead-time",
    action: "PSR hardware fault — mainboard replacement.",
  },
  {
    code: "E066",
    sub: "01",
    type: "mTLS Cert Expired",
    condition: "Secure enclave time drift",
    action: "NTP sync + cert renewal.",
  },
  {
    code: "E099",
    sub: "01",
    type: "Kernel Panic",
    condition: "Watchdog timer reset",
    action: "Apply latest OTA firmware.",
  },
] as const;

export const POST_CHECKS = [
  { id: "rom", label: "MCU boot from secure ROM" },
  { id: "mem", label: "Memory integrity (POST RAM)" },
  { id: "tpu", label: "Edge TPU comms handshake" },
  { id: "adc", label: "ADS1256 50 kSPS path" },
  { id: "loto", label: "All LOTO shutters UP (active)" },
  { id: "mesh", label: "mTLS mesh / ATECC608A" },
] as const;
